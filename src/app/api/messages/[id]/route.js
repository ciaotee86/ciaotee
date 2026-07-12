import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('messages')
      .update({ status: body.status })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
