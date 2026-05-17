import { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'تتبع الشحنة', href: '#track' },
  { label: 'عن اراك', href: '#about' },
  { label: 'الشركاء', href: '#partners' },
  { label: 'تواصل معنا', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-900/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo('#home'); }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
            <span className="text-brand-900 font-cairo font-black text-lg leading-none">ل</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-cairo font-bold text-xl tracking-wide">اراك لوجستيك</span>
            <span className="text-gold-400 font-inter text-xs tracking-widest uppercase">Araak Logistics</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="px-4 py-2 text-white/80 hover:text-white font-cairo text-sm font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Toggle */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-white/80 hover:text-white text-sm font-inter border border-white/20 rounded-lg hover:border-white/40 transition-all"
            >
              <Globe size={14} />
              <span>AR</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute left-0 mt-2 w-28 bg-brand-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <button className="w-full text-right px-4 py-2.5 text-white text-sm font-cairo hover:bg-white/10 transition-colors">العربية</button>
                <button className="w-full text-right px-4 py-2.5 text-white/70 text-sm font-inter hover:bg-white/10 transition-colors">English</button>
              </div>
            )}
          </div>

          <a
            href="#quote"
            onClick={(e) => { e.preventDefault(); scrollTo('#quote'); }}
            className="px-5 py-2.5 bg-gold-gradient text-brand-900 font-cairo font-bold text-sm rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            احصل على عرض سعر
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden bg-brand-900/98 backdrop-blur-md border-t border-white/10 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="px-4 py-3 text-white/80 hover:text-white font-cairo text-base font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={(e) => { e.preventDefault(); scrollTo('#quote'); }}
              className="mt-2 px-5 py-3 bg-gold-gradient text-brand-900 font-cairo font-bold text-base rounded-xl text-center shadow-gold"
            >
              احصل على عرض سعر
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
