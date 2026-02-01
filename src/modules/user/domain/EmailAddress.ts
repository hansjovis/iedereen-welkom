import { Equatable } from "common/Equatable";
import { InvalidValue } from "exceptions";

export class InvalidEmailAddress extends InvalidValue {
    constructor(emailAddress: string) {
        super(`"${emailAddress}" is an invalid email address.`);
    }
}

export class EmailAddress implements Equatable<EmailAddress> {
    static readonly regex: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    constructor(public readonly value: string) {
        if (value.match(EmailAddress.regex) === null) {
            throw new InvalidEmailAddress(value);
        }
    }

    equals(other: EmailAddress): boolean {
        return this.value === other.value;
    }

    toString() {
        return this.value;
    }
}