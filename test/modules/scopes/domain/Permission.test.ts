import { describe, it } from "node:test";

import expect from "expect";

import { Permission, PermissionSet } from "../../../../dist/modules/user/domain/Permission.js";
import { Claim } from "../../../../dist/modules/scopes/index.js";

describe("A PermissionSet", () => {
    it("can do set operations correctly", () => {
        const set1 = new PermissionSet([
            new Permission(new Claim("a", "Claim A")),
            new Permission(new Claim("b", "Claim B"))
        ]);
        const set2 = new PermissionSet([
            new Permission(new Claim("a", "Claim A")),
        ]);

        expect(set1.isSupersetOf(set2)).toEqual(true);
        expect(set2.isSubsetOf(set1)).toEqual(true);

        expect(set2.isSupersetOf(set1)).toEqual(false);
        expect(set1.isSubsetOf(set2)).toEqual(false);

        const union = set1.union(set2);

        expect(union.equals(new PermissionSet([
            new Permission(new Claim("a", "Claim A")),
            new Permission(new Claim("b", "Claim B"))
        ]))).toBe(true);
    })
});