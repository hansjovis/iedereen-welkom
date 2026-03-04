import { UserRepository } from "modules/user/user.repository";
import { User, EmailAddress } from "modules/user/domain";
import { UUID } from "modules/user/domain/UUID";

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