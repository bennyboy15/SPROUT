export type Mood = "happy" | "ok" | "thirsty" | "soggy" | "unknown";

export function moodOf(idealMin: number, idealMax: number, moisture?: number): Mood {
    if (moisture == null) return "unknown";
    if (moisture < idealMin) return "thirsty";
    if (moisture >= idealMin && moisture <= idealMax) return "happy";
    return "soggy";
}

export function happinessOf(moisture?: number): number | undefined {
    if (moisture == null) return undefined;
    return Math.max(0, Math.round(100 - Math.abs(moisture - 55) * 2));
}

export const MOOD_STYLES: Record<Mood, { label: string; chip: string; tint: string; segment: string }> = {
    happy: { label: "Happy", chip: "bg-primary/15 text-primary", tint: "bg-primary/10", segment: "bg-primary" },
    ok: { label: "A bit dry", chip: "bg-chart-1/30 text-chart-5", tint: "bg-chart-1/15", segment: "bg-chart-2" },
    thirsty: { label: "Thirsty", chip: "bg-destructive/15 text-destructive", tint: "bg-destructive/10", segment: "bg-destructive" },
    soggy: { label: "Too wet", chip: "bg-secondary text-secondary-foreground", tint: "bg-secondary", segment: "bg-ring" },
    unknown: { label: "No reading", chip: "bg-muted text-muted-foreground", tint: "bg-muted", segment: "bg-muted" },
};
