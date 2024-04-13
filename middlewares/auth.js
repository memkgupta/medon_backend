import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken';
export const getUser = async(req,res,next)=>{
const header = req.headers?.authorization;
if(!header){
    return next(new ErrorHandler("Bad request",400));
}
const token = header.split(' ')[1];
if(!token){
    return next(new ErrorHandler("Bad request",400));
}

const data =  jwt.verify(token,process.env.JWT_SECRET);
const user = await User.findById(data.id);
if(!user){
    return next(new ErrorHandler("Not Authorized",401));
}
req.user = user;
next();
}

export const setUser = async()=>{

}