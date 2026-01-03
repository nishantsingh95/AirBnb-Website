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

// SUPER DEBUG: Echo the path and die.
app.use((req, res, next) => {
    // Only intercept test requests or 404s really, but let's do all for a sec to be sure.
    // Actually, let's just log and continue, but if it matches /test, return info.
    if (req.path.includes("test") || req.url.includes("test")) {
        return res.json({
            message: "Echo Debug",
            url: req.url,
            originalUrl: req.originalUrl,
            params: req.params,
            path: req.path,
            baseUrl: req.baseUrl
        });
    }
    next();
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/listing", listingRouter)
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter)

// Shotgun Test Routes to catch whatever path Netlify passes
app.get("/api/test", (req, res) => res.json({ status: "OK", path: "matched /api/test", url: req.originalUrl }));
app.get("/test", (req, res) => res.json({ status: "OK", path: "matched /test (prefix stripped)", url: req.originalUrl }));
app.get("/.netlify/functions/api/test", (req, res) => res.json({ status: "OK", path: "matched raw path", url: req.originalUrl }));

// Catch-all removed to prevent path-to-regexp crash

