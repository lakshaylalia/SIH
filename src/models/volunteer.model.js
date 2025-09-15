import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const volunteerSchema = new Schema({});

volunteerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.passwaord = await bcrypt.hash(this.password, 10);
  next();
});

volunteerSchema.methods.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Volunteer = mongoose.model("Volunteer", volunteerSchema);


