"use client";
import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin, Facebook } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = t('Tên phải ít nhất 2 ký tự', 'Name must be at least 2 characters');
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = t('Email không hợp lệ', 'Invalid email');
    if (!form.subject.trim() || form.subject.length < 3) e.subject = t('Tiêu đề ít nhất 3 ký tự', 'Subject at least 3 characters');
    if (!form.message.trim() || form.message.length < 10) e.message = t('Nội dung ít nhất 10 ký tự', 'Message at least 10 characters');
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    // Simulate sending (replace with real API call)
    setTimeout(() => setStatus('success'), 1500);
  };

  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:your@email.com', val: 'your@email.com' },
    { icon: Github, label: 'GitHub', href: 'https://github.com', val: 'github.com/yourhandle' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', val: 'linkedin.com/in/yourhandle' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com', val: 'facebook.com/yourhandle' },
  ];

  return (
    <section id="contact" className="border-t border-slate-200/60 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Bắt Đầu Dự Án', 'Start Your Project')}</h2>
          <div className="section-divider" />
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
            {t(
              'Sẵn sàng nâng tầm doanh nghiệp của bạn? Hãy chia sẻ về dự án để nhận tư vấn và báo giá chi tiết.',
              'Ready to elevate your business? Tell me about your project to get a consultation and quote.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left — Info */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">{t('Thông tin liên lạc', 'Contact Info')}</h3>
            {socialLinks.map(({ icon: Icon, label, href, val }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-all duration-200 group"
              >
                <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                  <Icon size={14} />
                </span>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
                  <div className="text-xs font-medium text-slate-700 truncate">{val}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <h3 className="font-bold text-slate-800">{t('Đã gửi thành công!', 'Sent successfully!')}</h3>
                <p className="text-slate-500 text-sm">{t('Tôi sẽ phản hồi bạn sớm nhất có thể.', 'I will get back to you as soon as possible.')}</p>
                <button onClick={() => { setStatus(null); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary text-sm">
                  {t('Gửi tin nhắn khác', 'Send another message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: t('Tên của bạn', 'Your Name'), type: 'text', placeholder: t('Nguyễn Văn A', 'John Doe') },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        className={`form-input ${errors[field.key] ? 'error' : ''}`}
                        placeholder={field.placeholder}
                      />
                      {errors[field.key] && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />{errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('Tiêu đề', 'Subject')}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className={`form-input ${errors.subject ? 'error' : ''}`}
                    placeholder={t('Tôi muốn trao đổi về...', 'I would like to discuss...')}
                  />
                  {errors.subject && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.subject}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('Nội dung', 'Message')}</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className={`form-input resize-none ${errors.message ? 'error' : ''}`}
                    placeholder={t('Mô tả ý tưởng, ngành nghề, loại website bạn cần...', 'Describe your idea, industry, type of website you need...')}
                  />
                  {errors.message && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.message}</p>}
                </div>
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center sm:w-auto">
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('Đang gửi...', 'Sending...')}
                    </span>
                  ) : (
                    <>
                      <Send size={14} />
                      {t('Gửi yêu cầu', 'Send Request')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
