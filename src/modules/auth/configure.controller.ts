import { Controller, Get, Inject, Logger, Render, Session, Post, Body, Res } from "@nestjs/common";
import { Response } from "express";

import { UserRepository } from "../user/repositories/user.repository.js";
import { User, UUID } from "../user/index.js";
import { HTTPStatus } from "../../common/HTTPStatus.js";
import { Unauthorized, NotFound } from "../../exceptions/index.js";

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
    ) {}

    @Get("/")
    @Render("configure")
    async configure(
        @Session() session: Record<string, unknown>,
    ) {
        const user = await this.retrieveUserFromSession(session);

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
        const user = await this.retrieveUserFromSession(session);

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

        response.redirect(HTTPStatus.SeeOther.code, `/users/${encodeURIComponent(user.userName)}`);
    }

    async retrieveUserFromSession(session: Record<string, unknown>): Promise<User> {
        const uuidString = session.userID as string;
        if (uuidString === undefined) {
            throw new Unauthorized("You are not authorized to enter this page.");
        }

        const user = this.userRepository.retrieveById(
            new UUID(uuidString)
        );
        
        if (user === undefined) {
            throw new NotFound(`User with id ${uuidString} could not be found.`);
        }

        return user;
    }
}