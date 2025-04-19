import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Should be set in .env

// Basic middleware that attaches user to request if authenticated
export const authMiddleware = async (req, res, next) => {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract the token
    const token = authHeader.substring(7);

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

export default { authMiddleware };
