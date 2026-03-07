'use client';

import { useState } from 'react';
import {
    ArrowRight,
    Loader2,
    ShieldCheck,
} from 'lucide-react';

interface SellCarFormProps {
    brands: string[];
}

interface FormData {
    brand: string;
    model: string;
    year: string;
    kmDriven: string;
    fuelType: string;
    city: string;
    expectedPrice: string;
    name: string;
    phone: string;
}

const FUEL_OPTIONS = ['Petrol', 'Diesel', 'CNG', 'Petrol + CNG', 'Electric'] as const;

const CITIES = ['Salem', 'Chennai', 'Coimbatore', 'Bangalore', 'Madurai', 'Trichy'] as const;

function generateYears(): number[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 20 }, (_, i) => current - i);
}

export default function SellCarForm({ brands }: SellCarFormProps): React.JSX.Element {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        brand: '',
        model: '',
        year: '',
        kmDriven: '',
        fuelType: '',
        city: '',
        expectedPrice: '',
        name: '',
        phone: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFuelSelect = (fuel: string): void => {
        setFormData((prev) => ({ ...prev, fuelType: fuel }));
    };

    const handleNext = (): void => {
        if (!formData.brand || !formData.model || !formData.year || !formData.fuelType || !formData.city) {
            setError('Please fill all fields before continuing.');
            return;
        }
        setError(null);
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.phone) {
            setError('Please fill all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    message: `Sell Car Request — Brand: ${formData.brand}, Model: ${formData.model}, Year: ${formData.year}, KM: ${formData.kmDriven}, Fuel: ${formData.fuelType}, City: ${formData.city}, Expected Price: ₹${formData.expectedPrice}`,
                    type: 'sell',
                    source: 'sell-car-page',
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit. Please try again.');
            }

            setIsSuccess(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                    Request Submitted!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Our team will contact you within 30 minutes with a valuation
                    for your {formData.brand} {formData.model}.
                </p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            {/* Top accent bar */}
            <div
                className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-red-500 to-red-700"
                aria-hidden="true"
            />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                        Get Your Offer
                    </h3>
                    <span className="rounded bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500">
                        Step {step} of 2
                    </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-red-600 transition-all duration-500"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} id="sell-car-form">
                {step === 1 ? (
                    <div className="space-y-4">
                        {/* Brand + Model */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="sell-brand"
                                    className="ml-1 text-xs font-bold text-muted-foreground"
                                >
                                    Brand
                                </label>
                                <select
                                    id="sell-brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    aria-label="Select car brand"
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="sell-model"
                                    className="ml-1 text-xs font-bold text-muted-foreground"
                                >
                                    Model
                                </label>
                                <input
                                    id="sell-model"
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="e.g. Creta SX"
                                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    aria-label="Car model name"
                                />
                            </div>
                        </div>

                        {/* Year + KM */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="sell-year"
                                    className="ml-1 text-xs font-bold text-muted-foreground"
                                >
                                    Year
                                </label>
                                <select
                                    id="sell-year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    aria-label="Manufacturing year"
                                >
                                    <option value="">Year</option>
                                    {generateYears().map((y) => (
                                        <option key={y} value={String(y)}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="sell-km"
                                    className="ml-1 text-xs font-bold text-muted-foreground"
                                >
                                    KM Driven
                                </label>
                                <input
                                    id="sell-km"
                                    type="number"
                                    name="kmDriven"
                                    value={formData.kmDriven}
                                    onChange={handleChange}
                                    placeholder="e.g. 45000"
                                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    aria-label="Total kilometers driven"
                                />
                            </div>
                        </div>

                        {/* Fuel Type */}
                        <div className="space-y-1.5">
                            <label className="ml-1 text-xs font-bold text-muted-foreground">
                                Fuel Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {FUEL_OPTIONS.map((fuel) => (
                                    <button
                                        type="button"
                                        key={fuel}
                                        onClick={() => handleFuelSelect(fuel)}
                                        className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${formData.fuelType === fuel
                                            ? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20'
                                            : 'border-border bg-muted text-muted-foreground hover:border-muted-foreground'
                                            }`}
                                        aria-pressed={formData.fuelType === fuel}
                                    >
                                        {fuel}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* City */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="sell-city"
                                className="ml-1 text-xs font-bold text-muted-foreground"
                            >
                                City
                            </label>
                            <select
                                id="sell-city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                aria-label="Select city"
                            >
                                <option value="">Select City</option>
                                {CITIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleNext}
                            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] hover:from-red-500 hover:to-red-600 active:scale-[0.98]"
                        >
                            <span>Continue</span>
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Expected Price */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="sell-price"
                                className="ml-1 text-xs font-bold text-muted-foreground"
                            >
                                Expected Price (₹)
                            </label>
                            <input
                                id="sell-price"
                                type="number"
                                name="expectedPrice"
                                value={formData.expectedPrice}
                                onChange={handleChange}
                                placeholder="e.g. 500000"
                                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                aria-label="Expected selling price"
                            />
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="sell-name"
                                className="ml-1 text-xs font-bold text-muted-foreground"
                            >
                                Your Name
                            </label>
                            <input
                                id="sell-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                aria-label="Your full name"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="sell-phone"
                                className="ml-1 text-xs font-bold text-muted-foreground"
                            >
                                Phone Number
                            </label>
                            <input
                                id="sell-phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                aria-label="Your phone number"
                            />
                            <p className="ml-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <ShieldCheck size={10} aria-hidden="true" />
                                Your number is safe with us.
                            </p>
                        </div>

                        {/* Back + Submit */}
                        <div className="mt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="rounded-xl px-6 py-4 font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] hover:from-red-500 hover:to-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Get Instant Offer</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
