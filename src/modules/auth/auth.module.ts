import { Module } from "@nestjs/common";

import { UserModule } from "../user/index.js";
import { EmailModule, NoopEmailService } from "../email/index.js";

import { LoginController } from "./login.controller.js";
import { ConfigureController } from "./configure.controller.js";
import { AppsModule } from "../apps/apps.module.js";
import { AuthenticationCodeService } from "./authentication-code.service.js";

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
    ],
    imports: [
        UserModule,
        EmailModule,
        AppsModule,
    ],
    exports: [
        AuthenticationCodeService,
    ]
})
export class AuthModule {}