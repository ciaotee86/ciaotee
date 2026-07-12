"use client";
import React from 'react';
import { Compass, Palette, Code, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
          <h2 className="section-heading">{t('Về tôi', 'About Me')}</h2>
          <div className="section-divider" />
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto">
            {t('Kỹ sư phần mềm với tư duy kinh doanh và thiết kế.', 'Software engineer with a business and design mindset.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 leading-snug">
              {t(
                'Kiến tạo giá trị doanh nghiệp qua lăng kính công nghệ.',
                'Creating business value through the lens of technology.'
              )}
            </h3>
            <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
              <p>
                {t(
                  'Là một chuyên gia phát triển phần mềm, tôi hiểu rằng code chỉ là công cụ — mục tiêu cuối cùng là giải quyết bài toán kinh doanh. Với nền tảng vững chắc về kiến trúc hệ thống và sự nhạy bén trong UI/UX, tôi giúp các doanh nghiệp biến ý tưởng thành những sản phẩm số vượt trội.',
                  "As a software development expert, I understand that code is just a tool — the ultimate goal is solving business problems. With a solid foundation in system architecture and UI/UX acumen, I help businesses turn ideas into outstanding digital products."
                )}
              </p>
              <p>
                {t(
                  'Tôi không chỉ nhận yêu cầu và làm theo, mà còn tư vấn, phản biện và tối ưu hóa quy trình để sản phẩm đạt được tỷ lệ chuyển đổi cao nhất, tốc độ tải trang tối ưu và khả năng mở rộng trong tương lai.',
                  "I don't just take requests and follow them; I consult, critique, and optimize the process to ensure the product achieves the highest conversion rates, optimal load speeds, and future scalability."
                )}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl card-hover text-left">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <item.icon size={17} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
