import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser'; // ✉️ استيراد مكتبة تنبيهات البريد الإلكتروني الفورية
import araakLogo from './araak-logo.png';

emailjs.init('7B3V3FLjjra0Stcqt');
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface QuotationRequest {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  shipping_type: string;
  origin_city: string;
  destination_city: string;
  estimated_weight: number;
  status: string;
  created_at: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'أهلاً بك، أنا "مساعد أراك الذكي"، الوكيل الافتراضي لشركة أراك لوجستيك. كيف يمكنني مساعدتك اليوم في خدمات الشحن والتسعير؟',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showErrorAction, setShowErrorAction] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    shippingType: 'بري',
    origin: '',
    destination: '',
    weight: ''
  });

  // وضع الإدارة المتقدم والتحكم
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  
  // حالات الفرز والبحث الموسع
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // 📞 رقم الواتساب الرسمي لشركة اراك لوجستيك لاستقبال محادثات العملاء مباشرة
  const ARAAK_OFFICIAL_PHONE = "00966551596477"; // قم بتعديل هذا الرقم لرقم مبيعاتكم الرسمي ومفتاح الدولة

  const fetchRequests = async () => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminMode) {
      fetchRequests();
    }
  }, [isAdminMode]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      alert('فشل تحديث حالة الطلب');
    }
  };

  const handleDeleteRequest = async (id: string, company: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف طلب شركة (${company}) نهائياً؟`)) return;
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRequests(prev => prev.filter(req => req.id !== id));
      if (expandedRowId === id) setExpandedRowId(null);
    } catch (err) {
      alert('فشل حذف الطلب من قاعدة البيانات');
    }
  };

  const handleHeaderClick = () => {
    if (isAdminMode) return;
    
    const clicks = secretClicks + 1;
    if (clicks >= 3) {
      setSecretClicks(0);
      const password = prompt("🔒 يرجى إدخل كلمة المرور الإدارية لشركة أراك لوجستيك:");
      
      if (password === "Araak2026") {
        setIsAdminMode(true);
      } else if (password !== null) {
        alert("❌ عذراً، كلمة المرور غير صحيحة. تم رفض صلاحية الوصول!");
      }
    } else {
      setSecretClicks(clicks);
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const exportToCSV = () => {
    if (requests.length === 0) return alert('لا توجد بيانات لتصديرها');
    
    const headers = ['اسم الشركة', 'البريد الإلكتروني', 'رقم الهاتف', 'نوع الشحن', 'مدينة القيام', 'مدينة الوصول', 'الوزن (طن)', 'الحالة', 'تاريخ الطلب'];
    const rows = requests.map(req => [
      req.company_name,
      req.contact_email,
      req.contact_phone || '',
      req.shipping_type,
      req.origin_city,
      req.destination_city,
      req.estimated_weight || '',
      req.status === 'pending' ? 'معلق' : 'تم الرد',
      new Date(req.created_at).toLocaleDateString('ar-SA')
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `طلبات_تسعير_أراك_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAIResponse = async (userText: string): Promise<string> => {
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
      if (!API_KEY) return "ERROR_KEY";

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      const SYSTEM_INSTRUCTION = `أنت "مساعد أراك الذكي"، الوكيل الافتراضي لشركة "أراك لوجستيك" لخدمات الشحن الـ B2B. أجب باختصار واحترافية وبطابع لوجستي ترحيبي مميز.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nسؤال المستخدم: ${userText}` }] }]
        })
      });

      if (!response.ok) return "ERROR_SERVER";
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "ERROR_SERVER";
    } catch {
      return "ERROR_SERVER";
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowErrorAction(false);

    if (textToSend.includes('تسعير') || textToSend.includes('احسب') || textToSend.includes('حجز') || textToSend.includes('طلب')) {
      setShowForm(true);
      setIsLoading(false);
      return;
    }

    const aiReply = await fetchAIResponse(textToSend);
    
    if (aiReply === "ERROR_SERVER" || aiReply === "ERROR_KEY") {
      setShowErrorAction(true);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: '⚠️ المساعد الذكي يمر بتحديث سريع ومؤقت الآن، لكن معاملاتك اللوجستية لا تنتظر! يمكنك الضغط مباشرة على الزر بالأسفل لتعبئة بيانات التسعير وسيتولى فريق العمل مراجعتها فوراً.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. الحفظ السحابي في جدول قاعدة بيانات Supabase
      const { error } = await supabase.from('quotation_requests').insert([
        {
          company_name: formData.companyName,
          contact_email: formData.email,
          contact_phone: formData.phone,
          shipping_type: formData.shippingType,
          origin_city: formData.origin,
          destination_city: formData.destination,
          estimated_weight: parseFloat(formData.weight) || null,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      // 2. ✉️ إرسال التنبيه الفوري التلقائي عبر البريد الإلكتروني باستخدام EmailJS
      const emailTemplateParams = {
        company_name: formData.companyName,
        contact_email: formData.email,
        contact_phone: formData.phone,
        shipping_type: formData.shippingType,
        origin_city: formData.origin,
        destination_city: formData.destination,
        estimated_weight: formData.weight || 'غير محدد'
      };

      // استدعاء خدمة الإرسال السريع لرسالة الإدارة ثم رسالة العميل بالتسلسل
      await emailjs.send(
        'service_r36zjpc',   // Service ID من حسابك في EmailJS
        'template_7jggxa9',  // قالب الرسالة الإدارية المعتمد
        emailTemplateParams,
        '7B3V3FLjjra0Stcqt'  // Public Key العام لحسابك
      );
      console.log('📧 تم إرسال إشعار البريد الإلكتروني للإدارة بنجاح!');

      await emailjs.send(
        'service_r36zjpc',   // نفس الـ Service ID
        'template_0rm3bgi',  // قالب العميل الجديد الذي اعتمدناه
        emailTemplateParams,
        '7B3V3FLjjra0Stcqt'  // نفس الـ Public Key
      );
      console.log('📱 تم إرسال إشعار البريد الإلكتروني التلقائي للعميل بنجاح!');

      // 🔄 تحديث واجهة المستخدم بعد نجاح الإرسال بالكامل
      setShowForm(false);
      setShowErrorAction(false);
      
      if (isAdminMode) {
        fetchRequests();
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `👍 تم استلام طلب التسعيرة الخاص بشركة (${formData.companyName}) بنجاح! تم تسجيل شحن ${formData.shippingType} من ${formData.origin} إلى ${formData.destination}. سيقوم فريق العمل بمراجعة الطلب والتواصل معكم هاتفياً أو عبر الواتساب قريباً جداً.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى التحقق من الاتصال.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = req.company_name.toLowerCase().includes(search) || 
                          req.contact_email.toLowerCase().includes(search) ||
                          (req.contact_phone && req.contact_phone.includes(search));
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.shipping_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  return (
    <>
      {/* 📦 أزرار الوصول السريع العائمة أسفل الشاشة للعميل */}
      {!isOpen && !isAdminMode && (
        <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50 items-center">
          {/* 💬 زر التواصل المباشر والسريع عبر واتساب مبيعات الشركة للعملاء */}
          <a 
            href={`https://wa.me/${ARAAK_OFFICIAL_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً شركة أراك لوجستيك، أود الاستفسار مباشرة عن خدمات الشحن وتوفير عرض أسعار لوجستي.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-emerald-400 text-xl"
            title="تواصل مباشرة عبر واتساب المبيعات"
          >
            💬
          </a>

          {/* زر المساعد الذكي الرئيسي */}
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-tr from-blue-700 to-blue-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-6 0h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* 🌐 نافذة النظام المتقدمة */}
      {(isOpen || isAdminMode) && (
        <div 
          className={`fixed border border-gray-100 bg-white rounded-2xl shadow-2xl overflow-hidden font-sans transition-all duration-300 text-right z-50 backdrop-blur-md antialiased flex flex-col
            ${isAdminMode 
              ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[640px] w-[94%] max-w-[1000px]' 
              : 'bottom-6 left-6 h-[550px] w-[380px]'
            }`}
        >
          {/* رأس النافذة */}
          <div 
            className={`text-white p-4 flex justify-between items-center select-none cursor-pointer bg-gradient-to-r shrink-0 ${isAdminMode ? 'from-indigo-800 to-indigo-600' : 'from-blue-700 to-blue-500'}`} 
            onClick={handleHeaderClick}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464-4.95l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm-8.778 0a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-11 0a1 1 0 100-2H4a1 1 0 100 2h1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide font-sans">{isAdminMode ? '🌐 مركز الإدارة والتحكم اللوجستي المتكامل' : 'مساعد أراك الذكي'}</h3>
                <p className="text-[11px] text-blue-100/80 font-normal font-sans">{isAdminMode ? 'قاعدة بيانات سحابية ونظام فرز متقدم لـ Supabase' : 'متاح الآن بذكاء عالي الاستجابة'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAdminMode ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsAdminMode(false); setIsOpen(false); }} 
                  className="bg-indigo-900/40 hover:bg-indigo-900/80 text-[11px] px-3 py-1 rounded-lg text-white border border-white/20 transition-all font-sans font-semibold"
                >
                  إغلاق لوحة التحكم
                </button>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ================= لوحة التحكم المتقدمة (Admin Mode) ================= */}
          {isAdminMode ? (
            <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden h-full" dir="rtl">
              {/* شريط الإحصائيات والتصدير */}
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-3 border-b bg-white shrink-0">
                <div className="flex gap-4 flex-1">
                  <div className="bg-blue-50/60 px-4 py-2 rounded-xl border border-blue-100">
                    <span className="block text-[11px] text-gray-500 font-bold font-sans">إجمالي الطلبات</span>
                    <span className="text-lg font-bold text-blue-700 font-mono">{totalRequests}</span>
                  </div>
                  <div className="bg-amber-50/60 px-4 py-2 rounded-xl border border-amber-100">
                    <span className="block text-[11px] text-gray-500 font-bold font-sans">قيد الدراسة</span>
                    <span className="text-lg font-bold text-amber-700 font-mono">{pendingRequests}</span>
                  </div>
                  <div className="bg-green-50/60 px-4 py-2 rounded-xl border border-green-100">
                    <span className="block text-[11px] text-gray-500 font-bold font-sans">تم معالجتها</span>
                    <span className="text-lg font-bold text-green-700 font-mono">{totalRequests - pendingRequests}</span>
                  </div>
                </div>
                <button 
                  onClick={exportToCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 self-start md:self-auto"
                >
                  📥 تصدير البيانات إلى Excel
                </button>
              </div>

              {/* شريط أدوات الفرز والبحث */}
              <div className="p-3 bg-white border-b grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0">
                <div>
                  <input 
                    type="text" 
                    placeholder="🔍 ابحث بالاسم، الإيميل، أو الجوال..." 
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 font-sans font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white focus:border-indigo-500 outline-none font-sans font-medium"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">📁 جميع الحالات</option>
                    <option value="pending">⏳ الطلبات المعلقة فقط</option>
                    <option value="responded">✅ طلبات تم الرد عليها</option>
                  </select>
                </div>
                <div>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white focus:border-indigo-500 outline-none font-sans font-medium"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">🌐 كل وسائل الشحن</option>
                    <option value="بري">🚚 الشحن البري</option>
                    <option value="بحري">🚢 الشحن البحري</option>
                    <option value="جوي">✈️ الشحن الجوي</option>
                  </select>
                </div>
              </div>

              {/* الجدول اللوجستي الإداري */}
              <div className="flex-1 p-4 overflow-auto">
                {adminLoading ? (
                  <div className="text-center py-12 text-xs text-gray-400 animate-pulse font-sans">جاري سحب الحجوزات من Supabase...</div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400 font-sans">لا توجد طلبات مطابقة لمعايير البحث والفرز.</div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50/80 border-b text-gray-500 font-bold font-sans select-none">
                          <th className="p-3 w-8"></th>
                          <th className="p-3">الشركة وجهة الاتصال</th>
                          <th className="p-3">نوع الشحن</th>
                          <th className="p-3">المسار اللوجستي</th>
                          <th className="p-3">الحالة</th>
                          <th className="p-3 text-center">خيارات التحكم السريع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                        {filteredRequests.map((req) => {
                          const isExpanded = expandedRowId === req.id;
                          const cleanPhone = req.contact_phone ? req.contact_phone.replace(/[^0-9+]/g, '') : '';

                          return (
                            <React.Fragment key={req.id}>
                              <tr 
                                onClick={() => toggleRowExpansion(req.id)}
                                className={`cursor-pointer transition-colors ${isExpanded ? 'bg-indigo-50/30' : 'hover:bg-gray-50/60'}`}
                              >
                                <td className="p-3 text-center text-gray-400 font-bold">
                                  {isExpanded ? '▼' : '◀'}
                                </td>
                                <td className="p-3">
                                  <span className="block font-bold text-gray-900">{req.company_name}</span>
                                  <span className="text-[10px] text-gray-400 font-mono select-all">{req.contact_email}</span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${req.shipping_type === 'جوي' ? 'bg-purple-50 text-purple-700 border border-purple-200' : req.shipping_type === 'بحري' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                                    {req.shipping_type}
                                  </span>
                                </td>
                                <td className="p-3 font-semibold text-gray-600">{req.origin_city} ➔ {req.destination_city}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                    {req.status === 'pending' ? '⏳ معلق' : '✅ تم الرد'}
                                  </span>
                                </td>
                                <td className="p-3 text-center flex justify-center items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  {req.status === 'pending' ? (
                                    <button onClick={() => handleUpdateStatus(req.id, 'responded')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-2.5 py-1 rounded-md font-bold shadow-sm transition-all">
                                      تحديد كـ تم الرد
                                    </button>
                                  ) : (
                                    <button onClick={() => handleUpdateStatus(req.id, 'pending')} className="bg-gray-100 hover:bg-gray-200 text-gray-500 text-[10px] px-2.5 py-1 rounded-md font-semibold transition-all">
                                      إعادة كمعلق
                                    </button>
                                  )}
                                  
                                  {/* 💬 تظهر الأيقونة الخضراء للواتساب فقط إذا كان للعميل رقم هاتف مسجل بقاعدة البيانات */}
                                  {cleanPhone ? (
                                    <a 
                                      href={`https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً فريق عمل شركة (${req.company_name}) الموقرين، معكم شركة أراك لوجستيك. نسعد بالتواصل معكم بخصوص طلب تسعير شحنتكم الـ ${req.shipping_type} المقدمة عبر مساعدنا الذكي من ${req.origin_city} إلى ${req.destination_city}. تم تجهيز العرض الأولي ونود مناقشة تفاصيل الأسعار معكم.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 p-1 rounded-md transition-all flex items-center justify-center w-6 h-6 text-xs font-bold"
                                      title="فتح محادثة مبيعات فورية مع العميل عبر الواتساب"
                                    >
                                      💬
                                    </a>
                                  ) : (
                                    <span className="opacity-30 p-1 w-6 h-6 flex items-center justify-center text-xs" title="لم يتم تسجيل رقم جوال لهذا الطلب">🚫</span>
                                  )}

                                  <a 
                                    href={`mailto:${req.contact_email}?subject=شركة أراك لوجستيك - عرض سعر طلب الشحن السريع&body=مرحباً فريق عمل ${req.company_name}،%0D%0A%0D%0Aنشكركم لتواصلكم مع شركة أراك لوجستيك عبر مساعدنا الذكي. بخصوص طلبكم لشحن (${req.shipping_type}) من ${req.origin_city} إلى ${req.destination_city}...`}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 p-1 rounded-md transition-all flex items-center justify-center w-6 h-6"
                                    title="إرسال بريد رسمي فوري"
                                  >
                                    ✉️
                                  </a>

                                  <button 
                                    onClick={() => handleDeleteRequest(req.id, req.company_name)} 
                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1 rounded-md transition-all flex items-center justify-center w-6 h-6"
                                    title="حذف الطلب نهائياً"
                                  >
                                    🗑️
                                  </button>
                                </td>
                              </tr>

                              {/* السطر الموسع لعرض بطاقة تفاصيل الشحنة ورقم الجوال بشكل كامل */}
                              {isExpanded && (
                                <tr className="bg-indigo-50/20">
                                  <td colSpan={6} className="p-4 border-t border-b border-indigo-100/50">
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-right bg-white p-3.5 rounded-xl border border-gray-100 shadow-inner">
                                      <div>
                                        <span className="block text-[10px] text-gray-400 font-bold mb-0.5">📱 رقم هاتف العميل</span>
                                        <p className="text-xs font-bold text-emerald-600 font-mono bg-emerald-50/30 px-2 py-0.5 rounded inline-block select-all">{req.contact_phone || 'غير مسجل'}</p>
                                      </div>
                                      <div>
                                        <span className="block text-[10px] text-gray-400 font-bold mb-0.5">⚖️ الوزن التقديري الإجمالي</span>
                                        <p className="text-xs font-bold text-gray-800 font-mono">{req.estimated_weight ? `${req.estimated_weight} طن` : 'غير محدد'}</p>
                                      </div>
                                      <div>
                                        <span className="block text-[10px] text-gray-400 font-bold mb-0.5">📅 تاريخ تقديم الطلب</span>
                                        <p className="text-xs font-semibold text-gray-800 font-mono">{new Date(req.created_at).toLocaleString('ar-SA')}</p>
                                      </div>
                                      <div>
                                        <span className="block text-[10px] text-gray-400 font-bold mb-0.5">📦 مسار الحركة اللوجستية</span>
                                        <p className="text-xs font-semibold text-gray-800">من {req.origin_city} إلى {req.destination_city} ({req.shipping_type})</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ================= شات العميل العصري المتكامل (User Mode) =================
            <div className="h-[486px] flex flex-col justify-between bg-slate-50/50 flex-1">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm font-semibold font-sans ${msg.sender === 'user' ? 'bg-gradient-to-l from-blue-700 to-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                      <p className="text-right whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[9px] mt-1.5 text-left font-normal ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}

                {/* بطاقة الإنقاذ التلقائية */}
                {showErrorAction && !showForm && (
                  <div className="flex justify-center p-2 animate-bounce">
                    <button 
                      onClick={() => setShowForm(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all font-sans"
                    >
                      📋 تعبئة نموذج طلب السعر يدوياً الآن
                    </button>
                  </div>
                )}

                {/* نموذج طلب التسعير المطور والشامل */}
                {showForm && (
                  <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-xl border-2 border-blue-500 space-y-3 text-right shadow-lg font-sans" dir="rtl">
                    <h4 className="font-bold text-xs text-blue-600 mb-2 border-b pb-1.5">📋 نموذج طلب تسعيرة شحن سريع</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">اسم الشركة / المؤسسة</label>
                        <input required type="text" className="w-full p-2 border border-gray-200 rounded-lg text-xs text-right focus:border-blue-500 outline-none transition-all font-sans font-medium" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">رقم الهاتف / الواتساب</label>
                        <input required type="tel" placeholder="مثال: +966500000000" className="w-full p-2 border border-gray-200 rounded-lg text-xs text-left focus:border-blue-500 outline-none transition-all font-mono" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">البريد الإلكتروني الرسمي</label>
                      <input required type="email" className="w-full p-2 border border-gray-200 rounded-lg text-xs text-left focus:border-blue-500 outline-none transition-all font-sans font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">مدينة القيام</label>
                        <input required type="text" className="w-full p-2 border border-gray-200 rounded-lg text-xs text-right focus:border-blue-500 outline-none transition-all font-sans font-medium" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">مدينة الوصول</label>
                        <input required type="text" className="w-full p-2 border border-gray-200 rounded-lg text-xs text-right focus:border-blue-500 outline-none transition-all font-sans font-medium" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">نوع الشحن</label>
                        <select className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white text-right focus:border-blue-500 outline-none font-sans font-medium" value={formData.shippingType} onChange={e => setFormData({...formData, shippingType: e.target.value})}>
                          <option value="بري">🚚 شحن بري</option>
                          <option value="بحري">🚢 شحن بحري</option>
                          <option value="جوي">✈️ شحن جوي</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">الوزن التقريبي (طن)</label>
                        <input type="number" step="0.1" className="w-full p-2 border border-gray-200 rounded-lg text-xs text-right focus:border-blue-500 outline-none font-mono" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm font-sans">إرسال طلب التسعير</button>
                      <button type="button" onClick={() => { setShowForm(false); setShowErrorAction(false); }} className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-all font-sans">إلغاء</button>
                    </div>
                  </form>
                )}
                {isLoading && <div className="text-left text-[10px] text-gray-400 font-sans animate-pulse">جاري معالجة طلبك ذكياً وتأمين خطوط التواصل البريدي...</div>}
              </div>

              {/* أزرار الإجراءات السريعة وحقل الإرسال */}
              <div className="p-3 border-t border-gray-100 bg-white space-y-2.5 shrink-0">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" dir="rtl">
                  <button onClick={() => handleSendMessage('أريد طلب تسعيرة شحنة جديدة')} className="whitespace-nowrap text-[10px] font-bold bg-blue-50 hover:bg-blue-100/80 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 transition-all font-sans">📋 طلب تسعيرة</button>
                  <button onClick={() => handleSendMessage('تتبع مسار شحنة')} className="whitespace-nowrap text-[10px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 transition-all font-sans">📦 تتبع شحنة</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSendMessage(inputText)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center font-sans">إرسال</button>
                  <input
                    type="text"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-right outline-none focus:border-blue-500 focus:bg-white transition-all font-sans font-semibold placeholder:text-gray-400"
                    placeholder="اسألني عن التسعير، الوجهات، أو تتبع شحنتك..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}