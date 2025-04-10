import { Typography, Stack, Box, Container, Button, Divider, Card } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Add, Remove, ArrowBack, ArrowForward } from "@mui/icons-material";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import api from "../utils/api";

const Play = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/game/${id}`)
            .then((data) => {
                setGame(data);
            })
            .catch((error) => console.error("Error fetching game:", error));
    }, [id]);

    const onChangeHole = async (direction) => {
        if (game.currentHole === game.holes.length && direction === 1) {
            navigate(`/game/results/${game._id}?finish=true`);
            return;
        }
        try {
            const data = await api.put(`/api/game/${game._id}/hole`, { direction });
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
            await api.put(`/api/game/${game._id}/${playerID}/stroke`, { stroke: direction });
        } catch (error) {
            console.error(error);
            // Revert the optimistic update
            setGame(oldGame);
        }
    };

    if (!game) {
        return <div>Loading...</div>;
    }

    const onChangePar = async (direction) => {
        const newGame = { ...game };
        const oldGame = { ...game };
        const newPar = newGame.holes[game.currentHole - 1].par + direction;
        newGame.holes[game.currentHole - 1].par = newPar;
        setGame(newGame);

        try {
            await api.put(`/api/game/${game._id}/hole/${game.currentHole}`, { par: newPar });
        } catch (error) {
            console.error(error);
            setGame(oldGame);
        }
    };

    return (
        <>
            <Stack spacing={2}>
                {game.players.map((player, i) => (
                    <>
                        <PlayerTicks
                            key={player.name}
                            game={game}
                            player={player}
                            onChangeStroke={onChangeStroke}
                        />
                        {i < game.players.length - 1 && <Divider />}
                    </>
                ))}
            </Stack>

            <Stack
                spacing={2}
                sx={{
                    position: "fixed",
                    bottom: "56px", // Height of the BottomNav component
                    left: 0,
                    right: 0,
                    backgroundColor: "background.paper",
                    boxShadow: 3,
                    zIndex: 10,
                    maxWidth: "700px",
                    margin: "0 auto",
                    padding: "1rem",
                    borderBottom: "1px solid #e0e0e0",
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h4">Par {game.holes[game.currentHole - 1].par}</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => onChangePar(-1)}
                            sx={{ minWidth: "35px", width: "35px", height: "35px", padding: 0 }}
                        >
                            <Remove fontSize="small" />
                        </Button>
                        <Button
                            sx={{ minWidth: "35px", width: "35px", height: "35px", padding: 0 }}
                            variant="outlined"
                            color="secondary"
                            onClick={() => onChangePar(1)}
                        >
                            <Add fontSize="small" />
                        </Button>
                    </Stack>
                </Stack>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button color="secondary" style={{ borderRadius: 50 }} onClick={() => onChangeHole(-1)}>
                        <ArrowBack />
                    </Button>
                    <Typography variant="h4" textAlign="center">
                        Hole {game.currentHole}
                    </Typography>
                    <Button color="secondary" onClick={() => onChangeHole(1)}>
                        {game.currentHole === game.holes.length ? "Finish" : <ArrowForward />}
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
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onChangeStroke(player._id, -1)}
                        sx={{
                            borderRadius: "50%",
                            minWidth: "40px",
                            width: "40px",
                            height: "40px",
                            padding: 0,
                        }}
                    >
                        <Remove />
                    </Button>
                    <Typography variant="h4">
                        {player.scores.find((s) => s.hole === game.currentHole)?.strokes || 0}
                    </Typography>
                    <Button
                        sx={{
                            borderRadius: "50%",
                            minWidth: "40px",
                            width: "40px",
                            height: "40px",
                            padding: 0,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => onChangeStroke(player._id, 1)}
                    >
                        <Add />
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
export default Play;
