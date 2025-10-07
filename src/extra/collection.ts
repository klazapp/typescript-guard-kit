import { BadRequest } from "../errors";

export function nonEmptyArray<T>(label: string) {
    return (arr: T[]): T[] => {
        if (!Array.isArray(arr) || arr.length === 0)
            throw new BadRequest(`${label} must be a non-empty array`);
        return arr;
    };
}

export function unique<T>(label: string, key?: (t: T) => unknown) {
    return (arr: T[]): T[] => {
        const seen = new Set<any>();
        for (const x of arr) {
            const k = key ? key(x) : (x as any);
            if (seen.has(k)) throw new BadRequest(`${label} contains duplicates`);
            seen.add(k);
        }
        return arr;
    };
}

