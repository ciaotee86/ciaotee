import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/validations';
import { randomBytes } from 'crypto';

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  );
}

export async function POST(request) {
  try {
    // Auth check
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}` },
        { status: 415 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    // Generate safe random filename to prevent path traversal
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = `${randomBytes(16).toString('hex')}.${ext}`;
    const uploadPath = `thumbnails/${safeName}`;

    if (!isSupabaseConfigured()) {
      // Return mock URL when Supabase not configured
      return NextResponse.json({
        url: `https://placeholder.supabase.co/storage/v1/object/public/projects/${uploadPath}`,
        path: uploadPath,
        mock: true,
      });
    }

    // Upload to Supabase Storage
    const supabase = createAdminClient();
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('projects')
      .upload(uploadPath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('projects')
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      path: data.path,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


