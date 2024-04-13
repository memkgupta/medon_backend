import mongoose from "mongoose";
const weekEnum = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const specialityEnum = [ "General Physician",
"Internal Medicine",
"Urology",
"Pediatrics",
"Obstetrics & Gynecology",
"Psychiatry",
"Cardiology",
"Dermatology",
"Orthopedics",
"Gastroenterology",
"Neurology"]
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
  },
  qualifications: [
    {
      name: { type: String, required: true },
      institute: { type: String, required: true },
      passingYear: { type: Number, required: true },
    },
  ],
  image: { type: String, required: true },
  gender: { type: String, required: true, enum: ["MALE", "FEMALE"] },
  ratings: { type: Number, default: 0 },
  timeSlots: [
    {
      startingTime: { type: String, required: true, },
      endTime: { type: String, required: true, },
    },
  ],
  licenseNumber: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  consultationFee: { type: Number, required: true },
  speciality:{type:String,required:true,enum:specialityEnum},
  accountDetails: {
    accountNo: { type: Number,  unique: true },
    accountName: { type: String,  },
    ifscCode: { type: String,  },
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
