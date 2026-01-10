
export class InvalidEmailAddress extends Error {
    constructor(emailAddress: string) {
        super(`"${emailAddress}" is an invalid email address.`);
    }
}

export class EmailAddress {
    static readonly regex: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    constructor(public readonly emailAddress: string) {
        if (emailAddress.match(EmailAddress.regex) === null) {
            throw new InvalidEmailAddress(emailAddress);
        }
    }

    toString() {
        return this.emailAddress;
    }
}