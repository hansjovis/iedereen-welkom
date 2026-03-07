import { InMemoryUserRepository } from "./modules/user/in-memory.user-repository.js";
import { UserService } from "./modules/user/user.service.js";

export class Container {
    private readonly services: Map<string, unknown> = new Map();

    constructor() {
        const userRepository = new InMemoryUserRepository();
        const userService = new UserService(
            userRepository,
        );

        this.services.set("UserRepository", userRepository);
        this.services.set(UserService.name, userService);
    }

    get<T>(id: string): T | undefined {
        return this.services.get(id) as T;
    }
}