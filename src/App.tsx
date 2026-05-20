import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import TrackShipment from './components/TrackShipment';
import WhyAraak from './components/WhyAraak'; // توحيد المسمى التجاري للمكون هنا وفي اسم الملف
import QuoteForm from './components/QuoteForm';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

function App() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  // تأثير لمراقبة لغة الموقع وقلب اتجاه الصفحة (RTL / LTR) تلقائياً
  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    // تحديث خصائص عنصر الـ HTML الرئيسي للموقع بالكامل
    document.documentElement.dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  return (
    <div 
      className={`min-h-screen bg-white text-gray-900 selection:bg-gold-500/30 selection:text-brand-950 transition-colors duration-150 ${
        isArabic ? 'font-cairo' : 'font-inter antialiased'
      }`}
    >
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <TrackShipment />
        <WhyAraak /> {/* استخدام المكون بالهوية الصحيحة الموحدة */}
        <QuoteForm />
        <Partners />
        <Contact />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}

export default App;