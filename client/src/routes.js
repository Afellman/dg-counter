import App from "./App.jsx";
import Game from "./pages/Game.jsx";
import Play from "./pages/Play.jsx";
import Results from "./pages/Results.jsx";
import AllGames from "./pages/AllGames.jsx";
import Latest from "./pages/Latest.jsx";

const ROUTES = [
    {
        path: "/",
        element: App,
        title: "DG Tracker",
    },
    {
        path: "/game",
        element: Game,
        title: "New Game",
    },
    {
        path: "/game/play/:id",
        element: Play,
        title: "Play",
    },
    {
        path: "/game/results/:id",
        element: Results,
        title: "Game Results",
    },
    {
        path: "/all-games",
        element: AllGames,
        title: "All Games",
    },
    {
        path: "/latest",
        element: Latest,
        title: "Latest",
    },
];

export default ROUTES;
