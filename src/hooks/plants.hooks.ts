import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "../lib/axios";
import type { Plants, UpdatePlant } from "../types/plants.types";

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

export function useUpdatePlant() {
    return useMutation({
        mutationFn: ({ plantId, data }: { plantId: number; data: UpdatePlant }) => api.patch(`/plants/${plantId}`, data).then((r) => r.data),
        onError: () => toast.error("Failed to update plant", { duration: 3000 }),
        onSuccess: () => toast.success("Plant updated", { duration: 3000 }),
    });
}
