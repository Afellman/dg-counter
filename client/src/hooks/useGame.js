import atom, { useAtom } from "jotai";

const currentGameAtom = atom(null);

const useGame = () => {
    const [game, setGame] = useAtom(currentGameAtom);

    return {
        game,
        ...game,
        setGame,
    };
};

export default useGame;
