import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import { authRouter } from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import { userRouter } from "./routes/user.route.js"
import { listingRouter } from "./routes/listing.route.js"
import { bookingRouter } from "./routes/booking.route.js"
import { adminRouter } from "./routes/admin.route.js"
let port = process.env.PORT || 6000

// Export the app for serverless and local dev (via server.js)
// App exported as named export above = express();
