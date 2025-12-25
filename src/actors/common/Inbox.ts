import { URI } from "common/URI";
import { Identifiable } from "common/Identifiable";
import { Activity } from "activities/common/Activity";
import { ActivityStreamsNS } from "namespaces";
import { JSONLDSerializable } from "common/JSONLDSerializable";
import { JsonLdDocument, NodeObject } from "jsonld";

export class Inbox implements Identifiable, JSONLDSerializable {
    readonly type = new URI(ActivityStreamsNS, "OrderedCollection");
    readonly id: URI;
    readonly contents: Activity[];

    post(activity: Activity) {
        this.contents.push(activity);
    }

    get(): Activity[] {
        return this.contents;
    }

    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@type": this.type.suffix,
            "@id": this.id.long,
        }
    }
}