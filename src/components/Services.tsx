import { useState } from 'react';
import {
  Building2, ShoppingCart, Landmark, Star,
  Truck, Package, FileCheck, Plane,
  ArrowLeft, ChevronDown,
} from 'lucide-react';

type Service = {
  id: string;
  segment: string;
  segmentEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  features: string[];
  image: string;
};

const services: Service[] = [
  {
    id: 'b2b',
    segment: 'B2B',
    segmentEn: 'Business to Business',
    color: 'text-brand-600',
    bgColor: 'bg-brand-50',
    borderColor: 'border-brand-200',
    icon: Building2,
    title: 'الشركات والمشاريع الكبرى',
    subtitle: 'حلول متكاملة للصناعات الثقيلة والطاقة والتعدين',
    features: [
      'الشحن المتعدد الوسائط (بري، بحري، جوي)',
      'المشاريع المتخصصة والصناعات الثقيلة',
      'إدارة أوامر الشراء والمخزون',
      'أسطول ضخم وشبكة وكلاء عالمية',
      'نقل الطرود ذات الأبعاد الكبيرة (نفط، غاز، بتروكيماويات)',
    ],
    image: 'https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg',
  },
  {
    id: 'b2c',
    segment: 'B2C',
    segmentEn: 'Business to Consumer',
    color: 'text-success-600',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
    icon: ShoppingCart,
    title: 'التجارة الإلكترونية والأفراد',
    subtitle: 'توصيل سريع وحلول فولفيلمنت متكاملة للمتاجر والأفراد',
    features: [
      'التخزين الذكي والتغليف (Fulfillment)',
      'التوصيل السريع والدفع عند الاستلام (COD)',
      'تسوية أسبوعية سريعة مع التجار',
      'اللوجستيات العكسية (Reverse Logistics)',
      'تتبع الشحنات في الوقت الفعلي',
    ],
    image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg',
  },
  {
    id: 'b2g',
    segment: 'B2G',
    segmentEn: 'Business to Government',
    color: 'text-gold-600',
    bgColor: 'bg-gold-50',
    borderColor: 'border-gold-200',
    icon: Landmark,
    title: 'الجهات الحكومية والمنافذ',
    subtitle: 'شراكات استراتيجية لتسهيل التجارة عبر الحدود',
    features: [
      'التخليص الجمركي السيادي (موانئ، مطارات، حدود)',
      'إجراءات الإعفاء والاستيراد المؤقت',
      'التعامل مع المواد الخطرة والمقيدة',
      'استخراج التصاريح والتوثيق',
      'التحقق التام من وثائق الشحن',
    ],
    image: 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg',
  },
  {
    id: 'b2service',
    segment: 'B2Service',
    segmentEn: 'Business to Service',
    color: 'text-warning-600',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-200',
    icon: Star,
    title: 'الخدمات والحلول المتخصصة',
    subtitle: 'حلول لوجستية حيوية لضيوف الرحمن وخدمات الشحن المتخصصة',
    features: [
      'خدمات ضيوف الرحمن (حج وعمرة)',
      'نقل الأمتعة من المطارات إلى مكة والمدينة',
      'الشحن من الباب إلى الموقع (DDP/DDU)',
      'تأجير طائرات الشحن (Air Charter)',
      'City Terminal – مجمعات وزن الأمتعة',
    ],
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg',
  },
];

const subServices = [
  { icon: Truck, label: 'شحن بري وبحري وجوي' },
  { icon: Package, label: 'تخزين وفولفيلمنت' },
  { icon: FileCheck, label: 'تخليص جمركي' },
  { icon: Plane, label: 'شحن جوي مخصص' },
];

export default function Services() {
  const [active, setActive] = useState('b2b');
  const [expanded, setExpanded] = useState<string | null>(null);

  const current = services.find((s) => s.id === active)!;

  const scrollToQuote = () => {
    const el = document.querySelector('#quote');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-brand-700 font-cairo text-sm font-semibold">نموذج العمل الرباعي</span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">
            خدمات لكل قطاع
          </h2>
          <p className="text-neutral-600 font-cairo text-lg max-w-2xl mx-auto leading-relaxed">
            نموذج عمل مرن يدمج أربعة مسارات تشغيلية لضمان تنوع مصادر الدخل واستدامة العمليات
          </p>
        </div>

        {/* Quick Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {subServices.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-neutral-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand">
                <s.icon size={22} className="text-white" />
              </div>
              <span className="text-neutral-800 font-cairo font-semibold text-sm text-center">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-cairo font-bold text-sm transition-all duration-200 border ${
                active === s.id
                  ? 'bg-brand-gradient text-white border-brand-500 shadow-brand'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              <s.icon size={16} />
              <span>{s.segment}</span>
              <span className="hidden sm:inline text-xs opacity-70">— {s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Service Detail */}
        <div className={`bg-white rounded-3xl border ${current.borderColor} shadow-card overflow-hidden transition-all duration-300`}>
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
              <div className={`absolute top-6 right-6 px-3 py-1.5 ${current.bgColor} border ${current.borderColor} rounded-full`}>
                <span className={`font-inter font-bold text-xs ${current.color}`}>{current.segment}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className={`inline-flex items-center justify-center w-14 h-14 ${current.bgColor} border ${current.borderColor} rounded-2xl mb-6`}>
                <current.icon size={26} className={current.color} />
              </div>
              <h3 className="font-cairo font-black text-neutral-900 text-2xl mb-2">{current.title}</h3>
              <p className="text-neutral-500 font-cairo text-sm mb-6 italic">{current.segmentEn}</p>
              <p className="text-neutral-600 font-cairo text-base mb-8 leading-relaxed">{current.subtitle}</p>

              <ul className="space-y-3 mb-8">
                {current.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${current.bgColor === 'bg-brand-50' ? 'bg-brand-500' : current.bgColor === 'bg-success-50' ? 'bg-success-500' : current.bgColor === 'bg-gold-50' ? 'bg-gold-500' : 'bg-warning-500'}`} />
                    <span className="text-neutral-700 font-cairo text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToQuote}
                className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-cairo font-bold text-sm rounded-xl shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                اطلب الخدمة الآن
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Accordion for all services */}
        <div className="mt-8 lg:hidden space-y-3">
          {services.filter(s => s.id !== active).map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border ${s.borderColor} overflow-hidden`}>
              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${s.bgColor} rounded-xl flex items-center justify-center`}>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-900 font-cairo font-bold text-sm">{s.title}</span>
                    <span className={`block text-xs ${s.color} font-inter`}>{s.segment}</span>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-neutral-400 transition-transform ${expanded === s.id ? 'rotate-180' : ''}`} />
              </button>
              {expanded === s.id && (
                <div className="px-5 pb-5">
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                        <span className="text-neutral-600 font-cairo text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
