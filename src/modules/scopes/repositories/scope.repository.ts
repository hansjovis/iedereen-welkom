import { Scope } from "../domain/Scope.js";

export interface ScopeRepository {
    add(scope: Scope): Promise<void>
    retrieveByIds(ids: string[]): Promise<Scope[]>
}