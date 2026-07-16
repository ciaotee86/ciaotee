"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { id: 'home', prefix: '/00', labelVi: 'Giới thiệu', labelEn: 'Introduction' },
    { id: 'projects', prefix: '/01', labelVi: 'Ghi chép', labelEn: 'Field Notes' },
    { id: 'skills', prefix: '/02', labelVi: 'Công cụ', labelEn: 'Build Kit' },
    { id: 'services', prefix: '/03', labelVi: 'Dịch vụ', labelEn: 'Services' },
    { id: 'process', prefix: '/04', labelVi: 'Quy trình', labelEn: 'Method' },
    { id: 'contact', prefix: '/05', labelVi: 'Bắt đầu', labelEn: 'Start' },
  ];

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > 20);

    const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
    const scrollPos = scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i] && scrollPos >= sections[i].offsetTop) {
        setActiveSection(sections[i].id);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo / Signal Marker */}
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {/* Blue Diamond Marker */}
          <div className="w-4 h-4 bg-blue-600 rotate-45 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300 shadow-sm" />
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight italic">Tee</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 mr-1.5 opacity-70 group-hover:opacity-100">{item.prefix}</span>
              {language === 'vi' ? item.labelVi : item.labelEn}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rotate-45" />
              )}
            </button>
          ))}
        </nav>

        {/* Lang Toggle + Mobile */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/50 hover:bg-white text-xs font-bold font-mono transition-all duration-200 cursor-pointer shadow-sm"
            title={t('Chuyển sang Tiếng Anh', 'Switch to Vietnamese')}
          >
            <Globe size={11} className="text-slate-400" />
            <span className={language === 'vi' ? 'text-blue-600' : 'text-slate-400'}>VI</span>
            <span className="text-slate-300 font-light">/</span>
            <span className={language === 'en' ? 'text-blue-600' : 'text-slate-400'}>EN</span>
          </button>

          {/* Mobile Lang */}
          <button
            onClick={toggleLanguage}
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded border border-slate-200 bg-white/50 text-[10px] font-bold font-mono cursor-pointer"
          >
            <span className={language === 'vi' ? 'text-blue-600' : 'text-slate-400'}>VI</span>
            <span className="text-slate-300">/</span>
            <span className={language === 'en' ? 'text-blue-600' : 'text-slate-400'}>EN</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 py-4 px-6 flex flex-col gap-1 shadow-lg animate-slide-down">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 mr-2">{item.prefix}</span>
              {language === 'vi' ? item.labelVi : item.labelEn}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
