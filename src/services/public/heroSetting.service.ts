import { connectDB } from '@/lib/db';
import { HeroSetting } from '@/models';

export class HeroSettingService {
    /**
     * Retrieves the active hero settings for the public homepage.
     * Returns a default object if the database is completely empty to prevent crashes.
     */
    async getSettings() {
        await connectDB();

        // Retrieve the singleton document. We use .lean() for performance
        const settings = await HeroSetting.findOne().lean();

        if (settings) {
            return settings;
        }

        // Fallback default values if none configured by admin yet
        return {
            badgeText: 'Verified Used Cars Marketplace',
            headingPrimary: 'Discover Quality',
            headingSecondary: 'Used Cars at the Best Price',
            description: 'Browse thousands of inspected used cars.',
            trustIndicators: [
                'Verified Listings',
                'Best Market Prices',
                'Easy Financing',
                'RC Transfer Support',
            ],
            backgroundImage: '/assets/images/10003.jpg',
            backgroundImageAlt: 'Premium used cars showroom',
        };
    }
}
