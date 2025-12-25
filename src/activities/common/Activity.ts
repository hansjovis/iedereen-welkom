import { URI } from "common/URI";
import { Object } from "objects/common/Object";
import { Identifiable } from "common/Identifiable";
import { Actor } from "actors/common/Actor";
import { ActivityStreamsNS, BaseNS } from "namespaces";
import { JSONLDSerializable } from "common/JSONLDSerializable";
import { JsonLdDocument, NodeObject } from "jsonld";

export type ActivityProps = {
    id?: URI,
    actor: Actor,
    to: Actor[],
    cc?: Actor[],
    object: Object,
}

export abstract class Activity implements Identifiable, JSONLDSerializable {
    readonly id: URI;
    readonly type: URI;
    readonly actor: Actor;
    readonly to: Actor[];
    readonly cc?: Actor[];
    readonly object: Object;

    constructor(props: ActivityProps) {
        this.id = props.id || this.createId();
    }

    /**
     * Create a new ID for this activity.
     */
    protected abstract createId(): URI;

    /**
     * Serialize this activity to JSONLD.
     */
    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@type": this.type.suffix,
            "@id": this.id.long,
            "actor": this.actor.id.long,
            "to": this.to.map(it => it.id.long),
            "cc": this.cc.map(it => it.id.long),
            "object": this.object.serialize(),
        };
    }
}