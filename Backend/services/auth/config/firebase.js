import { initializeApp, cert } from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : (await import("../serviceAccountKey.json", { with: { type: "json" } })).default;

export const firebaseApp = initializeApp({
  credential: cert(serviceAccount)
});
