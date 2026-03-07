import { Handler } from "express";

import { PlainPassword, TOTPCode, UnsafeCredentials } from "../../auth/index.js";

import { UserService } from "../user.service.js";
import { EmailAddress } from "../domain/index.js";

type RequestBody = {
    email: string,
    enteredCredentials: Record<string, string>,
};

type Params = {
    email: EmailAddress,
    enteredCredentials: UnsafeCredentials[],
};

function parseRequestBody(body: RequestBody): Params {
    const email = new EmailAddress(body.email);

    const enteredCredentials: UnsafeCredentials[] = [];

    if (body.enteredCredentials.password) {
        enteredCredentials.push(new PlainPassword(body.enteredCredentials.password));
    }
    if (body.enteredCredentials.totp) {
        enteredCredentials.push(new TOTPCode(body.enteredCredentials.totp));
    }

    return { email, enteredCredentials };
}

export function login(service: UserService): Handler {
    return async (req, res) => {
        const params = parseRequestBody(req.body);
        
        const user = await service.login(params.email, params.enteredCredentials);
        console.log(`[${new Date().toISOString()}] User with email ${user.email} has logged in.`);
        res.status(200).send("Logged in");
    }
}