import { NodeObject } from "jsonld";

import { BaseNS, IedereenWelkomNS } from "namespaces";
import { Actor } from "./Actor";
import { URI } from "common/URI";
import { EmailAddress } from "values/EmailAddress";
import { Credentials } from "services/UserService";

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
    private credentials: Credentials[];

    constructor(props: UserProps) {
        const id = props.id ?? new URI(BaseNS, `users/${encodeURIComponent(props.name)}`);

        super({ id, ...props });

        this.type.push(new URI(IedereenWelkomNS, "User"));

        this.userName = props.userName;
        this.email = props.email;
    }

    get isActivated(): boolean {
        return !!this.credentials;
    }

    serialize(): NodeObject {
        return {
            ...super.serialize(),
        }
    }

    activate(credentials: Credentials[]) {
        this.credentials = credentials;
    }
}