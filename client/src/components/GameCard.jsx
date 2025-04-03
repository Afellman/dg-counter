import { Button, Paper, Stack, Typography } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GameCard = ({ game, back }) => {
    const navigate = useNavigate();

    const onClick = () => {
        if (game.currentHole === game.holes.length) {
            navigate(`/game/results/${game._id}${back ? `?back=${back}` : ""}`);
        } else {
            navigate(`/game/play/${game._id}`);
        }
    };
    return (
        <Paper
            elevation={2}
            onClick={onClick}
            key={game._id}
            sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                backgroundColor: "#fff",
            }}
        >
            <Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>{game.gameName}</Typography>
                    <Typography variant="caption">{new Date(game.createdAt).toLocaleDateString()}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption">{game.holes.length} holes</Typography>
                    {game.currentHole !== game.holes.length && (
                        <>
                            <Typography variant="caption">•</Typography>
                            <Typography variant="caption" color="warning">
                                In progress {game.currentHole}/{game.holes.length}
                            </Typography>
                        </>
                    )}
                </Stack>
                <Typography variant="caption">
                    {game.players.map((player) => player.name).join(", ")}
                </Typography>
            </Stack>
            {game.currentHole === game.holes.length ? (
                <ArrowForwardIos fontSize="small" />
            ) : (
                <Button variant="text" color="success" onClick={onClick}>
                    Continue
                </Button>
            )}
        </Paper>
    );
};

export default GameCard;
