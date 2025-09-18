import mongoose, { Mongoose, Schema } from "mongoose";

const waterQualitySampleSchema = new Schema(
  {
    phLevel: {
      type: Number,
      required: [true, "pH level is required"],
      min: [0, "pH level must be between 0 and 14"],
      max: [14, "pH level must be between 0 and 14"],
    },
    turbidityNTU: {
      type: Number,
      required: [true, "Turbidity measurement is required"],
      min: [0, "Turbidity cannot be negative"],
    },
    chlorineConcentrationPPM: {
      type: Number,
      required: [true, "Chlorine concentration is required"],
      min: [0, "Chlorine concentration cannot be negative"],
    },
    bacterialCountCFU: {
      type: Number,
      required: [true, "Bacterial count is required"],
      min: [0, "Bacterial count cannot be negative"],
    },
    rainfallMM: {
      type: Number,
      required: [true, "Rainfall measurement is required"],
      min: [0, "Rainfall cannot be negative"],
    },
    temperatureCelsius: {
      type: Number,
      required: [true, "Temperature measurement is required"],
    },
    relativeHumidityPercent: {
      type: Number,
      required: [true, "Humidity measurement is required"],
      min: [0, "Humidity cannot be below 0%"],
      max: [100, "Humidity cannot exceed 100%"],
    },
    collectedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Sample collector is required"],
    },
    collectionLocation: {
      latitude: {
        type: Number,
        required: [true, "Collection latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Collection longitude is required"],
      },
    },
    sampleStatus: {
      type: String,
      enum: ["pending", "analyzed", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

waterQualitySampleSchema.index({ collectedBy: 1, createdAt: -1 });
waterQualitySampleSchema.index({
  "collectionLocation.latitude": 1,
  "collectionLocation.longitude": 1,
});
waterQualitySampleSchema.index({ sampleStatus: 1 });

export const WaterQualitySample = mongoose.model(
  "WaterQualitySample",
  waterQualitySampleSchema
);
