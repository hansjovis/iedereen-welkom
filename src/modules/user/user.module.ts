import { Inject, Module } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { InMemoryUserRepository } from "./repositories/in-memory.user-repository.js";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./repositories/user.repository.js";
import { User } from "./domain/User.js";
import { EmailAddress } from "./domain/EmailAddress.js";

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
    exports: [
        UserService,
        "UserRepository"
    ]
})
export class UserModule {
    constructor(
        @Inject("UserRepository") users: UserRepository
    ) {
        users.create(User.create(new EmailAddress("hc.braun@protonmail.com"), "hansjovis"));    
    }
}