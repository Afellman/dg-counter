import { Button, Paper, Stack, Typography, Chip, Box, Avatar } from "@mui/material";
import { ArrowForwardIos, Person, Flag, EmojiEvents } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
const GameCard = ({ game, showUser, onNavigate }) => {
    const navigate = useNavigate();
    const { user } = useUser();

    const onClick = () => {
        if (onNavigate) {
            onNavigate();
        } else if (game.currentHole === game.holes.length) {
            navigate(`/game/results/${game._id}`);
        } else {
            navigate(`/game/play/${game._id}`);
        }
    };

    // Calculate if game is complete
    const isComplete = game.currentHole === game.holes.length;

    return (
        <Paper
            elevation={2}
            onClick={onClick}
            key={game._id}
            sx={{
                cursor: "pointer",
                padding: "0.75rem",
                backgroundColor: "#fff",
                borderRadius: "8px",
            }}
        >
            {/* Header Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                        {game.gameName}
                    </Typography>
                    {isComplete ? (
                        <Chip
                            size="small"
                            color="success"
                            label="Complete"
                            icon={<EmojiEvents fontSize="small" />}
                        />
                    ) : (
                        <Chip
                            size="small"
                            color="warning"
                            label={`In progress ${game.currentHole}/${game.holes.length}`}
                        />
                    )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                    {new Date(game.createdAt).toLocaleDateString()}
                </Typography>
            </Box>

            {/* Middle Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Flag fontSize="small" color="primary" />
                    <Typography variant="body2">{game.holes.length} holes</Typography>
                </Box>

                {showUser && game.userId && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {game.userId.name || game.userId.email.split("@")[0]}
                        </Typography>
                    </Box>
                )}

                {!isComplete && game.userId === user.id && (
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={onClick}
                        sx={{ ml: "auto" }}
                    >
                        Continue
                    </Button>
                )}
            </Box>

            {/* Players Section */}
            <Box sx={{ display: "flex", alignItems: "center", overflow: "auto", gap: 0.5 }}>
                {game.players.map((player, index) => (
                    <Chip
                        key={index}
                        label={player.name}
                        size="small"
                        sx={{
                            borderRadius: "16px",
                            backgroundColor: index % 2 === 0 ? "#f0f7ff" : "#f5f5f5",
                        }}
                        avatar={
                            <Avatar
                                sx={{
                                    bgcolor: index % 2 === 0 ? "#bbdefb" : "#e0e0e0",
                                    color: index % 2 === 0 ? "#1976d2" : "#616161",
                                }}
                            >
                                {player.name.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default GameCard;
