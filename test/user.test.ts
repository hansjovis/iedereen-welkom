import { totp } from "otplib";

import { UserService } from "modules/user/user.service";
import { EmailAddress, InvalidEmailAddress, User } from "modules/user/domain";
import { PlainPassword, HashedPassword, UnsafePassword, InvalidTOTPCode, TOTPCode, TOTPConfiguration, LoginCodeService } from "modules/auth";
import { NotFound } from "exceptions/NotFound";
import { Unauthorized } from "exceptions/Unauthorized";

// Test utils
import { MockUserRepository } from "./_mocks/mock.user-repository";
import { MockEmailService } from "./_mocks/mock.email-service";
import { ActivateAccountEmail } from "modules/user/emails/activate-account.email";
import { MockLoginCodeRepository } from "./_mocks/mock.login-code-repository";
import { NotActivated } from "exceptions";

describe("A user", () => {
    let userService: UserService;
    let userRepository: MockUserRepository;
    let loginCodeRepository: MockLoginCodeRepository;
    let emailService: MockEmailService;

    beforeAll(() => {
        emailService = new MockEmailService();
        userRepository = new MockUserRepository();
        loginCodeRepository = new MockLoginCodeRepository();
        userService = new UserService(
            userRepository,
            new LoginCodeService(
                loginCodeRepository,
            ),
            emailService,
        );
    });

    beforeEach(() => {
        userRepository.clear();
    });

    it("can register themselves", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user: User = userService.register(email, "hansjovis");

        expect(user.email).toEqual(email);

        const loginCode = loginCodeRepository.codes.find(code => code.forUser.equals(user.id));
        expect(loginCode).toBeDefined();

        const activationMail = emailService.emails.find(mail => mail instanceof ActivateAccountEmail);
        expect(activationMail).toBeDefined();
    });

    it("cannot login when the user account hasn't been activated", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");
        const login = () => userService.login(email, [new PlainPassword("some-password")]);

        expect(login).toThrow(NotActivated);
        
        const loginCode = loginCodeRepository.codes.find(code => code.forUser.equals(user.id));
        expect(loginCode).toBeDefined();

        const activationMail = emailService.emails.find(mail => mail instanceof ActivateAccountEmail);
        expect(activationMail).toBeDefined();
    });

    it("can activate their account", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        userService.activate(user.id, [HashedPassword.create("some-password")]);
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
        expect(login).toThrow(NotFound);
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
        const user = userService.register(email, "hansjovis");

        userService.activate(user.id, [HashedPassword.create("some-password")]);

        const login = () => userService.login(email, [new PlainPassword("some-other-invalid-password")]);

        expect(login).toThrow(Unauthorized);
    });

    it("can login using valid credentials", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        userService.activate(user.id, [HashedPassword.create("some-password")]);

        const loggedInUser = userService.login(email, [new PlainPassword("some-password")]);

        expect(loggedInUser).toEqual(user);
    });

    it("can login using multiple valid credentials (2FA)", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        const password = "some-password";
        const secret = "some-secret";

        userService.activate(
            user.id, [
                HashedPassword.create(password),
                new TOTPConfiguration(secret),
            ]
        );

        const firstFactor = new PlainPassword(password);
        const secondFactor = new TOTPCode(totp.generate(secret));

        const loggedInUser = userService.login(email, [firstFactor, secondFactor]);

        expect(loggedInUser).toEqual(user);
    });

    it("cannot login using an invalid TOTP code", () => {
        const email = new EmailAddress("hans-christiaan@hansjovis.net");
        const user = userService.register(email, "hansjovis");

        const password = "some-password";
        const secret = "some-secret";

        userService.activate(
            user.id, [
                HashedPassword.create(password),
                new TOTPConfiguration(secret),
            ]
        );

        const login = () => userService.login(email, [new PlainPassword(password), new TOTPCode("1234")]);

        expect(login).toThrow(InvalidTOTPCode);
    });
});
