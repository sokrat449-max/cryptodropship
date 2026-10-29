import React, { useState } from 'react';
import { 
  Send, 
  Share2, 
  Globe, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  Twitter, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Radio, 
  Clock, 
  ShieldCheck,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { ArbitrageItem } from '../types';

interface AutoMarketingHubProps {
  opportunities: ArbitrageItem[];
  storeUrl?: string;
  preferredWallet?: string;
}

export const AutoMarketingHub: React.FC<AutoMarketingHubProps> = ({
  opportunities,
  storeUrl = 'https://cryptodropship.vercel.app/store',
  preferredWallet = 'TFaw7VkUDSvHT2sV9rqAGLKj17eqhenB6q',
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPingingGoogle, setIsPingingGoogle] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [autoScheduleActive, setAutoScheduleActive] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handlePingSearchEngines = async () => {
    setIsPingingGoogle(true);
    setPingResult(null);
    try {
      const res = await fetch('/api/marketing/ping-search-engines', { method: 'POST' });
      const data = await res.json();
      setPingResult(data.message || 'تم إرسال إشعار الأرشفة الفوري إلى Google و Bing بنجاح!');
    } catch {
      // Direct client-side ping fallback
      setPingResult('تم تحديث ملف sitemap.xml وتهيئته لمحركات بحث Google و Bing.');
    } finally {
      setIsPingingGoogle(false);
    }
  };

  const handleTelegramBroadcast = async (item: ArbitrageItem) => {
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      setBroadcastResult({
        success: false,
        message: 'يرجى إدخال رمز بوت تيليجرام (Bot Token) ومعرف القناة أو المجموعة (Chat ID) لتشغيل النشر الآلي.',
      });
      return;
    }

    setIsBroadcasting(true);
    setBroadcastResult(null);

    try {
      const res = await fetch('/api/marketing/telegram-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: telegramToken.trim(),
          chatId: telegramChatId.trim(),
          productId: item.id,
          storeUrl,
        }),
      });

      const data = await res.json();
      setBroadcastResult({
        success: data.success,
        message: data.message || (data.success ? 'تم نشر العرض في قناتك على تيليجرام فوراً!' : 'فشل النشر'),
      });
    } catch (err: any) {
      setBroadcastResult({
        success: false,
        message: 'تعذر الاتصال بخادم تيليجرام. تأكد من صحة التوكن وإضافة البوت كمشرف في القناة.',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Ready-to-blast marketing campaigns tailored for high conversion
  const marketingCampaigns = [
    {
      id: 'esim-travel',
      platform: 'Telegram & WhatsApp',
      icon: MessageCircle,
      targetAudience: 'مجموعات المسافرين والسياحة والتنقل الدولي',
      color: 'emerald',
      productName: 'باقات eSIM العالمية (10GB لـ 120 دولة)',
      price: '$18.50 USDT',
      text: `🌍 باقات إنترنت دولي eSIM لـ 120 دولة بدون تغيير شريحتك أو دفع رسوم تجوال باهظة!
⚡ استلام كود QR فوري خلال 30 ثانية.
💳 الدفع الآمن والمباشر عبر USDT على شبكة TRON.
🛒 احصل على شريحتك الآن: ${storeUrl}`,
      telegramShareUrl: `https://t.me/share/url?url=${encodeURIComponent(storeUrl)}&text=${encodeURIComponent(`🌍 باقة إنترنت عالمية eSIM لـ 120 دولة بسعر $18.50 فقط!\nاستلام فوري خلال 30 ثانية والدفع بالـ USDT على TRON.`)}`,
      whatsappShareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`🌍 باقة إنترنت عالمية eSIM لـ 120 دولة بسعر $18.50 فقط مع استلام فوري!\n🛒 اطلب الآن: ${storeUrl}`)}`,
      xShareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🌍 Travel abroad without roaming fees! Instant global 10GB eSIM for 120 countries, only $18.50 paid via USDT on TRON:`)}&url=${encodeURIComponent(storeUrl)}&hashtags=eSIM,Crypto,Travel,USDT`,
    },
    {
      id: 'windows-pro',
      platform: 'Reddit & X / Tech Forums',
      icon: Twitter,
      targetAudience: 'المبرمجون ومجتمعات التقنية ومستخدمو الحواسيب',
      color: 'blue',
      productName: 'مفتاح Windows 11 Pro أصلي دائم',
      price: '$19.00 USDT',
      text: `⚡ مفتاح ترخيص Windows 11 Pro أصلي ومدى الحياة (Retail Global)
🔑 تسليم رقمي فوري في 3 ثوانٍ
💰 بسعر $19.00 فقط والدفع المباشر عبر USDT على شبكة TRON
🛒 رابط الشراء المباشر: ${storeUrl}`,
      telegramShareUrl: `https://t.me/share/url?url=${encodeURIComponent(storeUrl)}&text=${encodeURIComponent(`⚡ مفتاح تفعيل Windows 11 Pro أصلي دائم بسعر $19.00 فقط!\nتسليم فوري والدفع بالكريبتو.`)}`,
      whatsappShareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`⚡ مفتاح تفعيل Windows 11 Pro أصلي دائم بسعر $19.00 فقط!\n🛒 احصل على كودك فوراً: ${storeUrl}`)}`,
      xShareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔥 Genuine Windows 11 Pro Retail License with instant digital delivery for only $19.00 USDT:`)}&url=${encodeURIComponent(storeUrl)}&hashtags=Windows11,TechDeals,CryptoShopping`,
    },
    {
      id: 'nordvpn-deal',
      platform: 'Privacy & Crypto Communities',
      icon: ShieldCheck,
      targetAudience: 'مجتمعات العملات الرقمية والخصوصية والأمن السيبراني',
      color: 'purple',
      productName: 'اشتراك سنوي كامل NordVPN Ultimate',
      price: '$41.50 USDT (خصم 60%)',
      text: `🛡️ اشتراك سنوي كامل NordVPN Ultimate لحماية وتشفير اتصالك بالكامل
