import { isSuperset } from "../../../common/set.js";

import { AppID } from "../../apps/index.js";
import { Authentication } from "../../auth/index.js";

import { EmailAddress } from "./EmailAddress.js";
import { UserID } from "./UserID.js";
import { Authorization } from "./Authorization.js";

export type UserProps = {
    id: UserID,
    userName: string,
    email: EmailAddress,
}

export class User {
    readonly id: UserID;
    readonly userName: string;
    readonly email: EmailAddress;

    authentication: Authentication;
    authorizations: Authorization[] = [];

    constructor(props: UserProps) {
        this.id = props.id;
        this.userName = props.userName;
        this.email = props.email;
        this.authentication = Authentication.create();
    }

    static create(email: EmailAddress, userName: string): User {
        const id = UserID.create();
        return new User({ id, userName, email });
    }

    authorizationsSetFor(appId: AppID): Authorization[] {
        return this.authorizations
            .filter(authorization => authorization.isForApp(appId))
            .filter(authorization => authorization.status !== undefined)
    }

    hasAuthorizationsSetFor(appId: AppID, authorizations: Authorization[]) {
        const authorizedClaims = this.authorizationsSetFor(appId);
        return isSuperset(authorizedClaims, authorizations);
    }
}