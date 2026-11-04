import mongoose from "mongoose";
import { getMongoConnection } from "../../../shared/mongo.js";

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    starred:{
        type:Boolean,
        default:false
    },
    lastOpenAt:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true });

const { connection } = getMongoConnection("PROJECT_MONGODB_URI");
const Project = connection.models.Project || connection.model("Project", projectSchema);

export default Project;
