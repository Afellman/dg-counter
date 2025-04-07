import { Stack, Typography, Tabs, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import Layout from "../components/Layout";
import api from "../utils/api";

const AllGames = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [games, setGames] = useState([]);
    const [personalGames, setPersonalGames] = useState([]);

    // Get tab from URL or default to 0
    const [activeTab, setActiveTab] = useState(() => {
        const tabParam = searchParams.get("tab");
        return tabParam ? parseInt(tabParam, 10) : 0;
    });

    useEffect(() => {
        const fetchGames = async () => {
            try {
                // Fetch all public games
                const publicData = await api.get("/api/game/all");
                setGames(publicData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

                // Fetch personal games
                const personalData = await api.get("/api/game/my-games");
                setPersonalGames(personalData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
                <Tab label="My Games" />
                <Tab label="All Games" />
            </Tabs>

            {activeTab === 0 ? (
                // Personal games tab
                <Stack spacing={2}>
                    <Typography variant="h5">My Games</Typography>
                    {personalGames.length === 0 ? (
                        <Typography variant="body1">You haven't created any games yet.</Typography>
                    ) : (
                        personalGames.map((game) => <GameCard key={game._id} game={game} />)
                    )}
                </Stack>
            ) : (
                // All games tab
                <Stack spacing={2}>
                    <Typography variant="h5">All Games</Typography>
                    {games.map((game) => (
                        <GameCard
                            key={game._id}
                            game={game}
                            showUser={true}
                            onNavigate={() => navigate(`/game/results/${game._id}`)}
                        />
                    ))}
                </Stack>
            )}
        </>
    );
};

export default AllGames;
