import { Handler } from "express";

import { UserService } from "./user.service";
import { EmailAddress } from "./domain";

export function register(service: UserService): Handler {
    return (req, res) => {
        const email = new EmailAddress(req.body.email);
        const userName: string = req.body.userName;

        service.register({ email, userName });
        
        res.status(201).send("User registered");
    }
}