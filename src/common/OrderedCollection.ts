import { ActivityStreamsNS } from "namespaces";
import { JSONLDSerializable } from "./JSONLDSerializable";
import { URI } from "./URI";
import { NodeObject } from "jsonld";

export class OrderedCollectionIterator<T extends JSONLDSerializable> implements Iterator<T> {
    private index: number = 0;

    constructor(private readonly collection: OrderedCollection<T>) {}

    next(): IteratorResult<T> {
        const val = this.collection.get(this.index);

        let done = false;
        if (this.index === this.collection.size) {
            done = true;
        }
                
        this.index += 1;

        return { value: val, done };
    }
}

export type CompareFunction<T> = (item1: T, item2: T) => -1 | 0 | 1;

export class OrderedCollection<T extends JSONLDSerializable> implements JSONLDSerializable, Iterable<T> {
    readonly type = [new URI(ActivityStreamsNS, "OrderedCollection")];
    readonly id?: URI;

    readonly compareFunction: CompareFunction<T>;

    private _items: T[] = [];

    constructor(id?: URI, compare?: CompareFunction<T>) {
        this.compareFunction = compare;
        this.id = id;
    }

    get items(): T[] {
        return this._items;
    }

    get size(): number {
        return this._items.length;
    }

    [Symbol.iterator](): Iterator<T> {
        return new OrderedCollectionIterator(this);
    }

    get(index: number): T {
        return this._items[index];
    }

    add(...items: T[]) {
        this._items.push(...items);
        this._items.sort(this.compareFunction);
    }

    clear(): void {
        this._items = [];
    }

    serialize(): NodeObject {
        return {
            "@context": ActivityStreamsNS.url,
            "@type": this.type.map(it => it.suffix),
            "@id": this.id.long,
            "totalItems": this._items.length,
            "orderedItems": this._items.map(it => it.serialize()),
        }
    }
}