import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Game from "./pages/Game.jsx";
import Play from "./pages/Play.jsx";
import Results from "./pages/Results.jsx";
import AllGames from "./pages/AllGames.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/game",
        element: <Game />,
    },
    {
        path: "/game/play/:id",
        element: <Play />,
    },
    {
        path: "/game/results/:id",
        element: <Results />,
    },
    {
        path: "/all-games",
        element: <AllGames />,
    },
]);
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
