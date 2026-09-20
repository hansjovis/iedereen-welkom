import { User, EmailAddress, UserID } from "../domain/index.js";

export interface UserRepository {
    create(user: User): void;
    save(user: User): void;
    retrieveByEmail(email: EmailAddress): User|undefined;
    retrieveById(id: UserID): User|undefined;
    retrieveByUserName(userName: string): User | undefined;
}