import { useSyncExternalStore, type ReactNode } from "react";
import { PLANT_KINDS, type Mood, type PlantKind } from "@/lib/plants";

const MOTION: Record<Mood, { sway: string; dur: string }> = {
    happy: { sway: "-4 50 70;4 50 70;-4 50 70", dur: "3s" },
    ok: { sway: "-2 50 70;2 50 70;-2 50 70", dur: "4s" },
    thirsty: { sway: "8 50 70;11 50 70;8 50 70", dur: "5s" },
    soggy: { sway: "-1.5 50 70;1.5 50 70;-1.5 50 70", dur: "2.2s" },
    unknown: { sway: "-2 50 70;2 50 70;-2 50 70", dur: "4s" },
};

const MOUTH: Record<Mood, string> = {
    happy: "M45 86.5Q50 92.5 55 86.5",
    ok: "M46 88.5Q50 90.5 54 88.5",
    thirsty: "M46 91Q50 86.5 54 91",
    soggy: "M44.5 89Q47.25 86.5 50 89Q52.75 91.5 55.5 89",
    unknown: "M46 88.5Q50 90.5 54 88.5",
};

const MOOD_WORDS: Record<Mood, string> = {
    happy: "happy",
    ok: "slightly dry",
    thirsty: "thirsty",
    soggy: "overwatered",
    unknown: "sleepy",
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(cb: () => void) {
    const mql = window.matchMedia(reducedMotionQuery);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
}
function useReducedMotion() {
    return useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia(reducedMotionQuery).matches,
        () => false,
    );
}

function Foliage({ kind }: { kind: PlantKind }) {
    switch (kind) {
        case "cactus":
            return (
                <>
                    <rect x="27" y="32" width="10" height="22" rx="5" fill="#4F9163" />
                    <rect x="27" y="45" width="17" height="9" rx="4.5" fill="#4F9163" />
                    <rect x="63" y="26" width="10" height="20" rx="5" fill="#4F9163" />
                    <rect x="56" y="37" width="17" height="9" rx="4.5" fill="#4F9163" />
                    <rect x="38" y="18" width="24" height="52" rx="12" fill="#5FA673" />
                    <path d="M50 25V64M44 29V62M56 29V62" stroke="#4F9163" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                    <path d="M41 36l-2-1M41 48l-2-1M59 40l2-1M59 52l2-1M30 38l-2-1M70 32l2-1" stroke="#E9F2D8" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="50" cy="17" r="5" fill="#F28FB0" />
                    <circle cx="50" cy="17" r="1.8" fill="#FFD36E" />
                </>
            );
        case "monstera":
            return (
                <>
                    <path d="M50 70C48 58 41 50 33 44M50 70C52 57 59 48 67 40M50 70C50 56 50 42 50 30" stroke="#2F6B43" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                    <ellipse cx="31" cy="42" rx="16" ry="11" transform="rotate(-25 31 42)" fill="#3E8E5A" />
                    <ellipse cx="69" cy="38" rx="16" ry="11" transform="rotate(25 69 38)" fill="#3E8E5A" />
                    <ellipse cx="50" cy="27" rx="13" ry="16" fill="#4A9C66" />
                    <path d="M18 38l7 3M20 47l7-2M82 34l-7 3M80 43l-7-2M39 20l6 4M61 20l-6 4M38 31l6 1M62 31l-6 1" stroke="#F5F3EC" strokeWidth="2" strokeLinecap="round" />
                    <path d="M24 44L38 40M76 40L62 36M50 13V40" stroke="#2F6B43" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                </>
            );
        case "fern":
            return (
                <>
                    <ellipse cx="50" cy="44" rx="6.5" ry="25" transform="rotate(-64 50 70)" fill="#5A9F68" />
                    <ellipse cx="50" cy="44" rx="6.5" ry="25" transform="rotate(64 50 70)" fill="#5A9F68" />
                    <ellipse cx="50" cy="42" rx="7" ry="27" transform="rotate(-32 50 70)" fill="#6FB37A" />
                    <ellipse cx="50" cy="42" rx="7" ry="27" transform="rotate(32 50 70)" fill="#6FB37A" />
                    <ellipse cx="50" cy="40" rx="7.5" ry="29" fill="#7DC089" />
                    <path d="M50 70V14" stroke="#3F7F4E" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M50 70V20" transform="rotate(-32 50 70)" stroke="#3F7F4E" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M50 70V20" transform="rotate(32 50 70)" stroke="#3F7F4E" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M50 70V22" transform="rotate(-64 50 70)" stroke="#3F7F4E" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M50 70V22" transform="rotate(64 50 70)" stroke="#3F7F4E" strokeWidth="1.2" strokeLinecap="round" />
                </>
            );
        case "snake":
            return (
                <>
                    <path d="M37 70C32 52 31 36 35 20C41 34 45 52 46 70Z" fill="#3F7F52" stroke="#C9D86B" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M54 70C56 52 60 38 68 25C68 42 65 56 63 70Z" fill="#3F7F52" stroke="#C9D86B" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M44 70C43 48 46 26 52 8C57 26 57 48 55 70Z" fill="#4A8C5C" stroke="#C9D86B" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M37 56l4-2M36 44l4-2M47 52l6-2M47 38l6-2M48 25l4-2M58 56l4-3M61 44l3-3" stroke="#7FB38A" strokeWidth="1.4" strokeLinecap="round" />
                </>
            );
        case "succulent":
            return (
                <>
                    <ellipse cx="50" cy="48" rx="7.5" ry="15" transform="rotate(-72 50 64)" fill="#6BAA8C" />
                    <ellipse cx="50" cy="48" rx="7.5" ry="15" transform="rotate(72 50 64)" fill="#6BAA8C" />
                    <ellipse cx="50" cy="46" rx="8" ry="16" transform="rotate(-36 50 64)" fill="#7DB89A" />
                    <ellipse cx="50" cy="46" rx="8" ry="16" transform="rotate(36 50 64)" fill="#7DB89A" />
                    <ellipse cx="50" cy="45" rx="8" ry="17" fill="#86C2A3" />
                    <ellipse cx="50" cy="52" rx="5.5" ry="11" transform="rotate(-38 50 64)" fill="#9DD3B6" />
                    <ellipse cx="50" cy="52" rx="5.5" ry="11" transform="rotate(38 50 64)" fill="#9DD3B6" />
                    <ellipse cx="50" cy="53" rx="5" ry="10" fill="#B0DEC4" />
                    <circle cx="50" cy="29" r="2.2" fill="#E7A1B0" />
                    <circle cx="50" cy="31" r="2.2" transform="rotate(-36 50 64)" fill="#E7A1B0" />
                    <circle cx="50" cy="31" r="2.2" transform="rotate(36 50 64)" fill="#E7A1B0" />
                </>
            );
    }
}

