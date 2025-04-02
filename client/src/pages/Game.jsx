import { Box, Button, Container, OutlinedInput, Stack, Typography, InputLabel } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Game = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [gameName, setGameName] = useState("");
    const [holes, setHoles] = useState(18);

    const addPlayer = () => {
        setPlayers([...players, playerName]);
        setPlayerName("");
    };

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const startGame = async () => {
        const newGame = await fetch("/api/game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ players, gameName, holes }),
        });
        const game = await newGame.json();

        navigate(`/game/play/${game._id}`);
    };

    return (
        <Stack spacing={2}>
            <Box sx={{ backgroundColor: "#eee", padding: "2rem" }}>
                <Typography variant="h3" textAlign="center">
                    Game
                </Typography>
            </Box>
            <Container sx={{ display: "flex", justifyContent: "center" }}>
                <Stack spacing={2}>
                    <Box sx={{ backgroundColor: "#eee", padding: "1rem", borderRadius: "4px" }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <InputLabel>Game Name</InputLabel>
                                <OutlinedInput
                                    placeholder="Game name"
                                    value={gameName}
                                    onChange={(e) => setGameName(e.target.value)}
                                />
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <InputLabel>Length</InputLabel>
                                <OutlinedInput
                                    placeholder="Length"
                                    value={holes}
                                    onChange={(e) => setHoles(e.target.value)}
                                />
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ backgroundColor: "#eee", padding: "1rem", borderRadius: "4px" }}>
                        <Stack direction="row" spacing={2}>
                            <OutlinedInput
                                placeholder="Player name"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    addPlayer();
                                }}
                            >
                                Add player
                            </Button>
                        </Stack>
                    </Box>
                    {players.map((player, i) => (
                        <Stack direction="row" justifyContent="space-between">
                            <Typography textAlign="center">
                                Player {i + 1}:{" "}
                                <Typography component="span" variant="body1" fontWeight="bold">
                                    {player}
                                </Typography>
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    removePlayer(i);
                                }}
                            >
                                x
                            </Button>
                        </Stack>
                    ))}
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            sx={{ padding: "1rem", width: "100%" }}
                            disabled={players.length === 0}
                            onClick={() => {
                                startGame();
                            }}
                        >
                            Start Game
                        </Button>
                    </Box>
                </Stack>
            </Container>
        </Stack>
    );
};

export default Game;
