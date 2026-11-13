import { useCallback, useSyncExternalStore } from "react";
import type { PlantKind } from "./plants";

/** Per-plant personalisation kept in this browser until the API can store it. */
export type PlantPrefs = { name?: string; kind?: PlantKind };

const KEY = "sprout:plant-prefs";
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: Record<string, PlantPrefs> = {};

function readAll(): Record<string, PlantPrefs> {
    let raw: string | null;
    try {
        raw = localStorage.getItem(KEY);
    } catch {
        return cached;
    }
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        try {
            cached = raw ? JSON.parse(raw) : {};
        } catch {
            cached = {};
        }
    }
    return cached;
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener("storage", cb);
    return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", cb);
    };
}

const EMPTY: PlantPrefs = {};

export function usePlantPrefs(plantId: number): [PlantPrefs, (patch: PlantPrefs) => void] {
    const prefs = useSyncExternalStore(subscribe, () => readAll()[plantId] ?? EMPTY, () => EMPTY);

    const update = useCallback(
        (patch: PlantPrefs) => {
            const all = readAll();
            const next = { ...all, [plantId]: { ...all[plantId], ...patch } };
            try {
                localStorage.setItem(KEY, JSON.stringify(next));
            } catch {
                // Storage unavailable (private mode etc.): keep the change for this session only.
                cachedRaw = JSON.stringify(next);
                cached = next;
            }
            listeners.forEach((l) => l());
        },
        [plantId],
    );

    return [prefs, update];
}
