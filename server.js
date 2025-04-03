const express = require("express");
const router = require("./routes");
const winston = require("winston");
const path = require("path");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8081;

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}

app.use(express.json());
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, "dist")));

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/dg-tracker").then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.use("/api", router);
