'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
    Plus, Edit, Trash2, X, ArrowUp, ArrowDown, Eye, EyeOff,
    GripVertical, Upload, ImageIcon,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomerStory {
    _id: string;
    customerName: string;
    location: string;
    testimonial: string;
    imageUrl: string;
    imagePublicId: string;
    order: number;
    isActive: boolean;
    createdAt: string;
}

const EMPTY_FORM = {
    customerName: '',
    location: '',
    testimonial: '',
    imageUrl: '',
    imagePublicId: '',
    order: 0,
    isActive: true,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCustomerStoriesPage() {
    // List
    const [stories, setStories] = useState<CustomerStory[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // Image upload
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Delete
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // ── Fetch stories ────────────────────────────────────────────────────────────

    const fetchStories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/customer-stories');
            const data = await res.json();
            if (data.success) {
                setStories(data.stories ?? []);
            } else {
                toast.error(data.error ?? 'Failed to fetch stories');
            }
        } catch {
            toast.error('Network error — could not load stories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void fetchStories(); }, [fetchStories]);

    // ── Form handlers ────────────────────────────────────────────────────────────

    const openCreateForm = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    };

    const openEditForm = (story: CustomerStory) => {
        setEditingId(story._id);
        setForm({
            customerName: story.customerName,
            location: story.location,
            testimonial: story.testimonial ?? '',
            imageUrl: story.imageUrl,
            imagePublicId: story.imagePublicId,
            order: story.order,
            isActive: story.isActive,
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const handleSubmit = async () => {
        if (!form.customerName.trim()) {
            toast.error('Customer name is required');
            return;
        }
        if (!form.imageUrl) {
            toast.error('Please upload an image');
            return;
        }

        setSaving(true);
        try {
            const url = editingId
                ? `/api/admin/customer-stories/${editingId}`
                : '/api/admin/customer-stories';

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Story updated' : 'Story created');
                closeForm();
                void fetchStories();
            } else {
                toast.error(data.error ?? 'Failed to save story');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setSaving(false);
        }
    };

    // ── Image upload ─────────────────────────────────────────────────────────────

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        if (file.size > 3 * 1024 * 1024) {
            toast.error('Image must be under 3 MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'customer-stories');

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setForm((f) => ({
                    ...f,
                    imageUrl: data.url,
                    imagePublicId: data.publicId,
                }));
                toast.success('Image uploaded');
            } else {
                toast.error(data.error ?? 'Upload failed');
            }
        } catch {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/customer-stories/${deleteId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Story deleted');
                setDeleteId(null);
                void fetchStories();
            } else {
                toast.error(data.error ?? 'Delete failed');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setDeleting(false);
        }
    };

    // ── Reorder ──────────────────────────────────────────────────────────────────

    const moveStory = async (index: number, direction: 'up' | 'down') => {
        const newStories = [...stories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newStories.length) return;

        [newStories[index], newStories[targetIndex]] = [newStories[targetIndex], newStories[index]];
        setStories(newStories);

        try {
            const res = await fetch('/api/admin/customer-stories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds: newStories.map((s) => s._id) }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Order updated');
            } else {
                toast.error('Failed to reorder');
                void fetchStories();
            }
        } catch {
            toast.error('Network error');
            void fetchStories();
        }
    };

    // ── Toggle active ────────────────────────────────────────────────────────────

    const toggleActive = async (story: CustomerStory) => {
        try {
            const res = await fetch(`/api/admin/customer-stories/${story._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !story.isActive }),
            });
            const data = await res.json();
            if (data.success) {
                setStories((prev) =>
                    prev.map((s) =>
                        s._id === story._id ? { ...s, isActive: !s.isActive } : s
                    )
                );
                toast.success(story.isActive ? 'Story hidden' : 'Story visible');
            }
        } catch {
            toast.error('Network error');
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────────

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* ══ Header ══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Customer Stories</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage customer delivery stories displayed on the homepage
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add Story
                </Button>
            </div>

            {/* Image specs info */}
            <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Recommended image specs:</strong>{' '}
                1080 × 1350 px &middot; 4:5 aspect ratio &middot; JPG or WebP &middot; Max 3 MB
            </div>

            {/* ══ Stories List ═════════════════════════════════════════════════════ */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">
                        Loading…
                    </div>
                ) : stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-56 text-muted-foreground gap-2">
                        <p className="text-sm">No stories created yet.</p>
                        <Button variant="outline" size="sm" onClick={openCreateForm}>
                            Create your first story
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {stories.map((story, index) => (
                            <div
                                key={story._id}
                                className={`flex items-center gap-4 p-4 transition-colors ${!story.isActive ? 'opacity-50' : ''
                                    }`}
                            >
                                {/* Reorder */}
                                <div className="flex flex-col gap-0.5 shrink-0">
                                    <button
                                        onClick={() => moveStory(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"
                                        aria-label="Move up"
                                    >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => moveStory(index, 'down')}
                                        disabled={index === stories.length - 1}
                                        className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"
                                        aria-label="Move down"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 hidden sm:block" />

                                {/* Thumbnail */}
                                <div className="relative w-14 h-[70px] rounded-lg overflow-hidden bg-muted shrink-0">
                                    <Image
                                        src={story.imageUrl}
                                        alt={story.customerName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-sm truncate">
                                        {story.customerName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                            {story.location}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Order: {story.order}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => toggleActive(story)}
                                        className={`p-1.5 rounded-lg transition-all ${story.isActive
                                            ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                                            : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                        title={story.isActive ? 'Hide story' : 'Show story'}
                                        aria-label={`Toggle visibility for ${story.customerName}`}
                                    >
                                        {story.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditForm(story)}
                                        aria-label={`Edit ${story.customerName}`}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteId(story._id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        aria-label={`Delete ${story.customerName}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ══ Create/Edit Form Modal ══════════════════════════════════════════ */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
                            <h2 className="text-lg font-bold text-foreground">
                                {editingId ? 'Edit Story' : 'Create Story'}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="p-6 space-y-5">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                    Customer Image *
                                </label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Recommended: 1080 × 1350 px (4:5) &middot; JPG / WebP &middot; Max 3 MB
                                </p>

                                {form.imageUrl ? (
                                    <div className="relative group w-full aspect-[4/5] max-w-[200px] rounded-xl overflow-hidden bg-muted border border-border">
                                        <Image
                                            src={form.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={() => setForm((f) => ({ ...f, imageUrl: '', imagePublicId: '' }))}
                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-full max-w-[200px] aspect-[4/5] rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {uploading ? (
                                            <span className="text-sm animate-pulse">Uploading…</span>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-xs font-medium">Click to upload</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />

                                {form.imageUrl && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        <Upload className="w-3.5 h-3.5 mr-1" />
                                        {uploading ? 'Uploading…' : 'Replace Image'}
                                    </Button>
                                )}
                            </div>

                            {/* Customer Name */}
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                    Customer Name *
                                </label>
                                <Input
                                    value={form.customerName}
                                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                                    placeholder="e.g. Ramesh Kumar"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                    Location *
                                </label>
                                <Input
                                    value={form.location}
                                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                                    placeholder="e.g. Salem"
                                />
                            </div>

                            {/* Testimonial */}
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                    Testimonial ({form.testimonial.length}/200)
                                </label>
                                <Textarea
                                    value={form.testimonial}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm((f) => ({ ...f, testimonial: e.target.value.slice(0, 200) }))}
                                    placeholder="Short quote from the customer..."
                                    rows={3}
                                />
                            </div>

                            {/* Order + Active */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                        Order
                                    </label>
                                    <Input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                                        min={0}
                                    />
                                </div>
                                <div className="flex items-end gap-3 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-primary' : 'bg-muted'
                                            }`}
                                        role="switch"
                                        aria-checked={form.isActive}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className="text-sm text-foreground font-medium">
                                        {form.isActive ? 'Active' : 'Hidden'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-border sticky bottom-0 bg-card rounded-b-2xl">
                            <Button variant="outline" onClick={closeForm} disabled={saving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} isLoading={saving} disabled={saving || uploading}>
                                {editingId ? 'Update Story' : 'Create Story'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Delete confirm ══════════════════════════════════════════════════ */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Story"
                message="This will permanently delete this story and its image. Continue?"
                confirmLabel="Delete Story"
                loading={deleting}
            />
        </div>
    );
}
