/**
 * Seed Admin Script
 * Run: npm run seed:admin
 *
 * Requires environment variables:
 *   MONGODB_URI
 *   SEED_ADMIN_EMAIL
 *   SEED_ADMIN_PASSWORD
 *   SEED_ADMIN_NAME
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Validate environment ────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Sivam Admin';

if (!MONGODB_URI) {
    console.error('❌  MONGODB_URI is not defined in environment variables.');
    process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌  SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set.');
    process.exit(1);
}

// ─── Inline User Schema (avoid Next.js server-only import issues) ────────────
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ['admin'], default: 'admin' },
    },
    { timestamps: true },
);

const User =
    (mongoose.models.User as mongoose.Model<mongoose.Document>) ||
    mongoose.model('User', UserSchema);

// ─── Seed Function ───────────────────────────────────────────────────────────
async function seedAdmin(): Promise<void> {
    console.log('🔌  Connecting to MongoDB Atlas...');

    await mongoose.connect(MONGODB_URI!);
    console.log('✅  Connected to MongoDB.\n');

    const existingAdmin = await User.findOne({
        email: ADMIN_EMAIL!.toLowerCase(),
    });

    if (existingAdmin) {
        console.log(`⚠️   Admin user already exists: ${ADMIN_EMAIL}`);
        console.log('    No changes made. Exiting.');
        await mongoose.disconnect();
        process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD!, salt);

    await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL!.toLowerCase(),
        password: passwordHash,
        role: 'admin',
    });

    console.log('✅  Admin user created successfully!');
    console.log(`    Name:  ${ADMIN_NAME}`);
    console.log(`    Email: ${ADMIN_EMAIL}`);
    console.log('\n🎉  You can now log in at /auth/login');

    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB.');
    process.exit(0);
}

// ─── Execute ─────────────────────────────────────────────────────────────────
seedAdmin().catch((error: unknown) => {
    console.error('❌  Seed script failed:', error);
    mongoose.disconnect().finally(() => process.exit(1));
});
