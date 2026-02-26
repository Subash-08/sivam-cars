import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError, AuthError } from '@/lib/adminGuard';
import { v2 as cloudinary } from 'cloudinary';

// ─── Cloudinary config ────────────────────────────────────────────────────────

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Constants (server-enforced — frontend validation is not security) ────────

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;   // 2 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50 MB

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALL_MIME_TYPES = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES];

const ALLOWED_FOLDERS = ['brands', 'cars'] as const;
type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

// ─── POST /api/admin/upload ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        // Auth — must be signed-in admin
        await requireAdmin();

        const formData = await request.formData();
        const file = formData.get('file');
        const folder = (formData.get('folder') ?? 'brands') as UploadFolder;

        // ── Validate folder (whitelist — never trust client) ──────────────────────
        if (!ALLOWED_FOLDERS.includes(folder)) {
            return NextResponse.json(
                { success: false, error: 'Invalid upload folder' },
                { status: 400 },
            );
        }

        // ── Validate file presence ────────────────────────────────────────────────
        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 },
            );
        }

        // ── Detect resource type ──────────────────────────────────────────────────
        const isVideo = VIDEO_MIME_TYPES.includes(file.type);
        const isImage = IMAGE_MIME_TYPES.includes(file.type);

        if (!isVideo && !isImage) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, SVG, MP4, WebM, MOV' },
                { status: 400 },
            );
        }

        // ── Server-enforced MIME type validation ──────────────────────────────────
        if (!ALL_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type' },
                { status: 400 },
            );
        }

        // ── Server-enforced size validation (different limits per type) ───────────
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: `File too large. Max size is ${maxSize / 1024 / 1024} MB for ${isVideo ? 'videos' : 'images'}` },
                { status: 400 },
            );
        }

        // ── Convert to Buffer for Cloudinary upload stream ────────────────────────
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ── Upload to Cloudinary ──────────────────────────────────────────────────
        const resourceType = isVideo ? 'video' : 'image';

        const result = await new Promise<{ secure_url: string; public_id: string }>(
            (resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: `sivamcars/${folder}`,
                        resource_type: resourceType,
                        ...(isImage
                            ? {
                                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
                                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                            }
                            : {
                                allowed_formats: ['mp4', 'webm', 'mov'],
                            }),
                    },
                    (error, result) => {
                        if (error || !result) return reject(error ?? new Error('Upload failed'));
                        resolve({ secure_url: result.secure_url, public_id: result.public_id });
                    },
                );
                stream.end(buffer);
            },
        );

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            resourceType,
        });

    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[POST /api/admin/upload]', error);
        return NextResponse.json(
            { success: false, error: 'Upload failed — please try again' },
            { status: 500 },
        );
    }
}

// ─── DELETE /api/admin/upload ─────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
    try {
        await requireAdmin();
        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json(
                { success: false, error: 'publicId is required' },
                { status: 400 }
            );
        }

        const result = await cloudinary.uploader.destroy(publicId);

        return NextResponse.json({ success: true, result });
    } catch (error: unknown) {
        if (isAuthError(error)) {
            return NextResponse.json(
                { success: false, error: (error as AuthError).message },
                { status: (error as AuthError).status },
            );
        }
        console.error('[DELETE /api/admin/upload]', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
