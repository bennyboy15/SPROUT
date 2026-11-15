import { api } from "@/lib/axios";
import type { Readings } from "@/types/readings.types";
import { queryOptions, useQuery } from "@tanstack/react-query";

/** Shared so PlantCard and HomePage's useQueries hit the same cache entry. */
export function latestReadingQuery(plantId: number) {
    return queryOptions({
        queryKey: ["readings", plantId, "latest"],
        queryFn: () => api.get<Readings>(`/plants/${plantId}/readings/latest`).then((r) => r.data),
    });
}

export function usePlantLatestReading(plantId: number) {
    return useQuery(latestReadingQuery(plantId));
}

/** Readings sorted oldest → newest, whatever order the API returns them in. */
export function usePlantReadings(plantId: number, limit: number = 50) {
    return useQuery({
        queryKey: ["readings", plantId, "list", limit],
        queryFn: () =>
            api
                .get<Readings[]>(`/plants/${plantId}/readings?limit=${limit}`)
                .then((r) => [...r.data].sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt))),
    });
}
