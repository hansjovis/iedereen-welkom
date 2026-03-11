import { 
    UnsafeCredentials, 
    ProtectedCredentials, 
    LoginCodeConfiguration, 
    Duration,
    LoginCode,
} from "../../../modules/auth/index.js";

import { EmailAddress } from "./EmailAddress.js";
import { UUID } from "./UUID.js";

export type UserProps = {
    id: UUID,
    userName: string,
    email: EmailAddress,
}

export class User {
    readonly id: UUID;
    readonly userName: string;
    readonly email: EmailAddress;

    public credentials: ProtectedCredentials[] = [];

    constructor(props: UserProps) {
        this.id = props.id;
        this.userName = props.userName;
        this.email = props.email;
        this.credentials.push(
            new LoginCodeConfiguration("", Duration.parse("10 minutes"))
        );
    }

    static create(email: EmailAddress, userName: string): User {
        const id = UUID.create();
        return new User({ id, userName, email });
    }

    async generateLoginCode(): Promise<LoginCode> {
        const loginCodeConfig = this.credentials.find(it => it instanceof LoginCodeConfiguration);
        if (loginCodeConfig === undefined) {
            throw new Error(
                `Login code not configured for user with email ${this.email}`,
            );
        }
        return loginCodeConfig.generate();
    }

    private async validateSingleCredential(storedCredentials: ProtectedCredentials, enteredCredentials: UnsafeCredentials[]) {
        const entered = enteredCredentials.find(it => it.type === storedCredentials.forType);
        if (entered === undefined) {
            // We have configured a factor, but no entered credentials are of that type.
            return false;
        }
        return await storedCredentials.check(entered) === false;
    }

    async validateEnteredCredentials(enteredCredentials: UnsafeCredentials[]): Promise<boolean> {
        const results = await Promise.all(this.credentials.map(it => this.validateSingleCredential(it, enteredCredentials)));
        return results.every(it => it === true);
    }

    activate(credentials: ProtectedCredentials[]): void {
        this.credentials = credentials;
    }
}