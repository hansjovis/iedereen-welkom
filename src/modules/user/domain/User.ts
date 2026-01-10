// Outside dependencies
import { NodeObject } from "jsonld";
// Dependencies from other modules
import { BaseNS, IedereenWelkomNS } from "namespaces";
import { Actor } from "actors/Actor";
import { URI } from "common/URI";
import { UnsafeCredentials, ProtectedCredentials } from "authorization/Credentials";
// Local dependencies
import { EmailAddress } from "./EmailAddress";

export type UserProps = {
    id?: URI,
    userName: string,
    email: EmailAddress,
    name: string,
    summary: string,
    icons?: URI[],
}

export class User extends Actor {
    readonly userName: string;
    readonly email: EmailAddress;

    private credentials: ProtectedCredentials[] = [];

    constructor(props: UserProps) {
        const id = props.id ?? new URI(BaseNS, `users/${encodeURIComponent(props.userName)}`);

        super({ id, ...props });

        this.type.push(new URI(IedereenWelkomNS, "User"));

        this.userName = props.userName;
        this.email = props.email;
    }

    get isActivated(): boolean {
        return this.credentials.length > 0;
    }

    private validateSingleCredential(storedCredentials: ProtectedCredentials, enteredCredentials: UnsafeCredentials[]) {
        const entered = enteredCredentials.find(it => it.type.equals(storedCredentials.forType));
        if (entered === undefined) {
            // We have configured a factor, but no entered credentials are of that type.
            return false;
        }
        if (storedCredentials.check(entered) === false) {
            // Entered credentials are invalid.
            return false;
        }
        return true;
    }

    validateEnteredCredentials(enteredCredentials: UnsafeCredentials[]): boolean {
        return this.credentials.every(it => this.validateSingleCredential(it, enteredCredentials));
    }

    activate(credentials: ProtectedCredentials[]) {
        this.credentials = credentials;
    }
}