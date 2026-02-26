'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadInput } from '@/validations/lead.schema';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface LeadFormProps {
    carId: string;
    carName: string;
}

export function LeadForm({ carId, carName }: LeadFormProps) {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LeadInput>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            name: '',
            phone: '',
            message: '',
            carId,
        },
    });

    const onSubmit = async (data: LeadInput) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error ?? 'Something went wrong');
                return;
            }

            toast.success('Enquiry submitted! We\'ll contact you shortly.');
            setSubmitted(true);
            reset();
        } catch {
            toast.error('Network error. Please try again.');
        }
    };

    if (submitted) {
        return (
            <div className="bg-card rounded-xl border border-border p-5 text-center">
                <span className="text-3xl">✅</span>
                <p className="text-sm font-medium text-foreground mt-2">Thank you!</p>
                <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll call you about the {carName}
                </p>
                <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs text-primary hover:underline"
                >
                    Send another enquiry
                </button>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Interested in this car?</h3>
            <p className="text-xs text-muted-foreground mb-4">Fill the form below and we&apos;ll get back to you</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input type="hidden" {...register('carId')} />

                <Input
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    placeholder="Phone number"
                    type="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                />

                <Textarea
                    placeholder="Message (optional)"
                    rows={2}
                    error={errors.message?.message}
                    {...register('message')}
                />

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full"
                >
                    Send Enquiry
                </Button>
            </form>
        </div>
    );
}
