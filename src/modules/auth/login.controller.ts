import { Controller, Body, Post, Session, Get, Query, Inject, Res, Render } from "@nestjs/common";
import { Response as ExpressResponse } from "express";

import { HTTPStatus } from "../../common/HTTPStatus.js";
import { NotFound } from "../../exceptions/index.js";

import { UserService, EmailAddress, User } from "../user/index.js";
import { EmailService } from "../email/email.service.js";

import { UnsafeCredentials, CredentialTypeMap, LoginCodeConfiguration, InputConfiguration } from "./domain/index.js";
import { LoginCodeMail } from "./emails/login-code.email.js";

type LoginRequestBody = {
    emailAddress: string,
    [credentialType: string]: string,
}

type LoginCapabilitiesResponse = {
    emailAddress?: string,
    activeCredentials?: InputConfiguration[],
}

@Controller("/auth/login")
export class LoginController {
    constructor(
        private readonly userService: UserService,
        @Inject("EmailService") private readonly emailService: EmailService,
    ) {}

    @Post("/")
    async login(
        @Res() response: ExpressResponse,
        @Body() loginDetails: LoginRequestBody,
        @Session() session: Record<string, unknown>
    ) {
        const email = new EmailAddress(loginDetails.emailAddress);

        const credentials: UnsafeCredentials[] = [];
        for(const [type, value] of Object.entries(loginDetails)) {
            if (type === "emailAddress") continue;
            credentials.push(new CredentialTypeMap[type](value));
        }

        const user = await this.userService.login(email, credentials);
        session.userID = user.id.toString();

        if (user.auth.registered.length === 1) {
            // User has less than two factors active, force them to add more login factors.
            response.redirect(HTTPStatus.SeeOther.code, "/auth/configure");
        }
        response.redirect(HTTPStatus.SeeOther.code, `/users/${encodeURIComponent(user.userName)}`);
    }

    @Get("/")
    @Render("login")
    async loginCapabilities(
        @Query("emailAddress") emailAddress?: string,
    ): Promise<LoginCapabilitiesResponse> {
        if (emailAddress === undefined) {
            return {};
        }
        const email = new EmailAddress(emailAddress);
        const user = await this.userService.retrieveByEmail(email);

        if (user === undefined) {
            throw new NotFound(`User with email address ${email} could not be found.`);
        }

        await this.sendLoginCode(user);

        return {
            emailAddress: user.email.toString(),
            activeCredentials: user.auth.registered,
        };
    }

    // @todo: rate limit sending a login code to once per 10 minutes.
    async sendLoginCode(
        user: User,
    ): Promise<void> {
        const loginCodeConfig = user.auth.get("login-code") as LoginCodeConfiguration;
        if (loginCodeConfig === undefined) {
            return;
        }

        const loginCode = await loginCodeConfig.generate();
        this.emailService.send(new LoginCodeMail(user, loginCode));
    }
}