import { useState, useEffect } from "react";
import useGame from "./useGame";

const useUnsavedGames = () => {
    const [unsavedGames, setUnsavedGames] = useState([]);
    const { updateGameInDB } = useGame();

    // Load unsaved games from localStorage
    useEffect(() => {
        const unsaved = JSON.parse(localStorage.getItem("unsavedGames")) || [];
        setUnsavedGames(unsaved);
    }, []);

    const handleRetrySave = async (game) => {
        try {
            const success = await updateGameInDB(game);
            if (success) {
                // Remove the game from unsaved games
                const updatedUnsavedGames = unsavedGames.filter((g) => g.gameID !== game.gameID);
                localStorage.setItem("unsavedGames", JSON.stringify(updatedUnsavedGames));
                setUnsavedGames(updatedUnsavedGames);
            }
        } catch (error) {
            console.error("Error retrying save:", error);
        }
    };

    const dismissGame = () => {
        const updatedUnsavedGames = unsavedGames.slice(1);
        localStorage.setItem("unsavedGames", JSON.stringify(updatedUnsavedGames));
        setUnsavedGames(updatedUnsavedGames);
    };

    const addUnsavedGame = (game) => {
        const updatedUnsavedGames = [...unsavedGames, game];
        localStorage.setItem("unsavedGames", JSON.stringify(updatedUnsavedGames));
        setUnsavedGames(updatedUnsavedGames);
    };

    return {
        unsavedGames,
        handleRetrySave,
        dismissGame,
        addUnsavedGame,
    };
};

export default useUnsavedGames;
