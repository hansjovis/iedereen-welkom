import { Equatable, UUID } from "../../../common/index.js";

export class AppID extends UUID implements Equatable<AppID> {
    static create(): AppID {
        return new AppID(crypto.randomUUID());
    }
}