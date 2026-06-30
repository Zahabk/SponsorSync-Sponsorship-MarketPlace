import { mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB Connected!!");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
  }
};

export default connectDB