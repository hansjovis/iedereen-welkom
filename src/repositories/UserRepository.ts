import { User } from "actors/User";
import { EmailAddress } from "values/EmailAddress";

export interface UserRepository {
    save(user: User): void;
    retrieveByEmail(email: EmailAddress): User|undefined;
}