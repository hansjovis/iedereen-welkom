import { Injectable } from "@nestjs/common";
import { UserID } from "../user/index.js";
import { AuthenticationCode } from "./domain/AuthenticationCode.js";

@Injectable()
export class AuthenticationCodeService {
    private codes: AuthenticationCode[] = [];

    createFor(userId: UserID): AuthenticationCode {
        const code = AuthenticationCode.create(userId);
        this.codes.push(code);
        return code;
    }

    checkValidity(currentTime: Date, code: AuthenticationCode): boolean {
        const existingCode = this.codes.find(c => c.equals(code));
        if (existingCode === undefined)
            return false;
        // TODO: Clean up old codes.
        return existingCode.isValid(currentTime);
    }
}