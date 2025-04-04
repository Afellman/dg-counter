import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
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
});

gameSchema.set("timestamps", true);
const Game = mongoose.model("Game", gameSchema);

export default Game;
