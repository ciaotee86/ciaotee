"use client";
import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Github, Linkedin, Facebook, Instagram } from './BrandIcons';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const socialLinks = [
    { icon: Mail, label: 'Email', href: 'mailto:gamern1234hk5@gmail.com', val: 'gamern1234hk5@gmail.com' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/ciaotee86', val: 'ciaotee86' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/_ciaossu_qt.tee_/', val: '_ciaossu_qt.tee_' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/ciaossu.qt.tee/', val: 'ciaossu.qt.tee' },
  ];

  const InputField = ({ label, type = "text", placeholder, value, onChange, error }) => (
    <div className="relative group">
      <label className="block text-[10px] uppercase tracking-widest font-mono text-slate-500 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-transparent border-0 border-b border-border py-2 px-0 focus:ring-0 focus:border-blue-600 outline-none text-slate-900 placeholder:text-slate-300 font-sans text-sm transition-colors resize-none ${error ? 'border-red-400' : ''}`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-transparent border-0 border-b border-border py-2 px-0 focus:ring-0 focus:border-blue-600 outline-none text-slate-900 placeholder:text-slate-300 font-sans text-sm transition-colors ${error ? 'border-red-400' : ''}`}
        />
      )}
      {error && (
        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1 font-mono absolute -bottom-5 left-0">
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="border-t border-border bg-white py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          
          {/* Left Column: Heading & Info */}
          <div className="md:col-span-5 space-y-12 animate-fade-up">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight leading-tight">
                {t('Bắt đầu một dự án rõ ràng.', 'Start a clear project.')}
              </h2>
              <p className="mt-6 text-slate-600 text-sm font-sans leading-relaxed">
                {t(
                  'Gửi cho tôi tín hiệu của bạn. Chúng ta sẽ cùng nhau xây dựng một giải pháp kỹ thuật số giúp doanh nghiệp của bạn phát triển.',
                  'Send me your signal. Together, we will build a digital solution that helps your business grow.'
                )}
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-border">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                {t('Kênh tiếp nhận', 'Receiving Channels')}
              </h3>
              <ul className="space-y-4">
                {socialLinks.map(({ icon: Icon, label, href, val }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <span className="w-8 h-8 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <Icon size={16} />
                      </span>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{label}</div>
                        <div className="text-sm font-medium text-slate-800">{val}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Minimalist Form */}
          <div className="md:col-span-7 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-border bg-slate-50">
                <CheckCircle2 size={32} className="text-blue-600 mb-4" />
                <h3 className="font-display text-2xl text-slate-900 mb-2">{t('Tín hiệu đã được nhận!', 'Signal Received!')}</h3>
                <p className="text-slate-600 text-sm mb-6">{t('Tôi sẽ phản hồi bạn trong vòng 24 giờ.', 'I will respond within 24 hours.')}</p>
                <button onClick={() => setStatus(null)} className="font-mono text-xs text-blue-600 border-b border-blue-600 pb-0.5 hover:text-blue-800 hover:border-blue-800 transition-colors">
                  {t('Gửi tin nhắn khác', 'Send another message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <InputField
                    label={t('Tên của bạn', 'Your Name')}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    error={errors.name}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                  />
                </div>
                
                <InputField
                  label={t('Tiêu đề', 'Subject')}
                  placeholder={t('Tôi cần xây dựng website cho...', 'I need a website for...')}
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  error={errors.subject}
                />
                
                <InputField
                  label={t('Nội dung', 'Message')}
                  type="textarea"
                  placeholder={t('Mô tả chi tiết bài toán kinh doanh của bạn...', 'Describe your business problem in detail...')}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  error={errors.message}
                />

                <div className="pt-4">
                  <button type="submit" disabled={status === 'loading'} className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {status === 'loading' ? (
                      <>{t('Đang truyền...', 'Transmitting...')}</>
                    ) : (
                      <>
                        {t('Truyền tín hiệu', 'Transmit Signal')}
                        <div className="w-1.5 h-1.5 bg-white rotate-45 group-hover:scale-125 transition-transform" />
                      </>
                    )}
                  </button>
                  {status === 'error' && (
                    <p className="text-xs text-red-500 mt-3 font-sans">
                      {t('Lỗi đường truyền. Vui lòng thử lại.', 'Transmission error. Please try again.')}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
