import { Scope } from "../domain/Scope.js";

export interface ScopeRepository {
    retrieveById(scopeId: string): Promise<Scope>;
    add(scope: Scope): Promise<void>
    retrieveByIds(ids: string[]): Promise<Scope[]>
}