import { Paper, Stack, Typography } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GameCard = ({ game, back }) => {
    const navigate = useNavigate();
    return (
        <Paper
            elevation={2}
            onClick={() => navigate(`/game/results/${game._id}${back ? `?back=${back}` : ""}`)}
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
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{game.gameName}</Typography>
                    <Typography variant="caption">{new Date(game.createdAt).toLocaleDateString()}</Typography>
                    <Typography variant="caption">{game.holes.length} holes</Typography>
                </Stack>
                <Typography variant="caption">
                    {game.players.map((player) => player.name).join(", ")}
                </Typography>
            </Stack>
            <ArrowForwardIos fontSize="small" />
        </Paper>
    );
};

export default GameCard;
