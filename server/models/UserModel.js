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
    passcode: {
        type: String,
        default: null,
    },
    passcodeExpiry: {
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
