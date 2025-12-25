import { URI } from "./URI";

export interface Identifiable {
    readonly type: URI[] | URI;
    readonly id: URI;
}