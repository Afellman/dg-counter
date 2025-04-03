const router = require("express").Router();
const Game = require("../models/GameModel");

router.get("/all", async (req, res) => {
    const games = await Game.find();
    res.json(games);
});

router.get("/recent", async (req, res) => {
    const games = await Game.find().sort({ createdAt: -1 }).limit(5);
    res.json(games);
});

router.get("/:id", async (req, res) => {
    const game = await Game.findById(req.params.id);

    res.json(game);
});

router.put("/:gameID/hole", async (req, res) => {
    const { gameID } = req.params;
    const { direction } = req.body;

    const game = await Game.findById(gameID);
    game.currentHole += direction;
    await game.save();
    res.send(game);
});

router.put("/:gameID/:playerID/stroke", async (req, res) => {
    const { gameID, playerID } = req.params;
    const { stroke } = req.body;

    const game = await Game.findById(gameID);

    const player = game.players.find((p) => p._id.toString() === playerID);
    const thisHole = player.scores.find((s) => s.hole === game.currentHole);

    if (thisHole) {
        thisHole.strokes += stroke;
    } else {
        player.scores.push({ hole: game.currentHole, strokes: stroke });
    }
    await game.save();
    res.send(game);
});

router.post("/", async (req, res) => {
    const { players, gameName, holes, courseName } = req.body;

    console.log(req.body);
    const game = new Game({
        players: players.map((player) => ({
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
            number: i + 1,
            par: 3,
        })),
    });
    console.log(game);
    await game.save();
    res.send(game);
});

router.put("/:id/hole/:holeID", async (req, res) => {
    const { id, holeID } = req.params;
    const { par } = req.body;

    const game = await Game.findById(id);
    game.holes[holeID - 1].par = par;
    await game.save();
    res.send(game);
});

router.put("/:id/", async (req, res) => {
    const { game } = req.body;
    const dbGame = await Game.findOneAndUpdate({ _id: req.params.id }, game, { new: true });
    res.send(dbGame);
});

module.exports = router;
