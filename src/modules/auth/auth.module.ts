import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { UserModule } from "modules/user/user.module.js";


@Module({
    controllers: [
        AuthController,
    ],
    imports: [
        UserModule,
    ]
})
export class AuthModule {}