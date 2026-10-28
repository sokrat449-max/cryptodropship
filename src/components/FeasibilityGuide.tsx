import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Scale, Zap, Globe, Coins, Layers } from 'lucide-react';

export const FeasibilityGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Main Verdict Card */}
      <div className="border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Scale className="w-4 h-4" />
          <span>القرار النهائي والتحليل الاقتصادي للجدوى (Feasibility & Verdict)</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          القرار الحاسم: الفكرة قابلة للتحقيق وتحقيق أرباح مستدامة بشرط النموذج الرقمي الآلي
        </h2>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          بعد البحث المعمق والتدقيق الواقعي في طبيعة بوابات الدفع بالعملات المشفرة وموردي الجملة العالميين، وجدنا أن نموذج الوساطة الآلية وتقسيم العمولة اللحظي هو من أقوى نماذج الأعمال المعاصرة، بشرط تطبيقه في قطاع <strong className="text-emerald-400">السلع الرقمية وتراخيص البرمجيات وشرائح الـ eSIM والخدمات السحابية</strong> بدلاً من البضائع الفيزيائية التقليدية.
        </p>

        {/* Comparison: Why Physical fails vs Digital succeeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-rose-500/30 bg-rose-950/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>أين تفشل الفكرة؟ (الدروب شيبينغ المادي التقليدي)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400">✕</span>
                <span><strong>رفض الموردين للكريبتو:</strong> كبرى منصات الدروب شيبينغ المادية (AliExpress, CJ, Amazon) لا تقبل USDT مباشرة، وتتطلب بطاقات بنكية وتدقيق هوية صارم.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400">✕</span>
                <span><strong>مشاكل الشحن والجمارك:</strong> مدة الشحن (15-30 يوماً) تتسبب في نزاعات المشتري ومطالبات استرداد الأموال، مما يستحيل معه الأتمتة الكاملة دون فريق دعم بشري.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-400">✕</span>
                <span><strong>الضرائب وعناوين الشحن المعقدة:</strong> كل دولة لها جمارك ورسوم تختلف حسب الوزن والأبعاد.</span>
              </li>
            </ul>
          </div>

          <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>أين تنجح الفكرة 100%؟ (الوساطة الرقمية والتراخيص)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>قبول أصيل للعملات المستقرة:</strong> مجتمع مشتري التراخيص وخدمات الخصوصية والـ eSIM يبحثون بنشاط عن الدفع بـ USDT لتفادي القيود البنكية.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>تسليم فوري بالثواني عبر API:</strong> بمجرد دفع الزبون، يستدعي البوت API المورد ويولد كود التفعيل أو الـ QR ويسلمه في 3 ثوانٍ.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span><strong>انقسام فوري للعمولة (Instant Split):</strong> لا تحتجز أموالك في أي حساب؛ عمولتك الصافية تحول فوراً إلى محفظتك الشخصية.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Target Markets and Customers */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>الأسواق والزبائن المستهدفة التي تدفع بالعملات المستقرة</span>
        </div>

        <h3 className="text-xl font-bold text-white">
          من هم الزبائن الذين يشترون بالـ USDT وكيف نصل إليهم؟
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-emerald-400 font-bold text-sm">1. المسافرون الرقميون (eSIM Global)</div>
            <p className="text-slate-300 leading-relaxed">
              ملايين المسافرين حول العالم يحتاجون باقات إنترنت فورية عند النزول في المطارات. يفضلون الدفع بالعملات المستقرة بدلاً من رسوم تحويل العملات البنكية الباهظة.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-mono">متوسط الهامش: 45% - 60%</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-emerald-400 font-bold text-sm">2. المطورون وعشاق الخصوصية (VPN & SaaS)</div>
            <p className="text-slate-300 leading-relaxed">
              رواد أعمال، مطورو ذكاء اصطناعي، ومستخدمو الإنترنت الراغبون في شراء اشتراكات NordVPN، Proton، وخوادم Cloud GPU وقسائم OpenAI دون ربط بطاقاتهم الائتمانية.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-mono">متوسط الهامش: 30% - 50%</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-emerald-400 font-bold text-sm">3. قطاع الألعاب والبطاقات الرقمية (Gaming)</div>
            <p className="text-slate-300 leading-relaxed">
              جمهور ألعاب Steam، PlayStation، Xbox في الدول التي تفرض قيوداً على سحب النقد الأجنبي. يشترون البطاقات الرقمية بالـ USDT للحصول على ألعابهم فوراً.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-mono">متوسط الهامش: 18% - 25%</div>
          </div>
        </div>
      </div>

      {/* Legitimacy and Compliance */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>المشروعية والقانونية والالتزام الأخلاقي (Legal & Ethical Integrity)</span>
        </div>

        <h3 className="text-xl font-bold text-white">
          هل هذا العمل قانوني ومشروع بنسبة 100%؟
        </h3>

        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>نعم، مشروع وقانوني بالكامل للأسباب التالية:</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">1. وساطة تجارية برمجية واضحة (Brokerage):</span>
              الوساطة في البيع والشراء جائزة قانونياً وتجارياً ما دامت الأسعار والخدمات محددة والتسليم مضموناً للعميل.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">2. تراخيص رقمية أصلية ومعتمدة:</span>
              جميع المفاتيح والشرائح صادرة من الموزعين المعتمدين بالجملة (Authorized Wholesale Distributorships).
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">3. شفافية التعاقد:</span>
              يطلع المشتري على السعر الإجمالي بالـ USDT مسبقاً، ويوافق عليه طواعية، وتصل البضاعة الرقمية فور سداد القيمة.
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">4. خلو من المقامرة أو التلاعب:</span>
              العملات المستخدمة هي عملات مستقرة (USDT/USDC = $1.00 USD) لتجنب مخاطر التذبذب غير المحسوب.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
