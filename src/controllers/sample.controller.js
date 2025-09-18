import { WaterQualitySample } from "../models/sample.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getNearbyStation, getWeatherDetails } from "../services/sample.service.js";

const createWaterSample = asyncHandler(async (req, res) => {
  let {
    phLevel,
    turbidityNTU,
    chlorineConcentrationPPM,
    bacterialCountCFU,
    latitude,
    longitude,
  } = req.body;

  if (phLevel === undefined || phLevel === null) {
    throw new ApiError(400, "pH level is required");
  }
  if (turbidityNTU === undefined || turbidityNTU === null) {
    throw new ApiError(400, "Turbidity is required");
  }
  if (chlorineConcentrationPPM === undefined || chlorineConcentrationPPM === null) {
    throw new ApiError(400, "Chlorine concentration is required");
  }
  if (bacterialCountCFU === undefined || bacterialCountCFU === null) {
    throw new ApiError(400, "Bacterial count is required");
  }
  if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
    throw new ApiError(400, "Latitude and Longitude are required");
  }

  if (phLevel < 0 || phLevel > 14) {
    throw new ApiError(400, "pH level must be between 0 and 14");
  }
  if (turbidityNTU < 0) {
    throw new ApiError(400, "Turbidity cannot be negative");
  }
  if (chlorineConcentrationPPM < 0) {
    throw new ApiError(400, "Chlorine concentration cannot be negative");
  }
  if (bacterialCountCFU < 0) {
    throw new ApiError(400, "Bacterial count cannot be negative");
  }

  const stationId = await getNearbyStation(latitude, longitude);
  const weatherData = await getWeatherDetails(stationId);

  const userId = req.user?._id;

  const sample = await WaterQualitySample.create({
    phLevel,
    turbidityNTU,
    chlorineConcentrationPPM,
    bacterialCountCFU,
    rainfallMM: weatherData?.prcp ?? 0,
    temperatureCelsius: weatherData?.temp ?? null,
    relativeHumidityPercent: weatherData?.rhum ?? null,
    collectedBy: userId,
    collectionLocation: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      locationName: locationName?.trim() || null,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, sample, "Water quality sample created successfully"));
});;

const getAllWaterSamples = asyncHandler(async (req, res) => {
  const waterSamples = await WaterQualitySample.find();
  if (!waterSamples) {
    throw new ApiError(404, "No water samples found");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, waterSamples, "Water samples found"));
});

export { createWaterSample, getAllWaterSamples };
