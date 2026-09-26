import { UnsafeCredentials } from "./Credentials.js";
import { LoginCode } from "./LoginCodeCredentials.js";
import { Password } from "./PasswordCredentials.js";
import { TOTPCode } from "./TOTPCredentials.js";

export * from "./Authentication.js";
export * from "./Credentials.js";
export * from "./Duration.js";
export * from "./LoginCodeCredentials.js";
export * from "./PasswordCredentials.js";
export * from "./TOTPCredentials.js";
export * from "./Secret.js";

const AvailableCredentials: string[] = [
    "password",
    "totp",
    "login_code",
];

// @todo: Come up with a better solution, e.g. some kind of registry?
const CredentialTypeMap = {
    password: Password,
    totp: TOTPCode,
    login_code: LoginCode,
};

type CredentialMap = {
    password?: string,
    totp?: string,
    login_code?: string,
};

export function parseEnteredCredentials(credentialMap: CredentialMap) {
    const credentials: UnsafeCredentials[] = [];
    for(const [type, value] of Object.entries(credentialMap)) {
        if (AvailableCredentials.includes(type))
            credentials.push(new CredentialTypeMap[type](value));
    }
    return credentials;
}