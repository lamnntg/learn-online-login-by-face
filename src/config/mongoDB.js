import mongoose from "mongoose";
require("dotenv").config();

export const connectDB = async () => {
  const client = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connect to mongo DB Successfully ");
};
