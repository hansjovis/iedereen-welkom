import { User, EmailAddress, UUID } from "../domain/index.js";

export interface UserRepository {
    create(user: User): void;
    save(user: User): void;
    retrieveByEmail(email: EmailAddress): User|undefined;
    retrieveById(id: UUID): User|undefined;
    retrieveByUserName(userName: string): User | undefined;
}