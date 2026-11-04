import express from "express";

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/project.route.js";
import { requireInternalService } from "./middleware/requireInternalService.js";

dotenv.config();


const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use(requireInternalService);
app.use("/",router)
const PORT = process.env.PORT || 3002;
app.get("/", (req, res) => {
    res.send("Hello from project service");
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening on port ${PORT}`);
});
