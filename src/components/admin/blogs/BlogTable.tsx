/**
 * src/components/admin/blogs/BlogTable.tsx
 *
 * Client component to manage the display, filtering, and deletion of blogs within the admin panel.
 */
'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { IBlog, BlogStatus } from '@/types/blog.types';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Search, PlusCircle, CheckCircle2, Clock, EyeOff, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlogTableProps {
    initialBlogs: IBlog[];
    initialTotal: number;
    initialTotalPages: number;
}

const statusConfig: Record<BlogStatus, { icon: any, color: string }> = {
    [BlogStatus.Published]: { icon: CheckCircle2, color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
    [BlogStatus.Draft]: { icon: FileText, color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20' },
    [BlogStatus.Review]: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
    [BlogStatus.Archived]: { icon: EyeOff, color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
};

export default function BlogTable({ initialBlogs, initialTotalPages }: BlogTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [blogs, setBlogs] = useState<IBlog[]>(initialBlogs);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

    // Internal state to sync with URL updates triggering hydration
    useEffect(() => {
        setBlogs(initialBlogs);
    }, [initialBlogs]);

    const updateFilters = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset pagination on filter change

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }, [pathname, router, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters('search', searchQuery);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete blog');

            toast.success('Blog deleted successfully');
            router.refresh(); // Refresh current server component data
        } catch (err: any) {
            toast.error(err.message || 'Error deleting blog');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border">
                <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50 border-border h-10 w-full"
                    />
                </form>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); updateFilters('status', v); }}>
                        <SelectTrigger className="w-[140px] bg-background/50 border-border h-10">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {Object.values(BlogStatus).map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Link href="/admin/blogs/new">
                        <Button className="h-10 gap-2 bg-primary hover:bg-primary-hover text-white">
                            <PlusCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">New Blog</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="font-semibold text-foreground">Title</TableHead>
                            <TableHead className="font-semibold text-foreground">Status</TableHead>
                            <TableHead className="font-semibold text-foreground">Category</TableHead>
                            <TableHead className="font-semibold text-foreground text-right">Views</TableHead>
                            <TableHead className="font-semibold text-foreground text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {!isPending && blogs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No blogs found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}

                        {!isPending && blogs.map((blog: any) => {
                            const StatusIcon = statusConfig[blog.status as BlogStatus].icon;
                            return (
                                <TableRow key={blog._id} className="border-border hover:bg-muted/30 group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground line-clamp-1">{blog.title}</span>
                                            <span className="text-xs text-muted-foreground">{blog.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`border-transparent flex gap-1.5 items-center w-fit ${statusConfig[blog.status as BlogStatus].color}`}>
                                            <StatusIcon className="h-3 w-3" />
                                            {blog.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-foreground capitalize">
                                            {blog.category || '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-medium text-foreground">{blog.views.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/blogs/${blog._id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(blog._id, blog.title)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Extremely simple pagination for the table */}
            {initialTotalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: initialTotalPages }, (_, i) => i + 1).map((p) => {
                        const isCurrentPage = searchParams.get('page') === String(p) || (!searchParams.get('page') && p === 1);
                        return (
                            <Button
                                key={p}
                                variant={isCurrentPage ? "primary" : "outline"}
                                size="sm"
                                onClick={() => updateFilters('page', String(p))}
                                className={isCurrentPage ? "bg-primary text-primary-foreground hover:bg-primary" : ""}
                            >
                                {p}
                            </Button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
