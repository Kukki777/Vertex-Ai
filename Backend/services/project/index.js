import express from "express";

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/project.route.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use("/",router)
const PORT = process.env.PORT || 3002;
app.get("/", (req, res) => {
    res.send("Hello from project service");
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening on port ${PORT}`);
});
