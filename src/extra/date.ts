import { BadRequest } from "../errors";
import { toTrimmed } from "../guard";
import { toDateOrNull } from "../guard";

export function toISODateOnly(label: string) {
    return (v: unknown): string => {
        const s = toTrimmed(label)(v);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new BadRequest(`${label} must be YYYY-MM-DD`);
        const d = new Date(s + "T00:00:00Z");
        if (Number.isNaN(+d)) throw new BadRequest(`${label} invalid date`);
        return s;
    };
}

export function toDateRange(labelStart = "start", labelEnd = "end") {
    return (startRaw: unknown, endRaw: unknown) => {
        const s = toDateOrNull(startRaw);
        const e = toDateOrNull(endRaw);
        if (!s || !e) throw new BadRequest(`Both ${labelStart} and ${labelEnd} required`);
        if (s > e) throw new BadRequest(`${labelStart} must be <= ${labelEnd}`);
        return { start: s, end: e };
    };
}

