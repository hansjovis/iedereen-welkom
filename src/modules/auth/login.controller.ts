/* eslint-disable max-statements */
import { Controller, Body, Post, Session, Get, Query, Inject, Res, Render } from "@nestjs/common";
import { Response as ExpressResponse } from "express";

import { HTTPStatus } from "../../common/HTTPStatus.js";
import { NotFound, BadRequest } from "../../exceptions/index.js";
import { Page, PageMeta } from "../../PageMeta.js";

import { UserService, EmailAddress } from "../user/index.js";
import { AppRepository, App, AppID } from "../apps/index.js";

import { AuthenticationCodeService } from "./authentication-code.service.js";
import { parseEnteredCredentials } from "./domain/index.js";

type LoginCapabilitiesResponse = {
    client?: unknown,
    email_address?: string,
    active_credentials?: string[],
};

type LoginQueryParams = {
    email_address?: string,
    response_type?: string,
    client_id?: string,
    redirect_uri?: string,
    scope?: string,
    state?: string,
}

type LoginRequestBody = LoginQueryParams & {
    password?: string,
    totp?: string,
    login_code?: string,
}

const page: Page = {
    title: "Login",
    description: "Please login here!",
}

@Controller("/auth/login")
export class LoginController {
    constructor(
        private readonly userService: UserService,
        private readonly authenticationCodeService: AuthenticationCodeService,
        @Inject("AppRepository") private readonly apps: AppRepository,
    ) {}

    @Post("/")
    async login(
        @Res() response: ExpressResponse,
        @Body() loginDetails: LoginRequestBody,
        @Session() session: Record<string, unknown>
    ) {
        const email = new EmailAddress(loginDetails.email_address);
        const credentials = parseEnteredCredentials(loginDetails);

        const user = await this.userService.login(email, credentials);

        // User has successfuly logged in from this point onwards.
        session.userID = user.id.toString();

        if (user.auth.registered.length === 1) {
            // User has less than two factors active, force them to add more login factors.
            session.redirectUri = this.createRedirectUri(loginDetails);
            response.redirect(HTTPStatus.SeeOther.code, `/auth/configure`);
            return;
        }

        const authenticationCode = this.authenticationCodeService.create(user.id);
        const redirectUri = new URL(loginDetails.redirect_uri);
        const params = new URLSearchParams({ code: authenticationCode.toJSON() });

        response.redirect(HTTPStatus.SeeOther.code, `${redirectUri}?${params}`);
    }

    private createRedirectUri(loginDetails: LoginQueryParams) {
        const { email_address, client_id, response_type, redirect_uri, scope, state } = loginDetails;
        const params = new URLSearchParams({ email_address, client_id, response_type, redirect_uri, scope, state });
        const redirectUri = `/auth/login?${params}`;
        return redirectUri;
    }

    @Get("/")
    @Render("login")
    @PageMeta(page)
    async loginCapabilities(
        @Res() response: ExpressResponse,
        @Query() query: LoginQueryParams,
        @Session() session: Record<string, unknown>,
    ): Promise<LoginCapabilitiesResponse> {
        this.validateLoginQuery(query);

        let user = await this.userService.retrieveUserFromSession(session);

        const app = this.retrieveApp(
            new AppID(query.client_id),
            new URL(query.redirect_uri),
        );

        if (user !== undefined) {
            // User has already logged in, redirect to client app with authorization code.
            const authenticationCode = this.authenticationCodeService.create(user.id);
            const redirectUri = new URL(query.redirect_uri);
            const params = new URLSearchParams({ code: authenticationCode.toJSON() });

            response.redirect(HTTPStatus.SeeOther.code, `${redirectUri}?${params}`);
            return;
        }

        if (query.email_address === undefined)
            return { client: app.toJSON() };

        const email = new EmailAddress(query.email_address);
        user = await this.userService.retrieveByEmail(email);

        if (user === undefined)
            throw new NotFound(`User with email address ${email} could not be found.`);

        await this.userService.sendLoginCode(user);

        return {
            client: app.toJSON(),
            email_address: user.email.toJSON(),
            active_credentials: user.auth.registered,
        };
    }

    private validateLoginQuery(query: LoginQueryParams): void {
        if (query.client_id === undefined) 
            throw new BadRequest("Missing client ID.");
        if (query.response_type === undefined)
            throw new BadRequest("Missing response type.");
        if (query.response_type !== "code") 
            throw new BadRequest("Only supported response type is \"code\"");
        if (query.redirect_uri === undefined || URL.canParse(query.redirect_uri) === false)
            throw new BadRequest("Missing or invalid redirect URI.");
    }

    private retrieveApp(appId: AppID, redirectUri: URL): App {
        const app = this.apps.retrieveById(appId);

        if (app === undefined)
            throw new NotFound(`No client found with ID ${appId}.`);

        if (app.redirectUri.toJSON() !== redirectUri.toJSON()) 
            throw new BadRequest(`Invalid redirect URI ${redirectUri}.`);

        return app;
    }
}