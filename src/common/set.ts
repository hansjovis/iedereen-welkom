import { Equatable } from "./Equatable.js";

export function difference<T extends Equatable<T>>(set1: T[], set2: T[]): T[] {
    return set1.filter(item1 => !set2.some(item2 => item1.equals(item2)));
}

export function isSuperset<T extends Equatable<T>>(superset: T[], subset: T[]): boolean {
    return difference(subset, superset).length === 0;
}

export function union<T extends Equatable<T>>(set1: T[], set2: T[]): T[] {
    const uniqueItems1 = difference(set1, set2);
    return [...uniqueItems1, ...set2];
}
