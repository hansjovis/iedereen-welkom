import { Email } from "./domain";

export interface EmailService {
    send(email: Email): Promise<void>;
};