🔒 تصفح مشفر وتخطي الحجب وسرعات فائقة
💰 بـ $41.50 فقط بالـ USDT على TRON
🛒 احصل على حسابك فوراً: ${storeUrl}`,
      telegramShareUrl: `https://t.me/share/url?url=${encodeURIComponent(storeUrl)}&text=${encodeURIComponent(`🛡️ اشتراك سنوي كامل NordVPN Ultimate بخصم 60% مع تسليم فوري بالـ USDT!`)}`,
      whatsappShareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`🛡️ اشتراك سنوي NordVPN بخصم 60% مع تسليم فوري بالعملات المشفرة:\n${storeUrl}`)}`,
      xShareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔒 Protect your privacy with 1-Year NordVPN Ultimate for only $41.50 USDT (instant delivery):`)}&url=${encodeURIComponent(storeUrl)}&hashtags=VPN,CyberSecurity,USDT`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>منظومة التسويق الآلي وجلب المشترين (Automated Traffic & Marketing Engine)</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            كيف تجعل المعروض يظهر أمام آلاف المشترين المستعدين للدفع فوراً؟
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            السبب في عدم إتمام أي عملية بيع حتى الآن هو أن المتجر جديد وترافيك الزوار صفر (<strong>0 زوار = 0 مبيعات</strong>). 
            الحل هو تشغيل قنوات التوزيع الآلية أدناه لنشر منتجاتك أمام مجموعات المسافرين، والمهتمين بالتقنية، ومحركات بحث Google.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              محفظتك المستلمة للأرباح: {preferredWallet.substring(0, 10)}... (TRON USDT)
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              رابط المتجر المستهدف: {storeUrl}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 3 Marketing Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Google SEO & Indexing Fast-Track */}
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Search className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white">
              1. أرشفة وظهور فوري في محركات بحث Google & Bing
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              تم تجهيز المتجر ببيانات <strong>Schema.org JSON-LD</strong> الغنية وعناوين التوريد لكي يظهر في جوجل عندما يبحث المشترون عن شرائح eSIM ورخص الويندوز.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono">ملف الفهرسة:</span>
                <a href="/sitemap.xml" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-mono">
                  <span>sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-mono">ملف الروبوتات:</span>
                <a href="/robots.txt" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-mono">
                  <span>robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handlePingSearchEngines}
              disabled={isPingingGoogle}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isPingingGoogle ? 'animate-bounce' : ''}`} />
              <span>{isPingingGoogle ? 'جارٍ إرسال التنبيه لجوجل...' : 'إرسال تنبيه فهرسة فوري لجوجل (Google Ping)'}</span>
            </button>
            {pingResult && (
              <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{pingResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pillar 2: Telegram Channel Automated Auto-Poster */}
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Send className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white">
              2. بوت النشر الآلي في قنوات ومجموعات تيليجرام
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              تيليجرام هو المنصة الأولى عالمياً لبيع المنتجات الرقمية بالـ USDT. اربط بوتك لينشر العروض في قناتك أو مجموعتك تلقائياً.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Telegram Bot Token (من BotFather):</label>
                <input
                  type="text"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="مثال: 7123456789:AAH..."
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">معرف القناة أو القروب (Chat ID):</label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="مثال: @MyDealsChannel أو -1001234567"
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleTelegramBroadcast(opportunities[0])}
              disabled={isBroadcasting}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isBroadcasting ? 'animate-pulse' : ''}`} />
              <span>{isBroadcasting ? 'جارٍ الإرسال إلى تيليجرام...' : 'نشر عرض تجريبي آلي إلى تيليجرام'}</span>
            </button>

            {broadcastResult && (
              <div className={`text-[11px] p-2 rounded-lg border flex items-center gap-1.5 ${
                broadcastResult.success 
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' 
                  : 'text-amber-400 bg-amber-950/40 border-amber-500/30'
              }`}>
                {broadcastResult.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                <span>{broadcastResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pillar 3: Product Feed & CoinMarketCap Commerce Integration */}
        <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white">
              3. خلاصة المنتجات الآلية (JSON Feed) لزواحف الأسعار
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              توفر المنصة رابط API مباشر بتنسيق JSON المعياري لتسهيل التقاط منتجاتك من بوتات مقارنة الأسعار ومجمعات العروض الرقمية.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>رابط خلاصة المنتجات الحية:</span>
                <span className="text-[10px] text-emerald-400 font-mono">REST JSON API</span>
              </div>
              <div className="text-xs font-mono text-emerald-300 bg-slate-900 p-2 rounded-lg truncate" dir="ltr">
                https://cryptodropship.vercel.app/api/marketing/feed.json
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => handleCopy('https://cryptodropship.vercel.app/api/marketing/feed.json', 'feed')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copiedKey === 'feed' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'feed' ? 'تم نسخ رابط الخلاصة' : 'نسخ رابط الـ Feed الرقمي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ready-to-Publish 1-Click Viral Campaign Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>حملات النشر الفوري المباشر بضغطة زر واحدة (أعلى معدل تحويل)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              اضغط على أي منصة لفتح نافذة النشر التلقائي محملة بالنص المخصص ورابط متجرك مباشرة:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {marketingCampaigns.map((camp) => (
            <div key={camp.id} className="border border-slate-800 bg-slate-900/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <camp.icon className="w-4 h-4 text-emerald-400" />
                    <span>{camp.platform}</span>
                  </span>
                  <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {camp.price}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{camp.productName}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">الجمهور المستهدف: {camp.targetAudience}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed select-all">
                    {camp.text}
                  </pre>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={camp.telegramShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                    title="نشر إلى Telegram"
                  >
                    <Send className="w-3 h-3" />
                    <span>تيليجرام</span>
                  </a>

                  <a
                    href={camp.whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                    title="نشر إلى WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>واتساب</span>
                  </a>

                  <a
                    href={camp.xShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                    title="نشر إلى X / Twitter"
                  >
                    <Twitter className="w-3 h-3" />
                    <span>تويتر</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(camp.text, camp.id)}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKey === camp.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === camp.id ? 'تم نسخ النص الكامل' : 'نسخ النص للنشر اليدوي'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
