import { User, EmailAddress } from "./domain";
import { UUID } from "./domain/UUID";
import { UserRepository } from "./user.repository";

export class InMemoryUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        this.users.set(user.id.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.values()
            .find(user => user.email.equals(email));
    }

    retrieveById(id: UUID): User | undefined {
        return this.users.get(id.toString());
    }
}