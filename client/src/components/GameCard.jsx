import { EmojiEvents, Flag, Person } from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
    Alert,
    Avatar,
    Box,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Popover,
    Snackbar,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import api from "../utils/api";

const GameCard = ({ game, showUser, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { userID } = useUser();
    const [snack, setSnack] = useState(null);

    const onClick = () => {
        if (game.currentHole === game.holes.length) {
            navigate(`/game/results/${game._id}`);
        } else if (userID === game.user._id) {
            navigate(`/game/play/${game._id}`);
        }
    };

    // Calculate if game is complete
    const isComplete = game.currentHole === game.holes.length;

    const handleOpenPopover = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClosePopover = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await api.delete(`/api/game/${game._id}`);

        if (res.status !== 200) {
            console.log("error deleting game");
            setSnack({ msg: "Error deleting game", type: "error" });
        } else {
            setSnack({ msg: "Game deleted", type: "success" });
        }
    };
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
            <Box display={"flex"} justifyContent={"space-between"} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                    {new Date(game.createdAt).toLocaleDateString()}
                </Typography>

                {game.user._id === userID && <MoreHorizIcon color="action" onClick={handleOpenPopover} />}
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    <List disablePadding>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Delete" onClick={handleDelete} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Popover>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                        {game.gameName}
                    </Typography>
                    {!isComplete && (
                        <Chip
                            size="small"
                            color="warning"
                            label={`In progress ${game.currentHole}/${game.holes.length}`}
                        />
                    )}
                </Box>
            </Box>

            {/* Middle Section */}
            <Box sx={{ gap: 1, display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Flag fontSize="small" color="primary" />
                    <Typography variant="body2">{game.holes.length} holes</Typography>
                </Box>

                {showUser && game.user && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {game.user.name || game.user.email.split("@")[0]}
                        </Typography>
                    </Box>
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
            <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}>
                <Alert severity={snack?.type} variant="filled" sx={{ width: "100%" }}>
                    {snack?.msg}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default GameCard;
