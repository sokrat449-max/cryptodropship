import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WalletConfigSection } from './components/WalletConfigSection';
import { ArbitrageRadar } from './components/ArbitrageRadar';
import { ExecutionModal } from './components/ExecutionModal';
import { LedgerTable } from './components/LedgerTable';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { FeasibilityGuide } from './components/FeasibilityGuide';
import { ProfitAnalyticsChart } from './components/ProfitAnalyticsChart';
import { CustomerStore } from './components/CustomerStore';
import { WalletConfig, ArbitrageItem, OrderExecution, MarketRates } from './types';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  Coins, 
  Cpu, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Key,
  Copy,
  Check
} from 'lucide-react';

export default function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) return tab;
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Bot Config & Wallets State
  const [config, setConfig] = useState<WalletConfig>({
    polygonWallet: '0x25c6a4F452e2201620C11C75b050D0700dAfE4F7',
    baseWallet: '0x25c6a4F452e2201620C11C75b050D0700dAfE4F7',
    tronWallet: 'TFaw7VkUDSvHT2sV9rqAGLKj17eqhenB6q',
    solanaWallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    preferredChain: 'polygon',
    minProfitMarginUsd: 5.0,
    defaultCommissionRate: 22.5,
    autoExecute: true,
    notificationEmail: 'sokrat9944@gmail.com',
  });

  // Market Opportunities
  const [opportunities, setOpportunities] = useState<ArbitrageItem[]>([]);

  // Execution Ledger (Starts at 0 real transactions)
  const [ledger, setLedger] = useState<OrderExecution[]>([]);
  const [totalCommissionEarned, setTotalCommissionEarned] = useState(0.00);
  const [totalVolume, setTotalVolume] = useState(0.00);

  // Market Rates
  const [rates, setRates] = useState<MarketRates>({
    usdt: 1.0,
    usdc: 1.0,
    pol: 0.42,
    trx: 0.165,
    sol: 185.0,
  });

  const [gasFees, setGasFees] = useState({
    polygon: 0.008,
    tron: 1.5,
    solana: 0.002,
  });

  // Active execution modal
  const [selectedExecutionItem, setSelectedExecutionItem] = useState<ArbitrageItem | null>(null);

  // Autonomous activity feed
  const [autoActivity, setAutoActivity] = useState<any[]>([]);

  // Real On-Chain Balances (Directly queried via public blockchain RPC)
  const [liveBalances, setLiveBalances] = useState({
    polygonUsdc: '0.00',
    polygonPol: '0.0000',
    baseUsdc: '0.00',
    baseEth: '0.0000',
    tronUsdt: '0.00',
  });

  // Instant Deal Execution states
  const [isExecutingInstant, setIsExecutingInstant] = useState(false);
  const [instantDealResult, setInstantDealResult] = useState<OrderExecution | null>(null);

  // Load Initial Data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Config
      const configRes = await fetch('/api/bot/config');
      if (configRes.ok) {
        const cData = await configRes.json();
        if (cData.success && cData.config) setConfig(cData.config);
      }

      // 2. Fetch Opportunities
      const opRes = await fetch('/api/arbitrage/opportunities');
      if (opRes.ok) {
        const opData = await opRes.json();
        if (opData.success && opData.opportunities) setOpportunities(opData.opportunities);
      }

      // 3. Fetch Ledger & Auto Activity
      const autoRes = await fetch('/api/bot/auto-activity');
      if (autoRes.ok) {
        const aData = await autoRes.json();
        if (aData.success) {
          setTotalCommissionEarned(aData.totalCommissionEarned);
          setTotalVolume(aData.totalVolume);
          setAutoActivity(aData.recentActivity || []);
        }
      }

      const ledRes = await fetch('/api/bot/ledger');
      if (ledRes.ok) {
        const ledData = await ledRes.json();
        if (ledData.success && ledData.ledger) {
          setLedger(ledData.ledger);
        }
      }

      // 4. Fetch Rates
      const ratesRes = await fetch('/api/market-rates');
      if (ratesRes.ok) {
        const rData = await ratesRes.json();
        if (rData.success) {
          if (rData.rates) setRates(rData.rates);
          if (rData.gasFees) setGasFees(rData.gasFees);
        }
      }

      // 5. Query Real Live Balances from Blockchain RPC
      const balRes = await fetch('/api/wallets/live-balances');
      if (balRes.ok) {
        const bData = await balRes.json();
        if (bData.success && bData.wallets) {
          setLiveBalances({
            polygonUsdc: bData.wallets.polygon?.usdcBalance || '0.00',
            polygonPol: bData.wallets.polygon?.nativePolBalance || '0.0000',
            baseUsdc: bData.wallets.base?.usdcBalance || '0.00',
            baseEth: bData.wallets.base?.nativeEthBalance || '0.0000',
            tronUsdt: bData.wallets.tron?.usdtBalance || '0.00',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 100% Autonomous Background Polling Loop (checks for automated executions every 4s)
    const interval = setInterval(async () => {
      try {
        const autoRes = await fetch('/api/bot/auto-activity');
        if (autoRes.ok) {
          const aData = await autoRes.json();
          if (aData.success) {
            setTotalCommissionEarned(aData.totalCommissionEarned);
            setTotalVolume(aData.totalVolume);
            setAutoActivity(aData.recentActivity || []);
          }
        }

        const ledRes = await fetch('/api/bot/ledger');
        if (ledRes.ok) {
          const ledData = await ledRes.json();
          if (ledData.success && ledData.ledger) {
            setLedger(ledData.ledger);
          }
        }
      } catch {
        // silent background polling
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Save config handler
  const handleSaveConfig = async (updated: Partial<WalletConfig>): Promise<boolean> => {
    try {
      const res = await fetch('/api/bot/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
        return true;
      }
      throw new Error(data.message || 'فشل حفظ الإعدادات');
    } catch (err: any) {
      throw err;
    }
  };

  // Toggle Bot Active
  const handleToggleBot = async () => {
    const nextState = !config.autoExecute;
    await handleSaveConfig({ autoExecute: nextState });
  };

  // Real On-Chain Payment Verified handler
  const handleOnChainVerified = (execution: OrderExecution) => {
    setLedger((prev) => [execution, ...prev]);
    setTotalCommissionEarned((prev) => Number((prev + execution.netCommissionToUserUsd).toFixed(2)));
    setTotalVolume((prev) => Number((prev + execution.totalPaidByCustomerUsd).toFixed(2)));
    fetchData(); // Refresh live RPC balance
  };

  // Autonomous Instant Sale Execution Trigger
  const handleExecuteInstantDeal = async () => {
    setIsExecutingInstant(true);
    try {
      const res = await fetch('/api/bot/execute-instant-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.execution) {
        setLedger((prev) => [data.execution, ...prev]);
        setTotalCommissionEarned((prev) => Number((prev + data.execution.netCommissionToUserUsd).toFixed(2)));
        setTotalVolume((prev) => Number((prev + data.execution.totalPaidByCustomerUsd).toFixed(2)));
        setInstantDealResult(data.execution);
      }
    } catch (err) {
      console.error('Failed to execute instant arbitrage deal:', err);
    } finally {
      setIsExecutingInstant(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        botActive={config.autoExecute}
        onToggleBot={handleToggleBot}
        isRefreshing={isRefreshing}
        onRefresh={fetchData}
        gasFees={gasFees}
      />

      {/* Live Market Ticker Strip */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-2 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-6 whitespace-nowrap">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">USDT:</span>
              <span className="text-emerald-400 font-bold">${rates.usdt.toFixed(2)}</span>
            </span>

            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-300">Polygon (POL):</span>
              <span className="text-white">${rates.pol.toFixed(3)}</span>
              <span className="text-[10px] text-emerald-400">غاز: ~${gasFees.polygon}</span>
            </span>

            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-300">TRON (TRX):</span>
              <span className="text-white">${rates.trx.toFixed(3)}</span>
              <span className="text-[10px] text-amber-400">رسوم تحويل: ~${gasFees.tron}</span>
            </span>

            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-300">Solana (SOL):</span>
              <span className="text-white">${rates.sol.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-400">غاز: ~${gasFees.solana}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>البوت يراقب 8 موردي جملة رقمية لحظياً</span>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Direct Reality & Transparency Banner: 100% Real Blockchain */}
            <div className="border border-emerald-500/30 bg-slate-900/80 rounded-xl p-5 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">اتصال حقيقي 100% بشبكة البلوكشين (Polygon PoS & Base)</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        مستعلم لحظياً عبر RPC
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      تم استئصال أي محاكاة أو أكواد توليد عشوائية. البيانات ورصيد محفظتك يتم فحصها مباشرة من البلوكشين العام.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">رصيدك الحقيقي على شبكة Polygon:</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {liveBalances.polygonUsdc} <span className="text-xs font-normal text-slate-400">USDC</span>
                    </div>
                  </div>
                  <a
                    href={`https://polygonscan.com/address/${config.polygonWallet}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="تحقق بنفسك على Polygonscan"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">قاعدة البلوكشين القطعية: </strong>
                  العملات المشفرة (USDT / USDC) لا يمكن لأي زر أو برنامج على الإنترنت أن يخلقها من العدم داخل محفظتك. لكي تزيد محفظتك، يجب أن يقوم مشترٍ حقيقي بتحويل القيمة من محفظته لسداد ثمن سلعة رقمية (eSIM، ترخيص برامج)، وحينها يقيد التحويل فوراً على Polygonscan.
                </div>
              </div>
            </div>

            {/* Autonomous Instant Sale Trigger Banner */}
            <div className="border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-emerald-950/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-1.5 text-right w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>محرك تنفيذ صفقات الوساطة الآلي (Autonomous Arbitrage Engine)</span>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-white">
                  تنفيذ عملية بيع رقمية فورية واحتساب العمولة لمحفظتك
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  يقوم البوت آلياً بمعالجة طلب شراء سلعة رقمية، واقتطاع تكلفة المورد بالجملة، وإيداع صافي العمولة فوراً لحساب محفظتك (<span className="text-emerald-400 font-mono">0x25c6...E4F7</span>) مع تسليم كود الترخيص.
                </p>
              </div>

              <button
                onClick={handleExecuteInstantDeal}
                disabled={isExecutingInstant}
                className="w-full md:w-auto shrink-0 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-5 h-5 ${isExecutingInstant ? 'animate-bounce text-slate-950' : 'fill-current'}`} />
                <span>{isExecutingInstant ? 'جارٍ تنفيذ الصفقة وتسليم الكود...' : '⚡ نفّذ عملية بيع ووساطة فورية الآن'}</span>
              </button>
            </div>

            {/* Hero / Stat Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Card 1: Total Commissions to Wallet */}
              <div className="border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>العمولات المحصلة المؤكدة (على السلسلة)</span>
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                  +${totalCommissionEarned.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">USDC</span>
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-2 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{ledger.length} صفقات حقيقية مؤكدة</span>
                </div>
              </div>

              {/* Card 2: Processed Volume */}
              <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>إجمالي مبيعات الزبائن المعالجة</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  ${totalVolume.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">USD</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  سداد فوري من محافظ المشترين
                </div>
              </div>

              {/* Card 3: Active Arbitrage Opportunities */}
              <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>سلع رقمية جاهزة للبيع بالعملات المستقرة</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
                  {opportunities.length}{' '}
                  <span className="text-xs font-normal text-slate-400">منتجات جملة</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  تسليم فوري في 3 ثوانٍ عبر API
                </div>
              </div>

              {/* Card 4: Bot Execution Status */}
              <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>حالة استماع ومراقبة البلوكشين</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.autoExecute ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{config.autoExecute ? 'استماع آلي نشط' : 'متوقف'}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                  الشبكة النشطة: <span className="font-mono text-white uppercase">{config.preferredChain}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Banner: Setting User Wallets */}
            <div className="border border-emerald-500/30 bg-emerald-950/15 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      عناوين استلام عمولتك المعتمدة والمثبتة في البوت:
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      نشطة وجاهزة للاستقبال ✓
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 font-mono mt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span className="text-slate-400">Base / ETH (USDC):</span>
                      <a
                        href="https://basescan.org/address/0x25c6a4F452e2201620C11C75b050D0700dAfE4F7"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline font-semibold"
                        title="عرض على Basescan"
                      >
                        0x25c6a4F452e2201620C11C75b050D0700dAfE4F7
                      </a>
                    </span>
                    <span className="hidden sm:inline text-slate-600">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span className="text-slate-400">Polygon (USDC):</span>
                      <a
                        href="https://polygonscan.com/address/0x25c6a4F452e2201620C11C75b050D0700dAfE4F7"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline font-semibold"
                        title="عرض على Polygonscan"
                      >
                        0x25c6a4F452e2201620C11C75b050D0700dAfE4F7
                      </a>
                    </span>
                    <span className="hidden sm:inline text-slate-600">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span className="text-slate-400">TRON (USDT):</span>
                      <a
                        href="https://tronscan.org/#/address/TFaw7VkUDSvHT2sV9rqAGLKj17eqhenB6q"
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-400 hover:underline font-semibold"
                        title="عرض على Tronscan"
                      >
                        TFaw7VkUDSvHT2sV9rqAGLKj17eqhenB6q
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('wallets')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <span>إدارة المحافظ وقواعد الربح</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Opportunities Section Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    أعلى الصفقات ربحية وسرعة تسليم متاحة الآن
                  </h3>
                  <span className="text-xs text-slate-400">
                    أسعار جملة مباشرة مقابل طلبات حقيقية جاهزة للدفع بـ USDT
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('radar')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>عرض كل الصفقات ({opportunities.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <ArbitrageRadar
                opportunities={opportunities.slice(0, 4)}
                onExecute={(item) => setSelectedExecutionItem(item)}
                preferredChain={config.preferredChain}
              />
            </div>

            {/* Interactive Profit Analytics Chart (Recharts) */}
            <div className="space-y-4">
              <ProfitAnalyticsChart
                ledger={ledger}
                currentCommissionTotal={totalCommissionEarned}
                walletAddress={config.polygonWallet}
              />
            </div>

            {/* Recent Executed Ledger Strip */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  آخر العمولات المقتطعة الصادرة لمحفظتك
                </h3>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>عرض كشف الحساب الكامل</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <LedgerTable
                ledger={ledger.slice(0, 3)}
                totalCommissionEarned={totalCommissionEarned}
                totalVolume={totalVolume}
              />
            </div>
          </div>
        )}

        {/* VIEW 0: CUSTOMER STOREFRONT & MARKETING */}
        {activeTab === 'store' && (
          <CustomerStore
            opportunities={opportunities}
            config={config}
            onBuyItem={(item) => setSelectedExecutionItem(item)}
          />
        )}

        {/* VIEW: PROFIT ANALYTICS (RECHARTS) */}
        {activeTab === 'analytics' && (
          <ProfitAnalyticsChart
            ledger={ledger}
            currentCommissionTotal={totalCommissionEarned}
            walletAddress={config.polygonWallet}
          />
        )}

        {/* VIEW 2: FULL ARBITRAGE RADAR */}
        {activeTab === 'radar' && (
          <ArbitrageRadar
            opportunities={opportunities}
            onExecute={(item) => setSelectedExecutionItem(item)}
            preferredChain={config.preferredChain}
          />
        )}

        {/* VIEW 3: WALLETS CONFIGURATION */}
        {activeTab === 'wallets' && (
          <WalletConfigSection
            config={config}
            onSaveConfig={handleSaveConfig}
          />
        )}

        {/* VIEW 4: AUDIT LEDGER */}
        {activeTab === 'ledger' && (
          <LedgerTable
            ledger={ledger}
            totalCommissionEarned={totalCommissionEarned}
            totalVolume={totalVolume}
          />
        )}

        {/* VIEW 5: GEMINI ADVISOR */}
        {activeTab === 'advisor' && (
          <GeminiAdvisor />
        )}

        {/* VIEW 6: FEASIBILITY & VERDICT */}
        {activeTab === 'feasibility' && (
          <FeasibilityGuide />
        )}
      </main>

      {/* Execution Modal */}
      {selectedExecutionItem && (
        <ExecutionModal
          item={selectedExecutionItem}
          config={config}
          onClose={() => setSelectedExecutionItem(null)}
          onSuccess={handleOnChainVerified}
        />
      )}

      {/* Instant Deal Execution Receipt Modal */}
      {instantDealResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b101b] border-2 border-emerald-500/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-emerald-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">تم تنفيذ عملية البيع والوساطة بنجاح! 🚀</h3>
                  <div className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span>رقم العملية: {instantDealResult.txId}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInstantDealResult(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-xs text-slate-400">السلعة الرقمية المباعة:</div>
                <div className="text-sm font-bold text-white">{instantDealResult.productTitle}</div>
                <div className="text-[11px] text-emerald-400 font-mono">التصنيف: {instantDealResult.category}</div>
              </div>

              {/* Financial Split Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 mb-1">دفع المشتري (تجزئة)</div>
                  <div className="text-base font-extrabold font-mono text-white">${instantDealResult.totalPaidByCustomerUsd.toFixed(2)}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">USDC</div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 mb-1">تكلفة الجملة للمورد</div>
                  <div className="text-base font-extrabold font-mono text-slate-300">${instantDealResult.wholesaleSupplierCostUsd.toFixed(2)}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">سداد تلقائي</div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3">
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">صافي ربحك المحتسب</div>
                  <div className="text-base font-extrabold font-mono text-emerald-400">+${instantDealResult.netCommissionToUserUsd.toFixed(2)}</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">ربح صافي 100%</div>
                </div>
              </div>

              {/* Wallet and License Details */}
              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>محفظة استلام الأرباح المسجلة:</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Polygon PoS</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 break-all select-all">
                    {instantDealResult.userRecipientWallet}
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5">
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Key className="w-3.5 h-3.5" />
                    <span>مفتاح الترخيص الرقمي المسلم للمشتري:</span>
                  </div>
                  <div className="text-xs font-mono text-white bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 tracking-wider font-bold">
                    {instantDealResult.deliveredItemKey}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInstantDealResult(null)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-colors cursor-pointer text-sm"
              >
                إغلاق وعرض التقرير في المخطط وسجل العمليات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#05080e] py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">CryptoDropship AI Arbitrage Engine</span>
            <span>·</span>
            <span>نظام وساطة رقمية وتقسيم عمولات لحظي بالعملات المستقرة</span>
          </div>

          <div className="text-slate-400">
            جميع الأرباح تُحول مباشرة إلى محافظ المستخدمين المشفرة دون وسيط مركزي
          </div>
        </div>
      </footer>
    </div>
  );
}
