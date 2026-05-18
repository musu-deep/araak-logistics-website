const SYSTEM_INSTRUCTION = `أنت "مساعد أراك الذكي"، الوكيل الافتراضي الرسمي لشركة "أراك لوجستيك" (Araak Logistics). مهمتك هي الإجابة على استفسارات العملاء باحترافية، وود، وبصياغة ممتازة باللغة العربية وبإيجاز مناسب للمحادثات.
معلومات الشركة الأساسية:
- تقدم خدمات شحن متكاملة ومخصصة لشركات الـ B2B.
- أراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة يو بي اتش الالكترونية (UPH Group).
- خدماتنا تشمل: الشحن البري، الشحن البحري، الشحن الجوي، التخليص الجمركي، التخزين، وإدارة سلاسل الإمداد.
- نغطي الشحن والتنقل بكفاءة عالية بين كافة مدن المملكة العربية السعودية (مثل الرياض، جدة، الدمام) بالإضافة للشحن الدولي.`;

export default async function handler(req, res) {
    // إعدادات CORS الشاملة لمنع أي تعارض
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
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ reply: "عذراً، يوجد خطأ في تهيئة خادم الذكاء الاصطناعي (مفتاح الربط مفقود)." });
        }

        // استخدام نموذج مستقر يمتلك حقل مخصص للـ systemInstruction مدمج في الرابط
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // الطريقة الرسمية المضمونة لتمرير الأوامر والرسالة بدون تداخل
                systemInstruction: {
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                contents: [{
                    role: 'user',
                    parts: [{ text: message || "مرحباً" }]
                }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 500 
                }
            })
        });

        const data = await apiResponse.json();

        // فحص ما إذا كانت جوجل قد أرجعت خطأ صريحاً وقراءته بدلاً من التجاهل
        if (data.error) {
            console.error("Google Gemini Error Details:", data.error);
            return res.status(200).json({ reply: `خطأ من خادم المزود: ${data.error.message}` });
        }

        const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiReply) {
            return res.status(200).json({ reply: aiReply.trim() });
        } else {
            return res.status(200).json({ reply: "استلمت رسالتك، ولكن لم يتمكن المحرك من صياغة رد مناسب حالياً. يرجى إعادة المحاولة." });
        }

    } catch (error) {
        console.error("Server Handler Catch Error:", error);
        return res.status(500).json({ reply: "أواجه مشكلة داخلية في السيرفر أثناء تحضير الإجابة." });
    }
}