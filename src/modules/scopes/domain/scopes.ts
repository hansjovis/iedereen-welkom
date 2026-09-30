import { Scope } from "./Scope.js"
import { aud, email, exp, iat, iss, sub } from "./claims.js";

export const OpenID = new Scope(
    "openid",
    "OpenID",
    [iss, sub, aud, exp, iat],
);

export const Email = new Scope(
    "email",
    "Email Address",
    [email],
);