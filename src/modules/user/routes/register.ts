import { Handler } from "express";

import { UserService } from "../user.service";
import { EmailAddress } from "../domain";

type Params = {
    email: EmailAddress,
    userName: string,
}

function parseRequestBody(body: Record<string, string>): Params {
    try {
        const email = new EmailAddress(body.email);
        const userName = body.userName;
        return { email, userName };
    } catch (error) {
        throw new Error(`Invalid request body: ${error}`);
    }
}

export function register(service: UserService): Handler {
    return (req, res) => {
        const { email, userName } = parseRequestBody(req.body);
        service.register({ email, userName });
        res.status(201).send("User registered");
    }
}