import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    })
    console.log("DB connected")
} catch (error) {
    console.log("db error", error)
    throw error;
}
}
export default connectDb