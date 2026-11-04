import express from "express";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { protect } from "./middleware/protect.js";
import { getcurrentUser } from "./contollers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(cookieParser());
app.use(morgan("dev"));

const authService = process.env.AUTH_SERVICE;
const projectService = process.env.PROJECT_SERVICE;
const FileService = process.env.FILE_SERVICE;
app.get("/api/me",protect,getcurrentUser)
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

if (!authService) {
    throw new Error("AUTH_SERVICE environment variable is required");
}
if (!projectService) {
    throw new Error("PROJECT_SERVICE environment variable is required");
}
if(!FileService){
    throw new Error("FILE_SERVICE environment variable is required");
}
app.use("/api/auth", proxy(authService));
app.use("/api/project",protect, proxyWithHeader(projectService));
app.use("/api/file",protect, proxyWithHeader(FileService));

app.get("/", (req, res) => {
    res.send("Hello from gateway");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
