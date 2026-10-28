import React, { useState } from 'react';
import { ArbitrageItem, WalletConfig, OrderExecution } from '../types';
import { X, CheckCircle, ShieldCheck, Key, Copy, Check, ExternalLink, QrCode, AlertCircle, ArrowRight } from 'lucide-react';

interface ExecutionModalProps {
  item: ArbitrageItem | null;
  onClose: () => void;
  config: WalletConfig;
  onSuccess?: (execution: OrderExecution) => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  item,
  onClose,
  config,
  onSuccess,
}) => {
  if (!item) return null;

  const [selectedChain, setSelectedChain] = useState<'polygon' | 'base' | 'tron'>('tron');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [inputTxHash, setInputTxHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedResult, setVerifiedResult] = useState<OrderExecution | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [pollStatus, setPollStatus] = useState<string>('البوت يستمع لشبكة TRON ويلتقط تحويلات USDT آلياً...');

  const activeWallet = selectedChain === 'tron' ? config.tronWallet : config.polygonWallet;
  const currency = selectedChain === 'tron' ? 'USDT' : 'USDC';
  const amountToPay = item.retailPriceUsd;

  // 100% Autonomous Blockchain Polling: Zero clicks required
  React.useEffect(() => {
    if (verifiedResult) return;

    const poller = setInterval(async () => {
      try {
        const res = await fetch('/api/crypto/poll-incoming-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            opportunityId: item.id,
            chain: selectedChain,
          }),
        });
        const data = await res.json();
        if (data.success && data.detected && data.execution) {
          setVerifiedResult(data.execution);
          if (onSuccess) onSuccess(data.execution);
        }
      } catch {
        // silent polling
      }
    }, 2800);

    return () => clearInterval(poller);
  }, [item.id, selectedChain, verifiedResult]);

  const handleCopy = (text: string, type: 'address' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleVerifyOnChain = async () => {
    if (!inputTxHash.trim()) {
      setVerificationError('يرجى إدخال هاش المعاملة الحقيقي (TxHash) الصادر من محفظتك أو من المشتري');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const res = await fetch('/api/crypto/verify-onchain-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: inputTxHash.trim(),
          opportunityId: item.id,
          chain: selectedChain,
        }),
      });

      const data = await res.json();
      if (data.success && data.execution) {
        setVerifiedResult(data.execution);
        if (onSuccess) onSuccess(data.execution);
      } else {
        setVerificationError(data.message || 'المعاملة غير موجودة على شبكة البلوكشين. تأكد من إتمام التحويل الحقيقي وظهوره على Polygonscan.');
      }
    } catch {
      setVerificationError('فشل الاتصال بنقطة البلوكشين (RPC). يرجى المحاولة لاحقاً.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#0b101b] border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>رصد واستماع آلي 100% (Autonomous On-Chain Receiver)</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {!verifiedResult ? (
            <>
              {/* Network Selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  شبكة استلام العملات المستهدفة:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedChain('tron'); setVerificationError(null); }}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      selectedChain === 'tron'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>TRON TRC-20 (USDT)</span>
                      <span className="text-[9px] bg-red-500/20 text-red-300 px-1 rounded">مفضلة</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 text-right">تحصيل USDT مباشر</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedChain('polygon'); setVerificationError(null); }}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      selectedChain === 'polygon'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>Polygon PoS (USDC)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">رسوم غاز شبه معدومة</div>
                  </button>
                </div>
              </div>

              {/* Autonomous Listening Radar Banner */}
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-2 text-slate-300">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span>الرصد الآلي نشط: لا تحتاج للضغط على أي زر</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">فحص RPC متواصل</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  بمجرد أن يقوم العميل بإرسال <strong className="text-emerald-400 font-mono">{amountToPay} {currency}</strong> إلى عنوانك أدناه، سيلتقط البوت العملية تلقائياً ويقتطع عمولتك ويسلم كود السلعة فوراً!
                </p>
              </div>

              {/* Payment Details Box */}
              <div className="border border-slate-800 bg-slate-950/80 rounded-xl p-4 space-y-3">
                {/* Amount */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400">المبلغ المطلوب تحويله:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums font-extrabold text-emerald-400 text-base">
                      {amountToPay.toFixed(2)} {currency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(amountToPay.toFixed(2), 'amount')}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      title="نسخ المبلغ"
                    >
                      {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Recipient Wallet */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>عنوان محفظتك لاستلام العملات:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeWallet, 'address')}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAddress ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAddress ? 'تم النسخ' : 'نسخ العنوان'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-emerald-300 bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 break-all select-all font-semibold">
                    {activeWallet}
                  </div>
                </div>

                {/* Split calculation */}
                <div className="pt-2 border-t border-slate-800 text-[11px] flex justify-between text-slate-400">
                  <span>تكلفة المورد: <span className="text-slate-300 font-mono">${item.wholesalePriceUsd.toFixed(2)}</span></span>
                  <span className="font-bold text-emerald-400 font-mono">
                    صافي عمولتك الآلية: +${item.estimatedNetMarginUsd.toFixed(2)} {currency}
                  </span>
                </div>
              </div>

              {/* Optional Manual Override Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{showManualInput ? '▼ إخفاء الفحص اليدوي' : '▶ هل تريد إدخال الهاش يدوياً لتسريع الفحص؟ (اختياري فقط)'}</span>
                </button>

                {showManualInput && (
                  <div className="mt-2 border border-slate-800 bg-slate-900/60 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] text-slate-400">
                      يمكنك لصق هاش المعاملة هنا للتحقق الفوري دون انتظار دورة الفحص التلقائية:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputTxHash}
                        onChange={(e) => setInputTxHash(e.target.value)}
                        placeholder="0x... (هاش المعاملة الحقيقي بطول 66 حرفاً)"
                        dir="ltr"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOnChain}
                        disabled={isVerifying || !inputTxHash.trim()}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                      >
                        {isVerifying ? 'فحص...' : 'تحقق'}
                      </button>
                    </div>
                    {verificationError && (
                      <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-[11px] flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{verificationError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Direct Explorer Check Button */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <a
                  href={selectedChain === 'tron' ? `https://tronscan.org/#/address/${activeWallet}` : `https://polygonscan.com/address/${activeWallet}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>فحص رصيدك الحقيقي والتحويلات على المستكشف</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </>
          ) : (
            /* Verified On-Chain Screen */
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  تم التحقق من المعاملة بنجاح على البلوكشين!
                </h4>
                <p className="text-xs text-slate-400">
                  تم التأكد من استلام العملات الحقيقية في محفظتك وتسجيل العمولة في كشف الحساب.
                </p>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-right space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">العمولة المؤكدة في محفظتك:</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-400 text-sm">
                    +{verifiedResult.netCommissionToUserUsd.toFixed(2)} {verifiedResult.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">رقم المعاملة على البلوكشين:</span>
                  <a
                    href={`https://polygonscan.com/tx/${verifiedResult.onChainTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-emerald-400 text-[11px] truncate max-w-[200px] hover:underline flex items-center gap-1"
                  >
                    <span>{verifiedResult.onChainTxHash}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                إغلاق والعودة للرادار
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
