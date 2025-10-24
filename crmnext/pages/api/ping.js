import connectDB from "../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  res
    .status(200)
    .json({ message: "Connected", db: mongoose.connection.readyState });
}
