import { EqualsSet } from "../../../common/EqualsSet.js";
import { Scope } from "../../scopes/index.js";

export class PermissionSet extends EqualsSet<Permission> {
    static fromScopes(scopes: Scope[]): PermissionSet {
        const permissions = scopes.map(scope => new Permission(scope));
        return new PermissionSet(permissions);
    }

    get scopes(): EqualsSet<Scope> {
        return new EqualsSet([...this].map(it => it.scope));
    }

    toString(): string {
        return `{${
            this.values()
                .map(val => val.toString())
                .toArray()
                .join(", ")
        }}`;
    }
}

export enum PermissionStatus {
    Allowed = "Allowed",
    Denied = "Denied",
}

export function toPermissionStatus(status: string): PermissionStatus {
    if (status === PermissionStatus.Allowed) {
        return PermissionStatus.Allowed;
    } else if (status === PermissionStatus.Denied) {
        return PermissionStatus.Denied;
    }
    throw new Error(`"${status}" is not a valid permission status. Should be one of "Allowed" or "Denied".`);
}

export class Permission {
    constructor(
        readonly scope: Scope,
        readonly status?: PermissionStatus,
    ) {
        if (scope === undefined)
            throw new Error("Scope cannot be undefined.");
    }

    equals(other: Permission): boolean {;
        return this.scope.equals(other.scope);
    }

    toString(): string {
        return `(${this.scope} = ${this.status})`;
    }
}