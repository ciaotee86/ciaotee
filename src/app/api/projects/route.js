import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

// Mock data for when Supabase is not configured
const MOCK_PROJECTS = [
  {
    id: '1',
    title_vi: 'Website quán cà phê',
    title_en: 'Coffee Shop Website',
    description_vi: 'Website giới thiệu quán cà phê, menu, hình ảnh không gian và form liên hệ.',
    description_en: 'Website introducing a coffee shop, menu, space gallery, and contact form.',
    category: 'landing_page',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    thumbnail_url: null,
    demo_url: null,
    github_url: null,
    status: 'coming_soon',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title_vi: 'Website bán nông sản',
    title_en: 'Agricultural Produce Web',
    description_vi: 'Website giới thiệu sản phẩm nông sản, danh sách sản phẩm và giỏ hàng cơ bản.',
    description_en: 'Web store showcasing agricultural products, product catalogs, and basic cart features.',
    category: 'ecommerce',
    technologies: ['React', 'Tailwind CSS', 'MySQL'],
    thumbnail_url: null,
    demo_url: null,
    github_url: null,
    status: 'coming_soon',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title_vi: 'Dashboard quản lý',
    title_en: 'Admin Dashboard',
    description_vi: 'Giao diện quản lý sản phẩm, đơn hàng, khách hàng và thống kê cơ bản.',
    description_en: 'Management interface for products, orders, clients, and basic analytics.',
    category: 'dashboard',
    technologies: ['React', 'Chart.js', 'Node.js'],
    thumbnail_url: null,
    demo_url: null,
    github_url: null,
    status: 'coming_soon',
    featured: true,
    created_at: new Date().toISOString(),
  },
];

// Check if Supabase is configured
function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  );
}

// GET /api/projects — Public, returns published projects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    if (!isSupabaseConfigured()) {
      // Return mock data
      let data = MOCK_PROJECTS;
      if (category) data = data.filter(p => p.category === category);
      if (featured === 'true') data = data.filter(p => p.featured);
      return NextResponse.json({ data, mock: true });
    }

    const supabase = createAdminClient();
    let query = supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (featured === 'true') query = query.eq('featured', true);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects — Admin only
export async function POST(request) {
  try {
    // Auth check
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookies(cookieHeader);
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ 
        data: { id: Date.now().toString(), ...parsed.data, created_at: new Date().toISOString() },
        mock: true 
      }, { status: 201 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .insert([parsed.data])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
