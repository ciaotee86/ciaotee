"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Skills() {
  const { t, language } = useLanguage();

  const buildKit = [
    {
      group: t('Làm cho rõ ràng', 'Make it clear'),
      items: [
        t('Cấu trúc thông tin', 'Information hierarchy'),
        t('Thiết kế UI/UX', 'UI structure & Wireframes'),
        t('Responsive Design', 'Responsive design'),
        t('Hệ thống màu sắc & Typography', 'Typography & Color systems'),
      ],
    },
    {
      group: t('Làm cho hoạt động', 'Make it work'),
      items: [
        t('React & Next.js', 'React & Next.js'),
        t('Tương tác form', 'Forms & validations'),
        t('Luồng đặt lịch & liên hệ', 'Booking & contact flows'),
        t('Xử lý dữ liệu cơ bản', 'Basic CRUD operations'),
      ],
    },
    {
      group: t('Đưa lên thực tế', 'Make it live'),
      items: [
        t('Triển khai (Vercel, Netlify)', 'Deployment (Vercel, Netlify)'),
        t('Tên miền & DNS', 'Domains & DNS'),
        t('Tối ưu SEO cơ bản', 'Basic SEO & Metadata'),
        t('Tốc độ tải trang', 'Performance optimization'),
      ],
    },
    {
      group: t('Dễ dàng bảo trì', 'Make it maintainable'),
      items: [
        t('Quản lý mã nguồn (Git)', 'GitHub & Version control'),
        t('Cấu trúc component gọn gàng', 'Organized components'),
        t('Bàn giao thiết kế', 'Design handoff'),
        t('Tài liệu hướng dẫn', 'Documentation'),
      ],
    },
  ];

  return (
    <section id="skills" className="border-t border-border bg-bg py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 animate-fade-up">
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
            {t('Công cụ', 'Build Kit')}
          </h2>
          <p className="mt-6 text-slate-600 text-sm max-w-lg font-sans">
            {t(
              'Danh mục các phương pháp và công nghệ tôi sử dụng để biến tín hiệu từ ý tưởng thành một sản phẩm hoạt động trơn tru.',
              'An index of methods and technologies used to turn signals from ideas into fully functioning products.'
            )}
          </p>
        </div>

        <div className="border border-border bg-white divide-y divide-border animate-fade-up" style={{ animationDelay: '200ms' }}>
          {buildKit.map((section, i) => (
            <div key={i} className="flex flex-col md:flex-row group">
              {/* Left: Group Label */}
              <div className="md:w-1/3 p-6 md:p-8 bg-slate-50/50 border-b md:border-b-0 md:border-r border-border flex items-center">
                <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-slate-900 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rotate-45 opacity-50 group-hover:opacity-100 transition-opacity" />
                  {section.group}
                </h3>
              </div>
              
              {/* Right: Items */}
              <div className="md:w-2/3 p-6 md:p-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] text-slate-400 pt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="text-sm text-slate-600 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
