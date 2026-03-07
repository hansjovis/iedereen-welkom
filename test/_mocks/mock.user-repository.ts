import type { UserRepository } from "../../dist/modules/user/user.repository.js";
import { User, EmailAddress } from "../../dist/modules/user/domain/index.js";
import { UUID } from "../../dist/modules/user/domain/UUID.js";

export class MockUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        this.users.set(user.id.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.values().find(user => user.email.equals(email));
    }

    retrieveById(id: UUID): User | undefined {
        return this.users.get(id.toString());
    }

    clear(): void {
        this.users.clear();
    }
}