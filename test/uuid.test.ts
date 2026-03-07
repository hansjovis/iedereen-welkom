import { describe, it } from "node:test";
import { expect } from "expect";

import { InvalidValue } from "../dist/exceptions/index.js";
import { UUID } from "../dist/modules/user/domain/index.js"

const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/gm;

describe("A UUID", () => {
    it("throws an error when an invalid UUID is tried to be created", () => {
        const create = () => new UUID("invalid-uuid");
        expect(create).toThrow(InvalidValue);
    });

    it("can create a UUID from a value", () => {
        const value = "bd613027-fcad-4fee-a547-2b9568b71bf6";
        const create = () => new UUID(value);
        expect(create).not.toThrow(InvalidValue);
    });

    it("can create a new UUID", () => {
        const uuid = UUID.create();
        expect(uuid.value.match(uuidRegex)).not.toBe(null);
    });

    it("can determine whether another UUID is equal", () => {
        const value = "bd613027-fcad-4fee-a547-2b9568b71bf6";
        expect(new UUID(value).equals(new UUID(value))).toEqual(true);
    });
});