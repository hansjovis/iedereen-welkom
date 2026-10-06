import { EqualsSet } from "../../../common/EqualsSet.js";
import { Scope } from "../../scopes/index.js";

import { AppID } from "./AppID.js";
import { RequestedPermission } from "./RequestedPermission.js";

type AppConfig = {
    name: string,
    redirectUri: URL,
    requestedPermissions: RequestedPermission[],
    description?: string,
    image?: URL,
};

export class App {
    public readonly id: AppID;
    public name: string;
    public description: string;
    public requestedPermissions: RequestedPermission[];
    public image: URL;
    public redirectUri: URL;
    
    constructor(id: AppID, config: AppConfig) {
        this.id = id;
        this.redirectUri = config.redirectUri;
        this.name = config.name;
        this.description = config.description;
        this.requestedPermissions = config.requestedPermissions;
        this.image = config.image;
    }

    get scopes(): EqualsSet<Scope> {
        return new EqualsSet(this.requestedPermissions.map(it => it.scope));
    }

    static create(config: AppConfig): App {
        return new App(
            AppID.create(),
            config,
        );
    }

    isValidRedirectUri(redirectUri: URL) {
        return this.redirectUri.toJSON() === redirectUri.toJSON();
    }

    hasScopes(scopeIds: string[]) {
        return this.requestedPermissions.every(it => scopeIds.includes(it.scope.id));
    }

    requestedPermissionsFor(scopesIds: string[]): EqualsSet<RequestedPermission> {
        return new EqualsSet(
            this.requestedPermissions.filter(it => scopesIds.includes(it.scope.id))
        );
    }

    toJSON() {
        return {
            id: this.id.toJSON(),
            name: this.name,
            description: this.description,
            image: this.image ? this.image.toJSON() : undefined,
        }
    }
}