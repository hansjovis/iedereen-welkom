import { User } from "actors/User";
import { Unauthorized } from "exceptions/Unauthorized";
import { UserRepository } from "repositories/UserRepository";
import { UserService } from "services/UserService";
import { EmailAddress } from "values/EmailAddress";
import { PlainPassword, HashedPassword } from "authorization/PasswordCredentials";
import { TOTPCode, TOTPConfiguration } from "authorization/TOTPCredentials";
import { totp } from "otplib";

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
    });

    it("cannot login when the user account hasn't been activated", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register({
            userName: "hansjovis",
            email,
        });

        expect(user.isActivated).toBe(false);

        const login = () => userService.login(email, [new HashedPassword("some-random-string")]);

        expect(login).toThrow(Unauthorized);
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

        const secret = "some-secret";

        user.activate([
            HashedPassword.create("some-password"),
            new TOTPConfiguration(secret),
        ]);

        const firstFactor = new PlainPassword("some-password");
        const secondFactor = new TOTPCode(totp.generate(secret));

        const loggedIn = userService.login(email, [firstFactor, secondFactor]);

        expect(loggedIn).toEqual(true);
    });
});
