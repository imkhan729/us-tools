import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  PiggyBank, BarChart3, Percent, Landmark, Building2, Megaphone,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
function useRoiCalc() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [period, setPeriod] = useState("");

  const result = useMemo(() => {
    const initial = parseFloat(initialInvestment);
    const final_ = parseFloat(finalValue);
    if (isNaN(initial) || isNaN(final_) || initial <= 0) return null;

    const netProfit = final_ - initial;
    const roi = ((final_ - initial) / initial) * 100;

    const years = parseFloat(period);
    let annualizedRoi: number | null = null;
    if (!isNaN(years) && years > 0) {
      annualizedRoi = (Math.pow(final_ / initial, 1 / years) - 1) * 100;
    }

    return { roi, netProfit, annualizedRoi, initial, final: final_, years: isNaN(years) ? null : years };
  }, [initialInvestment, finalValue, period]);

  return { initialInvestment, setInitialInvestment, finalValue, setFinalValue, period, setPeriod, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { roi: number; netProfit: number; annualizedRoi: number | null; initial: number; final: number; years: number | null } | null }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const isPositive = result.roi >= 0;

  let message = "";
  if (isPositive) {
    message = `Your investment of $${fmt(result.initial)} grew to $${fmt(result.final)}, generating a net profit of $${fmt(result.netProfit)} and a return on investment of ${fmt(result.roi)}%.`;
  } else {
    message = `Your investment of $${fmt(result.initial)} decreased to $${fmt(result.final)}, resulting in a net loss of $${fmt(Math.abs(result.netProfit))} and a negative ROI of ${fmt(result.roi)}%.`;
  }

  if (result.annualizedRoi !== null && result.years !== null) {
    message += ` Over ${result.years} year${result.years !== 1 ? "s" : ""}, your annualized return is ${fmt(result.annualizedRoi)}% per year.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 p-4 rounded-xl ${isPositive ? "bg-green-500/5 border border-green-500/20" : "bg-red-500/5 border border-red-500/20"}`}
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isPositive ? "text-green-500" : "text-red-500"}`} />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-green-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-green-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", icon: <PiggyBank className="w-5 h-5" />, color: 152, benefit: "See how interest compounds over time" },
  { title: "Simple Interest Calculator", slug: "online-simple-interest-calculator", icon: <Calculator className="w-5 h-5" />, color: 217, benefit: "Calculate SI = P × R × T / 100" },
  { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <Landmark className="w-5 h-5" />, color: 340, benefit: "Calculate monthly loan repayments" },
  { title: "Salary Calculator", slug: "online-salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25, benefit: "Convert hourly to annual salary" },
  { title: "Mortgage Calculator", slug: "mortgage-calculator", icon: <Building2 className="w-5 h-5" />, color: 265, benefit: "Find monthly mortgage payments" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45, benefit: "Find any percentage instantly" },
];

// ── Main Component ──
export default function RoiCalculator() {
  const calc = useRoiCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | null) => {
    if (n === null) return "--";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  const roiColor = calc.result
    ? calc.result.roi >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400"
    : "";

  const profitColor = calc.result
    ? calc.result.netProfit >= 0
      ? "text-blue-600 dark:text-blue-400"
      : "text-red-600 dark:text-red-400"
    : "";

  const annualizedColor = calc.result && calc.result.annualizedRoi !== null
    ? calc.result.annualizedRoi >= 0
      ? "text-purple-600 dark:text-purple-400"
      : "text-red-600 dark:text-red-400"
    : "";

  return (
    <Layout>
      <SEO
        title="ROI Calculator - Free Return on Investment Calculator | Calculate ROI Percentage"
        description="Free online ROI calculator. Calculate return on investment, net profit, and annualized ROI instantly. Easy-to-use investment return calculator with no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">ROI Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online ROI Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your return on investment instantly. See ROI percentage, net profit, and annualized returns for any investment — free, accurate, and no signup needed.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-full border border-green-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Clock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Finance &amp; Cost &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">ROI Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Initial Investment ($)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="tool-calc-input w-full"
                      value={calc.initialInvestment}
                      onChange={e => calc.setInitialInvestment(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Final Value ($)</label>
                    <input
                      type="number"
                      placeholder="15000"
                      className="tool-calc-input w-full"
                      value={calc.finalValue}
                      onChange={e => calc.setFinalValue(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Investment Period (years) — optional, for annualized ROI</label>
                    <input
                      type="number"
                      placeholder="5"
                      className="tool-calc-input w-full"
                      value={calc.period}
                      onChange={e => calc.setPeriod(e.target.value)}
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">ROI</div>
                    <div className={`text-lg font-black ${calc.result ? roiColor : ""}`}>
                      {calc.result ? `${fmt(calc.result.roi)}%` : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Net Profit</div>
                    <div className={`text-lg font-black ${calc.result ? profitColor : ""}`}>
                      {calc.result ? `$${fmt(calc.result.netProfit)}` : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Annualized ROI</div>
                    <div className={`text-lg font-black ${calc.result && calc.result.annualizedRoi !== null ? annualizedColor : ""}`}>
                      {calc.result && calc.result.annualizedRoi !== null ? `${fmt(calc.result.annualizedRoi)}%` : "--"}
                    </div>
                  </div>
                </div>

                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">ROI Formula</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the standard formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">ROI = ((Final Value - Initial Investment) / Initial Investment) x 100</code>. This gives you the total percentage return on your investment.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Net Profit Calculation</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Net profit is simply: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Net Profit = Final Value - Initial Investment</code>. For example, investing $10,000 that grows to $15,000 gives a net profit of $5,000 and an ROI of 50%.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Annualized ROI</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">To compare investments over different time periods, use annualized ROI: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Annualized ROI = ((Final / Initial)^(1/years) - 1) x 100</code>. This normalizes returns to a per-year basis.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Stock Investment</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">You buy $5,000 of stock that grows to $7,500 in 3 years. ROI = <strong className="text-foreground">50%</strong>, annualized ROI = <strong className="text-foreground">14.47%</strong> per year.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Real Estate</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Buy a property for $200,000 and sell for $280,000 after 5 years. ROI = <strong className="text-foreground">40%</strong>, annualized ROI = <strong className="text-foreground">6.96%</strong> per year.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Business Investment</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Invest $50,000 in a startup that returns $125,000 over 4 years. ROI = <strong className="text-foreground">150%</strong>, annualized ROI = <strong className="text-foreground">25.74%</strong> per year.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Marketing Campaign</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Spend $2,000 on ads that generate $8,000 in revenue. ROI = <strong className="text-foreground">300%</strong>. For every dollar spent, you earned $4 back.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant ROI results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate to 2 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Includes annualized ROI calculation" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-green-500">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is Return on Investment (ROI)?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  Return on Investment (ROI) is a financial metric used to evaluate the efficiency and profitability of an investment. It measures the percentage return relative to the investment's cost, making it one of the most widely used indicators in finance, business, and marketing. Whether you are evaluating a stock portfolio, a real estate deal, or a marketing campaign, ROI gives you a clear, comparable number to assess performance.
                </p>
                <p>
                  This free online ROI calculator helps you determine your total return on investment, net profit, and annualized ROI in seconds. Simply enter your initial investment amount and the final value to get instant, accurate results. Add an optional time period to see your annualized return, which is essential for comparing investments held over different durations.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">How Is ROI Calculated?</h3>
                <p>
                  The basic ROI formula is straightforward: subtract the initial investment from the final value, divide by the initial investment, and multiply by 100. For example, if you invest $10,000 and your investment grows to $13,000, your ROI is 30%. The annualized ROI formula accounts for the time dimension, using the geometric mean to normalize returns to a per-year basis. This makes it easy to compare a 2-year investment with a 10-year one on equal footing.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use an ROI Calculator?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Evaluating stock market or mutual fund investment performance",
                    "Analyzing real estate purchase and sale profitability",
                    "Measuring the effectiveness of marketing and advertising spend",
                    "Comparing different investment opportunities side by side",
                    "Assessing business expansion or capital expenditure returns",
                    "Presenting investment results to stakeholders or clients",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is ROI?"
                  a="ROI stands for Return on Investment. It is a percentage that measures how much profit or loss an investment has generated relative to its initial cost. A positive ROI means the investment gained value, while a negative ROI indicates a loss."
                />
                <FaqItem
                  q="How do I calculate ROI?"
                  a="Use the formula: ROI = ((Final Value - Initial Investment) / Initial Investment) x 100. For example, if you invested $10,000 and it grew to $14,000, your ROI is ((14000 - 10000) / 10000) x 100 = 40%."
                />
                <FaqItem
                  q="What is annualized ROI and why does it matter?"
                  a="Annualized ROI converts total return into an equivalent yearly rate using the formula: ((Final / Initial)^(1/years) - 1) x 100. It matters because it lets you fairly compare investments held for different time periods. A 50% return over 10 years is very different from 50% over 2 years."
                />
                <FaqItem
                  q="Can ROI be negative?"
                  a="Yes. A negative ROI means your investment lost value. If you invested $10,000 and it is now worth $8,000, your ROI is -20%. This calculator color-codes results in red for negative returns so you can quickly identify losses."
                />
                <FaqItem
                  q="Does this calculator account for fees and taxes?"
                  a="This calculator computes ROI based on the initial and final values you provide. To account for fees or taxes, subtract them from your final value before entering it. For example, if your investment grew to $15,000 but you paid $500 in fees, enter $14,500 as the final value."
                />
                <FaqItem
                  q="Is this ROI calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. It runs entirely in your browser — your financial data never leaves your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Financial Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including compound interest calculators, loan EMI tools, salary calculators, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate their return on investment easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-green-500/40 flex-shrink-0" />{label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
