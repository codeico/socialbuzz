import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Generate filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${decoded.userId}/${timestamp}.${extension}`;

    // Determine bucket based on type
    const bucketName = type === 'avatar' ? 'avatars' : 'uploads';

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload file using supabaseAdmin
    const { data, error } = await supabaseAdmin.storage.from(bucketName).upload(filename, fileBuffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ success: false, error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      data: {
        filename,
        originalName: file.name,
        mimetype: file.type,
        size: file.size,
        url: urlData.publicUrl,
        path: data.path,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
