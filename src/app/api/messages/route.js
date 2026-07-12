import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
