import {v4} from 'uuid'
import crypto from 'crypto'
import twilio from 'twilio'
import ErrorHandler from './ErrorHandler.js';
export const sendOTP = async(user,next)=>{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid,authToken);
    const uuidStr = v4();
        // Generate MD5 hash of the UUID string
        const hash = crypto.createHash('md5').update(uuidStr).digest('hex');

        // Convert the hash to an integer
        const hashInt = parseInt(hash, 16);
    
        // Take the last 6 digits of the integer
        const otp = (hashInt % 1000000).toString().padStart(6, '0');
try {
   const message =  await client.messages.create({
        body:`OTP for account verification ${otp}`,
        from:`${process.env.TWILIO_PHONE_NUMBER}`,
        to:user.phone
    });
    return {message,otp}
} catch (error) {
    console.log(error);
    return next(new ErrorHandler("Request failed",500))
}

}