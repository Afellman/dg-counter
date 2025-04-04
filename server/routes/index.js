import gameRouter from "./game.js";
import authRouter from "./auth.js";
import express from "express";

const router = express.Router();
router.use("/game", gameRouter);
router.use("/auth", authRouter);

export default router;
