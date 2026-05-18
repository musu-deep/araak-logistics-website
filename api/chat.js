const SYSTEM_INSTRUCTION = `أنت "مساعد أراك الذكي"، الوكيل الافتراضي الرسمي لشركة "أراك لوجستيك" (Araak Logistics). مهمتك هي الإجابة على استفسارات العملاء باحترافية، وود، وبصياغة ممتازة باللغة العربية وبإيجاز مناسب للمحادثات.
معلومات الشركة الأساسية:
- تقدم خدمات شحن متكاملة ومخصصة لشركات الـ B2B.
- أراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة يو بي اتش الالكترونية (UPH Group).
- خدماتنا تشمل: الشحن البري، الشحن البحري، الشحن الجوي، التخليص الجمركي، التخزين، وإدارة سلاسل الإمداد.
- نغطي الشحن والتنقل بكفاءة عالية بين كافة مدن المملكة العربية السعودية (مثل الرياض، جدة، الدمام) بالإضافة للشحن الدولي.`;

export default async function handler(req, res) {
    // إعدادات CORS الشاملة
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
        // تأمين قراءة الـ body سواء كان كائن جاهز أو نص بحاجة لمعالجة
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const userMessage = body?.message || "";
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(200).json({ reply: "عذراً، لم يتم العثور على مفتاح السيرفر GEMINI_API_KEY في لوحة Vercel." });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // إرسال الطلب بالهيكلية الرسمية لـ Gemini 1.5
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                contents: [{
                    role: 'user',
                    parts: [{ text: userMessage || "مرحباً" }]
                }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 400 
                }
            })
        });

        const data = await apiResponse.json();

        // إذا أرجعت جوجل خطأ واضحاً سنعرضه فوراً لنكشف السبب
        if (data.error) {
            return res.status(200).json({ reply: `تنبيه من سيرفر جوجل: ${data.error.message}` });
        }

        const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiReply) {
            return res.status(200).json({ reply: aiReply.trim() });
        } else {
            return res.status(200).json({ reply: "استلمت رسالتك، ولكن لم يتمكن الذكاء الاصطناعي من صياغة رد مناسب حالياً. يرجى محاولة كتابة سؤالك بصيغة أخرى." });
        }

    } catch (error) {
        return res.status(200).json({ reply: `عذراً، حدث خطأ أثناء معالجة الطلب في السيرفر: ${error.message}` });
    }
}