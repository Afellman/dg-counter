import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Stack, Typography, Container, Button } from "@mui/material";
import TopBar from "../components/TopBar";

const Results = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [searchParams] = useSearchParams();
    const back = searchParams.get("back");

    useEffect(() => {
        fetch(`/api/game/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setGame(data);
            });
    }, [id]);

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <TopBar back={back} />
            <Stack spacing={2}>
                <Box sx={{ backgroundColor: "#eee", padding: "2rem" }}>
                    <Typography variant="h3" textAlign="center">
                        {game.gameName} Results
                    </Typography>
                </Box>
                <Container>
                    <Box sx={{ display: "flex" }}>
                        {/* Header row with player names and total scores */}
                        <Box sx={{ width: "75px", flexShrink: 0 }}>{/* Empty space for hole numbers */}</Box>
                        {game.players.map((player) => {
                            const totalScore = player.scores.reduce((acc, curr) => {
                                const hole = game.holes.find((h) => h.number === curr.hole);
                                return acc + ((curr.strokes || 0) - hole.par);
                            }, 0);

                            return (
                                <Box key={player._id} sx={{ flex: 1, textAlign: "center" }}>
                                    <Typography variant="h6">{player.name}</Typography>
                                    <Typography variant="subtitle1">
                                        {totalScore > 0 ? "+" : ""}
                                        {totalScore}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Hole rows */}
                    {game.holes.map((hole) => (
                        <Box key={hole.number} sx={{ display: "flex", marginY: 1 }}>
                            <Box sx={{ width: "75px", display: "flex", alignItems: "center" }}>
                                <Typography variant="body1">
                                    H{hole.number} (P{hole.par})
                                </Typography>
                            </Box>
                            {game.players.map((player) => {
                                const score = player.scores.find((s) => s.hole === hole.number);
                                const strokes = score?.strokes || 0;
                                const relativeToPar = strokes - hole.par;

                                return (
                                    <Box
                                        key={player._id}
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                backgroundColor:
                                                    relativeToPar === 0
                                                        ? "#fff"
                                                        : relativeToPar > 0
                                                        ? "#ffebee"
                                                        : "#e8f5e9",
                                                borderRadius: "4px",
                                                padding: "4px 12px",
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography variant="body1" fontWeight="bold">
                                                {strokes}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}
                </Container>
            </Stack>
        </>
    );
};

export default Results;
