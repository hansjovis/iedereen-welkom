import { Email, EmailAddressee } from "../../../modules/email/domain/index.js";
import { LoginCode } from "../../../modules/auth/index.js";

import { EmailAddress, User } from "../domain/index.js";

const noReplyAddress = new EmailAddressee(
    "Iedereen Welkom", 
    new EmailAddress("no-reply@example.com")
);

export class ActivateAccountEmail extends Email {

    constructor(
        private readonly user: User,
        private readonly loginCode: LoginCode,
    ) {
        super({
            from: noReplyAddress,
            to: new EmailAddressee(user.userName, user.email),
        });
    }

    get subject(): string {
        return `Activeer je account`;
    }

    get body(): string {
        const url = `http://localhost/login/${this.loginCode}`;
        return `<p>Welkom ${this.user.userName},</p>
<p>
    <a href="${url}">Klik hier om je account te activeren.</a>
</p>`;
    }
}