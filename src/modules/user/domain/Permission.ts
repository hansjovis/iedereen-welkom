import { EqualsSet } from "../../../common/EqualsSet.js";
import { Claim, Scope } from "../../scopes/index.js";

export class PermissionSet extends EqualsSet<Permission> {
    static fromScopes(scopes: Scope[]): PermissionSet {
        const claims = scopes.flatMap(scope => scope.claims);
        const permissions = claims.map(claim => new Permission(claim));
        return new PermissionSet(permissions);
    }

    get claims(): EqualsSet<Claim> {
        return new EqualsSet([...this].map(permission => permission.claim));
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
    Disallowed = "Disallowed",
}

export function toPermissionStatus(status: string): PermissionStatus {
    if (status === PermissionStatus.Allowed) {
        return PermissionStatus.Allowed;
    } else if (status === PermissionStatus.Disallowed) {
        return PermissionStatus.Disallowed;
    }
    throw new Error(`${status} is not a valid permission status. Should be one of "Allowed" or "Disallowed".`);
}

export class Permission {
    constructor(
        readonly claim: Claim,
        readonly status?: PermissionStatus,
    ) {}

    equals(other: Permission): boolean {;
        return this.claim.equals(other.claim);
    }

    toString(): string {
        return `(${this.claim} = ${this.status})`;
    }
}