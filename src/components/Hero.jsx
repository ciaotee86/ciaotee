"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight, Code2, Layout, Sparkles, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ROLES = ['Web Developer', 'UI Designer', 'Frontend Engineer'];

export default function Hero() {
  const { t, language } = useLanguage();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [projectCount, setProjectCount] = useState(0);

  // Fetch project count
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.length > 0) {
          setProjectCount(data.data.length);
        }
      })
      .catch(err => console.error("Could not fetch project count", err));
  }, []);

  // Typewriter effect for roles
  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timeout;

    if (typing) {
      if (displayed.length < currentRole.length) {
        timeout = setTimeout(() => setDisplayed(currentRole.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setRoleIndex(i => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, roleIndex]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-[72px] gradient-mesh overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 left-0 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '0ms' }}>
              <span className="tag tag-blue"><Layout size={10} />{t('Thiết kế UI/UX', 'UI/UX Architecture')}</span>
              <span className="tag tag-purple"><Code2 size={10} />{t('Kỹ sư Frontend', 'Frontend Engineering')}</span>
              <span className="tag tag-slate"><Sparkles size={10} />{t('Tối ưu Chuyển đổi', 'Conversion Optimization')}</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-500">
                {t('Xin chào, tôi là Tee', "Hi, I'm Tee")}
              </h2>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                {t('Giải pháp web', 'Digital solutions')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  {t('đột phá doanh thu', 'driving growth')}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              {t(
                'Biến tầm nhìn kinh doanh của bạn thành các sản phẩm số vượt trội. Tôi kết hợp tư duy thiết kế và kiến trúc phần mềm hiện đại để tạo ra những trải nghiệm web tốc độ cao, bảo mật và tối ưu tỷ lệ chuyển đổi.',
                'Transforming business visions into exceptional digital products. I combine design thinking with modern software architecture to build fast, secure, and highly converting web experiences.'
              )}
            </p>



            {/* Stats */}
            <div
              className="flex gap-8 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              {[
                { num: projectCount > 0 ? `${projectCount}+` : '0', label: t('Dự án', 'Projects') },
                { num: '100%', label: t('Tận tâm', 'Dedicated') },
                { num: '2+', label: t('Năm kinh nghiệm', 'Years experience') },
              ].map(({ num, label }) => (
                <div key={label} className="text-left">
                  <div className="text-2xl font-black text-slate-900">{num}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              <button onClick={() => scrollTo('contact')} className="btn-primary">
                {t('Liên hệ với tôi', 'Get In Touch')}
                <ArrowRight size={16} />
              </button>
              <button onClick={() => scrollTo('projects')} className="btn-secondary">
                {t('Xem dự án', 'View Projects')}
              </button>
            </div>
          </div>

          {/* Right — Code card */}
          <div className="lg:col-span-5 animate-fade-up animate-float" style={{ animationDelay: '500ms' }}>
            <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200/80">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="font-mono text-[11px] text-slate-400">portfolio.tsx</span>
                <span className="w-12" />
              </div>

              {/* Code content */}
              <div className="p-5 font-mono text-sm leading-relaxed bg-white">
                <div className="flex gap-2 text-slate-400 text-xs mb-4">
                  <span>1</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-violet-500">const</span>
                  <span className="text-blue-600">developer</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-amber-600">{'{'}</span>
                </div>
                <div className="space-y-2 pl-6 text-xs">
                  {[
                    { key: 'name', val: '"Tee"', color: 'text-green-600' },
                    { key: 'role', val: '"Web Developer"', color: 'text-green-600' },
                    { key: 'skills', val: '["React", "Next.js", "UI"]', color: 'text-blue-600' },
                    { key: 'available', val: 'true', color: 'text-orange-500' },
                  ].map(({ key, val, color }) => (
                    <div key={key} className="flex gap-2 text-slate-500">
                      <span className="text-slate-400">{key}:</span>
                      <span className={color}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-amber-600 mt-4 flex items-center gap-2">
                  {'};'}
                  <span className="ml-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-600 text-[10px] font-sans font-medium">
                      {t('Sẵn sàng nhận dự án', 'Available for projects')}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Floating skill badges */}
            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              {['React', 'Next.js', 'Tailwind', 'Figma', 'Node.js'].map(skill => (
                <span key={skill} className="tag tag-slate text-[11px]">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => scrollTo('about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
