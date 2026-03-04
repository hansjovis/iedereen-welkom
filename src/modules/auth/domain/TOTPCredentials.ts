import { verify } from "otplib";

import { URI } from "common";
import { ProtectedCredentials, UnsafeCredentials } from "./Credentials";
import { IedereenWelkomNS } from "namespaces";

export class InvalidTOTPCode extends Error {}

export class TOTPConfiguration implements ProtectedCredentials {
    forType: URI = new URI(IedereenWelkomNS, "credentials/totp");

    constructor(private readonly secret: string) {}

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