interface Props {
    kind: PlantKind;
    mood: Mood;
    /** Rendered width and height in px. */
    size?: number;
    className?: string;
}

/** Animated cartoon plant in a smiling pot; sway, face and effects follow the mood. */
function PlantCharacter({ kind, mood, size = 200, className }: Props) {
    const reduced = useReducedMotion();
    const motion = MOTION[mood];
    // With reduced motion, drop the SMIL nodes and hold the plant at the middle of its sway.
    const anim = (node: ReactNode) => (reduced ? null : node);
    const [from, to] = motion.sway.split(";").map((v) => parseFloat(v));
    const restAngle = (from + to) / 2;
    const label = PLANT_KINDS.find((k) => k.kind === kind)?.label.toLowerCase() ?? "plant";

    return (
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            role="img"
            aria-label={`A ${MOOD_WORDS[mood]} cartoon ${label}`}
            className={className}
            style={{ flexShrink: 0 }}
        >
            {/* key remounts the group so SMIL restarts with the new mood's values */}
            <g key={`${kind}-${mood}-${reduced}`} transform={reduced ? `rotate(${restAngle} 50 70)` : undefined}>
                {anim(<animateTransform attributeName="transform" type="rotate" values={motion.sway} dur={motion.dur} repeatCount="indefinite" />)}
                <Foliage kind={kind} />
            </g>

            {/* Pot with face */}
            <ellipse cx="50" cy="97" rx="22" ry="2.5" fill="#1E2B24" opacity="0.12" />
            <path d="M28 72H72L67 93.5Q66.5 96 64 96H36Q33.5 96 33 93.5Z" fill="#E08A5E" />
            <rect x="24" y="64" width="52" height="10" rx="4" fill="#C9714A" />
            {[42, 58].map((cx) => (
                <ellipse key={cx} cx={cx} cy="81" rx="2.4" ry="3" fill="#2B1D16">
                    {anim(<animate attributeName="ry" values="3;3;0.4;3" keyTimes="0;0.92;0.96;1" dur="4.2s" repeatCount="indefinite" />)}
                </ellipse>
            ))}
            <circle cx="41.2" cy="79.8" r="0.8" fill="#FFFFFF" />
            <circle cx="57.2" cy="79.8" r="0.8" fill="#FFFFFF" />
            <circle cx="36" cy="87" r="3.2" fill="#F4A3A0" opacity="0.85" />
            <circle cx="64" cy="87" r="3.2" fill="#F4A3A0" opacity="0.85" />
            <path d={MOUTH[mood]} stroke="#2B1D16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {mood === "thirsty" && (
                <path d="M71 74C71 74 67.5 79 67.5 81A3.5 3.5 0 0 0 74.5 81C74.5 79 71 74 71 74Z" fill="#7FB5F0">
                    {anim(<animateTransform attributeName="transform" type="translate" values="0 0;0 3;0 0" dur="1.6s" repeatCount="indefinite" />)}
                </path>
            )}

            {mood === "soggy" && (
                <>
                    <path d="M18 58C18 58 15 62 15 64A3 3 0 0 0 21 64C21 62 18 58 18 58Z" fill="#7FB5F0">
                        {anim(<animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />)}
                    </path>
                    <path d="M83 52C83 52 80 56 80 58A3 3 0 0 0 86 58C86 56 83 52 83 52Z" fill="#7FB5F0">
                        {anim(<animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />)}
                    </path>
                </>
            )}

            {mood === "happy" && (
                <>
                    <path d="M80 30l1.5 3.5 3.5 1.5-3.5 1.5L80 40l-1.5-3.5L75 35l3.5-1.5Z" fill="#FFD36E">
                        {anim(<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" />)}
                    </path>
                    <path d="M20 22l1 2.5 2.5 1-2.5 1L20 29l-1-2.5-2.5-1 2.5-1Z" fill="#FFD36E">
                        {anim(<animate attributeName="opacity" values="1;0;1" dur="2.4s" repeatCount="indefinite" />)}
                    </path>
                </>
            )}
        </svg>
    );
}

export default PlantCharacter;
