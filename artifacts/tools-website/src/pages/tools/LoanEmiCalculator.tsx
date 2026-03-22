import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  Landmark, Home, Car, GraduationCap, Percent, BarChart3,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type TenureUnit = "years" | "months";

function useEmiCalc() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("years");

  const result = useMemo(() => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const T = parseFloat(tenure);
    if (isNaN(P) || isNaN(annualRate) || isNaN(T) || P <= 0 || T <= 0) return null;

    const n = tenureUnit === "years" ? T * 12 : T; // total months
    const r = annualRate / 12 / 100; // monthly interest rate

    if (r === 0) {
      const emi = P / n;
      return { emi, totalInterest: 0, totalPayment: P, principal: P, months: n };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return { emi, totalInterest, totalPayment, principal: P, months: n };
  }, [loanAmount, interestRate, tenure, tenureUnit]);

  return { loanAmount, setLoanAmount, interestRate, setInterestRate, tenure, setTenure, tenureUnit, setTenureUnit, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { emi: number; totalInterest: number; totalPayment: number; principal: number; months: number } | null }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const years = Math.floor(result.months / 12);
  const remainingMonths = result.months % 12;
  const tenureStr = years > 0
    ? `${years} year${years !== 1 ? "s" : ""}${remainingMonths > 0 ? ` and ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}` : ""}`
    : `${result.months} month${result.months !== 1 ? "s" : ""}`;
  const interestPct = ((result.totalInterest / result.principal) * 100).toFixed(1);

  const message = `For a loan of $${fmt(result.principal)} over ${tenureStr}, you will pay $${fmt(result.emi)} every month. The total interest paid will be $${fmt(result.totalInterest)} (${interestPct}% of the loan amount), making the total repayment $${fmt(result.totalPayment)}.`;

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
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152 },
  { title: "Simple Interest Calculator", slug: "simple-interest-calculator", icon: <Calculator className="w-5 h-5" />, color: 217 },
  { title: "Mortgage Payment Calculator", slug: "mortgage-payment-calculator", icon: <Home className="w-5 h-5" />, color: 340 },
  { title: "Tip Calculator", slug: "tip-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25 },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <Percent className="w-5 h-5" />, color: 265 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function LoanEmiCalculator() {
  const calc = useEmiCalc();
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
        title="Loan EMI Calculator - Free Monthly Payment Calculator Online"
        description="Free online loan EMI calculator. Calculate monthly EMI, total interest, and total payment for home loans, car loans, and personal loans. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Loan EMI Calculator</span>
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
                Loan EMI Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate your monthly loan EMI, total interest payable, and total repayment amount instantly. Works for home loans, car loans, personal loans, and more — free and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter your loan details below — EMI updates as you type. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">EMI Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Loan Amount ($)</label>
                    <input
                      type="number"
                      placeholder="500000"
                      className="tool-calc-input w-full"
                      value={calc.loanAmount}
                      onChange={e => calc.setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Interest Rate (% per annum)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="8.5"
                        className="tool-calc-input w-full"
                        value={calc.interestRate}
                        onChange={e => calc.setInterestRate(e.target.value)}
                      />
                      <Percent className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Loan Tenure</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="20"
                        className="tool-calc-input flex-1"
                        value={calc.tenure}
                        onChange={e => calc.setTenure(e.target.value)}
                      />
                      <select
                        className="tool-calc-input w-28"
                        value={calc.tenureUnit}
                        onChange={e => calc.setTenureUnit(e.target.value as TenureUnit)}
                      >
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Monthly EMI</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ${calc.result ? fmt(calc.result.emi) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Interest</div>
                    <div className="text-lg font-black text-red-600 dark:text-red-400">
                      ${calc.result ? fmt(calc.result.totalInterest) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Payment</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ${calc.result ? fmt(calc.result.totalPayment) : "--"}
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
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">EMI Formula</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the standard formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">EMI = P x r x (1+r)^n / ((1+r)^n - 1)</code> where P = loan amount, r = monthly interest rate (annual rate / 12 / 100), n = total months.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Total Interest</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Calculated as: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Total Interest = (EMI x n) - P</code>. For a $500,000 loan at 8.5% for 20 years: EMI = $4,341.76, Total Interest = $542,022.47.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Total Payment</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The total amount you repay: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Total Payment = EMI x n</code>. This includes both the original principal and all accrued interest over the loan tenure.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Home Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$350,000 home loan at 7% for 30 years. Monthly EMI: <strong className="text-foreground">$2,328.56</strong>. Total interest paid: $488,281.42.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Car Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$35,000 auto loan at 5.5% for 5 years. Monthly EMI: <strong className="text-foreground">$668.54</strong>. Total interest paid: $5,112.56.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Personal Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$15,000 personal loan at 12% for 3 years. Monthly EMI: <strong className="text-foreground">$498.21</strong>. Total interest paid: $2,935.70.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Education Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$80,000 student loan at 6% for 10 years. Monthly EMI: <strong className="text-foreground">$888.16</strong>. Total interest paid: $26,579.55.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant EMI results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate to 2 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Supports years and months tenure" },
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is a Loan EMI?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  EMI stands for Equated Monthly Installment. It is the fixed monthly payment you make to repay a loan over a specified period. Each EMI consists of two components: the principal repayment and the interest on the outstanding balance. In the early months, a larger portion goes toward interest, while in later months, more goes toward the principal.
                </p>
                <p>
                  This free online loan EMI calculator helps you determine your exact monthly payment for any loan type — home loans, car loans, personal loans, and education loans. By entering the loan amount, interest rate, and tenure, you get instant, accurate results with no signup required.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">How Does Loan Tenure Affect Your EMI?</h3>
                <p>
                  A longer loan tenure reduces your monthly EMI but increases the total interest paid over the life of the loan. Conversely, a shorter tenure means higher monthly payments but significantly less total interest. For example, a $300,000 home loan at 7% costs $1,995.91/month over 30 years (total interest: $418,527) versus $2,714.62/month over 15 years (total interest: $188,631). The shorter tenure saves over $229,000 in interest.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Calculate Your Loan EMI?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Before applying for a home loan or mortgage to plan your monthly budget",
                    "Comparing car loan offers from different lenders and dealerships",
                    "Evaluating personal loan affordability based on your income",
                    "Planning education loan repayment after graduation",
                    "Refinancing an existing loan to check potential savings",
                    "Determining the impact of prepayment on remaining tenure",
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
                  q="What is EMI and how is it calculated?"
                  a="EMI (Equated Monthly Installment) is the fixed monthly payment made to repay a loan. It is calculated using the formula: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the loan amount, r is the monthly interest rate, and n is the total number of monthly installments."
                />
                <FaqItem
                  q="Does a longer tenure mean lower EMI?"
                  a="Yes, a longer loan tenure reduces the monthly EMI because the repayment is spread over more months. However, the total interest paid increases significantly with longer tenures."
                />
                <FaqItem
                  q="Can I use this for home loans?"
                  a="Absolutely. This EMI calculator works for all types of loans including home loans, car loans, personal loans, education loans, and business loans. Just enter the loan amount, interest rate, and tenure."
                />
                <FaqItem
                  q="How accurate is this EMI calculator?"
                  a="This calculator uses the standard EMI formula used by banks and financial institutions worldwide. Results are accurate to 2 decimal places and update in real-time as you type."
                />
                <FaqItem
                  q="What is the difference between flat rate and reducing balance EMI?"
                  a="Flat rate interest is calculated on the original loan amount throughout the tenure, resulting in higher effective interest. Reducing balance (which this calculator uses) calculates interest on the outstanding principal, which decreases with each payment. Most banks use the reducing balance method."
                />
                <FaqItem
                  q="Is this loan EMI calculator free?"
                  a="100% free with no ads, no signup, and no data collection. All calculations run entirely in your browser — your financial information never leaves your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Financial Calculators?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including compound interest calculators, simple interest tools, mortgage calculators, and more — all free, all instant.
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
                <p className="text-sm text-muted-foreground mb-4">Help others calculate their loan EMI easily.</p>
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
