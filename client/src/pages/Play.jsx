import { Typography, Stack, Box, Container, Button, Divider } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Add, Remove, ArrowBack, ArrowForward } from "@mui/icons-material";
import TopBar from "../components/TopBar";
import Header from "../components/Header";

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
        if (game.currentHole === game.holes.length && direction === 1) {
            navigate(`/game/results/${game._id}?back=game/play/${game._id}&finish=true`);
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

    const onChangePar = async (direction) => {
        const newGame = { ...game };
        const oldGame = { ...game };
        const newPar = newGame.holes[game.currentHole - 1].par + direction;
        newGame.holes[game.currentHole - 1].par = newPar;
        setGame(newGame);

        try {
            await fetch(`/api/game/${game._id}/hole/${game.currentHole}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ par: newPar }),
            });
        } catch (error) {
            console.error(error);
            setGame(oldGame);
        }
    };

    return (
        <>
            <TopBar />
            <Stack spacing={2}>
                <Header title={game.gameName} />
                <Container>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="h4">Par {game.holes[game.currentHole - 1].par}</Typography>
                            <Button variant="outlined" size="small" onClick={() => onChangePar(-1)}>
                                -
                            </Button>
                            <Button variant="outlined" size="small" onClick={() => onChangePar(1)}>
                                +
                            </Button>
                        </Stack>
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
                </Container>
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
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
                        {game.currentHole === game.holes.length ? "Finish" : <Add />}
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
                        sx={{ minWidth: "40px", width: "40px", height: "40px", padding: 0 }}
                    >
                        <Remove />
                    </Button>
                    <Typography variant="h4">
                        {player.scores.find((s) => s.hole === game.currentHole)?.strokes || 0}
                    </Typography>
                    <Button
                        sx={{ minWidth: "40px", width: "40px", height: "40px", padding: 0 }}
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
