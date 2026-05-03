import { verify } from "otplib";
import QRCode from "qrcode";

import { InvalidValue } from "../../../exceptions/InvalidValue.js";

import { CredentialsConfiguration, UnsafeCredentials } from "./Credentials.js";
import { Secret } from "./Secret.js";

export class InvalidTOTPCode extends InvalidValue {}

type ConfigProps = {
    issuer: string,
    accountName: string,
    secret: Secret,
}

export class TOTPConfiguration implements CredentialsConfiguration {
    forType = "totp";

    public readonly secret: Secret;
    private readonly accountName: string;
    private readonly issuer: string;

    constructor(props: ConfigProps) {
        this.secret = props.secret;
        this.accountName = props.accountName;
        this.issuer = props.issuer;
    }

    static create(props: ConfigProps) {
        return new TOTPConfiguration(props);
    }

    static generate(userName: string, issuer: string) {
        const secret = Secret.create();
        return new TOTPConfiguration({
            secret: secret,
            accountName: userName,
            issuer,
        });
    }

    async check(code: TOTPCode): Promise<boolean> {
        const result = await verify({
            token: code.value, 
            secret: this.secret.value,
        });
        return result.valid;
    }

    async toQRCode(): Promise<string> {
        return QRCode.toDataURL(this.toString());
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