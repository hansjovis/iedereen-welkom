import { Equatable } from "../../../common/Equatable.js";
import { InvalidValue } from "../../../exceptions/index.js";

export class UUID implements Equatable<UUID> {
    private static regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/gm;

    public readonly value: string;
    constructor(value: string) {
        if (value.match(UUID.regex) === null) {
            throw new InvalidValue(`"${value}" is an invalid UUID.`);
        } 
        this.value = value;
    }

    static create(): UUID {
        return new UUID(crypto.randomUUID());
    }

    toString(): string {
        return this.value;
    }

    equals(other: UUID): boolean {
        return this.value === other.value;
    }
}