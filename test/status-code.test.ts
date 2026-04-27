import { describe, it } from "node:test";
import { expect } from "expect";

import { HTTPStatus, InvalidHTTPStatus } from "../dist/common/HTTPStatus.js";

describe("A status code", () => {
    it("cannot be created with an invalid code", () => {
        const create = () => new HTTPStatus(600, "Invalid code");
        expect(create).toThrow(InvalidHTTPStatus);
    })
});