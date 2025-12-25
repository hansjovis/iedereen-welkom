import { URI } from "./URI";

export interface Identifiable {
    readonly type: URI[];
    readonly id: URI;
}