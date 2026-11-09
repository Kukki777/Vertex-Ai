import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./services/auth/routes/auth.route.js";
import projectRouter from "./services/project/routes/project.route.js";
import fileRouter from "./services/file/routes/file.route.js";
import { protect } from "./gateway/middleware/protect.js";
import { getcurrentUser } from "./gateway/contollers/user.controller.js";
import connectAuthDB from "./services/auth/config/db.js";
import connectProjectDB from "./services/project/config/db.js";
import connectFileDB from "./services/file/config/db.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const withDatabase = (connect) => async (_req, res, next) => {
  try {
    await connect();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
};

const attachUserId = (req, _res, next) => {
  req.headers["x-user-id"] = req.user._id;
  next();
};

app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/auth", withDatabase(connectAuthDB), authRouter);
app.get("/api/me", protect, getcurrentUser);
app.use(
  "/api/project",
  protect,
  attachUserId,
  withDatabase(connectProjectDB),
  projectRouter,
);
app.use(
  "/api/file",
  protect,
  attachUserId,
  withDatabase(connectFileDB),
  fileRouter,
);

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
