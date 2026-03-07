import { describe, it } from "node:test";
import { expect } from "expect";

import { InvalidStatusCode, StatusCode } from "../dist/exceptions/HTTPException.js";

describe("A status code", () => {
    it("cannot be created with an invalid code", () => {
        const create = () => new StatusCode(600, "Invalid code");
        expect(create).toThrow(InvalidStatusCode);
    })
});