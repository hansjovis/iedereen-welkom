import { User, EmailAddress } from "./domain";

export class InMemoryUserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        this.users.set(user.email.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.get(email.toString());
    }
}