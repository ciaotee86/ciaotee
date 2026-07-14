"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { Github } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

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
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProjects, setExpandedProjects] = useState(new Set());
  const ITEMS_PER_PAGE = 3;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      const normalizedData = (json.data || []).map(p => ({
        ...p,
        normalizedCategory: p.category ? p.category.toLowerCase().trim().replace(/\s+/g, '_') : 'other'
      }));
      setAllProjects(normalizedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // Compute dynamic categories from fetched projects
  const uniqueCategories = Array.from(new Set(allProjects.map(p => p.normalizedCategory).filter(Boolean)));
  const categories = ['all', ...uniqueCategories];

  const toggleExpand = (id) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1); // Reset page on category change
  };

  const projectsToDisplay = activeCategory === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.normalizedCategory === activeCategory);

  const totalPages = Math.ceil(projectsToDisplay.length / ITEMS_PER_PAGE);
  const paginatedProjects = projectsToDisplay.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section id="projects" className="border-t border-slate-200/60" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="section-heading">{t('Dự án tiêu biểu', 'Selected Projects')}</h2>
            <div className="section-divider" />
            <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
              {t(
                'Những sản phẩm số được thiết kế tỉ mỉ, tối ưu hóa hiệu năng và mang lại kết quả thực tế.',
                'Meticulously designed digital products, optimized for performance and real-world results.'
              )}
            </p>
          </Reveal>
        </div>

        {/* Category Filter */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => {
              const predefinedLabel = CATEGORY_LABELS[cat];
              // Use predefined label if exists, else format the raw string (e.g. "my_app" -> "My App")
              const displayLabel = predefinedLabel 
                ? predefinedLabel[language] 
                : cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </Reveal>

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

        {!loading && !error && projectsToDisplay.length === 0 && (
          <div className="text-center py-16">
            <Sparkles size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">{t('Chưa có dự án nào.', 'No projects yet.')}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && paginatedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project, i) => {
              const title = language === 'vi' ? project.title_vi : project.title_en;
              const description = language === 'vi' ? project.description_vi : project.description_en;
              const catLabel = CATEGORY_LABELS[project.normalizedCategory];
              const statusInfo = STATUS_BADGE[project.status] || STATUS_BADGE.coming_soon;
              const isLive = project.status === 'published' && project.demo_url;

              return (
                <Reveal key={project.id} delay={0.2 + (i * 0.1)}>
                  <article className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm card-hover flex flex-col h-full">
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
                            {catLabel ? catLabel[language] : project.normalizedCategory.replace(/_/g, ' ')}
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
                      {catLabel ? catLabel[language] : project.normalizedCategory.replace(/_/g, ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">{title}</h3>
                    <div className="flex-1 flex flex-col items-start justify-start">
                      <p className={`text-slate-500 text-xs leading-relaxed transition-all duration-300 ${expandedProjects.has(project.id) ? '' : 'line-clamp-3'}`}>
                        {description}
                      </p>
                      {description.length > 120 && (
                        <button 
                          onClick={() => toggleExpand(project.id)}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 mt-1"
                        >
                          {expandedProjects.has(project.id) 
                            ? (language === 'vi' ? 'Thu gọn' : 'Show less') 
                            : (language === 'vi' ? 'Xem thêm' : 'Read more')}
                        </button>
                      )}
                    </div>

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
              </Reveal>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(idx + 1);
                  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110'
                    : 'bg-white text-slate-500 border border-slate-200/60 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
