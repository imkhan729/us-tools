import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  Home, Landmark, Percent, BarChart3, PiggyBank, Receipt,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type DownPaymentMode = "dollar" | "percent";

function useMortgageCalc() {
  const [homePrice, setHomePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [downPaymentMode, setDownPaymentMode] = useState<DownPaymentMode>("percent");
  const [loanTerm, setLoanTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const result = useMemo(() => {
    const price = parseFloat(homePrice);
    const dp = parseFloat(downPayment);
    const years = parseFloat(loanTerm);
    const rate = parseFloat(interestRate);
    if (isNaN(price) || isNaN(dp) || isNaN(years) || isNaN(rate) || price <= 0 || years <= 0) return null;

    const downPaymentAmount = downPaymentMode === "percent" ? price * (dp / 100) : dp;
    if (downPaymentAmount < 0 || downPaymentAmount >= price) return null;

    const P = price - downPaymentAmount;
    const n = years * 12;

    if (rate === 0) {
      const monthlyPayment = P / n;
      return { monthlyPayment, totalInterest: 0, totalCost: P, loanAmount: P, downPaymentAmount };
    }

    const r = rate / 100 / 12;
    const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalCost = monthlyPayment * n;
    const totalInterest = totalCost - P;

    return { monthlyPayment, totalInterest, totalCost, loanAmount: P, downPaymentAmount };
  }, [homePrice, downPayment, downPaymentMode, loanTerm, interestRate]);

  return { homePrice, setHomePrice, downPayment, setDownPayment, downPaymentMode, setDownPaymentMode, loanTerm, setLoanTerm, interestRate, setInterestRate, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { monthlyPayment: number; totalInterest: number; totalCost: number; loanAmount: number; downPaymentAmount: number } | null }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const interestPercent = ((result.totalInterest / result.loanAmount) * 100).toFixed(1);

  const message = `On a $${fmt(result.loanAmount)} mortgage, your estimated monthly payment is $${fmt(result.monthlyPayment)} (principal & interest). Over the life of the loan, you will pay $${fmt(result.totalInterest)} in total interest, which is ${interestPercent}% of your loan amount. Your total cost including the $${fmt(result.downPaymentAmount)} down payment is $${fmt(result.totalCost + result.downPaymentAmount)}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
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
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152, benefit: "See how interest compounds over time" },
  { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <Landmark className="w-5 h-5" />, color: 340, benefit: "Calculate monthly loan repayments" },
  { title: "Simple Interest Calculator", slug: "online-simple-interest-calculator", icon: <Calculator className="w-5 h-5" />, color: 217, benefit: "Calculate SI = P × R × T / 100" },
  { title: "ROI Calculator", slug: "online-roi-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45, benefit: "Measure return on any investment" },
  { title: "Salary Calculator", slug: "online-salary-calculator", icon: <Receipt className="w-5 h-5" />, color: 265, benefit: "Convert hourly to annual salary" },
  { title: "Tip Calculator", slug: "tip-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25, benefit: "Split bills and calculate tips fast" },
];

// ── Main Component ──
export default function MortgagePaymentCalculator() {
  const calc = useMortgageCalc();
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
        title="Mortgage Payment Calculator - Free Online Home Loan Calculator | Monthly Payment Estimator"
        description="Free online mortgage payment calculator. Calculate your monthly mortgage payment, total interest, and total cost of your home loan. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Mortgage Payment Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Mortgage Payment Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your monthly mortgage payment, total interest paid, and the full cost of your home loan. This free mortgage calculator gives you instant results with no signup needed — perfect for homebuyers and refinancers.
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
                  <h3 className="text-lg font-bold text-foreground">Mortgage Payment Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Home Price ($)</label>
                    <input
                      type="number"
                      placeholder="350000"
                      className="tool-calc-input w-full"
                      value={calc.homePrice}
                      onChange={e => calc.setHomePrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                      Down Payment ({calc.downPaymentMode === "percent" ? "%" : "$"})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={calc.downPaymentMode === "percent" ? "20" : "70000"}
                        className="tool-calc-input w-full pr-20"
                        value={calc.downPayment}
                        onChange={e => calc.setDownPayment(e.target.value)}
                      />
                      <select
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-muted text-foreground text-xs font-semibold rounded-md px-2 py-1 border-0 outline-none cursor-pointer"
                        value={calc.downPaymentMode}
                        onChange={e => calc.setDownPaymentMode(e.target.value as DownPaymentMode)}
                      >
                        <option value="percent">%</option>
                        <option value="dollar">$</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Loan Term (years)</label>
                    <input
                      type="number"
                      placeholder="30"
                      className="tool-calc-input w-full"
                      value={calc.loanTerm}
                      onChange={e => calc.setLoanTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Interest Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="6.5"
                        className="tool-calc-input w-full"
                        value={calc.interestRate}
                        onChange={e => calc.setInterestRate(e.target.value)}
                        step="0.01"
                      />
                      <Percent className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Monthly Payment (P&I)</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ${calc.result ? fmt(calc.result.monthlyPayment) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Interest</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ${calc.result ? fmt(calc.result.totalInterest) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Cost</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      ${calc.result ? fmt(calc.result.totalCost) : "--"}
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
                    <h4 className="font-bold text-foreground mb-1">Mortgage Payment Formula</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the standard amortization formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">M = P[r(1+r)^n] / [(1+r)^n - 1]</code> where P = loan amount, r = monthly interest rate, n = total number of monthly payments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Loan Amount Calculation</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Your loan amount equals the home price minus your down payment. For example, a $350,000 home with 20% down means a $280,000 mortgage. A larger down payment reduces your monthly payment and total interest.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Total Interest & Cost</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Total interest is calculated as <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Total Interest = (M x n) - P</code>. On a 30-year mortgage, total interest often exceeds the original loan amount due to the long repayment period.</p>
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
                    <Home className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">First-Time Homebuyer</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$300,000 home with 10% down ($30,000) at 6.5% for 30 years. Monthly payment: <strong className="text-foreground">$1,706.58</strong>. Total interest: $344,369.43.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">15-Year Mortgage</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$400,000 home with 20% down ($80,000) at 5.75% for 15 years. Monthly payment: <strong className="text-foreground">$2,662.25</strong>. Total interest: $159,205.73.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Luxury Home Purchase</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$750,000 home with 25% down ($187,500) at 7% for 30 years. Monthly payment: <strong className="text-foreground">$3,741.27</strong>. Total interest: $784,356.63.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Refinancing Scenario</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Refinance $250,000 remaining balance at 5.5% for 20 years (no down payment). Monthly payment: <strong className="text-foreground">$1,719.37</strong>. Total interest: $162,647.60.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Mortgage Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant mortgage payment results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate calculations to 2 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking whatsoever" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Supports dollar or percentage down payment" },
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Mortgage Payments</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  A mortgage payment calculator is an essential tool for anyone buying a home or refinancing an existing loan. Your monthly mortgage payment is determined by the loan amount (home price minus down payment), the interest rate, and the loan term. Understanding these numbers before you commit to a home purchase can save you thousands of dollars and help you make a confident financial decision.
                </p>
                <p>
                  This free online mortgage calculator uses the standard amortization formula that banks and lenders rely on. Simply enter your home price, down payment amount or percentage, loan term in years, and your annual interest rate to instantly see your estimated monthly payment, total interest paid over the life of the loan, and the total cost of the mortgage.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">How Does Your Down Payment Affect Monthly Payments?</h3>
                <p>
                  Your down payment directly reduces the loan amount and, consequently, your monthly mortgage payment. A larger down payment means less borrowed money, lower monthly payments, and less total interest paid. Most conventional loans require a minimum of 3-5% down, while putting 20% or more down eliminates the need for private mortgage insurance (PMI), saving you even more each month. Use this house payment calculator to compare scenarios with different down payment amounts.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">30-Year vs 15-Year Mortgage: Which Is Better?</h3>
                <p>
                  The loan term significantly impacts both your monthly payment and total interest. A 30-year mortgage offers lower monthly payments but costs significantly more in total interest. A 15-year mortgage has higher monthly payments but saves you tens or even hundreds of thousands of dollars in interest. Use this mortgage payment estimator to compare both options side by side and find the right balance for your budget.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use a Mortgage Payment Calculator?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Before shopping for homes to determine your affordable price range",
                    "Comparing different loan terms (15-year vs 30-year) to find the best fit",
                    "Evaluating the impact of different down payment amounts on monthly costs",
                    "Refinancing an existing mortgage to see potential savings with a lower rate",
                    "Planning your monthly budget with an accurate home loan payment estimate",
                    "Understanding how much total interest you will pay over the life of the loan",
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
                  q="How is a monthly mortgage payment calculated?"
                  a="Your monthly mortgage payment is calculated using the amortization formula: M = P[r(1+r)^n] / [(1+r)^n - 1], where P is the loan amount (home price minus down payment), r is the monthly interest rate (annual rate divided by 12), and n is the total number of monthly payments (loan term in years times 12). This formula ensures equal monthly payments that cover both principal and interest."
                />
                <FaqItem
                  q="What is included in a mortgage payment?"
                  a="A basic mortgage payment (principal and interest, or P&I) includes the amount going toward paying down your loan balance and the interest charged by the lender. Your actual monthly housing cost may also include property taxes, homeowners insurance, and private mortgage insurance (PMI) if your down payment is less than 20%. This calculator focuses on the P&I portion."
                />
                <FaqItem
                  q="How much should I put down on a house?"
                  a="While 20% down is often recommended to avoid PMI and reduce your monthly payment, many loan programs allow 3-5% down for first-time buyers. The right amount depends on your savings, monthly budget, and financial goals. Use this calculator to compare how different down payment amounts affect your monthly mortgage payment."
                />
                <FaqItem
                  q="Is a 15-year or 30-year mortgage better?"
                  a="A 15-year mortgage has higher monthly payments but saves you a significant amount in total interest. A 30-year mortgage offers lower monthly payments, making it more affordable month to month. The best choice depends on your income, financial goals, and whether you prioritize lower payments or paying less interest overall."
                />
                <FaqItem
                  q="Does this mortgage calculator include taxes and insurance?"
                  a="This calculator computes principal and interest (P&I) only, which is the core mortgage payment. Property taxes, homeowners insurance, and PMI vary by location and policy, so they are not included. For a complete picture, add your estimated monthly taxes and insurance to the P&I amount shown."
                />
                <FaqItem
                  q="Is this mortgage calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. It runs entirely in your browser — your financial information never leaves your device. Use it as many times as you need to compare different mortgage scenarios."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Financial Calculators?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including compound interest calculators, loan EMI tools, ROI calculators, and more — all free, all instant.
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
                <p className="text-xs text-muted-foreground mb-3">Help others calculate their mortgage payments easily.</p>
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
