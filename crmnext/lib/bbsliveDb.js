// lib/bbsliveDb.js
import mongoose from "mongoose";

let cached = global._bbslive_mongoose || { conn: null, promise: null };

export async function connectBBSlive() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.BBSlIVE_URI || "mongodb://localhost:27017/BBSlive";
    cached.promise = mongoose.createConnection(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }).asPromise();
  }
  cached.conn = await cached.promise;
  global._bbslive_mongoose = cached;
  return cached.conn;
}
