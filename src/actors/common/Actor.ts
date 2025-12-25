import { Identifiable } from "common/Identifiable";
import { URI } from "common/URI";
import { Inbox } from "./Inbox";
import { Outbox } from "./Outbox";
import { JSONLDSerializable } from "common/JSONLDSerializable";
import { JsonLdDocument, NodeObject } from "jsonld";
import { ActivityStreamsNS } from "namespaces";

export abstract class Actor implements Identifiable, JSONLDSerializable {
    readonly type: URI = new URI(ActivityStreamsNS, "Actor");
    readonly id: URI;
    readonly inbox: Inbox;
    readonly outbox: Outbox;

    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@id": this.id.long,
            "@type": this.type.suffix,
            "inbox": this.inbox.id.long,
            "outbox": this.outbox.id.long,
        }
    }
}