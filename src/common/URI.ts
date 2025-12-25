import { Namespace } from "./Namespace";

export class URI {
    constructor(
        public readonly namespace: Namespace,
        public readonly suffix: string,
    ) {}

    get short() {
        return this.namespace.prefix + ":" + this.suffix;
    }

    get long() {
        return this.namespace.url + this.suffix;
    }

    toString() {
        return this.long;
    }
}

export function createId(namespace: Namespace, type: string) {
    return new URI(namespace, `${type}/${crypto.randomUUID()}`);
}