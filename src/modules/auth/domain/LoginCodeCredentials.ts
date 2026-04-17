import { verify, generate } from "otplib";

import { Duration } from "./Duration.js";
import { CredentialsConfiguration, InputConfiguration, UnsafeCredentials } from "./Credentials.js";
import { Secret } from "./Secret.js";

export class InvalidLoginCode extends Error {};

/**
 * Time-based one time password, to be used for sending by email or other means.
 * 
 * Use `TOTPCredentials` for TOTP using authenticators.
 */
export class LoginCodeConfiguration implements CredentialsConfiguration {
    forType = "login-code";

    constructor(
        private readonly secret: Secret, 
        public readonly validFor: Duration
    ) {}

    static create(
        duration: Duration = Duration.parse("10 minutes")
    ): LoginCodeConfiguration {
        return new LoginCodeConfiguration(Secret.create(), duration);
    }

    async check(credentials: LoginCode): Promise<boolean> {
        const result = await verify({
            token: credentials.value, 
            secret: this.secret.value,
            epochTolerance: this.validFor.inSeconds,
        });
        return result.valid;
    }

    async generate(): Promise<LoginCode> {
        const code = await generate({ secret: this.secret.value });
        return new LoginCode(code, this.validFor);
    }

    inputConfiguration(): InputConfiguration {
        return {
            id: this.forType,
            label: "Login code",
            description: "We sent a login code to your email address, please enter it below.",
            type: "text",
            pattern: "\\d{6}"
        };
    }
}

export class LoginCode implements UnsafeCredentials {
    type = "login-code";
    constructor(
        public readonly value: string,
        public readonly validFor: Duration,
    ) {
        if (value.match(/\d{6}/) === null) {
            throw new InvalidLoginCode("Login code should consist of 6 numbers");
        }
    }

    toString() {
        return this.value;
    }
}