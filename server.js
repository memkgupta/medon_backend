import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'   
import bodyParser from 'body-parser';
import userRouter from './routes/user.router.js';
import connect from './config/db.config.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import doctorRouter from './routes/doctor.routes.js';
import {v2 as cloudinary} from 'cloudinary';
import bookingRouter from './routes/booking.routes.js';
const app = express();
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests
connect();
app.use("/api/v1/user",userRouter);
app.use("/api/v1/doctor",doctorRouter);
app.use("/api/v1/booking",bookingRouter);
app.use(errorMiddleware)
app.listen(8000,()=>{
    console.log("Server listening to 8000")
})