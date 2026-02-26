import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * connectDB — Mongoose singleton for Next.js serverless.
 *
 * Validation is lazy (inside the function) so importing this module
 * at the top of a file never throws — only actual DB calls fail when
 * MONGODB_URI is missing.
 */
export async function connectDB(): Promise<typeof mongoose> {
    // ── Lazy validation — only throw when a real connection is attempted ──
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error(
            '[connectDB] MONGODB_URI is not defined. ' +
            'Create .env.local and add your MongoDB Atlas connection string.',
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
