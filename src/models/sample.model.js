import mongoose, { Schema } from "mongoose";

const sampleSchema = new Schema({});

export const Sample = mongoose.model("Sample", sampleSchema);
