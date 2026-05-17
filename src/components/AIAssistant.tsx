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

// التعليمات الصارمة لتوجيه الذكاء الاصطناعي وتقييده بهوية الشركة وبياناتها المستقرة
const SYSTEM_INSTRUCTION = `
أنت "مساعد أراك الذكي"، الوكيل الافتراضي الرسمي لشركة "أراك لوجستيك" (Araak Logistics). 
مهمتك هي الإجابة على استفسارات العملاء باحترافية، وود، وبصياغة ممتازة باللغة العربية.

معلومات الشركة الأساسية التي يجب أن تعتمد عليها دائماً:
1. الهوية والتبعية: أراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة يو بي اتش (UPH). تدمج بين البنية التحتية وخبرات UPH التشغيلية العميقة والحلول الرقمية والابتكارية (مفهوم المحطة الواحدة One-Stop Shop).
2. خدمات الشحن اللوجستية:
   - B2B: شحن للشركات والصناعات الثقيلة وعقود سنوية (SLA) مبنية على حجم العمليات.
   - B2C: تجارة إلكترونية وتوصيل للأفراد (تعتمد على أبعاد الوزن، ومكان الاستلام والتسليم).
   - B2G: تخليص جمركي ولوجستيات للقطاع الحكومي.
   - B2Service / خدمات ضيوف الرحمن: شحن مخصص، نقل عفش وأمتعة الحجاج والمعتمرين من المطارات والموانئ مباشرة إلى مكة والمدينة، مع ميزة City Terminal لوزن الأمتعة وإعادة الشحن عند المغادرة (مستلهمة من نجاح UPH الراسخ).
3. التتبع: يمكن تتبع الشحنات عبر قسم "تتبع الشحنة" بالصفحة الرئيسية باستخدام رقم التتبع (مثل ARK-2024-001).
4. التخليص الجمركي: يشمل التخليص في جميع الموانئ البحرية والجافة، المطارات، الحدود البرية، الإعفاء الجمركي، التعامل مع المواد المقيدة، واستخراج التصاريح.
5. معلومات التواصل: المقر الرئيسي في جدة (شارع التحلية)، البريد الإلكتروني: info@araak.org، الموقع: www.araaklogistics.com.

قواعد عامة للرد:
- حافظ على الاختصار والوضوح واستخدم النقاط (•) لترتيب النصوص الطويلة.
- إذا سألك العميل عن أسعار محددة بالأرقام، اطلب منه استخدام نموذج "طلب عرض سعر" في الموقع أو تزويدك بالوزن والوجهة لمساعدته، وأخبره أن الأسعار ديناميكية ومرنة.
- إذا سُئلت عن أمور خارج نطاق الخدمات اللوجستية أو شركة أراك، اعتذر بذكاء ووجه العميل للسؤال عما يخص الشحن والتخليص الجمركي.
`;

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
      text: 'أهلاً! أنا مساعد اراك الذكي. كيف يمكنني مساعدتك في خدماتنا اللوجستية اليوم؟',
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

  // دالة الاستدعاء المباشر لـ API
  const fetchAIResponse = async (userText: string): Promise<string> => {
    // 💡 ملاحظة مستقبلية لدمج "واعي": بمجرد أن يصبح واعي جاهزاً على سيرفرك، استبدل هذا الرابط برابط سيرفر واعي المباشر.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API Key is missing. Please check your environment variables.");
      return 'عذراً، أواجه مشكلة مؤقتة في الاتصال بالخادم الرئيسي حالياً. يمكنك تكرار محاولتك أو مراسلتنا مباشرة عبر info@araak.org';
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${SYSTEM_INSTRUCTION}\n\nسؤال المستخدم الحالي: ${userText}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.5, // درجة انضباط متوسطة لضمان التزام الذكاء الاصطناعي بالبيانات المعطاة وعدم الارتجال الخارجي
            maxOutputTokens: 400
          }
        })
      });

      const data = await response.json();
      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiReply) {
        return aiReply.trim();
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("AI Request Error:", error);
      return 'شكراً لسؤالك! أواجه صعوبة في معالجة الرد اللحظي الآن. يرجى محاولة طرح سؤالك مرة أخرى أو استخدام نموذج تواصل معنا بأسفل الصفحة.';
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    
    const userMsg: Message = { role: 'user', text: text.trim(), time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // استدعاء دالة الـ API والانتظار حتى انتهاء المعالجة الحية
    const replyText = await fetchAIResponse(text.trim());
    
    const botMsg: Message = { role: 'bot', text: replyText, time: now() };
    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
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
                  <span className="text-white/70 font-cairo text-xs">متاح الآن بذكاء حي</span>
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
                    disabled={typing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 font-cairo text-xs whitespace-nowrap hover:border-brand-300 hover:text-brand-600 transition-all flex-shrink-0 disabled:opacity-50"
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
                  placeholder={typing ? "جاري معالجة الرد اللوجستي..." : "اكتب سؤالك هنا..."}
                  disabled={typing}
                  className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-brand-400 focus:bg-white transition-all disabled:opacity-60"
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
