import { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { supabase, type ContactMessage } from '../lib/supabase';

const contactInfo = [
  {
    icon: MapPin,
    title: 'المقر الرئيسي',
    value: 'جدة، شارع التحلية، المملكة العربية السعودية',
    link: null,
  },
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'info@araaklogistics.com',
    link: 'mailto:info@araak.org',
  },
  {
    icon: Phone,
    title: 'الموقع الإلكتروني',
    value: 'www.araaklogistics.com',
    link: 'https://www.araaklogistics.com',
  },
];

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof initialForm, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const msg: ContactMessage = { ...form };
      const { error: err } = await supabase.from('contact_messages').insert([msg]);
      if (err) throw err;
      setSuccess(true);
      setForm(initialForm);
    } catch {
      setError('حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-brand-700 font-cairo text-sm font-semibold">تواصل معنا</span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">نحن هنا لمساعدتك</h2>
          <p className="text-neutral-600 font-cairo text-lg max-w-xl mx-auto">فريقنا المتخصص جاهز للإجابة على استفساراتك وتقديم أفضل الحلول اللوجستية</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((c) => (
              <div key={c.title} className="flex items-start gap-4 p-6 bg-white border border-neutral-200 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200">
                <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-brand">
                  <c.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-neutral-500 font-cairo text-xs mb-1">{c.title}</p>
                  {c.link ? (
                    <a href={c.link} className="text-neutral-900 font-cairo font-semibold text-sm hover:text-brand-600 transition-colors" dir="ltr">{c.value}</a>
                  ) : (
                    <p className="text-neutral-900 font-cairo font-semibold text-sm">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social Media */}
            <div className="p-6 bg-brand-900 rounded-2xl">
              <h4 className="text-white font-cairo font-bold text-sm mb-4">تابعنا على</h4>
              <div className="flex gap-3">
                {['X', 'LinkedIn', 'Instagram', 'YouTube'].map((s) => (
                  <button
                    key={s}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-inter text-xs font-semibold transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-white/50 font-cairo text-xs mt-3">قريباً – ربط كامل مع منصات التواصل</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white border border-neutral-200 rounded-3xl shadow-card">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-success-500" />
                </div>
                <h3 className="font-cairo font-black text-neutral-900 text-2xl mb-3">تم إرسال رسالتك!</h3>
                <p className="text-neutral-600 font-cairo text-base mb-6">سيتواصل معك فريقنا في أقرب وقت ممكن</p>
                <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-brand-gradient text-white font-cairo font-bold rounded-xl shadow-brand">إرسال رسالة أخرى</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-3xl shadow-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { key: 'name' as const, label: 'الاسم', placeholder: 'اسمك الكامل', type: 'text' },
                    { key: 'email' as const, label: 'البريد الإلكتروني', placeholder: 'email@example.com', type: 'email' },
                    { key: 'phone' as const, label: 'رقم الجوال (اختياري)', placeholder: '+966 5X XXX XXXX', type: 'tel' },
                    { key: 'subject' as const, label: 'الموضوع', placeholder: 'موضوع رسالتك', type: 'text' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
                        dir={f.type === 'email' || f.type === 'tel' ? 'ltr' : 'rtl'}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-neutral-700 font-cairo font-semibold text-sm mb-2">الرسالة</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all resize-none"
                  />
                </div>

                {error && <p className="text-error-500 font-cairo text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-brand-gradient text-white font-cairo font-bold text-base rounded-xl shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
