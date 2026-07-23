import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'analytics.json');

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  );
}

// Local File Fallback Helper
function getLocalData() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE_PATH)) {
      const initial = { totalViews: 0, uniqueVisitors: 0 };
      fs.writeFileSync(FILE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  } catch (e) {
    return { totalViews: 0, uniqueVisitors: 0 };
  }
}

function saveLocalData(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // Ignore read-only filesystem errors on serverless deployment
  }
}

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('site_analytics')
        .select('total_views, unique_visitors')
        .eq('id', 'main_stats')
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({
          totalViews: data.total_views || 0,
          uniqueVisitors: data.unique_visitors || 0
        });
      }
    } catch (e) {
      console.warn('Supabase analytics fetch error, falling back to local storage:', e);
    }
  }

  const local = getLocalData();
  return NextResponse.json({ totalViews: local.totalViews, uniqueVisitors: local.uniqueVisitors || local.totalViews });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const isNewVisitor = !!body.isNewVisitor;

  let newTotal = 0;
  let newUnique = 0;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      // Fetch current stats from Supabase
      const { data } = await supabase
        .from('site_analytics')
        .select('total_views, unique_visitors')
        .eq('id', 'main_stats')
        .maybeSingle();

      const currentTotal = data?.total_views || 0;
      const currentUnique = data?.unique_visitors || 0;

      newTotal = currentTotal + 1;
      newUnique = isNewVisitor ? currentUnique + 1 : currentUnique;

      // Upsert stats into Supabase table site_analytics
      await supabase
        .from('site_analytics')
        .upsert({
          id: 'main_stats',
          total_views: newTotal,
          unique_visitors: newUnique,
          updated_at: new Date().toISOString()
        });

      return NextResponse.json({ success: true, totalViews: newTotal, uniqueVisitors: newUnique });
    } catch (e) {
      console.warn('Supabase analytics update failed, using local storage fallback:', e);
    }
  }

  // Fallback to local storage (for local development or offline mode)
  const local = getLocalData();
  local.totalViews = (local.totalViews || 0) + 1;
  if (isNewVisitor) {
    local.uniqueVisitors = (local.uniqueVisitors || 0) + 1;
  }
  saveLocalData(local);

  return NextResponse.json({ success: true, totalViews: local.totalViews, uniqueVisitors: local.uniqueVisitors });
}
