import { api } from "@/lib/axios";
import type { Readings } from "@/types/readings.types";
import { useQuery } from "@tanstack/react-query";

export function usePlantLatestReading(plantId: number) {
    return useQuery({
        queryKey: ["readings", plantId],
        queryFn: () => api.get<Readings>(`/plants/${plantId}/readings/latest`).then((r) => r.data),
    });
}

export function usePlantReadings(plantId: number, limit: number = 50) {
    return useQuery({
        queryKey: ["readings", plantId],
        queryFn: () => api.get<Readings[]>(`/plants/${plantId}/readings?limit=${limit}`).then((r) => r.data[0]),
    });
}
