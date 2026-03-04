import { Handler } from "express";

import { PlainPassword, TOTPCode, UnsafeCredentials } from "modules/auth";

import { UserService } from "../user.service";
import { EmailAddress } from "../domain";

type Params = {
    email: EmailAddress,
    enteredCredentials: UnsafeCredentials[],
};

function parseRequestBody(body: Record<string, unknown>): Params {
    const email = new EmailAddress(body.email);

    const enteredCredentials: UnsafeCredentials[] = [];
    enteredCredentials.push(new PlainPassword(body.enteredCredentials.password));
    enteredCredentials.push(new TOTPCode(body.enteredCredentials.totp));

    return { email, enteredCredentials };
}

export function login(service: UserService): Handler {
    return (req, res) => {
        const params = parseRequestBody(req.body);
        const user = service.login(params.email, params.enteredCredentials);
        req.session.userID = user.id.toString();
        res.status(200).send("Logged in");
    }
}