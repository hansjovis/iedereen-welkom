import { InvalidValue } from "exceptions/InvalidValue.js";

export class InvalidEmailAddress extends InvalidValue {
    constructor(emailAddress: string) {
        super(`"${emailAddress}" is an invalid email address.`);
    }
}

export class EmailAddress {
    static readonly regex: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    constructor(
        public readonly name: string,
        public readonly address: string,
    ) {
        if (address.match(EmailAddress.regex) === null) {
            throw new InvalidEmailAddress(address);
        }
    }

    toString(): string {
        return `${this.name} <${this.address}>`
    }
}