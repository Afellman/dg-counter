import TopBar from "../components/TopBar";
import { Container, Typography, Stack, Box } from "@mui/material";
import { useState, useEffect } from "react";
import GameCard from "../components/GameCard";

const AllGames = () => {
    const [games, setGames] = useState([]);
    useEffect(() => {
        fetch("/api/game/all")
            .then((res) => res.json())
            .then((data) => setGames(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))));
    }, []);

    return (
        <>
            <TopBar />
            <Container>
                <Stack spacing={2}>
                    <Typography variant="h3">All Games</Typography>
                    <Stack spacing={2}>
                        {games.map((game) => (
                            <GameCard key={game._id} game={game} back="all-games" />
                        ))}
                    </Stack>
                </Stack>
            </Container>
        </>
    );
};

export default AllGames;
