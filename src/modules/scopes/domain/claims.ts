import { Claim } from "./Claim.js";

export const iss = new Claim("iss", "Issuer");
export const sub = new Claim("sub", "Subject");
export const aud = new Claim("aud", "Audience");
export const exp = new Claim("exp", "Expiration Time");
export const iat = new Claim("iat", "Issued At");

export const email = new Claim("email", "Your email address");