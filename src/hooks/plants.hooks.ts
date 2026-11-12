import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { Plants } from "../types/plants.types";

export function usePlants() {
    return useQuery({
        queryKey: ["plants"],
        queryFn: () => api.get<Plants[]>("/plants").then((r) => r.data),
    });
}
