import gameRouter from "./game.js";
import authRouter from "./auth.js";
import userRoutes from "./users.js";
import courseRoutes from "./courses.js";
import express from "express";

const router = express.Router();
router.use("/game", gameRouter);
router.use("/auth", authRouter);
router.use("/users", userRoutes);
router.use("/course", courseRoutes);

export default router;
