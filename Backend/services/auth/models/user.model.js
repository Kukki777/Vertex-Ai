import mongoose from "mongoose";
import { getMongoConnection } from "../../../shared/mongo.js";
const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    avatar: {   
        type: String,
        default:"",
    },
    password: {
        type: String,
    },
}, { timestamps: true });

const { connection } = getMongoConnection("AUTH_MONGODB_URI");
const User = connection.models.User || connection.model("User", userSchema);

export default User;
