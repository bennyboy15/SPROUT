import { Route, Routes } from "react-router";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlantPage from "./pages/PlantPage";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/plants/:id" element={<PlantPage />} />
            </Route>
        </Routes>
    );
}

export default App;
