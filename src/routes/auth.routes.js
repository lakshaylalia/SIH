import { Router } from "express";
import {
  registerUser,
  loginUserEmail,
  loginUserOtp,
  sendOTPPhone,
  logoutUser,
  verifyNumber,
  verifyEmail,
  sendOTPEmail,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/verify-email").post(verifyEmail);

router.route("/login-email").post(loginUserEmail);

router.route("/generate-otp-mail").post(sendOTPEmail);

router.route("/verify-number").post(verifyNumber);

router.route("/generate-otp-number").post(sendOTPPhone);

router.route("/login-otp").post(loginUserOtp);

router.route("/logout").post(logoutUser);

export default router;
