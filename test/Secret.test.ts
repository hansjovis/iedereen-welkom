import { describe, it } from "node:test";

import { expect } from "expect";

import { Secret }  from "../dist/modules/auth/domain/Secret.js";

describe("Secret", () => {
    it("can be generated", () => {
        const secret = Secret.create(31);
        expect(secret.value).toHaveLength(32);
        expect(secret.value).toMatch(/^([A-Z2-7=]{8})+$/);
    });
});