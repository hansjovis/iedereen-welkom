import { Injectable } from "@nestjs/common";
import { User, EmailAddress } from "../domain/index.js";
import { UserID } from "../domain/index.js";
import { UserRepository } from "./user.repository.js";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
    private readonly users: Map<string, User> = new Map();

    create(user: User): void {
        if (this.users.values().some(it => it.email === user.email)) {
            throw new Error(`Only one user with email ${user.email} allowed.`);
        }
        this.users.set(user.id.toString(), user);
    }

    save(user: User): void {
        if (this.users.has(user.id.toString()) === false) {
            throw new Error(`User with id ${user.id} does not exist.`);
        }
        this.users.set(user.id.toString(), user);
    }
    
    retrieveByEmail(email: EmailAddress): User | undefined {
        return this.users.values()
            .find(user => user.email.equals(email));
    }

    retrieveById(id: UserID): User | undefined {
        return this.users.get(id.toString());
    }

    retrieveByUserName(userName: string): User | undefined {
        return this.users.values()
            .find(user => user.userName === userName);
    }
}