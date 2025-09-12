import mongoose from "mongoose";

const DB_NAME = "sih";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection FAILED:", error);
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;