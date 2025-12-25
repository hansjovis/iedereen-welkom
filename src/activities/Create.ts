import { createId, URI } from "common/URI";
import { Object } from "objects/common/Object";
import { ActivityStreamsNS, BaseNS } from "namespaces";
import { Activity } from "./common/Activity";
import { Actor } from "actors/common/Actor";
import { NodeObject } from "jsonld";

export class CreateActivity extends Activity {
    readonly type = new URI(ActivityStreamsNS, "Create");

    protected createId(): URI {
        return createId(BaseNS, "activities/create");
    }

    serialize(): NodeObject {
        return {
            ...super.serialize(),
            "@type": this.type.long,
            "@id": this.id.long,
        };
    }
}

export class CreateActivityBuilder {
    actor?: Actor;
    object?: Object;
    to?: Actor[] = [];
    cc?: Actor[] = [];

    setActor(actor: Actor) {
        this.actor = actor;
    }

    setObject(object: Object) {
        this.object = object;
    }

    addRecipient(recipient: Actor) {
        this.to.push(recipient);
    }

    setRecipients(recipients: Actor[]) {
        this.to = recipients;
    }

    addCC(recipient: Actor) {
        this.cc.push(recipient);
    }

    create() {
        return new CreateActivity({
            actor: this.actor,
            to: this.to,
            object: this.object,
        });
    }
}