import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import type { Plants } from "../types/plants.types";

export function usePlants() {
    return useQuery({
        queryKey: ["plants"],
        queryFn: () => api.get<Plants[]>("/plants").then((r) => r.data),
    });
}

export function usePlant(plantId: number) {
    return useQuery({
        queryKey: ["plants", plantId],
        queryFn: () => api.get<Plants>(`/plants/${plantId}`).then((r) => r.data),
    });
}
