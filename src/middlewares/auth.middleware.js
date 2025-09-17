import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "Access token is required"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
      return next(new ApiError(401, "Invalid access token"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid access token"));
    } else if (error.name === "NotBeforeError") {
      return next(new ApiError(401, "Access token not active"));
    } else {
      return next(new ApiError(401, "Token verification failed"));
    }
  }
});

export { verifyJWT };
