import { verify } from "otplib";

import { ProtectedCredentials, UnsafeCredentials } from "./Credentials.js";

export class InvalidTOTPCode extends Error {}

export class InvalidTOTPSecret extends Error {}

export class TOTPSecret {
    static readonly regex = /^([A-Z2-7=]{8})+$/;

    constructor(
        private readonly value: string,
    ) {
        if (value.match(TOTPSecret.regex) === null) {
            throw new InvalidTOTPSecret("TOTP secret must be base32 encoded.")
        }
    }

    get secret() {
        return this.value;
    }

    toJSON() {
        return { value: "********" };
    }

    toString() {
        return "********";
    }
}

export class TOTPConfiguration implements ProtectedCredentials {
    forType = "totp";
    private readonly secret: TOTPSecret;

    constructor(secret: string) {
        this.secret = new TOTPSecret(secret);
    }

    async check(code: TOTPCode): Promise<boolean> {
        const result = await verify({
            token: code.value, 
            secret: this.secret.secret,
        });
        return result.valid;
    }
}

export class TOTPCode implements UnsafeCredentials {
    type = "totp";
    constructor(public readonly value: string) {
        if (value.match(/\d{6}/) === null) {
            throw new InvalidTOTPCode("TOTP code should consist of 6 numbers");
        }
    }
}