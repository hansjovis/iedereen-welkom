import { InvalidStatusCode, StatusCode } from "exceptions/HTTPException";

describe("A status code", () => {
    it("cannot be created with an invalid code", () => {
        const create = () => new StatusCode(600, "Invalid code");
        expect(create).toThrow(InvalidStatusCode);
    })
});