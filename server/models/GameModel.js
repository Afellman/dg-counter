import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    gameID: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    players: [
        {
            name: String,
            scores: [
                {
                    hole: Number,
                    strokes: Number,
                },
            ],
        },
    ],
    holes: [
        {
            number: Number,
            par: {
                type: Number,
                required: false,
                default: 3,
            },
        },
    ],
    currentHole: {
        type: Number,
        required: false,
        default: 1,
    },
    courseName: {
        type: String,
        required: false,
    },
    gameName: {
        type: String,
        required: false,
    },
    isFinished: {
        type: Boolean,
        required: false,
        default: false,
    },
});

gameSchema.set("timestamps", true);
const Game = mongoose.model("Game", gameSchema);

export default Game;
