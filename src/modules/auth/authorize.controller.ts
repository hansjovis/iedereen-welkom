/* eslint-disable max-statements */
import { Controller, Get, Inject, Logger, Query, Res, Session } from "@nestjs/common";
import { Response } from "express";

import { Unauthorized } from "../../exceptions/index.js";
import { Page } from "../../PageMeta.js";
import { union } from "../../common/set.js";

import { UserService } from "../user/index.js";
import { Authorization } from "../user/domain/Authorization.js";
import { AppID, AppRepository } from "../apps/index.js";
import { ScopeRepository } from "../scopes/index.js";

import { AuthenticationCodeService } from "./authentication-code.service.js";

type QueryParams = {
    response_type: string,
    client_id: string,
    redirect_uri: string,
    scope: string,
    state: string,
}

const page: Page = {
    title: "Authorize",
    description: "App requires access to some of your information.",
}

@Controller("/authorize")
export class AuthorizeController {
    private readonly logger = new Logger(AuthorizeController.name);

    constructor(
        @Inject("AppRepository") private readonly apps: AppRepository,
        @Inject("ScopeRepository") private readonly scopes: ScopeRepository,
        private readonly userService: UserService,
        private readonly authenticationCodeService: AuthenticationCodeService,
    ) {}

    @Get("/")
    async authorize(
        @Query() query: QueryParams,
        @Session() session: Record<string, unknown>,
        @Res() response: Response,
    ) {
        const user = await this.userService.retrieveUserFromSession(session);
        const app = await this.apps.retrieveById(new AppID(query.client_id));

        if (app.isValidRedirectUri(new URL(query.redirect_uri)) === false)
            throw new Unauthorized(`${query.redirect_uri} is an invalid redirect URI.`);

        if (user === undefined) {
            // User hasn't logged in. Redirect to login page.
            session.redirect_to = `authorize?${new URLSearchParams(query)}`;
            return response.redirect("login");
        }

        const scopes = await this.scopes.retrieveByIds(query.scope.split(" "));
        const authorizations = scopes.flatMap(scope => scope.claims)
            .map(claim => new Authorization(app.id, user.id, claim));

        this.logger.log(
            `Checking if user ${user.userName} has set permissions for ${app.name} to access claims [${authorizations.map(it => it.claim.name).join(", ")}].`
        );

        if (user.hasAuthorizationsSetFor(app.id, authorizations)) {
            // User has already authorized the app to access the given claims, so we can redirect back to the client.
            const authorizationCode = this.authenticationCodeService.createFor(user.id);
            return response.redirect(`${query.redirect_uri}?code=${authorizationCode.secret}`);
        }

        // Show the authorization page to ask for permissions.
        const renderParams = {
            page,
            client: app.toJSON(),
            authorizations: union(
                user.authorizationsSetFor(app.id),
                authorizations,
            )
        }
        response.render("authorize", renderParams)
    }
}