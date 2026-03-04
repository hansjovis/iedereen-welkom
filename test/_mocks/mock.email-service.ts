import { Email } from "../../src/modules/email/domain";
import { EmailService } from "../../src/modules/email/email.service";

export class MockEmailService implements EmailService {
    public readonly emails: Email[] = [];

    async send(email: Email): Promise<void> {
        this.emails.push(email);
    }
}