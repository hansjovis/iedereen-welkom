import { Equatable } from "./Equatable.js";

/**
 * Set that checks membership of items based on equality of value, rather than reference.
 */
export class EqualsSet<Type extends Equatable<Type>> implements Equatable<EqualsSet<Type>> {
    private readonly items: Type[] = [];

    constructor(items: Iterable<Type> = []) {
        this.addAll(items);
    }

    get size() {
        return this.items.length;
    }

    values() {
        return this.items.values();
    }

    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }

    has(item: Type): boolean {
        return [...this].some(it => it.equals(item));
    }

    isSupersetOf(other: EqualsSet<Type>) {
        if (other.size > this.size)
            return false;

        for (const elem of other) {
            if (this.has(elem) === false) return false;
        }
        return true;
    }

    isSubsetOf(other: EqualsSet<Type>): boolean {
        if (other.size < this.size)
            return false;

        for (const elem of this) {
            if (other.has(elem) === false) return false;
        }
        return true;
    }

    equals(other: EqualsSet<Type>): boolean {
        if (this.size !== other.size)
            return false;

        for (const elem of this) {
            if (other.has(elem) === false) return false;
        }
        return true;
    }

    union(other: EqualsSet<Type>): EqualsSet<Type> {
        const items = new EqualsSet(this.items);

        for (const elem of other) {
            if (items.has(elem) === false)
                items.add(elem);
        }

        return items;
    }

    add(item: Type) {
        if (this.has(item) === true)
            return;
        this.items.push(item);
    }

    addAll(items: Iterable<Type>) {
        for (const item of items)
            this.add(item);
    }

    map<Out extends Equatable<Out>>(
        predicate: (t: Type, index: number, array: Type[]) => Out
    ) {
        return new EqualsSet(this.items.map(predicate));
    }
}