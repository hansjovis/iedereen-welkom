import { URI } from "common/URI";

/**
 * Protected credentials are credentials that can be stored safely,
 * for example hashed passwords.
 */
export interface ProtectedCredentials {
    readonly type: URI;
    check(credentials: UnsafeCredentials): boolean;
}

/**
 * Unsafe credentials are credentials that cannot be stored safely and have not been validated.
 *
 * Use this class for credentials that have been entered and need to be validated against protected credentials in storage.
 */
export interface UnsafeCredentials {
    readonly type: URI;
}