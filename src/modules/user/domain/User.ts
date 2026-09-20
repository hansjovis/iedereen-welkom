import { Authentication } from "../../../modules/auth/index.js";

import { EmailAddress } from "./EmailAddress.js";
import { UserID } from "./UserID.js";

export type UserProps = {
    id: UserID,
    userName: string,
    email: EmailAddress,
}

export class User {
    readonly id: UserID;
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
        const id = UserID.create();
        return new User({ id, userName, email });
    }
}