import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller.js";
import { UserModule } from "../user/user.module.js";
import { EmailModule } from "../email/email.module.js";
import { NoopEmailService } from "../email/noop.email-service.js";

@Module({
    providers: [
        {
            provide: "EmailService",
            useClass: NoopEmailService,
        }
    ],
    controllers: [
        LoginController,
    ],
    imports: [
        UserModule,
        EmailModule,
    ]
})
export class AuthModule {}