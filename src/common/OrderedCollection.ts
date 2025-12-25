import { ActivityStreamsNS } from "namespaces";
import { Identifiable } from "./Identifiable";
import { JSONLDSerializable } from "./JSONLDSerializable";
import { URI } from "./URI";
import { NodeObject } from "jsonld";

export class OrderedCollection<T extends JSONLDSerializable> implements Identifiable, JSONLDSerializable {
    readonly type: URI = new URI(ActivityStreamsNS, "OrderedCollection");
    readonly id: URI;

    private _items: T[] = [];

    constructor(id: URI) {
        this.id = id;
    }

    get items(): T[] {
        return this._items;
    }

    add(item: T) {
        this._items.push(item);
    }

    reset() {
        this._items = [];
    }

    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@type": this.type.suffix,
            "@id": this.id.long,
            "totalItems": this._items.length,
            "orderedItems": this._items.map(it => it.serialize()),
        }
    }
}