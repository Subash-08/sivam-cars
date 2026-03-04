'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
    Plus, Edit, Trash2, Search, GripVertical,
    ArrowUp, ArrowDown, X, Check, Eye, EyeOff,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarImage { url: string; isPrimary?: boolean; }
interface CarBrand { _id: string; name: string; slug: string; logo?: string; }

interface CarOption {
    _id: string;
    name: string;
    slug: string;
    price: number;
    year: number;
    images: CarImage[];
    brand: CarBrand;
    isActive: boolean;
}

interface HomeSection {
    _id: string;
    title: string;
    subtitle?: string;
    layoutType: 'grid' | 'carousel' | 'horizontal-scroll';
    order: number;
    viewAllText?: string;
    viewAllLink?: string;
    isActive: boolean;
    cars: CarOption[];
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LAYOUT_OPTIONS = [
    { value: 'grid', label: 'Grid' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'horizontal-scroll', label: 'Horizontal Scroll' },
] as const;

const EMPTY_FORM = {
    title: '',
    subtitle: '',
    layoutType: 'grid' as 'grid' | 'carousel' | 'horizontal-scroll',
    order: 0,
    viewAllText: '',
    viewAllLink: '',
    isActive: true,
    cars: [] as string[],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminHomeSectionsPage() {
    // Section list
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // Selected cars for form (full objects for display)
    const [selectedCars, setSelectedCars] = useState<CarOption[]>([]);

    // Car picker
    const [showCarPicker, setShowCarPicker] = useState(false);
    const [carSearch, setCarSearch] = useState('');
    const [carPage, setCarPage] = useState(1);
    const [availableCars, setAvailableCars] = useState<CarOption[]>([]);
    const [carPagination, setCarPagination] = useState<Pagination | null>(null);
    const [carsLoading, setCarsLoading] = useState(false);
    const debouncedCarSearch = useDebounce(carSearch, 400);

    // Delete
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const selectClass =
        'rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ' +
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors';

    // ── Fetch sections ──────────────────────────────────────────────────────────

    const fetchSections = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/home-sections');
            const data = await res.json();
            if (data.success) {
                setSections(data.sections ?? []);
            } else {
                toast.error(data.error ?? 'Failed to fetch sections');
            }
        } catch {
            toast.error('Network error — could not load sections');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void fetchSections(); }, [fetchSections]);

    // ── Fetch cars for picker ───────────────────────────────────────────────────

    const fetchCars = useCallback(async () => {
        setCarsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(carPage), limit: '10' });
            if (debouncedCarSearch) params.set('search', debouncedCarSearch);

