
import admin from "firebase-admin";
import {
    initializeApp,
    cert,
    getApps,
    getApp
} from "firebase-admin/app";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : (await import("../serviceAccountKey.json", {
        with: { type: "json" }
    })).default;

export const firebaseApp = getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert(serviceAccount)
    });
