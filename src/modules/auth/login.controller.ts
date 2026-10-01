import { Controller, Body, Post, Session, Get, Query, Res } from "@nestjs/common";
import { Response as ExpressResponse } from "express";

import { NotFound } from "../../exceptions/index.js";
import { Page } from "../../PageMeta.js";

import { UserService, EmailAddress } from "../user/index.js";

import { parseEnteredCredentials } from "./domain/index.js";
import { IsEmail, IsOptional } from "class-validator";

class LoginQueryParams {
    @IsOptional()
    @IsEmail()
    email_address?: string;
}

type LoginRequestBody = {
    password?: string,
    totp?: string,
    login_code?: string,
}

const page: Page = {
    title: "Login",
    description: "Please login here!",
}

@Controller("/login")
export class LoginController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post("/")
    async login(
        @Res() response: ExpressResponse,
        @Query() query: LoginQueryParams, 
        @Body() body: LoginRequestBody,
        @Session() session: Record<string, unknown>
    ) {
        const email = new EmailAddress(query.email_address);
        const credentials = parseEnteredCredentials(body);

        const user = await this.userService.login(email, credentials);

        // User has successfuly logged in from this point onwards.
        session.userID = user.id.toString();

        if (user.authentication.registered.length === 1) {
            // User has less than two factors active, force them to add more login factors.
            session.redirect_to = session.redirect_to ?? "login";
            response.redirect("/configure");
            return;
        }

        response.redirect(session.redirect_to as string || `/users/${user.id}`);
    }

    @Get("/")
    async loginPage(
        @Res() response: ExpressResponse,
        @Query() query: LoginQueryParams,
        @Session() session: Record<string, unknown>,
    ) {
        let user = await this.userService.retrieveUserFromSession(session);

        if (user !== undefined) {
            // User has already logged in.
            return response.redirect(session.redirect_to as string ?? `/users/${user.id}`);
        }

        if (query.email_address === undefined) {
            return response.render("login", { page });
        }

        const email = new EmailAddress(query.email_address);
        user = await this.userService.retrieveByEmail(email);

        if (user === undefined)
            throw new NotFound(`User with email address ${email} could not be found.`);

        await this.userService.sendLoginCode(user);

        const details = {
            page,
            email_address: user.email.toJSON(),
            active_credentials: user.authentication.registered,
        };

        return response.render("login", details);
    }
}