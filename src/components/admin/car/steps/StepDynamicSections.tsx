'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// ─── Reusable section component ───────────────────────────────────────────────

interface DynamicSectionProps {
    name: 'features' | 'specifications' | 'keyInformation' | 'statsPerformance' | 'benefitsAddons';
    title: string;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
}

function DynamicSection({
    name,
    title,
    keyPlaceholder = 'Key',
    valuePlaceholder = 'Value',
}: DynamicSectionProps) {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ key: '', value: '' })}
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    Add
                </Button>
            </div>

            {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-2">
                    No items yet — click &ldquo;Add&rdquo; to start.
                </p>
            ) : (
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                            <Input
                                {...register(`${name}.${index}.key`)}
                                placeholder={keyPlaceholder}
                                className="flex-1"
                            />
                            <Input
                                {...register(`${name}.${index}.value`)}
                                placeholder={valuePlaceholder}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                aria-label={`Remove ${title} item ${index + 1}`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Step Component ───────────────────────────────────────────────────────────

export function StepDynamicSections() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground">Features & Specifications</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Add key-value pairs. Empty rows are automatically stripped before saving.
                </p>
            </div>

            <DynamicSection name="features" title="Features" keyPlaceholder="e.g. Sunroof" valuePlaceholder="e.g. Yes" />
            <DynamicSection name="specifications" title="Specifications" keyPlaceholder="e.g. Engine" valuePlaceholder="e.g. 1998 cc" />
            <DynamicSection name="keyInformation" title="Key Information" keyPlaceholder="e.g. Engine Power" valuePlaceholder="e.g. 140 bhp" />
            <DynamicSection name="statsPerformance" title="Stats & Performance" keyPlaceholder="e.g. 0-100 km/h" valuePlaceholder="e.g. 10 sec" />
            <DynamicSection name="benefitsAddons" title="Benefits & Add-ons" keyPlaceholder="Benefit" valuePlaceholder="Description" />
        </div>
    );
}
