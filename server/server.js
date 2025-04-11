import "./loadenv.js";
console.log(process.env);
import express from "express";
import router from "./routes/index.js";
import winston from "winston";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.use("/api", router);
// Update the static path to look at the project root's public directory
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("*", (req, res) => {
    // Update the sendFile path to look at the project root's public directory
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/dg-tracker", {
        dbName: "dg-tracker",
        user: process.env.MONGO_USER || "admin",
        pass: process.env.MONGO_PASSWORD || "",
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    });
