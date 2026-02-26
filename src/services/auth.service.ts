import { connectDB } from '@/lib/db';
import User from '@/models/User.model';

interface AdminUser {
    id: string;
    name: string;
    email: string;
}

export async function verifyAdminCredentials(
    email: string,
    password: string,
): Promise<AdminUser | null> {
    try {
        await connectDB();

        // Explicitly select password field (excluded by default in schema)
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            '+password',
        );

        if (!user) return null;

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return null;

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    } catch (error) {
        // Log the real error server-side so it's visible in the terminal
        console.error('[verifyAdminCredentials] Authentication error:', error);
        return null;
    }
}
