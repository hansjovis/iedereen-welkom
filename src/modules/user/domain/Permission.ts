import { Claim, Scope } from "../../scopes/index.js";
import { AppID } from "../../apps/index.js";
import { UserID } from "./UserID.js";

export class PermissionSet implements ReadonlySetLike<Permission> {
    constructor(
        readonly appId: AppID,
        readonly permissions: Set<Permission>,
    ) {}

    get size(): number {
        return this.permissions.size;
    }

    static fromScopes(appId: AppID, userId: UserID, scopes: Scope[]): PermissionSet {
        const claims = scopes.flatMap(scope => scope.claims);
        const permissions = claims.map(claim => new Permission(appId, userId, claim));
        return new PermissionSet(appId, new Set(permissions));
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
        return new PermissionSet(this.appId, union);
    }

    toString(): string {
        return this.permissions.values()
            .map(permission => permission.claim)
            .toArray()
            .join(", ");
    }
}

export enum PermissionStatus {
    Allowed = "Allowed",
    Disallowed = "Disallowed",
}

export class Permission {
    constructor(
        readonly appId: AppID,
        readonly userId: UserID,
        readonly claim: Claim,
        readonly status?: PermissionStatus,
    ) {}

    isForApp(appId: AppID): boolean {
        return this.appId.equals(appId);
    }

    equals(other: Permission): boolean {
        return this.appId.equals(other.appId) 
            && this.userId.equals(other.userId) 
            && this.claim.equals(other.claim);
    }
}