import MoistureChart from "@/components/MoistureChart";
import PlantCharacter from "@/components/PlantCharacter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlant, useUpdatePlant } from "@/hooks/plants.hooks";
import { usePlantLatestReading, usePlantReadings } from "@/hooks/readings.hooks";
import { usePlantPrefs } from "@/lib/plantPrefs";
import { MOOD_STYLES, PLANT_KINDS, happinessOf, kindOf, moodOf, type Mood } from "@/lib/plants";
import { RANGES, type RangeKey } from "@/lib/readings";
import type { Readings } from "@/types/readings.types";
import { cn } from "cn";
import { ChevronLeft, Droplet, Save } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

// A week of 5-minute readings covers every chart range and the 24h change.
const WEEK_OF_READINGS = 7 * 24 * 12;

const SPEECH: Record<Mood, string> = {
    happy: "Feeling great! My soil is just right.",
    thirsty: "I'm parched! Could I have some water, please?",
    soggy: "My roots are soaking. Let me dry out for a bit.",
    unknown: "Waiting for my first reading…",
};

const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

function signed(n: number, digits = 0) {
    return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}`;
}

/** Moisture now minus the reading closest to 24h before the latest one; undefined without a day of history. */
function change24h(readings: Readings[]) {
    if (readings.length < 2) return undefined;
    const latest = readings[readings.length - 1];
    const target = Date.parse(latest.recordedAt) - 24 * 3_600_000;
    const past = readings.find((r) => Date.parse(r.recordedAt) >= target);
    if (!past || past === latest || Date.parse(past.recordedAt) - target > 30 * 60_000) return undefined;
    return Math.round(latest.moisture - past.moisture);
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <Card className="gap-1 rounded-2xl p-3 ring-border">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <span className={cn("text-2xl font-semibold text-foreground", className)}>{value}</span>
        </Card>
    );
}

function PlantPage() {
    const plantId = Number(useParams().id);
    const { data: plant, isLoading, isError } = usePlant(plantId);
    const { data: latest } = usePlantLatestReading(plantId);
    const { data: readings = [], isLoading: readingsLoading } = usePlantReadings(plantId, WEEK_OF_READINGS);
    const [prefs, setPrefs] = usePlantPrefs(plantId);
    const [range, setRange] = useState<RangeKey>("24h");

    const { mutate: updatePlant } = useUpdatePlant();

    if (isLoading) return <p className="p-5 text-muted-foreground">Loading...</p>;
    if (isError) return <p className="p-5 text-destructive">Error loading plant...</p>;
    if (!plant) {
        return (
            <div className="flex flex-col items-start gap-3 p-5">
                <p className="text-foreground">We couldn't find that plant.</p>
                <Link to="/" className="text-primary underline">
                    Back to my plants
                </Link>
            </div>
        );
    }

    const name = prefs.name?.trim() || plant.name;
    const kind = prefs.kind ?? kindOf(plant.species, plant.id);
    const moisture = latest?.moisture ?? -1;
    const mood = moodOf(plant.idealMin, plant.idealMax, moisture);
    const style = MOOD_STYLES[mood];
    const happiness = happinessOf(moisture);
    const change = change24h(readings);
    const recent = readings.slice(-6).reverse();
    const olderThan = (i: number) => readings[readings.length - 2 - i];

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4.5 px-5 pt-3 pb-8 text-left">
            <nav className="flex h-12 items-center justify-between">
                <Link
                    to="/"
                    aria-label="Back to my plants"
                    className="flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
                >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                </Link>
                <span className="text-sm font-semibold text-muted-foreground">Plant</span>
                <div className="w-11" />
            </nav>

            <section className="flex flex-col items-center gap-3 text-center">
                <div className={cn("flex size-52.5 items-center justify-center rounded-full", style.tint)}>
                    <PlantCharacter kind={kind} mood={mood} size={184} />
                </div>
                <h1 className="m-0 mt-1 text-4xl leading-tight font-semibold tracking-normal text-foreground">{name}</h1>
                <div className="flex items-center gap-2">
                    {plant.species && <span className="text-sm text-muted-foreground">{plant.species}</span>}
                    <span className={cn("inline-flex h-6.5 items-center rounded-full px-3 text-[13px] font-semibold", style.chip)}>{style.label}</span>
                </div>
                <p className="max-w-75 text-[15px] leading-normal text-foreground/80">“{SPEECH[mood]}”</p>
            </section>

            <section aria-label="Current stats" className="grid grid-cols-3 gap-2.5">
                <Stat label="Moisture" value={moisture == null ? "—" : `${Math.round(moisture)}%`} className="text-water" />
                <Stat label="24h change" value={change == null ? "—" : `${signed(change)}%`} />
                <Stat label="Happiness" value={happiness == null ? "—" : `${happiness}%`} />
            </section>

            <Card aria-label="Moisture trend" className="gap-3 rounded-3xl p-4 ring-border">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="m-0 text-lg font-semibold text-foreground">Moisture trend</h2>
                    <div className="flex gap-0.5 rounded-full bg-muted p-0.75">
                        {(Object.keys(RANGES) as RangeKey[]).map((k) => (
                            <button
                                key={k}
                                type="button"
                                aria-pressed={range === k}
                                onClick={() => setRange(k)}
                                className={cn(
                                    "h-8 min-w-11 cursor-pointer rounded-full px-2.5 text-[13px] font-semibold",
                                    range === k ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-background",
                                )}
                            >
                                {k.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                {readingsLoading ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">Loading readings...</p>
                ) : (
                    <MoistureChart readings={readings} range={range} idealMin={plant.idealMin} idealMax={plant.idealMax} />
                )}
            </Card>

            <Card aria-label="Recent readings" className="gap-1 rounded-3xl p-4 ring-border">
                <div className="mb-1.5 flex items-baseline justify-between">
                    <h2 className="m-0 text-lg font-semibold text-foreground">Recent readings</h2>
                    <span className="text-xs text-muted-foreground">Every 5 min</span>
                </div>
                {recent.length === 0 && <p className="py-2 text-sm text-muted-foreground">No readings yet.</p>}
                {recent.map((r, i) => {
                    const prev = olderThan(i);
                    return (
                        <div key={r.id} className="flex h-11 items-center gap-3 border-b border-border last:border-b-0">
                            <Droplet className="size-4 text-water" aria-hidden="true" />
                            <span className="flex-1 text-sm text-foreground/80">
                                {i === 0 && "Latest · "}
                                {timeFmt.format(new Date(r.recordedAt))}
                            </span>
                            <span className="w-14 text-right text-[13px] text-muted-foreground">{prev ? signed(r.moisture - prev.moisture, 1) : ""}</span>
                            <span className="w-11 text-right text-[15px] font-semibold text-foreground">{Math.round(r.moisture)}%</span>
                        </div>
                    );
                })}
            </Card>

            <Card aria-label="Personalise" className="gap-3.5 rounded-3xl p-4 ring-border">
                <h2 className="m-0 text-lg font-semibold text-foreground">Personalise</h2>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="plant-name" className="text-[13px] font-semibold text-foreground/80">
                        Name
                    </label>
                    <input
                        id="plant-name"
                        type="text"
                        value={prefs.name ?? plant.name}
                        placeholder={plant.name}
                        onChange={(e) => setPrefs({ name: e.target.value })}
                        className="h-11.5 rounded-xl border border-input bg-background px-3.5 text-base font-medium text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <Button onClick={() => updatePlant({ plantId: plant.id, data: { name: prefs.name } })}>
                        Update Plant <Save />
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-[13px] font-semibold text-foreground/80">Character</span>
                    <div className="grid grid-cols-5 gap-1.5">
                        {PLANT_KINDS.map((c) => (
                            <button
                                key={c.kind}
                                type="button"
                                aria-pressed={kind === c.kind}
                                onClick={() => setPrefs({ kind: c.kind })}
                                className={cn(
                                    "flex cursor-pointer flex-col items-center gap-0.5 rounded-2xl border-2 pt-1.5 pb-2 text-[11px] font-medium text-foreground/80",
                                    kind === c.kind ? "border-primary bg-primary/10" : "border-transparent bg-background hover:bg-muted",
                                )}
                            >
                                <PlantCharacter kind={c.kind} mood="happy" size={48} />
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default PlantPage;
