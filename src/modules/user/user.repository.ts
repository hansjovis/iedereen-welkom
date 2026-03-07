import { User, EmailAddress, UUID } from "./domain/index.js";

export interface UserRepository {
    save(user: User): void;
    retrieveByEmail(email: EmailAddress): User|undefined;
    retrieveById(id: UUID): User|undefined;
}