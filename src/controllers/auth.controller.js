import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { OTP } from "../models/otp.model.js";
import {
  generateOTP,
  sendOtp,
  verifyOTP,
  resendOTP,
} from "../services/otp.service.js";
import { generateToken } from "../services/user.service.js";
import { nanoid } from "nanoid";

const options = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    password,
    documentId,
    phoneNumber,
    age,
    gender,
  } = req.body;
  if (
    !firstName ||
    !email ||
    !password ||
    !documentId ||
    !phoneNumber ||
    !age ||
    !gender
  ) {
    throw new ApiError(400, "Missing required fields");
  }
  if (phoneNumber.length !== 10) {
    throw new ApiError(400, "Invalid phone number");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { documentId }, { phoneNumber }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const uniqueId = nanoid(12).toUpperCase();
  gender = gender.toLowerCase();
  const user = await User.create({
    fullName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    documentId,
    age,
    gender,
    uniqueId,
  });

  const token = await generateToken(user);
  if (!token) {
    throw new ApiError(500, "Failed to generate token");
  }
  user.accessToken = token;
  await user.save({ validateBeforeSave: false });
  return res
    .status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, { user, token }, "User created successfully"));
});

const loginUserEmail = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("user not found");
    throw new ApiError(403, "Invalid email or password");
  }
  console.log(user);

  const isPasswordMatch = await user.comparePassword(password);
  console.log(isPasswordMatch);
  if (!isPasswordMatch) {
    console.log("password not match");
    throw new ApiError(403, "Invalid email or password");
  }

  const token = await generateToken(user);
  if (!token) {
    throw new ApiError(500, "Failed to generate token");
  }

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});

const sendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || phoneNumber.length !== 10) {
    throw new ApiError(400, "Invalid phone number");
  }

  const otp = await generateOTP();
  console.log("OTP :", otp);
  const otpData = await sendOtp(phoneNumber, otp);
  if (!otpData) {
    throw new ApiError(500, error.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, null, "OTP sent successfully"));
});

const resendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || phoneNumber.length !== 10) {
    throw new ApiError(400, "Invalid phone number");
  }

  const otp = await generateOTP();
  const otpData = await resendOTP(phoneNumber, otp);
  if (!otpData) {
    throw new ApiError(500, "Failed to resend OTP");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP resent successfully"));
});

const loginUserOtp = asyncHandler(async (req, res) => {
  let { number, otp } = req.body;
  if (!number || !otp) {
    throw new ApiError(400, "Missing required fields");
  }
  if (number.length !== 10 || otp.length !== 6) {
    throw new ApiError(400, "Invalid phone number or OTP");
  }
  

  const isOtpMatch = await verifyOTP(number, otp);
  console.log(isOtpMatch);
  if (!isOtpMatch) {
    throw new ApiError(403, "Invalid phone number or OTP");
  }

  const user = await User.findOne({ phoneNumber : number });
  if (!user) {
    throw new ApiError(500, "User not found in otp verification");
  }

  const token = await generateToken(user);
  if (!token) {
    throw new ApiError(500, "Failed to generate token");
  }

  return res
    .status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, { user, token }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.cookies?.token) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  }

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export {
  registerUser,
  loginUserEmail,
  loginUserOtp,
  resendOtp,
  sendOTP,
  logoutUser,
};
