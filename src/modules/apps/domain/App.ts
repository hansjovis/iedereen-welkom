import { Scope, Claim } from "../../scopes/index.js";

import { AppID } from "./AppID.js";

type AppConfig = {
    name: string,
    redirectUri: URL,
    scopes: Scope[],
    description?: string,
    image?: URL,
};

export class App {
    public readonly id: AppID;
    public name: string;
    public description: string;
    public scopes: Scope[];
    public image: URL;
    public redirectUri: URL;
    
    constructor(id: AppID, config: AppConfig) {
        this.id = id;
        this.redirectUri = config.redirectUri;
        this.name = config.name;
        this.description = config.description;
        this.scopes = config.scopes;
        this.image = config.image;
    }

    get claims(): Claim[] {
        return [...new Set(this.scopes.flatMap(it => it.claims))];
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
        return this.scopes.every(it => scopeIds.includes(it.id));
    }

    toJSON() {
        return {
            id: this.id.toJSON(),
            name: this.name,
            redirect_uri: this.redirectUri.toJSON(),
            response_type: "code",
            scopes: this.scopes.map(it => it.toJSON()),
            description: this.description,
            image: this.image ? this.image.toJSON() : undefined,
        }
    }
}