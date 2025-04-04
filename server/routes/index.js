const gameRouter = require("./game");
const express = require("express");

const router = express.Router();
router.use("/game", gameRouter);

module.exports = router;
