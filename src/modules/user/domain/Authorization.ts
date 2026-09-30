import { Claim } from "modules/scopes/index.js";
import { AppID } from "../../apps/index.js";
import { UserID } from "./UserID.js";

export enum AuthorizationStatus {
    Authorized = "Authorized",
    Unauthorized = "Unauthorized",
}

export class Authorization {
    constructor(
        readonly appId: AppID,
        readonly userId: UserID,
        readonly claim: Claim,
        readonly status?: AuthorizationStatus,
    ) {}

    isForApp(appId: AppID): boolean {
        return this.appId.equals(appId);
    }

    equals(other: Authorization): boolean {
        return this.appId.equals(other.appId) 
            && this.userId.equals(other.userId) 
            && this.claim.equals(other.claim);
    }
}