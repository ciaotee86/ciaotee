"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t, language } = useLanguage();

  const services = [
    {
      title: t('Website Doanh Nghiệp', 'Business Website'),
      problem: t(
        'Bạn có một doanh nghiệp hoạt động tốt, nhưng không có sự hiện diện chuyên nghiệp trên mạng. Khách hàng khó tìm thấy bạn, và nếu thấy, họ không hiểu rõ bạn làm gì.',
        'You have a solid business, but no professional online presence. Customers can\'t find you, and if they do, they don\'t quickly understand what you offer.'
      ),
      delivery: t(
        'Một website giới thiệu rõ ràng, tải nhanh, được thiết kế riêng biệt để xây dựng lòng tin và giải thích rõ ràng giá trị cốt lõi của bạn.',
        'A clear, fast-loading presentation website custom-designed to build trust and clearly explain your core value proposition.'
      ),
      suitable: t('Doanh nghiệp dịch vụ, chuyên gia tư vấn, nhà thầu B2B.', 'Service businesses, consultants, B2B contractors.'),
      scope: ['UI/UX Design', 'Frontend Development', 'Basic SEO', 'Copywriting Support']
    },
    {
      title: t('Landing Page Chuyển Đổi', 'Conversion Landing Page'),
      problem: t(
        'Bạn đang chạy quảng cáo hoặc có một chiến dịch sắp ra mắt, nhưng trang đích hiện tại rối rắm và không tạo ra đủ khách hàng tiềm năng.',
        'You are running ads or launching a campaign, but the current destination is confusing and failing to generate enough qualified leads.'
      ),
      delivery: t(
        'Một trang đích duy nhất được thiết kế tối ưu, tập trung hoàn toàn vào một hành động cụ thể (mua hàng, đăng ký, liên hệ) với tỷ lệ chuyển đổi cao.',
        'A highly optimized single landing page focused entirely on a specific action (buy, sign up, contact) designed for maximum conversion.'
      ),
      suitable: t('Chiến dịch Marketing, Sự kiện, Ra mắt sản phẩm.', 'Marketing campaigns, Events, Product launches.'),
      scope: ['Funnel Strategy', 'High-Conversion UI', 'Analytics Setup', 'Responsive Build']
    },
    {
      title: t('Nâng Cấp Giao Diện', 'UI/UX Revamp'),
      problem: t(
        'Ứng dụng web hoặc trang web hiện tại của bạn có chức năng tốt nhưng nhìn lỗi thời, khó sử dụng và khiến người dùng bực bội.',
        'Your current web app or site is functional but looks outdated, is hard to navigate, and frustrates your users.'
      ),
      delivery: t(
        'Thiết kế lại toàn bộ luồng người dùng và giao diện, hiện đại hóa trải nghiệm mà không làm ảnh hưởng đến hệ thống backend hiện tại.',
        'A complete redesign of user flows and interfaces, modernizing the visual experience without breaking your existing backend system.'
      ),
      suitable: t('SaaS, Dashboard, E-commerce, Web Apps nội bộ.', 'SaaS platforms, Dashboards, E-commerce, Internal web apps.'),
      scope: ['UX Audit', 'Wireframing', 'Design System', 'Frontend Refactoring']
    }
  ];

  return (
    <section id="services" className="border-t border-border bg-white py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-16 md:mb-24 animate-fade-up">
          <h2 className="font-display text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">
            {t('Dịch vụ', 'Services')}
          </h2>
          <p className="mt-6 text-slate-600 text-sm max-w-lg font-sans">
            {t(
              'Tôi tập trung vào ba dịch vụ cốt lõi, giải quyết trực tiếp các vấn đề hiển thị và chuyển đổi số.',
              'I focus on three core services, directly addressing digital visibility and conversion problems.'
            )}
          </p>
        </div>

        <div className="space-y-4">
          {services.map((svc, i) => (
            <article key={i} className="border-t border-border pt-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-fade-up" style={{ animationDelay: `${(i+1)*150}ms` }}>
              {/* Left Title */}
              <div className="lg:col-span-4">
                <div className="flex items-center gap-3 mb-4 lg:hidden">
                  <div className="w-2 h-2 bg-blue-600 rotate-45" />
                  <span className="font-mono text-[10px] text-slate-400">S–0{i + 1}</span>
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-medium text-slate-900 leading-tight">
                  <span className="hidden lg:inline-block font-mono text-sm text-slate-300 mr-4 font-normal">0{i + 1}</span>
                  {svc.title}
                </h3>
              </div>
              
              {/* Right Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* Problem & Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 border-b border-border pb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-300 rotate-45" /> {t('Vấn đề', 'Problem')}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans">{svc.problem}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-blue-600 border-b border-border pb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rotate-45" /> {t('Giải pháp', 'Delivery')}
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">{svc.delivery}</p>
                  </div>
                </div>
                
                {/* Suitable & Scope */}
                <div className="flex flex-col md:flex-row gap-8 pt-6 border-t border-border/50">
                  <div className="md:w-1/2 space-y-2">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-900 mb-2">
                      {t('Phù hợp với', 'Best For')}
                    </h4>
                    <p className="text-sm text-slate-600 font-sans">{svc.suitable}</p>
                  </div>
                  <div className="md:w-1/2 space-y-2">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-900 mb-2">
                      {t('Phạm vi', 'Scope')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {svc.scope.map(s => (
                        <span key={s} className="font-mono text-[10px] text-slate-500 bg-slate-50 border border-border px-2 py-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
