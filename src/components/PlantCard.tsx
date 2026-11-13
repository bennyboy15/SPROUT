import { usePlantLatestReading } from "@/hooks/readings.hooks";
import { MOOD_STYLES, happinessOf, kindOf, moodOf } from "@/lib/plants";
import { cn } from "cn";
import { Droplet, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import PlantCharacter from "./PlantCharacter";
import { Card } from "./ui/card";
import { Progress, ProgressValue } from "./ui/progress";

interface Props {
    plantId: number;
    title: string;
    species?: string;
    idealMin: number;
    idealMax: number;
}

// Track shows the happy zone as a tinted band behind the fill.
const trackClasses = cn(
    "flex-nowrap items-center gap-2",
    "[&_[data-slot=progress-track]]:order-first [&_[data-slot=progress-track]]:h-2",
    // Literal 40%/70% (HAPPY_ZONE) so Tailwind can detect the class.
    "[&_[data-slot=progress-track]]:bg-[linear-gradient(to_right,var(--muted)_40%,color-mix(in_oklch,var(--primary)_20%,var(--muted))_40%_70%,var(--muted)_70%)]",
);

function PlantCard({ plantId, title, species, idealMin, idealMax }: Props) {
    const navigate = useNavigate();
    const { data: latestReading } = usePlantLatestReading(plantId);

    const moisture = latestReading?.moisture;
    const mood = moodOf(idealMin, idealMax, moisture);
    const style = MOOD_STYLES[mood];
    const happiness = happinessOf(moisture);

    return (
        <Card className="flex-row items-center gap-3.5 rounded-3xl p-3 pr-3.5 text-left" onClick={() => navigate(`/plants/${plantId}`)}>
            <div className={cn("flex size-19 shrink-0 items-center justify-center rounded-2xl", style.tint)}>
                <PlantCharacter kind={kindOf(species, plantId)} mood={mood} size={70} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        {species && <span className="truncate text-sm text-muted-foreground">{species}</span>}
                    </div>
                    <span className={cn("inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold", style.chip)}>{style.label}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Droplet className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <Progress value={moisture ?? null} aria-label="Soil moisture" className={cn("flex-1", trackClasses)}>
                        <ProgressValue className="w-9 text-right text-sm font-semibold text-foreground">
                            {(formatted) => (moisture == null ? "—" : formatted)}
                        </ProgressValue>
                    </Progress>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Heart className="size-3.5 text-destructive" aria-hidden="true" />
                    {happiness == null ? "Waiting for a reading" : `${happiness}% happy`}
                </div>
            </div>
        </Card>
    );
}

export default PlantCard;
