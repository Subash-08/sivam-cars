'use client';

import { useCallback, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Image from 'next/image';
import { Upload, X, Star, Film, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoItem {
    url: string;
    publicId: string;
    order: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StepMedia() {
    const { control, register, setValue, watch } = useFormContext();

    // ── Image fields ──────────────────────────────────────────────────────────
    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
    } = useFieldArray({ control, name: 'images' });

    // ── Video fields ──────────────────────────────────────────────────────────
    const {
        fields: sliderFields,
        append: appendSlider,
        remove: removeSlider,
    } = useFieldArray({ control, name: 'sliderVideos' });

    const {
        fields: reelFields,
        append: appendReel,
        remove: removeReel,
    } = useFieldArray({ control, name: 'reelVideos' });

    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingSliderVideos, setUploadingSliderVideos] = useState(false);
    const [uploadingReelVideos, setUploadingReelVideos] = useState(false);

    const images = watch('images') ?? [];
    const sliderVideos: VideoItem[] = watch('sliderVideos') ?? [];
    const reelVideos: VideoItem[] = watch('reelVideos') ?? [];

    // ── Image upload ──────────────────────────────────────────────────────────

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList?.length) return;

        const files = Array.from(fileList).slice(0, 20 - images.length);
        if (files.length === 0) { toast.error('Max 20 images reached'); return; }

        setUploadingImages(true);
        try {
            for (const file of files) {
                if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); continue; }
                if (file.size > 2 * 1024 * 1024) { toast.error(`${file.name} too large (max 2 MB)`); continue; }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', 'cars');

                const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.success) {
                    appendImage({
                        url: data.url,
                        publicId: data.publicId,
                        alt: '',
                        isPrimary: images.length === 0 && imageFields.length === 0,
                        order: imageFields.length,
                    });
                } else {
                    toast.error(data.error ?? 'Upload failed');
                }
            }
            toast.success('Images uploaded');
        } catch { toast.error('Upload error'); }
        finally {
            setUploadingImages(false);
            e.target.value = '';
        }
    }, [appendImage, imageFields.length, images.length]);

    // ── Video upload (shared logic) ───────────────────────────────────────────

    const handleVideoUpload = useCallback(async (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: 'sliderVideos' | 'reelVideos',
        currentVideos: VideoItem[],
        appendFn: (item: VideoItem) => void,
        setUploading: (v: boolean) => void,
    ) => {
        const fileList = e.target.files;
        if (!fileList?.length) return;

        const remaining = 5 - currentVideos.length;
        const files = Array.from(fileList).slice(0, remaining);
        if (files.length === 0) { toast.error('Max 5 videos reached'); return; }

        setUploading(true);
        try {
            for (const file of files) {
                if (!file.type.startsWith('video/')) { toast.error(`${file.name} is not a video`); continue; }
                if (file.size > 50 * 1024 * 1024) { toast.error(`${file.name} too large (max 50 MB)`); continue; }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', 'cars');

                const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.success) {
                    appendFn({
                        url: data.url,
                        publicId: data.publicId,
                        order: currentVideos.length,
                    });
                } else {
                    toast.error(data.error ?? 'Video upload failed');
                }
            }
            toast.success(`${fieldName === 'sliderVideos' ? 'Slider' : 'Reel'} video(s) uploaded`);
        } catch { toast.error('Video upload error'); }
        finally {
            setUploading(false);
            e.target.value = '';
        }
    }, []);

    // ── Media removal ─────────────────────────────────────────────────────────

    const handleRemoveMedia = useCallback(async (
        index: number,
        items: Array<{ publicId?: string }>,
        removeFn: (index: number) => void
    ) => {
        const item = items[index];
        // Remove locally from Form logic fast
        removeFn(index);

        if (item?.publicId) {
            try {
                // Background delete via API
                await fetch(`/api/admin/upload?publicId=${encodeURIComponent(item.publicId)}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error('Failed to delete media from cloud', error);
            }
        }
    }, []);

    // ── Set primary image ─────────────────────────────────────────────────────

    const setPrimary = useCallback((index: number) => {
        const current = watch('images') as Array<{ isPrimary: boolean }>;
        current.forEach((_, i) => {
            setValue(`images.${i}.isPrimary`, i === index, { shouldValidate: false });
        });
    }, [setValue, watch]);

    return (
        <div className="space-y-8">
            <h2 className="text-lg font-semibold text-foreground">Media</h2>

            {/* ═══════════════════════════════════════════════════════════════════
                SECTION 1: Image Gallery
            ═══════════════════════════════════════════════════════════════════ */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-foreground">
                        Images (max 20)
                    </label>
                    <span className="text-xs text-muted-foreground">{images.length}/20 uploaded</span>
                </div>

                {/* Upload button */}
                <div className="mb-4">
                    <input
                        id="car-images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages || images.length >= 20}
                        className="sr-only"
                    />
                    <label htmlFor="car-images" className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-card-hover text-foreground transition-colors">
                        <Upload className="w-4 h-4" />
                        {uploadingImages ? 'Uploading…' : 'Add Images'}
                    </label>
                </div>

                {/* Image grid */}
                {imageFields.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {imageFields.map((field, index) => {
                            const img = images[index];
                            return (
                                <div
                                    key={field.id}
                                    className={`
                                        relative group rounded-lg border-2 overflow-hidden aspect-video bg-muted
                                        ${img?.isPrimary ? 'border-primary ring-2 ring-primary/30' : 'border-border'}
                                    `}
                                >
                                    {img?.url && (
                                        <Image src={img.url} alt={img.alt || `Image ${index + 1}`} fill className="object-cover" />
                                    )}

                                    {/* Overlay controls */}
                                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => setPrimary(index)}
                                            className="w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                            title="Set as primary"
                                        >
                                            <Star className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(index, images, removeImage)}
                                            className="w-7 h-7 rounded-full bg-destructive/90 text-primary-foreground flex items-center justify-center hover:bg-destructive"
                                            title="Remove"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Primary badge */}
                                    {img?.isPrimary && (
                                        <span className="absolute top-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-medium">
                                            Primary
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                SECTION 2: Slider Videos (shown with image gallery)
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="pt-6 border-t border-border">
                <VideoUploadSection
                    title="Slider Videos"
                    description="Videos displayed alongside the image gallery"
                    icon={<Film className="w-4 h-4 text-primary" />}
                    fieldName="sliderVideos"
                    fields={sliderFields}
                    videos={sliderVideos}
                    uploading={uploadingSliderVideos}
                    inputId="slider-videos"
                    onUpload={(e) => handleVideoUpload(e, 'sliderVideos', sliderVideos, appendSlider, setUploadingSliderVideos)}
                    onRemove={(index) => handleRemoveMedia(index, sliderVideos, removeSlider)}
                    maxCount={5}
                    register={register}
                />
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                SECTION 3: Reel Videos
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="pt-6 border-t border-border">
                <VideoUploadSection
                    title="Reel Videos"
                    description="Short vertical reels for social-style display"
                    icon={<Video className="w-4 h-4 text-primary" />}
                    fieldName="reelVideos"
                    fields={reelFields}
                    videos={reelVideos}
                    uploading={uploadingReelVideos}
                    inputId="reel-videos"
                    onUpload={(e) => handleVideoUpload(e, 'reelVideos', reelVideos, appendReel, setUploadingReelVideos)}
                    onRemove={(index) => handleRemoveMedia(index, reelVideos, removeReel)}
                    maxCount={5}
                    register={register}
                />
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                SECTION 4: Brochure URL
            ═══════════════════════════════════════════════════════════════════ */}
            <section className="pt-6 border-t border-border">
                <label htmlFor="brochure" className="block text-sm font-medium text-foreground mb-1">
                    Brochure URL
                </label>
                <Input id="brochure" placeholder="https://cloudinary.com/…/brochure.pdf" {...register('brochureUrl')} />
                <p className="text-xs text-muted-foreground mt-1">Link to a PDF brochure on Cloudinary</p>
            </section>
        </div>
    );
}

// ─── Video Upload Section (shared sub-component) ─────────────────────────────

interface VideoUploadSectionProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    fieldName: string;
    fields: Array<{ id: string }>;
    videos: VideoItem[];
    uploading: boolean;
    inputId: string;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (index: number) => void;
    maxCount: number;
    register: any; // from useFormContext
}

function VideoUploadSection({
    title,
    description,
    icon,
    fieldName,
    fields,
    videos,
    uploading,
    inputId,
    onUpload,
    onRemove,
    maxCount,
    register,
}: VideoUploadSectionProps) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{description} — max {maxCount}</p>

            {/* Upload button */}
            <div className="mb-4">
                <input
                    id={inputId}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    multiple
                    onChange={onUpload}
                    disabled={uploading || videos.length >= maxCount}
                    className="sr-only"
                />
                <label
                    htmlFor={inputId}
                    className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-card-hover text-foreground transition-colors ${uploading || videos.length >= maxCount ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading…' : `Add ${title}`}
                </label>
                <span className="ml-3 text-xs text-muted-foreground">{videos.length}/{maxCount} uploaded</span>
            </div>

            {/* Video list */}
            {fields.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fields.map((field, index) => {
                        const video = videos[index];
                        return (
                            <div
                                key={field.id}
                                className="relative group rounded-lg border border-border overflow-hidden bg-muted"
                            >
                                {/* Required for RHF array field tracking on submit */}
                                <input type="hidden" {...register(`${fieldName}.${index}.url`)} value={video?.url || ''} />
                                <input type="hidden" {...register(`${fieldName}.${index}.publicId`)} value={video?.publicId || ''} />
                                <input type="hidden" {...register(`${fieldName}.${index}.order`)} value={video?.order ?? index} />

                                {video?.url && (
                                    <video
                                        src={video.url}
                                        className="w-full aspect-video object-cover"
                                        muted
                                        playsInline
                                        preload="metadata"
                                        onMouseEnter={(e) => {
                                            const target = e.currentTarget;
                                            target.play().catch(() => { /* ignore autoplay block */ });
                                        }}
                                        onMouseLeave={(e) => {
                                            const target = e.currentTarget;
                                            target.pause();
                                            target.currentTime = 0;
                                        }}
                                    />
                                )}

                                {/* Overlay order badge */}
                                <span className="absolute top-2 left-2 text-[10px] bg-foreground/70 text-primary-foreground px-1.5 py-0.5 rounded font-medium backdrop-blur-sm">
                                    #{index + 1}
                                </span>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/90 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                                    title="Remove"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty state */}
            {fields.length === 0 && !uploading && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-2">
                        {icon}
                    </div>
                    <p className="text-sm text-muted-foreground">No videos uploaded yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Supported: MP4, WebM, MOV (max 50 MB each)</p>
                </div>
            )}
        </div>
    );
}
