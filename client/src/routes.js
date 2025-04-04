import { lazy } from "react";

// Use lazy loading for components
const App = lazy(() => import("./App.jsx"));
const Game = lazy(() => import("./pages/Game.jsx"));
const Play = lazy(() => import("./pages/Play.jsx"));
const Results = lazy(() => import("./pages/Results.jsx"));
const AllGames = lazy(() => import("./pages/AllGames.jsx"));
const MyGames = lazy(() => import("./pages/MyGames.jsx"));
const Latest = lazy(() => import("./pages/Latest.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));

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
        path: "/my-games",
        element: MyGames,
        title: "My Games",
    },
    {
        path: "/latest",
        element: Latest,
        title: "Latest",
    },
    {
        path: "/account",
        element: Account,
        title: "Account",
    },
];

export default ROUTES;
