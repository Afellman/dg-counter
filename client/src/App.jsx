import { Box, Button, Container, Stack, Typography } from "@mui/material";
import TopBar from "./components/TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "./components/GameCard";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Layout from "./components/Layout";

function App() {
    const navigate = useNavigate();
    const [recentGames, setRecentGames] = useState([]);

    useEffect(() => {
        fetch("/api/game/recent")
            .then((res) => res.json())
            .then((data) => setRecentGames(data));
    }, []);

    return (
        <>
            <div style={{ display: "flex" }}>
                <Button
                    sx={{ flex: 1 }}
                    size="large"
                    variant="contained"
                    color="success"
                    onClick={() => {
                        navigate("/game");
                    }}
                >
                    Start new game
                </Button>
            </div>
            <Stack spacing={2} sx={{ width: "100%", marginTop: 4 }}>
                <Typography variant="h5" textAlign="center">
                    Recent Games
                </Typography>
                <Stack spacing={2}>
                    {recentGames?.map((game) => (
                        <GameCard
                            key={game._id}
                            game={game}
                            onNavigate={() => navigate(`/game/results/${game._id}`)}
                        />
                    ))}
                    <Button variant="contained" color="primary" onClick={() => navigate("/all-games")}>
                        View all games
                    </Button>
                </Stack>
            </Stack>
        </>
    );
}

export default App;
