import { Equatable } from "../../../common/Equatable.js";
import { Claim, Scope } from "../../scopes/index.js";

export class RequestedPermission implements Equatable<RequestedPermission> {
    constructor(
        readonly scope: Scope,
        readonly reason: string,
        readonly forLegitimateInterest: boolean = false,
    ) {}

    get claims(): Claim[] {
        return this.scope.claims;
    }

    equals(other: RequestedPermission): boolean {
        return this.scope.equals(other.scope);
    }
}