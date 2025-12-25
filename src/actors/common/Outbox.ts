import { Activity } from "activities/common/Activity";
import { OrderedCollection } from "common/OrderedCollection";

export class Outbox extends OrderedCollection<Activity> {}