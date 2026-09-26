import { Injectable } from "@nestjs/common";
import { UserID } from "modules/user/index.js";
import { AuthenticationCode } from "./domain/AuthenticationCode.js";

@Injectable()
export class AuthenticationCodeService {
    private readonly codes: AuthenticationCode[] = [];

    create(userId: UserID): AuthenticationCode {
        const code = AuthenticationCode.create(userId);
        this.codes.push(code);
        return code;
    }
}