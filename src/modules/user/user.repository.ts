import { User } from "./domain/User";
import { EmailAddress } from "./domain/EmailAddress";
import { UUID } from "./domain/UUID";

export interface UserRepository {
    save(user: User): void;
    retrieveByEmail(email: EmailAddress): User|undefined;
    retrieveById(id: UUID): User|undefined;
}