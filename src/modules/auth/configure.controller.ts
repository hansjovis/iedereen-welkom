import { Controller, Get, Inject, Logger, Render, Session, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";

import { UserService, UserRepository } from "../user/index.js";
import { HTTPStatus } from "../../common/index.js";

import { TOTPConfiguration, PasswordConfiguration, Secret } from "./domain/index.js";

type ConfigurationRequestBody = {
    password?: string,
    totp?: string,
}

@Controller("/auth/configure")
export class ConfigureController {
    private readonly logger = new Logger(ConfigureController.name);

    constructor(
        @Inject("UserRepository") private readonly userRepository: UserRepository,
        private readonly userService: UserService,
    ) {}

    @Get("/")
    @Render("configure")
    async configure(
        @Session() session: Record<string, unknown>,
    ) {
        const user = await this.userService.retrieveUserFromSession(session);

        const totpConfig = TOTPConfiguration.generate(user.userName, "Hansjovis Auth");

        return {
            userName: user.userName,
            totp: {
                QRCode: await totpConfig.toQRCode(),
                secret: totpConfig.secret.toString(),
            },
        }
    }

    @Post("/")
    async saveConfiguration(
        @Res() response: Response,
        @Body() configurationDetails: ConfigurationRequestBody,
        @Session() session: Record<string, unknown>,
    ) {
        const user = await this.userService.retrieveUserFromSession(session);

        user.auth.clear();
        
        if (configurationDetails.password) {
            user.auth.configure(
                PasswordConfiguration.create(configurationDetails.password)
            );
        }

        if (configurationDetails.totp) {
            user.auth.configure(
                TOTPConfiguration.create({
                    secret: new Secret(configurationDetails.totp),
                    issuer: "Hansjovis Auth",
                    accountName: user.userName,
                }),
            );
        }

        this.userRepository.save(user);

        this.logger.log(`Configured authentication for user ${user.email} (${user.auth.registered}).`);

        response.redirect(HTTPStatus.SeeOther.code, `/users/${encodeURIComponent(user.userName)}`);
    }
}