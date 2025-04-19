import { authMiddleware } from "../middleware/authMiddleware.js";
import Game from "../models/GameModel.js";
import { Router } from "express";
import User from "../models/UserModel.js";

const router = Router();

// Get user statistics
router.get("/:id/stats", authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        // Verify user is requesting their own stats or is an admin
        if (req.userId !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to access these stats" });
        }

        // Query games collection for this user's games
        const games = await Game.find({ user: userId });

        if (!games || games.length === 0) {
            return res.json({
                gamesPlayed: 0,
                averageScore: 0,
                bestScore: 0,
                lastPlayed: null,
            });
        }

        // Calculate statistics
        const gamesPlayed = games.length;

        // Calculate average score (assuming lower is better in disc golf)
        const totalScore = games.reduce((sum, game) => sum + game.score, 0);
        const averageScore = parseFloat((totalScore / gamesPlayed).toFixed(1));

        // Find best score (lowest score in disc golf)
        const bestScore = Math.min(...games.map((game) => game.score));

        // Find most recent game
        const lastPlayedGame = games.reduce((latest, game) => {
            return new Date(game.date) > new Date(latest.date) ? game : latest;
        }, games[0]);

        const lastPlayed = lastPlayedGame.date;

        // Return calculated statistics
        res.json({
            gamesPlayed,
            averageScore,
            bestScore,
            lastPlayed,
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: "Server error while fetching user statistics" });
    }
});

export default router;
