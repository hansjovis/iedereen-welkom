import { Module } from "@nestjs/common";

import { UserModule } from "../user/index.js";
import { EmailModule, NoopEmailService } from "../email/index.js";
import { AppsModule } from "../apps/apps.module.js";
import { ScopeModule } from "../scopes/scope.module.js";

import { LoginController } from "./controllers/login.controller.js";
import { ConfigureController } from "./controllers/configure.controller.js";
import { AuthorizeController } from "./controllers/authorize.controller.js";
import { AuthenticationCodeService } from "./services/authentication-code.service.js";

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