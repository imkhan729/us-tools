import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  PiggyBank, BarChart3, Percent, Landmark,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Frequency = "monthly" | "quarterly" | "semi-annually" | "annually";

function freqToN(f: Frequency): number {
  switch (f) {
    case "monthly": return 12;
    case "quarterly": return 4;
    case "semi-annually": return 2;
    case "annually": return 1;
  }
}

function useCompoundCalc() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("annually");

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);
    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || T <= 0) return null;
    const n = freqToN(frequency);
    const r = R / 100;
    const A = P * Math.pow(1 + r / n, n * T);
    const interest = A - P;
    return { amount: A, interest, principal: P, rate: R, time: T, n };
  }, [principal, rate, time, frequency]);

  return { principal, setPrincipal, rate, setRate, time, setTime, frequency, setFrequency, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { amount: number; interest: number; principal: number; rate: number; time: number; n: number } | null }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const multiple = (result.amount / result.principal).toFixed(2);

  const message = `Your initial investment of $${fmt(result.principal)} will grow to $${fmt(result.amount)} in ${result.time} year${result.time !== 1 ? "s" : ""}, earning $${fmt(result.interest)} in compound interest. Your money will have multiplied ${multiple}x. The power of compounding means your interest earns interest over time.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
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
  { title: "Simple Interest Calculator", slug: "simple-interest-calculator", icon: <Calculator className="w-5 h-5" />, color: 217 },
  { title: "Loan EMI Calculator", slug: "loan-emi-calculator", icon: <Landmark className="w-5 h-5" />, color: 340 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152 },
  { title: "Tip Calculator", slug: "tip-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25 },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <Percent className="w-5 h-5" />, color: 265 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function CompoundInterestCalculator() {
  const calc = useCompoundCalc();
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

  return (
    <Layout>
      <SEO
        title="Compound Interest Calculator - Free Online Tool | Calculate Investment Growth"
        description="Free online compound interest calculator. Calculate investment growth with monthly, quarterly, or yearly compounding. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Compound Interest Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <DollarSign className="w-3.5 h-3.5" />
                Finance & Cost
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Compound Interest Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate how your investments grow with compound interest. See your future balance, total interest earned, and the power of compounding — free, instant, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter your values below — results update as you type. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Compound Interest Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Principal Amount ($)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="tool-calc-input w-full"
                      value={calc.principal}
                      onChange={e => calc.setPrincipal(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Annual Interest Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="7"
                        className="tool-calc-input w-full"
                        value={calc.rate}
                        onChange={e => calc.setRate(e.target.value)}
                      />
                      <Percent className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Time Period (years)</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="tool-calc-input w-full"
                      value={calc.time}
                      onChange={e => calc.setTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Compounding Frequency</label>
                    <select
                      className="tool-calc-input w-full"
                      value={calc.frequency}
                      onChange={e => calc.setFrequency(e.target.value as Frequency)}
                    >
                      <option value="monthly">Monthly (12x/year)</option>
                      <option value="quarterly">Quarterly (4x/year)</option>
                      <option value="semi-annually">Semi-Annually (2x/year)</option>
                      <option value="annually">Annually (1x/year)</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Final Amount</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ${calc.result ? fmt(calc.result.amount) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Interest</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ${calc.result ? fmt(calc.result.interest) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Principal</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      ${calc.principal ? fmt(parseFloat(calc.principal)) : "--"}
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
                    <h4 className="font-bold text-foreground mb-1">Compound Interest Formula</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">A = P(1 + r/n)^(nt)</code> where P = principal, r = annual rate (decimal), n = compounds per year, t = time in years.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Interest Earned</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The total interest is: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Interest = A - P</code>. For example, $10,000 at 7% compounded annually for 10 years: A = 10000(1 + 0.07)^10 = $19,671.51, Interest = $9,671.51.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Compounding Frequency Effect</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">More frequent compounding produces higher returns. Monthly compounding earns slightly more than annual because interest starts earning interest sooner.</p>
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
                    <PiggyBank className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Savings Account</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Deposit $5,000 in a savings account at 4.5% compounded monthly for 5 years. Your balance grows to <strong className="text-foreground">$6,258.98</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Fixed Deposit</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Invest $25,000 in a 3-year FD at 6% compounded quarterly. Maturity value: <strong className="text-foreground">$29,876.74</strong>, earning $4,876.74 in interest.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Retirement Savings</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Invest $50,000 at 8% compounded annually for 30 years. Your nest egg grows to an impressive <strong className="text-foreground">$503,132.84</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Student Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A $30,000 student loan at 5.5% compounded monthly for 10 years means you owe <strong className="text-foreground">$51,601.68</strong> if unpaid. Total interest: $21,601.68.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant compound interest results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate to 2 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Supports 4 compounding frequencies" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is Compound Interest?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  Compound interest is the interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, which only charges interest on the original amount, compound interest makes your money grow exponentially over time. Albert Einstein reportedly called it the eighth wonder of the world.
                </p>
                <p>
                  This free online compound interest calculator helps you determine exactly how much your investment or savings will grow over any time period. Whether you are planning for retirement, evaluating a fixed deposit, or understanding how a loan accrues interest, this tool gives you accurate results instantly with no signup required.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">How Does Compounding Frequency Affect Your Returns?</h3>
                <p>
                  The compounding frequency determines how often interest is calculated and added to your balance. Monthly compounding (12 times per year) generates slightly more returns than annual compounding because your earned interest starts generating its own interest sooner. For large sums over long periods, the difference between monthly and annual compounding can be substantial.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use a Compound Interest Calculator?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Planning long-term investments like retirement accounts or 401(k) projections",
                    "Comparing savings accounts with different compounding frequencies",
                    "Understanding total cost of loans with compound interest",
                    "Evaluating fixed deposit maturity values before investing",
                    "Teaching students about the time value of money",
                    "Projecting business investment returns over multiple years",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
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
                  q="What is compound interest?"
                  a="Compound interest is interest calculated on both the initial principal and the accumulated interest from prior periods. It makes your money grow faster than simple interest because you earn interest on your interest."
                />
                <FaqItem
                  q="How is compound interest different from simple interest?"
                  a="Simple interest is calculated only on the original principal amount. Compound interest is calculated on the principal plus any previously earned interest. Over time, compound interest generates significantly higher returns."
                />
                <FaqItem
                  q="What is compounding frequency?"
                  a="Compounding frequency refers to how often interest is calculated and added to your balance. Common frequencies include monthly (12x/year), quarterly (4x/year), semi-annually (2x/year), and annually (1x/year). More frequent compounding yields slightly higher returns."
                />
                <FaqItem
                  q="Is this compound interest calculator accurate?"
                  a="Yes. This calculator uses the standard compound interest formula A = P(1 + r/n)^(nt) with results accurate to 2 decimal places. Results update in real-time as you type."
                />
                <FaqItem
                  q="Can I use this calculator for loans?"
                  a="Absolutely. The compound interest formula works the same way for loans. Enter your loan principal, interest rate, and tenure to see how much you will owe including compound interest."
                />
                <FaqItem
                  q="Is this calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. It runs entirely in your browser — your financial data never leaves your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Financial Calculators?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including loan EMI calculators, simple interest tools, ROI calculators, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others calculate compound interest easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      {label}
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
