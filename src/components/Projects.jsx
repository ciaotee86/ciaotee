"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { Github } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

const CATEGORY_LABELS = {
  all: { vi: 'Tất cả', en: 'All' },
  landing_page: { vi: 'Landing Page', en: 'Landing Page' },
  portfolio: { vi: 'Portfolio', en: 'Portfolio' },
  ecommerce: { vi: 'Thương mại', en: 'E-commerce' },
  dashboard: { vi: 'Dashboard', en: 'Dashboard' },
  web_app: { vi: 'Web App', en: 'Web App' },
  other: { vi: 'Khác', en: 'Other' },
};

const STATUS_BADGE = {
  published: { vi: 'Đã ra mắt', en: 'Live', class: 'tag-green' },
  coming_soon: { vi: 'Sắp ra mắt', en: 'Coming Soon', class: 'tag-slate' },
  draft: { vi: 'Bản nháp', en: 'Draft', class: 'tag-slate' },
};

export default function Projects() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
      const res = await fetch(`/api/projects${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setProjects(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const categories = ['all', ...Object.keys(CATEGORY_LABELS).filter(c => c !== 'all')];

  return (
    <section id="projects" className="border-t border-slate-200/60" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Dự án tiêu biểu', 'Selected Projects')}</h2>
          <div className="section-divider" />
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
            {t(
              'Các dự án tôi đã thực hiện — từ landing page đến web app hoàn chỉnh.',
              "Projects I've built — from landing pages to full web applications."
            )}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.slice(0, 6).map(cat => {
            const labels = CATEGORY_LABELS[cat];
            if (!labels) return null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {language === 'vi' ? labels.vi : labels.en}
              </button>
            );
          })}
        </div>

        {/* States */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
                <div className="skeleton aspect-video" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-1/3 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">{t('Không thể tải dự án.', 'Could not load projects.')}</p>
            <button onClick={fetchProjects} className="btn-secondary gap-2">
              <RefreshCw size={14} />
              {t('Thử lại', 'Retry')}
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-16">
            <Sparkles size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">{t('Chưa có dự án nào.', 'No projects yet.')}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const title = language === 'vi' ? project.title_vi : project.title_en;
              const description = language === 'vi' ? project.description_vi : project.description_en;
              const catLabel = CATEGORY_LABELS[project.category];
              const statusInfo = STATUS_BADGE[project.status] || STATUS_BADGE.coming_soon;
              const isLive = project.status === 'published' && project.demo_url;

              return (
                <article
                  key={project.id}
                  className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm card-hover flex flex-col"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                    {project.thumbnail_url ? (
                      <Image
                        src={project.thumbnail_url}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                        <Sparkles size={28} className="text-blue-400/60" />
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          {catLabel ? (language === 'vi' ? catLabel.vi : catLabel.en) : project.category}
                        </span>
                      </div>
                    )}
                    {/* Featured badge */}
                    {project.featured && (
                      <span className="absolute top-2 left-2 tag tag-blue text-[10px]">
                        ★ {t('Nổi bật', 'Featured')}
                      </span>
                    )}
                    {/* Status badge */}
                    <span className={`absolute top-2 right-2 tag ${statusInfo.class} text-[10px]`}>
                      {language === 'vi' ? statusInfo.vi : statusInfo.en}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 mb-2">
                      {catLabel ? (language === 'vi' ? catLabel.vi : catLabel.en) : project.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">{title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">{description}</p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {(project.technologies || []).map(tech => (
                        <span key={tech} className="tag tag-slate text-[10px]">{tech}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                      {isLive ? (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex-1 text-xs py-2"
                        >
                          <ExternalLink size={12} />
                          Live Demo
                        </a>
                      ) : (
                        <button disabled className="flex-1 px-3 py-2 bg-slate-100 text-slate-400 text-xs font-medium rounded-lg cursor-not-allowed">
                          {language === 'vi' ? statusInfo.vi : statusInfo.en}
                        </button>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary px-3 py-2"
                          title="GitHub"
                        >
                          <Github size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
