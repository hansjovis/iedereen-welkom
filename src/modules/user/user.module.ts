import { Module } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { InMemoryUserRepository } from "./repositories/in-memory.user-repository.js";
import { UserController } from "./user.controller.js";

@Module({
    controllers: [
        UserController,
    ],
    providers: [
        UserService,
        {
            provide: "UserRepository",
            useClass: InMemoryUserRepository,
        },
    ],
})
export class UserModule {}