'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
    LayoutGrid,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Eye,
    EyeOff,
    Check,
    Search,
    GripVertical,
    ArrowUp,
    ArrowDown,
    Film,
    LayoutTemplate,
    GalleryHorizontalEnd,
    Smartphone,
    MonitorPlay,
    Video
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type { VideoLayoutType } from '@/models';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

// ─── Constants & Layout Previews ──────────────────────────────────────────────

const VIDEO_LAYOUT_OPTIONS: {
    value: VideoLayoutType;
    label: string;
    icon: React.ReactNode;
    desc: string;
}[] = [
        {
            value: 'single-highlight',
            label: 'Hero Highlight',
            icon: <MonitorPlay className="w-5 h-5" />,
            desc: '1 Large Video Top + Thumbnails Below',
        },
        {
            value: 'grid',
            label: 'Equal Grid',
            icon: <LayoutGrid className="w-5 h-5" />,
            desc: 'Responsive 3-Column Grid',
        },
        {
            value: 'carousel',
            label: 'Horizontal Slider',
            icon: <GalleryHorizontalEnd className="w-5 h-5" />,
            desc: 'Snap-Scroll Row (Netflix Style)',
        },
        {
            value: 'reels',
            label: 'Vertical Reels',
            icon: <Smartphone className="w-5 h-5" />,
            desc: 'Tall 9:16 Format for Mobile',
        },
        {
            value: 'spotlight',
            label: 'Spotlight Split',
            icon: <LayoutTemplate className="w-5 h-5" />,
            desc: '1 Large Left + 2 Small Right',
        },
    ];

