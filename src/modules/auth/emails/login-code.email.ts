import { User } from "../../user/index.js";
import { Email, EmailAddress } from "../../email/domain/index.js";

import { LoginCode } from "../domain/LoginCodeCredentials.js";

const Sender = new EmailAddress("Iedereen Welkom - Authenticatie", "authenticatie@iedereen-welkom.nl");

export class LoginCodeMail extends Email {
    constructor(
        user: User,
        private readonly loginCode: LoginCode,
    ) {
        super({
            from: Sender,
            to: new EmailAddress(user.userName, user.email.toString())
        });
    }

    get subject(): string {
        return `Jouw logincode voor Iedereen Welkom`;
    }

    // @todo: Implement "report suspicious activity" feature.
    get body(): string {
        return `<p>Hieronder vind je de logincode voor Iedereen Welkom. Deze code is ${this.loginCode.validFor} geldig.</p>
<p style="font-weight: 400;">${this.loginCode}</p>`;
    }
}