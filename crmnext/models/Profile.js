import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  avatar: String,
});

export default mongoose.models.Profile || mongoose.model("Profile", UserSchema);
