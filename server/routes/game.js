import express from "express";
import Game from "../models/GameModel.js";
import { authMiddleware, requireOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all game routes
router.use(authMiddleware);

// Get all personal games
router.get("/my-games", async (req, res) => {
    const games = await Game.find({ userId: req.user.id });
    res.json(games);
});

// Get personal recent games
router.get("/my-recent", async (req, res) => {
    const games = await Game.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5);
    res.json(games);
});

// Get all public games
router.get("/all", async (req, res) => {
    const games = await Game.find().sort({ createdAt: -1 }).populate("userId", "email name"); // Populate user info
    res.json(games);
});

// Get recent public games
router.get("/recent", async (req, res) => {
    const games = await Game.find().sort({ createdAt: -1 }).limit(5).populate("userId", "email name"); // Populate user info
    res.json(games);
});

// Get game details by ID - accessible to everyone
router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate("userId", "email name");

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.json(game);
    } catch (error) {
        res.status(500).json({ message: "Error fetching game" });
    }
});

// Update game hole count - requires ownership
router.put("/:gameID/hole", requireOwnership, async (req, res) => {
    const { gameID } = req.params;
    const { direction } = req.body;

    const game = await Game.findOne({ _id: gameID, userId: req.user.id });

    if (!game) {
        return res.status(404).json({ message: "Game not found or you don't have permission" });
    }

    game.currentHole += direction;
    await game.save();
    res.send(game);
});

// Update player strokes - requires ownership
router.put("/:gameID/:playerID/stroke", requireOwnership, async (req, res) => {
    const { gameID, playerID } = req.params;
    const { stroke } = req.body;

    const game = await Game.findOne({ _id: gameID, userId: req.user.id });

    if (!game) {
        return res.status(404).json({ message: "Game not found or you don't have permission" });
    }

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

// Create new game - requires authentication
router.post("/", async (req, res) => {
    const { players, gameName, holes, courseName } = req.body;

    console.log(req.body);
    const game = new Game({
        userId: req.user.id,
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

// Update hole par - requires ownership
router.put("/:id/hole/:holeID", requireOwnership, async (req, res) => {
    const { id, holeID } = req.params;
    const { par } = req.body;

    const game = await Game.findOne({ _id: id, userId: req.user.id });

    if (!game) {
        return res.status(404).json({ message: "Game not found or you don't have permission" });
    }

    game.holes[holeID - 1].par = par;
    await game.save();
    res.send(game);
});

// Update game - requires ownership
router.put("/:id/", requireOwnership, async (req, res) => {
    const { game } = req.body;

    const dbGame = await Game.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, game, {
        new: true,
    });

    if (!dbGame) {
        return res.status(404).json({ message: "Game not found or you don't have permission" });
    }

    res.send(dbGame);
});

export default router;
