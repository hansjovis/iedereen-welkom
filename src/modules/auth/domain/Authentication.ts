import { CredentialsConfiguration, UnsafeCredentials } from "./Credentials.js";
import { LoginCodeConfiguration } from "./LoginCodeCredentials.js";

export class Authentication {
    private configMap: Map<string, CredentialsConfiguration> = new Map();

    constructor(configMap: Map<string, CredentialsConfiguration>) {
        this.configMap = configMap;
    }

    static create(): Authentication {
        // Always add login code authentication, even if no other methods are configured.
        return new Authentication(
            new Map().set("login-code", LoginCodeConfiguration.create())
        );
    }

    clear() {
        this.configMap.clear();
    }

    remove(type: string) {
        this.configMap.set(type, undefined);
    }

    configure(config: CredentialsConfiguration) {
        this.configMap.set(config.forType, config);
    }

    get(type: string): CredentialsConfiguration | undefined {
        return this.configMap.get(type);
    }

    get registered(): string[] {
        return [...this.configMap.keys()];
    }

    async check(...credentials: UnsafeCredentials[]): Promise<boolean> {
        if (this.registered.length !== credentials.length) {
            throw new Error(
                `User has ${this.registered.length} authentication methods configured, but only ${credentials.length} were given.`
            );
        }
        const all = await Promise.all(
            credentials.map(it => this.checkSingle(it))
        );
        return all.every(it => it === true);
    }

    private async checkSingle(credential: UnsafeCredentials): Promise<boolean> {
        const config = this.configMap.get(credential.type);
        if (config === undefined) {
            throw new Error(`User does not have a credential of type ${credential.type} configured.`);
        }
        return config.check(credential);
    }
}