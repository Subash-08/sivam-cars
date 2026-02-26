'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Brand {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    isActive: boolean;
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBrandsPage() {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // FIX: Debounce search — prevents API call on every keystroke
    const debouncedSearch = useDebounce(search, 400);

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (debouncedSearch) params.set('search', debouncedSearch);

            const res = await fetch(`/api/admin/brands?${params.toString()}`);
            const data = await res.json() as {
                success: boolean;
                brands?: Brand[];
                pagination?: Pagination;
                error?: string;
            };

            if (data.success) {
                setBrands(data.brands ?? []);
                setPagination(data.pagination ?? null);
            } else {
                toast.error(data.error ?? 'Failed to fetch brands');
            }
        } catch {
            toast.error('Network error — could not load brands');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    // Re-fetch when page or debounced search changes
    useEffect(() => { void fetchBrands(); }, [fetchBrands]);

    // Reset to page 1 when search changes
    useEffect(() => { setPage(1); }, [debouncedSearch]);

    // ── Delete ──────────────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/brands/${deleteId}`, { method: 'DELETE' });
            const data = await res.json() as { success: boolean; error?: string };

            if (data.success) {
                toast.success('Brand deleted');
                setDeleteId(null);
                void fetchBrands();
            } else {
                toast.error(data.error ?? 'Failed to delete brand');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setDeleting(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Brands</h1>
                    {pagination && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {pagination.total} brand{pagination.total !== 1 ? 's' : ''} total
                        </p>
                    )}
                </div>
                <Button onClick={() => router.push('/admin/brands/new')}>
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add Brand
                </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <Input
                    placeholder="Search brands…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    aria-label="Search brands"
                />
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                        Loading…
                    </div>
                ) : brands.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                        <p className="text-sm">No brands found.</p>
                        {search && (
                            <button onClick={() => setSearch('')} className="text-xs text-primary hover:underline">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-border" role="table">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Logo</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Slug</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Created</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {brands.map((brand) => (
                                <tr key={brand._id} className="hover:bg-card-hover transition-colors duration-100">
                                    <td className="px-5 py-4">
                                        <div className="relative w-10 h-10 rounded-lg bg-muted overflow-hidden">
                                            {brand.logo ? (
                                                <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                                                    {brand.name[0]}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-foreground">{brand.name}</td>
                                    <td className="px-5 py-4 text-sm text-muted-foreground hidden sm:table-cell font-mono">{brand.slug}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${brand.isActive
                                            ? 'bg-success/10 text-success border border-success/20'
                                            : 'bg-muted text-muted-foreground border border-border'
                                            }`}>
                                            {brand.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">
                                        {new Date(brand.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/admin/brands/${brand._id}/edit`)}
                                                aria-label={`Edit ${brand.name}`}
                                            >
                                                <Edit className="w-4 h-4" aria-hidden="true" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteId(brand._id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                aria-label={`Delete ${brand.name}`}
                                            >
                                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
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

            {/* Delete confirm dialog */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Brand"
                message="This will soft-delete the brand. Active cars using it will not be affected. Continue?"
                confirmLabel="Delete Brand"
                loading={deleting}
            />
        </div>
    );
}
