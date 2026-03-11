import { Controller, Body, Post, Session, Get, Query, BadRequestException } from "@nestjs/common";

import { UserService, EmailAddress } from "../../modules/user/index.js";
import { EmailService } from "../../modules/email/email.service.js";

import { UnsafeCredentials, CredentialTypeMap } from "./domain/index.js";
import { LoginCodeMail } from "./emails/login-code.email.js";

type LoginRequestBody = {
    emailAddress: string,
    credentials: Record<string, string>,
}

type LoginCapabilitiesResponse = {
    emailAddress: string,
    activeCredentials: string[],
}

@Controller("/auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
    ) {}

    @Post("/login")
    async login(
        @Body() loginDetails: LoginRequestBody,
        @Session() session: Record<string, unknown>
    ) {
        const email = new EmailAddress(loginDetails.emailAddress);

        const credentials: UnsafeCredentials[] = [];
        for(const [type, value] of Object.entries(loginDetails.credentials)) {
            credentials.push(new CredentialTypeMap[type](value));
        }

        const user = await this.userService.login(email, credentials);
        session.userID = user.id;
    }

    @Get("/login")
    async loginCapabilities(
        @Query("user") emailAddress?: string
    ): Promise<LoginCapabilitiesResponse> {
        if (emailAddress === undefined) {
            throw new BadRequestException(`Expected user's email address as a request parameter ("?user=email").`);
        }
        const email = new EmailAddress(emailAddress);
        const user = await this.userService.retrieveByEmail(email);

        return {
            emailAddress: user.email.toString(),
            activeCredentials: user.credentials.map(it => it.forType),
        };
    }

    // @todo: rate limit this endpoint to once per 10 minutes.
    @Post("/send-login-code")
    async sendLoginCode(
        @Query("user") emailAddress?: string,
    ): Promise<void> {
        if (emailAddress === undefined) {
            throw new BadRequestException(`Expected user's email address as a request parameter ("?user=email").`);
        }
        const email = new EmailAddress(emailAddress);
        const user = await this.userService.retrieveByEmail(email);
        const loginCode = await user.generateLoginCode();

        this.emailService.send(new LoginCodeMail(user, loginCode));
    }
}