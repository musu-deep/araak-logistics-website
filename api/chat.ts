

const SYSTEM_INSTRUCTION = `
أنت "مساعد أراك الذكي"، الوكيل الافتراضي الرسمي لشركة "أراك لوجستيك" (Araak Logistics). 
مهمتك هي الإجابة على استفسارات العملاء باحترافية، وود، وبصياغة ممتازة باللغة العربية.
معلومات الشركة الأساسية: أراك لوجستيك هي الذراع الرقمي واللوجستي لمجموعة يو بي اتش UPH. تقدم خدمات شحن متكاملة: للشركات B2B، للأفراد والتجارة الإلكترونية B2C، وللقطاع الحكومي B2G، بالإضافة لخدمات ضيوف الرحمن (شحن وأمتعة الحجاج والمعتمرين مستلهمة من نجاح UPH). المقر الرئيسي في جدة (شارع التحلية)، البريد: info@araak.org. التتبع يتم عبر الصفحة الرئيسية برقم التتبع.
`;

export default async function handler(req: any, res: any) {
  // السماح لطلب الـ CORS من موقعك فقط
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
  // قراءة المفتاح من السيرفر مباشرة وليس المتصفح (أمان كامل)
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
    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ reply: aiReply || 'لم أستطع صياغة رد مناسب.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}