import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // auto-delete after 10 minutes
  },
});

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

otpSchema.methods.verify = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};

export const OTP = mongoose.model("OTP", otpSchema);
