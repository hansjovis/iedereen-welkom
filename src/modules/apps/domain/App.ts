import { AppID } from "./AppID.js";

type AppConfig = {
    id: AppID,
    name: string,
    redirectUri: URL,
    description?: string,
    image?: URL,
};

export class App {
    public readonly id: AppID;
    public name: string;
    public description: string;
    public image: URL;
    public redirectUri: URL;
    
    constructor(config: AppConfig) {
        this.id = config.id;
        this.redirectUri = config.redirectUri;
        this.name = config.name;
        this.description = config.description;
        this.image = config.image;
    }

    static create(name: string, redirectUri: URL, description?: string): App {
        return new App({ 
            id: AppID.create(),
            redirectUri,
            name,
            description,
        });
    }

    toJSON() {
        return {
            id: this.id.toJSON(),
            name: this.name,
            redirect_uri: this.redirectUri.toJSON(),
            response_type: "code",
            description: this.description,
            image: this.image ? this.image.toJSON() : undefined,
        }
    }
}