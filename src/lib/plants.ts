export type Mood = "happy" | "thirsty" | "soggy" | "unknown";

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
    thirsty: { label: "Thirsty", chip: "bg-destructive/15 text-destructive", tint: "bg-destructive/10", segment: "bg-destructive" },
    soggy: { label: "Too wet", chip: "bg-secondary text-secondary-foreground", tint: "bg-secondary", segment: "bg-ring" },
    unknown: { label: "No reading", chip: "bg-muted text-muted-foreground", tint: "bg-muted", segment: "bg-muted" },
};

export type PlantKind = "cactus" | "monstera" | "fern" | "snake" | "succulent";

export const PLANT_KINDS: { kind: PlantKind; label: string }[] = [
    { kind: "fern", label: "Fern" },
    { kind: "monstera", label: "Monstera" },
    { kind: "cactus", label: "Cactus" },
    { kind: "snake", label: "Snake plant" },
    { kind: "succulent", label: "Succulent" },
];

const SPECIES_KEYWORDS: [RegExp, PlantKind][] = [
    [/cact|opuntia|aloe|agave/i, "cactus"],
    [/monstera|philodendron|pothos|deliciosa/i, "monstera"],
    [/fern|nephrolepis|palm/i, "fern"],
    [/snake|sansevieria|dracaena|zz/i, "snake"],
    [/succulent|echeveria|jade|crassula|haworthia|sedum/i, "succulent"],
];

/** Picks a character from the species; unknown species get a stable kind from the id. */
export function kindOf(species: string | undefined, id: number): PlantKind {
    const match = species && SPECIES_KEYWORDS.find(([re]) => re.test(species));
    return match ? match[1] : PLANT_KINDS[Math.abs(id) % PLANT_KINDS.length].kind;
}
