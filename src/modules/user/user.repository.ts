import { User } from "./domain/User";
import { EmailAddress } from "./domain/EmailAddress";

export interface UserRepository {
    save(user: User): void;
    retrieveByEmail(email: EmailAddress): User|undefined;
}