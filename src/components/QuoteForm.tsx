import { useState } from 'react';
import { CheckCircle, Send, Building2, ShoppingCart, Landmark, Star } from 'lucide-react';
import { supabase, type QuoteRequest } from '../lib/supabase';

type ServiceType = 'B2B' | 'B2C' | 'B2G' | 'B2Service';

const serviceOptions: { value: ServiceType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'B2B', label: 'شركات ومشاريع', icon: Building2, desc: 'للشركات والمشاريع الكبرى' },
  { value: 'B2C', label: 'تجارة إلكترونية', icon: ShoppingCart, desc: 'للمتاجر والأفراد' },
  { value: 'B2G', label: 'جهات حكومية', icon: Landmark, desc: 'للقطاع الحكومي' },
  { value: 'B2Service', label: 'خدمات متخصصة', icon: Star, desc: 'حج، عمرة، شحن جوي' },
];

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
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initialForm, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'البريد الإلكتروني غير صحيح';
    if (!form.phone.trim()) e.phone = 'رقم الجوال مطلوب';
    if (!form.origin.trim()) e.origin = 'مكان الاستلام مطلوب';
    if (!form.destination.trim()) e.destination = 'مكان التسليم مطلوب';
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
      setErrors({ name: 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.' });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof initialForm, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  if (success) {
    return (
      <section id="quote" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success-50 rounded-full mb-6">
            <CheckCircle size={40} className="text-success-500" />
          </div>
          <h3 className="font-cairo font-black text-neutral-900 text-3xl mb-4">تم إرسال طلبك بنجاح!</h3>
          <p className="text-neutral-600 font-cairo text-lg mb-8">سيتواصل معك فريق لاراك لوجستيك خلال 24 ساعة لمناقشة متطلباتك وتقديم أفضل عرض.</p>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-3.5 bg-brand-gradient text-white font-cairo font-bold rounded-xl shadow-brand hover:shadow-lg transition-all"
          >
            إرسال طلب آخر
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            <span className="text-gold-700 font-cairo text-sm font-semibold">احصل على عرض سعر</span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">اطلب خدمتك الآن</h2>
          <p className="text-neutral-600 font-cairo text-lg">أدخل تفاصيل شحنتك وسنتواصل معك بأسرع وقت بأفضل عرض</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-3xl shadow-card p-8 space-y-8">
          {/* Service Type */}
          <div>
            <label className="block text-neutral-700 font-cairo font-bold text-sm mb-3">نوع الخدمة</label>
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

          {/* Personal Info */}
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { key: 'name' as const, label: 'الاسم الكامل', placeholder: 'محمد أحمد', type: 'text' },
              { key: 'email' as const, label: 'البريد الإلكتروني', placeholder: 'example@email.com', type: 'email' },
              { key: 'phone' as const, label: 'رقم الجوال', placeholder: '+966 5X XXX XXXX', type: 'tel' },
              { key: 'company' as const, label: 'اسم الشركة (اختياري)', placeholder: 'شركة ...',  type: 'text' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white transition-all ${
                    errors[f.key] ? 'border-error-500 focus:border-error-500' : 'border-neutral-200 focus:border-brand-400'
                  }`}
                  dir={f.type === 'email' || f.type === 'tel' ? 'ltr' : 'rtl'}
                />
                {errors[f.key] && <p className="text-error-500 font-cairo text-xs mt-1">{errors[f.key]}</p>}
              </div>
            ))}
          </div>

          {/* Shipment Details */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">مكان الاستلام</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => set('origin', e.target.value)}
                placeholder="جدة، المملكة العربية السعودية"
                className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white transition-all ${errors.origin ? 'border-error-500' : 'border-neutral-200 focus:border-brand-400'}`}
              />
              {errors.origin && <p className="text-error-500 font-cairo text-xs mt-1">{errors.origin}</p>}
            </div>
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">مكان التسليم</label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => set('destination', e.target.value)}
                placeholder="الرياض، المملكة العربية السعودية"
                className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white transition-all ${errors.destination ? 'border-error-500' : 'border-neutral-200 focus:border-brand-400'}`}
              />
              {errors.destination && <p className="text-error-500 font-cairo text-xs mt-1">{errors.destination}</p>}
            </div>
            <div>
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">الوزن (كجم)</label>
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
              <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">الأبعاد (اختياري)</label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => set('dimensions', e.target.value)}
                placeholder="50×40×30 سم"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">وصف البضاعة (اختياري)</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="اذكر نوع البضاعة وأي متطلبات خاصة..."
              rows={4}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all resize-none"
            />
          </div>

          {errors.name && errors.name.includes('خطأ') && (
            <p className="text-error-500 font-cairo text-sm text-center">{errors.name}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gold-gradient text-brand-900 font-cairo font-black text-base rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-brand-700/30 border-t-brand-900 rounded-full animate-spin" />
                <span>جارٍ الإرسال...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>إرسال طلب عرض السعر</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
