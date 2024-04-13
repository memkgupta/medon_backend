import express from 'express';
import { getCallToken, loginUser, me, myAccountDetails, registerUser, verifyOtp } from '../controllers/user.controller.js';
import { getUser } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/verify-otp").put(verifyOtp);
userRouter.route("/me").get(getUser,me);
userRouter.route("/account-details").get(getUser,myAccountDetails);
userRouter.route('/get-call-token').get(getUser,getCallToken);
export default userRouter;