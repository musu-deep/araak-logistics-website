import { Eye, Zap, Link, Shield, BarChart3, Leaf } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'الشفافية الكاملة',
    desc: 'تتبع شحناتك لحظة بلحظة عبر منصة رقمية موحدة مع تقارير دورية يومية وأسبوعية وشهرية.',
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    icon: Zap,
    title: 'السرعة والكفاءة',
    desc: 'توصيل في نفس اليوم لقطاع التجزئة، وأسرع وقت استجابة لعروض الأسعار في السوق.',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
  },
  {
    icon: Link,
    title: 'التكامل الرقمي',
    desc: 'ربط رقمي لإدارة التوريد ومراقبة المخزون وضمان تدفق سلس للمعلومات والمواد.',
    color: 'text-success-600',
    bg: 'bg-success-50',
  },
  {
    icon: Shield,
    title: 'الموثوقية والامتثال',
    desc: 'عمل بموجب التراخيص النظامية من الهيئات والوزارات السعودية المعنية.',
    color: 'text-brand-700',
    bg: 'bg-brand-50',
  },
  {
    icon: BarChart3,
    title: 'تسعير تنافسي',
    desc: 'نظام تسعير ديناميكي يتناسب مع حجم العمليات لضمان أفضل قيمة لشركائنا.',
    color: 'text-warning-600',
    bg: 'bg-warning-50',
  },
  {
    icon: Leaf,
    title: 'رؤية 2030',
    desc: 'شريك استراتيجي يواكب أهداف التحول الاقتصادي وتطوير قطاع اللوجستيات في المملكة.',
    color: 'text-success-700',
    bg: 'bg-success-50',
  },
];

export default function WhyLarak() {
  return (
    <section id="about" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt="Araak team"
                className="w-full h-80 lg:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />

              {/* Overlay Card */}
              <div className="absolute bottom-6 right-6 left-6 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-card">
                <h4 className="font-cairo font-black text-neutral-900 text-lg mb-2">رؤيتنا الاستراتيجية</h4>
                <p className="text-neutral-600 font-cairo text-sm leading-relaxed">
                  أن نكون الشريان الرقمي واللوجستي الأكثر كفاءة وموثوقية في الشرق الأوسط عبر ابتكار حلول مرنة تربط الأسواق العالمية بالمستهلك المحلي.
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -top-4 -left-4 bg-gold-gradient rounded-2xl px-5 py-3 shadow-gold">
              <p className="text-brand-900 font-cairo font-black text-sm">شريك UPH</p>
              <p className="text-brand-800/70 font-cairo text-xs">خبرة تشغيلية عميقة</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span className="text-brand-700 font-cairo text-sm font-semibold">لماذا اراك لوجستيك؟</span>
            </div>

            <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-6 leading-tight">
              المميزات التنافسية
              <br />
              <span className="text-brand-600">التي تصنع الفارق</span>
            </h2>

            <p className="text-neutral-600 font-cairo text-base leading-relaxed mb-10">
              اراك لوجستيك تجمع بين إرث يو بي اتش التشغيلي الراسخ وأحدث الحلول الرقمية لتقديم تجربة لوجستية متكاملة لا مثيل لها في المنطقة.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-neutral-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <f.icon size={18} className={f.color} />
                  </div>
                  <div>
                    <h4 className="font-cairo font-bold text-neutral-900 text-sm mb-1">{f.title}</h4>
                    <p className="text-neutral-500 font-cairo text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
