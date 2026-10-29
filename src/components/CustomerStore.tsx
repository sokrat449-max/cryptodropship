import React, { useState } from 'react';
import { ArbitrageItem, WalletConfig } from '../types';
import { 
  ShoppingBag, 
  Sparkles, 
  QrCode, 
  Key, 
  Cpu, 
  ShieldCheck, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Globe, 
  Lock 
} from 'lucide-react';

interface CustomerStoreProps {
  opportunities: ArbitrageItem[];
  config: WalletConfig;
  onBuyItem: (item: ArbitrageItem) => void;
}

export const CustomerStore: React.FC<CustomerStoreProps> = ({
  opportunities,
  config,
  onBuyItem,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);

  const publicStoreUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/store` 
    : 'https://cryptodropship.vercel.app/store';

  const categories = [
    { id: 'all', label: 'جميع المنتجات الرقمية' },
    { id: 'eSIM & Connectivity', label: 'شرائح eSIM والإنترنت الدولي' },
    { id: 'Software & OS', label: 'تراخيص الويندوز والبرامج' },
    { id: 'Security & VPN', label: 'خدمات الـ VPN والخصوصية' },
    { id: 'Cloud & AI Vouchers', label: 'رصيد الذكاء الاصطناعي والخوادم' },
  ];

  const filtered = opportunities.filter((op) => 
    selectedCat === 'all' || op.category === selectedCat
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicStoreUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPromo = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromo(id);
    setTimeout(() => setCopiedPromo(null), 2000);
  };

  const promoTemplates = [
    {
      id: 'esim-promo',
      target: 'مجموعات المسافرين وتيليغرام (Travel & Nomad Groups)',
      lang: 'عربي + إنجليزي',
      text: `🌍 باقات إنترنت عالمية eSIM لـ 120 دولة بدون تغيير شريحتك أو دفع رسوم تجوال باهظة!
• باقة 10GB عالمية بسعر $18.50 فقط
• تفعيل فوري خلال 60 ثانية عبر رمز QR
• الدفع الآمن والمباشر عبر العملات المستقرة (USDC / USDT)
احصل على شريحتك الآن: ${publicStoreUrl}`,
    },
    {
      id: 'win11-promo',
      target: 'مجتمعات المبرمجين والتقنية (Reddit & X/Twitter)',
      lang: 'English (High Conversion)',
      text: `⚡ Need a genuine permanent Windows 11 Pro Retail License or high-speed VPN?
Get instant digital delivery paid via USDC on Polygon / USDT on TRON (zero extra fees).
Checkout directly: ${publicStoreUrl}`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Customer Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>متجر المنتجات الرقمية والتسليم اللحظي عبر البلوكشين</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
            اشترِ شرائح الـ eSIM العالمية، تراخيص البرامج، وحسابات الـ VPN بأمان وسرعة
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            ادفع مباشرة عبر العملات المستقرة (USDT على شبكة TRON TRC-20 كخيار أول ومفضّل، أو USDC على Polygon) واستلم كود التفعيل أو رمز الـ QR فوراً خلال ثوانٍ معدودة.
          </p>

          {/* Shareable Link Box */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate" dir="ltr">{publicStoreUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mr-3 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم النسخ' : 'نسخ رابط المتجر العام'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>تسليم مؤتمت فوري</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer font-medium ${
              selectedCat === c.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Products Grid for Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <Zap className="w-3 h-3" />
                  <span>تسليم فوري</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                رمز استجابة سريعة (QR) أو كود ترخيص رسمي مدعوم بالضمان مع إمكانية التفعيل المباشر بدون انتظار.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-800/80 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">السعر الإجمالي:</div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    ${item.retailPriceUsd.toFixed(2)}
                    <span className="text-xs font-normal text-emerald-400 mr-1.5">USDC / USDT</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span>شبكة الدفع:</span>
                  <div className="text-slate-200 font-semibold">Polygon / TRON</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onBuyItem(item)}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>شراء فوري بالعملات المشفرة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Marketing Action Kit (To get that first customer!) */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Share2 className="w-4 h-4" />
          <span>حزمة إطلاق وجلب المشتري الأول (Go-To-Market Kit)</span>
        </div>
        <h3 className="text-lg font-bold text-white">
          نصوص ترويجية جاهزة للنشر لجلب أول مشتري الآن
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          بدلاً من الانتظار السلبي دون أن يعلم أحد بالمتجر، انسخ أي من هذه النصوص الجاهزة وانشرها في مجموعات المسافرين والتقنيين لجلب أول دفعة حقيقية إلى محفظتك:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {promoTemplates.map((promo) => (
            <div key={promo.id} className="border border-slate-800 bg-slate-950/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300">{promo.target}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{promo.lang}</span>
                </div>
                <pre className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg font-sans whitespace-pre-wrap leading-relaxed select-all">
                  {promo.text}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => handleCopyPromo(promo.text, promo.id)}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedPromo === promo.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromo === promo.id ? 'تم نسخ الرسالة!' : 'نسخ الرسالة للنشر'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
