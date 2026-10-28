import React, { useState } from 'react';
import { OrderExecution } from '../types';
import { ExternalLink, Copy, Check, ShieldCheck, ArrowDownLeft, FileSpreadsheet } from 'lucide-react';

interface LedgerTableProps {
  ledger: OrderExecution[];
  totalCommissionEarned: number;
  totalVolume: number;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({
  ledger,
  totalCommissionEarned,
  totalVolume,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getExplorerUrl = (walletAddress: string, chain: 'polygon' | 'base' | 'ethereum' | 'tron' | 'solana') => {
    if (chain === 'tron') return `https://tronscan.org/#/address/${walletAddress}`;
    if (chain === 'base') return `https://basescan.org/address/${walletAddress}`;
    if (chain === 'ethereum') return `https://etherscan.io/address/${walletAddress}`;
    if (chain === 'solana') return `https://solscan.io/account/${walletAddress}`;
    return `https://polygonscan.com/address/${walletAddress}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">إجمالي العمولات المحصلة إلى محفظتك</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            +${totalCommissionEarned.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">USDT</span>
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1">حولت مباشرة إلى عنوانك</div>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">إجمالي حجم التداول المعالج</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            ${totalVolume.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">USDT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">مدفوعات زبائن رقمية</div>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">عدد الصفقات المنفذة بنجاح</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {ledger.length}{' '}
            <span className="text-xs text-slate-400 font-normal">صفقة</span>
          </div>
          <div className="text-[11px] text-cyan-500/80 mt-1">تسليم آلي فوري 100%</div>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">متوسط نسبة الهامش الصافي</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {totalVolume > 0 ? ((totalCommissionEarned / totalVolume) * 100).toFixed(1) : '0'}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">بدون أي تكلفة رأس مال</div>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              سجل التحويلات والعمولات المقتطعة آلياً (Audit Ledger)
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            تحديث فوري لكل حركة على البلوكشين
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">رقم العملية والوقت</th>
                <th className="py-3 px-4">المنتج والتصنيف</th>
                <th className="py-3 px-4">الشبكة</th>
                <th className="py-3 px-4">المبلغ من الزبون</th>
                <th className="py-3 px-4">تكلفة المورد</th>
                <th className="py-3 px-4 font-bold text-emerald-400">عمولتك الصافية</th>
                <th className="py-3 px-4">المحفظة المستلمة</th>
                <th className="py-3 px-4">كود التسليم / TxHash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {ledger.map((tx) => (
                <tr key={tx.txId} className="hover:bg-slate-800/30 transition-colors">
                  {/* ID & Date */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-semibold text-slate-200">{tx.txId}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(tx.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-white max-w-[220px] truncate">{tx.productTitle}</div>
                    <div className="text-[10px] text-slate-400">{tx.category}</div>
                  </td>

                  {/* Chain */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-800 text-slate-300">
                      {tx.chain} ({tx.currency})
                    </span>
                  </td>

                  {/* Customer Paid */}
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                    ${tx.totalPaidByCustomerUsd.toFixed(2)}
                  </td>

                  {/* Supplier Cost */}
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-400">
                    ${tx.wholesaleSupplierCostUsd.toFixed(2)}
                  </td>

                  {/* Net Commission */}
                  <td className="py-3 px-4 font-mono tabular-nums font-bold text-emerald-400 text-sm">
                    +${tx.netCommissionToUserUsd.toFixed(2)}
                  </td>

                  {/* User Recipient Wallet */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[120px]">{tx.userRecipientWallet}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(tx.userRecipientWallet, `wallet-${tx.txId}`)}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="نسخ عنوان المحفظة"
                      >
                        {copiedKey === `wallet-${tx.txId}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  {/* Delivered Key & TxHash */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-[11px] text-emerald-300 max-w-[130px] truncate bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {tx.deliveredItemKey}
                      </div>
                      <a
                        href={getExplorerUrl(tx.userRecipientWallet, tx.chain)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px]"
                        title="فحص عنوان محفظتك وتحويلات الـ USDC على المستكشف"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono text-emerald-400/90 hover:underline">المستكشف</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {ledger.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="text-slate-400 text-xs mb-1">
                      لا توجد صفقات منفذة حتى الآن.
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      بمجرد ورود أول طلب من المشتري واقتطاع العمولة إلى محفظتك، سيتم قيد المعاملة وهاش البلوكشين وتفاصيل الإيداع هنا تلقائياً.
                    </div>
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
