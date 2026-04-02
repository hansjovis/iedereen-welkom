import { Authentication } from "../../../modules/auth/index.js";

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

    public auth: Authentication;

    constructor(props: UserProps) {
        this.id = props.id;
        this.userName = props.userName;
        this.email = props.email;
        this.auth = Authentication.create();
    }

    static create(email: EmailAddress, userName: string): User {
        const id = UUID.create();
        return new User({ id, userName, email });
    }
}