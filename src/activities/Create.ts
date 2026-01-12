import { createId, URI } from "common/URI";
import { ASObject } from "objects/Object";
import { ActivityStreamsNS, BaseNS } from "namespaces";
import { Activity } from "./Activity";
import { Actor } from "actors/Actor";
import { NodeObject } from "jsonld";

export class CreateActivity extends Activity {
    readonly type = [new URI(ActivityStreamsNS, "Create")];

    protected createId(): URI {
        return createId(BaseNS, "activities/create");
    }

    serialize(): NodeObject {
        return {
            ...super.serialize(),
            "@type": this.type.map(it => it.long),
            "@id": this.id.long,
        };
    }
}

export class CreateActivityBuilder {
    actor?: Actor;
    object?: ASObject;
    to?: Actor[] = [];
    cc?: Actor[] = [];

    setActor(actor: Actor) {
        this.actor = actor;
        return this;
    }

    setObject(object: ASObject) {
        this.object = object;
        return this;
    }

    addRecipient(recipient: Actor) {
        this.to.push(recipient);
        return this;
    }

    setRecipients(recipients: Actor[]) {
        this.to = recipients;
        return this;
    }

    addCC(recipient: Actor) {
        this.cc.push(recipient);
        return this;
    }

    create() {
        return new CreateActivity({
            actor: this.actor,
            to: this.to,
            object: this.object,
        });
    }
}