import { Claim } from "../domain/Claim.js";
import { aud, email, exp, iat, iss, sub } from "../domain/claims.js";
import { ClaimRepository } from "./claim.repository.js";


export class InMemoryClaimRepository implements ClaimRepository {
    private readonly claims: Claim[] = [
        iss,
        sub,
        aud,
        exp,
        iat,
        email,
    ];

    async retrieveById(claimId: string): Promise<Claim> {
        return this.claims.find(it => it.id === claimId);
    }

    async retrieveByIds(ids: string[]): Promise<Claim[]> {
        return this.claims.filter(claim => ids.includes(claim.id));
    }
}