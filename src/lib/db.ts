import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables.");
}

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const globalCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = globalCache;

export async function connectDB() {
    if (globalCache.conn) return globalCache.conn;

    if (!globalCache.promise) {
        globalCache.promise = mongoose
            .connect(MONGODB_URI, { dbName: "tortoise_listings" })
            .then((m) => m);
    }

    globalCache.conn = await globalCache.promise;
    return globalCache.conn;
}
