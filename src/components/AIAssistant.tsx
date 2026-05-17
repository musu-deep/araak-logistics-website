import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minimize2, Maximize2, Truck, Package, FileCheck, Calculator } from 'lucide-react';

type Message = {
  role: 'user' | 'bot';
  text: string;
  time: string;
};

const quickReplies = [
  { icon: Truck, label: 'خدمات الشحن' },
  { icon: Package, label: 'تتبع شحنة' },
  { icon: FileCheck, label: 'تخليص جمركي' },
  { icon: Calculator, label: 'احسب التكلفة' },
];

const knowledgeBase: [RegExp, string][] = [
  [
    /شحن|خدمات|ماذا تقدم/i,
    'تقدم اراك لوجستيك خدمات متكاملة:\n• **B2B** – شحن للشركات والصناعات الثقيلة\n• **B2C** – تجارة إلكترونية وتوصيل للأفراد\n• **B2G** – تخليص جمركي للقطاع الحكومي\n• **B2Service** – خدمات ضيوف الرحمن وشحن جوي مخصص\n\nأي قطاع يهمك أكثر؟',
  ],
  [
    /تتبع|tracking|رقم التتبع/i,
    'يمكنك تتبع شحنتك بسهولة!\n\nاذهب لقسم **"تتبع الشحنة"** في الصفحة الرئيسية وأدخل رقم التتبع (مثال: ARK-2024-001).\n\nسيظهر لك:\n• الموقع الحالي للشحنة\n• تاريخ التسليم المتوقع\n• جميع محطات الرحلة',
  ],
  [
    /جمارك|تخليص|customs/i,
    'خدمات التخليص الجمركي تشمل:\n• التخليص في جميع الموانئ البحرية والجافة\n• المطارات والحدود البرية\n• الإعفاء الجمركي والاستيراد المؤقت\n• التعامل مع المواد الخطرة والمقيدة\n• استخراج التصاريح والتوثيق\n\nللحصول على عرض سعر متخصص، يرجى التواصل مع فريقنا.',
  ],
  [
    /سعر|تكلفة|كم|عرض/i,
    'نقدم نظام تسعير ديناميكي ومرن!\n\n**للشركات (B2B/B2G):**\nعقود سنوية مخصصة (SLA) مبنية على حجم العمليات.\n\n**للأفراد والتجارة الإلكترونية (B2C):**\nاحصل على عرض فوري من خلال قسم "طلب عرض سعر" وأدخل:\n• أبعاد الشحنة ووزنها\n• مكان الاستلام والتسليم\n• عدد القطع\n\nهل تريد الانتقال لنموذج طلب العرض الآن؟',
  ],
  [
    /حج|عمرة|ضيوف الرحمن/i,
    'خدمة ضيوف الرحمن من اراك لوجستيك:\n\n• نقل عفش وأمتعة الحجاج والمعتمرين\n• من المطارات والموانئ مباشرة\n• إلى مكة المكرمة والمدينة المنورة\n• City Terminal لوزن الأمتعة\n• إعادة الشحن عند المغادرة\n\nخدمة مستلهمة من نجاحات شركة UPH الراسخة في هذا المجال.',
  ],
  [
    /تواصل|اتصال|contact|هاتف|جوال/i,
    'يمكنك التواصل مع فريق اراك لوجستيك:\n\n📍 **المقر:** جدة، شارع التحلية\n📧 **البريد:** info@araak.org\n🌐 **الموقع:** www.araaklogistics.com\n\nأو استخدم نموذج التواصل في أسفل الصفحة، وسيرد عليك فريقنا خلال 24 ساعة.',
  ],
  [
    /uph|يو بي اتش|مجموعة/i,
    'اراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة **يو بي اتش (UPH)**.\n\nتدمج اراك بين:\n• البنية التحتية وخبرات UPH التشغيلية العميقة\n• الحلول الرقمية والابتكارية للجيل القادم\n\nهدفنا: تقديم محطة واحدة لكل الاحتياجات اللوجستية (One-Stop Shop).',
  ],
  [
    /مرحبا|السلام|هلا|اهلا|مساء|صباح/i,
    'أهلاً وسهلاً! أنا المساعد الذكي لـ اراك لوجستيك. 🚚\n\nيمكنني مساعدتك في:\n• معرفة خدماتنا اللوجستية\n• تتبع شحناتك\n• الاستفسار عن الأسعار والتخليص الجمركي\n\nما الذي تحتاج مساعدة فيه اليوم؟',
  ],
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [pattern, response] of knowledgeBase) {
    if (pattern.test(lower)) return response;
  }
  return 'شكراً لسؤالك! فريق اراك لوجستيك سيسعد بمساعدتك بشكل أفضل.\n\nيمكنك:\n• **اتصال مباشر:** info@araak.org\n• **طلب عرض سعر** من نموذج الطلب\n• أو اسألني عن: الشحن، التخليص، الأسعار، التتبع';
}

function now() {
  return new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'أهلاً! أنا مساعد اراك الذكي. كيف يمكنني مساعدتك في خدماتنا اللوجستية؟',
      time: now(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text: text.trim(), time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = { role: 'bot', text: getResponse(text), time: now() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-brand-gradient rounded-full shadow-brand flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all duration-200 group"
          aria-label="المساعد الذكي"
        >
          <Bot size={26} className="text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={`fixed bottom-6 left-6 z-50 w-[360px] bg-white rounded-3xl shadow-2xl border border-neutral-200 flex flex-col transition-all duration-300 overflow-hidden ${
            minimized ? 'h-16' : 'h-[520px]'
          }`}
        >
          {/* Header */}
          <div className="bg-brand-gradient px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-cairo font-bold text-sm">مساعد اراك الذكي</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                  <span className="text-white/70 font-cairo text-xs">متاح الآن</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimized(!minimized)}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                {minimized ? <Maximize2 size={13} className="text-white" /> : <Minimize2 size={13} className="text-white" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={13} className="text-white" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[82%] ${m.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm font-cairo leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-brand-gradient text-white rounded-tr-sm'
                            : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {renderText(m.text)}
                      </div>
                      <p className={`text-neutral-300 font-inter text-xs mt-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`} dir="ltr">
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-end">
                    <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-2 overflow-x-auto">
                {quickReplies.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 font-cairo text-xs whitespace-nowrap hover:border-brand-300 hover:text-brand-600 transition-all flex-shrink-0"
                  >
                    <q.icon size={12} />
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-neutral-100 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand hover:shadow-lg transition-all disabled:opacity-40"
                >
                  <Send size={15} className="text-white" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
