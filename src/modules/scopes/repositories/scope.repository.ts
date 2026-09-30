import { Scope } from "../domain/Scope.js";

export interface ScopeRepository {
    retrieveByIds(ids: string[]): Promise<Scope[]>
}