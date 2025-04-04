import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import Layout from "../components/Layout";
import api from "../utils/api";

const MyGames = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyGames = async () => {
            try {
                setLoading(true);
                const data = await api.get("/api/game/my-games");
                setGames(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error("Error fetching my games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyGames();
    }, []);

    return (
        <>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : games.length === 0 ? (
                <Typography variant="body1">You haven't created any games yet.</Typography>
            ) : (
                <Stack spacing={2}>
                    {games.map((game) => (
                        <GameCard
                            key={game._id}
                            game={game}
                            onNavigate={() => navigate(`/game/results/${game._id}`)}
                        />
                    ))}
                </Stack>
            )}
        </>
    );
};

export default MyGames;
