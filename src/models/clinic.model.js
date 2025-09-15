import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const clinicSchema = new Schema({});

clinicSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.passwaord = await bcrypt.hash(this.password, 10);
  next();
});

clinicSchema.methods.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Clinic = mongoose.model("Clinic", clinicSchema);
