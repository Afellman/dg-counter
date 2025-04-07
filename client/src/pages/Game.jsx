import {
    Box,
    Button,
    Container,
    OutlinedInput,
    Stack,
    Typography,
    InputLabel,
    Paper,
    Divider,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import { Remove } from "@mui/icons-material";
import GameCard from "../components/GameCard";
import Layout from "../components/Layout";
import api from "../utils/api";

// List of 100 fantasy-themed game names
const fantasyGameNames = [
    "Mystic Realms",
    "Dragon's Lair",
    "Enchanted Quest",
    "Wizards of Arcana",
    "Shadow Kingdom",
    "Elven Legacy",
    "Forgotten Spells",
    "Crystal Chronicles",
    "Mythic Legends",
    "Realm of Titans",
    "Sorcerer's Path",
    "Fae Wilderness",
    "Ancient Runes",
    "Dragonfire",
    "Celestial Kingdoms",
    "Mage's Journey",
    "Phantom Gates",
    "Twilight Guardians",
    "Ethereal Dominion",
    "Arcane Odyssey",
    "Mystic Forge",
    "Valiant Hearts",
    "Emerald Dynasty",
    "Obsidian Tower",
    "Crimson Spire",
    "Astral Voyage",
    "Frostbound Realms",
    "Phoenix Rising",
    "Thunderstrike Saga",
    "Moonlight Crusade",
    "Starfall Legacy",
    "Dwarven Halls",
    "Orc Uprising",
    "Goblin's Gold",
    "Troll Hunter",
    "Unicorn Valley",
    "Griffin's Flight",
    "Centaur Plains",
    "Minotaur's Maze",
    "Kraken's Deep",
    "Hydra's Lair",
    "Chimera's Roar",
    "Basilisk Eye",
    "Wyvern's Peak",
    "Pegasus Wings",
    "Mermaid Cove",
    "Siren's Call",
    "Vampire's Castle",
    "Werewolf Moon",
    "Ghost Whispers",
    "Banshee's Cry",
    "Wraith Walker",
    "Lich Kingdom",
    "Party of Necromancers",
    "Paladin's Oath",
    "Cleric's Blessing",
    "Ranger's Trail",
    "Barbarian Saga",
    "Bard's Tale",
    "Rogue's Fortune",
    "Monk's Journey",
    "Druid's Grove",
    "Warlock's Pact",
    "Alchemist's Brew",
    "Summoner's Circle",
    "Enchanter's Illusion",
    "Diviner's Vision",
    "Conjurer's Trick",
    "Illusionist's Dream",
    "Abjurer's Shield",
    "Transmuter's Touch",
    "Evocation Storm",
    "Time Wanderer",
    "Pyromancer's Flame",
    "Frost Kingdom",
    "Earth's Echoes",
    "Windswept Realms",
    "Ocean's Depths",
    "Shadow Realm",
    "Light's Dominion",
    "Void Passage",
    "Wanderer's Path",
    "Spell Weaving",
    "Rune Mysteries",
    "Soul Binding",
    "Dream Shaping",
    "Storm Calling",
    "Earth Shaking",
    "Flame Keeping",
    "Frost Binding",
    "Star Gazing",
    "Moon Chasing",
    "Sun Seeking",
    "Wind Riding",
    "Stone Heart Journey",
    "Iron Forging",
    "Golden Hands",
];
const Game = () => {
    const navigate = useNavigate();
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

    const startGame = async () => {
        try {
            const game = await api.post("/api/game", {
                players,
                gameName,
                holes,
                courseName,
            });
            navigate(`/game/play/${game._id}`);
        } catch (error) {
            console.error("Error creating game:", error);
        }
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
                        <OutlinedInput
                            placeholder="Course name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
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
                            startGame();
                        }}
                    >
                        Start Game
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};

const GamePreviewCard = ({ onRemovePlayer, gameName, courseName, holes, players }) => {
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
