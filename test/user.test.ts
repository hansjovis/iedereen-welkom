import { User } from "actors/User";
import { Unauthorized } from "exceptions/Unauthorized";
import { UserRepository } from "repositories/UserRepository";
import { UserService } from "services/UserService";
import { EmailAddress, InvalidEmailAddress } from "values/EmailAddress";
import { PlainPassword, HashedPassword, UnsafePassword } from "authorization/PasswordCredentials";
import { InvalidTOTPCode, TOTPCode, TOTPConfiguration } from "authorization/TOTPCredentials";
import { totp } from "otplib";
import { NotFound } from "exceptions/NotFound";

class MockUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        this.users.set(user.email.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.get(email.toString());
    }
}

describe("A user", () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService(new MockUserRepository());
    });

    it("can register themselves", () => {
        const user: User = userService.register({
            userName: "hansjovis",
            email: new EmailAddress("hans-christiaan@hansjovis.net"),
        });

        expect(user.userName).toEqual("hansjovis");

        expect(user.outbox.items).toHaveLength(0);
        expect(user.inbox.items).toHaveLength(0);

        expect(user.isActivated).toBe(false);

        expect(user.serialize()).toEqual({
            "@context": "https://www.w3.org/ns/activitystreams#",
            "@id": "https://example.net/users/hansjovis",
            "@type": [
                "https://www.w3.org/ns/activitystreams#Actor",
                "https://iedereen-welkom.nl/ns/User"
            ],
            name: "hansjovis",
            summary: "Hello, my name is hansjovis!",
            icon: [],
            inbox: "https://example.net/users/hansjovis/inbox",
            outbox: "https://example.net/users/hansjovis/outbox"
        });
    });

    it("cannot login when the user account hasn't been activated", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        expect(user.isActivated).toBe(false);

        const login = () => userService.login(email, [new PlainPassword("some-password")]);

        expect(login).toThrow(Unauthorized);
    });

    it("can activate their account", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        expect(user.isActivated).toBe(false);
        userService.activate(email, [HashedPassword.create("some-password")]);
        expect(user.isActivated).toBe(true);
    });

    it("cannot activate their account when the user cannot be found", () => {
        const email = new EmailAddress("not-existing@hansjovis.net");
        const activate = () => userService.activate(email, [HashedPassword.create("some-password")]);
        expect(activate).toThrow(NotFound);
    });

    it("cannot activate their account using an unsafe password", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const activate = () => userService.activate(email, [HashedPassword.create("unsafe")]);
        expect(activate).toThrow(UnsafePassword);
    });

    it("cannot login when entering an email address for a non-existing account", () => {
        const email = new EmailAddress("not-existing@hansjovis.net");
        const login = () => userService.login(email, [new PlainPassword("some-password")]);
        expect(login).toThrow(Unauthorized);
    });

    it("cannot login using an invalid email address", () => {
        const login = () => userService.login(
            new EmailAddress("invalid-email-address"), 
            [new PlainPassword("some-password")]
        );
        expect(login).toThrow(InvalidEmailAddress);
    });

    it("cannot login when entering invalid credentials", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        user.activate([HashedPassword.create("some-password")]);

        const login = () => userService.login(email, [new PlainPassword("some-other-invalid-password")]);

        expect(login).toThrow(Unauthorized);
    });

    it("can login using valid credentials", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        user.activate([HashedPassword.create("some-password")]);

        const loggedIn = userService.login(email, [new PlainPassword("some-password")]);

        expect(loggedIn).toEqual(true);
    });

    it("can login using multiple valid credentials (2FA)", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        const password = "some-password";
        const secret = "some-secret";

        user.activate([
            HashedPassword.create(password),
            new TOTPConfiguration(secret),
        ]);

        const firstFactor = new PlainPassword(password);
        const secondFactor = new TOTPCode(totp.generate(secret));

        const loggedIn = userService.login(email, [firstFactor, secondFactor]);

        expect(loggedIn).toEqual(true);
    });

    it("cannot login using an invalid TOTP code", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        const password = "some-password";
        const secret = "some-secret";

        user.activate([
            HashedPassword.create(password),
            new TOTPConfiguration(secret),
        ]);

        const login = () => userService.login(email, [new PlainPassword(password), new TOTPCode("1234")]);

        expect(login).toThrow(InvalidTOTPCode);
    });
});
