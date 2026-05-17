import { ArrowUp } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'شحن الشركات (B2B)', href: '#services' },
    { label: 'التجارة الإلكترونية (B2C)', href: '#services' },
    { label: 'الجهات الحكومية (B2G)', href: '#services' },
    { label: 'خدمات ضيوف الرحمن', href: '#services' },
    { label: 'تخليص جمركي', href: '#services' },
    { label: 'شحن جوي مخصص', href: '#services' },
  ],
  company: [
    { label: 'عن اراك لوجستيك', href: '#about' },
    { label: 'شركاؤنا', href: '#partners' },
    { label: 'تتبع الشحنة', href: '#track' },
    { label: 'احصل على عرض سعر', href: '#quote' },
    { label: 'تواصل معنا', href: '#contact' },
  ],
  legal: [
    { label: 'سياسة الخصوصية', href: '#' },
    { label: 'شروط الاستخدام', href: '#' },
    { label: 'سياسة الإرجاع', href: '#' },
  ],
};

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollTo = (href: string) => {
    if (href === '#') return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-brand-900 font-cairo font-black text-lg">ل</span>
              </div>
              <div>
                <div className="text-white font-cairo font-bold text-lg">اراك لوجستيك</div>
                <div className="text-gold-400 font-inter text-xs tracking-widest">Araak Logistics</div>
              </div>
            </div>
            <p className="text-white/50 font-cairo text-sm leading-relaxed mb-6">
              شريك الإمداد الذكي من الباب إلى العالم. نقود تحول سلاسل الإمداد في الشرق الأوسط.
            </p>
            <div className="space-y-2">
              <p className="text-white/40 font-cairo text-xs">المقر: جدة، شارع التحلية</p>
              <a href="mailto:info@araak.org" className="text-gold-400 font-inter text-sm hover:text-gold-300 transition-colors" dir="ltr">info@araak.org</a>
              <p className="text-white/40 font-inter text-xs" dir="ltr">www.araaklogistics.com</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-cairo font-bold text-base mb-5 pb-3 border-b border-white/10">خدماتنا</h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                    className="text-white/50 hover:text-white font-cairo text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-cairo font-bold text-base mb-5 pb-3 border-b border-white/10">الشركة</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                    className="text-white/50 hover:text-white font-cairo text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Legal */}
          <div>
            <h4 className="text-white font-cairo font-bold text-base mb-5 pb-3 border-b border-white/10">ابق على اطلاع</h4>
            <p className="text-white/50 font-cairo text-sm mb-4">اشترك للحصول على آخر أخبارنا وعروضنا</p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl font-cairo text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-all"
                dir="ltr"
              />
              <button className="px-4 py-2.5 bg-gold-gradient text-brand-900 font-cairo font-bold text-sm rounded-xl hover:shadow-gold transition-all">
                اشتراك
              </button>
            </div>
            <ul className="space-y-2">
              {footerLinks.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/30 hover:text-white/60 font-cairo text-xs transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <p className="text-white/30 font-cairo text-sm">
            © {new Date().getFullYear()} اراك لوجستيك – جميع الحقوق محفوظة
          </p>
          <div className="flex items-center gap-4">
            <p className="text-white/20 font-cairo text-xs">مدعوم بإرث يو بي اتش (UPH)</p>
            <button
              onClick={scrollTop}
              className="w-9 h-9 bg-white/10 hover:bg-gold-gradient rounded-xl flex items-center justify-center transition-all duration-200 group"
              aria-label="العودة للأعلى"
            >
              <ArrowUp size={16} className="text-white/60 group-hover:text-brand-900 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
