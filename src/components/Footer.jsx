"use client";
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { id: 'home', vi: 'Giới thiệu', en: 'Introduction' },
    { id: 'projects', vi: 'Ghi chép', en: 'Field Notes' },
    { id: 'skills', vi: 'Công cụ', en: 'Build Kit' },
    { id: 'services', vi: 'Dịch vụ', en: 'Services' },
    { id: 'process', vi: 'Phương pháp', en: 'Method' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-950 font-mono text-xs pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-800 pb-12 mb-8">
          
          {/* Identity */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-600 rotate-45" />
              <span className="font-display font-medium text-lg text-white italic tracking-widest">Tee</span>
            </div>
            <p className="text-slate-500 uppercase tracking-widest leading-relaxed">
              {t('Ghi chép về thiết kế và xây dựng kỹ thuật số.', 'Digital design and build field notes.')}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-slate-300 uppercase tracking-widest">{t('Hệ thống hoạt động', 'System Online')}</span>
            </div>
          </div>

          {/* Directory */}
          <div className="md:col-span-4">
            <h4 className="text-slate-300 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3">{t('Danh mục', 'Directory')}</h4>
            <ul className="space-y-3">
              {navLinks.map((link, idx) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer group uppercase tracking-widest"
                  >
                    <span className="text-slate-700 group-hover:text-blue-600">0{idx}</span>
                    {t(link.vi, link.en)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Action */}
          <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end h-full">
            <div className="flex flex-col items-start md:items-end gap-2 w-full">
               <h4 className="text-slate-300 uppercase tracking-widest mb-4 w-full border-b border-slate-800 pb-3 text-left md:text-right">{t('Bắt đầu', 'Start')}</h4>
               <button onClick={() => scrollTo('contact')} className="text-blue-500 hover:text-white hover:underline uppercase tracking-widest">
                 {t('Gửi tín hiệu', 'Transmit')}
               </button>
            </div>
            
            <button
              onClick={scrollTop}
              className="mt-12 md:mt-0 flex items-center gap-2 text-slate-500 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
            >
              <ArrowUp size={14} />
              {t('Đỉnh', 'Top')}
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} TEE. {t('Tất cả quyền được bảo lưu.', 'ALL RIGHTS RESERVED.')}</span>
          <span>{t('Xây dựng với', 'BUILT ON')} NEXT.JS & TAILWIND</span>
        </div>

      </div>
    </footer>
  );
}
