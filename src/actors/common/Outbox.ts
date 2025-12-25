import { URI } from "common/URI";
import { Identifiable } from "common/Identifiable";
import { Activity } from "activities/common/Activity";
import { ActivityStreamsNS } from "namespaces";

export class Outbox implements Identifiable {
    readonly type = new URI(ActivityStreamsNS, "OrderedCollection");
    readonly id: URI;
    readonly contents: Activity[];

    post(activity: Activity) {
        this.contents.push(activity);
    }

    get(): Activity[] {
        return this.contents;
    }
}