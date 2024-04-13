import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    doctor:{type:mongoose.Schema.Types.ObjectId,ref:'Doctor'},
    timeSlot:{ startingTime: { type: String, required: true, },
    endTime: { type: String, required: true, },},
    date:{type:Date,required:true},
    paymentDone:{type:Boolean,default:false},
    isAttended:{type:Boolean,default:false},
    isStarted:{type:Boolean,default:false},
    description:{type:String}
},{
    timestamps:true
});

const Booking = mongoose.model("Booking",bookingSchema);
export default Booking;