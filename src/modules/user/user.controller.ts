import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { EmailAddress } from "./domain/EmailAddress.js";

type CreateUserRequestBody = {
    email: string,
    userName: string,
}

@Controller("/users")
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post("/")
    register(
        @Body() body: CreateUserRequestBody,
    ): void {
        const emailAddress = new EmailAddress(body.email);
        this.userService.register(emailAddress, body.userName);
    }
}