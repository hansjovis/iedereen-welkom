import { EmailAddress } from "./EmailAddress.js";

export type Headers = {
    from: EmailAddress,
    to: EmailAddress | EmailAddress[],
    cc?: EmailAddress[],
    bcc?: EmailAddress[],
};

export abstract class Email {
    public readonly from: EmailAddress;
    public readonly to: EmailAddress[];
    public readonly cc: EmailAddress[] = [];
    public readonly bcc: EmailAddress[] = [];

    constructor(headers: Headers) {
        this.from = headers.from;
        this.to = Array.isArray(headers.to) ? headers.to : [headers.to];
        if (headers.cc) {
            this.cc = headers.cc;
        }
        if (headers.bcc) {
            this.bcc = headers.bcc;
        }
    }

    abstract get subject(): string;
    abstract get body(): string;

    toString(): string {
        const headers = [
            `Subject: ${this.subject}`,
            `From: ${this.from}`,
            `To: ${this.to}`,
        ];
        if (this.cc) {
            headers.push(`CC: ${this.cc.join(", ")}`);
        }
        if (this.bcc) {
            headers.push(`BCC: ${this.bcc.join(", ")}`);
        }

        return `${headers.join("\n")}\n\n${this.body}`;
    }
};