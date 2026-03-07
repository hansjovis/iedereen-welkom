import { Email, EmailAddress } from "../../../modules/email/domain/index.js";
import { LoginCode } from "../../../modules/auth/index.js";

import { User } from "../domain/index.js";

const noReplyAddress = new EmailAddress(
    "Iedereen Welkom", 
    "no-reply@example.com",
);

export class ActivateAccountEmail extends Email {

    constructor(
        private readonly user: User,
        private readonly loginCode: LoginCode,
    ) {
        super({
            from: noReplyAddress,
            to: new EmailAddress(user.userName, user.email.value)
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