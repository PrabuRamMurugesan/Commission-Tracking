import mongoose from "mongoose";

const LoginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: String,
  loginTime: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
  role: String,
});

const LoginLog =
  mongoose.models.LoginLog || mongoose.model("LoginLog", LoginLogSchema);
export default LoginLog;
