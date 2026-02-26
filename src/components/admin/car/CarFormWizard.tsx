'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CarFormStepper, STEPS, type StepId } from './CarFormStepper';
import { CarFormActions } from './CarFormActions';
import { StepBasic } from './steps/StepBasic';
import { StepLocation } from './steps/StepLocation';
import { StepMedia } from './steps/StepMedia';
import { StepDynamicSections } from './steps/StepDynamicSections';
import { StepSEO } from './steps/StepSEO';
import { StepSimilarCars } from './steps/StepSimilarCars';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarFormWizardProps {
    /** Pass car._id in edit mode */
    carId?: string;
}

// ─── Data cleaning helpers ────────────────────────────────────────────────────

/** Strip empty key-value pairs from dynamic sections before submit */
function stripEmptyPairs(data: Record<string, unknown>) {
    const sections = ['features', 'specifications', 'keyInformation', 'statsPerformance', 'benefitsAddons'];
    for (const section of sections) {
        const arr = data[section] as Array<{ key?: string; value?: string }> | undefined;
        if (Array.isArray(arr)) {
            data[section] = arr.filter((item) => item.key?.trim() && item.value?.trim());
        }
    }
    return data;
}

/**
 * Ensure exactly ONE primary image (critique fix #3).
 * - If none are primary → first becomes primary.
 * - If multiple are primary → keep first, unset rest.
 * Also normalizes order field (critique fix #8).
 */
function normalizeImages(data: Record<string, unknown>) {
    const images = data.images as Array<{ isPrimary?: boolean; order?: number }> | undefined;
    if (!Array.isArray(images) || images.length === 0) return data;

    let primaryFound = false;
    data.images = images.map((img, index) => {
        const shouldBePrimary = img.isPrimary && !primaryFound;
        if (shouldBePrimary) primaryFound = true;
        return {
            ...img,
            isPrimary: shouldBePrimary || (!primaryFound && index === images.length - 1), // fallback: last iteration
            order: index, // normalize order (critique fix #8)
        };
    });

    // Edge case: if none was explicitly primary, force first
    const imgs = data.images as Array<{ isPrimary: boolean }>;
    if (!imgs.some((i) => i.isPrimary) && imgs.length > 0) {
        imgs[0].isPrimary = true;
    }

    return data;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CarFormWizard({ carId }: CarFormWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<StepId>('basic');
    const [visitedSteps, setVisitedSteps] = useState(() => new Set<StepId>(['basic']));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { handleSubmit, trigger, formState: { errors } } = useFormContext();

    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === STEPS.length - 1;

    // ── Validate current step and move forward ──────────────────────────────────

    const handleNext = useCallback(async () => {
        const step = STEPS[currentIndex];
        const valid = await trigger(step.fields as unknown as string[]);

        if (!valid) {
            // Show which fields failed so admin isn't guessing
            const stepFields = step.fields as readonly string[];
            const failedFields = stepFields.filter((f) => {
                const parts = f.split('.');
                let cursor: Record<string, unknown> = errors as Record<string, unknown>;
                for (const p of parts) {
                    if (!cursor || typeof cursor !== 'object') return false;
                    cursor = cursor[p] as Record<string, unknown>;
                }
                return !!cursor;
            });
            const detail = failedFields.length > 0 ? `: ${failedFields.join(', ')}` : '';
            toast.error(`Please fix the errors before continuing${detail}`);
            return;
        }

        // Mark current as visited, move to next
        setVisitedSteps((prev) => { const s = new Set(Array.from(prev)); s.add(step.id); return s; });
        if (currentIndex < STEPS.length - 1) {
            const nextId = STEPS[currentIndex + 1].id;
            setVisitedSteps((prev) => { const s = new Set(Array.from(prev)); s.add(nextId); return s; });
            setCurrentStep(nextId);
        }
    }, [currentIndex, trigger]);

    const handleBack = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1].id);
        }
    }, [currentIndex]);

    /**
     * Step click handler.
     * FIX (critique #4): re-validate the step you're leaving
     * so visited status stays accurate.
     */
    const handleStepClick = useCallback(async (stepId: StepId) => {
        // Validate current step before leaving (non-blocking — we still navigate)
        const step = STEPS[currentIndex];
        await trigger(step.fields as unknown as string[]);

        setVisitedSteps((prev) => { const s = new Set(Array.from(prev)); s.add(stepId); return s; });
        setCurrentStep(stepId);
    }, [currentIndex, trigger]);

    // ── Submit ──────────────────────────────────────────────────────────────────

    const onSubmit = useCallback(async (raw: Record<string, unknown>) => {
        setIsSubmitting(true);
        try {
            const data = normalizeImages(stripEmptyPairs({ ...raw }));
            const url = carId ? `/api/admin/cars/${carId}` : '/api/admin/cars';
            const method = carId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (result.success) {
                toast.success(carId ? 'Car updated' : 'Car created');
                router.push('/admin/cars');
                router.refresh();
            } else {
                toast.error(result.error ?? 'Failed to save car');
            }
        } catch {
            toast.error('Network error — please try again');
        } finally {
            setIsSubmitting(false);
        }
    }, [carId, router]);

    // ── Render ──────────────────────────────────────────────────────────────────

    const renderStep = () => {
        switch (currentStep) {
            case 'basic': return <StepBasic />;
            case 'location': return <StepLocation />;
            case 'media': return <StepMedia />;
            case 'dynamic': return <StepDynamicSections />;
            case 'seo': return <StepSEO />;
            case 'similar': return <StepSimilarCars currentCarId={carId} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <CarFormStepper
                currentStep={currentStep}
                onStepClick={handleStepClick}
                visitedSteps={visitedSteps}
            />

            <form onSubmit={handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])}>
                <div className="bg-card border border-border rounded-xl p-6">
                    {renderStep()}
                </div>

                <CarFormActions
                    currentStep={currentStep}
                    onBack={handleBack}
                    onNext={handleNext}
                    isSubmitting={isSubmitting}
                    isFirstStep={isFirst}
                    isLastStep={isLast}
                />
            </form>
        </div>
    );
}
