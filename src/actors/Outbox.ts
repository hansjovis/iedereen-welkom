import { Activity } from "activities/Activity";
import { OrderedCollection } from "common";

export class Outbox extends OrderedCollection<Activity> {}