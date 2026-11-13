import { RANGES, type RangeKey } from "@/lib/readings";
import type { Readings } from "@/types/readings.types";

interface Props {
    readings: Readings[];
    range: RangeKey;
    idealMin: number;
    idealMax: number;
}

const L = 30;
const T = 10;
const PW = 302;
const PH = 150;
const yOf = (v: number) => T + (1 - v / 100) * PH;

/** Averages readings into fixed time buckets across the selected window, ending at the newest reading. */
function bucketed(readings: Readings[], range: RangeKey) {
    const R = RANGES[range];
    const end = Date.parse(readings[readings.length - 1].recordedAt);
    const start = end - R.hours * 3_600_000;
    const bucketMs = R.bucketMin * 60_000;

    const buckets = new Map<number, { sum: number; n: number }>();
    for (const r of readings) {
        const t = Date.parse(r.recordedAt);
        if (t < start) continue;
        const b = Math.floor((end - t) / bucketMs);
        const cur = buckets.get(b) ?? { sum: 0, n: 0 };
        buckets.set(b, { sum: cur.sum + r.moisture, n: cur.n + 1 });
    }

    return [...buckets.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([b, { sum, n }]) => {
            const t = end - b * bucketMs;
            return { v: sum / n, x: L + ((t - start) / (end - start)) * PW };
        });
}

function MoistureChart({ readings, range, idealMin, idealMax }: Props) {
    const R = RANGES[range];

    if (readings.length === 0) {
        return <p className="py-12 text-center text-sm text-muted-foreground">No readings yet.</p>;
    }

    const pts = bucketed(readings, range).map((p) => ({ ...p, y: yOf(p.v) }));
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    const first = pts[0];
    const last = pts[pts.length - 1];
    const area = `${line} L${last.x.toFixed(1)} ${T + PH} L${first.x.toFixed(1)} ${T + PH} Z`;
    const vals = pts.map((p) => p.v);
    const low = Math.round(Math.min(...vals));
    const high = Math.round(Math.max(...vals));
    const now = Math.round(readings[readings.length - 1].moisture);

    return (
        <>
            <svg
                viewBox="0 0 340 170"
                className="block w-full"
                role="img"
                aria-label={`Moisture over the last ${R.start.replace(" ago", "")}, from ${low}% to ${high}%, now ${now}%`}
            >
                <rect x={L} y={yOf(idealMax)} width={PW} height={yOf(idealMin) - yOf(idealMax)} className="fill-primary/12" />
                <path d={`M${L} 10H332M${L} 85H332M${L} 160H332`} className="stroke-border" strokeWidth="1" />
                {[
                    [14, "100"],
                    [89, "50"],
                    [164, "0"],
                ].map(([y, t]) => (
                    <text key={t} x="24" y={y} textAnchor="end" fontSize="10" className="fill-muted-foreground">
                        {t}
                    </text>
                ))}
                <text x="326" y={yOf(idealMax) + 13} textAnchor="end" fontSize="10" fontWeight="600" className="fill-primary">
                    Happy zone
                </text>
                <path d={area} className="fill-water/10" />
                <path d={line} fill="none" className="stroke-water" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
                <circle cx={last.x} cy={last.y} r="7" className="fill-water/20" />
                <circle cx={last.x} cy={last.y} r="4" className="fill-water stroke-card" strokeWidth="2" />
            </svg>

            <div className="flex justify-between pl-7.5 text-xs text-muted-foreground">
                <span>{R.start}</span>
                <span>{R.mid}</span>
                <span>Latest</span>
            </div>

            <div className="flex justify-between border-t border-border pt-2.5 text-sm text-foreground/80">
                <span>{R.note}</span>
                <span>
                    Low {low}% · High {high}%
                </span>
            </div>
        </>
    );
}

export default MoistureChart;
