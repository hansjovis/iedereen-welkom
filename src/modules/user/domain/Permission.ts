import { Claim, Scope } from "../../scopes/index.js";

export class PermissionSet implements ReadonlySetLike<Permission> {
    constructor(
        readonly permissions: Set<Permission>,
    ) {}

    get size(): number {
        return this.permissions.size;
    }

    static fromScopes(scopes: Scope[]): PermissionSet {
        const claims = scopes.flatMap(scope => scope.claims);
        const permissions = claims.map(claim => new Permission(claim));
        return new PermissionSet(new Set(permissions));
    }

    keys(): Iterator<Permission> {
        return Iterator.from(this.permissions)
    }

    has(permission: Permission): boolean {
        return [...this.permissions].some(it => it.equals(permission));
    }

    isSupersetOf(other: PermissionSet): boolean {
        return this.permissions.isSubsetOf(other);
    }

    union(other: PermissionSet): PermissionSet {
        const union = this.permissions.union(other);
        return new PermissionSet(union);
    }

    toString(): string {
        return `{${
            this.permissions.values()
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

    equals(other: Permission): boolean {
        return this.claim.equals(other.claim);
    }

    toString(): string {
        return `(${this.claim} = ${this.status})`;
    }
}