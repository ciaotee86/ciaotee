import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

async function checkAuth(request) {
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookies(cookieHeader);
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  );
}

// PUT /api/projects/[id] — Update project (admin only)
export async function PUT(request, { params }) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

    let body;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ data: { id, ...parsed.data, updated_at: new Date().toISOString() }, mock: true });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] — Delete project (admin only)
export async function DELETE(request, { params }) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing project ID' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, mock: true });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
