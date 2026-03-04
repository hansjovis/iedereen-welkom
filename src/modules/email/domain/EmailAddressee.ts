import { EmailAddress } from "modules/user/domain";

export class EmailAddressee {
    constructor(
        public readonly name: string,
        public readonly address: EmailAddress,
    ) {}

    toString(): string {
        return `${this.name} <${this.address}>`
    }
}