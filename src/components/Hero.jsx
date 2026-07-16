"use client";

import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t, language } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center pt-[72px] overflow-hidden bg-bg"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0ms' }}>
              <div className="w-2 h-2 bg-blue-600 rotate-45" />
              <span className="font-mono text-[10px] md:text-xs font-semibold tracking-widest text-slate-500 uppercase">
                {t('Web Designer & Developer · Sẵn sàng nhận dự án', 'Web Designer & Developer · Available for selected projects')}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-display font-medium text-slate-900 leading-[1.05] tracking-tight">
                {language === 'vi' ? (
                  <>Tôi biến những tín hiệu kinh doanh <i className="text-slate-400">rời rạc</i> thành các trải nghiệm số <span className="text-blue-600 not-italic">rõ ràng</span>.</>
                ) : (
                  <>I turn scattered business signals into <span className="text-blue-600">clear</span> digital experiences.</>
                )}
              </h1>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-sans animate-fade-up" style={{ animationDelay: '200ms' }}>
              {t(
                'Tôi thiết kế và xây dựng các website thực dụng cho các doanh nghiệp nhỏ, giúp họ dễ dàng được tìm thấy, được thấu hiểu và kết nối với khách hàng.',
                'I design and build practical websites for small businesses that need to be found, understood, and contacted.'
              )}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              <button onClick={() => scrollTo('projects')} className="group flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-mono text-sm font-semibold border border-slate-900 hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer">
                {t('Khám phá Ghi chép', 'Explore Field Notes')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo('contact')} className="flex items-center justify-center px-6 py-3 bg-transparent text-slate-900 font-mono text-sm font-semibold border border-slate-300 hover:border-slate-900 transition-all cursor-pointer">
                {t('Bắt đầu dự án', 'Start a Project')}
              </button>
            </div>
          </div>

          {/* Right — Signal Map */}
          <div className="lg:col-span-5 relative flex items-center justify-center animate-fade-up" style={{ animationDelay: '500ms' }}>
            <div className="flex flex-col items-center relative w-full max-w-sm">
              {/* Signals coming in */}
              <div className="flex justify-between w-full mb-2 relative px-4">
                 <div className="flex flex-col items-center gap-3">
                   <span className="font-mono text-[10px] text-slate-500 text-center max-w-[80px]">{t('Không có website', 'No website')}</span>
                   <div className="w-px h-24 bg-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-8 bg-slate-400 animate-[slideDown_2.5s_ease-in-out_infinite]" />
                   </div>
                 </div>
                 <div className="flex flex-col items-center gap-3 mt-8">
                   <span className="font-mono text-[10px] text-slate-500 text-center max-w-[80px]">{t('Thông tin rối rắm', 'Confusing information')}</span>
                   <div className="w-px h-16 bg-slate-200 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-8 bg-slate-400 animate-[slideDown_2s_ease-in-out_infinite_0.5s]" />
                   </div>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                   <span className="font-mono text-[10px] text-slate-500 text-center max-w-[80px]">{t('Khó liên hệ', 'Difficult contact')}</span>
                   <div className="w-px h-24 bg-slate-200 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-8 bg-slate-400 animate-[slideDown_2.2s_ease-in-out_infinite_1s]" />
                   </div>
                 </div>
              </div>
              
              {/* The Tee Diamond Marker */}
              <div className="z-10 bg-bg p-3 flex flex-col items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rotate-45" />
              </div>

              {/* Clear outcome going out */}
              <div className="w-px h-24 bg-blue-600 relative overflow-hidden flex justify-center -mt-3">
                <div className="absolute top-0 w-1 h-12 bg-blue-300 blur-[1px] animate-[slideDown_2s_ease-in-out_infinite_1.5s]" />
              </div>
              
              <div className="mt-0 border-l border-r border-b border-blue-600/30 bg-blue-50/50 px-8 py-5 text-center relative w-full">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
                <span className="font-mono text-xs font-semibold text-blue-700 tracking-tight uppercase">
                  {t('Website rõ ràng, hữu dụng', 'A clear, useful website')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollTo('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          aria-label="Scroll down"
        >
          <div className="w-px h-8 bg-slate-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-slate-500 animate-[slideDown_1.5s_ease-in-out_infinite]" />
          </div>
        </button>
      </div>
    </section>
  );
}
