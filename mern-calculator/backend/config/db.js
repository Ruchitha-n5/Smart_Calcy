import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/visual_calculator";
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.warn("Starting without MongoDB. History will be kept in server memory until MongoDB is configured.");
  }
};

export default connectDB;
