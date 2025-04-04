import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Layout from "./components/Layout.jsx";
import "./index.css";
import AllGames from "./pages/AllGames.jsx";
import Game from "./pages/Game.jsx";
import Play from "./pages/Play.jsx";
import Results from "./pages/Results.jsx";
import Latest from "./pages/Latest.jsx";
import theme from "./theme";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Layout>
                    <AuthWrapper>
                        <Routes>
                            <Route path="/" element={<App />} />
                            <Route path="/game" element={<Game />} />
                            <Route path="/game/play/:id" element={<Play />} />
                            <Route path="/game/results/:id" element={<Results />} />
                            <Route path="/all-games" element={<AllGames />} />
                            <Route path="/latest" element={<Latest />} />
                        </Routes>
                    </AuthWrapper>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
