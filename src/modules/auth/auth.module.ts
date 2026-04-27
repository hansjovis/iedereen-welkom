import { Module } from "@nestjs/common";

import { UserModule } from "../user/index.js";
import { EmailModule, NoopEmailService } from "../email/index.js";

import { LoginController } from "./login.controller.js";
import { ConfigureController } from "./configure.controller.js";

@Module({
    providers: [
        {
            provide: "EmailService",
            useClass: NoopEmailService,
        }
    ],
    controllers: [
        LoginController,
        ConfigureController,
    ],
    imports: [
        UserModule,
        EmailModule,
    ]
})
export class AuthModule {}