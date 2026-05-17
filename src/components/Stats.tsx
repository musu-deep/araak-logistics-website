import { useEffect, useRef, useState } from 'react';
import { Globe as Globe2, Package, Users, Award } from 'lucide-react';

const stats = [
  { icon: Globe2, value: 45, suffix: '+', label: 'دولة حول العالم', sublabel: 'شبكة وكلاء عالمية' },
  { icon: Package, value: 50000, suffix: '+', label: 'شحنة سنوياً', sublabel: 'كفاءة تشغيلية عالية' },
  { icon: Users, value: 500, suffix: '+', label: 'عميل موثوق', sublabel: 'شركات وأفراد' },
  { icon: Award, value: 15, suffix: '+', label: 'عاماً من الخبرة', sublabel: 'عبر إرث UPH' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(Math.round(current));
            if (current >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('ar-SA')}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-hero-gradient relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-cairo font-black text-white text-4xl mb-4">أرقام تتحدث عن نفسها</h2>
          <p className="text-white/60 font-cairo text-lg">ثقة مبنية على سنوات من العمل والإنجاز</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-5 group-hover:bg-gold-gradient group-hover:shadow-gold transition-all duration-300">
                <s.icon size={26} className="text-gold-400 group-hover:text-brand-900 transition-colors duration-300" />
              </div>
              <div className="font-cairo font-black text-white text-4xl mb-2">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white font-cairo font-semibold text-base mb-1">{s.label}</div>
              <div className="text-white/50 font-cairo text-xs">{s.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
