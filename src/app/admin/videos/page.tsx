'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
    Plus,
    Search,
    Video,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    Info,
    Smartphone,
    MonitorPlay,
    Youtube,
    Image as ImageIcon
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type { VideoOrientation } from '@/models';
import Button from '@/components/ui/Button';

import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

// ─── Types & Constants ────────────────────────────────────────────────────────

interface VideoDocument {
    _id: string;
    title: string;
    description?: string;
    publicId: string;
    thumbnailPublicId?: string;
    orientation: VideoOrientation;
    duration?: number;
    createdAt: string;
}

const ORIENTATION_OPTIONS: { value: VideoOrientation; label: string; icon: React.ReactNode }[] = [
    { value: 'landscape', label: 'Landscape (16:9)', icon: <MonitorPlay className="w-4 h-4" /> },
    { value: 'reels', label: 'Reels/Shorts (9:16)', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'youtube', label: 'YouTube Style', icon: <Youtube className="w-4 h-4" /> },
];

// ─── Cloudinary URL Helper ────────────────────────────────────────────────────

// Returns custom thumbnail if available.
const getThumbnailUrl = (thumbnailPublicId?: string) => {
    if (!thumbnailPublicId) return undefined;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_300,w_400/${thumbnailPublicId}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminVideosPage() {
    const { status } = useSession();

    // Data state
    const [videos, setVideos] = useState<VideoDocument[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Search
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingVideo, setEditingVideo] = useState<VideoDocument | null>(null);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [orientation, setOrientation] = useState<VideoOrientation>('landscape');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Delete state
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // ─── Fetch Data ───────────────────────────────────────────────────────────

    const fetchVideos = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/videos?page=${page}&limit=12&search=${encodeURIComponent(debouncedSearch)}`);
            const data = await res.json();
            if (data.success) {
                setVideos(data.videos);
                setTotal(data.pagination.total);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch videos', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchVideos();
        }
    }, [status, fetchVideos]);

    // Reset pagination on new search
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const openCreateModal = () => {
        setEditingVideo(null);
        setTitle('');
        setDescription('');
        setOrientation('landscape');
        setUploadFile(null);
        setThumbnailFile(null);
        setUploadProgress(0);
        setIsModalOpen(true);
    };

    const openEditModal = (video: VideoDocument) => {
        setEditingVideo(video);
        setTitle(video.title);
        setDescription(video.description || '');
        setOrientation(video.orientation);
        setUploadFile(null); // Can't change video file on edit, only metadata
        setThumbnailFile(null); // But we can upload a custom thumbnail on edit
        setUploadProgress(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) return;
        setIsModalOpen(false);
        setTimeout(() => {
            setEditingVideo(null);
            setUploadFile(null);
            setThumbnailFile(null);
        }, 200);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation based on implementation plan
        if (file.size > 25 * 1024 * 1024) {
            alert('File size exceeds 25MB limit.');
            e.target.value = '';
            return;
        }
        if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
            alert('Only MP4, WebM, and Quicktime formats are supported.');
            e.target.value = '';
            return;
        }

        setUploadFile(file);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Custom thumbnail size exceeds 2MB limit.');
            e.target.value = '';
            return;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            alert('Only JPEG, PNG, and WebP formats are supported for custom thumbnails.');
            e.target.value = '';
            return;
        }

        setThumbnailFile(file);
    };

    // ─── Submit (Upload + Save DB) ────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let publicId = editingVideo?.publicId;

            // 1. If new file, upload to Cloudinary first
            if (uploadFile) {
                setUploadProgress(10);
                const formData = new FormData();
                formData.append('file', uploadFile);
                formData.append('folder', 'videos'); // The updated API route param

                // Simulate progress for UX
                const progressInterval = setInterval(() => {
                    setUploadProgress((p) => Math.min(p + 5, 90));
                }, 500);

                const uploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });
                clearInterval(progressInterval);

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok || !uploadData.success) {
                    throw new Error(uploadData.error || 'Upload failed');
                }

                setUploadProgress(100);
                publicId = uploadData.publicId;
            }

            if (!publicId) throw new Error('No video publicId available');

            // 1.5. If new thumbnail file, upload to Cloudinary 
            let thumbnailPublicId = editingVideo?.thumbnailPublicId;
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append('file', thumbnailFile);
                formData.append('folder', 'videos');

                const uploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok || !uploadData.success) {
                    throw new Error(uploadData.error || 'Thumbnail upload failed');
                }

                thumbnailPublicId = uploadData.publicId;
            }

            // 2. Save to DB
            const payload = {
                title,
                description,
                orientation,
                publicId,
                thumbnailPublicId,
            };

            const url = editingVideo ? `/api/admin/videos/${editingVideo._id}` : '/api/admin/videos';
            const method = editingVideo ? 'PUT' : 'POST';

            const dbRes = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const dbData = await dbRes.json();
            if (!dbRes.ok || !dbData.success) {
                throw new Error(dbData.error || 'Failed to save metadata');
            }

            closeModal();
            fetchVideos();

        } catch (error: any) {
            alert(error.message || 'An error occurred during save.');
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    // ─── Delete ───────────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!deleteId) return;

        // Note: The UI just deletes the DB record. 
        // Real-world: Should also trigger Cloudinary deletion async via webhook/queue.
        try {
            const res = await fetch(`/api/admin/videos/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                setDeleteId(null);
                fetchVideos();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            alert('Failed to delete video.');
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    if (status === 'loading') {
        return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Video className="w-6 h-6 text-primary" />
                        Video Library
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your repository of videos to use across the site.
                    </p>
                </div>
                <Button onClick={openCreateModal} className="shrink-0 gap-2">
                    <Plus className="w-4 h-4" />
                    Upload Video
                </Button>
            </div>

            {/* Performance Spec Callout */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 flex gap-3 items-start">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold text-foreground mb-1">📐 Recommended specs for smooth playback</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5 ml-1">
                        <li><strong>Landscape:</strong> 1280×720 HD, MP4/WebM, max 25 MB</li>
                        <li><strong>Reels (9:16):</strong> 1080×1920 HD, MP4, max 20 MB</li>
                        <li><strong>YouTube-style:</strong> 1920×1080 Full HD, max 25 MB</li>
                        <li><strong>General:</strong> Frame rate 30fps max for web performance. No 4K needed.</li>
                    </ul>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4 bg-card p-2 rounded-lg border border-border">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search videos by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-transparent border-0 focus-visible:ring-0 shadow-none"
                    />
                </div>
                <div className="px-4 text-sm text-muted-foreground border-l border-border hidden sm:block">
                    {total} {total === 1 ? 'video' : 'videos'} total
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
                    <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No videos found</h3>
                    <p className="text-muted-foreground mt-1">
                        {searchTerm ? 'Try adjusting your search query.' : 'Click "Upload Video" to add your first asset.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div key={video._id} className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-md transition-all">
                            {/* Thumbnail Area */}
                            <div className="relative aspect-video bg-muted border-b border-border overflow-hidden isolate flex items-center justify-center">
                                {video.thumbnailPublicId ? (
                                    <Image
                                        src={getThumbnailUrl(video.thumbnailPublicId)!}
                                        alt={video.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <Video className="w-12 h-12 text-muted-foreground/30" />
                                )}
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1.5">
                                    <div className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-medium tracking-wide flex items-center gap-1 border border-white/10">
                                        {ORIENTATION_OPTIONS.find(o => o.value === video.orientation)?.icon}
                                        {video.orientation.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-4">
                                <h3 className="font-medium text-foreground line-clamp-1" title={video.title}>{video.title}</h3>
                                {video.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={video.description}>
                                        {video.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                                        {new Date(video.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openEditModal(video)}
                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                            title="Edit metadata"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(video._id)}
                                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                            title="Delete video"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground min-w-[4rem] text-center">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* ─── Modal ────────────────────────────────────────────────────────── */}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-card w-full max-w-lg rounded-xl border border-border shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4">{editingVideo ? 'Edit Video Metadata' : 'Upload New Video'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingVideo && (
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Video File (max 25MB) *</label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <Input
                                            type="file"
                                            accept="video/mp4,video/webm,video/quicktime"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        {uploadFile ? (
                                            <p className="text-primary font-medium">{uploadFile.name}</p>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">Click here to browse MP4/WebM files</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Title *</label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="E.g. Kia Sonet Delivery Celebration"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Custom Thumbnail <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => thumbnailInputRef.current?.click()}>
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        ref={thumbnailInputRef}
                                        onChange={handleThumbnailChange}
                                    />
                                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    {thumbnailFile ? (
                                        <p className="text-primary font-medium">{thumbnailFile.name}</p>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Upload custom cover image (JPEG/PNG/WebP, max 2MB)</p>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">If left empty, a frame from the video will be automatically extracted.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">
                                    Description <span className="text-muted-foreground font-normal">(Optional)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Brief details about the video..."
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Display Orientation</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {ORIENTATION_OPTIONS.map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => !isSubmitting && setOrientation(opt.value)}
                                            className={`flex flex-col items-center justify-center p-3 rounded border text-center cursor-pointer transition-all ${orientation === opt.value
                                                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                                : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                                                } ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
                                        >
                                            <span className="mb-2 opacity-80">{opt.icon}</span>
                                            <span className="text-[11px] font-semibold tracking-wide uppercase">{opt.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    This tells the frontend how to frame the player aspect ratio.
                                </p>
                            </div>

                            {/* Progress Bar */}
                            {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="space-y-1 mt-6">
                                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                        <span>Uploading to Cloudinary...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                                <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting || (!editingVideo && !uploadFile)}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Saving...'}
                                        </>
                                    ) : (
                                        editingVideo ? 'Save Changes' : 'Upload Video'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Video"
                message="Are you sure you want to delete this video? This action cannot be undone and it will be removed from any active homepage sections."
                confirmLabel="Delete"
                confirmVariant="destructive"
            />
        </div>
    );
}
