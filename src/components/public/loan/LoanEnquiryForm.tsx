'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    loanLeadSchema,
    type LoanLeadInput,
} from '@/validations/loanLead.schema';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Send, CheckCircle } from 'lucide-react';

export default function LoanEnquiryForm(): React.JSX.Element {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoanLeadInput>({
        resolver: zodResolver(loanLeadSchema),
        defaultValues: {
            name: '',
            phone: '',
            city: '',
            monthlyIncome: '',
            carBudget: '',
            loanAmount: '',
        },
    });

    const onSubmit = async (data: LoanLeadInput): Promise<void> => {
        try {
            const res = await fetch('/api/leads/loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result: { success: boolean; error?: string } =
                await res.json();

            if (!res.ok) {
                toast.error(result.error ?? 'Something went wrong');
                return;
            }

            toast.success('Loan enquiry submitted! We\'ll contact you shortly.');
            setSubmitted(true);
            reset();
        } catch {
            toast.error('Network error. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
                <CheckCircle
                    className="mx-auto h-12 w-12 text-success"
                    aria-hidden="true"
                />
                <p className="mt-4 text-lg font-semibold text-foreground">
                    Thank You!
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your loan enquiry has been received. Our financing team will
                    contact you within 24 hours.
                </p>
                <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                >
                    Submit another enquiry
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground">
                Apply for a Car Loan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Fill in your details and our team will connect you with the best
                financing option.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
                noValidate
            >
                {/* Row 1 — Name & Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="loan-name"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Full Name{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="loan-name"
                            placeholder="Your full name"
                            error={errors.name?.message}
                            {...register('name')}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="loan-phone"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Phone Number{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="loan-phone"
                            placeholder="Your phone number"
                            type="tel"
                            error={errors.phone?.message}
                            {...register('phone')}
                        />
                    </div>
                </div>

                {/* Row 2 — City & Monthly Income */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="loan-city"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            City{' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="loan-city"
                            placeholder="Your city"
                            error={errors.city?.message}
                            {...register('city')}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="loan-income"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Monthly Income (₹){' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="loan-income"
                            placeholder="e.g. 50000"
                            error={errors.monthlyIncome?.message}
                            {...register('monthlyIncome')}
                        />
                    </div>
                </div>

                {/* Row 3 — Car Budget & Loan Amount */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="loan-budget"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Car Budget (₹){' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="loan-budget"
                            placeholder="e.g. 500000"
                            error={errors.carBudget?.message}
                            {...register('carBudget')}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="loan-amount"
                            className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                            Loan Amount (₹){' '}
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="loan-amount"
                            placeholder="e.g. 400000"
                            error={errors.loanAmount?.message}
                            {...register('loanAmount')}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                >
                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                    Apply for Loan
                </Button>
            </form>
        </div>
    );
}
