import axios from "axios";
import { ApiError } from "../utils/apiError.js";

const getNearbyStation = async (latitude, longitude) => {
  try {
    if (latitude === null || latitude === undefined) {
      throw error("Latitude is required");
    }
    if (longitude === null || longitude === undefined) {
      throw error("Longitude is required");
    }
    const stationRes = await axios.get(
      "https://meteostat.p.rapidapi.com/stations/nearby",
      {
        params: { lat: latitude, lon: longitude, limit: 1 },
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "meteostat.p.rapidapi.com",
        },
      }
    );
    if (!stationRes.data.data || stationRes.data.data.length === 0) {
      throw error("No weather station found nearby");
    }

    const res = stationRes.data.data[0].id;
    if (!res) {
      throw error("No weather station found nearby");
    }
    return res;
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      error.message
    );
  }
};

const getWeatherDetails = async (stationId) => {
  try {
    if (stationId === null || stationId === undefined) {
      throw error("Station Id is required");
    }
    const weatherRes = await axios.get(
      "https://meteostat.p.rapidapi.com/stations/hourly",
      {
        params: {
          station: stationId,
          start: new Date().toISOString().split("T")[0],
          end: new Date().toISOString().split("T")[0],
          tz: "Asia/Kolkata",
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "meteostat.p.rapidapi.com",
        },
      }
    );

    const weatherData = weatherRes.data.data?.slice(-1)[0];

    if (!weatherData) {
      throw error("N weather data found");
    }
    return weatherData;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export { getNearbyStation, getWeatherDetails };
