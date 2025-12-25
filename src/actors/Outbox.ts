import { Activity } from "activities/Activity";
import { OrderedCollection } from "common/OrderedCollection";

export class Outbox extends OrderedCollection<Activity> {}