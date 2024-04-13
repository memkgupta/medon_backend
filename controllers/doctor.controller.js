import Booking from "../models/booking.model.js";
import Doctor from "../models/doctor.model.js";

import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { upload } from "../utils/cloudinary.js";

export const requestForRegisteringDoctor = async (req, res, next) => {
  const user = req.user;

  const {
    name,
    qualifications,
    gender,
    timeSlots,
    licenseNumber,
    contactInfo,
    consultationFee,
    operationalWeek,
    speciality,
  } = req.body;

  const file = req.file;

  if (!file) {
    return next(new ErrorHandler("Atleast one image is required", 400));
  }
  let url;
  try {
    url = await upload(file, next);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  try {
    const doctor = await Doctor.create({
      name: name,
      userId: user._id,
      qualifications: JSON.parse(qualifications),
      gender: gender,
      speciality: speciality,
      timeSlots: JSON.parse(timeSlots),
      licenseNumber: licenseNumber,
      contactInfo: JSON.parse(contactInfo),
      image: url,
      consultationFee: parseInt(consultationFee),
      operationalWeek: JSON.parse(operationalWeek),
    });
    res
      .status(200)
      .json({
        success: true,
        message:
          "Request Sent successfully Our helper visit on your given address",
        data: { id: doctor._id },
      });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
};
export const verifyDoctor = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { doctorId, accountNo, accountName, ifscCode } = req.body;
  if (!user.isAdmin) {
    return next(new ErrorHandler("Not authorized", 401));
  }
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return next(new ErrorHandler("Bad request", 400));
  }
  doctor.isVerified(true);
  doctor.accountDetails({
    accountName: accountName,
    accountNo: accountNo,
    ifscCode: ifscCode,
  });
  await doctor.save();
  res
    .status(200)
    .json({ success: true, message: "Doctor verified successfully" });
};
export const requestStatus = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const request = await Doctor.findById(req.params.id);
    res
      .status(200)
      .json({
        success: true,
        request: { id: request._id, isVerified: request.isVerified },
      });
  } catch (error) {
    console.log(error.message);
    return next(new ErrorHandler(error.message, 400));
  }
};
export const findDoctors = async (req, res, next) => {
  const limit = 20;
  const { keyword, gender, speciality, page } = req.query;
  const pipeline = [
    {
      $sort: { ratings: -1 },
    },
  ];
  if (keyword) {
    pipeline.push({
      $match: {
        name: { $regex: keyword, $options: "i" },
      },
    });
  }
  if (gender) {
    pipeline.push({
      $match: {
        gender: gender,
      },
    });
  }
  if (speciality) {
    pipeline.push({
      $match: {
        speciality: speciality,
      },
    });
  }
  try {
    const totalDoctors = await Doctor.aggregate([
      ...pipeline,
      {
        $count: "totalResults",
      },
    ]);
    const doctors = await Doctor.aggregate(pipeline)
      .limit(limit)
      .skip((page - 1) * limit);

    res
      .status(200)
      .json({ page: page, totalDoctors: totalDoctors.totalResults, doctors });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
export const getDoctorDetails = async (req, res, next) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).select("-accountDetails");
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", 404));
    }
    res.status(200).json({ success: true, doctor: doctor });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
export const getBookings = async (req, res, next) => {
  console.log(req.user);
  const doctor = await Doctor.findOne({ userId: req.user._id });

  if (!doctor) {
    return next(new ErrorHandler("Invalid request", 400));
  }
  try {
    const bookings = await Booking.find({
      doctor: doctor._id,
      isAttended: false,
    }).sort({ date: 1 });
    res.status(200).json({ success: true, bookings: bookings });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
};
