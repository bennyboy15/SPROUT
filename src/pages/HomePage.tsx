import Header from "@/components/Header";
import PlantCard from "@/components/PlantCard";
import { usePlants } from "@/hooks/plants.hooks";
import { MOOD_STYLES, happinessOf, moodOf, type Mood } from "@/lib/plants";
import { cn } from "cn";
import { Droplet } from "lucide-react";

function HomePage() {
    const { data: plants = [], isLoading: plantsLoading, isError: plantsError } = usePlants();

    // Least happy first, plants without a reading last.
    const sorted = [...plants].sort((a, b) => (happinessOf(a.moisture) ?? 101) - (happinessOf(b.moisture) ?? 101));
    const happinessValues = sorted.map((p) => happinessOf(p.moisture)).filter((h): h is number => h != null);
    const avg = happinessValues.length ? Math.round(happinessValues.reduce((s, h) => s + h, 0) / happinessValues.length) : undefined;

    const counts = sorted.reduce<Partial<Record<Mood, number>>>((acc, p) => {
        const m = moodOf(p.idealMin, p.idealMax, p.moisture);
        acc[m] = (acc[m] ?? 0) + 1;
        return acc;
    }, {});

    const breakdown = (["happy", "thirsty", "soggy"] as const)
        .filter((m) => counts[m])
        .map((m) => `${counts[m]} ${MOOD_STYLES[m].label.toLowerCase()}`)
        .join(" · ");

    const attention =
        sorted
            .filter((p) => ["thirsty", "soggy"].includes(moodOf(p.idealMin, p.idealMax, p.moisture)))
            .map((p) => (moodOf(p.idealMin, p.idealMax, p.moisture) === "thirsty" ? `${p.name} needs water` : `${p.name} is too wet`))
            .join(" · ") || "Everyone is happy";

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-5 pt-5 pb-8 text-left">
            <Header />

            {plantsLoading && <p className="text-muted-foreground">Loading...</p>}
            {plantsError && <p className="text-destructive">Error loading plants...</p>}

            {!plantsLoading && !plantsError && (
                <>
                    <section aria-label="Garden summary" className="flex flex-col gap-3.5 rounded-3xl bg-primary p-5 text-primary-foreground">
                        <div className="flex items-end justify-between gap-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium opacity-80">Garden happiness</span>
                                <span className="text-5xl leading-none font-semibold">{avg == null ? "—" : `${avg}%`}</span>
                            </div>
                            <span className="max-w-40 text-right text-sm opacity-80">{breakdown}</span>
                        </div>
                        <div className="flex gap-1.5" aria-hidden="true">
                            {sorted.map((p) => (
                                <div
                                    key={p.id}
                                    className={cn(
                                        "h-2.5 flex-1 rounded-full ring-1 ring-primary-foreground/30",
                                        MOOD_STYLES[moodOf(p.idealMin, p.idealMax, p.moisture)].segment,
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Droplet className="size-4" aria-hidden="true" />
                            {attention}
                        </div>
                    </section>

                    <div className="flex items-baseline justify-between">
                        <h2 className="m-0 text-xl font-semibold text-foreground">
                            {sorted.length} {sorted.length === 1 ? "plant" : "plants"}
                        </h2>
                        <span className="text-sm text-muted-foreground">Needs care first</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {sorted.map((p) => (
                            <PlantCard key={p.id} plantId={p.id} title={p.name} species={p.species} idealMin={p.idealMin} idealMax={p.idealMax} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default HomePage;
