import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import Layout from "../components/Layout";

const AllGames = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch("/api/game/all")
            .then((res) => res.json())
            .then((data) => setGames(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))));
    }, []);

    return (
        <Stack spacing={2}>
            {games.map((game) => (
                <GameCard key={game._id} game={game} back="all-games" />
            ))}
        </Stack>
    );
};

export default AllGames;