// Returns custom thumbnail if available.
const getThumbnailUrl = (thumbnailPublicId?: string) => {
    if (!thumbnailPublicId) return undefined;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_300,w_400/${thumbnailPublicId}`;
};

// ─── Selected Video Shape ─────────────────────────────────────────────────────

type VideoOrientation = 'landscape' | 'portrait' | 'square';

interface SelectedVideo {
    _id: string; // Keep _id for internal tracking
    title: string;
    publicId: string;
    thumbnailPublicId?: string;
    orientation: VideoOrientation;
}

interface AdminVideoSection {
    _id: string;
    title: string;
    subtitle?: string;
    layoutType: VideoLayoutType;
    fullWidth: boolean;
    marginTop: number;
    marginBottom: number;
    isActive: boolean;
    videos: any[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminVideoSectionsPage() {
    const { status } = useSession();

    // Data State
    const [sections, setSections] = useState<AdminVideoSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form Fields
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [layoutType, setLayoutType] = useState<VideoLayoutType>('grid');
    const [fullWidth, setFullWidth] = useState(false);
    const [marginTop, setMarginTop] = useState(0);
    const [marginBottom, setMarginBottom] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [selectedVideos, setSelectedVideos] = useState<SelectedVideo[]>([]);

    // Delete / Action state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isReordering, setIsReordering] = useState(false);

    // Video Picker State
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');
    const debouncedPickerSearch = useDebounce(pickerSearch, 500);
    const [pickerVideos, setPickerVideos] = useState<any[]>([]);
    const [isPickerLoading, setIsPickerLoading] = useState(false);

    // ─── Fetch Sections ───────────────────────────────────────────────────────

    const fetchSections = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/video-sections');
            const data = await res.json();
            if (data.success) {
                setSections(data.sections);
            }
        } catch (error) {
            console.error('Fetch sections error', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated') fetchSections();
    }, [status, fetchSections]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const openCreateModal = () => {
        setEditingId(null);
        setTitle('');
        setSubtitle('');
        setLayoutType('grid');
        setFullWidth(false);
        setMarginTop(0);
        setMarginBottom(0);
        setIsActive(true);
        setSelectedVideos([]);
        setIsModalOpen(true);
    };

    const openEditModal = (section: any) => {
        setEditingId(section._id);
        setTitle(section.title);
        setSubtitle(section.subtitle || '');
        setLayoutType(section.layoutType);
        setFullWidth(section.fullWidth);
        setMarginTop(section.marginTop || 0);
        setMarginBottom(section.marginBottom || 0);
        setIsActive(section.isActive);

        // Map populated subdoc array to our selected video format
        const vids = (section.videos || []).map((e: any) => ({
            _id: e.video._id,
            publicId: e.video.publicId,
            title: e.video.title,
            thumbnailPublicId: e.video.thumbnailPublicId,
            orientation: e.video.orientation,
        }));
        setSelectedVideos(vids);
        setIsModalOpen(true);
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                title,
                subtitle,
                layoutType,
                fullWidth,
                marginTop: Number(marginTop),
                marginBottom: Number(marginBottom),
                isActive,
                videos: selectedVideos.map((v, i) => ({ videoId: v._id, order: i })),
            };

            const url = editingId ? `/api/admin/video-sections/${editingId}` : '/api/admin/video-sections';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            setIsModalOpen(false);
            fetchSections();
        } catch (err: any) {
            alert(err.message || 'Save failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Delete & Reorder ─────────────────────────────────────────────────────

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/admin/video-sections/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                setSections((prev) => prev.filter((s) => s._id !== deleteId));
            }
        } catch (error) {
            alert('Delete failed');
        } finally {
            setDeleteId(null);
        }
    };

    const handleToggleActive = async (section: any) => {
        try {
            const res = await fetch(`/api/admin/video-sections/${section._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !section.isActive }),
            });
            if (res.ok) {
                setSections((prev) =>
                    prev.map((s) => (s._id === section._id ? { ...s, isActive: !s.isActive } : s))
                );
            }
        } catch (error) {
            console.error('Toggle failed', error);
        }
    };

    const moveSection = async (index: number, direction: 'up' | 'down') => {
        if (isReordering) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        setIsReordering(true);
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap directly in local state for immediate response
        const temp = newSections[index];
        newSections[index] = newSections[targetIndex];
        newSections[targetIndex] = temp;
        setSections(newSections);

        const orderedIds = newSections.map((s) => s._id);

        try {
            const res = await fetch('/api/admin/video-sections', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds }),
            });
            if (!res.ok) throw new Error('Reorder failed');
            fetchSections(); // Resync cleanly after DB confirm
        } catch (error) {
            alert('Failed to save order.');
            fetchSections(); // Revert
        } finally {
            setIsReordering(false);
        }
    };

    // ─── Video Picker Logic ───────────────────────────────────────────────────

    const fetchPickerVideos = useCallback(async () => {
        setIsPickerLoading(true);
        try {
            const res = await fetch(`/api/admin/videos?search=${encodeURIComponent(debouncedPickerSearch)}&limit=12`);
            const data = await res.json();
            if (data.success) setPickerVideos(data.videos);
        } catch (e) {
            console.error('Picker fetch error', e);
        } finally {
            setIsPickerLoading(false);
        }
    }, [debouncedPickerSearch]);

    useEffect(() => {
        if (isPickerOpen) fetchPickerVideos();
    }, [isPickerOpen, fetchPickerVideos]);

    const addToSelection = (video: any) => {
        if (selectedVideos.find((v) => v._id === video._id)) return;
        if (selectedVideos.length >= 20) {
            alert('Maximum 20 videos allowed per section.');
            return;
        }
        setSelectedVideos((prev) => [...prev, {
            _id: video._id,
            publicId: video.publicId,
            title: video.title,
            thumbnailPublicId: video.thumbnailPublicId,
            orientation: video.orientation,
        }]);
    };

    const removeFromSelection = (id: string) => {
        setSelectedVideos((prev) => prev.filter((v) => v._id !== id));
    };

    const moveSelectedVideo = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === selectedVideos.length - 1) return;

        const newSelected = [...selectedVideos];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newSelected[index];
        newSelected[index] = newSelected[targetIndex];
        newSelected[targetIndex] = temp;
        setSelectedVideos(newSelected);
    };

    // ─── Render UI ────────────────────────────────────────────────────────────

    if (status === 'loading') return <div className="p-8 flex justify-center"><Loader2 className="w-8 animate-spin" /></div>;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-primary" />
                        Video Sections
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Build and reorder video blocks for the public homepage.
                    </p>
                </div>
                <Button onClick={openCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center h-64 items-center"><Loader2 className="w-8 animate-spin text-muted-foreground" /></div>
            ) : sections.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl border-border">
                    <LayoutGrid className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No sections created yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <div key={section._id} className={`flex items-center gap-4 bg-card border rounded-lg p-4 transition-all ${!section.isActive ? 'opacity-60 bg-muted/30 border-dashed' : 'border-border'}`}>
                            {/* Reorder Controls */}
                            <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100">
                                <button
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0 || isReordering}
                                    className="pt-1 px-1 hover:text-primary disabled:opacity-30 transition-colors"
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <button
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === sections.length - 1 || isReordering}
                                    className="pb-1 px-1 hover:text-primary disabled:opacity-30 transition-colors"
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg line-clamp-1">{section.title}</h3>
                                    <div className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider hidden sm:block">
                                        {section.layoutType}
                                    </div>
                                    {!section.isActive && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">Draft</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{section.subtitle || <em>No subtitle</em>}</p>
                                <p className="text-xs font-medium text-muted-foreground mt-2 flex items-center gap-1.5">
                                    <Film className="w-3.5 h-3.5" />
                                    {section.videos.length} videos attached
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleActive(section)}
                                    className={`p-2 rounded hover:bg-muted transition-colors ${section.isActive ? 'text-primary' : 'text-muted-foreground'}`}
                                    title={section.isActive ? 'Hide on live site' : 'Show on live site'}
                                >
                                    {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <div className="w-px h-6 bg-border mx-1" />
                                <button onClick={() => openEditModal(section)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors" title="Edit schema">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteId(section._id)} className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Create/Edit Modal ────────────────────────────────────────────── */}

            {isModalOpen && !isPickerOpen && (
                <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-border">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Video Section' : 'Create Video Section'}</h2>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">1. Section Details</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Main Title *</label>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Subtitle</label>
                                        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional text below title" />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Top Margin (px)</label>
                                        <Input type="number" value={marginTop} onChange={(e) => setMarginTop(Number(e.target.value))} min={0} max={200} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Bottom Margin (px)</label>
                                        <Input type="number" value={marginBottom} onChange={(e) => setMarginBottom(Number(e.target.value))} min={0} max={200} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">2. Presentation Layout</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {VIDEO_LAYOUT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setLayoutType(opt.value)}
                                            className={`p-3 rounded-lg border text-left flex flex-col transition-all ${layoutType === opt.value
                                                ? 'border-primary ring-1 ring-primary/20 bg-primary/5'
                                                : 'border-border hover:border-muted-foreground/30 bg-card hover:bg-muted'
                                                }`}
                                        >
                                            <div className={`mb-2 ${layoutType === opt.value ? 'text-primary' : 'text-muted-foreground'}`}>{opt.icon}</div>
                                            <div className="font-semibold text-sm">{opt.label}</div>
                                            <div className="text-[10px] text-muted-foreground mt-1 leading-snug">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                                <label className="flex items-center gap-2 text-sm mt-3 p-3 bg-muted/40 rounded border select-none cursor-pointer">
                                    <input type="checkbox" checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
                                    <span className="font-medium">Full Width Section</span>
                                    <span className="text-muted-foreground ml-auto pr-1">(Break out of Max-Width Container)</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm p-3 bg-muted/40 rounded border select-none cursor-pointer">
                                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded text-primary focus:ring-primary h-4 w-4" />
                                    <span className="font-medium">Publish Live Immediate</span>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-end justify-between border-b pb-2">
                                    <h3 className="font-semibold text-lg">3. Assigned Videos</h3>
                                    <Button type="button" size="sm" variant="outline" onClick={() => { setIsPickerOpen(true); setPickerSearch(''); }} className="gap-2">
                                        <Plus className="w-3.5 h-3.5" /> Attach Videos
                                    </Button>
                                </div>

                                {selectedVideos.length === 0 ? (
                                    <div className="text-sm text-center py-6 text-muted-foreground bg-muted/30 border border-dashed rounded-lg">
                                        No videos attached to this section yet.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedVideos.map((sv, idx) => (
                                            <div key={sv._id} className="flex items-center gap-3 p-2 bg-card border rounded shadow-sm text-sm group">
                                                {/* Reorder in list */}
                                                <div className="flex flex-col opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <button type="button" onClick={() => moveSelectedVideo(idx, 'up')} disabled={idx === 0} className="hover:text-primary disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                                                    <button type="button" onClick={() => moveSelectedVideo(idx, 'down')} disabled={idx === selectedVideos.length - 1} className="hover:text-primary disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                                                </div>
                                                <div className="relative w-16 h-10 rounded overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                                                    {sv.thumbnailPublicId ? (
                                                        <Image src={getThumbnailUrl(sv.thumbnailPublicId)!} alt={sv.title} fill className="object-cover" />
                                                    ) : (
                                                        <Video className="w-4 h-4 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                                <div className="flex-1 font-medium truncate">{sv.title}</div>
                                                <button type="button" onClick={() => removeFromSelection(sv._id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 border-t border-border flex justify-end gap-3 bg-muted/20">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={submitForm} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Section
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Video Picker Modal (Stacked above main modal) ────────────────── */}

            {isPickerOpen && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-3xl rounded-xl shadow-2xl border border-border flex flex-col h-[80vh]">
                        <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Film className="w-5 h-5" /> Select Videos
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => setIsPickerOpen(false)}>Done</Button>
                        </div>

                        <div className="p-4 border-b bg-card">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search video library by title..."
                                    value={pickerSearch}
                                    onChange={(e) => setPickerSearch(e.target.value)}
                                    className="pl-9"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1 bg-muted/10 grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-max">
                            {isPickerLoading ? (
                                <div className="col-span-full py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                            ) : pickerVideos.length === 0 ? (
                                <div className="col-span-full py-10 text-center text-muted-foreground">No videos found.</div>
                            ) : (
                                pickerVideos.map((video) => {
                                    const isSelected = selectedVideos.some((v) => v._id === video._id);
                                    return (
                                        <div
                                            key={video._id}
                                            onClick={() => isSelected ? removeFromSelection(video._id) : addToSelection(video)}
                                            className={`relative group cursor-pointer border rounded-lg overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary border-transparent' : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="relative aspect-video bg-muted border-b border-border flex items-center justify-center">
                                                {video.thumbnailPublicId ? (
                                                    <Image
                                                        src={getThumbnailUrl(video.thumbnailPublicId)!}
                                                        alt={video.title}
                                                        fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                                                ) : (
                                                    <Video className="w-8 h-8 text-muted-foreground/30" />
                                                )}
                                                {/* Selection Overlay */}
                                                <div className={`absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                    {isSelected ? (
                                                        <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-md">
                                                            <Check className="w-5 h-5" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-background/80 text-foreground px-3 py-1.5 rounded font-medium text-xs shadow-md">
                                                            Click to Add
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-2 text-xs font-medium truncate bg-card">{video.title}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Section"
                message="Are you sure you want to delete this section? This will remove it from the live site immediately."
                confirmLabel="Delete"
                confirmVariant="destructive"
            />
        </div>
    );
}
