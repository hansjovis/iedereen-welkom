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

    private _credentials: ProtectedCredentials[];

    constructor(props: UserProps) {
        const id = props.id ?? new URI(BaseNS, `users/${encodeURIComponent(props.name)}`);

        super({ id, ...props });

        this.type.push(new URI(IedereenWelkomNS, "User"));

        this.userName = props.userName;
        this.email = props.email;
    }

    get isActivated(): boolean {
        return !!this._credentials;
    }

    get credentials(): ProtectedCredentials[] {
        return this._credentials;
    }

    getProtectedCredentials(credentials: UnsafeCredentials): ProtectedCredentials | undefined {
        return this._credentials.find(it => it.type.equals(credentials.type));
    }

    validate(credentials: UnsafeCredentials): boolean {
        const protectedCredentials = this.getProtectedCredentials(credentials);
        if (protectedCredentials === undefined) {
            return false;
        }

        return protectedCredentials.check(credentials);
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