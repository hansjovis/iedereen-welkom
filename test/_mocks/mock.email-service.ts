import { Email } from "../../dist/modules/email/domain/index.js";
import type { EmailService } from "../../dist/modules/email/email.service.js";

export class MockEmailService implements EmailService {
    public readonly emails: Email[] = [];

    async send(email: Email): Promise<void> {
        this.emails.push(email);
    }
}