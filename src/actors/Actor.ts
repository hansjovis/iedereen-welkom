import { Identifiable } from "common/Identifiable";
import { URI } from "common/URI";
import { Inbox } from "./Inbox";
import { Outbox } from "./Outbox";
import { JSONLDSerializable } from "common/JSONLDSerializable";
import { NodeObject } from "jsonld";
import { ActivityStreamsNS } from "namespaces";

export type ActorProps = {
    id: URI,
    name: string,
    summary: string,
    icon?: URI[],
    inbox?: Inbox,
    outbox?: Outbox,
}

export abstract class Actor implements Identifiable, JSONLDSerializable {
    readonly type: URI[] = [new URI(ActivityStreamsNS, "Actor")];
    readonly id: URI;

    readonly name: string;
    readonly summary: string;
    readonly icon: URI[] = [];

    readonly inbox: Inbox;
    readonly outbox: Outbox;

    constructor(props: ActorProps) {
        this.id = props.id;
        this.name = props.name;
        this.summary = props.summary;
        this.icon = props.icon || [];

        this.inbox = props.inbox ?? new Inbox(this.id.append("/inbox"));
        this.outbox = props.outbox ?? new Outbox(this.id.append("/outbox"));
    }

    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@id": this.id.long,
            "@type": this.type.map(it => it.long),

            "name": this.name,
            "summary": this.summary,
            "icon": this.icon.map(it => it.long),

            "inbox": this.inbox.id.long,
            "outbox": this.outbox.id.long,
        }
    }
}