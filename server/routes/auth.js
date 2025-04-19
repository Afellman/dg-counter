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
            console.log("======================================");
            return Promise.resolve();
        },
    };
}

// Request passcode
router.post("/login", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate a random 6-digit passcode
        const passcode = cryptoRandomString({ length: 6, type: "numeric" });
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }

        // Update user with passcode
        user.passcode = passcode;
        user.passcodeExpiry = expiry;
        await user.save();
        console.log(`Passcode ${passcode} set for user ${user.email}`);

        // Send email with passcode
        await transporter.sendMail({
            to: email,
            subject: "Your login passcode for DG Tracker",
            text: `Your login passcode is: ${passcode}\nThis passcode will expire in 1 hour.`,
            html: `
        <p>Your login passcode is: <strong>${passcode}</strong></p>
        <p>This passcode will expire in 1 hour.</p>
      `,
        });

        res.status(200).json({ message: "Passcode sent to your email" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Verify passcode
router.post("/verify", async (req, res) => {
    try {
        const { email, passcode } = req.body;

        if (!email || !passcode) {
            return res.status(400).json({ message: "Email and passcode are required" });
        }

        const user = await User.findOne({
            email,
            passcode,
            passcodeExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired passcode" });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Update user data
        user.passcode = null;
        user.passcodeExpiry = null;
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({ token: jwtToken });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Server error" });
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

            res.status(200).json({
                authenticated: true,
                user: {
                    _id: user._id,
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
