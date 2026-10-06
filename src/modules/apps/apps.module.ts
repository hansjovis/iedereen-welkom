import { Inject, Module } from "@nestjs/common";

import { InMemoryAppRepository } from "./repositories/in-memory.app-repository.js";
import { AppRepository } from "./repositories/app.repository.js";
import { Email, OpenID } from "../scopes/index.js";

import { App, AppID } from "./domain/index.js";
import { RequestedPermission } from "./domain/RequestedPermission.js";

@Module({
    providers: [
        {
            provide: "AppRepository",
            useClass: InMemoryAppRepository,
        }
    ],
    exports: [
        "AppRepository",
    ]
})
export class AppsModule {
    constructor(
        @Inject("AppRepository") apps: AppRepository,
    ) {
        apps.create(
            new App(new AppID("d83eec13-bf8e-4439-81eb-fd4128d2cd72"), {
                name: "Test App",
                description: "An app to test the login flow.",
                redirectUri: new URL("http://localhost:1234/login"),
                requestedPermissions: [
                    new RequestedPermission(
                        OpenID, 
                        "To be able to verify your identity and to let you log in safely and securely into the application.",
                        true,
                    ),
                    new RequestedPermission(
                        Email,
                        "To be able to send you exciting new deals via our newsletter.",
                    )
                ],
            }),
        );
    }
}