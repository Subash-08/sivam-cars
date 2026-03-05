import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Lead } from '@/models/Lead.model';
import { loanLeadSchema } from '@/validations/loanLead.schema';

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

// ─── POST /api/leads/loan ─────────────────────────────────────────────────────

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
        const validation = loanLeadSchema.safeParse(body);

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

        // Store extra fields as formatted message (avoids Lead model changes)
        const message = [
            `City: ${validation.data.city}`,
            `Monthly Income: ₹${validation.data.monthlyIncome}`,
            `Car Budget: ₹${validation.data.carBudget}`,
            `Loan Amount: ₹${validation.data.loanAmount}`,
        ].join(' | ');

        const lead = await Lead.create({
            name: validation.data.name,
            phone: validation.data.phone,
            message,
            type: 'loan',
            source: 'loan-page',
        });

        // Fire n8n webhook (fire-and-forget)
        const webhookUrl = process.env.N8N_WEBHOOK_URL;
        if (webhookUrl) {
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'loan',
                    name: validation.data.name,
                    phone: validation.data.phone,
                    city: validation.data.city,
                    monthlyIncome: validation.data.monthlyIncome,
                    carBudget: validation.data.carBudget,
                    loanAmount: validation.data.loanAmount,
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
        console.error('[POST /api/leads/loan]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit loan enquiry' },
            { status: 500 },
        );
    }
}
