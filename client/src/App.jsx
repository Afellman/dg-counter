import { Box, Button, Container, Stack, Typography, Tabs, Tab } from "@mui/material";
import TopBar from "./components/TopBar";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameCard from "./components/GameCard";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Layout from "./components/Layout";
import api from "./utils/api";

function App() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [recentGames, setRecentGames] = useState([]);
    const [personalGames, setPersonalGames] = useState([]);

    // Get tab from URL or default to 0
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get("tab");
        return tabParam ? parseInt(tabParam, 10) : 0;
    });

    useEffect(() => {
        const fetchGames = async () => {
            try {
                // Fetch public games
                const publicData = await api.get("/api/game/recent");
                setRecentGames(publicData);

                // Fetch personal games
                const personalData = await api.get("/api/game/my-recent");
                setPersonalGames(personalData);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };

        fetchGames();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        // Update URL without navigating away from the page
        setSearchParams({ tab: newValue.toString() });
    };

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

            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mt: 2 }}>
                <Tab label="My Games" />
                <Tab label="All Games" />
            </Tabs>

            <Stack spacing={2} sx={{ width: "100%", marginTop: 2 }}>
                {activeTab === 0 ? (
                    // Personal games tab
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h5" textAlign="center">
                                My Recent Games
                            </Typography>
                            <Button variant="outlined" color="primary" onClick={() => navigate("/my-games")}>
                                View all my games
                            </Button>
                        </Stack>
                        {personalGames.length === 0 ? (
                            <Typography variant="body1">You haven't created any games yet.</Typography>
                        ) : (
                            personalGames.map((game) => (
                                <GameCard
                                    key={game._id}
                                    game={game}
                                    onNavigate={() => navigate(`/game/results/${game._id}`)}
                                />
                            ))
                        )}
                    </Stack>
                ) : (
                    // Public games tab
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h5" textAlign="center">
                                Recent Games
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => navigate("/all-games?tab=1")}
                            >
                                View all games
                            </Button>
                        </Stack>
                        {recentGames.map((game) => (
                            <GameCard
                                key={game._id}
                                game={game}
                                onNavigate={() => navigate(`/game/results/${game._id}`)}
                                showUser={true}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        </>
    );
}

export default App;
