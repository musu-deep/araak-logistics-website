import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2, ShoppingCart, Landmark, Star,
  Truck, Package, FileCheck, Plane,
  ArrowLeft, ArrowRight, ChevronDown,
} from 'lucide-react';

type Service = {
  id: string;
  segment: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  image: string;
};

// المصفوفة الأساسية تحتوي فقط على المعطيات الهيكلية والبصرية
const servicesData: Service[] = [
  {
    id: 'b2b',
    segment: 'B2B',
    color: 'text-brand-600',
    bgColor: 'bg-brand-50',
    borderColor: 'border-brand-200',
    icon: Building2,
    image: 'https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg',
  },
  {
    id: 'b2c',
    segment: 'B2C',
    color: 'text-success-600',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
    icon: ShoppingCart,
    image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg',
  },
  {
    id: 'b2g',
    segment: 'B2G',
    color: 'text-gold-600',
    bgColor: 'bg-gold-50',
    borderColor: 'border-gold-200',
    icon: Landmark,
    image: 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg',
  },
  {
    id: 'b2service',
    segment: 'B2Service',
    color: 'text-warning-600',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-200',
    icon: Star,
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg',
  },
];

const subServicesData = [
  { icon: Truck, key: 'b2b' },
  { icon: Package, key: 'b2c' },
  { icon: FileCheck, key: 'customs' },
  { icon: Plane, key: 'air_cargo' },
];

export default function Services() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState('b2b');
  const [expanded, setExpanded] = useState<string | null>(null);

  const isArabic = i18n.language?.startsWith('ar');
  const current = servicesData.find((s) => s.id === active)!;

  // جلب مصفوفة الميزات ديناميكياً بناءً على القسم النشط من ملف الـ JSON
  const currentFeatures = t(`services.items.${current.id}.features`, { returnObjects: true }) as string[] || [];

  const scrollToQuote = () => {
    const el = document.querySelector('#quote');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس القسم المترجم */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-brand-700 font-cairo text-sm font-semibold">
              {t('services.badge', 'نموذج العمل الرباعي')}
            </span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">
            {t('services.title', 'خدمات لكل قطاع')}
          </h2>
          <p className="text-neutral-600 font-cairo text-lg max-w-2xl mx-auto leading-relaxed">
            {t('services.subtitle', 'نموذج عمل مرن يدمج أربعة مسارات تشغيلية لضمان تنوع مصادر الدخل واستدامة العمليات')}
          </p>
        </div>

        {/* الأيقونات السريعة العلوية */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {subServicesData.map((s, index) => (
            <div key={index} className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-neutral-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand">
                <s.icon size={22} className="text-white" />
              </div>
              <span className="text-neutral-800 font-cairo font-semibold text-sm text-center">
                {t(`footer.links.${s.key}`)}
              </span>
            </div>
          ))}
        </div>

        {/* مبدل التبويبات الرئيسي (Tabs) */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {servicesData.map((s) => (
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
              <span className="hidden sm:inline text-xs opacity-70">
                — {t(`services.items.${s.id}.title`)}
              </span>
            </button>
          ))}
        </div>

        {/* تفاصيل التبويب النشط حالياً */}
        <div className={`bg-white rounded-3xl border ${current.borderColor} shadow-card overflow-hidden transition-all duration-300`}>
          <div className="grid lg:grid-cols-2">
            
            {/* الصورة التوضيحية وشارة القطاع */}
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src={current.image}
                alt={t(`services.items.${current.id}.title`)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
              <div className={`absolute top-6 right-6 px-3 py-1.5 ${current.bgColor} border ${current.borderColor} rounded-full`}>
                <span className={`font-inter font-bold text-xs ${current.color}`}>{current.segment}</span>
              </div>
            </div>

            {/* نصوص المحتوى والميزات المترجمة */}
            <div className="p-8 lg:p-12">
              <div className={`inline-flex items-center justify-center w-14 h-14 ${current.bgColor} border ${current.borderColor} rounded-2xl mb-6`}>
                <current.icon size={26} className={current.color} />
              </div>
              <h3 className="font-cairo font-black text-neutral-900 text-2xl mb-2">
                {t(`services.items.${current.id}.title`)}
              </h3>
              <p className="text-neutral-500 font-inter text-sm mb-6 italic">
                {t(`services.items.${current.id}.segmentEn`)}
              </p>
              <p className="text-neutral-600 font-cairo text-base mb-8 leading-relaxed">
                {t(`services.items.${current.id}.subtitle`)}
              </p>

              <ul className="space-y-3 mb-8">
                {Array.isArray(currentFeatures) && currentFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      current.id === 'b2b' ? 'bg-brand-500' : 
                      current.id === 'b2c' ? 'bg-success-500' : 
                      current.id === 'b2g' ? 'bg-gold-500' : 'bg-warning-500'
                    }`} />
                    <span className="text-neutral-700 font-cairo text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToQuote}
                className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-cairo font-bold text-sm rounded-xl shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {t('services.order_now', 'اطلب الخدمة الآن')}
                {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* الأكورديون المخصص للهواتف المحمولة الشاشات الصغيرة */}
        <div className="mt-8 lg:hidden space-y-3">
          {servicesData.filter(s => s.id !== active).map((s) => (
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
                    <span className="text-neutral-900 font-cairo font-bold text-sm">
                      {t(`services.items.${s.id}.title`)}
                    </span>
                    <span className={`block text-xs ${s.color} font-inter`}>{s.segment}</span>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-neutral-400 transition-transform ${expanded === s.id ? 'rotate-180' : ''}`} />
              </button>
              
              {expanded === s.id && (
                <div className="px-5 pb-5">
                  <ul className="space-y-2">
                    {(t(`services.items.${s.id}.features`, { returnObjects: true }) as string[] || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
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