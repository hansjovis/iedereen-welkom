import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module.js";
import { EmailModule } from "./email/email.module.js";

@Module({
    imports: [
        UserModule,
        EmailModule,
    ]
})
export class AppModule {}