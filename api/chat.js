const SYSTEM_INSTRUCTION = `أنت "مساعد أراك الذكي"، الوكيل الافتراضي الرسمي لشركة "أراك لوجستيك" (Araak Logistics). مهمتك هي الإجابة على استفسارات العملاء باحترافية، وود، وبصياغة ممتازة باللغة العربية. معلومات الشركة الأساسية: لشركات الـ B2B تقدم خدمات شحن متكاملة؛ أراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة يو بي اتش الكترونية.`;

export default async function handler(req, res) {
    // إعدادات CORS للسماح بالطلب من موقعك فقط
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key is missing on the server' });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nسؤال المستخدم: ${message}` }] }],
                generationConfig: { temperature: 0.5, maxOutputTokens: 400 }
            })
        });

        const data = await apiResponse.json();
        const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "لم أستطع صياغة رد مناسب.";
        
        return res.status(200).json({ reply: aiReply });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to communicate with AI server' });
    }
}