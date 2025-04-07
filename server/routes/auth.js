import cryptoRandomString from "crypto-random-string";
import express from "express";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { JWT_EXPIRATION } from "../const.js";
import User from "../models/UserModel.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Should be set in .env

// Configure email transporter
let transporter;
if (process.env.NODE_ENV === "production") {
    // Use Resend for production emails
    const resend = new Resend(process.env.RESEND_API_KEY);

    transporter = {
        sendMail: async (mailOptions) => {
            try {
                await resend.emails.send({
                    from: process.env.FROM_EMAIL || "onboarding@resend.dev",
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    html: mailOptions.html,
                    text: mailOptions.text,
                });
                console.log(`Email sent successfully to ${mailOptions.to}`);
            } catch (error) {
                console.error("Error sending email via Resend:", error);
                throw error;
            }
        },
    };
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

        // Generate magic link URL using BASE_URL environment variable
        const baseUrl =
            process.env.BASE_URL ||
            (process.env.NODE_ENV === "production"
                ? `${req.protocol}://${req.get("host")}`
                : "http://localhost:5173");

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
            console.error("Verification error: No token provided");
            return res.status(400).send("Invalid or missing token");
        }

        console.log("Looking for user with magic link token:", token);
        const user = await User.findOne({
            magicLinkToken: token,
            magicLinkExpiry: { $gt: new Date() },
        });

        if (!user) {
            console.error("Verification error: User not found or token expired");
            return res.status(400).send("Invalid or expired link");
        }

        console.log("User found:", user.email);

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        console.log("JWT token generated successfully");

        // Update user data
        user.magicLinkToken = null;
        user.magicLinkExpiry = null;
        user.lastLogin = new Date();
        await user.save();
        console.log("User updated, magic link token cleared");

        // Redirect to frontend with token
        const redirectUrl = `/?token=${jwtToken}`;
        console.log("Redirecting to:", redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Verification error details:", error);
        res.status(500).send("Server error");
    }
});

// Verify JWT token
router.post("/verify-token", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            console.log("Token verification failed: No token provided");
            return res.status(401).json({ authenticated: false });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                console.log("Token verification failed: User not found");
                return res.status(401).json({ authenticated: false });
            }

            console.log("Token verification successful for user:", user.email);
            res.status(200).json({
                authenticated: true,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (jwtError) {
            console.log("JWT verification failed:", jwtError.message);
            return res.status(401).json({ authenticated: false, error: jwtError.message });
        }
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ authenticated: false });
    }
});

export default router;
