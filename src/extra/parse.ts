import { BadRequest } from "../errors";

export function parseCsvNumbers(label: string) {
    return (raw: unknown): number[] => {
        if (typeof raw !== "string") throw new BadRequest(`${label} must be CSV string`);
        const nums = raw.split(",").map((s) => Number(s.trim()));
        if (nums.some((n) => Number.isNaN(n)))
            throw new BadRequest(`${label} must contain only numbers`);
        return nums;
    };
}
