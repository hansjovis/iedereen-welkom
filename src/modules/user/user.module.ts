import { Module } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { InMemoryUserRepository } from "./repositories/in-memory.user-repository.js";

@Module({
    providers: [
        UserService,
        {
            provide: "UserRepository",
            useClass: InMemoryUserRepository,
        }
    ]
})
export class UserModule {}