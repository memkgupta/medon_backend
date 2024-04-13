import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    fullName:{type:String,required:true},
    phone:{type:String,required:true,unique:true},
    isVerified:{type:Boolean,default:false},
    password:{type:String,required:true},
    otp:{type:String},
    isAdmin:{type:Boolean,default:false},
    verification_access_token:{type:String},
    forgotPasswordToken:{type:String}
},{timestamps:true});
userSchema.pre('save',async function(){
if(this.isModified('password')){
    const hashed = await bcrypt.hash(this.password,12);
    this.password = hashed;
}
})
const User = mongoose.model("User",userSchema);
export default User;