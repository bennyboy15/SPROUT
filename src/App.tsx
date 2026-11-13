import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import PlantPage from "./pages/PlantPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plants/:id" element={<PlantPage />} />
        </Routes>
    );
}

export default App;
