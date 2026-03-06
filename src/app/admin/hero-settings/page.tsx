'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type HeroSetting = {
    badgeText: string;
    headingPrimary: string;
    headingSecondary: string;
    description: string;
    trustIndicators: string[];
    backgroundImage: string;
    backgroundImageAlt: string;
};

export default function HeroSettingsPage() {
    const [settings, setSettings] = useState<HeroSetting | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/hero-settings');
                const data = await res.json();
                if (data.success) {
                    setSettings(data.settings);
                } else {
                    setError('Failed to load settings');
                }
            } catch (err) {
                setError('An error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!settings) return;
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleTrustIndicatorChange = (index: number, value: string) => {
        if (!settings) return;
        const newIndicators = [...settings.trustIndicators];
        newIndicators[index] = value;
        setSettings({ ...settings, trustIndicators: newIndicators });
    };

    const addIndicator = () => {
        if (!settings) return;
        if (settings.trustIndicators.length >= 10) return;
        setSettings({ ...settings, trustIndicators: [...settings.trustIndicators, ''] });
    };

    const removeIndicator = (index: number) => {
        if (!settings) return;
        const newIndicators = settings.trustIndicators.filter((_: string, i: number) => i !== index);
        setSettings({ ...settings, trustIndicators: newIndicators });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !settings) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'hero');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                // Delete previous image if needed, but for simplicity, we keep it in Cloudinary to not lose history
                setSettings({ ...settings, backgroundImage: data.url });
            } else {
                setError(data.error || 'Failed to upload image');
            }
        } catch (err) {
            setError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            // Strip out MongoDB internal fields that cause Zod validation to fail
            const { _id, createdAt, updatedAt, __v, ...validSettings } = settings as any;

            const payload = {
                ...validSettings,
                trustIndicators: validSettings.trustIndicators?.filter((t: string) => t.trim() !== '') || [], // Remove empty indicators
            };

            const res = await fetch('/api/admin/hero-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess('Hero settings updated successfully');
                setSettings(data.settings);
            } else {
                setError(data.error || 'Failed to update settings');
            }
        } catch (err) {
            setError('Update failed');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
    }

    if (!settings) {
        return <div className="p-8 text-center text-destructive">Failed to load settings.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Hero Section Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage the main heading, background image, and text appearing at the top of the homepage.
                </p>
            </div>

            {error && <div className="bg-destructive/10 text-destructive p-4 rounded text-sm font-medium">{error}</div>}
            {success && <div className="bg-green-500/10 text-green-600 p-4 rounded text-sm font-medium">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-xl p-6 sm:p-8">

                {/* Background Image Upload */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b border-border pb-2">Background Image</h2>
                    <div className="text-sm text-muted-foreground">
                        Recommended size: 1920×1080. Format: JPG or WebP. Max size: 3MB.
                        Image is automatically optimized by Cloudinary.
                    </div>

                    {settings.backgroundImage && (
                        <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-border bg-muted">
                            <Image
                                src={settings.backgroundImage}
                                alt="Current Hero Background"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <label className="relative cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm font-medium transition-colors">
                            <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </label>
                        {uploading && <span className="text-sm text-muted-foreground animate-pulse">Uploading to Cloudinary...</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Background Image Alt Text (SEO)</label>
                        <input
                            type="text"
                            name="backgroundImageAlt"
                            value={settings.backgroundImageAlt}
                            onChange={handleChange}
                            required
                            className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b border-border pb-2">Text Content</h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Badge Text (Small Pill above Heading)</label>
                        <input
                            type="text"
                            name="badgeText"
                            value={settings.badgeText}
                            onChange={handleChange}
                            required
                            className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g. Verified Used Cars Marketplace"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Primary Heading (Line 1)</label>
                            <input
                                type="text"
                                name="headingPrimary"
                                value={settings.headingPrimary}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. Discover Quality"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Secondary Heading (Line 2 - Red)</label>
                            <input
                                type="text"
                                name="headingSecondary"
                                value={settings.headingSecondary}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. Used Cars at the Best Price"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Description Text</label>
                        <textarea
                            name="description"
                            value={settings.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-y"
                            placeholder="Brief description below the headings..."
                        />
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <h2 className="text-lg font-semibold">Trust Indicators</h2>
                        <button
                            type="button"
                            onClick={addIndicator}
                            disabled={settings.trustIndicators.length >= 8}
                            className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                        >
                            + Add Indicator
                        </button>
                    </div>

                    <div className="space-y-3">
                        {settings.trustIndicators.map((indicator: string, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-red-500 font-bold shrink-0">✓</span>
                                <input
                                    type="text"
                                    value={indicator}
                                    onChange={(e) => handleTrustIndicatorChange(index, e.target.value)}
                                    className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                    placeholder="e.g. Verified Listings"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeIndicator(index)}
                                    className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    aria-label="Remove priority"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {settings.trustIndicators.length === 0 && (
                            <div className="text-sm text-muted-foreground p-4 text-center border border-dashed border-border rounded">
                                No trust indicators added.
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving || uploading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded text-sm font-bold transition-all disabled:opacity-50 min-w-32"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
