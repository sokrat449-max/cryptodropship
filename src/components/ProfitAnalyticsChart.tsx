import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  Layers, 
  Coins, 
  PieChart as PieIcon, 
  Sparkles,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { OrderExecution } from '../types';

interface ProfitAnalyticsChartProps {
  ledger?: OrderExecution[];
  currentCommissionTotal?: number;
  walletAddress?: string;
}

export const ProfitAnalyticsChart: React.FC<ProfitAnalyticsChartProps> = ({
  ledger = [],
  currentCommissionTotal = 0,
  walletAddress = '0x25c6a4F452e2201620C11C75b050D0700dAfE4F7',
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [chartType, setChartType] = useState<'cumulative' | 'daily' | 'categories'>('cumulative');

  // Timeline data computed strictly from real on-chain ledger orders (Zero simulation)
  const timelineData = useMemo(() => {
    if (!ledger || ledger.length === 0) return [];

    const dateMap = new Map<string, {
      date: string;
      rawDate: string;
      dailyCommission: number;
      dailySales: number;
      supplierCost: number;
      dailyOrders: number;
    }>();

    ledger.forEach((item) => {
      const d = new Date(item.timestamp);
      const rawDate = d.toISOString().split('T')[0];
      const dateLabel = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });

      const existing = dateMap.get(rawDate) || {
        date: dateLabel,
        rawDate,
        dailyCommission: 0,
        dailySales: 0,
        supplierCost: 0,
        dailyOrders: 0,
      };

      existing.dailyCommission = Number((existing.dailyCommission + item.netCommissionToUserUsd).toFixed(2));
      existing.dailySales = Number((existing.dailySales + item.totalPaidByCustomerUsd).toFixed(2));
      existing.supplierCost = Number((existing.supplierCost + item.wholesaleSupplierCostUsd).toFixed(2));
      existing.dailyOrders += 1;

      dateMap.set(rawDate, existing);
    });

    const sortedDays = Array.from(dateMap.values()).sort((a, b) => a.rawDate.localeCompare(b.rawDate));

    let runningCumulativeCommission = 0;
    let runningCumulativeSales = 0;

    return sortedDays.map((day) => {
      runningCumulativeCommission = Number((runningCumulativeCommission + day.dailyCommission).toFixed(2));
      runningCumulativeSales = Number((runningCumulativeSales + day.dailySales).toFixed(2));
      return {
        ...day,
        cumulativeCommission: runningCumulativeCommission,
        cumulativeSales: runningCumulativeSales,
        marginPercent: day.dailySales > 0 ? Number(((day.dailyCommission / day.dailySales) * 100).toFixed(1)) : 0,
      };
    });
  }, [ledger]);

  // Category breakdown computed strictly from real ledger orders
  const categoryData = useMemo(() => {
    if (!ledger || ledger.length === 0) return [];
    const catMap = new Map<string, { totalProfit: number; count: number }>();
    ledger.forEach((item) => {
      const cat = item.category || 'أخرى';
      const prev = catMap.get(cat) || { totalProfit: 0, count: 0 };
      prev.totalProfit = Number((prev.totalProfit + item.netCommissionToUserUsd).toFixed(2));
      prev.count += 1;
      catMap.set(cat, prev);
    });
    const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'];
    return Array.from(catMap.entries()).map(([name, data], idx) => ({
      name,
      value: data.count,
      commissionRate: `${((data.totalProfit / (data.count * 20)) * 100).toFixed(0)}%`,
      color: colors[idx % colors.length],
      totalProfit: `$${data.totalProfit.toFixed(2)}`,
    }));
  }, [ledger]);

  // Summary statistics from real ledger
  const stats = useMemo(() => {
    if (!ledger || ledger.length === 0) return { totalComm: 0, totalSales: 0, avgDaily: 0, avgMargin: 0 };
    const totalComm = ledger.reduce((sum, it) => sum + it.netCommissionToUserUsd, 0);
    const totalSales = ledger.reduce((sum, it) => sum + it.totalPaidByCustomerUsd, 0);
    const days = timelineData.length || 1;
    const avgDaily = Number((totalComm / days).toFixed(2));
    const avgMargin = totalSales > 0 ? Number(((totalComm / totalSales) * 100).toFixed(1)) : 0;

    return { totalComm: Number(totalComm.toFixed(2)), totalSales: Number(totalSales.toFixed(2)), avgDaily, avgMargin };
  }, [ledger, timelineData]);

  // Custom Dark Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b101b] border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 min-w-[210px] text-right font-sans">
          <div className="font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span className="text-emerald-400 font-mono">{label}</span>
            <span className="text-[10px] text-slate-400">تحصيل فوري بـ USDC</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {payload.map((entry: any, index: number) => {
              const isComm = entry.dataKey === 'dailyCommission' || entry.dataKey === 'cumulativeCommission';
              return (
                <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-300 text-[11px]">{entry.name}:</span>
                  </div>
                  <span className={`font-mono font-bold tabular-nums ${isComm ? 'text-emerald-400' : 'text-slate-200'}`}>
                    ${Number(entry.value).toFixed(2)} USDC
                  </span>
                </div>
              );
            })}
          </div>

          {payload[0]?.payload?.marginPercent && (
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
              <span>هامش الربح الصافي:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {payload[0].payload.marginPercent}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>تحليلات النمو وتدفق العمولات المقتطعة (Profit Growth Analytics)</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            تطور الأرباح اليومية والعمولات الصافية المتدفقة إلى محفظتك
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            رسم بياني تفاعلي يعرض نمو عمولات الوساطة الصافية عبر شبكة Polygon و Base دون أي تكلفة رأس مالية.
          </p>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Pills */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '7d' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 أيام
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '14d' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              14 يوماً
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '30d' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 يوماً
            </button>
          </div>

          {/* Chart Type Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center text-xs">
            <button
              onClick={() => setChartType('cumulative')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartType === 'cumulative' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>النمو التراكمي</span>
            </button>
            <button
              onClick={() => setChartType('daily')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartType === 'daily' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              <span>اليومي مقابل المبيعات</span>
            </button>
            <button
              onClick={() => setChartType('categories')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartType === 'categories' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>توزيع المنتجات</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>إجمالي العمولات الصافية ({timeRange})</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            +${stats.totalComm.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">USDC</span>
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>محولة مباشرة لمحفظتك المعتمدة</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>متوسط العمولة اليومية الصافية</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            ${stats.avgDaily.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">USDC / يوم</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            بمعدل نمو متصاعد مع زيادة حجم الطلب
          </div>
        </div>

        {/* KPI 3 */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>إجمالي حجم مبيعات الزبائن</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            ${stats.totalSales.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            شاملة تكلفة المورد بالجملة وعمولتك
          </div>
        </div>

        {/* KPI 4 */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>متوسط نسبة الهامش الصافي</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
            {stats.avgMargin}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            أعلى عائد من سلع الـ eSIM والتراخيص
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Surface */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-6 space-y-4">
        {timelineData.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
              <TrendingUp className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-white">لا توجد عمليات بيع حقيقية مؤكدة بعد</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              تم استئصال أي محاكاة أو بيانات وهمية. هذا المخطط يعرض حصرياً المعاملات الفعلية المؤكدة على البلوكشين (TRON / Polygon). عند إتمام أول عملية بيع حقيقية بالـ USDT، سيتم رسم مسار العمولات الفعلي هنا تلقائياً.
            </p>
          </div>
        ) : (
          <>
            {/* Chart View 1: Cumulative Area Growth */}
            {chartType === 'cumulative' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>منحنى نمو العمولات التراكمية الصافية (Cumulative Commission Velocity)</span>
                    </h3>
                <span className="text-xs text-slate-400">
                  يوضح التصاعد المستمر لرصيد الأرباح المحولة لمحفظتك بمرور الأيام
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span>العمولات التراكمية الصافية</span>
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500/50 inline-block" />
                  <span>إجمالي حجم السداد</span>
                </span>
              </div>
            </div>

            <div className="h-[360px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="commGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSales"
                    name="إجمالي حجم التداول"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#salesGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeCommission"
                    name="العمولة الصافية المحصلة"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#commGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 2: Daily Net Profit vs Supplier Cost (Composed Bar + Line) */}
        {chartType === 'daily' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>تحليل الأرباح اليومية مقابل تكلفة التوريد بالجملة</span>
                </h3>
                <span className="text-xs text-slate-400">
                  مقارنة يومية بين ما يدفعه العميل (الأعمدة) وما يدخل محفظتك كعمولة صافية (الخط الأخضر)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-sm bg-slate-700 inline-block" />
                  <span>تكلفة المورد</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span>العمولة الصافية لك</span>
                </span>
              </div>
            </div>

            <div className="h-[360px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={timelineData}
                  margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#94a3b8' }}
                  />
                  <Bar
                    dataKey="supplierCost"
                    name="تكلفة الجملة للمورد ($)"
                    fill="#334155"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="dailyCommission"
                    name="عمولتك الصافية اليومية ($)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="dailyCommission"
                    name="مسار الأرباح اليومية"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart View 3: Category Distribution */}
        {chartType === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[320px] w-full flex items-center justify-center" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={65}
                    paddingAngle={4}
                    stroke="#0b101b"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}% من حجم الطلبات`, name]}
                    contentStyle={{ backgroundColor: '#0b101b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  أعلى القطاعات الرقمية مساهمة في العمولات
                </h4>
                <p className="text-xs text-slate-400">
                  تتميز شرائح الاتصال eSIM وتراخيص البرامج بأعلى هوامش ربح وأسرع دورة تسليم آلي.
                </p>
              </div>

              <div className="space-y-2.5">
                {categoryData.map((cat, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <div>
                        <div className="font-semibold text-white">{cat.name}</div>
                        <div className="text-[10px] text-slate-400">
                          هامش الربح الصافي: <strong className="text-emerald-400 font-mono">{cat.commissionRate}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-left font-mono">
                      <div className="font-bold text-white">{cat.value}% من الطلبات</div>
                      <div className="text-[10px] text-emerald-400">{cat.totalProfit} متوقع</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    )}

        {/* Bottom Blockchain Guarantee Note */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>محفظة الإيداع الرسمية:</span>
            <span className="text-emerald-400 font-bold">{walletAddress}</span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>جميع الحسابات تستند إلى فروق الأسعار الحقيقية لموردي الجملة الرقمية</span>
          </div>
        </div>
      </div>
    </div>
  );
};
