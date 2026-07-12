"use client";
import React from 'react';
import { Compass, Palette, Code, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function About() {
  const { t } = useLanguage();

  const highlights = [
    { icon: Compass, title: t('Tư duy Chiến lược', 'Strategic Thinking'), desc: t('Tập trung vào kết quả và giải pháp kinh doanh.', 'Focused on results and business solutions.') },
    { icon: Palette, title: t('Thiết kế Thấu cảm', 'Empathetic Design'), desc: t('Giao diện tinh tế, đặt trải nghiệm người dùng làm cốt lõi.', 'Refined interfaces with user experience at the core.') },
    { icon: Code, title: t('Kiến trúc Bền vững', 'Sustainable Arch.'), desc: t('Cấu trúc code mở rộng, bảo trì dễ dàng.', 'Scalable code structure, easy to maintain.') },
    { icon: Cpu, title: t('Tối ưu Hiệu năng', 'Performance Opt.'), desc: t('Tốc độ tải siêu tốc, đáp ứng mọi thiết bị.', 'Lightning-fast loading on all devices.') },
  ];

  return (
    <section id="about" className="border-t border-slate-200/60 bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="section-heading">{t('Về tôi', 'About Me')}</h2>
            <div className="section-divider" />
            <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
              {t('Người phát triển website.', 'Website developer.')}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <Reveal delay={0.2} className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 leading-snug">
              {t(
                'Kiến tạo giá trị doanh nghiệp qua lăng kính công nghệ.',
                'Creating business value through the lens of technology.'
              )}
            </h3>
            <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
              <p>
                {t(
                  'Là một người phát triển web, tôi hiểu rằng code chỉ là công cụ — mục tiêu cuối cùng là giải quyết bài toán vấn đề kinh điển của bạn. Với nền tảng về kiến trúc hệ thống và sự nhạy bén trong UI/UX, tôi giúp các doanh nghiệp biến ý tưởng thành những sản phẩm số vượt trội.',
                  "As a web developer, I understand that code is just a tool — the ultimate goal is to solve your classic problem. With a solid foundation in system architecture and UI/UX acumen, I help businesses turn ideas into outstanding digital products."
                )}
              </p>
              <p>
                {t(
                  'Tôi không chỉ nhận yêu cầu và làm theo, mà còn tư vấn, phản biện và tối ưu hóa quy trình để sản phẩm đạt được tỷ lệ chuyển đổi cao nhất, tốc độ tải trang tối ưu và khả năng mở rộng trong tương lai.',
                  "I don't just take requests and follow them; I consult, critique, and optimize the process to ensure the product achieves the highest conversion rates, optimal load speeds, and future scalability."
                )}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <Reveal key={i} delay={0.3 + (i * 0.1)}>
                <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl card-hover text-left h-full">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <item.icon size={17} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
