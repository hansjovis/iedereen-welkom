import { Body, Controller, Get, Inject, Logger, Post, Query, Res, Session } from "@nestjs/common";
import { IsIn, IsObject, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";
import { Response } from "express";

import { BadRequest, NotFound, Unauthorized } from "../../../exceptions/index.js";
import { Page } from "../../../PageMeta.js";

import { UserService } from "../../user/index.js";
import { Permission, PermissionSet, toPermissionStatus } from "../../user/domain/Permission.js";
import { AppID, AppRepository } from "../../apps/index.js";
import { ScopeRepository } from "../../scopes/index.js";

import { AuthenticationCodeService } from "../services/authentication-code.service.js";

export class QueryParams {
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

export class RequestBody {
    @IsUUID()
    client_id: string;
    @IsUrl({ require_tld: false })
    redirect_uri: string;
    @IsObject()
    permissions: Record<string, "Allowed" | "Denied">;
}

const page: Page = {
    title: "Authorize",
    description: "App requires access to some of your information.",
}

@Controller("/authorize")
export class AuthorizeController {
    private readonly logger = new Logger(AuthorizeController.name);

    // eslint-disable-next-line max-params -- Maybe refactor to use less params.
    constructor(
        @Inject("AppRepository") private readonly apps: AppRepository,
        @Inject("ScopeRepository") private readonly scopes: ScopeRepository,
        private readonly userService: UserService,
        private readonly authenticationCodeService: AuthenticationCodeService,
    ) {}

    @Get("/")
    async authorizePage(
        @Query() query: QueryParams,
        @Session() session: Record<string, unknown>,
        @Res() response: Response,
    ) {
        const user = await this.userService.retrieveUserFromSession(session);
        const app = await this.apps.retrieveById(new AppID(query.client_id));

        if (app.isValidRedirectUri(new URL(query.redirect_uri)) === false)
            throw new BadRequest(`${query.redirect_uri} is an invalid redirect URI.`);

        if (user === undefined) {
            // User isn't logged in. Save current request and redirect to login page.
            session.redirect_to = `authorize?${new URLSearchParams(query.toJSON())}`;
            return response.redirect("login");
        }

        const requestedPermissions = app.requestedPermissionsFor(query.scope.split(" "));

        if (requestedPermissions.size === 0)
            throw new BadRequest(`Could not authorize permissions for scopes ${query.scope.split(" ")}.`);

        if (user.hasPermissionsSetFor(app.id, requestedPermissions)) {
            // User has already permitted the app to access the asked-for claims, so we can redirect back to the client.
            const authorizationCode = this.authenticationCodeService.createFor(user.id);
            return response.redirect(`${query.redirect_uri}?code=${authorizationCode.secret}`);
        }

        // Show the authorization page to ask for permissions.
        response.render("authorize", {
            page,
            client: app.toJSON(),
            redirect_uri: query.redirect_uri,
            user: user.toJSON(),
            requestedPermissions,
        });
    }

    @Post("/")
    async authorize(
        @Body() body: RequestBody,
        @Session() session: Record<string, unknown>,
        @Res() response: Response,
    ) {
        const user = await this.userService.retrieveUserFromSession(session);

        if (user === undefined)
            throw new Unauthorized();

        const app = await this.apps.retrieveById(new AppID(body.client_id));
        if (app === undefined)
            throw new NotFound(`App with ID ${body.client_id} could not be found.`);

        if (app.isValidRedirectUri(new URL(body.redirect_uri)) === false)
            throw new BadRequest(`${body.redirect_uri} is an invalid redirect URI.`);

        const permissionSet = await this.parsePermissions(body.permissions);
        if (app.scopes.isSupersetOf(permissionSet.scopes) === false)
            throw new BadRequest(`Could not set permissions for app ${app.name}.`);

        user.setPermissions(app.id, permissionSet);

        const authorizationCode = this.authenticationCodeService.createFor(user.id);
        return response.redirect(`${body.redirect_uri}?code=${authorizationCode.secret}`);
    }

    private async parsePermissions(
        permissionMap: { [scopeId: string]: ("Allowed" | "Denied") }
    ): Promise<PermissionSet> {
        const permissions: Set<Permission> = new Set();

        for(const [scopeId, statusString] of Object.entries(permissionMap)) {
            const scope = await this.scopes.retrieveById(scopeId);
            if (scope === undefined)
                continue;
            permissions.add(
                new Permission(
                    scope,
                    toPermissionStatus(statusString),
                )
            );
        }

        return new PermissionSet(permissions);
    }
}