"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t, language } = useLanguage();

  const principles = [
    { num: '01', text: t('Hiểu rõ vấn đề cốt lõi', 'Understand the real problem') },
    { num: '02', text: t('Làm rõ hành động tiếp theo', 'Make the next action obvious') },
    { num: '03', text: t('Thiết kế cho mọi màn hình', 'Design for every screen') },
    { num: '04', text: t('Chỉ xây dựng những gì hữu dụng', 'Build only what is useful') },
  ];

  return (
    <section id="about" className="border-t border-border bg-surface py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column - Large Statement */}
          <div className="md:w-1/2 animate-fade-up">
            <h2 className="font-display text-4xl lg:text-5xl font-medium leading-[1.2] text-slate-900 tracking-tight">
              {language === 'vi' ? (
                <>Rõ ràng trước khi <br/><span className="text-slate-400 italic font-normal">trang trí.</span><br/>Mục đích trước khi <br/><span className="text-blue-600 italic font-normal">công nghệ.</span></>
              ) : (
                <>Clarity before <br/><span className="text-slate-400 italic font-normal">decoration.</span><br/>Purpose before <br/><span className="text-blue-600 italic font-normal">technology.</span></>
              )}
            </h2>
          </div>

          {/* Right Column - Text & Principles */}
          <div className="md:w-1/2 space-y-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              {/* Marginal note / annotation */}
              <div className="absolute -left-12 top-0 hidden xl:flex flex-col items-center gap-2 text-slate-400">
                <div className="w-px h-8 bg-slate-300"></div>
                <span className="font-mono text-[10px] uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>Note</span>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed font-sans">
                {t(
                  'Tôi sử dụng thiết kế và công nghệ để làm cho thông tin kinh doanh trở nên dễ hiểu và dễ thao tác. Mỗi giao diện đều bắt đầu từ vấn đề, hành trình của người dùng và hành động mà website cần hỗ trợ.',
                  'I use design and technology to make business information easier to understand and act on. Every interface begins with the problem, the user journey, and the action the website needs to support.'
                )}
              </p>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '400ms' }}>
              <h3 className="font-mono text-xs font-semibold text-slate-900 tracking-widest uppercase border-b border-border pb-3 mb-6">
                {t('Nguyên tắc làm việc', 'Working principles')}
              </h3>
              <ul className="space-y-4">
                {principles.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-4 group">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 border border-blue-100 rounded-sm">{p.num}</span>
                    <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors pt-0.5">{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
