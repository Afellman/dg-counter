import express from "express";
import Game from "../models/GameModel.js";
import { authMiddleware, requireOwnership } from "../middleware/authMiddleware.js";
import { ObjectId } from "bson";

const router = express.Router();

// Apply auth middleware to all game routes
router.use(authMiddleware);

// Get all personal games
router.get("/my-games", async (req, res) => {
    try {
        const games = await Game.find({ user: req.user.id }).populate("user", "name email");
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

// Get personal recent games
router.get("/my-recent", async (req, res) => {
    try {
        const games = await Game.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

// Get all public games
router.get("/all", async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 }).populate("user", "email name"); // Populate user info
        res.json(games);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Get recent public games
router.get("/recent", async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 }).limit(5).populate("user", "email name"); // Populate user info
        res.json(games);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Get game details by ID - accessible to everyone
router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate("user", "email name");

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
    try {
        const { gameID } = req.params;
        const { direction } = req.body;

        const game = await Game.findOne({ _id: gameID, user: req.user.id });

        if (!game) {
            return res.status(404).json({ message: "Game not found or you don't have permission" });
        }

        game.currentHole += direction;
        await game.save();
        res.send(game);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update player strokes - requires ownership
router.put("/:gameID/:playerID/stroke", requireOwnership, async (req, res) => {
    try {
        const { gameID, playerID } = req.params;
        const { stroke } = req.body;

        const game = await Game.findOne({ _id: gameID, user: req.user.id });

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
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Create new game - requires authentication
router.post("/", async (req, res) => {
    try {
        const { players, gameName, holes, courseName } = req.body;

        const game = new Game({
            user: req.user.id,
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
        await game.save();
        res.send(game);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update hole par - requires ownership
router.put("/:id/hole/:holeID", requireOwnership, async (req, res) => {
    try {
        const { id, holeID } = req.params;
        const { par } = req.body;

        const game = await Game.findOne({ _id: id, user: req.user.id });

        if (!game) {
            return res.status(404).json({ message: "Game not found or you don't have permission" });
        }

        game.holes[holeID - 1].par = par;
        await game.save();
        res.send(game);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update game - requires ownership
router.put("/:id/", requireOwnership, async (req, res) => {
    try {
        const { game } = req.body;

        const dbGame = await Game.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, game, {
            new: true,
        });

        if (!dbGame) {
            return res.status(404).json({ message: "Game not found or you don't have permission" });
        }

        res.send(dbGame);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.delete("/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        await Game.deleteOne({ _id: new ObjectId(req.params.id) });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default router;
