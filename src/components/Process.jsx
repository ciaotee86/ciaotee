"use client";
import React from 'react';
import { MessageSquareCode, Compass, Paintbrush2, Terminal, MonitorCheck, CloudUpload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Process() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: MessageSquareCode, num: '01',
      title: t('Trao đổi yêu cầu', 'Discuss Requirements'),
      desc: t('Lắng nghe ý tưởng, loại website và mục tiêu của bạn.', 'Listen to your idea, website type, and goals.'),
    },
    {
      icon: Compass, num: '02',
      title: t('Lên kế hoạch', 'Plan & Scope'),
      desc: t('Xác định cấu trúc trang, tính năng chính, công nghệ phù hợp.', 'Define page structure, key features, and appropriate tech stack.'),
    },
    {
      icon: Paintbrush2, num: '03',
      title: t('Thiết kế giao diện', 'UI Design'),
      desc: t('Phác thảo wireframe, thiết kế giao diện, duyệt ý với bạn.', 'Sketch wireframe, design interface, review with you.'),
    },
    {
      icon: Terminal, num: '04',
      title: t('Lập trình', 'Development'),
      desc: t('Xây dựng trang web theo thiết kế đã duyệt, đảm bảo responsive.', 'Build the website from approved design, ensure responsiveness.'),
    },
    {
      icon: MonitorCheck, num: '05',
      title: t('Kiểm tra & Duyệt', 'Testing & Review'),
      desc: t('Kiểm tra đa thiết bị, chỉnh sửa theo phản hồi.', 'Cross-device testing, adjust based on feedback.'),
    },
    {
      icon: CloudUpload, num: '06',
      title: t('Bàn giao & Deploy', 'Handoff & Deploy'),
      desc: t('Deploy lên hosting, bàn giao code và hướng dẫn sử dụng.', 'Deploy to hosting, hand off code with usage guide.'),
    },
  ];

  return (
    <section id="process" className="border-t border-slate-200/60" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Quy trình làm việc', 'Work Process')}</h2>
          <div className="section-divider" />
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
