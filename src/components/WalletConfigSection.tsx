import React, { useState } from 'react';
import { ShieldCheck, Check, AlertCircle, Copy, ArrowRight, Zap, Info, ExternalLink, Lock } from 'lucide-react';
import { WalletConfig } from '../types';

interface WalletConfigSectionProps {
  config: WalletConfig;
  onSaveConfig: (updated: Partial<WalletConfig>) => Promise<boolean>;
}

export const WalletConfigSection: React.FC<WalletConfigSectionProps> = ({ config, onSaveConfig }) => {
  const [polygonWallet, setPolygonWallet] = useState(config.polygonWallet || '0x25c6a4F452e2201620C11C75b050D0700dAfE4F7');
  const [baseWallet, setBaseWallet] = useState(config.baseWallet || '0x25c6a4F452e2201620C11C75b050D0700dAfE4F7');
  const [tronWallet, setTronWallet] = useState(config.tronWallet || 'TFaw7VkUDSvHT2sV9rqAGLKj17eqhenB6q');
  const [preferredChain, setPreferredChain] = useState(config.preferredChain || 'polygon');
  const [defaultCommissionRate, setDefaultCommissionRate] = useState(config.defaultCommissionRate || 22.5);
  const [minProfitMarginUsd, setMinProfitMarginUsd] = useState(config.minProfitMarginUsd || 5.0);
  const [autoExecute, setAutoExecute] = useState(config.autoExecute);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Address validation checks
  const isPolygonValid = /^0x[a-fA-F0-9]{40}$/.test(polygonWallet.trim());
  const isBaseValid = /^0x[a-fA-F0-9]{40}$/.test(baseWallet.trim());
  const isTronValid = /^T[a-zA-Z0-9]{33}$/.test(tronWallet.trim());

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const ok = await onSaveConfig({
        polygonWallet: polygonWallet.trim(),
        baseWallet: baseWallet.trim(),
        tronWallet: tronWallet.trim(),
        preferredChain,
        defaultCommissionRate: Number(defaultCommissionRate),
        minProfitMarginUsd: Number(minProfitMarginUsd),
        autoExecute,
      });

      if (ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Lock className="w-4 h-4" />
              <span>عناوين الاستلام الحقيقية المثبتة في محرك البوت</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              المحافظ الرسمية المعتمدة لتحصيل عمولاتك الصافية (USDC / USDT)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              تم تثبيت عناوينك الحقيقية بشكل دائم ومباشر في البوت. عند سداد أي مشتري عبر البوابة، يتم اقتطاع عمولتك الصافية فوراً وتوجيهها مباشرة إلى هذه العناوين على البلوكشين دون أي وسيط أو تعليق مالي.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-slate-900/90 border border-emerald-500/30 rounded-lg p-3">
            <Zap className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <div className="text-slate-400">حالة الربط والتحقق</div>
              <div className="text-emerald-400 font-semibold font-mono">
                3 محافظ مثبتة ونشطة ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Wallet Address Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Polygon USDC */}
          <div className={`border rounded-xl p-5 transition-all ${
            preferredChain === 'polygon'
              ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-500/10'
              : 'border-slate-800 bg-slate-900/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs">
                  POL
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Polygon PoS (USDC)</h3>
                  <span className="text-[11px] text-slate-400">رسوم شبه منعدمة (~$0.008)</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                مثبت وحقيقي ✓
              </span>
            </div>

            <div className="relative mb-2">
              <input
                type="text"
                value={polygonWallet}
                onChange={(e) => setPolygonWallet(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleCopy(polygonWallet, 'polygon')}
                className="absolute left-2 top-2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="نسخ العنوان"
              >
                {copiedKey === 'polygon' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <a
                href={`https://polygonscan.com/address/${polygonWallet}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>فحص على Polygonscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setPreferredChain('polygon')}
                className={`text-[11px] font-medium transition-colors cursor-pointer ${
                  preferredChain === 'polygon' ? 'text-emerald-400 font-semibold underline' : 'text-slate-400 hover:text-white'
                }`}
              >
                {preferredChain === 'polygon' ? '● الشبكة المفضلة' : 'تعيين كمفضلة'}
              </button>
            </div>
          </div>

          {/* 2. Base L2 / Ethereum USDC */}
          <div className={`border rounded-xl p-5 transition-all ${
            preferredChain === 'base'
              ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-500/10'
              : 'border-slate-800 bg-slate-900/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
                  BASE
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Base L2 / ETH (USDC)</h3>
                  <span className="text-[11px] text-slate-400">شبكة كوين بيس فائقة السرعة</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                مثبت وحقيقي ✓
              </span>
            </div>

            <div className="relative mb-2">
              <input
                type="text"
                value={baseWallet}
                onChange={(e) => setBaseWallet(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleCopy(baseWallet, 'base')}
                className="absolute left-2 top-2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="نسخ العنوان"
              >
                {copiedKey === 'base' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <a
                href={`https://basescan.org/address/${baseWallet}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>فحص على Basescan</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setPreferredChain('base')}
                className={`text-[11px] font-medium transition-colors cursor-pointer ${
                  preferredChain === 'base' ? 'text-emerald-400 font-semibold underline' : 'text-slate-400 hover:text-white'
                }`}
              >
                {preferredChain === 'base' ? '● الشبكة المفضلة' : 'تعيين كمفضلة'}
              </button>
            </div>
          </div>

          {/* 3. TRON TRC-20 USDT */}
          <div className={`border rounded-xl p-5 transition-all ${
            preferredChain === 'tron'
              ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-500/10'
              : 'border-slate-800 bg-slate-900/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs">
                  TRX
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">TRON TRC-20 (USDT)</h3>
                  <span className="text-[11px] text-slate-400">الأكثر انتشاراً في التجارة العالمية</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                مثبت وحقيقي ✓
              </span>
            </div>

            <div className="relative mb-2">
              <input
                type="text"
                value={tronWallet}
                onChange={(e) => setTronWallet(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleCopy(tronWallet, 'tron')}
                className="absolute left-2 top-2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="نسخ العنوان"
              >
                {copiedKey === 'tron' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <a
                href={`https://tronscan.org/#/address/${tronWallet}`}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>فحص على Tronscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setPreferredChain('tron')}
                className={`text-[11px] font-medium transition-colors cursor-pointer ${
                  preferredChain === 'tron' ? 'text-emerald-400 font-semibold underline' : 'text-slate-400 hover:text-white'
                }`}
              >
                {preferredChain === 'tron' ? '● الشبكة المفضلة' : 'تعيين كمفضلة'}
              </button>
            </div>
          </div>
        </div>

        {/* Commission Engine Rules */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>قواعد اقتطاع العمولة والحدود الآمنة للربح</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                نسبة العمولة الافتراضية فوق سعر الجملة (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="80"
                  step="0.5"
                  value={defaultCommissionRate}
                  onChange={(e) => setDefaultCommissionRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400 font-mono">%</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                تُضاف تلقائياً فوق تكلفة المورد عند عرض السعر للزبائن
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                الحد الأدنى لصافي الربح لكل عملية (USD)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="0.5"
                  value={minProfitMarginUsd}
                  onChange={(e) => setMinProfitMarginUsd(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400 font-mono">USDC/USDT</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                يرفض البوت أي صفقة يقل صافي ربحها عن هذا المبلغ بعد خصم الغاز
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                وضع التنفيذ الآلي الذاتي (Autonomous Execution)
              </label>
              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoExecute}
                    onChange={(e) => setAutoExecute(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-xs text-slate-200">
                    تنفيذ فوري تلقائي عند ورود أي طلب دون انتظار موافقة يدوية
                  </span>
                </label>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 block">
                إذا تم إيقافه، سيتطلب البوت نقرة واحدة للموافقة على كل صفقة
              </span>
            </div>
          </div>
        </div>

        {/* Feedback / Save Actions */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-300 text-xs">
            <Check className="w-4 h-4 shrink-0" />
            <span>تم حفظ وتثبيت المحافظ الحقيقية بنجاح! جميع العمولات القادمة ستصل مباشرة إلى هذه العناوين.</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            {saving ? (
              <span>جاري التحقق والتثبيت...</span>
            ) : (
              <>
                <span>تثبيت العناوين الحقيقية في البوت</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
