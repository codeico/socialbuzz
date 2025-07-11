import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, getPublicUrl } from '@/lib/supabase';
import { withAuth } from '@/lib/middleware';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export const POST = withAuth(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 5MB)' },
        { status: 400 },
      );
    }

    // Generate filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${req.user.id}/${timestamp}.${extension}`;

    // Determine bucket based on type
    const bucket = type === 'avatar' ? 'AVATARS' : 'UPLOADS';

    // Upload file
    const uploadResult = await uploadFile(file, bucket, filename);
    const publicUrl = getPublicUrl(bucket, filename);

    return NextResponse.json({
      success: true,
      data: {
        filename,
        originalName: file.name,
        mimetype: file.type,
        size: file.size,
        url: publicUrl,
        path: uploadResult.path,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 },
    );
  }
});
