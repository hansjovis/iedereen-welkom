import { InvalidValue } from "../exceptions/index.js";

import { Equatable } from "./Equatable.js";

export abstract class UUID implements Equatable<UUID> {
    private static regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/gm;

    public readonly value: string;
    constructor(value: string) {
        if (value.match(UUID.regex) === null && value !== undefined) {
            throw new InvalidValue(`"${value}" is an invalid UUID.`);
        } 
        this.value = value;
    }

    toString(): string {
        return this.value;
    }

    toJSON(): string {
        return this.toString();
    }

    equals(other: UUID): boolean {
        return this.value === other.value;
    }
}