
import { firebaseApp } from "../config/firebase.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import crypto from "crypto";
import { redis } from "../../../gateway/shared/redis/redis.js";

const SESSION_EXPIRY = 7 * 24 * 60 * 60; 

export const login = async (req, res) => {
    try {
        const { token } = req.body;

        // 1. Verify Firebase token
        const decoded = await getAuth(firebaseApp).verifyIdToken(token);

        // 2. Find existing user
        let user = await User.findOne({
            firebaseUid: decoded.uid
        });

        // 3. Create user if not found
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture
            });
        }

        // 4. Generate unique session ID
        const sessionId = crypto.randomUUID();

        // 5. Store session in Upstash Redis
        await redis.set(
            `session-${sessionId}`,
            JSON.stringify({
                name: user.name,
                _id: user._id,
                email: user.email,
                avatar: user.avatar
            }),
            {
                ex: SESSION_EXPIRY
            }
        );

        // 6. Set session cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: SESSION_EXPIRY * 1000
        };
        res.cookie("sessionId", sessionId, cookieOptions);

        return res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};


export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId;

        if (sessionId) {
            await redis.del(`session-${sessionId}`);

            res.clearCookie("sessionId", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("LOGOUT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Error logging out"
        });
    }
};
