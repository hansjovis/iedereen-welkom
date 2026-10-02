import { Controller, Get, Inject, Logger, Render, Session, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";

import { UserService, UserRepository, User } from "../../user/index.js";
import { Unauthorized } from "../../../exceptions/Unauthorized.js";
import { HTTPStatus } from "../../../common/index.js";

import { TOTPConfiguration, PasswordConfiguration, Secret } from "../domain/index.js";

class RequestBody {
    password?: string;
    totp?: string;
}

@Controller("/configure")
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

        if (user === undefined)
            throw new Unauthorized("You are not authorized to view this page.");

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
        @Body() body: RequestBody,
        @Session() session: Record<string, unknown>,
    ) {
        const user = await this.userService.retrieveUserFromSession(session);

        if (user === undefined)
            throw new Unauthorized("You are not authorized to view this page.");

        this.configureAuthentication(user, body);

        const redirectUri: string = (session.redirect_to as string) ?? `/users/${encodeURIComponent(user.userName)}`;

        this.logger.log(
            `Configured authentication for user ${user.email} (${user.authentication.registered}). Redirecting to ${redirectUri}`
        );

        response.redirect(HTTPStatus.SeeOther.code, redirectUri);
    }

    private configureAuthentication(user: User, config: { password?: string, totp?: string }) {
        user.authentication.clear();

        if (config.password) {
            user.authentication.configure(
                PasswordConfiguration.create(config.password)
            );
        }

        if (config.totp) {
            user.authentication.configure(
                TOTPConfiguration.create({
                    secret: new Secret(config.totp),
                    issuer: "Hansjovis Auth",
                    accountName: user.userName,
                })
            );
        }

        this.userRepository.save(user);
    }
}