import { Remove } from "@mui/icons-material";
import { Box, Button, InputLabel, OutlinedInput, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CourseSearch from "../components/CourseSearch";
import useGame from "../hooks/useGame";
import fantasyGameNames from "../utils/gameNames";

const Game = () => {
    const { startGame } = useGame();
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [gameName, setGameName] = useState("");
    const [holes, setHoles] = useState(18);
    const [courseName, setCourseName] = useState("");

    const addPlayer = () => {
        setPlayers([...players, playerName]);
        setPlayerName("");
    };

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const onGenerateGameName = async () => {
        // Select a random name from the list
        const randomName = fantasyGameNames[Math.floor(Math.random() * fantasyGameNames.length)];
        setGameName(randomName);
    };

    const onChangeLength = (e) => {
        const value = e.target.value;

        if (value > 36) {
            return setHoles(36);
        }

        setHoles(value);
    };

    const onBlurLength = () => {
        if (holes < 1) {
            setHoles(1);
        }
    };

    return (
        <>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <InputLabel>Add Players</InputLabel>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <OutlinedInput
                            sx={{ flex: 1 }}
                            placeholder="Player name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <Button
                            variant="outlined"
                            disabled={playerName === ""}
                            onClick={() => {
                                addPlayer();
                            }}
                        >
                            Add player
                        </Button>
                    </Stack>
                </Stack>
                <GamePreviewCard
                    onRemovePlayer={removePlayer}
                    gameName={gameName}
                    courseName={courseName}
                    holes={holes}
                    players={players}
                />
                <Stack spacing={1}>
                    <Stack spacing={1}>
                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <InputLabel>Game Name</InputLabel>
                            <Button variant="text" color="primary" onClick={onGenerateGameName}>
                                Get Random Name
                            </Button>
                        </Stack>
                        <OutlinedInput
                            placeholder="Game name"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                        />
                    </Stack>
                    <Stack spacing={1}>
                        <InputLabel>Length</InputLabel>
                        <OutlinedInput
                            placeholder="Length"
                            value={holes}
                            type="number"
                            endAdornment={
                                <Typography color="text.secondary" variant="caption">
                                    holes
                                </Typography>
                            }
                            onChange={onChangeLength}
                            onBlur={onBlurLength}
                        />
                    </Stack>
                    <Stack spacing={1}>
                        <InputLabel>Course Name (optional)</InputLabel>
                        <CourseSearch onChange={(newValue) => setCourseName(newValue)} />
                        {/* <OutlinedInput
                            placeholder="Course name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        /> */}
                    </Stack>
                </Stack>
                <Stack justifyContent={"end"}>
                    <Button
                        style={{ marginLeft: "auto" }}
                        variant="contained"
                        color="success"
                        size="large"
                        disabled={players.length === 0 || gameName === "" || holes === 0 || !holes}
                        onClick={() => {
                            startGame(players, gameName, holes, courseName);
                        }}
                    >
                        Start Game
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};

const GamePreviewCard = ({ onRemovePlayer, players }) => {
    return (
        <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
            <Box>
                {players.length > 0 && (
                    <Stack
                        direction="row"
                        // spacing={1}
                        sx={{
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        {players.map((player, i) => (
                            <Paper
                                key={i}
                                variant="outlined"
                                sx={{
                                    p: 0.5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Typography variant="body2" noWrap>
                                    {player}
                                </Typography>
                                <Button
                                    size="small"
                                    sx={{
                                        minWidth: "24px",
                                        width: "24px",
                                        height: "24px",
                                        p: 0,
                                    }}
                                    variant="contained"
                                    color="warning"
                                    onClick={() => {
                                        onRemovePlayer(i);
                                    }}
                                >
                                    <Remove fontSize="small" />
                                </Button>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Box>
        </Stack>
    );
};
export default Game;
