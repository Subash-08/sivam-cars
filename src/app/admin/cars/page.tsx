'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Plus, Edit, Trash2, Search, Star, StarOff,
    ShoppingCart, Eye, Filter, X, ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CarImage { url: string; isPrimary?: boolean; }
interface CarBrand { _id: string; name: string; slug: string; logo?: string; }

interface Car {
    _id: string;
    name: string;
    slug: string;
    brand: CarBrand;
    price: number;
    year: number;
    kmsDriven: number;
    fuelType: string;
    transmission: string;
    bodyType: string;
    images: CarImage[];
    isFeatured: boolean;
    isSold: boolean;
    isActive: boolean;
    viewsCount: number;
    createdAt: string;
}

interface BrandOption { _id: string; name: string; }
interface Pagination { total: number; page: number; totalPages: number; hasNextPage: boolean; }

// ─── Filter bar ───────────────────────────────────────────────────────────────

type SoldFilter = 'all' | 'true' | 'false';
type FeaturedFilter = 'all' | 'true' | 'false';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCarsPage() {
    const router = useRouter();

    // Data
    const [cars, setCars] = useState<Car[]>([]);
    const [brands, setBrands] = useState<BrandOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [brandFilter, setBrandFilter] = useState('');
    const [soldFilter, setSoldFilter] = useState<SoldFilter>('all');
    const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>('all');
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(search, 400);

    // Bulk selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Single delete
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Toggling
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // ── Active filter count (for badge) ─────────────────────────────────────────

    const activeFilterCount = [
        brandFilter,
        soldFilter !== 'all' ? soldFilter : '',
        featuredFilter !== 'all' ? featuredFilter : '',
    ].filter(Boolean).length;

    // ── Fetch brands for filter dropdown ────────────────────────────────────────

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/admin/brands?limit=100');
                const data = await res.json();
                if (data.success) setBrands(data.brands ?? []);
            } catch { /* non-critical */ }
        })();
    }, []);

    // ── Fetch cars ──────────────────────────────────────────────────────────────

    const fetchCars = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (debouncedSearch) params.set('search', debouncedSearch);
            if (brandFilter) params.set('brand', brandFilter);
            if (soldFilter !== 'all') params.set('isSold', soldFilter);
            if (featuredFilter !== 'all') params.set('isFeatured', featuredFilter);

            const res = await fetch(`/api/admin/cars?${params.toString()}`);
            const data = await res.json() as {
                success: boolean; cars?: Car[]; pagination?: Pagination; error?: string;
            };

            if (data.success) {
                setCars(data.cars ?? []);
                setPagination(data.pagination ?? null);
            } else {
                toast.error(data.error ?? 'Failed to fetch cars');
            }
        } catch {
            toast.error('Network error — could not load cars');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, brandFilter, soldFilter, featuredFilter]);

    useEffect(() => { void fetchCars(); }, [fetchCars]);
    useEffect(() => { setPage(1); }, [debouncedSearch, brandFilter, soldFilter, featuredFilter]);

    // ── Toggle featured / sold ──────────────────────────────────────────────────

    const handleToggle = async (carId: string, action: 'toggleFeatured' | 'toggleSold') => {
        setTogglingId(carId);
        try {
            const res = await fetch(`/api/admin/cars/${carId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();

            if (data.success) {
                // Optimistic in-place update
                setCars((prev) => prev.map((c) =>
                    c._id === carId
                        ? { ...c, ...(action === 'toggleFeatured' ? { isFeatured: !c.isFeatured } : { isSold: !c.isSold }) }
                        : c
                ));
                toast.success(action === 'toggleFeatured' ? 'Featured updated' : 'Sold status updated');
            } else {
                toast.error(data.error ?? 'Toggle failed');
            }
        } catch { toast.error('Network error'); }
        finally { setTogglingId(null); }
    };

    // ── Delete single ───────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/cars/${deleteId}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                toast.success('Car deleted');
                setDeleteId(null);
                setSelectedIds((prev) => { const s = new Set(prev); s.delete(deleteId); return s; });
                void fetchCars();
            } else {
                toast.error(data.error ?? 'Delete failed');
            }
        } catch { toast.error('Network error'); }
        finally { setDeleting(false); }
    };

    // ── Bulk delete ─────────────────────────────────────────────────────────────

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        setBulkDeleting(true);
        let successCount = 0;
        const ids = Array.from(selectedIds);

        for (const id of ids) {
            try {
                const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) successCount++;
            } catch { /* continue */ }
        }

        setBulkDeleting(false);
        setSelectedIds(new Set());
        toast.success(`Deleted ${successCount}/${ids.length} cars`);
        void fetchCars();
    };

    // ── Selection helpers ───────────────────────────────────────────────────────

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === cars.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(cars.map((c) => c._id)));
        }
    };

    const allSelected = cars.length > 0 && selectedIds.size === cars.length;

    // ── Clear all filters ───────────────────────────────────────────────────────

    const clearFilters = () => {
        setSearch('');
        setBrandFilter('');
        setSoldFilter('all');
        setFeaturedFilter('all');
    };

    // ── Helpers ─────────────────────────────────────────────────────────────────

    const getPrimaryImage = (images: CarImage[]) => images.find((i) => i.isPrimary) ?? images[0];

    const selectClass =
        'rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground ' +
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors';

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {/* ══ Header ══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Cars</h1>
                    {pagination && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {pagination.total} car{pagination.total !== 1 ? 's' : ''} total
                        </p>
                    )}
                </div>
                <Button onClick={() => router.push('/admin/cars/new')}>
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add Car
                </Button>
            </div>

            {/* ══ Search + Filter toggle ══════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                    <Input
                        placeholder="Search cars…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                        aria-label="Search cars"
                    />
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters((v) => !v)}
                    className="relative"
                >
                    <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground leading-none">
                            {activeFilterCount}
                        </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Button>

                {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-primary hover:underline whitespace-nowrap">
                        Clear all
                    </button>
                )}
            </div>

            {/* ══ Filter panel ════════════════════════════════════════════════════ */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 bg-muted/50 rounded-xl border border-border animate-in slide-in-from-top-2 duration-200">
                    {/* Brand */}
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Brand</label>
                        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className={selectClass + ' w-full'}>
                            <option value="">All brands</option>
                            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>

                    {/* Sold status */}
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Sold Status</label>
                        <select value={soldFilter} onChange={(e) => setSoldFilter(e.target.value as SoldFilter)} className={selectClass + ' w-full'}>
                            <option value="all">All</option>
                            <option value="false">Available</option>
                            <option value="true">Sold</option>
                        </select>
                    </div>

                    {/* Featured */}
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Featured</label>
                        <select value={featuredFilter} onChange={(e) => setFeaturedFilter(e.target.value as FeaturedFilter)} className={selectClass + ' w-full'}>
                            <option value="all">All</option>
                            <option value="true">Featured</option>
                            <option value="false">Not Featured</option>
                        </select>
                    </div>
                </div>
            )}

            {/* ══ Bulk actions bar ════════════════════════════════════════════════ */}
            {selectedIds.size > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in duration-200">
                    <span className="text-sm font-medium text-primary">
                        {selectedIds.size} selected
                    </span>
                    <div className="h-4 w-px bg-border" />
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        isLoading={bulkDeleting}
                        disabled={bulkDeleting}
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                        Delete Selected
                    </Button>
                    <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ══ Table ═══════════════════════════════════════════════════════════ */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">
                        Loading…
                    </div>
                ) : cars.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-56 text-muted-foreground gap-2">
                        <p className="text-sm">No cars found.</p>
                        {(search || activeFilterCount > 0) && (
                            <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border" role="table">
                            <thead className="bg-muted/50">
                                <tr>
                                    {/* Checkbox */}
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded accent-primary"
                                            aria-label="Select all cars"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Car</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Brand</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Price</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Featured</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sold</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Views</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {cars.map((car) => {
                                    const thumb = getPrimaryImage(car.images);
                                    const isSelected = selectedIds.has(car._id);
                                    const isToggling = togglingId === car._id;

                                    return (
                                        <tr
                                            key={car._id}
                                            className={`transition-colors duration-100 ${isSelected ? 'bg-primary/5' : 'hover:bg-card-hover'}`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(car._id)}
                                                    className="w-4 h-4 rounded accent-primary"
                                                    aria-label={`Select ${car.name}`}
                                                />
                                            </td>

                                            {/* Thumbnail */}
                                            <td className="px-4 py-3">
                                                <div className="relative w-12 h-9 rounded-lg bg-muted overflow-hidden">
                                                    {thumb?.url ? (
                                                        <Image src={thumb.url} alt={car.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                                            No img
                                                        </div>
                                                    )}
                                                    {car.isSold && (
                                                        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                                                            <span className="text-[8px] font-bold text-primary-foreground uppercase">Sold</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Car info */}
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-foreground text-sm truncate max-w-[200px]">{car.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {car.year} · {car.fuelType} · {car.transmission} · {car.kmsDriven?.toLocaleString('en-IN')} km
                                                </p>
                                            </td>

                                            {/* Brand */}
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    {car.brand?.logo && (
                                                        <div className="relative w-6 h-6 rounded bg-muted overflow-hidden flex-shrink-0">
                                                            <Image src={car.brand.logo} alt="" fill className="object-contain p-0.5" />
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-foreground">{car.brand?.name ?? '—'}</span>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3 text-right hidden lg:table-cell">
                                                <span className="text-sm font-semibold text-foreground">
                                                    ₹{car.price?.toLocaleString('en-IN')}
                                                </span>
                                            </td>

                                            {/* Featured toggle */}
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(car._id, 'toggleFeatured')}
                                                    disabled={isToggling}
                                                    className={`
                            p-1.5 rounded-lg transition-all
                            ${car.isFeatured
                                                            ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                                                            : 'text-muted-foreground hover:text-amber-500 hover:bg-muted'}
                          `}
                                                    title={car.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                                                    aria-label={`Toggle featured for ${car.name}`}
                                                >
                                                    {car.isFeatured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                                                </button>
                                            </td>

                                            {/* Sold toggle */}
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(car._id, 'toggleSold')}
                                                    disabled={isToggling}
                                                    className={`
                            p-1.5 rounded-lg transition-all
                            ${car.isSold
                                                            ? 'text-destructive bg-destructive/10 hover:bg-destructive/20'
                                                            : 'text-muted-foreground hover:text-success hover:bg-muted'}
                          `}
                                                    title={car.isSold ? 'Mark as available' : 'Mark as sold'}
                                                    aria-label={`Toggle sold for ${car.name}`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                            </td>

                                            {/* Views */}
                                            <td className="px-4 py-3 text-center hidden lg:table-cell">
                                                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                                    <span className="text-xs">{car.viewsCount ?? 0}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/admin/cars/${car._id}/edit`)}
                                                        aria-label={`Edit ${car.name}`}
                                                    >
                                                        <Edit className="w-4 h-4" aria-hidden="true" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteId(car._id)}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        aria-label={`Delete ${car.name}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ══ Pagination ══════════════════════════════════════════════════════ */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={!pagination.hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* ══ Delete confirm ══════════════════════════════════════════════════ */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Car"
                message="This will soft-delete the car. It can be recovered later. Continue?"
                confirmLabel="Delete Car"
                loading={deleting}
            />
        </div>
    );
}
