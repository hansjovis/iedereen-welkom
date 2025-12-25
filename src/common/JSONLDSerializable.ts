import { JsonLdDocument, NodeObject } from "jsonld";

export interface JSONLDSerializable {
    serialize(): NodeObject;
}