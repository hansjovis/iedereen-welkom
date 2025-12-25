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

    /**
     * Creates a new URI by appending the suffix to the current URI.
     * 
     * E.g. "https://example.net/some-url"
     * `uri.append("/suffix")` => "https://example.net/some-url/suffix"
     *
     * @param suffix The suffix to append to this URI.
     * @returns The new URI, with the suffix appended.
     */
    append(suffix: string): URI {
        return new URI(this.namespace, this.suffix + suffix);
    }

    equals(uri: URI): boolean {
        return this.long === uri.long;
    }

    toString() {
        return this.long;
    }
}

export function createId(namespace: Namespace, type: string) {
    return new URI(namespace, `${type}/${crypto.randomUUID()}`);
}