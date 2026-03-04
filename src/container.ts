import { EmailService } from "modules/email/email.service";
import { InMemoryRegistrationRepository } from "modules/user/in-memory.registration-repository";
import { InMemoryUserRepository } from "modules/user/in-memory.user-repository";
import { UserService } from "modules/user/user.service";

export class Container {
    private readonly services: Map<string, unknown> = new Map();

    constructor() {
        const userRepository = new InMemoryUserRepository();
        const registrationRepository = new InMemoryRegistrationRepository();
        const emailService: EmailService = {
            send: async () => {},
        }
        const userService = new UserService(
            userRepository,
            registrationRepository,
            emailService,
        );

        this.services.set("UserService", userService);
    }

    get<T>(id: string): T | undefined {
        return this.services.get(id) as T;
    }
}