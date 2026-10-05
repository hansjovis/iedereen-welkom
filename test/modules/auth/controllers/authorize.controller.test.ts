import { beforeEach, describe, it } from "node:test";
import { expect } from "expect";

import { AuthorizeController, QueryParams, RequestBody } from "../../../../dist/modules/auth/controllers/authorize.controller.js";
import { AuthenticationCodeService } from "../../../../dist/modules/auth/services/authentication-code.service.js";
import { App, type AppRepository, InMemoryAppRepository } from "../../../../dist/modules/apps/index.js";
import { EmailAddress, InMemoryUserRepository, User, type UserRepository, UserService } from "../../../../dist/modules/user/index.js";
import { Claim, type ClaimRepository, InMemoryClaimRepository, InMemoryScopeRepository, OpenID, Scope, type ScopeRepository } from "../../../../dist/modules/scopes/index.js";
import type { EmailService } from "../../../../dist/modules/email/email.service.js";

import { MockEmailService } from "../../../_mocks/mock.email-service.ts";
import type { Response } from "express";
import { Permission, PermissionSet, PermissionStatus } from "../../../../dist/modules/user/domain/Permission.js";

class MockResponse {
    public lastRender?: { view: string, options: unknown };
    public lastRedirect?: string;

    render(view: string, options: unknown) {
        this.lastRender = { view, options };
    }

    redirect(uri: string) {
        this.lastRedirect = uri;
    }
}

describe("The authorization controller", () => {
    let appRepository: AppRepository;
    let userRepository: UserRepository;
    let scopeRepository: ScopeRepository;
    let claimRepository: ClaimRepository;

    let userService: UserService;
    let emailService: EmailService;
    let authenticationCodeService: AuthenticationCodeService;

    let controller: AuthorizeController;

    function createApp(): App {
        const app = App.create({
            name: "App for Testing Purposes",
            redirectUri: new URL("http://client.example.com/login"),
            scopes: [OpenID]
        });
        appRepository.create(app);
        return app;
    }

    function createQuery(app: App): QueryParams {
        const query = new QueryParams();

        query.client_id = app.id.value;
        query.redirect_uri = app.redirectUri.toString();
        query.response_type = "code";
        query.scope = "openid";

        return query;
    }

    function createUser(): User {
        const email = new EmailAddress("hansjovis@example.net");
        const user = User.create(email, "hansjovis");
        userRepository.create(user);
        return user;
    }

    function createRequestBody(
        app: App, 
        permissions: Record<string, "Allowed" | "Disallowed">
    ): RequestBody {
        const body = new RequestBody();
        body.client_id = app.id.value;
        body.redirect_uri = app.redirectUri.toString();
        body.permissions = permissions;
        return body;
    }

    beforeEach(() => {
        appRepository = new InMemoryAppRepository();
        userRepository = new InMemoryUserRepository();
        scopeRepository = new InMemoryScopeRepository();
        claimRepository = new InMemoryClaimRepository();
        
        emailService = new MockEmailService();
        userService = new UserService(
            userRepository,
            emailService,
        );
        authenticationCodeService = new AuthenticationCodeService();

        controller = new AuthorizeController(
            appRepository,
            scopeRepository,
            claimRepository,
            userService,
            authenticationCodeService
        );
    });

    it("can render the authorization page when given the correct client credentials.", async () => {
        const user = createUser();
        const app = createApp();
        const query = createQuery(app);

        // Emulate logged in user.
        const session = {
            userID: user.id.toString(),
        };

        const response = new MockResponse();

        await controller.authorizePage(
            query,
            session,
            response as unknown as Response,
        );

        expect(response.lastRender).toBeDefined();
        expect(response.lastRender?.view).toEqual("authorize");
    });

    it("redirects to the login page when user is not logged in yet.", async () => {
        createUser();
        const app = createApp();
        const query = createQuery(app);

        // User is not logged in.
        const session = {
            userID: undefined,
        };

        const response = new MockResponse();

        await controller.authorizePage(
            query,
            session,
            response as unknown as Response,
        );

        expect(response.lastRedirect).toEqual("login");
    });

    it("redirects to the redirect URI when the user has authorized the app already.", async () => {
        const user = createUser();
        const app = createApp();
        const query = createQuery(app);

        // User is logged in.
        const session = {
            userID: user.id.toString(),
        };

        // Set all OpenID permissions for the app.
        const permissions = OpenID.claims.map(
            claim => new Permission(claim, PermissionStatus.Allowed)
        );
        user.setPermissions(app.id, new PermissionSet(new Set(permissions)));

        const response = new MockResponse();

        await controller.authorizePage(
            query,
            session,
            response as unknown as Response,
        );

        expect(response.lastRedirect).toMatch(`${query.redirect_uri}?code=`);
    });

    it("does not redirect when the redirect URI in the query is not a valid redirect URI of the app.", async () => {
        const user = createUser();
        const app = createApp();
        const query = createQuery(app);

        // Not the same as the one in the app.
        query.redirect_uri = "http://invalid.example.com/login";

        // User is logged in.
        const session = {
            userID: user.id.toString(),
        };

        // Set all OpenID permissions for the app.
        const permissions = OpenID.claims.map(
            claim => new Permission(claim, PermissionStatus.Allowed)
        );
        user.setPermissions(app.id, new PermissionSet(new Set(permissions)));

        const response = new MockResponse();

        await expect(controller.authorizePage(
            query,
            session,
            response as unknown as Response,
        )).rejects.toThrow("http://invalid.example.com/login is an invalid redirect URI.");
    });

    it("can give an app permission to access claims.", async () => {
        const user = createUser();
        const app = createApp();

        const permissions: Record<string, "Allowed" | "Disallowed"> = {
            iss: "Allowed",
            sub: "Allowed",
            aud: "Allowed", 
            exp: "Allowed", 
            iat: "Allowed",
        };

        const body = createRequestBody(app, permissions);

        const session = {
            userID: user.id.value,
        };

        const response = new MockResponse();

        await controller.authorize(body, session, response as unknown as Response);

        expect(response.lastRedirect).toMatch(`${body.redirect_uri}?code=`);
    });

    it("throws an error when trying to give an app permission to access claims it does not support.", async () => {
        const user = createUser();
        const app = createApp();

        scopeRepository.add(new Scope("age", "Your age", [new Claim("age", "Your age")]));

        const permissions: Record<string, "Allowed" | "Disallowed"> = {
            iss: "Allowed",
            sub: "Allowed",
            aud: "Allowed", 
            exp: "Allowed", 
            iat: "Allowed",
            email: "Disallowed", // Not a permission that the app needs.
        };

        const body = createRequestBody(app, permissions);

        const session = {
            userID: user.id.value,
        };

        const response = new MockResponse();

        await expect(controller.authorize(body, session, response as unknown as Response))
            .rejects
            .toThrow("Could not set permissions for app App for Testing Purposes.");
    });
});