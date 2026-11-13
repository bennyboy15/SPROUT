export type Plants = {
    id: number;
    name: string;
    idealMin: number;
    idealMax: number;
    species?: string;
};

export type UpdatePlant = Partial<Omit<Plants, "id">>;
