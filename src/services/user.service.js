import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";


const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const token = await user.generateAccessToken();
    return token;
  } catch (error) {
    throw new ApiError(500, "Error in generating token");
  }
};


export { generateToken };
