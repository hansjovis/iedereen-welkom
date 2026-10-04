import { Equatable } from "./Equatable.js";

/**
 * Set that checks membership of items based on equality of value, rather than reference.
 */
export class EqualsSet<Type extends Equatable<Type>> extends Set<Type> {
    has(item: Type): boolean {
        return [...this].some(it => it.equals(item));
    }

    hasNot(item: Type): boolean {
        return this.has(item) === false;
    }

    isSupersetOf(other: ReadonlySet<Type>) {
        for (const elem of other) {
            if (this.hasNot(elem))
                return false;
        }
        return true;
    }
}