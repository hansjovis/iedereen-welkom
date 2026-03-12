import { LoginCode } from "./LoginCodeCredentials.js";
import { Password } from "./PasswordCredentials.js";
import { TOTPCode } from "./TOTPCredentials.js";

export * from "./Credentials.js";
export * from "./Duration.js";
export * from "./LoginCodeCredentials.js";
export * from "./PasswordCredentials.js";
export * from "./TOTPCredentials.js";

// @todo: Come up with a better solution, e.g. some kind of registry?
export const CredentialTypeMap = {
    "password": Password,
    "totp": TOTPCode,
    "login-code": LoginCode,
}