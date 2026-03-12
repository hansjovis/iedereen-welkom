import { verify } from "otplib";

import { CredentialsConfiguration, UnsafeCredentials } from "./Credentials.js";

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
}

type ConfigProps = {
    issuer: string,
    accountName: string,
    secret: string,
}

export class TOTPConfiguration implements CredentialsConfiguration {
    forType = "totp";

    private readonly secret: TOTPSecret;
    private readonly accountName: string;
    private readonly issuer: string;

    constructor(props: ConfigProps) {
        this.secret = new TOTPSecret(props.secret);
        this.accountName = props.accountName;
        this.issuer = props.issuer;
    }

    async check(code: TOTPCode): Promise<boolean> {
        const result = await verify({
            token: code.value, 
            secret: this.secret.secret,
        });
        return result.valid;
    }

    toString() {
        const issuer = encodeURIComponent(this.issuer);
        const accountName = encodeURIComponent(this.accountName);
        return `otpauth://totp/${issuer}:${accountName}?secret=${this.secret}&issuer=${issuer}`;
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