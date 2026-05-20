import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Send, Building2, ShoppingCart, Landmark, Star } from 'lucide-react';
import { supabase, type QuoteRequest } from '../lib/supabase';

type ServiceType = 'B2B' | 'B2C' | 'B2G' | 'B2Service';

const initialForm: Omit<QuoteRequest, 'id' | 'status' | 'created_at'> = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service_type: 'B2C',
  origin: '',
  destination: '',
  weight: undefined,
  dimensions: '',
  description: '',
};

export default function QuoteForm() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialForm, string>>>({});

  const isArabic = i18n.language?.startsWith('ar');

  // خيارات نوع الخدمة المستندة إلى الترجمة الديناميكية
  const serviceOptions: { value: ServiceType; label: string; icon: React.ElementType; desc: string }[] = [
    { value: 'B2B', label: t('quote.services.b2b.label', 'شركات ومشاريع'), icon: Building2, desc: t('quote.services.b2b.desc', 'للشركات والمشاريع الكبرى') },
    { value: 'B2C', label: t('quote.services.b2c.label', 'تجارة إلكترونية'), icon: ShoppingCart, desc: t('quote.services.b2c.desc', 'للمتاجر والأفراد') },
    { value: 'B2G', label: t('quote.services.b2g.label', 'جهات حكومية'), icon: Landmark, desc: t('quote.services.b2g.desc', 'للقطاع الحكومي') },
    { value: 'B2Service', label: t('quote.services.b2service.label', 'خدمات متخصصة'), icon: Star, desc: t('quote.services.b2service.desc', 'حج، عمرة، شحن جوي') },
  ];

  // مصفوفة معلومات الاتصال الشخصية
  const personalFields = [
    { key: 'name' as const, label: t('quote.fields.name.label', 'الاسم الكامل'), placeholder: t('quote.fields.name.placeholder', 'محمد أحمد'), type: 'text' },
    { key: 'email' as const, label: t('quote.fields.name.email_label', 'البريد الإلكتروني'), placeholder: 'example@email.com', type: 'email' },
    { key: 'phone' as const, label: t('quote.fields.name.phone_label', 'رقم الجوال'), placeholder: '+966 5X XXX XXXX', type: 'tel' },
    { key: 'company' as const, label: t('quote.fields.name.company_label', 'اسم الشركة (اختياري)'), placeholder: t('quote.fields.name.company_placeholder', 'شركة ...'), type: 'text' },
  ];

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = t('quote.errors.name', 'الاسم مطلوب');
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t('quote.errors.email', 'البريد الإلكتروني غير صحيح');
    if (!form.phone.trim()) e.phone = t('quote.errors.phone', 'رقم الجوال مطلوب');
    if (!form.origin.trim()) e.origin = t('quote.errors.origin', 'مكان الاستلام مطلوب');
    if (!form.destination.trim()) e.destination = t('quote.errors.destination', 'مكان التسليم مطلوب');
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.from('quote_requests').insert([{
        ...form,
        weight: form.weight ?? 0,
      }]);
      if (error) throw error;
      setSuccess(true);
      setForm(initialForm);
    } catch {
      setErrors({ name: t('quote.errors.server', 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.') });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof initialForm, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  // شاشة نجاح الإرسال المترجمة
  if (success) {
    return (
      <section id="quote" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h3 className="font-cairo font-black text-neutral-900 text-3xl mb-4">
            {t('quote.success.title', 'تم إرسال طلبك بنجاح!')}
          </h3>
          <p className="text-neutral-600 font-cairo text-lg mb-8">
            {t('quote.success.desc', 'سيتواصل معك فريق لاراك لوجستيك خلال 24 ساعة لمناقشة متطلباتك وتقديم أفضل عرض.')}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-3.5 bg-brand-gradient text-white font-cairo font-bold rounded-xl shadow-brand hover:shadow-lg transition-all"
          >
            {t('quote.success.btn', 'إرسال طلب آخر')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس القسم */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-gold-700 font-cairo text-sm font-semibold">
              {t('quote.badge', 'احصل على عرض سعر')}
            </span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">
            {t('quote.title', 'اطلب خدمتك الآن')}
          </h2>
          <p className="text-neutral-600 font-cairo text-lg">
            {t('quote.subtitle', 'أدخل تفاصيل شحنتك وسنتواصل معك بأسرع وقت بأفضل عرض')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-3xl shadow-card p-8 space-y-8">
          
          {/* اختيار نوع الخدمة لوجستياً */}
          <div>
            <label className="block text-neutral-700 font-cairo font-bold text-sm mb-3">
              {t('quote.sections.service_type', 'نوع الخدمة')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {serviceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('service_type', opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200 ${
                    form.service_type === opt.value
                      ? 'border-brand-400 bg-brand-50 shadow-brand'
                      : 'border-neutral-200 bg-white hover:border-brand-200'
                  }`}
                >
                  <opt.icon size={20} className={form.service_type === opt.value ? 'text-brand-600' : 'text-neutral-400'} />
                  <span className={`font-cairo font-bold text-xs ${form.service_type === opt.value ? 'text-brand-700' : 'text-neutral-600'}`}>{opt.label}</span>
                  <span className="text-neutral-400 font-cairo text-xs hidden sm:block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* البيانات الشخصية وبيانات الاتصال */}
          <div className="grid sm:grid-cols-2 gap-5">
            {personalFields.map((f) => (
              <div key={f.key}>
                <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white transition-all ${
                    errors[f.key] ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-brand-400'
                  }`}
                  dir={f.type === 'email' || f.type === 'tel' ? 'ltr' : (isArabic ? 'rtl' : 'ltr')}
                />
                {errors[f.key] && <p className="text-red-500 font-cairo text-xs mt-1">{errors[f.key]}</p>}
              </div>
            ))}
          </div>

          {/* تفاصيل خط سير الشحنة ومعطيات الوزن */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">
                {t('quote.fields.shipment.origin_label', 'مكان الاستلام')}
              </label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => set('origin', e.target.value)}
                placeholder={t('quote.fields.shipment.origin_placeholder', 'جدة، المملكة العربية السعودية')}
                className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white transition-all ${errors.origin ? 'border-red-500' : 'border-neutral-200 focus:border-brand-400'}`}
              />
              {errors.origin && <p className="text-red-500 font-cairo text-xs mt-1">{errors.origin}</p>}
            </div>
            
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">
                {t('quote.fields.shipment.dest_label', 'مكان التسليم')}
              </label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => set('destination', e.target.value)}
                placeholder={t('quote.fields.shipment.dest_placeholder', 'الرياض، المملكة العربية السعودية')}
                className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white transition-all ${errors.destination ? 'border-red-500' : 'border-neutral-200 focus:border-brand-400'}`}
              />
              {errors.destination && <p className="text-red-500 font-cairo text-xs mt-1">{errors.destination}</p>}
            </div>
            
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">
                {t('quote.fields.shipment.weight_label', 'الوزن (كجم)')}
              </label>
              <input
                type="number"
                value={form.weight ?? ''}
                onChange={(e) => set('weight', parseFloat(e.target.value) || 0)}
                placeholder="0.5"
                min="0"
                step="0.1"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">
                {t('quote.fields.shipment.dim_label', 'الأبعاد (اختياري)')}
              </label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => set('dimensions', e.target.value)}
                placeholder={t('quote.fields.shipment.dim_placeholder', '50×40×30 سم')}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* وصف محتويات الشحنة */}
          <div>
            <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">
              {t('quote.fields.shipment.desc_label', 'وصف البضاعة (اختياري)')}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder={t('quote.fields.shipment.desc_placeholder', 'اذكر نوع البضاعة وأي متطلبات خاصة...')}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all resize-none"
            />
          </div>

          {errors.name && errors.name.includes('خطأ') && (
            <p className="text-red-500 font-cairo text-sm text-center">{errors.name}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gold-gradient text-brand-900 font-cairo font-black text-base rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-brand-700/30 border-t-brand-900 rounded-full animate-spin" />
                <span>{t('quote.buttons.sending', 'جارٍ الإرسال...')}</span>
              </>
            ) : (
              <>
                <Send size={18} className={isArabic ? '' : 'rotate-180'} />
                <span>{t('quote.buttons.submit', 'إرسال طلب عرض السعر')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}