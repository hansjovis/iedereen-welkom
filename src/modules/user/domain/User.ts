import { AppID } from "../../apps/index.js";
import { Authentication } from "../../auth/index.js";

import { EmailAddress } from "./EmailAddress.js";
import { UserID } from "./UserID.js";
import { PermissionSet } from "./Permission.js";
import { RequestedPermission } from "modules/apps/domain/RequestedPermission.js";
import { EqualsSet } from "common/EqualsSet.js";

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
    private permissions: Map<string, PermissionSet>;

    constructor(props: UserProps) {
        this.id = props.id;
        this.userName = props.userName;
        this.email = props.email;
        this.authentication = Authentication.create();
        this.permissions = new Map();
    }

    static create(email: EmailAddress, userName: string): User {
        const id = UserID.create();
        return new User({ id, userName, email });
    }

    setPermissions(appId: AppID, permissions: PermissionSet) {
        this.permissions.set(appId.value, permissions);
    }

    permissionsFor(appId: AppID): PermissionSet | undefined {
        return this.permissions.get(appId.value);
    }

    hasPermissionsSetFor(appId: AppID, requestedPermissions: EqualsSet<RequestedPermission>): boolean {
        const appPermissions = this.permissions.get(appId.value);
        if (appPermissions === undefined)
            return false;
        const requestedScopes = requestedPermissions.map(it => it.scope);
        return appPermissions.scopes.isSupersetOf(requestedScopes);
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            userName: this.userName,
        };
    }
}