import otpGenerator from "otp-generator";
import { OTP } from "../models/otp.model.js";
import { ApiError } from "../utils/apiError.js";
import { client } from "../utils/twilio.js";

const generateOTP = async () => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    return otp;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error in generating OTP");
  }
};

const sendOtp = async (number, otp) => {
  if (!number || !otp) {
    throw new ApiError(400, "Number and OTP are required");
  }

  if (!number.startsWith("+")) {
    number = `+91${number}`;
  }

  await OTP.deleteMany({ phoneNumber: number });
  const otpObj = await OTP.create({ phoneNumber: number, otp });
  if (!otpObj) {
    throw new ApiError(500, "Failed to send OTP");
  }

  const message = `Your OTP is ${otp}. This OTP will expire in 10 minutes.`;

  try {
    const res = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: number,
    });

    console.log("OTP sent:", res.sid);
    return res;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error in sending OTP");
  }
};

const verifyOTP = async (number, otp) => {
  try {
    if (!number || !otp) {
      throw new ApiError(400, "Number and OTP are required");
    }

    if (!number.startsWith("+")) {
      number = `+91${number}`;
    }

    const otpData = await OTP.findOne({ phoneNumber: number });
    console.log("OTP data:", otpData);
    if (!otpData) {
      return false;
    }
    const isValid = await otpData.verify(otp);
    console.log("OTP verified:", isValid);

    if (isValid) {
      await OTP.deleteOne({ phoneNumber: number });
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error in verifying OTP");
  }
};

const resendOTP = async (number) => {
  try {
    await OTP.deleteMany({ phoneNumber: number });
    const newOtp = await generateOTP();
    const res = await sendOtp(number, newOtp);
    return res;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error in resending OTP");
  }
};

export { generateOTP, sendOtp, verifyOTP, resendOTP };
