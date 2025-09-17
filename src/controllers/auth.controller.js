import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import {
  sendOtpPhone,
  verifyOtpPhone,
  sendOtpEmail,
  verifyOTPEmail,
} from "../services/otp.service.js";
import { generateToken } from "../services/user.service.js";
import { nanoid } from "nanoid";
import { customAlphabet } from 'nanoid';

const options = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, documentId, number, role } = req.body;
  if (!name || !email || !password || !documentId || !number || !role) {
    throw new ApiError(400, "Missing required fields");
  }
  if (number.length !== 10) {
    throw new ApiError(400, "Invalid phone number");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { documentId }, { number }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }
  if (!number.startsWith("+")) {
    number = `+91${number}`;
  }

  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const generateUniqueId = customAlphabet(alphabet, 12);
  const uniqueId = generateUniqueId();
  let user = await User.create({
    name,
    email,
    password,
    number,
    documentId,
    uniqueId,
    role,
  });

  const token = await generateToken(user);
  if (!token) {
    throw new ApiError(500, "Failed to generate token");
  }
  user.accessToken = token;
  await user.save({ validateBeforeSave: false });
  user = await User.findOne(
    { email },
    "name number avatarImage _id email documentId role uniqueId"
  );
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

  let user = await User.findOne({ email });
  if (!user) {
    console.log("user not found");
    throw new ApiError(403, "Invalid email or password");
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    console.log("password not match");
    throw new ApiError(403, "Invalid email or password");
  }

  const token = await generateToken(user);
  if (!token) {
    throw new ApiError(500, "Failed to generate token");
  }

  user = await User.findOne(
    { email },
    "name number avatarImage _id email documentId role uniqueId"
  );
  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user, token }, "User logged in successfully"));
});

const sendOTPEmail = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new ApiError(400, "Email and Name required");
  }

  const otpData = await sendOtpEmail(email, name);
  if (!otpData) {
    throw new ApiError(500, error.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, null, "OTP sent successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP required");
  }

  if (otp.length !== 6) {
    throw new ApiError(400, "Invalid OTP");
  }

  const isOtpMatch = await verifyOTPEmail(email, otp);
  if (!isOtpMatch) {
    throw new ApiError(403, "Invalid email or OTP");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Email verified successfully"));
});

const sendOTPPhone = asyncHandler(async (req, res) => {
  const { number } = req.body;
  if (!number || number.length !== 10) {
    throw new ApiError(400, "Invalid phone number");
  }

  const otpData = await sendOtpPhone(number);
  if (!otpData) {
    throw new ApiError(500, error.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, null, "OTP sent successfully"));
});

const verifyNumber = asyncHandler(async (req, res) => {
  const { number, otp } = req.body;
  if (!number || !otp) {
    throw new ApiError(400, "Email and otp required");
  }

  if (number.length !== 10 || otp.length !== 6) {
    throw new ApiError(403, "Invalid phone number of OTP");
  }

  const isOtpMatch = await verifyOtpPhone(number, otp);
  if (!isOtpMatch) {
    throw new ApiError(403, "Invalid phone number or OTP");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Phone number verified successfully"));
});

const loginUserOtp = asyncHandler(async (req, res) => {
  let { number, otp } = req.body;
  if (!number || !otp) {
    throw new ApiError(400, "Email and OTP required.");
  }
  if (number.length !== 10 || otp.length !== 6) {
    throw new ApiError(400, "Invalid phone number or OTP");
  }

  const isOtpMatch = await verifyOtpPhone(number, otp);
  if (!isOtpMatch) {
    throw new ApiError(403, "Invalid phone number or OTP");
  }

  if (!number.startsWith("+")) {
    number = `+91${number}`;
  }

  const user = await User.findOne(
    { number },
    "name number avatarImage _id email documentId role uniqueId"
  );
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
  sendOTPPhone,
  logoutUser,
  verifyNumber,
  verifyEmail,
  sendOTPEmail,
};
