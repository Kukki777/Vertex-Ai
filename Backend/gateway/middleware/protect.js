
import { redis } from "../shared/redis/redis.js";

export const protect = async (req, res, next) => {
    try {
        // 1. Get session ID from cookie
        const sessionId = req.cookies?.sessionId;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No session ID found"
            });
        }

        // 2. Fetch session from Upstash Redis
        const result = await redis.get(`session-${sessionId}`);

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid session ID"
            });
        }

        // 3. Handle both string and object responses
        const data = typeof result === "string"
            ? JSON.parse(result)
            : result;

        // 4. Attach user information to request
        req.user = data;

        // 5. Continue to next middleware/controller
        next();

    } catch (error) {
        console.error("Error in protect middleware:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
