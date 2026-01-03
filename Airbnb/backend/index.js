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
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/listing", listingRouter)
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter)



// Export the app for serverless
export default app;

// Only start the server if this file is run directly (optional, but good practice if you can detect it)
// However, since we are in ES modules, detecting "main" is harder without import.meta.url check.
// For now, to keep it simple and avoid breaking local dev `npm run dev` (which runs `nodemon index.js`),
// we can keep the listen call. BUT, when imported by api.js, it will also try to listen.
// A common pattern is to separate app creation from listening.
// Let's modify this file to export app, and create a NEW server.js for local dev?
// Or just check if we are in a serverless environment?

// Let's try a simple approach: just export app.
// If problems arise with double listening, I'll fix it.

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        connectDb()
        console.log("server started")
    })
}
