import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Lead } from '@/models/Lead.model';
import { leadSchema } from '@/validations/lead.schema';

// ─── Simple IP-based rate limiter (in-memory — resets on redeploy) ────────────

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;       // max per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
        return false;
    }

    entry.count += 1;
    return entry.count > RATE_LIMIT;
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        // Rate limit by IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { success: false, error: 'Too many requests. Please try again later.' },
                { status: 429 },
            );
        }

        const body = await request.json();
        const validation = leadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: validation.error.issues },
                { status: 400 },
            );
        }

        await connectDB();

        const lead = await Lead.create({
            name: validation.data.name,
            phone: validation.data.phone,
            message: validation.data.message ?? '',
            car: validation.data.carId,
            source: 'detail-page',
        });

        return NextResponse.json(
            { success: true, id: String(lead._id) },
            { status: 201 },
        );
    } catch (error) {
        console.error('[POST /api/leads]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit enquiry' },
            { status: 500 },
        );
    }
}
