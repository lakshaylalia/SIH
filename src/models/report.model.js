import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "Patient name is required"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
      required: [true, "Gender is required"],
      lowercase: true,
    },
    contact: {
      type: String,
      required: [true, "Phone number is required"],
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
    },
    address: {
      tehsil: {
        type: String,
        required: [true, "Tehsil address is required"],
        trim: true,
      },
      district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      pinCode: {
        type: String,
        required: [true, "PIN code is required"],
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    documentId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    disease: {
      type: String,
      trim: true,
      maxLength: [200, "Disease description cannot exceed 200 characters"],
    },
    medicalReport: {
      type: String,
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
      validate: {
        validator: function (symptoms) {
          return symptoms.length <= 20;
        },
        message: "Cannot have more than 20 symptoms",
      },
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

reportSchema.methods.getFullAddress = function () {
  const { street, city, state, zipCode, country } = this.address;
  return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
};

export const Report = mongoose.model("Report", reportSchema);
