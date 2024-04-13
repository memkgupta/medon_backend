import mongoose from "mongoose"
import Booking from "../models/booking.model.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import Doctor from "../models/doctor.model.js";
export const isTimeSlotAvailaible = async(req,res,next)=>{
    const {doctorId,date,timeSlot} = req.body;
    console.log(req.body)
try {
    const totalBookings  = await Booking.countDocuments({
        doctor:doctorId,
        date,
        'timeSlot.startingTime':timeSlot.startingTime,
        'timeSlot.endTime':timeSlot.endTime
    });
    const {startingTime,endTime} = timeSlot;
    const isVacant = totalBookings<3;
    res.json({date,startingTime,endTime,isVacant});
} catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message,500));
}
}
export const startBooking = async(req,res,next)=>{
    const {timeSlot,date,doctorId} = req.body;
    try {
   
       const previousBookings = await Booking.countDocuments({
           doctor:doctorId,
           date,
           'timeSlot.startingTime':timeSlot.startingTime,
           'timeSlot.endTime':timeSlot.endTime
       });
   if(!(previousBookings<3)){
   return next(new ErrorHandler("Bookings are full",404));
   }
       const booking = await Booking.create({
           doctor:doctorId,
           
           user:req.user._id,
           timeSlot:timeSlot,
           date:date
       });
       res.status(200).json({success:true,booking:booking});
    } catch (error) {
       return next(new ErrorHandler(error.message,500));
    }
   
   }
export const completeBooking = async(req,res,next)=>{
const {id,description} = req.body;
try {
    const booking = await Booking.findByIdAndUpdate(id,{
        description:description,paymentDone:true
    });
    res.status(200).json({success:true,message:"Booking will be completed , complete the payment",booking});
} catch (error) {
    return next(new ErrorHandler(error.message,500));
}

}
export const getBookingDetails = async(req,res,next)=>{
    const {booking_id} = req.query;
    const booking = await Booking.findOne({_id:booking_id}).populate('doctor');
    if(!booking){
        return next(new ErrorHandler("Booking not found"))
    }
    if(!booking.user.equals(req.user._id)){
        const doctor = await Doctor.findOne({userId:req.user._id});
        if(booking.doctor.equals(doctor._id)){
    res.status(200).json({success:true,booking:booking});
return;
        }
    return next(new ErrorHandler("Not booking",400));}
    res.status(200).json({success:true,booking:booking});
}

export const startMeeting = async(req,res,next)=>{
    const user = req.user;
    
    const doctor = await Doctor.findOne({userId:user._id});
    const booking = await Booking.findById(req.query.booking_id);
    if(booking.isAttended){
        return next(new ErrorHandler("Already attended",400))
    }
    if(booking.isStarted){
        res.status(200).json({success:true,message:"Booking started"});
        return;
    }
    if(!booking.doctor.equals(doctor._id)){
        return next(new ErrorHandler("Unauthorized",400));
    }
    booking.isStarted=true;
    await booking.save();
    res.status(200).json({success:true,message:"Booking started"});
}
export const endMeeting = async(req,res,next)=>{
    const user = req.user;
    const booking = await Booking.findById(req.query.booking_id);
    if(booking.isAttended){
        return next(new ErrorHandler("Already attended",400))
    }
    booking.isAttended = true;
    booking.isStarted = false;
    await booking.save();
    res.status(200).json({success:true,message:"Meeting Ended"});
}
// export const rating = async(req,res,next)=>{
//     const user = req.user
//     const booking = await Booking.findById(req.query.booking_id);
    
//     const rating = req.body.rating;
//     if(!booking.isAttended){
//         return next(new ErrorHandler("Bad request",400));
//     }
//     if(!booking.user._id.equals(user._id)){
//         return next(new ErrorHandler("Unauthorized",400));

//     }
//     const doctor = await Doctor.findById(booking.doctor._id);
//     const ratings = doctor.ratings
// }