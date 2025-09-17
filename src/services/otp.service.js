import otpGenerator from "otp-generator";
import { OTP } from "../models/otp.model.js";
import { ApiError } from "../utils/apiError.js";
import { client } from "../utils/twilio.js";
import sgMail from "@sendgrid/mail";
import { User } from "../models/user.model.js";
import Api from "twilio/lib/rest/Api.js";

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
    throw new ApiError(500, "Error in generating OTP");
  }
};

const sendOtpPhone = async (number) => {
  if (!number) {
    throw new ApiError(500, "Number is required");
  }

  if (!number.startsWith("+")) {
    number = `+91${number}`;
  }

  const user = await User.findOne({ number });
  if (!user) {
    throw new ApiError(400, "User with this number does not exist");
  }

  await OTP.deleteMany({ userIndentifier: number });

  let otp = generateOTP();
  if (!otp) {
    throw new ApiError(500, "Error in generating OTP");
  }

  otp = (await otp).toString();
  const otpObj = await OTP.create({ userIndentifier: number, otp });

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

    return res;
  } catch (error) {
    throw new ApiError(500, "Error in sending OTP");
  }
};

const verifyOtpPhone = async (number, otp) => {
  try {
    if (!number || !otp) {
      throw new ApiError(400, "Number and OTP are required");
    }

    if (!number.startsWith("+")) {
      number = `+91${number}`;
    }

    const otpData = await OTP.findOne({ userIndentifier: number });
    if (!otpData) {
      return false;
    }

    const isValid = await otpData.verify(otp);
    if (!isValid) {
      return false;
    }

    await OTP.deleteMany({ userIdentifier: number });
    return true;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error in verifying OTP");
  }
};

const sendOtpEmail = async (email, name) => {
  try {
    let otp = await generateOTP();
    otp = otp.toString();
    await OTP.deleteMany({ userIndentifier: email });
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const otpObj = await OTP.create({ userIndentifier: email, otp });
    if (!otpObj) {
      throw new ApiError(500, "Failed to send OTP");
    }

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Your OTP Code",
      text: `Hi ${name}, your OTP is ${otp}. It will expire in 10 minutes. Do not share this code with anyone. If you didn’t request this, please ignore this email.`,
      html: `
        <p>Hi ${name},</p>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
        <p>Do not share this code with anyone.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);
    return otp;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

const verifyOTPEmail = async (email, otp) => {
  try {
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const otpData = await OTP.findOne({ userIndentifier: email });
    if (!otpData) {
      return false;
    }

    const isValid = await otpData.verify(otp);
    if (!isValid) {
      return false;
    }

    await OTP.deleteMany({ userIndentifier: email });

    return true;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error while validating email OTP");
  }
};

export {
  generateOTP,
  sendOtpPhone,
  verifyOtpPhone,
  sendOtpEmail,
  verifyOTPEmail,
};
