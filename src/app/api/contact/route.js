import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { sanitizeHtml } from '@/lib/validations'; // Assuming validations.js has something, or we'll just trim

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // Insert into messages table
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          status: 'unread'
        }
      ])
      .select();

    if (error) {
      console.error('Contact submission error:', error);
      return NextResponse.json({ error: 'Không thể gửi tin nhắn lúc này' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Contact submission exception:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
