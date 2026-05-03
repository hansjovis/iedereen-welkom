import { LoginCode, LoginCodeConfiguration } from "./LoginCodeCredentials.js";
import { Password, PasswordConfiguration } from "./PasswordCredentials.js";
import { TOTPCode, TOTPConfiguration } from "./TOTPCredentials.js";

export * from "./Authentication.js";
export * from "./Credentials.js";
export * from "./Duration.js";
export * from "./LoginCodeCredentials.js";
export * from "./PasswordCredentials.js";
export * from "./TOTPCredentials.js";
export * from "./Secret.js";

// @todo: Come up with a better solution, e.g. some kind of registry?
export const CredentialTypeMap = {
    "password": Password,
    "totp": TOTPCode,
    "login_code": LoginCode,
}

export const CredentialConfigurationTypeMap = {
    "password": PasswordConfiguration,
    "totp": TOTPConfiguration,
    "login_code": LoginCodeConfiguration,
}