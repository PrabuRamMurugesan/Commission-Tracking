import mongoose from 'mongoose';

let isConnected = false;

export async function mongoConnect() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}
