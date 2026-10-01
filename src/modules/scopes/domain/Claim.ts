
export class Claim {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description?: string,
    ) {}

    equals(other: Claim) {
        return this.id === other.id;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            desciption: this.description,
        };
    }

    toString(): string {
        return this.id;
    }
}