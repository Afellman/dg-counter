import express from "express";
import User from "../models/UserModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import cryptoRandomString from "crypto-random-string";
import { JWT_EXPIRATION } from "../const.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Should be set in .env

// Configure email transporter
let transporter;
if (process.env.NODE_ENV === "production") {
    // Configure production email service like SendGrid, Mailgun, etc.
    // This is just a placeholder
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
} else {
    // For development, log to console
    transporter = {
        sendMail: (mailOptions) => {
            console.log("============ EMAIL SENT ============");
            console.log("To:", mailOptions.to);
            console.log("Subject:", mailOptions.subject);
            console.log("Text:", mailOptions.text);
            console.log("HTML:", mailOptions.html);
            console.log("Magic Link:", mailOptions.html.match(/href="([^"]*)/)[1]);
            console.log("======================================");
            return Promise.resolve();
        },
    };
}

// Request magic link
router.post("/login", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate a random token
        const token = cryptoRandomString({ length: 64, type: "url-safe" });
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }

        // Update user with token
        user.magicLinkToken = token;
        user.magicLinkExpiry = expiry;
        await user.save();

        // Generate magic link URL
        // Determine the base URL based on environment
        let baseUrl;
        if (process.env.NODE_ENV === "production") {
            // Use the request's protocol and host in production
            baseUrl = `${req.protocol}://${req.get("host")}`;
        } else {
            // Use the frontend development URL in development
            baseUrl = "http://localhost:5173";
        }
        const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

        // Send email
        await transporter.sendMail({
            to: email,
            subject: "Your login link for DG Tracker",
            text: `Click the following link to log in: ${magicLink}`,
            html: `
        <p>Click the following link to log in:</p>
        <p><a href="${magicLink}">Log in to DG Tracker</a></p>
        <p>This link will expire in 1 hour.</p>
      `,
        });

        res.status(200).json({ message: "Magic link sent to your email" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Verify magic link
router.get("/verify", async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send("Invalid or missing token");
        }

        const user = await User.findOne({
            magicLinkToken: token,
            magicLinkExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).send("Invalid or expired link");
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Update user data
        user.magicLinkToken = null;
        user.magicLinkExpiry = null;
        user.lastLogin = new Date();
        await user.save();

        // Redirect to frontend with token
        res.redirect(`/?token=${jwtToken}`);
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).send("Server error");
    }
});

// Verify JWT token
router.post("/verify-token", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ authenticated: false });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ authenticated: false });
        }

        res.status(200).json({
            authenticated: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ authenticated: false });
    }
});

export default router;
