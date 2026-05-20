import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يتم ربط سكربت الإرسال (مثال: EmailJS أو Supabase Edge Function)
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-neutral-50" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس القسم الديناميكي */}
        <div className="text-center mb-16">
          <span className="text-brand-600 font-bold text-sm tracking-wider uppercase bg-brand-50 px-4 py-2 rounded-full">
            {t('contact.badge', 'تواصل معنا')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mt-4 mb-4">
            {t('contact.title', 'نحن هنا لمساعدتك')}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-base sm:text-lg">
            {t('contact.subtitle', 'فريقنا المتخصص على أتم الاستعداد للإجابة على استفساراتكم')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* معلومات الاتصال جانبية */}
          <div className="lg:col-span-1 bg-brand-950 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="space-y-8">
              <h3 className="text-xl font-bold">{t('nav.contact', 'بيانات الاتصال')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-gold-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-brand-300 text-xs">{t('contact.info.address.title', 'المقر الرئيسي')}</p>
                    <p className="text-sm font-semibold mt-1">{t('contact.info.address.value', 'جدة، المملكة العربية السعودية')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-gold-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-brand-300 text-xs">{t('contact.info.email.title', 'البريد الإلكتروني')}</p>
                    <p className="text-sm font-semibold mt-1 font-mono">info@araaklogistics.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-800 pt-6 mt-8">
              <p className="text-xs text-brand-400 mb-2">{t('contact.social.title', 'تابعنا على منصات التواصل')}</p>
              <p className="text-xs text-gold-500/80 italic">{t('contact.social.coming_soon', 'قريباً')}</p>
            </div>
          </div>

          {/* نموذج المراسلة الذكي */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="text-success-500 mx-auto mb-4 animate-bounce" size={56} />
                <h3 className="text-xl font-bold text-neutral-900">{t('contact.success.title')}</h3>
                <p className="text-neutral-500 mt-2 text-sm">{t('contact.success.desc')}</p>
                <button 
                  onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="mt-6 px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-semibold text-sm transition-all"
                >
                  {t('contact.success.btn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-700 text-sm font-semibold mb-2">{t('contact.fields.name.label')}</label>
                    <input 
                      type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder={t('contact.fields.name.placeholder')}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 text-sm font-semibold mb-2">{t('contact.fields.email.label')}</label>
                    <input 
                      type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-mono" dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-700 text-sm font-semibold mb-2">{t('contact.fields.phone.label')}</label>
                    <input 
                      type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm font-mono" dir="ltr" placeholder="+966 50 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 text-sm font-semibold mb-2">{t('contact.fields.subject.label')}</label>
                    <input 
                      type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                      placeholder={t('contact.fields.subject.placeholder')}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 text-sm font-semibold mb-2">{t('contact.fields.message.label')}</label>
                  <textarea 
                    rows={4} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder={t('contact.fields.message.placeholder')}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all text-sm resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-brand-gradient text-white font-bold rounded-xl shadow-brand hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} className={isArabic ? 'rotate-180' : ''} />
                  {t('contact.buttons.submit')}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}