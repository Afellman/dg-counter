import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Should be set in .env

// Basic middleware that attaches user to request if authenticated
export const authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Add the user to the request object
        req.user = {
            id: user._id,
            email: user.email,
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Authentication failed" });
    }
};

// Middleware that checks if a route parameter ID matches the user's games
export const requireOwnership = (req, res, next) => {
    // Make sure user is authenticated first
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    // The route handler will check ownership based on the user ID
    next();
};

export default { authMiddleware, requireOwnership };
