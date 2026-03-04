import { EmailAddressee } from "./EmailAddressee";

export type Headers = {
    from: EmailAddressee,
    to: EmailAddressee | EmailAddressee[],
    cc?: EmailAddressee[],
    bcc?: EmailAddressee[],
};

export abstract class Email {
    constructor(
        private readonly headers: Headers,
    ) {}

    abstract get subject(): string;
    abstract get body(): string;

    toString(): string {
        const { from, to, cc, bcc } = this.headers;
        const headers = [
            `Subject: ${this.subject}`,
            `From: ${from.toString()}`,
            `To: ${Array.isArray(to) ? to.join(", ") : to}`,
        ];
        if (cc) {
            headers.push(`CC: ${cc.join(", ")}`);
        }
        if (bcc) {
            headers.push(`BCC: ${bcc.join(", ")}`);
        }

        return `${headers.join("\n")}\n\n${this.body}`;
    }
};