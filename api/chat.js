import { GoogleGenAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `أنت "مساعد أراك الذكي"، الوكيل الافتراضي الرسمي لشركة "أراك لوجستيك" (Araak Logistics). مهمتك هي الإجابة على استفسارات العملاء باحترافية، وود، وبصياغة ممتازة باللغة العربية وبإيجاز مناسب للمحادثات.
معلومات الشركة الأساسية:
- تقدم خدمات شحن متكاملة ومخصصة لشركات الـ B2B.
- أراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة يو بي اتش الالكترونية (UPH Group).
- خدماتنا تشمل: الشحن البري، الشحن البحري، الشحن الجوي، التخليص الجمركي، التخزين، وإدارة سلاسل الإمداد.
- نغطي الشحن والتنقل بكفاءة عالية بين كافة مدن المملكة العربية السعودية (مثل الرياض، جدة، الدمام) بالإضافة للشحن الدولي.`;

export default async function handler(req, res) {
    // إعدادات CORS الشاملة لمنع تعارض المتصفحات
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const userMessage = body?.message || "";
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({ reply: "عذراً، لم يتم العثور على مفتاح السيرفر GEMINI_API_KEY في لوحة Vercel." });
        }

        // تهيئة الحزمة الرسمية المثبتة حديثاً
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        // استدعاء دالة توليد المحتوى المباشرة والمتوافقة مع بنية الحزمة المحدثة
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: userMessage || "مرحباً",
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
                maxOutputTokens: 450
            }
        });

        // استخراج النص الراجع من النتيجة مباشرة
        const aiReply = response?.text;

        if (aiReply) {
            return res.status(200).json({ reply: aiReply.trim() });
        } else {
            return res.status(200).json({ reply: "استلمت رسالتك، ولكن لم يتمكن المحرك من صياغة رد مناسب حالياً." });
        }

    } catch (error) {
        console.error("Gemini SDK Error:", error);
        // إرجاع تفاصيل الخطأ مباشرة على الواجهة لنعلم إن كان هناك قيود على المفتاح أو الحزمة
        return res.status(200).json({ reply: `تنبيه من السيرفر الداخلي: ${error.message}` });
    }
}