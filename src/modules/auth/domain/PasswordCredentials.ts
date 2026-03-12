import bcrypt from "bcryptjs";

import { UnsafeCredentials, CredentialsConfiguration } from "./Credentials.js";

export class UnsafePassword extends Error {}

export class Password implements UnsafeCredentials {
    type = "password";

    constructor(public readonly value: string) {}
}

export class PasswordConfiguration implements CredentialsConfiguration {
    forType = "password";

    constructor(private readonly hashedPassword: string) {}

    static create(password: string): PasswordConfiguration {
        if (password.length < 12) {
            throw new UnsafePassword(
                `Password should be at least 12 characters, but entered password was only ${password.length} characters long.`
            );
        }
        const salt = bcrypt.genSaltSync(12);
        return new PasswordConfiguration(bcrypt.hashSync(password, salt));
    }

    async check(password: Password): Promise<boolean> {
        return bcrypt.compareSync(password.value, this.hashedPassword);
    }
}