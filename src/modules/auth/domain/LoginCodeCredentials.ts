import { verify, generate } from "otplib";

import { URI } from "../../../common/index.js";
import { IedereenWelkomNS } from "../../../namespaces.js";

import { Duration } from "./Duration.js";
import { ProtectedCredentials, UnsafeCredentials } from "./Credentials.js";

export class InvalidLoginCode extends Error {};

/**
 * Time-based one time password, to be used for sending by email or other means.
 * 
 * Use `TOTPCredentials` for TOTP using authenticators.
 */
export class LoginCodeConfiguration implements ProtectedCredentials {
    forType: URI = new URI(IedereenWelkomNS, "credentials/login-code");

    constructor(
        private readonly secret: string, 
        public readonly validDuration: Duration
    ) {}

    async check(credentials: LoginCode): Promise<boolean> {
        const result = await verify({
            token: credentials.value, 
            secret: this.secret,
            epochTolerance: this.validDuration.inSeconds,
        });
        return result.valid;
    }

    async generate(): Promise<LoginCode> {
        const code = await generate({ secret: this.secret });
        return new LoginCode(code);
    }
}

export class LoginCode implements UnsafeCredentials {
    type: URI = new URI(IedereenWelkomNS, "credentials/totp");
    constructor(public readonly value: string) {
        if (value.match(/\d{6}/) === null) {
            throw new InvalidLoginCode("Login code should consist of 6 numbers");
        }
    }
}