const fs = require('fs');

// Update admin/dashboard/page.js
let pageContent = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

const oldAdminBlock = `                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[#D6D1C4]" />
                    <span className="text-[10px] font-mono text-[#828A9A] uppercase tracking-widest">Nội dung (Field Notes)</span>
                    <div className="flex-1 h-px bg-[#D6D1C4]" />
                  </div>

                  {/* Structured Content Fields */}
                  {['signal', 'response', 'outcome'].map((field) => (
                    <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-[#EBE6DA] border border-[#D6D1C4]/50">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">
                          {field} (VI)
                        </label>
                        <textarea 
                          rows={3} value={form[\`\${field}_vi\`]}
                          onChange={e => {setForm(p => ({...p, [\`\${field}_vi\`]: e.target.value})); setIsDirty(true);}}
                          className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors resize-y min-h-[80px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#828A9A] mb-2 uppercase tracking-wide">
                          {field} (EN)
                        </label>
                        <textarea 
                          rows={3} value={form[\`\${field}_en\`]}
                          onChange={e => {setForm(p => ({...p, [\`\${field}_en\`]: e.target.value})); setIsDirty(true);}}
                          className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors resize-y min-h-[80px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>`;

const newAdminBlock = `                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[#D6D1C4]" />
                    <span className="text-[10px] font-mono text-[#828A9A] uppercase tracking-widest">Nội dung case study (không bắt buộc)</span>
                    <div className="flex-1 h-px bg-[#D6D1C4]" />
                  </div>
                  <p className="text-[11px] text-[#4A505C] italic text-center -mt-2">
                    Dùng để giải thích vấn đề, cách thực hiện và giá trị của dự án trên portfolio. Có thể bổ sung sau.
                  </p>

                  {/* Structured Content Fields */}
                  {[
                    { key: 'signal', label: 'Vấn đề / Nhu cầu', placeholder: 'Ví dụ: Khách chưa có nơi xem menu, vị trí và gửi yêu cầu đặt bàn.' },
                    { key: 'response', label: 'Giải pháp thực hiện', placeholder: 'Ví dụ: Thiết kế website giới thiệu thương hiệu, menu trực quan và form đặt bàn.' },
                    { key: 'outcome', label: 'Giá trị mang lại', placeholder: 'Ví dụ: Giúp khách tìm thông tin nhanh hơn và gửi yêu cầu liên hệ từ một nơi.' }
                  ].map((field) => (
                    <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-[#EBE6DA] border border-[#D6D1C4]/50">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A505C] mb-2 tracking-wide">
                          {field.label} (VI)
                        </label>
                        <textarea 
                          rows={3} value={form[\`\${field.key}_vi\`]} placeholder={field.placeholder}
                          onChange={e => {setForm(p => ({...p, [\`\${field.key}_vi\`]: e.target.value})); setIsDirty(true);}}
                          className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors resize-y min-h-[80px] placeholder:text-[#828A9A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#828A9A] mb-2 tracking-wide">
                          {field.label} (EN)
                        </label>
                        <textarea 
                          rows={3} value={form[\`\${field.key}_en\`]} placeholder={\`English: \${field.placeholder}\`}
                          onChange={e => {setForm(p => ({...p, [\`\${field.key}_en\`]: e.target.value})); setIsDirty(true);}}
                          className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors resize-y min-h-[80px] placeholder:text-[#828A9A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>`;

pageContent = pageContent.replace(oldAdminBlock, newAdminBlock);
fs.writeFileSync('src/app/admin/dashboard/page.js', pageContent);

// Update src/components/Projects.jsx
let projectsContent = fs.readFileSync('src/components/Projects.jsx', 'utf8');

const oldProjectsBlock = `                    <div className="space-y-6 pt-6 border-t border-border">
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
                    </div>`;

const newProjectsBlock = `                    {(signalText || responseText || outcomeText) && (
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
                          <div className={\`space-y-3 \${(signalText || responseText) ? 'pt-6 border-t border-border/50' : ''}\`}>
                            <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-900 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-slate-900 rotate-45" /> OUTCOME
                            </h4>
                            <p className="text-sm text-slate-700 leading-relaxed font-sans">{outcomeText}</p>
                          </div>
                        )}
                      </div>
                    )}`;

projectsContent = projectsContent.replace(oldProjectsBlock, newProjectsBlock);
fs.writeFileSync('src/components/Projects.jsx', projectsContent);

console.log('Update successful.');
