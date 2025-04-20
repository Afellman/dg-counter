import { Add, ArrowBack, ArrowForward, Remove } from "@mui/icons-material";
import { Box, Button, Divider, Snackbar, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useGame from "../hooks/useGame";
import CloseIcon from "@mui/icons-material/Close";

const Play = () => {
    const { id } = useParams();
    const {
        game,
        onChangeHole,
        onChangeStroke,
        onChangePar,
        loadGame,
        onFinishGame,
        open,
        setOpen,
        message,
        handleSaveLater,
    } = useGame();

    useEffect(() => {
        loadGame(id);
    }, [id]);

    if (!game) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                message={message}
                action={
                    <>
                        <Button onClick={() => handleSaveLater()}>Save later</Button>
                    </>
                }
            />
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
                    <Button
                        color="secondary"
                        disabled={game.currentHole === 1}
                        style={{ borderRadius: 50 }}
                        onClick={() => onChangeHole(-1)}
                    >
                        <ArrowBack />
                    </Button>
                    <Typography variant="h4" textAlign="center">
                        Hole {game.currentHole}
                    </Typography>
                    {game.currentHole === game.holes.length ? (
                        <Button color="success" onClick={() => onFinishGame()}>
                            Finish
                        </Button>
                    ) : (
                        <Button color="secondary" onClick={() => onChangeHole(1)}>
                            <ArrowForward />
                        </Button>
                    )}
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
                        onClick={() => onChangeStroke(player.id, -1)}
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
                        onClick={() => onChangeStroke(player.id, 1)}
                    >
                        <Add />
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
export default Play;
