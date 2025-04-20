import { Box, Button, Container, Stack, Tab, Tabs, Typography, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameCard from "./components/GameCard";
import api from "./utils/api";
import { preloadAllComponents } from "./routes";
import useUnsavedGames from "./hooks/useUnsavedGames";

function App() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [recentGames, setRecentGames] = useState([]);
    const [personalGames, setPersonalGames] = useState([]);
    const { unsavedGames, handleRetrySave } = useUnsavedGames();

    // Get tab from URL or default to 0
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get("tab");
        return tabParam ? parseInt(tabParam, 10) : 0;
    });

    // Preload all components when the app initializes
    useEffect(() => {
        preloadAllComponents().catch((error) => {
            console.error("Error preloading components:", error);
        });
    }, []);

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

    useEffect(() => {
        fetchGames();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        // Update URL without navigating away from the page
        setSearchParams({ tab: newValue.toString() });
    };

    return (
        <>
            {unsavedGames.length > 0 && (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                        "& .MuiAlert-message": {
                            flex: 1,
                            minWidth: 0, // Allows text to wrap properly
                        },
                        "& .MuiAlert-action": {
                            alignItems: "flex-start", // Aligns buttons to top
                            ml: 1,
                            mt: 0.5,
                        },
                    }}
                    action={
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleRetrySave(unsavedGames[0])}
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                Retry Save
                            </Button>
                        </Stack>
                    }
                >
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                        You have {unsavedGames.length} unsaved game{unsavedGames.length > 1 ? "s" : ""}.
                        {unsavedGames[0]?.gameName ? ` Current game: ${unsavedGames[0].gameName}` : ""}
                    </Typography>
                </Alert>
            )}
            <Box
                style={{
                    display: "flex",
                    position: "fixed",
                    bottom: "74px",
                    maxWidth: "700px",
                    width: "100%",
                    paddingRight: "32px",
                    justifyContent: "end",
                }}
            >
                <div>
                    <Button
                        sx={{ flex: 1 }}
                        size="large"
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            navigate("/new-game");
                        }}
                    >
                        Start new game
                    </Button>
                </div>
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
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
                                <GameCard onDelete={fetchGames} key={game._id} game={game} />
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
                            <GameCard onDelete={fetchGames} key={game._id} game={game} showUser={true} />
                        ))}
                    </Stack>
                )}
            </Stack>
        </>
    );
}

export default App;
