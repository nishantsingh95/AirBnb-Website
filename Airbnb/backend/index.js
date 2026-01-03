import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import bookingRouter from "./routes/booking.route.js"
import adminRouter from "./routes/admin.route.js"
let port = process.env.PORT || 6000

let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://stayyhub.netlify.app"],
    credentials: true
}))

console.log("DEBUG: authRouter type:", typeof authRouter);
console.log("DEBUG: userRouter type:", typeof userRouter);
console.log("DEBUG: listingRouter type:", typeof listingRouter);
console.log("DEBUG: bookingRouter type:", typeof bookingRouter);
console.log("DEBUG: adminRouter type:", typeof adminRouter);

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/listing", listingRouter)
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter)

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working via Netlify Functions!" })
})



// Export the app for serverless and local dev (via server.js)
export default app;
