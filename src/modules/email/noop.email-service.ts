import { Logger } from "@nestjs/common";

import { Email } from "./domain/Email.js";
import { EmailService } from "./email.service.js";

export class NoopEmailService implements EmailService {
    private readonly logger: Logger = new Logger("EmailService");
    async send(email: Email): Promise<void> {
        this.logger.log(`Sending email with subject "${email.subject}" to ${email.to}\nBody:\n${email.body}`)
    }
}