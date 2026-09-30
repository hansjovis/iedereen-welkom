import { Controller, Get, Inject, Logger, Render, Session, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";

import { UserService, UserRepository } from "../user/index.js";
import { HTTPStatus } from "../../common/index.js";

import { TOTPConfiguration, PasswordConfiguration, Secret } from "./domain/index.js";
import { Unauthorized } from "../../exceptions/Unauthorized.js";

type RequestBody = {
    password?: string,
    totp?: string,
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

        user.authentication.clear();

        if (body.password) {
            user.authentication.configure(
                PasswordConfiguration.create(body.password)
            );
        }

        if (body.totp) {
            user.authentication.configure(
                TOTPConfiguration.create({
                    secret: new Secret(body.totp),
                    issuer: "Hansjovis Auth",
                    accountName: user.userName,
                }),
            );
        }

        this.userRepository.save(user);

        const redirectUri: string = (session.redirect_to as string) ?? `/users/${encodeURIComponent(user.userName)}`;

        this.logger.log(
            `Configured authentication for user ${user.email} (${user.authentication.registered}). Redirecting to ${redirectUri}`
        );

        response.redirect(HTTPStatus.SeeOther.code, redirectUri);
    }
}