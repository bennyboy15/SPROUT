import { usePlants } from "@/hooks/plants.hooks";

function HomePage() {
    const { data: plants, isLoading: plantsLoading, isError: plantsError } = usePlants();

    if (plantsLoading) return <p>Loading...</p>;

    if (plantsError) return <p>"Error loading plants..."</p>;

    return (
        <div>
            <p>HomePage</p>
            {plants?.map((p) => (
                <div key={p.id}>{p.name}</div>
            ))}
        </div>
    );
}

export default HomePage;