            const res = await fetch(`/api/admin/cars?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setAvailableCars(data.cars ?? []);
                setCarPagination(data.pagination ?? null);
            }
        } catch {
            toast.error('Failed to load cars');
        } finally {
            setCarsLoading(false);
        }
    }, [carPage, debouncedCarSearch]);

    useEffect(() => {
        if (showCarPicker) void fetchCars();
    }, [fetchCars, showCarPicker]);

    useEffect(() => { setCarPage(1); }, [debouncedCarSearch]);

    // ── Form handlers ───────────────────────────────────────────────────────────

    const openCreateForm = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setSelectedCars([]);
        setShowForm(true);
    };

    const openEditForm = (section: HomeSection) => {
        setEditingId(section._id);
        setForm({
            title: section.title,
            subtitle: section.subtitle ?? '',
            layoutType: section.layoutType,
            order: section.order,
            viewAllText: section.viewAllText ?? '',
            viewAllLink: section.viewAllLink ?? '',
            isActive: section.isActive,
            cars: section.cars.map((c) => c._id),
        });
        setSelectedCars(section.cars);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setSelectedCars([]);
        setShowCarPicker(false);
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            toast.error('Title is required');
            return;
        }

        setSaving(true);
        try {
            const url = editingId
                ? `/api/admin/home-sections/${editingId}`
                : '/api/admin/home-sections';

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Section updated' : 'Section created');
                closeForm();
                void fetchSections();
            } else {
                toast.error(data.error ?? 'Failed to save section');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setSaving(false);
        }
    };

    // ── Car selection ───────────────────────────────────────────────────────────

    const addCar = (car: CarOption) => {
        if (form.cars.includes(car._id)) return;
        setForm((prev) => ({ ...prev, cars: [...prev.cars, car._id] }));
        setSelectedCars((prev) => [...prev, car]);
    };

    const removeCar = (carId: string) => {
        setForm((prev) => ({ ...prev, cars: prev.cars.filter((id) => id !== carId) }));
        setSelectedCars((prev) => prev.filter((c) => c._id !== carId));
    };

    // ── Delete ──────────────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/home-sections/${deleteId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Section deleted');
                setDeleteId(null);
                void fetchSections();
            } else {
                toast.error(data.error ?? 'Delete failed');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setDeleting(false);
        }
    };

    // ── Reorder ─────────────────────────────────────────────────────────────────

    const moveSection = async (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setSections(newSections);

        try {
            const res = await fetch('/api/admin/home-sections', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds: newSections.map((s) => s._id) }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Order updated');
            } else {
                toast.error('Failed to reorder');
                void fetchSections();
            }
        } catch {
            toast.error('Network error');
            void fetchSections();
        }
    };

    // ── Toggle active ───────────────────────────────────────────────────────────

    const toggleActive = async (section: HomeSection) => {
        try {
            const res = await fetch(`/api/admin/home-sections/${section._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !section.isActive }),
            });
            const data = await res.json();
            if (data.success) {
                setSections((prev) =>
                    prev.map((s) =>
                        s._id === section._id ? { ...s, isActive: !s.isActive } : s
                    )
                );
                toast.success(section.isActive ? 'Section hidden' : 'Section visible');
            }
        } catch {
            toast.error('Network error');
        }
    };

    // ── Helpers ─────────────────────────────────────────────────────────────────

    const getPrimaryImage = (images: CarImage[]): CarImage | undefined =>
        images.find((i) => i.isPrimary) ?? images[0];

    const layoutLabel = (type: string) =>
        LAYOUT_OPTIONS.find((o) => o.value === type)?.label ?? type;

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* ══ Header ══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Homepage Sections</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Manage showcase sections displayed on the homepage
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add Section
                </Button>
            </div>

            {/* ══ Section List ═════════════════════════════════════════════════════ */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">
                        Loading…
                    </div>
                ) : sections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-56 text-muted-foreground gap-2">
                        <p className="text-sm">No sections created yet.</p>
                        <Button variant="outline" size="sm" onClick={openCreateForm}>
                            Create your first section
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {sections.map((section, index) => (
                            <div
                                key={section._id}
                                className={`flex items-center gap-4 p-4 transition-colors ${!section.isActive ? 'opacity-50' : ''
                                    }`}
                            >
                                {/* Reorder */}
                                <div className="flex flex-col gap-0.5 shrink-0">
                                    <button
                                        onClick={() => moveSection(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"
                                        aria-label="Move up"
                                    >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => moveSection(index, 'down')}
                                        disabled={index === sections.length - 1}
                                        className="p-1 rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"
                                        aria-label="Move down"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 hidden sm:block" />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-sm truncate">
                                        {section.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                            {layoutLabel(section.layoutType)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {section.cars.length} car{section.cars.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Order: {section.order}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => toggleActive(section)}
                                        className={`p-1.5 rounded-lg transition-all ${section.isActive
                                            ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                                            : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                        title={section.isActive ? 'Hide section' : 'Show section'}
                                        aria-label={`Toggle visibility for ${section.title}`}
                                    >
                                        {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditForm(section)}
                                        aria-label={`Edit ${section.title}`}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteId(section._id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        aria-label={`Delete ${section.title}`}
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
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
                            <h2 className="text-lg font-bold text-foreground">
                                {editingId ? 'Edit Section' : 'Create Section'}
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
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                    Title *
                                </label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Recently Added Inventory"
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                    Subtitle
                                </label>
                                <Input
                                    value={form.subtitle}
                                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                                    placeholder="e.g. Fresh arrivals ready for a test drive"
                                />
                            </div>

                            {/* Layout + Order */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                        Layout Type *
                                    </label>
                                    <select
                                        value={form.layoutType}
                                        onChange={(e) => setForm((f) => ({ ...f, layoutType: e.target.value as typeof form.layoutType }))}
                                        className={selectClass + ' w-full'}
                                    >
                                        {LAYOUT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
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
                            </div>

                            {/* View All */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                        View All Button Text
                                    </label>
                                    <Input
                                        value={form.viewAllText}
                                        onChange={(e) => setForm((f) => ({ ...f, viewAllText: e.target.value }))}
                                        placeholder="e.g. View All Inventory"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                                        View All Button Link
                                    </label>
                                    <Input
                                        value={form.viewAllLink}
                                        onChange={(e) => setForm((f) => ({ ...f, viewAllLink: e.target.value }))}
                                        placeholder="e.g. /used-cars?page=1"
                                    />
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
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

                            {/* ── Selected Cars ───────────────────────────────────────── */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Cars ({selectedCars.length})
                                    </label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowCarPicker(!showCarPicker)}
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Add Cars
                                    </Button>
                                </div>

                                {selectedCars.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedCars.map((car) => {
                                            const thumb = getPrimaryImage(car.images);
                                            return (
                                                <div
                                                    key={car._id}
                                                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg border border-border"
                                                >
                                                    <div className="relative w-12 h-9 rounded bg-muted overflow-hidden shrink-0">
                                                        {thumb?.url ? (
                                                            <Image src={thumb.url} alt={car.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                                                No img
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">
                                                            {car.brand?.name} {car.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {car.year} · ₹{car.price?.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeCar(car._id)}
                                                        className="p-1 rounded hover:bg-destructive/10 text-destructive shrink-0"
                                                        aria-label={`Remove ${car.name}`}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground py-3 text-center bg-muted/30 rounded-lg">
                                        No cars selected. Click &quot;Add Cars&quot; to browse.
                                    </p>
                                )}
                            </div>

                            {/* ── Car Picker ──────────────────────────────────────────── */}
                            {showCarPicker && (
                                <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground">Browse Cars</h3>
                                        <button
                                            onClick={() => setShowCarPicker(false)}
                                            className="p-1 rounded hover:bg-muted text-muted-foreground"
                                            aria-label="Close picker"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            placeholder="Search cars…"
                                            value={carSearch}
                                            onChange={(e) => setCarSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    {/* Car list */}
                                    {carsLoading ? (
                                        <div className="text-center py-4 text-sm text-muted-foreground">Loading…</div>
                                    ) : availableCars.length === 0 ? (
                                        <div className="text-center py-4 text-sm text-muted-foreground">No cars found.</div>
                                    ) : (
                                        <div className="space-y-1.5 max-h-60 overflow-y-auto">
                                            {availableCars.map((car) => {
                                                const isSelected = form.cars.includes(car._id);
                                                const thumb = getPrimaryImage(car.images);
                                                return (
                                                    <button
                                                        key={car._id}
                                                        onClick={() => isSelected ? removeCar(car._id) : addCar(car)}
                                                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${isSelected
                                                            ? 'bg-primary/10 border border-primary/30'
                                                            : 'hover:bg-muted border border-transparent'
                                                            }`}
                                                    >
                                                        <div className="relative w-10 h-7 rounded bg-muted overflow-hidden shrink-0">
                                                            {thumb?.url ? (
                                                                <Image src={thumb.url} alt={car.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">
                                                                    —
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-foreground truncate">
                                                                {car.brand?.name} {car.name}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                {car.year} · ₹{car.price?.toLocaleString('en-IN')}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {carPagination && carPagination.totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-3 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCarPage((p) => Math.max(1, p - 1))}
                                                disabled={carPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-xs text-muted-foreground">
                                                {carPagination.page} / {carPagination.totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCarPage((p) => Math.min(carPagination.totalPages, p + 1))}
                                                disabled={!carPagination.hasNextPage}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-border sticky bottom-0 bg-card rounded-b-2xl">
                            <Button variant="outline" onClick={closeForm} disabled={saving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} isLoading={saving} disabled={saving}>
                                {editingId ? 'Update Section' : 'Create Section'}
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
                title="Delete Section"
                message="This will permanently delete this section. Continue?"
                confirmLabel="Delete Section"
                loading={deleting}
            />
        </div>
    );
}
