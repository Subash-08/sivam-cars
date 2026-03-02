/**
 * src/components/admin/blogs/BlogForm.tsx
 *
 * Complex client form for creating and updating Blogs. 
 * Supports rich HTML text input (assumes user will paste HTML or use a library, 
 * using simple textarea for now to maintain pure implementation speed, can be upgraded to Tiptap).
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IBlog, BlogStatus } from '@/types/blog.types';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';


interface BlogFormProps {
    initialData?: Partial<IBlog>;
    isEditing?: boolean;
    blogId?: string;
}

export default function BlogForm({ initialData = {}, isEditing = false, blogId }: BlogFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData.title || '',
        slug: initialData.slug || '',
        html: initialData.html || '',
        excerpt: initialData.excerpt || '',
        category: initialData.category || '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        status: initialData.status || BlogStatus.Draft,
        featured: initialData.featured || false,
        noindex: initialData.noindex || false,
        image_url: initialData.image_url || '',
        image_alt: initialData.image_alt || '',
        meta_title: initialData.meta_title || '',
        meta_description: initialData.meta_description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.html) {
            toast.error('Title and HTML Content are required fields.');
            return;
        }

        setIsSaving(true);

        try {
            // Clean up tags payload
            const tagsArray = formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const payload = {
                ...formData,
                tags: tagsArray,
                // Only send slug if it has a value, otherwise let backend auto-generate
                slug: formData.slug || undefined,
            };

            const url = isEditing ? `/api/admin/blogs/${blogId}` : '/api/admin/blogs';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) {
                // Formatting Zod errors
                if (result.details) {
                    const messages = result.details.map((d: any) => d.message).join(', ');
                    throw new Error(`Validation Error: ${messages}`);
                }
                throw new Error(result.error || 'Failed to save blog');
            }

            toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);

            // Go back to list and force refresh to see new entry
            router.push('/admin/blogs');
            router.refresh();

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-10 w-10 border-border bg-card text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {isEditing ? 'Edit Blog Post' : 'Create New Blog'}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEditing ? `Editing ${initialData.slug}` : 'Write a new article for your audience'}
                        </p>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isSaving}
                    className="gap-2 bg-primary hover:bg-primary-hover text-white px-6"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save Blog'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Core Content</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-foreground">Title <span className="text-primary">*</span></Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="bg-background/50 border-border text-lg font-medium"
                                    placeholder="The Ultimate Guide to Buying a Used Car"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-foreground">Slug (Optional - Auto-generated from title)</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="bg-background/50 border-border font-mono text-sm"
                                    placeholder="the-ultimate-guide"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="html" className="text-foreground flex justify-between">
                                    <span>HTML Content <span className="text-primary">*</span></span>
                                    <span className="text-xs text-muted-foreground font-normal">Sanitized via DOMPurify automatically on save</span>
                                </Label>
                                <Textarea
                                    id="html"
                                    name="html"
                                    value={formData.html}
                                    onChange={handleChange}
                                    placeholder="<h1>Paste rich HTML here...</h1>"
                                    className="min-h-[400px] font-mono text-sm bg-background/50 border-border whitespace-pre"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="text-foreground">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="A brief summary for cards and feeds..."
                                    className="bg-background/50 border-border h-24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">SEO overrides</h2>
                        <p className="text-sm text-muted-foreground mb-4">Leave blank to use defaults (Title and Excerpt)</p>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title" className="text-foreground">Meta Title</Label>
                                <Input
                                    id="meta_title"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    className="bg-background/50 border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meta_description" className="text-foreground">Meta Description</Label>
                                <Textarea
                                    id="meta_description"
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    className="bg-background/50 border-border h-20"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                                <div className="space-y-0.5">
                                    <Label className="text-foreground">No Index</Label>
                                    <p className="text-xs text-muted-foreground">Prevent search engines from indexing this page</p>
                                </div>
                                <Switch
                                    checked={formData.noindex}
                                    onCheckedChange={(c) => handleSwitchChange('noindex', c)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Publishing</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-foreground">Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                                    <SelectTrigger className="bg-background/50 border-border">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(BlogStatus).map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Label className="text-foreground font-medium cursor-pointer" htmlFor="featured">Featured Post</Label>
                                <Switch
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(c) => handleSwitchChange('featured', c)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Media
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image_url" className="text-foreground">Featured Image URL (Cloudinary)</Label>
                                <Input
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://res.cloudinary.com/..."
                                    className="bg-background/50 border-border text-sm"
                                />
                            </div>
                            {formData.image_url && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video relative bg-muted flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.image_url} alt="Preview" className="object-cover w-full h-full" />
                                </div>
                            )}
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="image_alt" className="text-foreground">Image Alt Text</Label>
                                <Input
                                    id="image_alt"
                                    name="image_alt"
                                    value={formData.image_alt}
                                    onChange={handleChange}
                                    className="bg-background/50 border-border"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                        <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">Classification</h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-foreground">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Buying Guides"
                                    className="bg-background/50 border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-foreground">Tags</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="Comma separated (e.g. suv, advice, 2024)"
                                    className="bg-background/50 border-border"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
