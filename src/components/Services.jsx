"use client";
import React from 'react';
import { UserCircle, ShoppingBag, LayoutDashboard, Globe2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: UserCircle, accentClass: 'text-blue-600 bg-blue-50 border-blue-100',
      title: t('Thiết Kế Web Doanh Nghiệp', 'Corporate Web Design'),
      desc: t(
        'Xây dựng nhận diện thương hiệu số độc bản, truyền tải đúng thông điệp và đẳng cấp của doanh nghiệp.',
        'Building unique digital brand identities, conveying the right message and prestige of your business.'
      ),
      tags: ['Branding', 'Corporate', 'B2B'],
    },
    {
      icon: Globe2, accentClass: 'text-violet-600 bg-violet-50 border-violet-100',
      title: t('Landing Page Chuyển Đổi', 'High-Converting Landing Pages'),
      desc: t(
        'Tối ưu hóa UI/UX và phễu người dùng để biến mỗi lượt truy cập thành một khách hàng tiềm năng.',
        'Optimizing UI/UX and user funnels to turn every visit into a potential customer.'
      ),
      tags: ['Conversion', 'Lead Gen', 'Optimization'],
    },
    {
      icon: ShoppingBag, accentClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: t('Giải Pháp E-Commerce', 'E-Commerce Solutions'),
      desc: t(
        'Nền tảng thương mại điện tử bảo mật, tốc độ cao với trải nghiệm mua sắm mượt mà.',
        'Secure, high-speed e-commerce platforms with seamless shopping experiences.'
      ),
      tags: ['Sales', 'Payments', 'Performance'],
    },
    {
      icon: LayoutDashboard, accentClass: 'text-slate-600 bg-slate-50 border-slate-200',
      title: t('Ứng Dụng Web & SaaS', 'Web Apps & SaaS'),
      desc: t(
        'Phát triển phần mềm quản trị (CMS/ERP/Dashboard) với kiến trúc linh hoạt, dễ dàng mở rộng.',
        'Developing management software (CMS/ERP/Dashboard) with flexible, scalable architectures.'
      ),
      tags: ['Scalability', 'System', 'Dashboard'],
    },
  ];

  return (
    <section id="services" className="border-t border-slate-200/60 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Dịch Vụ & Giải Pháp', 'Services & Solutions')}</h2>
          <div className="section-divider" />
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
            {t(
              'Từ ý tưởng đến sản phẩm hoàn thiện, tôi cung cấp các dịch vụ kỹ thuật số đo ni đóng giày cho nhu cầu phát triển của bạn.',
              'From concept to completion, I provide tailored digital services for your growth needs.'
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <div key={i} className="relative bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm card-hover text-left group">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${svc.accentClass}`}>
                <svc.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2">{svc.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">{svc.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {svc.tags.map(tag => (
                  <span key={tag} className="tag tag-slate text-[10px]">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
