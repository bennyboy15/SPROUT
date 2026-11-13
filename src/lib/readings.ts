/** Chart windows for the moisture trend; readings arrive every 5 minutes. */
export const RANGES = {
    "6h": { hours: 6, bucketMin: 5, start: "6h ago", mid: "3h ago", note: "Every reading" },
    "24h": { hours: 24, bucketMin: 15, start: "24h ago", mid: "12h ago", note: "15-min averages" },
    "7d": { hours: 168, bucketMin: 60, start: "7 days ago", mid: "3.5 days ago", note: "Hourly averages" },
} as const;

export type RangeKey = keyof typeof RANGES;
