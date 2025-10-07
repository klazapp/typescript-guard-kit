// lightweight env helpers (kept out of core)
export function getEnv(
    key: string,
    { required = true, asNumber = false }: { required?: boolean; asNumber?: boolean } = {}
) {
    const v = process.env[key];
    if (!v && required) throw new Error(`Missing env ${key}`);
    if (asNumber && v != null) {
        const n = Number(v);
        if (Number.isNaN(n)) throw new Error(`Env ${key} must be a number`);
        return n;
    }
    return v ?? "";
}

/** convenient typed accessor */
export function requireEnv(key: string) {
    const v = process.env[key];
    if (!v) throw new Error(`Missing env ${key}`);
    return v;
}

/** parse comma-separated env into string[] */
export function envCsv(key: string, { required = true }: { required?: boolean } = {}) {
    const v = process.env[key];
    if (!v) {
        if (required) throw new Error(`Missing env ${key}`);
        return [];
    }
    return v.split(",").map((s) => s.trim()).filter(Boolean);
}
