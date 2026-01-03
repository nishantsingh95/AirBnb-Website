import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js"
import { authRouter } from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import { userRouter } from "./routes/user.route.js"
import { listingRouter } from "./routes/listing.route.js"
import { bookingRouter } from "./routes/booking.route.js"
import { adminRouter } from "./routes/admin.route.js"

let port = process.env.PORT || 6000

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://stayyhub.netlify.app"],
    credentials: true
}))

// Create a Main Router to hold all routes
const mainRouter = express.Router();

mainRouter.use("/auth", authRouter)
mainRouter.use("/user", userRouter)
mainRouter.use("/listing", listingRouter)
mainRouter.use("/booking", bookingRouter)
mainRouter.use("/admin", adminRouter)

mainRouter.get("/test", (req, res) => {
    res.json({ message: "Backend is working via Netlify Functions!", path: req.path })
})

// Mount the Main Router at BOTH /api and / (root) to handle any path stripping behavior
app.use("/api", mainRouter);
app.use("/", mainRouter);

