import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import KaraokeCodePage from "./pages/KaraokeCodePage.jsx";
import KaraokePage from "./pages/KaraokePage.jsx";
import CreateKaraokePage from "./pages/CreateKaraokePage.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="bg-secondary-subtle">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/access-karaoke" element={<KaraokeCodePage />} />
                    <Route path="/access-karaoke/:code" element={<KaraokePage />} />
                    <Route path="/create-karaoke" element={<CreateKaraokePage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;