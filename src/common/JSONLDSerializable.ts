import { NodeObject } from "jsonld";

export interface JSONLDSerializable {
    serialize(): NodeObject;
}