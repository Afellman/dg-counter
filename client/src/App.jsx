import { Box, Button, Container, Stack, Typography } from "@mui/material";
import TopBar from "./components/TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "./components/GameCard";

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
            <TopBar />
            <Stack spacing={2}>
                <Box sx={{ backgroundColor: "red", padding: "2rem" }}>
                    <Typography variant="h3" textAlign="center">
                        DG Tracker
                    </Typography>
                </Box>
                <Container>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigate("/game");
                        }}
                    >
                        Start new game
                    </Button>
                    <Stack spacing={2} sx={{ width: "100%", marginTop: 4 }}>
                        <Typography variant="h5" textAlign="center">
                            Recent Games
                        </Typography>
                        <Box sx={{ padding: "1rem" }}>
                            <Stack spacing={2}>
                                {recentGames?.map((game) => (
                                    <GameCard
                                        key={game._id}
                                        game={game}
                                        onNavigate={() => navigate(`/game/results/${game._id}`)}
                                    />
                                ))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/all-games")}
                                >
                                    View all games
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Stack>
        </>
    );
}

export default App;
