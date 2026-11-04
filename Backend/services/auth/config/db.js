import { connectMongo } from "../../../shared/mongo.js";
const connectDB = async () => {
    await connectMongo("AUTH_MONGODB_URI");
    console.log("Connected to MongoDB");
};

export default connectDB;
