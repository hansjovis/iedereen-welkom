import { Email } from "./domain/index.js";

export interface EmailService {
    send(email: Email): Promise<void>;
};
