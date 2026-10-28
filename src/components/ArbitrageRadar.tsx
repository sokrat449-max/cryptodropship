import React, { useState } from 'react';
import { ArbitrageItem } from '../types';
import { ArrowUpRight, CheckCircle2, QrCode, Key, Gift, Cpu, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface ArbitrageRadarProps {
  opportunities: ArbitrageItem[];
  onExecute: (item: ArbitrageItem) => void;
  preferredChain: 'polygon' | 'base' | 'ethereum' | 'tron' | 'solana';
}

export const ArbitrageRadar: React.FC<ArbitrageRadarProps> = ({
  opportunities,
  onExecute,
  preferredChain,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'جميع المنتجات الرقمية' },
    { id: 'eSIM & Connectivity', label: 'شرائح eSIM والاتصال' },
    { id: 'Software & OS', label: 'تراخيص الويندوز والبرامج' },
    { id: 'Security & VPN', label: 'خدمات الـ VPN والخصوصية' },
    { id: 'Cloud & AI Vouchers', label: 'رصيد الذكاء الاصطناعي والخوادم' },
    { id: 'Gaming & Digital Cards', label: 'بطاقات الألعاب والشحن الرقمي' },
  ];

  const filteredItems = opportunities.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDeliveryIcon = (type: ArbitrageItem['instantDeliveryType']) => {
    switch (type) {
      case 'QR_ESIM':
        return <QrCode className="w-3.5 h-3.5 text-blue-400" />;
      case 'LICENSE_KEY':
        return <Key className="w-3.5 h-3.5 text-emerald-400" />;
      case 'VOUCHER_PIN':
        return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Gift className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getDeliveryLabel = (type: ArbitrageItem['instantDeliveryType']) => {
    switch (type) {
      case 'QR_ESIM':
        return 'رمز QR لـ eSIM فوري';
      case 'LICENSE_KEY':
        return 'مفتاح ترخيص فوري';
      case 'VOUCHER_PIN':
        return 'كود رصيد سحابي فوري';
      default:
        return 'كود تفعيل رقمي فوري';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>رادار فروق الأسعار المباشر (Live Arbitrage Radar)</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            فرص الوساطة الحالية الأكثر طلباً بالعملات المستقرة (USDT/USDC)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            يقارن البوت أسعار التوريد المباشرة بالجملة مع متوسط أسعار الطلب في السوق العالمي مع حساب العمولة الصافية التي تودع في محفظتك.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن منتج، مورد، أو باقة..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Opportunities Grid / Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">المنتج والتصنيف</th>
                <th className="py-3 px-4">مورد الجملة المعتمد</th>
                <th className="py-3 px-4">سعر الجملة</th>
                <th className="py-3 px-4">سعر البيع (USDT)</th>
                <th className="py-3 px-4">عمولتك الصافية لمحفظتك</th>
                <th className="py-3 px-4">نوع التسليم الآلي</th>
                <th className="py-3 px-4 text-center">الطلب اليومي</th>
                <th className="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Product title */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white mb-0.5">{item.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="text-emerald-400/90 font-mono">تسليم لحظي عبر API</span>
                    </div>
                  </td>

                  {/* Supplier */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="font-medium">{item.supplier}</div>
                    <div className="text-[11px] text-slate-400">مورد موثوق ومعتمد</div>
                  </td>

                  {/* Wholesale price */}
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    <span className="text-slate-400">$</span>{item.wholesalePriceUsd.toFixed(2)}
                  </td>

                  {/* Retail price */}
                  <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-white">
                    <span className="text-emerald-400">$</span>{item.retailPriceUsd.toFixed(2)}
                    <span className="text-[10px] text-slate-400 mr-1">USDT</span>
                  </td>

                  {/* Net commission */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono tabular-nums font-bold text-emerald-400 text-sm flex items-center gap-1">
                      <span>+${item.estimatedNetMarginUsd.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">USDT</span>
                    </div>
                    <div className="text-[10px] text-emerald-500/80 font-mono">
                      هامش ربح: {item.marginPercent.toFixed(1)}%
                    </div>
                  </td>

                  {/* Instant delivery */}
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                      {getDeliveryIcon(item.instantDeliveryType)}
                      <span>{getDeliveryLabel(item.instantDeliveryType)}</span>
                    </div>
                  </td>

                  {/* Daily demand count */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="font-mono tabular-nums text-slate-200 font-medium">
                      {item.dailyDemandVolume} طلب
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      {item.activeDemandCount} جاري الآن
                    </div>
                  </td>

                  {/* Auto-Executed Status Indicator */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>مراقب ومؤتمت بالكامل</span>
                      </span>
                      <button
                        onClick={() => onExecute(item)}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="عرض كشف حساب الانقسام وتفاصيل التوريد"
                      >
                        معاينة تفاصيل الاقتطاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    لا توجد منتجات مطابقة لخيارات البحث المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
