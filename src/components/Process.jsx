"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Process() {
  const { t } = useLanguage();

  const steps = [
    { num: '01', title: t('Thu thập tín hiệu', 'Signal Gathering'), desc: t('Đánh giá bài toán kinh doanh và xác định mục tiêu cốt lõi cần giải quyết.', 'Evaluate the business problem and define the core objective.') },
    { num: '02', title: t('Kiến trúc luồng', 'Flow Architecture'), desc: t('Lên cấu trúc thông tin và hành trình người dùng trước khi vẽ bất kỳ giao diện nào.', 'Map out information structure and user journeys before drawing any interfaces.') },
    { num: '03', title: t('Thiết kế giao diện', 'Interface Design'), desc: t('Chuyển đổi luồng thông tin thành giao diện trực quan, rõ ràng và tập trung vào chuyển đổi.', 'Translate flows into visual interfaces that are clear and conversion-focused.') },
    { num: '04', title: t('Phát triển', 'Development (Build)'), desc: t('Xây dựng hệ thống bằng React, Next.js với hiệu năng cao và code gọn gàng.', 'Build the system using React, Next.js with high performance and clean code.') },
    { num: '05', title: t('Kiểm thử', 'QA & Polish'), desc: t('Đảm bảo mọi thứ hoạt động hoàn hảo trên mọi thiết bị và trình duyệt.', 'Ensure everything works perfectly across all devices and browsers.') },
    { num: '06', title: t('Ra mắt', 'Launch & Handoff'), desc: t('Đưa sản phẩm lên môi trường thực tế và hướng dẫn sử dụng chi tiết.', 'Deploy to production and provide detailed handoff documentation.') },
  ];

  return (
    <section id="process" className="border-t border-border bg-bg py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 md:mb-24 text-center animate-fade-up">
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
            {t('Phương pháp làm việc', 'Working Method')}
          </h2>
          <p className="mt-6 text-slate-600 text-sm max-w-lg mx-auto font-sans">
            {t(
              'Một quy trình tuyến tính biến tín hiệu ban đầu thành một sản phẩm số hoàn chỉnh, sẵn sàng ra mắt.',
              'A linear process translating initial signals into a complete, launch-ready digital product.'
            )}
          </p>
        </div>

        <div className="relative">
          {/* Vertical Signal Line */}
          <div className="absolute left-[15px] md:left-[23px] top-0 bottom-0 w-px bg-slate-200">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-600 to-transparent animate-[slideDown_3s_ease-in-out_infinite]" />
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="relative pl-12 md:pl-20 animate-fade-up" style={{ animationDelay: `${(i+1)*100}ms` }}>
                {/* Marker */}
                <div className="absolute left-[11px] md:left-[19px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-blue-600 rotate-45 z-10 transition-transform duration-300 hover:scale-150 hover:bg-blue-600" />
                
                <div className="group cursor-default">
                   <div className="flex items-center gap-4 mb-2">
                     <span className="font-mono text-[10px] text-slate-400 font-bold group-hover:text-blue-600 transition-colors">{step.num}</span>
                     <h3 className="font-display text-xl font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                   </div>
                   <p className="text-sm text-slate-600 leading-relaxed max-w-md font-sans">
                     {step.desc}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
