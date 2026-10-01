import { Controller, Get, Inject, Logger, Query, Res, Session } from "@nestjs/common";
import { IsIn, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";
import { Response } from "express";

import { Unauthorized } from "../../exceptions/index.js";
import { Page } from "../../PageMeta.js";

import { UserService } from "../user/index.js";
import { PermissionSet } from "../user/domain/Permission.js";
import { AppID, AppRepository } from "../apps/index.js";
import { ScopeRepository } from "../scopes/index.js";

import { AuthenticationCodeService } from "./authentication-code.service.js";

class QueryParams {
    @IsIn(["code"])
    response_type: string;
    @IsUUID()
    client_id: string;
    @IsUrl({ require_tld: false })
    redirect_uri: string;
    @IsString()
    scope: string;
    @IsOptional()
    @IsString()
    state?: string;

    toJSON() {
        return {
            response_type: this.response_type,
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            scope: this.scope,
            state: this.state,
        }
    }
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
            session.redirect_to = `authorize?${new URLSearchParams(query.toJSON())}`;
            return response.redirect("login");
        }

        const scopes = await this.scopes.retrieveByIds(query.scope.split(" "));
        const permissions = PermissionSet.fromScopes(app.id, user.id, scopes);

        if (user.hasPermissionsSetFor(app.id, permissions)) {
            // User has already authorized the app to access the given claims, so we can redirect back to the client.
            const authorizationCode = this.authenticationCodeService.createFor(user.id);
            return response.redirect(`${query.redirect_uri}?code=${authorizationCode.secret}`);
        }

        // Show the authorization page to ask for permissions.
        response.render("authorize", {
            page,
            client: app.toJSON(),
            user: user.toJSON(),
            authorizations: (user.permissionsFor(app.id) ?? new Set()).union(permissions)
        })
    }
}