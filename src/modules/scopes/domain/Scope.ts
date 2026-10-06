import { Claim } from "./Claim.js";

export class Scope {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly claims: Claim[],
    ) {
        this.claims = [...new Set(claims)];
    }

    containsClaim(claim: Claim) {
        return this.claims.some(it => it.equals(claim));
    }

    equals(other: Scope): boolean {
        return this.id === other.id;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            claims: this.claims.map(it => it.toJSON()),
        };
    }
}