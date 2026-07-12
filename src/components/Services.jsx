"use client";
import React from 'react';
import { UserCircle, ShoppingBag, LayoutDashboard, Globe2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: UserCircle, accentClass: 'text-blue-600 bg-blue-50 border-blue-100',
      title: t('Website cá nhân / Portfolio', 'Personal / Portfolio Website'),
      desc: t(
        'Thiết kế và xây dựng website để giới thiệu bản thân, kỹ năng và các dự án đã thực hiện.',
        'Design and build a website to introduce yourself, showcase skills and portfolio projects.'
      ),
      tags: ['Portfolio', 'CV', 'Branding'],
    },
    {
      icon: Globe2, accentClass: 'text-violet-600 bg-violet-50 border-violet-100',
      title: t('Landing Page doanh nghiệp', 'Business Landing Page'),
      desc: t(
        'Trang giới thiệu doanh nghiệp, dịch vụ hoặc sản phẩm với giao diện chuyên nghiệp và SEO cơ bản.',
        'Business landing page for services or products with a professional design and basic SEO.'
      ),
      tags: ['Landing Page', 'SEO', 'Responsive'],
    },
    {
      icon: ShoppingBag, accentClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: t('Website thương mại điện tử', 'E-commerce Website'),
      desc: t(
        'Cửa hàng online đơn giản với danh sách sản phẩm, giỏ hàng và tích hợp thanh toán cơ bản.',
        'Simple online store with product listings, cart, and basic payment integration.'
      ),
      tags: ['Shop', 'Cart', 'Product List'],
    },
    {
      icon: LayoutDashboard, accentClass: 'text-slate-600 bg-slate-50 border-slate-200',
      title: t('Dashboard / Quản lý nội dung', 'Dashboard / CMS'),
      desc: t(
        'Giao diện quản lý sản phẩm, nội dung hoặc người dùng với bảng biểu và thao tác CRUD.',
        'Management interface for products, content, or users with tables and CRUD operations.'
      ),
      tags: ['Dashboard', 'Admin', 'CRUD'],
    },
  ];

  return (
    <section id="services" className="border-t border-slate-200/60 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-heading">{t('Tôi có thể làm gì?', 'What I Can Do')}</h2>
          <div className="section-divider" />
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
