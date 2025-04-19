import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Game from "../models/GameModel.js";

const router = Router();
// Get user statistics
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const search = req.query.search;

        const results = await Game.find({
            user: userId,
            // REVIEW is it safe to regex directly from user input??
            courseName: { $regex: search, $options: "i" },
        })
            .select({ _id: 0, courseName: 1 })
            .limit(10)
            .distinct("courseName");

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error("Error fetching user courses", error);
        res.status(500).json({ message: "Server error while fetching courses" });
    }
});

export default router;
