const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clean() {
  console.log("Cleaning projects from Supabase...");
  
  // Delete all projects that match the titles of the ones we inserted
  const { error } = await supabase
    .from('projects')
    .delete()
    .in('title_vi', [
      'Hệ Sinh Thái E-Commerce Tích Hợp Đa Kênh',
      'Nền Tảng Quản Trị Khách Hàng (CRM) Tùy Biến',
      'Website Nhận Diện Thương Hiệu Startup'
    ]);

  if (error) {
    console.error("Error deleting projects:", error);
  } else {
    console.log("Successfully reverted database back to original empty state.");
  }
}

clean();
