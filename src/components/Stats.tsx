import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe as Globe2, Package, Users, Award } from 'lucide-react';

// مكون العداد الذكي مع دعم قلب نظام الأرقام محلياً حسب لغة المتصفح
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const { i18n } = useTranslation();
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const isArabic = i18n.language?.startsWith('ar');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800; // مدة الحركة بالملي ثانية
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(Math.round(current));
            if (current >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-inter tracking-tight">
      {/* تحويل الأرقام تلقائياً إلى ar-SA (١٢٣) أو en-US (123) بناءً على حالة اللغة الحالية */}
      {count.toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  // مصفوفة البيانات الأساسية مربوطة بمفاتيح الترجمة الموحدة لمنع أي جمود نصي
  const stats = [
    { 
      icon: Globe2, 
      value: 45, 
      suffix: '+', 
      label: t('hero.stats.clients', 'دولة حول العالم'),
      sublabel: isArabic ? 'شبكة وكلاء عالمية' : 'Global Agents Network'
    },
    { 
      icon: Package, 
      value: 50000, 
      suffix: '+', 
      label: isArabic ? 'شحنة سنوياً' : 'Shipments Annually', 
      sublabel: isArabic ? 'كفاءة تشغيلية عالية' : 'High Operational Efficiency'
    },
    { 
      icon: Users, 
      value: 500, 
      suffix: '+', 
      label: isArabic ? 'عميل موثوق' : 'Trusted Clients', 
      sublabel: isArabic ? 'شركات وأفراد' : 'B2B & B2C Segments'
    },
    { 
      icon: Award, 
      value: 15, 
      suffix: '+', 
      label: isArabic ? 'عاماً من الخبرة' : 'Years of Experience', 
      sublabel: isArabic ? 'عبر إرث UPH العريق' : 'Via Legacy of UPH'
    },
  ];

  return (
    <section className="py-20 bg-brand-gradient relative overflow-hidden" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* كود الـ SVG الأصلي الخاص بنمط النقاط الجمالي المتكرر (تم الحفاظ عليه بالكامل) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* العناوين الرئيسية للقسم مترجمة ديناميكياً */}
        <div className="text-center mb-14">
          <h2 className="font-cairo font-black text-white text-3xl sm:text-4xl mb-4 tracking-tight">
            {isArabic ? 'أرقام تتحدث عن نفسها' : 'Numbers Speak for Themselves'}
          </h2>
          <p className="text-white/60 font-cairo text-base sm:text-lg max-w-md mx-auto opacity-90">
            {isArabic ? 'ثقة مبنية على سنوات من العمل والإنجاز' : 'Trust built on years of operations and achievements'}
          </p>
        </div>

        {/* شبكة البطاقات التفاعلية مع الحفاظ على تأثيرات الـ Hover والانيميشن الأصلي */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-5 group-hover:bg-gold-500 group-hover:text-brand-950 transition-all duration-300">
                <s.icon size={26} className="text-gold-400 group-hover:text-brand-950 transition-colors duration-300" />
              </div>
              <div className="font-cairo font-black text-white text-3xl sm:text-4xl mb-2 tracking-tight">
                {/* استدعاء العداد التفاعلي الأصلي ليقوم بحساب الأرقام ديناميكياً */}
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white font-cairo font-bold text-sm sm:text-base mb-1">{s.label}</div>
              <div className="text-white/50 font-cairo text-xs opacity-80">{s.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}