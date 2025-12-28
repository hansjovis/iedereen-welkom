import { NodeObject } from "jsonld";

import { BaseNS, IedereenWelkomNS } from "namespaces";
import { Actor } from "./Actor";
import { URI } from "common/URI";
import { EmailAddress } from "values/EmailAddress";
import { UnsafeCredentials, ProtectedCredentials } from "authorization/Credentials";

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

    private _credentials: ProtectedCredentials[] = [];

    constructor(props: UserProps) {
        const id = props.id ?? new URI(BaseNS, `users/${encodeURIComponent(props.userName)}`);

        super({ id, ...props });

        this.type.push(new URI(IedereenWelkomNS, "User"));

        this.userName = props.userName;
        this.email = props.email;
    }

    get isActivated(): boolean {
        return this._credentials.length > 0;
    }

    get credentials(): ProtectedCredentials[] {
        return this._credentials;
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
        if (enteredCredentials.length !== this.credentials.length) {
            // We expect the same amount of entered credentials as configured factors (e.g. password + TOTP).
            return false;
        }
        return this._credentials.every(it => this.validateSingleCredential(it, enteredCredentials));
    }

    serialize(): NodeObject {
        return {
            ...super.serialize(),
        }
    }

    activate(credentials: ProtectedCredentials[]) {
        this._credentials = credentials;
    }
}