import { AppID } from "./AppID.js";

type AppConfig = {
    id: AppID,
    name: string,
    description?: string,
    image?: URL,
};

export class App {
    public readonly id: AppID;
    public name: string;
    public description: string;
    public image: URL;
    
    constructor(config: AppConfig) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.image = config.image;
    }

    static create(name: string, description?: string): App {
        return new App({ 
            id: AppID.create(),
            name,
            description,
        });
    }
}