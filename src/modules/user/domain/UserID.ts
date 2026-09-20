import { Equatable, UUID } from "../../../common/index.js";

export class UserID extends UUID implements Equatable<UserID> {
    static create(): UserID {
        return new UserID(crypto.randomUUID());
    }
}