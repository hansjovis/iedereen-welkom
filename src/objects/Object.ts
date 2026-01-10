import { NodeObject } from "jsonld";

import { ActivityStreamsNS } from "namespaces";
import { Identifiable, URI, JSONLDSerializable } from "common";

import { Source } from "./Source";

export abstract class Object implements Identifiable, JSONLDSerializable {
    readonly type = [new URI(ActivityStreamsNS, "Object")];
    readonly id: URI;
    readonly content?: string;
    readonly source?: Source;

    constructor() {
        this.id = this.createId();
    }

    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@type": this.type.map(it => it.long),
            "@id": this.id.long,
        };
    }

    protected abstract createId(): URI;
}