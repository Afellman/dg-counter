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
        const newGame = await fetch("/api/game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ players, gameName, holes, courseName }),
        });
        const game = await newGame.json();

        navigate(`/game/play/${game._id}`);
    };

    const onGenerateGameName = async () => {
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

        // Select a random name from the list
        const randomName = fantasyGameNames[Math.floor(Math.random() * fantasyGameNames.length)];
        setGameName(randomName);
    };

    return (
        <>
            <TopBar />
            <Stack spacing={2} sx={{ position: "relative", height: "calc(100dvh - 35px)" }}>
                <Header title="New Game" />
                <Container>
                    <Stack spacing={1}>
                        <Stack spacing={1}>
                            <InputLabel>Game Name</InputLabel>
                            <OutlinedInput
                                size="small"
                                placeholder="Game name"
                                value={gameName}
                                onChange={(e) => setGameName(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={onGenerateGameName}
                            >
                                Get Random Name
                            </Button>
                        </Stack>
                        <Stack spacing={1}>
                            <InputLabel>Length</InputLabel>
                            <OutlinedInput
                                size="small"
                                placeholder="Length"
                                value={holes}
                                onChange={(e) => setHoles(e.target.value)}
                            />
                        </Stack>
                        <Stack spacing={1}>
                            <InputLabel>Course Name (optional)</InputLabel>
                            <OutlinedInput
                                size="small"
                                placeholder="Course name"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                        </Stack>

                        <Stack spacing={1}>
                            <InputLabel>Add Players</InputLabel>
                            <Stack direction="row" spacing={2} justifyContent="space-between">
                                <OutlinedInput
                                    size="small"
                                    sx={{ flex: 1 }}
                                    placeholder="Player name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={playerName === ""}
                                    onClick={() => {
                                        addPlayer();
                                    }}
                                >
                                    Add player
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>

                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "background.paper",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <Stack spacing={1}>
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="flex-start"
                            justifyContent="space-between"
                        >
                            {/* Left Column: Game Summary and Start Button */}
                            {(gameName || courseName || holes) && (
                                <Box>
                                    {gameName && (
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {gameName}
                                        </Typography>
                                    )}
                                    <Stack direction="row" spacing={1} color="text.secondary">
                                        {courseName && (
                                            <Typography variant="body2" noWrap>
                                                {courseName}
                                            </Typography>
                                        )}
                                        {holes && <Typography variant="body2">• {holes} holes</Typography>}
                                    </Stack>
                                </Box>
                            )}
                            <Button
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
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            {/* Right Column: Player List */}
                            {players.length > 0 && (
                                <Paper variant="outlined" sx={{ p: 0.5, flex: 2, minWidth: 0 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                        Players ({players.length}):
                                    </Typography>
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
                                                        removePlayer(i);
                                                    }}
                                                >
                                                    <Remove fontSize="small" />
                                                </Button>
                                            </Paper>
                                        ))}
                                    </Stack>
                                </Paper>
                            )}
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </>
    );
};

export default Game;
