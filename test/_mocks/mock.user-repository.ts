import type { UserRepository } from "../../dist/modules/user/repositories/user.repository.js";
import { User, EmailAddress } from "../../dist/modules/user/domain/index.js";
import { UserID } from "../../dist/modules/user/domain/index.js";

export class MockUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        if (this.users.has(user.id.toString()) === false) {
            throw new Error(`User with id ${user.id} could not be found.`);
        }
        this.users.set(user.id.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return [...this.users.values()].find(user => user.email.equals(email));
    }

    retrieveById(id: UserID): User | undefined {
        return this.users.get(id.toString());
    }

    clear(): void {
        this.users.clear();
    }

    create(user: User): void {
        if ([...this.users.values()].some(it => it.email === user.email)) {
            throw new Error(`Only one user with email ${user.email} allowed.`);
        }
        this.users.set(user.id.toString(), user);
    }

    retrieveByUserName(userName: string) {
        return [...this.users.values()]
            .find(user => user.userName === userName);
    }
}