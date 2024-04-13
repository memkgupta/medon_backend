import express from "express"
import { completeBooking, getBookingDetails, isTimeSlotAvailaible, startBooking, startMeeting } from "../controllers/booking.controller.js";
import {getUser} from "../middlewares/auth.js"
const bookingRouter = express.Router();
bookingRouter.route("/check-time-slot").post(isTimeSlotAvailaible);
bookingRouter.route("/start").post(getUser,startBooking);
bookingRouter.route("/complete").post(getUser,completeBooking);
bookingRouter.route("/details").get(getUser,getBookingDetails);
bookingRouter.route("/start").put(getUser,startMeeting);

export default bookingRouter;