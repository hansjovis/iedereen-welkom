import { describe, it, beforeEach, before } from "node:test";
import { expect } from "expect";

import { generate } from "otplib";

import { UserService } from "../dist/modules/user/user.service.js";
import { EmailAddress, InvalidEmailAddress, User } from "../dist/modules/user/domain/index.js"
import { Password, PasswordConfiguration, UnsafePassword, InvalidTOTPCode, TOTPCode, TOTPConfiguration, Secret } from "../dist/modules/auth/index.js"
import { NotFound } from "../dist/exceptions/NotFound.js"
import { Unauthorized } from "../dist/exceptions/Unauthorized.js"

// Test utils
import { MockUserRepository } from "./_mocks/mock.user-repository.ts"

describe("A user", () => {
    let userService: UserService;
    let userRepository: MockUserRepository;

    before(() => {
        userRepository = new MockUserRepository();
        userService = new UserService(
            userRepository
        );
    });

    beforeEach(() => {
        userRepository.clear();
    });

    it("can register themselves", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register(email, "hansjovis");

        expect(user.email).toEqual(email);
    });

    it("cannot register two accounts under the same email address", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        userService.register(email, "hansjovis");
        expect(() => userService.register(email, "hansjovis")).toThrow();
    });

    it("can activate their account", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        userService.activate(user.id, [PasswordConfiguration.create("some-password")]);
        // One registered authentication methods: password.
        expect(user.auth.registered).toHaveLength(1);
        expect(user.auth.registered[0]).toEqual("password");
    });

    it("cannot activate their account when the user cannot be found", () => {
        const email = new EmailAddress("not-existing@hansjovis.net");
        const activate = () => userService.activate(email, [PasswordConfiguration.create("some-password")]);
        expect(activate).toThrow(NotFound);
    });

    it("cannot activate their account using an unsafe password", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const activate = () => userService.activate(email, [PasswordConfiguration.create("unsafe")]);
        expect(activate).toThrow(UnsafePassword);
    });

    it("cannot login when entering an email address for a non-existing account", () => {
        const email = new EmailAddress("not-existing@hansjovis.net");
        const login = () => userService.login(email, [new Password("some-password")]);
        expect(login).rejects.toThrow(NotFound);
    });

    it("cannot login using an invalid email address", () => {
        const login = () => userService.login(
            new EmailAddress("invalid-email-address"), 
            [new Password("some-password")]
        );
        expect(login).toThrow(InvalidEmailAddress);
    });

    it("cannot login when entering invalid credentials", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        userService.activate(user.id, [PasswordConfiguration.create("some-password")]);

        const login = () => userService.login(email, [new Password("some-other-invalid-password")]);

        expect(login).rejects.toThrow(Unauthorized);
    });

    it("can login using valid credentials", async () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        userService.activate(user.id, [PasswordConfiguration.create("some-password")]);

        const loggedInUser = await userService.login(email, [new Password("some-password")]);

        expect(loggedInUser).toEqual(user);
    });

    it("can login using multiple valid credentials (2FA)", async () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        const password = "some-password";
        const secret = "KRUGS4ZANFZSAYJAONSWG4TFOQQHG5DSNFXGO===";

        userService.activate(
            user.id, [
                PasswordConfiguration.create(password),
                new TOTPConfiguration({
                    accountName: user.email.toString(),
                    issuer: "Iedereen Welkom",
                    secret: new Secret(secret),
                }),
            ]
        );

        const firstFactor = new Password(password);
        const code = await generate({ secret });
        const secondFactor = new TOTPCode(code);

        const loggedInUser = await userService.login(email, [firstFactor, secondFactor]);

        expect(loggedInUser).toEqual(user);
    });

    it("cannot login using an invalid TOTP code", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        const password = "some-password";
        const secret = "KRUGS4ZANFZSAYJAONSWG4TFOQQHG5DSNFXGO===";

        userService.activate(
            user.id, [
                PasswordConfiguration.create(password),
                new TOTPConfiguration({
                    accountName: user.email.toString(),
                    issuer: "Iedereen Welkom",
                    secret: new Secret(secret),
                }),
            ]
        );

        const login = () => userService.login(email, [new Password(password), new TOTPCode("1234")]);

        expect(login).toThrow(InvalidTOTPCode);
    });
});
