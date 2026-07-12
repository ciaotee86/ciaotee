"use client";
import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import { Github, Linkedin, Facebook } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { id: 'about', vi: 'Về tôi', en: 'About' },
    { id: 'projects', vi: 'Dự án', en: 'Projects' },
    { id: 'skills', vi: 'Kỹ năng', en: 'Skills' },
    { id: 'services', vi: 'Dịch vụ', en: 'Services' },
    { id: 'process', vi: 'Quy trình', en: 'Process' },
    { id: 'contact', vi: 'Liên hệ', en: 'Contact' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const socials = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Mail, href: 'mailto:your@email.com', label: 'Email' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">T</span>
              <span className="font-bold text-lg text-white">Tee</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t(
                'Tôi thiết kế và xây dựng website hiện đại, responsive và dễ sử dụng.',
                'I design and build modern, responsive, and user-friendly websites.'
              )}
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t('Điều hướng', 'Navigation')}</h4>
            <ul className="grid grid-cols-2 gap-2">
              {navLinks.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-sm hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {t(link.vi, link.en)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top */}
          <div className="md:col-span-3 flex md:justify-end items-start">
            <button
              onClick={scrollTop}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 transition-all duration-200 cursor-pointer"
            >
              <ArrowUp size={12} />
              {t('Lên đầu trang', 'Back to Top')}
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px]">
          <span>© {new Date().getFullYear()} Tee. {t('Tất cả quyền được bảo lưu.', 'All rights reserved.')}</span>
          <span className="text-slate-600">
            {t('Xây dựng với', 'Built with')} Next.js · Tailwind · ☕
          </span>
        </div>
      </div>
    </footer>
  );
}
