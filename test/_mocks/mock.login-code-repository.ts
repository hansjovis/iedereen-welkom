import { LoginCode } from "modules/auth";
import { LoginCodeRepository } from "modules/auth/login-code.repository";


export class MockLoginCodeRepository implements LoginCodeRepository {
    public readonly codes: LoginCode[] = [];
    save(loginCode: LoginCode): void {
        this.codes.push(loginCode);
    }
}