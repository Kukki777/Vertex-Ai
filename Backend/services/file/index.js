import express from "express";

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/file.route.js";

dotenv.config();


const app = express();
app.use(express.json());

const PORT = process.env.PORT ;
app.use("/",router)
app.get("/", (req, res) => {
    res.send("Hello from file service");
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening on port ${PORT}`);
});