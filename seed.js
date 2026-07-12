const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_PROJECTS = [
  {
    title_vi: "Hệ Sinh Thái E-Commerce Tích Hợp Đa Kênh",
    title_en: "Omnichannel E-Commerce Ecosystem",
    description_vi: "Hệ thống thương mại điện tử quy mô lớn với khả năng đồng bộ dữ liệu tồn kho, xử lý hàng ngàn đơn hàng mỗi phút. Được thiết kế với kiến trúc Microservices và giao diện UI/UX tối ưu cho tỷ lệ chuyển đổi.",
    description_en: "Large-scale e-commerce system with inventory synchronization, handling thousands of orders per minute. Designed with Microservices architecture and UI/UX optimized for conversion rates.",
    category: "ecommerce",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Tailwind CSS"],
    thumbnail_url: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
    demo_url: "https://example.com/demo1",
    github_url: "https://github.com",
    status: "published",
    featured: true
  },
  {
    title_vi: "Nền Tảng Quản Trị Khách Hàng (CRM) Tùy Biến",
    title_en: "Customizable Customer Relationship Management (CRM)",
    description_vi: "Dashboard quản trị dữ liệu dành cho doanh nghiệp B2B. Cung cấp báo cáo phân tích theo thời gian thực (Real-time Analytics), phân quyền phức tạp và quy trình tự động hóa workflow.",
    description_en: "Data management dashboard for B2B enterprises. Provides real-time analytics, complex role-based access control, and automated workflow processing.",
    category: "dashboard",
    technologies: ["React", "TypeScript", "Supabase", "Prisma", "Chart.js"],
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    demo_url: "https://example.com/demo2",
    github_url: "https://github.com",
    status: "published",
    featured: true
  },
  {
    title_vi: "Website Nhận Diện Thương Hiệu Startup",
    title_en: "Startup Brand Identity Website",
    description_vi: "Trang đích (Landing Page) giới thiệu sản phẩm công nghệ với hiệu ứng 3D và animation mượt mà. Giúp startup tăng 300% tỷ lệ thu thập email khách hàng tiềm năng.",
    description_en: "Landing Page showcasing a tech product with 3D effects and smooth animations. Helped the startup increase potential customer email collection rate by 300%.",
    category: "landing",
    technologies: ["Next.js", "Framer Motion", "Three.js", "Tailwind CSS"],
    thumbnail_url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1000&auto=format&fit=crop",
    demo_url: "https://example.com/demo3",
    github_url: "https://github.com",
    status: "published",
    featured: true
  }
];

async function seed() {
  console.log("Seeding projects into Supabase...");
  
  // Clean existing (optional, but safe for a fresh DB)
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase
    .from('projects')
    .insert(SEED_PROJECTS)
    .select();

  if (error) {
    console.error("Error inserting projects:", error);
  } else {
    console.log(`Successfully inserted ${data.length} professional projects.`);
  }
}

seed();
