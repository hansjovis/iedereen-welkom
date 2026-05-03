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
            new Map().set("login_code", LoginCodeConfiguration.create())
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
        return [...this.configMap.values()].map(it => it.forType);
    }

    async check(...credentials: UnsafeCredentials[]): Promise<boolean> {
        if (this.registered.length !== credentials.length) {
            return false;
        }
        const all = await Promise.all(
            credentials.map(it => this.checkSingle(it))
        );
        return all.every(it => it === true);
    }

    private async checkSingle(credential: UnsafeCredentials): Promise<boolean> {
        const config = this.configMap.get(credential.type);
        if (config === undefined) {
            return false;
        }
        return config.check(credential);
    }
}