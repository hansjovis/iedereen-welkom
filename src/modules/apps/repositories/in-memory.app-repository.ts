import { Logger } from "@nestjs/common";
import { App } from "../domain/App.js";
import { AppID } from "../domain/AppID.js";
import { AppRepository } from "./app.repository.js";

export class InMemoryAppRepository implements AppRepository {
    private readonly logger = new Logger(InMemoryAppRepository.name);

    private readonly apps: Map<string, App> = new Map();

    create(app: App): void {
        this.logger.log(`Created app ${JSON.stringify(app)}.`);
        this.apps.set(app.id.toString(), app);
    }

    retrieveById(id: AppID): App | undefined {
        return this.apps.get(id.toString());
    }
}