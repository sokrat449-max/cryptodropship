import React, { useState } from 'react';
import { Bot, Sparkles, Send, ArrowRight, ShieldCheck, TrendingUp, Lightbulb } from 'lucide-react';

export const GeminiAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const quickQuestions = [
    'ما هي أكثر 3 منتجات رقمية طلباً للشراء بالـ USDT حالياً؟',
    'كيف نتفادى تآكل الأرباح عند ارتفاع رسوم شبكة TRON مقارنة بـ Polygon؟',
    'ما هي استراتيجية التسعير المثالية لشرائح eSIM لتحقيق أسرع مبيعات؟',
    'هل الأفضل التركيز على تراخيص البرمجيات أم بطاقات الألعاب؟',
  ];

  const handleAsk = async (userPrompt: string) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userPrompt,
          itemCategory: category,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisResult('حدث خطأ أثناء الاتصال بنموذج التحليل.');
      }
    } catch {
      setAnalysisResult('حدث خطأ في الشبكة، يرجى إعادة المحاولة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>مستشار السوق الذكي (Gemini 3.8 Flash Market Intelligence)</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          تحليل اقتصادي واستراتيجي لفرص الدروب شيبينغ بالعملات المستقرة
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          يقوم نموذج الذكاء الاصطناعي برصد اتجاهات السيولة العالمية للـ USDT، وتحليل سلوك المشترين في أسواق السلع الرقمية، وتحديد هوامش الربح الأكثر أماناً لحماية عمولاتك من التذبذب أو رسوم الغاز المرتفعة.
        </p>

        {/* Quick Prompts */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>استفسارات استراتيجية شائعة:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(q);
                  handleAsk(q);
                }}
                className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors cursor-pointer text-right"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input box */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) handleAsk(query);
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب سؤالك الاقتصادي هنا أو اطلب ترشيح أفضل صفقات اليوم..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <span>جاري التحليل...</span>
            ) : (
              <>
                <span>استشارة الذكاء الاصطناعي</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <div className="border border-emerald-500/30 bg-slate-900/80 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Bot className="w-4 h-4" />
            <span>تقرير مستشار Gemini 3.8 Flash الاقتصادي:</span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            {analysisResult}
          </div>
        </div>
      )}
    </div>
  );
};
