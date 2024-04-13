import express from 'express'
import { getUser } from '../middlewares/auth.js';
import { findDoctors, getBookings, getDoctorDetails, requestForRegisteringDoctor, requestStatus } from '../controllers/doctor.controller.js';
import { uploadSingleFile } from '../middlewares/multer.js';
;
const doctorRouter = express.Router();

doctorRouter.post('/request',getUser,uploadSingleFile.single('file'),requestForRegisteringDoctor);
doctorRouter.get('/request/:id',getUser,requestStatus);
doctorRouter.get('/search',findDoctors);
doctorRouter.get('/:id',getDoctorDetails);
doctorRouter.get('/dashboard/bookings',getUser,getBookings);
export default doctorRouter;