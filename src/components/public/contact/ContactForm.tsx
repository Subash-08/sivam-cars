'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    contactLeadSchema,
    type ContactLeadInput,
} from '@/validations/contactLead.schema';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm(): React.JSX.Element {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactLeadInput>({
        resolver: zodResolver(contactLeadSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            message: '',
        },
    });

    const onSubmit = async (data: ContactLeadInput): Promise<void> => {
        try {
            const res = await fetch('/api/leads/contact', {
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

            toast.success('Message sent! We\'ll get back to you shortly.');
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
                    Your message has been received. Our team will contact you
                    shortly.
                </p>
                <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground">
                Send Us a Message
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you as soon as
                possible.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
                noValidate
            >
                <div>
                    <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="contact-name"
                        placeholder="Your full name"
                        error={errors.name?.message}
                        {...register('name')}
                    />
                </div>

                <div>
                    <label
                        htmlFor="contact-phone"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Phone Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="contact-phone"
                        placeholder="Your phone number"
                        type="tel"
                        error={errors.phone?.message}
                        {...register('phone')}
                    />
                </div>

                <div>
                    <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Email
                    </label>
                    <Input
                        id="contact-email"
                        placeholder="your@email.com (optional)"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                </div>

                <div>
                    <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                        id="contact-message"
                        placeholder="How can we help you?"
                        rows={4}
                        error={errors.message?.message}
                        {...register('message')}
                    />
                </div>

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full"
                    disabled={isSubmitting}
                >
                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                    Send Message
                </Button>
            </form>
        </div>
    );
}
