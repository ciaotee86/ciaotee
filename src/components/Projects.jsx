"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, RefreshCw } from 'lucide-react';
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
  published: { vi: 'Đã ra mắt', en: 'Live', class: 'text-green-600 border-green-200 bg-green-50' },
  coming_soon: { vi: 'Sắp ra mắt', en: 'Coming Soon', class: 'text-slate-500 border-slate-200 bg-slate-50' },
  draft: { vi: 'Bản nháp', en: 'Draft', class: 'text-slate-500 border-slate-200 bg-slate-50' },
};

export default function Projects() {
  const { language, t } = useLanguage();
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects?t=${Date.now()}`);
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

  const uniqueCategories = Array.from(new Set(allProjects.map(p => p.normalizedCategory).filter(Boolean)));
  const categories = ['all', ...uniqueCategories];

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
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
    <section id="projects" className="border-t border-border bg-bg py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-up">
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
              {t('Ghi chép', 'Field Notes')}
            </h2>
            <div className="w-12 h-px bg-slate-400 mt-6" />
          </div>
          <p className="text-slate-500 text-sm max-w-sm md:text-right font-sans">
            {t(
              'Ghi chép về quá trình quan sát tín hiệu kinh doanh và chuyển hóa chúng thành các sản phẩm số hữu dụng.',
              'Documenting the process of observing business signals and transforming them into useful digital products.'
            )}
          </p>
        </div>

        {/* Category Filter - Field Index Style */}
        <div className="flex flex-wrap items-center gap-3 mb-16 border-b border-border pb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mr-2">Index:</span>
          {categories.map((cat) => {
            const predefinedLabel = CATEGORY_LABELS[cat];
            const displayLabel = predefinedLabel 
              ? predefinedLabel[language] 
              : cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`font-mono text-xs px-3 py-1.5 transition-all ${
                  activeCategory === cat
                    ? 'text-blue-600 bg-blue-50 border border-blue-200'
                    : 'text-slate-500 hover:text-slate-900 border border-transparent'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-16">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse flex flex-col lg:flex-row gap-8">
                <div className="lg:w-5/12 aspect-[4/3] bg-slate-200" />
                <div className="lg:w-7/12 space-y-4 pt-4">
                  <div className="h-4 w-24 bg-slate-200" />
                  <div className="h-8 w-3/4 bg-slate-200" />
                  <div className="h-24 w-full bg-slate-200 mt-8" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-24 border border-border bg-white">
            <p className="text-slate-500 mb-4 font-mono text-sm">{t('Không thể tải dữ liệu.', 'Could not load data.')}</p>
            <button onClick={fetchProjects} className="px-4 py-2 border border-slate-300 hover:border-slate-900 font-mono text-xs flex items-center gap-2 mx-auto">
              <RefreshCw size={14} />
              {t('Thử lại', 'Retry')}
            </button>
          </div>
        )}

        {/* Projects List */}
        {!loading && !error && (
          <div className="space-y-24">
            {paginatedProjects.map((project, i) => {
              const title = language === 'vi' ? project.title_vi : project.title_en;
              const description = language === 'vi' ? project.description_vi : project.description_en;
              const catLabel = CATEGORY_LABELS[project.normalizedCategory];
              const statusInfo = STATUS_BADGE[project.status] || STATUS_BADGE.coming_soon;
              const isLive = project.status === 'published' && project.demo_url;
              
              // Parse description into Signal/Response/Outcome safely
              let signalText = '';
              let responseText = '';
              let outcomeText = '';
              
              if (description.includes('[SIGNAL]')) {
                signalText = description.match(/\[SIGNAL\]([\s\S]*?)\[RESPONSE\]/)?.[1]?.trim() || '';
                responseText = description.match(/\[RESPONSE\]([\s\S]*?)\[OUTCOME\]/)?.[1]?.trim() || '';
                outcomeText = description.match(/\[OUTCOME\]([\s\S]*)/)?.[1]?.trim() || '';
              } else {
                const parts = description.split('. ');
                signalText = parts[0] + (parts.length > 1 ? '.' : '');
                responseText = parts.slice(1).join('. ') || t('Thiết kế và xây dựng giải pháp đáp ứng yêu cầu.', 'Designed and built a solution meeting the requirements.');
                outcomeText = t('Một trải nghiệm số rõ ràng, phục vụ đúng mục đích của doanh nghiệp.', 'A clear digital experience serving the business purpose.');
              }
              
              const overallIndex = (currentPage - 1) * ITEMS_PER_PAGE + i + 1;

              let domainDisplay = 'portfolio.local';
              if (project.demo_url) {
                try { domainDisplay = new URL(project.demo_url).hostname; } 
                catch (e) { domainDisplay = project.demo_url; }
              }

              return (
                <article key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-fade-up">
                  {/* Thumbnail / Browser Preview */}
                  <div className="lg:col-span-7 flex flex-col group">
                    {/* Top Labels */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="font-mono text-[10px] font-bold text-blue-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rotate-45" />
                        FN–{String(overallIndex).padStart(2, '0')}
                      </div>
                      <span className="text-slate-300">/</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        {project.project_label ? project.project_label : (catLabel ? catLabel[language] : project.normalizedCategory.replace(/_/g, ' '))}
                      </span>
                    </div>

                    {/* Browser Frame */}
                    <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-lg border border-slate-300/80 bg-slate-100 overflow-hidden shadow-sm flex flex-col">
                      {/* Browser Top Bar */}
                      <div className="h-6 bg-slate-200/80 border-b border-slate-300/80 flex items-center px-3 gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-slate-400/80" />
                        <div className="w-2 h-2 rounded-full bg-slate-400/80" />
                        <div className="w-2 h-2 rounded-full bg-slate-400/80" />
                        <div className="flex-1 text-center pr-8">
                          <span className="font-mono text-[9px] text-slate-500 truncate block max-w-full">{domainDisplay}</span>
                        </div>
                      </div>

                      {/* Image Area */}
                      <div className="relative flex-1 w-full bg-white overflow-hidden">
                        {project.thumbnail_url ? (
                          <>
                            <Image
                              src={project.thumbnail_url}
                              alt={title}
                              fill
                              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                              sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-500 z-10 pointer-events-none" />
                            {/* Hover Button (Desktop) */}
                            {isLive && (
                              <div className="absolute inset-0 m-auto w-fit h-fit opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 hidden lg:block">
                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm text-blue-600 rounded-md font-mono text-xs font-bold shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
                                  <span>VIEW PROJECT</span>
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">{t('Không có hình ảnh', 'No image')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-5 flex flex-col justify-center h-full pt-2 lg:pt-[3.25rem] space-y-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`font-mono text-[10px] px-2 py-0.5 border ${statusInfo.class}`}>
                          {language === 'vi' ? statusInfo.vi : statusInfo.en}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-medium text-slate-900 leading-tight">
                        {title}
                      </h3>
                    </div>

                    {(signalText || responseText || outcomeText) && (
                      <div className="space-y-6 pt-6 border-t border-border">
                        {(signalText || responseText) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Signal */}
                            {signalText && (
                              <div className="space-y-3">
                                <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-slate-300 rotate-45" /> SIGNAL
                                </h4>
                                <p className="text-sm text-slate-700 leading-relaxed font-sans">{signalText}</p>
                              </div>
                            )}
                            {/* Response */}
                            {responseText && (
                              <div className="space-y-3">
                                <h4 className="font-mono text-[10px] uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rotate-45" /> RESPONSE
                                </h4>
                                <p className="text-sm text-slate-700 leading-relaxed font-sans">{responseText}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Outcome */}
                        {outcomeText && (
                          <div className={`space-y-3 ${(signalText || responseText) ? 'pt-6 border-t border-border/50' : ''}`}>
                            <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-900 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-slate-900 rotate-45" /> OUTCOME
                            </h4>
                            <p className="text-sm text-slate-700 leading-relaxed font-sans">{outcomeText}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer: Tech & Links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-auto">
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {(project.technologies || []).slice(0, 4).map(tech => (
                          <span key={tech} className="font-mono text-[10px] text-slate-500">{tech}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        {isLive && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            <ExternalLink size={14} /> LIVE
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-slate-900 transition-colors">
                            <Github size={14} /> CODE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-24">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(idx + 1);
                  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-8 h-8 flex items-center justify-center font-mono text-xs transition-all ${
                  currentPage === idx + 1
                    ? 'bg-slate-900 text-white'
                    : 'bg-transparent text-slate-500 hover:bg-slate-200'
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
