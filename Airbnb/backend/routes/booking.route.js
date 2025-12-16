import express from "express"
import isAuth from "../middleware/isAuth.js"
import isUser from "../middleware/isUser.js"
import { cancelBooking, createBooking } from "../controllers/booking.controller.js"


let bookingRouter = express.Router()

bookingRouter.post("/create/:id",isAuth,isUser,createBooking)
bookingRouter.delete("/cancel/:id",isAuth,isUser,cancelBooking)

export default bookingRouter
