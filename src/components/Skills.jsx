"use client";
import React from 'react';
import { LayoutTemplate, Code2, Database, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Skills() {
  const { t } = useLanguage();

  const skillCards = [
    {
      icon: LayoutTemplate, color: 'text-blue-600 bg-blue-50 border-blue-100',
      title: t('Thiết kế', 'Design'),
      skills: ['Wireframe', 'UI Layout', 'Responsive Design', 'Figma'],
    },
    {
      icon: Code2, color: 'text-violet-600 bg-violet-50 border-violet-100',
      title: 'Frontend',
      skills: ['HTML', 'CSS', 'JavaScript', 'React / Next.js'],
    },
    {
      icon: Database, color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: t('Backend cơ bản', 'Backend Basic'),
      skills: ['Node.js / Django', 'MySQL', 'CRUD', t('Auth cơ bản', 'Basic Auth')],
    },
    {
      icon: Wrench, color: 'text-slate-600 bg-slate-50 border-slate-200',
      title: t('Công cụ', 'Tools'),
      skills: ['GitHub', 'VS Code', t('AI Tools', 'AI Tools'), t('Deploy cơ bản', 'Deploy')],
    },
  ];

  return (
    <section id="skills" className="border-t border-slate-200/60" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-heading">{t('Chuyên Môn & Công Nghệ', 'Expertise & Tech Stack')}</h2>
          <div className="section-divider" />
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
            {t(
              'Hệ sinh thái công nghệ hiện đại giúp đảm bảo hiệu năng, bảo mật và khả năng mở rộng cho mọi dự án.',
              'A modern tech ecosystem ensuring performance, security, and scalability for every project.'
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillCards.map((card, i) => (
            <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm card-hover text-left">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-4 font-mono">{card.title}</h3>
              <ul className="space-y-2.5">
                {card.skills.map(skill => (
                  <li key={skill} className="text-xs text-slate-600 font-medium flex items-center gap-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
