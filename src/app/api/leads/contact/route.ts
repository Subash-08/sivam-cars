import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Lead } from '@/models/Lead.model';
import { contactLeadSchema } from '@/validations/contactLead.schema';

// ─── Simple IP-based rate limiter (in-memory — resets on redeploy) ────────────

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

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

// ─── POST /api/leads/contact ──────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            'unknown';

        if (isRateLimited(ip)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Too many requests. Please try again later.',
                },
                { status: 429 },
            );
        }

        const body: unknown = await request.json();
        const validation = contactLeadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validation.error.issues,
                },
                { status: 400 },
            );
        }

        await connectDB();

        const lead = await Lead.create({
            name: validation.data.name,
            phone: validation.data.phone,
            email: validation.data.email || undefined,
            message: validation.data.message,
            type: 'contact',
            source: 'contact-page',
        });

        // Fire n8n webhook (fire-and-forget)
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    name: validation.data.name,
                    phone: validation.data.phone,
                    email: validation.data.email,
                    message: validation.data.message,
                    leadId: String(lead._id),
                    timestamp: new Date().toISOString(),
                }),
            }).catch((err: unknown) => {
                console.error('[n8n webhook error]', err);
            });
        }

        return NextResponse.json(
            { success: true, id: String(lead._id) },
            { status: 201 },
        );
    } catch (error: unknown) {
        console.error('[POST /api/leads/contact]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit message' },
            { status: 500 },
        );
    }
}
