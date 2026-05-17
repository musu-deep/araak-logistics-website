import { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Warehouse, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { supabase, type ShipmentTracking } from '../lib/supabase';

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  warehouse: Warehouse,
  truck: Truck,
  check: CheckCircle,
  'check-circle': CheckCircle,
};

const statusStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  in_transit: { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500', label: 'في الطريق' },
  delivered:  { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500', label: 'تم التسليم' },
  pending:    { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-500', label: 'قيد المعالجة' },
  customs:    { bg: 'bg-gold-50', text: 'text-gold-700', dot: 'bg-gold-500', label: 'التخليص الجمركي' },
};

export default function TrackShipment() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShipmentTracking | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setError('');

    try {
      const { data, error: err } = await supabase
        .from('shipment_tracking')
        .select('*')
        .eq('tracking_number', query.trim().toUpperCase())
        .maybeSingle();

      if (err) throw err;
      if (!data) { setNotFound(true); }
      else { setResult(data); }
    } catch {
      setError('حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const style = result ? (statusStyles[result.status] ?? statusStyles.in_transit) : null;

  return (
    <section id="track" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-brand-700 font-cairo text-sm font-semibold">تتبع فوري</span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">تتبع شحنتك</h2>
          <p className="text-neutral-600 font-cairo text-lg">أدخل رقم التتبع لمعرفة حالة شحنتك في الوقت الفعلي</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="أدخل رقم التتبع (مثال: ARK-2024-001)"
              className="w-full pr-12 pl-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-cairo text-neutral-900 placeholder-neutral-400 text-base focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-brand-gradient text-white font-cairo font-bold text-base rounded-2xl shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'تتبع'
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className="text-center text-neutral-400 font-cairo text-sm mb-8">
          جرب: <button onClick={() => setQuery('ARK-2024-001')} className="text-brand-500 hover:underline">ARK-2024-001</button> أو <button onClick={() => setQuery('ARK-2024-002')} className="text-brand-500 hover:underline">ARK-2024-002</button>
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-error-50 border border-red-200 rounded-2xl mb-6">
            <AlertCircle size={18} className="text-error-500 flex-shrink-0" />
            <p className="text-error-600 font-cairo text-sm">{error}</p>
          </div>
        )}

        {/* Not Found */}
        {notFound && (
          <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-200">
            <Package size={48} className="text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 font-cairo font-semibold text-lg">لم يتم العثور على الشحنة</p>
            <p className="text-neutral-400 font-cairo text-sm mt-2">تأكد من رقم التتبع وحاول مرة أخرى</p>
          </div>
        )}

        {/* Result */}
        {result && style && (
          <div className="bg-white border border-neutral-200 rounded-3xl shadow-card overflow-hidden animate-fade-up">
            {/* Status Bar */}
            <div className={`${style.bg} px-8 py-5 flex items-center justify-between`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse`} />
                  <span className={`font-cairo font-bold text-lg ${style.text}`}>{style.label}</span>
                </div>
                <span className="text-neutral-500 font-inter text-sm font-mono">{result.tracking_number}</span>
              </div>
              <div className={`px-4 py-2 rounded-xl border ${style.text} border-current font-cairo font-bold text-sm`}>
                {result.service_type}
              </div>
            </div>

            {/* Details */}
            <div className="p-8 grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-neutral-400 font-cairo text-xs mb-1">المنشأ</p>
                  <p className="text-neutral-900 font-cairo font-semibold text-sm">{result.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-success-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-success-600" />
                </div>
                <div>
                  <p className="text-neutral-400 font-cairo text-xs mb-1">الوجهة</p>
                  <p className="text-neutral-900 font-cairo font-semibold text-sm">{result.destination}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gold-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck size={16} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-neutral-400 font-cairo text-xs mb-1">الموقع الحالي</p>
                  <p className="text-neutral-900 font-cairo font-semibold text-sm">{result.current_location || '—'}</p>
                </div>
              </div>
              {result.estimated_delivery && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-neutral-400 font-cairo text-xs mb-1">التسليم المتوقع</p>
                    <p className="text-neutral-900 font-cairo font-semibold text-sm">
                      {new Date(result.estimated_delivery).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            {result.events && result.events.length > 0 && (
              <div className="border-t border-neutral-100 px-8 py-6">
                <h4 className="font-cairo font-bold text-neutral-900 text-base mb-5">مراحل الشحنة</h4>
                <div className="space-y-4">
                  {[...result.events].reverse().map((event, i) => {
                    const Icon = iconMap[event.icon] ?? Package;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-brand-gradient shadow-brand' : 'bg-neutral-100'}`}>
                            <Icon size={16} className={i === 0 ? 'text-white' : 'text-neutral-500'} />
                          </div>
                          {i < result.events!.length - 1 && <div className="w-px flex-1 bg-neutral-200 mt-2" />}
                        </div>
                        <div className="pb-4 flex-1">
                          <p className={`font-cairo font-semibold text-sm ${i === 0 ? 'text-neutral-900' : 'text-neutral-600'}`}>{event.status}</p>
                          <p className="text-neutral-400 font-cairo text-xs mt-0.5">{event.location}</p>
                          <p className="text-neutral-300 font-inter text-xs mt-1" dir="ltr">
                            {new Date(event.timestamp).toLocaleString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
