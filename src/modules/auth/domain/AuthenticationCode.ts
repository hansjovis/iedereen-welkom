import { UserID } from "modules/user/index.js";
import { Secret } from "./Secret.js";

export class AuthenticationCode {
    constructor(
        readonly createdAt: Date,
        readonly userId: UserID,
        readonly code: Secret,
    ) {}

    static create(userId: UserID): AuthenticationCode {
        return new AuthenticationCode(
            new Date(),
            userId,
            Secret.create(),
        );
    }

    toJSON() {
        return this.code.toString();
    }
};