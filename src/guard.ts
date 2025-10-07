// guard.ts
import { BadRequest } from "./errors";

/* ───────────────────────── core helpers ───────────────────────── */

export function invariant(cond: unknown, msg = "Invariant failed"): asserts cond {
    if (!cond) throw new BadRequest(msg); // or create an Internal class if you prefer
}

export function expect<T>(v: T, msg = "Value missing"): NonNullable<T> {
    if (v == null) throw new BadRequest(msg);
    return v as NonNullable<T>;
}

export function requirePresent<T>(v: T, msg: string): asserts v is NonNullable<T> {
    if (v == null) throw new BadRequest(msg);
}

/* ───────────────────────── converters/parsers ───────────────────────── */

export function toDateOrNull(raw: unknown): Date | null {
    if (raw == null || raw === "") return null;
    const d = raw instanceof Date ? raw : new Date(String(raw));
    return Number.isNaN(d.getTime()) ? null : d;
}

export function toYearOrNull(raw: unknown): number | null {
    if (raw == null || raw === "") return null;
    const d = raw instanceof Date ? raw : new Date(String(raw));
    return Number.isNaN(d.getTime()) ? null : d.getFullYear();
}

export function parseNumberArray(label: string) {
    return (raw: unknown): number[] => {
        let arr: unknown;
        try {
            arr = typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
            throw new BadRequest(`Invalid ${label}: expected array`);
        }
        if (!Array.isArray(arr)) throw new BadRequest(`Invalid ${label}: expected array`);
        const nums = arr.map(Number);
        if (nums.some((n) => Number.isNaN(n))) {
            throw new BadRequest(`${label} must contain numeric ids`);
        }
        return nums;
    };
}

export function oneOf<T extends readonly (string | number)[]>(label: string, allowed: T) {
    return (v: unknown): T[number] => {
        if (allowed.includes(v as any)) return v as T[number];
        throw new BadRequest(`${label} must be one of: ${allowed.join(", ")}`);
    };
}

export function toBool(label: string) {
    return (v: unknown): boolean => {
        if (typeof v === "boolean") return v;
        if (v === "true" || v === "1" || v === 1) return true;
        if (v === "false" || v === "0" || v === 0) return false;
        throw new BadRequest(`${label} must be boolean`);
    };
}

export function toInt(
    label: string,
    { min, max }: { min?: number; max?: number } = {}
) {
    return (v: unknown): number => {
        const n = typeof v === "number" ? v : Number.parseInt(String(v), 10);
        if (!Number.isInteger(n)) throw new BadRequest(`${label} must be an integer`);
        if (min != null && n < min) throw new BadRequest(`${label} >= ${min}`);
        if (max != null && n > max) throw new BadRequest(`${label} <= ${max}`);
        return n;
    };
}

export function toNumber(
    label: string,
    { min, max }: { min?: number; max?: number } = {}
) {
    return (v: unknown): number => {
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isNaN(n)) throw new BadRequest(`${label} must be a number`);
        if (min != null && n < min) throw new BadRequest(`${label} >= ${min}`);
        if (max != null && n > max) throw new BadRequest(`${label} <= ${max}`);
        return n;
    };
}

export function toTrimmed(label: string) {
    return (v: unknown): string => {
        if (typeof v !== "string") throw new BadRequest(`${label} must be string`);
        return v.trim();
    };
}

export function nonEmpty(label: string) {
    return (v: unknown): string => {
        const s = toTrimmed(label)(v);
        if (!s) throw new BadRequest(`${label} must not be empty`);
        return s;
    };
}

export function withLength(
    label: string,
    { min = 0, max = Infinity }: { min?: number; max?: number } = {}
) {
    return (v: unknown): string => {
        const s = toTrimmed(label)(v);
        if (s.length < min) throw new BadRequest(`${label} length >= ${min}`);
        if (s.length > max) throw new BadRequest(`${label} length <= ${max}`);
        return s;
    };
}

export function matches(label: string, re: RegExp, hint?: string) {
    return (v: unknown): string => {
        const s = toTrimmed(label)(v);
        if (!re.test(s)) throw new BadRequest(`${label} invalid${hint ? ` (${hint})` : ""}`);
        return s;
    };
}

// presets (don’t reference `guard` during construction)
export const isUUID = (label = "id") =>
    matches(
        label,
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        "uuid v4"
    );

export const isEmail = (label = "email") =>
    matches(label, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export function parseJSON<T = unknown>(label: string, maxBytes = 1_000_000) {
    return (raw: unknown): T => {
        if (typeof raw !== "string") throw new BadRequest(`${label} must be JSON string`);
        if (raw.length > maxBytes) throw new BadRequest(`${label} too large`);
        try {
            return JSON.parse(raw) as T;
        } catch {
            throw new BadRequest(`${label} is not valid JSON`);
        }
    };
}

export function assertNever(x: never, msg = "Unexpected variant"): never {
    throw new Error(`${msg}: ${String(x)}`);
}

/* ───────────────────────── namespaced export ───────────────────────── */

export const guard = {
    invariant,
    expect,
    require: requirePresent,
    toDate: { orNull: toDateOrNull },
    toYear: { orNull: toYearOrNull },
    parseArray: { number: parseNumberArray },
    oneOf,
    toBool,
    toInt,
    toNumber,
    toTrimmed,
    nonEmpty,
    withLength,
    matches,
    isUUID,
    isEmail,
    parseJSON,
    assertNever,
} as const;


