import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    const uri = process.env.MONGODB_URL || process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGODB_URL environment variable is missing on server");
    }

    try {
        const db = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection error:", error);
        throw error;
    }
};