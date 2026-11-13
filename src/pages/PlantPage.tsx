import { usePlantLatestReading } from "@/hooks/readings.hooks";

function PlantPage() {
    const { data: latestReading } = usePlantLatestReading(1);

    return (
        <>
            <div>PlantPage</div>
            <p>{latestReading?.moisture}</p>
        </>
    );
}

export default PlantPage;
