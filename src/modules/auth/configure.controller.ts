import { Controller, Get, Inject, Logger, Render, Session, Res, Post, Body } from "@nestjs/common";
import { Response as ExpressResponse } from "express";

import { UserRepository } from "../../modules/user/repositories/user.repository.js";
import { User, UUID } from "../../modules/user/index.js";
import { Unauthorized } from "../../exceptions/Unauthorized.js";
import { NotFound } from "../../exceptions/NotFound.js";
import { HandleResponse } from "../../response/HandleResponse.js";
import { Response } from "../../response/Response.js";

import { TOTPConfiguration, CredentialConfigurationTypeMap } from "./domain/index.js";

type ConfigurationRequestBody = {
    [credentialType: string]: string,
}

type ConfigureResponse = {
    userName: string,
    totp: {
        QRCode: string,
        secret: string,
    }
}

@Controller("/auth/configure")
export class ConfigureController {
    private readonly logger = new Logger(ConfigureController.name);

    constructor(
        @Inject("UserRepository") private readonly userRepository: UserRepository,
    ) {}

    @Get("/")
    @Render("configure")
    @HandleResponse<ConfigureResponse>
    async configure(
        @Res() response: ExpressResponse,
        @Session() session: Record<string, unknown>,
    ) {
        const user = await this.retrieveUserFromSession(session);

        const totpConfig = TOTPConfiguration.create(user.userName, "Hansjovis Auth");

        return new Response({
            userName: user.userName,
            totp: {
                QRCode: await totpConfig.toQRCode(),
                secret: totpConfig.secret.toString(),
            },
        });
    }

    @Post("/")
    @HandleResponse<string>
    async saveConfiguration(
        @Res() response: ExpressResponse,
        @Body() configurationDetails: ConfigurationRequestBody,
        @Session() session: Record<string, unknown>,
    ) {
        const user = await this.retrieveUserFromSession(session);

        user.auth.clear();
        for (const [key, value] of Object.entries(configurationDetails)) {
            user.auth.configure(new CredentialConfigurationTypeMap[key](value));
        }

        this.userRepository.save(user);

        return new Response("Successfully registered login credentials.");
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