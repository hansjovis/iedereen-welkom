import { Injectable } from "@nestjs/common";
import { User, EmailAddress } from "../domain/index.js";
import { UUID } from "../domain/index.js";
import { UserRepository } from "./user.repository.js";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    save(user: User): void {
        if (this.users.values().some(it => it.email === user.email)) {
            throw new Error(`Only one user with email ${user.email} allowed.`);
        }
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