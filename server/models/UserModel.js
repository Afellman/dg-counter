import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    magicLinkToken: {
        type: String,
        default: null,
    },
    magicLinkExpiry: {
        type: Date,
        default: null,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
});

userSchema.set("timestamps", true);
const User = mongoose.model("User", userSchema);

export default User;
