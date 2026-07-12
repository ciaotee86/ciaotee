"use client";
import React from 'react';
import { Layout, Smartphone, Cpu, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const highlights = [
    { icon: Layout, title: t('Clean UI', 'Clean UI'), desc: t('Giao diện tinh tế, tập trung UX', 'Refined interface, UX-focused') },
    { icon: Smartphone, title: t('Responsive', 'Responsive'), desc: t('Hoàn hảo trên mọi thiết bị', 'Perfect on every device') },
    { icon: Cpu, title: t('Web Dev', 'Web Dev'), desc: t('Code sạch, tối ưu hiệu năng', 'Clean code, optimized performance') },
    { icon: Zap, title: t('AI Workflow', 'AI Workflow'), desc: t('Tích hợp AI vào quy trình', 'AI-integrated workflow') },
  ];

  return (
    <section id="about" className="border-t border-slate-200/60 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Về tôi', 'About Me')}</h2>
          <div className="section-divider" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5 space-y-5 text-left">
            <p className="text-slate-700 leading-relaxed font-medium">
              {t(
                'Tôi là sinh viên Công nghệ thông tin, đang tập trung phát triển kỹ năng thiết kế giao diện website, lập trình web và ứng dụng AI vào quy trình làm việc.',
                'I am an IT student focused on web UI design, frontend development, and integrating AI tools into workflows.'
              )}
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t(
                'Tôi quan tâm đến bố cục rõ ràng, giao diện thân thiện, responsive chuẩn chỉ và cấu trúc code dễ mở rộng.',
                'I care about clear layouts, user-friendly interfaces, proper responsiveness, and scalable code structure.'
              )}
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl card-hover text-left">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <item.icon size={17} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
