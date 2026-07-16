const fs = require('fs');
let content = fs.readFileSync('src/components/Projects.jsx', 'utf8');

const oldBlock = `              return (
                <article key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start animate-fade-up">
                  {/* Thumbnail */}
                  <div className="lg:col-span-6 relative bg-slate-100 border border-border group overflow-hidden flex items-center justify-center">
                    {/* Index tag */}
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-2 py-1 border border-border font-mono text-[10px] font-bold text-slate-900 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-blue-600 rotate-45" />
                       FN–{String(overallIndex).padStart(2, '0')}
                    </div>

                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={title}
                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center min-h-[300px]">
                         <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">{t('Không có hình ảnh', 'No image')}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-6 flex flex-col justify-center h-full space-y-8">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                          {project.project_label ? project.project_label : (catLabel ? catLabel[language] : project.normalizedCategory.replace(/_/g, ' '))}
                        </span>
                        <span className="text-slate-300">/</span>
                        <span className={\`font-mono text-[10px] px-2 py-0.5 border \${statusInfo.class}\`}>
                          {language === 'vi' ? statusInfo.vi : statusInfo.en}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-medium text-slate-900 leading-tight">
                        {title}
                      </h3>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Signal */}
                        <div className="space-y-3">
                          <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-300 rotate-45" /> SIGNAL
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-sans">{signalText}</p>
                        </div>
                        {/* Response */}
                        <div className="space-y-3">
                          <h4 className="font-mono text-[10px] uppercase tracking-widest text-blue-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rotate-45" /> RESPONSE
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-sans">{responseText}</p>
                        </div>
                      </div>
                      
                      {/* Outcome */}
                      <div className="space-y-3 pt-6 border-t border-border/50">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-900 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-slate-900 rotate-45" /> OUTCOME
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed font-sans">{outcomeText}</p>
                      </div>
                    </div>

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
              );`;

const newBlock = `              let domainDisplay = 'portfolio.local';
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
                        <span className={\`font-mono text-[10px] px-2 py-0.5 border \${statusInfo.class}\`}>
                          {language === 'vi' ? statusInfo.vi : statusInfo.en}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-medium text-slate-900 leading-tight">
                        {title}
                      </h3>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Signal */}
                        <div className="space-y-3">
                          <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-300 rotate-45" /> SIGNAL
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-sans">{signalText}</p>
                        </div>
                        {/* Response */}
                        <div className="space-y-3">
                          <h4 className="font-mono text-[10px] uppercase tracking-widest text-blue-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rotate-45" /> RESPONSE
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-sans">{responseText}</p>
                        </div>
                      </div>
                      
                      {/* Outcome */}
                      <div className="space-y-3 pt-6 border-t border-border/50">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-900 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-slate-900 rotate-45" /> OUTCOME
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed font-sans">{outcomeText}</p>
                      </div>
                    </div>

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
              );`;

if(content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/components/Projects.jsx', content);
    console.log('Replaced JSX successfully.');
} else {
    console.error('Could not find old block to replace.');
}
