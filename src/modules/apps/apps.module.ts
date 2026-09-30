import { Inject, Module } from "@nestjs/common";

import { InMemoryAppRepository } from "./repositories/in-memory.app-repository.js";
import { AppRepository } from "./repositories/app.repository.js";
import { OpenID } from "../scopes/index.js";

import { App, AppID } from "./domain/index.js";

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
                redirectUri: new URL("http://localhost:1234"),
                scopes: [OpenID],
                description: "An app to test the login flow."
            }),
        );
    }
}