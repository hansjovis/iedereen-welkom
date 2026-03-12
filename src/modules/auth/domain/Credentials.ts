/**
 * Configuration for credentials used in authentication.
 * 
 * For example a hashed password or secret.
 */
export interface CredentialsConfiguration {
    readonly forType: string;
    /**
     * Check the given credentials agains the configuration.
     * 
     * @param credentials The credentials to check.
     * @returns A promise indicating whether the given credentials are valid.
     */
    check(credentials: UnsafeCredentials): Promise<boolean>;
}

/**
 * Unsafe credentials are credentials that cannot be stored safely and have not been validated.
 *
 * Use this class for credentials that have been entered and need to be validated against protected credentials in storage.
 */
export interface UnsafeCredentials {
    readonly type: string;
}