// src/extra/index.ts
import { toISODateOnly, toDateRange } from "./date";
import { nonEmptyArray, unique } from "./collection";
import { parseCsvNumbers } from "./parse";

export { toISODateOnly, toDateRange } from "./date";
export { nonEmptyArray, unique } from "./collection";
export { parseCsvNumbers } from "./parse";

// optional: grouped namespace
export const guardExtra = {
    toISODateOnly,
    toDateRange,
    nonEmptyArray,
    unique,
    parseCsvNumbers,
} as const;
