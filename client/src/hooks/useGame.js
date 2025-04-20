import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import currentGameAtom from "../atoms/currentGameAtom";
import api from "../utils/api";
import useUser from "./useUser";
import { useState } from "react";

const useGame = () => {
    const [game, setGame] = useAtom(currentGameAtom);
    const navigate = useNavigate();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    window.game = game;
    const updateGameInDB = async (data) => {
        try {
            await api.post(`/api/game`, data);
            setGame((prev) => ({ ...prev, ...data, isNotSynced: false }));
            return true;
        } catch (error) {
            setGame((prev) => ({ ...prev, isNotSynced: true }));
            console.error(error);
            return false;
        }
    };

    const updateGame = async (data) => {
        localStorage.setItem("game", JSON.stringify(data));
        setGame(data);
        await updateGameInDB(data);
    };

    const onChangeHole = async (direction) => {
        const newGame = { ...game };
        newGame.currentHole += direction;

        updateGame({ ...newGame, currentHole: newGame.currentHole });
    };

    const onFinishGame = async () => {
        const newGame = { ...game };
        newGame.isFinished = true;
        const success = await updateGameInDB(newGame);
        if (false) {
            clearLocalGame();
            navigate(`/game/results/${game._id}?finish=true`);
        } else {
            setOpen(true);
            setMessage("Error finishing game");
        }
    };

    const clearLocalGame = () => {
        localStorage.removeItem("game");
        setGame(null);
    };

    const onChangeStroke = async (playerID, direction) => {
        const newGame = { ...game };

        const player = newGame.players.find((p) => p.id.toString() === playerID);
        const thisHole = player.scores.find((s) => s.hole === game.currentHole);

        if (thisHole) {
            thisHole.strokes += direction;
        } else {
            player.scores.push({ hole: game.currentHole, strokes: direction });
        }

        updateGame(newGame);
    };

    const onChangePar = async (direction) => {
        const newGame = { ...game };
        const newPar = newGame.holes[game.currentHole - 1].par + direction;
        newGame.holes[game.currentHole - 1].par = newPar;
        updateGame(newGame);
    };

    const startGame = async (players, gameName, holes, courseName) => {
        try {
            const _game = buildGameObject(players, gameName, holes, courseName);
            await updateGame(_game);
            navigate(`/game/play/${_game.gameID}`);
        } catch (error) {
            console.error("Error creating game:", error);
        }
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };

    const buildGameObject = (players, gameName, holes, courseName) => {
        // IDs are generated on the client in case there is no internet. Maybe we can use this as a temp ID until the server syncs?
        return {
            currentHole: 1,
            gameID: generateUniqueId(),
            user: user._id,
            players: players.map((player) => ({
                id: generateUniqueId(),
                name: player,
                scores: new Array(parseInt(holes)).fill(0).map((_, i) => ({
                    hole: i + 1,
                    strokes: 3,
                })),
            })),
            gameName,
            courseName,
            // Assuming all holes have the same par to start
            holes: new Array(parseInt(holes)).fill(0).map((_, i) => ({
                id: generateUniqueId(),
                number: i + 1,
                par: 3,
            })),
        };
    };

    const loadGame = async (id) => {
        try {
            const game = await api.get(`/api/game/${id}`);
            setGame(game);
        } catch (error) {
            const game = localStorage.getItem("game");
            if (game) {
                setGame(JSON.parse(game));
            } else {
                console.error("Error loading game:", error);
            }
        }
    };

    const handleSaveLater = async () => {
        const newGame = { ...game };
        newGame.isNotSynced = true;
        newGame.isFinished = true;
        const unsavedGames = JSON.parse(localStorage.getItem("unsavedGames")) || [];
        localStorage.setItem("unsavedGames", JSON.stringify([...unsavedGames, newGame]));
        clearLocalGame();
        navigate("/");
    };

    return {
        game,
        ...game,
        startGame,
        setGame,
        onChangeHole,
        onChangeStroke,
        onChangePar,
        loadGame,
        onFinishGame,
        open,
        setOpen,
        message,
        setMessage,
        handleSaveLater,
        updateGameInDB,
    };
};

export default useGame;
