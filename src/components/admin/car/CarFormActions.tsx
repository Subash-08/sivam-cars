'use client';

import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { StepId } from './CarFormStepper';

interface CarFormActionsProps {
    currentStep: StepId;
    onBack: () => void;
    onNext: () => void;
    isSubmitting: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
}

export function CarFormActions({
    onBack,
    onNext,
    isSubmitting,
    isFirstStep,
    isLastStep,
}: CarFormActionsProps) {
    return (
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
            {/* Back */}
            <div>
                {!isFirstStep && (
                    <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                        <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                        Back
                    </Button>
                )}
            </div>

            {/* Next / Submit */}
            <div>
                {isLastStep ? (
                    <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                        {isSubmitting ? 'Saving…' : 'Save Car'}
                    </Button>
                ) : (
                    <Button type="button" onClick={onNext} disabled={isSubmitting}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                )}
            </div>
        </div>
    );
}
