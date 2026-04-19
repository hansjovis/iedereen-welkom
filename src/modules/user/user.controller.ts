import { Body, Controller, Get, Logger, Param, Post, Render, Session } from "@nestjs/common";
import { Unauthorized } from "../../exceptions/Unauthorized.js";
import { UserService } from "./user.service.js";
import { EmailAddress } from "./domain/EmailAddress.js";

type CreateUserRequestBody = {
    email: string,
    userName: string,
}

@Controller("/users")
export class UserController {
    private readonly logger = new Logger(UserController.name);

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

    @Get("/:userName")
    @Render("user")
    async retrieve(
        @Param("userName") userName: string,
        @Session() session: Record<string, unknown>,
    ) {
        const currentUser = await this.userService.retrieveUserFromSession(session);
        if (currentUser.userName !== userName) {
            throw new Unauthorized("You are not authorized to view this person's user page.");
        }

        return {
            userName: currentUser.userName,
        };
    }
}