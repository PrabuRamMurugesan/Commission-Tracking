
// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) throw new Error("MONGO_URI not defined");

// let cached = global.mongoose || { conn: null, promise: null };
// global.mongoose = cached;

// export async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }


// lib/db.js
import { MongoClient } from "mongodb";

let client;
let clientPromise;

// + Ensure MONGO_URI is present
const uri = process.env.MONGO_URI;               // (+8)
if (!uri) throw new Error("MONGO_URI not defined"); // (+9)
const opts = {};

if (!global._bbsliveClientPromise) {             // (+13)
  client = new MongoClient(uri, opts);
  global._bbsliveClientPromise = client.connect();
}
clientPromise = global._bbsliveClientPromise;

export async function getBBSLiveDb() {           // (+19)
  const c = await clientPromise;
  return c.db("BBSlive");
}

export async function getCollection(name) {      // (+24)
  const db = await getBBSLiveDb();
  return db.collection(name);
}
