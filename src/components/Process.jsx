"use client";
import React from 'react';
import { MessageSquareCode, Compass, Paintbrush2, Terminal, MonitorCheck, CloudUpload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Process() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: MessageSquareCode, num: '01',
      title: t('Phân Tích & Tư Vấn', 'Discovery & Strategy'),
      desc: t('Đánh giá bài toán kinh doanh, đề xuất giải pháp công nghệ tối ưu.', 'Evaluate business problems and propose optimal technical solutions.'),
    },
    {
      icon: Compass, num: '02',
      title: t('Kiến Trúc Hệ Thống', 'System Architecture'),
      desc: t('Lên cấu trúc dữ liệu, sơ đồ người dùng và nền tảng công nghệ lõi.', 'Map out data structures, user flows, and core technology stack.'),
    },
    {
      icon: Paintbrush2, num: '03',
      title: t('Thiết Kế UI/UX', 'UI/UX Design'),
      desc: t('Thiết kế giao diện tinh gọn, tập trung vào khả năng chuyển đổi và giữ chân khách hàng.', 'Design clean interfaces focused on conversion and customer retention.'),
    },
    {
      icon: Terminal, num: '04',
      title: t('Phát Triển & Lập Trình', 'Development'),
      desc: t('Viết mã nguồn sạch, bảo mật, đáp ứng chuẩn hiệu năng khắt khe nhất.', 'Write clean, secure code meeting the strictest performance standards.'),
    },
    {
      icon: MonitorCheck, num: '05',
      title: t('Kiểm Thử Chất Lượng', 'QA & Testing'),
      desc: t('Kiểm thử đa luồng trên nhiều thiết bị để đảm bảo tính ổn định tuyệt đối.', 'Multi-thread testing across devices to ensure absolute stability.'),
    },
    {
      icon: CloudUpload, num: '06',
      title: t('Triển Khai & Bàn Giao', 'Deployment & Handoff'),
      desc: t('Vận hành lên server thực tế, đào tạo sử dụng và bảo trì hệ thống dài hạn.', 'Deploy to production, provide training and long-term maintenance.'),
    },
  ];

  return (
    <section id="process" className="border-t border-slate-200/60" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Quy Trình Triển Khai', 'Implementation Process')}</h2>
          <div className="section-divider" />
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
            {t(
              'Phương pháp làm việc chuyên nghiệp, minh bạch và cam kết chất lượng đầu ra.',
              'A professional, transparent methodology with guaranteed output quality.'
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm card-hover text-left">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <step.icon size={18} />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-blue-600/60 tracking-widest">{step.num}</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-0.5 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
