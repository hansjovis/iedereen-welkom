import crypto from "node:crypto";

function toBase32(bytes: Buffer): string {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const padding = "=";
    // From bytes to a Base32-encoded string
    let value = "";
    for (const byte of bytes.values()) {
        value += alphabet[byte % 32];
    }
    // Make sure that the string has a length that's a multiple of 8 by adding padding to the end if needed.
    const l = Math.ceil(bytes.length / 8);
    return value.padEnd(l * 8, padding);
}

export class InvalidSecret extends Error {}

export class Secret {
    static readonly regex = /^([A-Z2-7=]{8})+$/;

    constructor(
        public readonly value: string,
    ) {
        console.log(value.length);
        if (value.match(Secret.regex) === null) {
            throw new InvalidSecret("Secret must be base32 encoded.")
        }
    }

    static create(length: number = 64): Secret {
        const randomBytes = crypto.randomBytes(length);
        return new Secret(toBase32(randomBytes));
    }

    toString(): string {
        return this.value;
    }
}