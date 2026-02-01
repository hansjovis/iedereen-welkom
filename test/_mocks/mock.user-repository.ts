import { UserRepository } from "modules/user/user.repository";
import { User, EmailAddress } from "modules/user/domain";

export class MockUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        this.users.set(user.email.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.get(email.toString());
    }
}