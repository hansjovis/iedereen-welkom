import { App } from "../domain/App.js";
import { AppID } from "../domain/AppID.js";

export interface AppRepository {
    create(app: App): void;
    retrieveById(id: AppID): Promise<App | undefined>;
}