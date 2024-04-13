import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from 'bcryptjs';
import { sendOTP } from "../utils/messaging.js";
import { StreamClient } from "@stream-io/node-sdk";
import jwt from 'jsonwebtoken'
export const registerUser = async(req,res,next)=>{
const  {fullName,password,phone} = req.body;
const isUserExists = await User.findOne({phone:phone});
if(isUserExists){
    return next(new ErrorHandler("User already exists",401));
}
try {
    const user = await User.create({fullName:fullName,password:password,phone:`+91${phone}}`});
    const {message,otp} = await sendOTP(user,next);
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
    user.otp = otp;
    user.verification_access_token = token
    await user.save();
res.status(201).json({success:true,message:"User created successfully",token:token});
} catch (error) {
    console.log(error)
    return next(new ErrorHandler("Internal Server Error",500));
}
}
export const loginUser = async(req,res,next)=>{
const {phone,password} = req.body;
const user = await User.findOne({phone:`+91${phone}`});
if(!user){
    return next(new ErrorHandler("User not exists",400));
}
const isPasswordMatched = await bcrypt.compare(password,user.password);
if(!isPasswordMatched){
    return next(new ErrorHandler("Bad credentials",401));
}
const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'30d'});
res.status(200).json({success:true,message:"User login successful",token:token})
}
export const verifyOtp = async(req,res,next)=>{
const {token,otp} = req.body;
const user = await User.findOne({verification_access_token:token});
if(!user){
    return next(new ErrorHandler("Bad request",400));
}
if(user.otp.toString()===otp){
user.isVerified = true;
await user.save();
const jwtToken = jwt.sign({id:user._id},process.env.JWT_SECRET);
res.status(200).json({success:true,message:"OTP verification successfull",token:jwtToken});
}
else{
    return next(new ErrorHandler("OTP do not match",400))
}
}
export const me = async(req,res,next)=>{
   
   const user = req.user;
   res.status(200).json({success:true,user:{id:user._id,fullName:user.fullName,phone:user.phone}})
}
export const myAccountDetails = async (req, res, next) => {
    try {
      const user = await User.aggregate([
        {
          $match: {
            _id: req.user._id,
          },
        },
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "user",
            as: "allBookings",
            
          },
        },
        {
          $unwind:'$allBookings'
        },
      
        {
          $sort:{'allBookings.date':1}
        },
  {
      $group:{
          _id:'$_id',
          allBookings:{$push:'$allBookings'}
      }
  },
        {
          $project:{
              "password":0,
              
              "verification_access_token":0,
              "forgotPasswordToken":0
  
          }
        }
      ]);
      res.status(200).json({ success: true, userData: user[0] });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
};
export const getCallToken = async(req,res,next)=>{
    const user = req.user;
    const apiKey = process.env.STREAM_API_KEY;
    const secretKey = process.env.STREAM_SECRET_KEY;
    const client = new StreamClient(apiKey, secretKey);
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
    const issued = Math.floor(Date.now()/1000)-60;
    const token = client.createToken(user._id.toString(),exp,issued);
   res.status(200).json({success:true,token:token})
  }
  