import mongoose from "mongoose";

// grab the URI from .env.local
const MONGODB_URI = process.env.MONGODB_URI as string;

// we cache the connection so it doesn't reconnect on every request
let cached = (global as any).mongoose ?? { conn: null, promise: null };

export async function connectDB() {
  // if already connected just return it
  if (cached.conn) return cached.conn;

  // otherwise connect and cache it
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI);
  cached.conn = await cached.promise;

  return cached.conn;
}