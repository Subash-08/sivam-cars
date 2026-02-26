import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';

// ─── Typed Auth Error ─────────────────────────────────────────────────────────

/**
 * AuthError — thrown by requireAdmin() when auth fails.
 *
 * Routes catch this and convert to an HTTP response.
 * This keeps HTTP concerns OUT of the auth layer (clean architecture).
 *
 * Usage in route:
 *   try {
 *     const session = await requireAdmin();
 *   } catch (error) {
 *     if (error instanceof AuthError) {
 *       return NextResponse.json({ success: false, error: error.message }, { status: error.status });
 *     }
 *     throw error; // unexpected errors bubble up
 *   }
 */
export class AuthError extends Error {
    constructor(
        message = 'Unauthorized',
        public readonly status: 401 | 403 = 401,
    ) {
        super(message);
        this.name = 'AuthError';
    }
}

// ─── Guard ────────────────────────────────────────────────────────────────────

/**
 * requireAdmin — server-side auth guard.
 *
 * Throws AuthError if no session exists.
 * Returns the session object on success — use it in the route.
 *
 * Architectural decision: throws instead of returning NextResponse.
 * Reason: auth is a business concern; HTTP response is a transport concern.
 *         Mixing them couples the auth layer to HTTP.
 */
export async function requireAdmin(): Promise<Session> {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new AuthError('Unauthorized — please sign in', 401);
    }

    return session;
}

// ─── Route-level error handler helper ────────────────────────────────────────

/**
 * isAuthError — type-guard for route catch blocks.
 *
 * Usage:
 *   if (isAuthError(error)) return authErrorResponse(error);
 */
export function isAuthError(error: unknown): error is AuthError {
    return error instanceof AuthError;
}
