'use client';

import { Check, AlertCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

// ─── Step configuration ───────────────────────────────────────────────────────

export const STEPS = [
    {
        id: 'basic',
        label: 'Basic Info',
        fields: ['name', 'brand', 'price', 'year', 'kmsDriven', 'fuelType', 'transmission', 'bodyType', 'color'],
    },
    {
        id: 'location',
        label: 'Location',
        fields: ['location.city', 'location.state', 'registration', 'numberOfOwners', 'insuranceDetails'],
    },
    {
        id: 'media',
        label: 'Media',
        fields: ['images', 'sliderVideos', 'reelVideos', 'brochureUrl'],
    },
    {
        id: 'dynamic',
        label: 'Features & Specs',
        fields: ['features', 'specifications', 'keyInformation', 'statsPerformance', 'benefitsAddons'],
    },
    {
        id: 'seo',
        label: 'SEO & Flags',
        // FIX (critique #6): include isSold alongside isFeatured
        fields: ['metaTitle', 'metaDesc', 'canonicalUrl', 'isFeatured', 'isSold'],
    },
    {
        id: 'similar',
        label: 'Similar Cars',
        fields: ['similarCars'],
    },
] as const;

export type StepId = (typeof STEPS)[number]['id'];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CarFormStepperProps {
    currentStep: StepId;
    onStepClick: (stepId: StepId) => void;
    visitedSteps: Set<StepId>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CarFormStepper({ currentStep, onStepClick, visitedSteps }: CarFormStepperProps) {
    const { formState: { errors } } = useFormContext();

    /** Check if any field in this step has a validation error */
    const hasStepErrors = (fields: readonly string[]) => {
        return fields.some((field) => {
            const parts = field.split('.');
            let cursor: Record<string, unknown> = errors as Record<string, unknown>;
            for (const part of parts) {
                if (!cursor || typeof cursor !== 'object') return false;
                cursor = cursor[part] as Record<string, unknown>;
            }
            return !!cursor;
        });
    };

    /** Step is reachable if it's the first step, or the previous step has been visited */
    const isReachable = (index: number) =>
        index === 0 || visitedSteps.has(STEPS[index - 1].id);

    return (
        <nav aria-label="Form progress" className="mb-8">
            <ol className="flex items-center gap-0">
                {STEPS.map((step, index) => {
                    const isCurrent = currentStep === step.id;
                    const isVisited = visitedSteps.has(step.id);
                    const reachable = isReachable(index);
                    const hasErrors = hasStepErrors(step.fields);

                    return (
                        <li key={step.id} className="flex-1 relative">
                            {/* Connector line */}
                            {index > 0 && (
                                <div className="absolute left-0 right-1/2 top-4 h-0.5 -translate-x-1/2">
                                    <div className={`h-full transition-colors ${isVisited ? 'bg-primary' : 'bg-border'}`} />
                                </div>
                            )}
                            {index < STEPS.length - 1 && (
                                <div className="absolute left-1/2 right-0 top-4 h-0.5 translate-x-1/2">
                                    <div className={`h-full transition-colors ${visitedSteps.has(STEPS[index + 1]?.id) ? 'bg-primary' : 'bg-border'
                                        }`} />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => reachable && onStepClick(step.id)}
                                disabled={!reachable}
                                className={`
                  relative flex flex-col items-center w-full group
                  ${!reachable ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
                `}
                            >
                                {/* Circle */}
                                <span className={`
                  z-10 w-8 h-8 flex items-center justify-center rounded-full border-2
                  text-xs font-semibold transition-all duration-200
                  ${isCurrent
                                        ? hasErrors
                                            ? 'border-destructive text-destructive bg-destructive/10'
                                            : 'border-primary text-primary bg-primary/10'
                                        : isVisited
                                            ? hasErrors
                                                ? 'border-destructive bg-destructive text-primary-foreground'
                                                : 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-muted-foreground bg-card'}
                `}>
                                    {isVisited && !isCurrent ? (
                                        hasErrors
                                            ? <AlertCircle className="w-4 h-4" />
                                            : <Check className="w-4 h-4" />
                                    ) : (
                                        index + 1
                                    )}
                                </span>

                                {/* Label */}
                                <span className={`
                  mt-2 text-[11px] font-medium leading-tight text-center
                  ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                `}>
                                    {step.label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
