import bcrypt from "bcryptjs";

import { URI } from "common/URI";
import { UnsafeCredentials, ProtectedCredentials } from "./Credentials";
import { IedereenWelkomNS } from "namespaces";

export class UnsafePassword extends Error {}

export class PlainPassword implements UnsafeCredentials {
    type: URI = new URI(IedereenWelkomNS, "credentials/password");

    constructor(public readonly plainPassword: string) {}
}

export class HashedPassword implements ProtectedCredentials {
    forType: URI = new URI(IedereenWelkomNS, "credentials/password");

    constructor(private readonly hashedPassword: string) {}

    static create(password: string): HashedPassword {
        if (password.length < 12) {
            throw new UnsafePassword(
                `Password should be at least 12 characters, but entered password was only ${password.length} characters long.`
            );
        }
        const salt = bcrypt.genSaltSync(12);
        return new HashedPassword(bcrypt.hashSync(password, salt));
    }

    check(credentials: PlainPassword): boolean {
        return bcrypt.compareSync(credentials.plainPassword, this.hashedPassword);
    }
}