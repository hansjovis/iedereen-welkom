import { JSONLDSerializable } from "common/JSONLDSerializable";
import { OrderedCollection } from "common/OrderedCollection";
import { URI } from "common/URI";
import { NodeObject } from "jsonld";
import { BaseNS } from "namespaces";

class Item implements JSONLDSerializable {
    constructor(public readonly value: string) {}

    serialize(): NodeObject {
        return {
            "value": this.value,
        };
    }
}

describe("An Ordered Collection", () => {
    it("can have items added to it in the right order", () => {
        const collection = new OrderedCollection<Item>(
            new URI(BaseNS, "collections/example-collection"),
            (item1, item2) => {
                if (item1.value < item2.value)
                    return -1;
                if (item2.value < item1.value)
                    return 1;
                return 0;
            },
        );

        expect(collection.size).toEqual(0);

        const item1 = new Item("1");
        const item2 = new Item("3");
        collection.add(item1, item2);

        expect(collection.size).toEqual(2);
        expect(collection.get(0)).toEqual(item1);
        expect(collection.get(1)).toEqual(item2);

        collection.add(new Item("2"));

        expect(collection.serialize()).toEqual({
            "@context": "https://www.w3.org/ns/activitystreams#",
            "@type": [ "OrderedCollection" ],
            "@id": "https://example.net/collections/example-collection",
            totalItems: 3,
            orderedItems: [ { value: "1" }, { value: "2" }, { value: "3" } ],
        });
    });

    it("can be iterated over", () => {
        const collection = new OrderedCollection<Item>(new URI(BaseNS, "collections/example-collection"));

        const item1 = new Item("1");
        const item2 = new Item("2");
        collection.add(item1, item2);

        for (const item of collection) {
            expect(item.value).toBeDefined();
        }
    });

    it("can be cleared of items", () => {
        const collection = new OrderedCollection<Item>(new URI(BaseNS, "collections/example-collection"));

        const item1 = new Item("1");
        const item2 = new Item("2");
        collection.add(item1, item2);

        expect(collection.size).toEqual(2);

        collection.clear();

        expect(collection.size).toEqual(0);
    });
});