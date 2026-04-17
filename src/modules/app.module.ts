import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module.js";
import { EmailModule } from "./email/email.module.js";
import { AuthModule } from "./auth/auth.module.js";

@Module({
    imports: [
        AuthModule,
        UserModule,
        EmailModule,
    ]
})
export class AppModule {}