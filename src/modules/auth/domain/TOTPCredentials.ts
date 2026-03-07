import { verify } from "otplib";

import { URI } from "../../../common/index.js";
import { IedereenWelkomNS } from "../../../namespaces.js";

import { ProtectedCredentials, UnsafeCredentials } from "./Credentials.js";

export class InvalidTOTPCode extends Error {}

export class InvalidTOTPSecret extends Error {}

function isBase32(input) {
    const regex = /^([A-Z2-7=]{8})+$/
    return regex.test(input)
}

export class TOTPConfiguration implements ProtectedCredentials {
    forType: URI = new URI(IedereenWelkomNS, "credentials/totp");

    constructor(private readonly secret: string) {
        if (isBase32(secret) === false) {
            throw new InvalidTOTPSecret("TOTP secret must be base32 encoded.");
        }
    }

    async check(code: TOTPCode): Promise<boolean> {
        const result = await verify({
            token: code.value, 
            secret: this.secret
        });
        return result.valid;
    }
}

export class TOTPCode implements UnsafeCredentials {
    type: URI = new URI(IedereenWelkomNS, "credentials/totp");
    constructor(public readonly value: string) {
        if (value.match(/\d{6}/) === null) {
            throw new InvalidTOTPCode("TOTP code should consist of 6 numbers");
        }
    }
}