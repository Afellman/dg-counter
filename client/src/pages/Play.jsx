import { Typography, Stack, Box, Container, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Add, Remove, ArrowBack, ArrowForward } from "@mui/icons-material";
import TopBar from "../components/TopBar";

const Play = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/game/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setGame(data);
            });
    }, [id]);

    const onChangeHole = async (direction) => {
        if (game.currentHole === 18 && direction === 1) {
            navigate(`/game/results/${game._id}`);
            return;
        }
        try {
            const res = await fetch(`/api/game/${game._id}/hole`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ direction }),
            });
            const data = await res.json();
            setGame(data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateScore = async (playerID, direction) => {
        const newGame = { ...game };

        const player = newGame.players.find((p) => p._id.toString() === playerID);
        const thisHole = player.scores.find((s) => s.hole === game.currentHole);

        if (thisHole) {
            thisHole.strokes += direction;
        } else {
            player.scores.push({ hole: game.currentHole, strokes: direction });
        }

        setGame(newGame);
    };

    const onChangeStroke = async (playerID, direction) => {
        const oldGame = { ...game };
        updateScore(playerID, direction);
        try {
            await fetch(`/api/game/${game._id}/${playerID}/stroke`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stroke: direction }),
            });
        } catch (error) {
            console.error(error);
            // Revert the optimistic update
            setGame(oldGame);
        }
    };

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <TopBar />
            <Stack spacing={2}>
                <Box sx={{ backgroundColor: "grey", padding: "2rem" }}>
                    <Typography variant="h3" textAlign="center">
                        {game.gameName}
                    </Typography>
                </Box>
                <Container>
                    <Stack spacing={4}>
                        <Stack spacing={2}>
                            {game.players.map((player) => (
                                <PlayerTicks
                                    key={player.name}
                                    game={game}
                                    player={player}
                                    onChangeStroke={onChangeStroke}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Container>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "grey",
                        padding: "2rem",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button variant="contained" color="primary" onClick={() => onChangeHole(-1)}>
                        <ArrowBack />
                    </Button>
                    <Typography variant="h4" textAlign="center">
                        Hole {game.currentHole}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => onChangeHole(1)}>
                        {game.currentHole === 18 ? "Finish" : <Add />}
                    </Button>
                </Box>
            </Stack>
        </>
    );
};

const PlayerTicks = ({ game, player, onChangeStroke }) => {
    const totalScore = player.scores.reduce((acc, curr) => {
        const hole = game.holes.find((h) => h.number === curr.hole);
        return acc + ((curr.strokes || 0) - hole.par);
    }, 0);
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1" style={{ minWidth: "18px" }}>
                        {totalScore > 0 ? "+" : ""}
                        {totalScore}
                    </Typography>
                    <Typography variant="h4">{player.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onChangeStroke(player._id, -1)}
                    >
                        <Remove />
                    </Button>
                    <Typography variant="h4">
                        {player.scores.find((s) => s.hole === game.currentHole)?.strokes || 0}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => onChangeStroke(player._id, 1)}>
                        <Add />
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
export default Play;
