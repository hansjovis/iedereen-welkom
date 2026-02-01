import { totp } from "otplib";

import { UserService } from "modules/user/user.service";
import { EmailAddress, InvalidEmailAddress, Registration } from "modules/user/domain";
import { PlainPassword, HashedPassword, UnsafePassword } from "authorization/PasswordCredentials";
import { InvalidTOTPCode, TOTPCode, TOTPConfiguration } from "authorization/TOTPCredentials";
import { NotFound } from "exceptions/NotFound";
import { Unauthorized } from "exceptions/Unauthorized";

// Test utils
import { MockUserRepository } from "./_mocks/mock.user-repository";
import { MockRegistrationRepository } from "./_mocks/mock.registration-repository";

describe("A user", () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService(
            new MockUserRepository(),
            new MockRegistrationRepository(),
        );
    });

    it("can register themselves", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const registration: Registration = userService.register(email, "hansjovis");
        expect(registration.email).toEqual(email);
    });

    it("cannot login when the user account hasn't been activated", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const login = () => userService.login(email, [new PlainPassword("some-password")]);
        expect(login).toThrow(Unauthorized);
    });

    it("can activate their account", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const registration = userService.register(email, "hansjovis");

        const user = userService.activate(registration.id, [HashedPassword.create("some-password")]);
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
        const registration = userService.register(email, "hansjovis");

        userService.activate(registration.id, [HashedPassword.create("some-password")]);

        const login = () => userService.login(email, [new PlainPassword("some-other-invalid-password")]);

        expect(login).toThrow(Unauthorized);
    });

    it("can login using valid credentials", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const registration = userService.register(email, "hansjovis");

        userService.activate(registration.id, [HashedPassword.create("some-password")]);

        const loggedIn = userService.login(email, [new PlainPassword("some-password")]);

        expect(loggedIn).toEqual(true);
    });

    it("can login using multiple valid credentials (2FA)", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const registration = userService.register(email, "hansjovis");

        const password = "some-password";
        const secret = "some-secret";

        userService.activate(
            registration.id, [
                HashedPassword.create(password),
                new TOTPConfiguration(secret),
            ]
        );

        const firstFactor = new PlainPassword(password);
        const secondFactor = new TOTPCode(totp.generate(secret));

        const loggedIn = userService.login(email, [firstFactor, secondFactor]);

        expect(loggedIn).toEqual(true);
    });

    it("cannot login using an invalid TOTP code", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const registration = userService.register(email, "hansjovis");

        const password = "some-password";
        const secret = "some-secret";

        userService.activate(
            registration.id, [
                HashedPassword.create(password),
                new TOTPConfiguration(secret),
            ]
        );

        const login = () => userService.login(email, [new PlainPassword(password), new TOTPCode("1234")]);

        expect(login).toThrow(InvalidTOTPCode);
    });
});
