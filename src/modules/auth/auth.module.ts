import { Module } from "@nestjs/common";

import { UserModule } from "../user/index.js";
import { EmailModule, NoopEmailService } from "../email/index.js";
import { AppsModule } from "../apps/apps.module.js";
import { ScopeModule } from "../scopes/scope.module.js";

import { LoginController } from "./login.controller.js";
import { ConfigureController } from "./configure.controller.js";
import { AuthenticationCodeService } from "./authentication-code.service.js";
import { AuthorizeController } from "./authorize.controller.js";

@Module({
    providers: [
        {
            provide: "EmailService",
            useClass: NoopEmailService,
        },
        AuthenticationCodeService,
    ],
    controllers: [
        LoginController,
        ConfigureController,
        AuthorizeController,
    ],
    imports: [
        UserModule,
        EmailModule,
        AppsModule,
        ScopeModule,
    ],
    exports: [
        AuthenticationCodeService,
    ]
})
export class AuthModule {}