import { Router } from "express";
import {
  registerUser,
  loginUserEmail,
  loginUserOtp,
  sendOTP,
  resendOtp,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/generate-otp").post(sendOTP);

router.route("/resend-otp").post(resendOtp);

router.route("/login-otp").post(loginUserOtp);

router.route("/login-email").post(loginUserEmail);

router.route("/logout").post(logoutUser);

export default router;
