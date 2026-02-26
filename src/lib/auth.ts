import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/validations/auth.validation';
import { verifyAdminCredentials } from '@/services/auth.service';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('[NextAuth] Incoming login attempt for:', credentials?.email);

                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) {
                    console.error('[NextAuth] Zod validation failed:', parsed.error);
                    return null;
                }

                console.log('[NextAuth] Validation passed. Verifying against MongoDB...');
                try {
                    const admin = await verifyAdminCredentials(
                        parsed.data.email,
                        parsed.data.password,
                    );

                    if (!admin) {
                        console.error('[NextAuth] verification returned null. Incorrect credentials or user missing.');
                    } else {
                        console.log('[NextAuth] Verification successful for user ID:', admin.id);
                    }

                    return admin;
                } catch (error) {
                    console.error('[NextAuth] Fatal error inside authorize callback:', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development' || true, // Force debug logs in Vercel temporarily
    secret: process.env.NEXTAUTH_SECRET,
};
