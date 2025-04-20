import express from "express";
import Game from "../models/GameModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ObjectId } from "bson";

const router = express.Router();

// Apply auth middleware to all game routes
router.use(authMiddleware);

// Get all personal games
router.get("/my-games", async (req, res) => {
    try {
        const games = await Game.find({ user: req.userId }).populate("user", "name email");
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

// Get personal recent games
router.get("/my-recent", async (req, res) => {
    try {
        const games = await Game.find({ user: req.userId })
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
        // First try to find by gameID
        let game = await Game.findOne({ gameID: req.params.id }).populate("user", "email name");

        // If not found by gameID, try to find by _id if it's a valid ObjectId
        if (!game) {
            try {
                const objectId = new ObjectId(req.params.id);
                game = await Game.findOne({ _id: objectId }).populate("user", "email name");
            } catch (err) {
                console.error(err);
                // If the ID is not a valid ObjectId, just continue with game being null
            }
        }

        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching game" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { _id, ...gameObject } = req.body;

        const game = await Game.findOneAndUpdate({ gameID: gameObject.gameID }, gameObject, {
            new: true,
            upsert: true,
        });
        res.send(game);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.delete("/:id", async (req, res) => {
    console.log(req.params.id);
    try {
        await Game.deleteOne({ _id: new ObjectId(req.params.id) });
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default router;
