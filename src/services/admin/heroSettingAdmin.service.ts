import { connectDB } from '@/lib/db';
import { HeroSetting } from '@/models';
import type { UpdateHeroSettingInput } from '@/validations/admin/heroSetting.schema';

export class HeroSettingAdminService {
    /**
     * Get the singleton hero settings document, creating it with defaults if it doesn't exist.
     */
    async getSettings() {
        await connectDB();
        let settings = await HeroSetting.findOne().lean();

        if (!settings) {
            // Create default if none exists (singleton pattern mapping)
            const newSettings = await HeroSetting.create({});
            settings = await HeroSetting.findById(newSettings._id).lean();
        }

        return settings;
    }

    /**
     * Update the hero settings. Uses findOneAndUpdate since it's a singleton.
     */
    async updateSettings(data: UpdateHeroSettingInput) {
        await connectDB();

        // Find existing to gracefully update the single doc
        const existing = await HeroSetting.findOne();

        if (!existing) {
            // If it doesn't exist somehow, create it with the provided data
            const newSettings = await HeroSetting.create(data);
            return HeroSetting.findById(newSettings._id).lean();
        }

        // Update the singleton document
        const updated = await HeroSetting.findByIdAndUpdate(
            existing._id,
            data,
            { new: true, runValidators: true }
        ).lean();

        return updated;
    }
}
