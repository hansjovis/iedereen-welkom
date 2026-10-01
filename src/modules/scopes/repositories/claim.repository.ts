import { Claim } from "../domain/Claim.js";

export interface ClaimRepository {
    retrieveById(claimId: string): Promise<Claim>;
    retrieveByIds(ids: string[]): Promise<Claim[]>
}