import { BaseNS, IedereenWelkomNS } from "namespaces";
import { Actor } from "actors/Actor";
import { URI } from "common/URI";
import { UnsafeCredentials, ProtectedCredentials } from "authorization/Credentials";

import { EmailAddress } from "./EmailAddress";

export type UserProps = {
    id: URI,
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
        super(props);

        this.type.push(new URI(IedereenWelkomNS, "User"));

        this.userName = props.userName;
        this.email = props.email;
    }

    static create(email: EmailAddress, userName: string): User {
        const id = new URI(BaseNS, `users/${encodeURIComponent(userName)}`);
        const name = userName;
        const summary = `Hallo, mijn naam is ${name}`;
        return new User({ id, userName, name, summary, email });
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