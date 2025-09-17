import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Name is required"],
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      validate: {
        validator: function (v) {
          // Only validate on new passwords or when password is being changed
          if (!this.isModified("password")) return true;
          // Check for at least one uppercase, one lowercase, one number
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(v);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    uniqueId: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    documentId: {
      type: String,
      required: [true, "Document ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      minLength: [
        13,
        "Phone number must be exactly 13 characters (+91xxxxxxxxxx)",
      ],
      maxLength: [
        13,
        "Phone number must be exactly 13 characters (+91xxxxxxxxxx)",
      ],
      validate: {
        validator: function (v) {
          return /^\+91[6-9]\d{9}$/.test(v);
        },
        message:
          "Phone number must be a valid Indian mobile number (+91xxxxxxxxxx)",
      },
      index: true,
    },
    avatarImage: {
      type: String,
      required: true,
      trim: true,
      default: "/images/defaultUserImage.webp",
    },
    role: {
      type: String,
      enum: {
        values: ["volunteer", "clinic", "ashaWorker", "admin"],
        message: "Role must be volunteer, clinic, ashaWorker, or admin",
      },
      required: [true, "Role is required"],
      lowercase: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      uniqueId: this.uniqueId,
      fullName: this.fullName,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    }
  );
};

export const User = mongoose.model("User", userSchema);
