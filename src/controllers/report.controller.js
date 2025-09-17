import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Report } from "../models/report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createReport = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    gender,
    contact,
    tehsil,
    district,
    state,
    latitude,
    longitude,
    pinCode,
    landmark,
    documentId,
    disease,
    symptoms,
  } = req.body;

  if (
    !name ||
    !age ||
    !gender ||
    !contact ||
    !tehsil ||
    !district ||
    !state ||
    !pinCode ||
    !latitude ||
    !longitude ||
    !documentId ||
    !symptoms
  ) {
    throw new ApiError(400, "Please fill all the mandatory fields.");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: Please log in to create a report.");
  }

  const sanitizedContact = contact.startsWith("+") ? contact : `+91${contact}`;

  const address = {
    tehsil,
    district,
    state,
    pinCode,
    latitude,
    longitude,
    ...(landmark && { landmark }),
  };

  const reportData = {
    name,
    age,
    gender,
    contact: sanitizedContact,
    address,
    documentId,
    symptoms,
    reportedBy: userId,
  };

  if (disease) {
    const localImagePath = req.file?.path;
    if (!localImagePath) {
      throw new ApiError(
        400,
        "Please upload a medical report file for the diagnosed disease."
      );
    }
    const image = await uploadOnCloudinary(localImagePath);
    if (!image || !image.url) {
      throw new ApiError(500, "Failed to upload the medical report.");
    }
    reportData.disease = disease;
    reportData.medicalReport = image.url;
  }

  const report = await Report.create(reportData);

  if (!report) {
    throw new ApiError(500, "Report creation failed. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, report, "Report created successfully."));
});

export { createReport };
