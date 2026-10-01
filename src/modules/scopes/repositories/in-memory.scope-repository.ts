import { Scope } from "../domain/Scope.js";
import { Email, OpenID } from "../domain/scopes.js";
import { ScopeRepository } from "./scope.repository.js";

export class InMemoryScopeRepository implements ScopeRepository {
    private readonly scopes: Scope[] = [
        OpenID,
        Email,
    ];

    async retrieveByIds(ids: string[]): Promise<Scope[]> {
        return this.scopes.filter(scope => ids.includes(scope.id));
    }
}