import React from 'react';
import { Bot, Power, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  botActive: boolean;
  onToggleBot: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  gasFees: { polygon: number; tron: number; solana: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  botActive,
  onToggleBot,
  isRefreshing,
  onRefresh,
  gasFees,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#070b12]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              CryptoDropship <span className="text-emerald-400">AI</span>
            </span>
            <span className="hidden sm:inline-block mr-2 text-xs text-slate-400">
              | وساطة العملات المستقرة والتقسيم الآلي
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('store')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'store'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-emerald-400/90 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>متجر الزبائن (Store)</span>
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'marketing'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-amber-400/90 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>التسويق الآلي وجلب المشترين (Marketing)</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            لوحة العمليات
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'radar'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            رادار الصفقات الفورية
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            نمو الأرباح (Recharts)
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'wallets'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            محافظ استلام العمولة
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'ledger'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            سجل العمولات
          </button>
          <button
            onClick={() => setActiveTab('advisor')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'advisor'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            مستشار الذكاء الاصطناعي
          </button>
          <button
            onClick={() => setActiveTab('feasibility')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'feasibility'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            دراسة الجدوى والواقع
          </button>
        </nav>

        {/* Zone 3: Primary Action & Live Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="تحديث أسعار السوق الآن"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={onToggleBot}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              botActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{botActive ? 'البوت يعمل آلياً' : 'البوت متوقف'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
