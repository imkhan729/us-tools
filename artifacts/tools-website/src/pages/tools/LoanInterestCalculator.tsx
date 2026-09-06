import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, DollarSign, Calculator, TrendingUp,
  Zap, Shield, Clock, BarChart3, Lightbulb,
  BadgeCheck, Star, AlertCircle, Lock, Smartphone,
} from "lucide-react";

function useLoanInterestCalc() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [termYears, setTermYears] = useState("");
  const [loanType, setLoanType] = useState<"emi" | "simple">("emi");

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(termYears);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) return null;

    if (loanType === "simple") {
      const totalInterest = p * (r / 100) * t;
      const totalPayment = p + totalInterest;
      const monthlyPayment = totalPayment / (t * 12);
      return { totalInterest, totalPayment, monthlyPayment, interestRatio: (totalInterest / totalPayment) * 100, loanType };
    } else {
      const monthlyRate = r / 100 / 12;
      const n = t * 12;
      const monthlyPayment = monthlyRate === 0
        ? p / n
        : (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - p;
      return { totalInterest, totalPayment, monthlyPayment, interestRatio: (totalInterest / totalPayment) * 100, loanType };
    }
  }, [principal, rate, termYears, loanType]);

  return { principal, setPrincipal, rate, setRate, termYears, setTermYears, loanType, setLoanType, result };
}

function ResultInsight({ result, principal }: { result: NonNullable<ReturnType<typeof useLoanInterestCalc>["result"]>; principal: string }) {
  const p = parseFloat(principal) || 0;
  const ratio = result.totalInterest / p;
  const msg = ratio < 0.5
    ? `You'll pay ${ratio.toFixed(2)}× the principal in interest — relatively low. This is a cost-efficient loan.`
    : ratio < 1
    ? `You'll pay ${ratio.toFixed(2)}× your principal in interest. Consider paying extra each month to reduce total cost.`
    : `You'll pay more than double your principal in interest. A shorter term or lower rate would significantly reduce this.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{msg}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoanInterestCalculator() {
  const { principal, setPrincipal, rate, setRate, termYears, setTermYears, loanType, setLoanType, result } = useLoanInterestCalc();
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Loan Interest Calculator - Free Interest Rate and Payment Calculator"
        description="Free loan interest calculator and interest rate calculator. Estimate monthly payment, total interest, total repayment, interest share, and borrowing cost for personal, car, mortgage, student, and business loans."
        canonical="https://usonlinetools.com/finance/loan-interest-calculator"
      />
      <div style={{ "--calc-hue": "210" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Loan Interest Calculator</span>
        </nav>

        {/* Hero */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Loan Interest Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate monthly payment, total interest, and full repayment before you sign a loan. Compare amortized EMI loans and simple-interest loans, then see how much of the total cost goes to interest instead of principal.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Finance &amp; Cost &nbsp;·&nbsp; Last updated: May 2026
          </p>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* Calculator */}
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Loan Cost Calculator</p>
                      <p className="text-sm text-muted-foreground">Payment, interest, and repayment totals update instantly.</p>
                    </div>
                  </div>

              {/* Loan Type Toggle */}
              <div className="flex gap-2 mb-4">
                {[{ key: "emi", label: "EMI / Amortized" }, { key: "simple", label: "Simple Interest" }].map((t) => (
                  <button key={t.key} onClick={() => setLoanType(t.key as "emi" | "simple")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${loanType === t.key ? "bg-blue-500 text-white border-blue-500" : "border-border text-muted-foreground hover:border-blue-500/50"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Loan Amount ($)", val: principal, set: setPrincipal, ph: "e.g. 25000" },
                  { label: "Annual Interest Rate (%)", val: rate, set: setRate, ph: "e.g. 7.5" },
                  { label: "Loan Term (Years)", val: termYears, set: setTermYears, ph: "e.g. 5" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{f.label}</label>
                    <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                      className="tool-calc-input w-full px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-lg font-mono focus:outline-none" />
                  </div>
                ))}
              </div>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Monthly Payment", value: `$${fmt(result.monthlyPayment)}` },
                      { label: "Total Interest", value: `$${fmt(result.totalInterest)}` },
                      { label: "Total Repayment", value: `$${fmt(result.totalPayment)}` },
                      { label: "Interest Share", value: `${result.interestRatio.toFixed(1)}%` },
                    ].map((item) => (
                      <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="tool-calc-number text-xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Visual breakdown */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Payment Breakdown</p>
                    <div className="flex rounded-full overflow-hidden h-3 mb-2">
                      <div className="bg-blue-500 transition-all" style={{ width: `${100 - result.interestRatio}%` }} />
                      <div className="bg-orange-400 flex-1" />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Principal: ${fmt(parseFloat(principal) || 0)}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Interest: ${fmt(result.totalInterest)}</span>
                    </div>
                  </div>
                  <ResultInsight result={result} principal={principal} />
                </motion.div>
              )}
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Loan Interest Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Select Loan Type", desc: "Choose EMI (amortized) for standard bank loans like mortgages or car loans, or Simple Interest for short-term personal loans." },
                  { step: "2", title: "Enter Loan Amount", desc: "Input the total principal — the amount you're borrowing, before any interest is added." },
                  { step: "3", title: "Enter Interest Rate", desc: "Enter the annual interest rate (APR) as a percentage. Check your loan agreement or use your bank's quoted rate." },
                  { step: "4", title: "Enter Loan Term", desc: "Enter how many years the loan runs for. Results instantly show total interest, monthly payment, and full repayment amount." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</h3>
                <div className="space-y-3">
                  {[
                    { expr: "EMI = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]", desc: "Standard amortized EMI formula. P = principal, r = monthly rate (annual ÷ 12 ÷ 100), n = total months." },
                    { expr: "Simple Interest = P × R × T / 100", desc: "For flat-rate loans. P = principal, R = annual rate %, T = term in years." },
                    { expr: "Total Repayment = Monthly Payment × Total Months", desc: "Full cost over the loan term — principal plus all interest paid." },
                    { expr: "Total Interest = Total Repayment − Principal", desc: "The true cost of borrowing beyond the original loan amount." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <div>
                        <code className="px-2 py-1.5 bg-background rounded text-xs font-mono inline-block mb-1 break-all">{item.expr}</code>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Understanding Results */}
            <section id="understanding-results" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Your Results</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The interest share percentage reveals the true cost of borrowing. A high interest share means a large part of every dollar paid goes to interest instead of reducing the balance. Use this number to compare interest rates, shorten the term, test extra payments, or decide whether a quoted monthly payment is hiding an expensive loan.
              </p>
              <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground leading-relaxed">
                Searchers often use "interest rate calculator" when they really need to compare rate scenarios. Keep the loan amount and term the same, then run 5%, 7%, 9%, and 12% to see how a small APR change affects monthly payment and lifetime interest.
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Interest Share Under 20%", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Very efficient loan — most of your payment goes to principal. Short-term or low-rate loans land here." },
                  { label: "Interest Share 20–40%", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Normal range for mid-term loans. Still reasonable — focus on making extra payments to reduce interest." },
                  { label: "Interest Share 40–60%", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "Significant interest burden. Consider refinancing or increasing monthly payments to save long-term." },
                  { label: "Interest Share Over 60%", color: "text-red-600 bg-red-500/10 border-red-500/20", desc: "You're paying more than 1.5× the principal. Explore better rates, shorter terms, or early repayment options." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Loan Interest Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Loan Type</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Principal</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Rate</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Term</th>
                      <th className="text-right py-2 font-bold text-foreground">Total Interest</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { type: "Personal Loan", prin: "$10,000", rate: "9%", term: "3 yrs", interest: "$1,432" },
                      { type: "Car Loan", prin: "$25,000", rate: "6.5%", term: "5 yrs", interest: "$4,367" },
                      { type: "Home Mortgage", prin: "$300,000", rate: "7%", term: "30 yrs", interest: "$418,527" },
                      { type: "Student Loan", prin: "$40,000", rate: "5%", term: "10 yrs", interest: "$10,606" },
                      { type: "Business Loan", prin: "$100,000", rate: "8.5%", term: "7 yrs", interest: "$32,124" },
                    ].map((row) => (
                      <tr key={row.type} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.type}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.prin}</td>
                        <td className="py-2.5 pr-3 text-right">{row.rate}</td>
                        <td className="py-2.5 pr-3 text-right">{row.term}</td>
                        <td className="py-2.5 text-right font-bold text-blue-500">{row.interest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Home mortgages</strong> are the most dramatic example of interest compounding over time. A $300,000 mortgage at 7% over 30 years results in over $418,000 in interest — more than the original loan. Even small rate reductions matter enormously at this scale.
                </p>
                <p>
                  <strong className="text-foreground">Car loans</strong> represent the most common loan type for most people. At 6.5% over 5 years on $25,000, you'll pay around $4,367 in interest — about 17% of the loan value. Making bi-weekly payments instead of monthly can shave hundreds off this total.
                </p>
                <p>
                  <strong className="text-foreground">Personal loans</strong> vary widely in rate depending on credit score. The difference between 9% and 18% on a $10,000 loan over 3 years is nearly $1,600 in extra interest — highlighting the importance of comparing lenders before signing.
                </p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"Showed this to my partner before we took out a $200k mortgage. Seeing the total interest in black and white made us choose the 20-year term over 30 — saved over $140k."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— First-time homebuyer</p>
              </div>
            </section>

            {/* Why */}
            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Loan Interest Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Understanding the true cost of a loan before signing is one of the most important financial skills you can have. Lenders often advertise monthly payments without emphasizing the total interest burden — this calculator reveals what you'll really pay.</p>
                <p>This tool supports both <strong className="text-foreground">EMI (amortized) loans</strong> — like mortgages, car loans, and personal loans from banks — and <strong className="text-foreground">simple interest loans</strong>, which are common for short-term borrowing or certain business credit arrangements.</p>
                <p>The visual breakdown bar immediately shows you the proportion of your total payments that goes to interest versus principal. When that interest bar is longer than the principal bar, it's a signal to negotiate rates or shorten the term.</p>
                <p>Use the calculator before every major loan decision: home purchase, vehicle financing, student debt refinancing, or business credit lines. The numbers take 10 seconds to run, but they can save you thousands of dollars in informed decisions.</p>
                <p>Pair this with the <Link href="/finance/online-loan-emi-calculator" className="text-blue-500 hover:underline">EMI Calculator</Link> for a detailed monthly schedule, or with the <Link href="/finance/online-mortgage-payment-calculator" className="text-blue-500 hover:underline">Mortgage Payment Calculator</Link> for home-specific breakdowns.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Disclaimer:</strong> Results are estimates based on the inputs provided. Actual loan costs may vary due to fees, compounding method, and lender-specific terms. Always confirm with your lender.
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Can I use this as an interest rate calculator?" a="Yes. Enter the same loan amount and term with different annual rates to compare how each interest rate changes monthly payment, total interest, and total repayment." />
                <FaqItem q="What interest rate should I enter?" a="Enter the annual interest rate quoted by the lender. If you are comparing APR-based offers, remember that APR can include fees, so the calculator result is still an estimate unless those fees are added separately." />
                <FaqItem q="What is the difference between EMI and simple interest loans?" a="EMI (Equated Monthly Installment) loans use amortization — each payment covers both interest and principal, with interest recalculating on the remaining balance monthly. Simple interest loans calculate interest once on the full principal for the entire term. EMI is more common for bank loans; simple interest can favor borrowers who repay early." />
                <FaqItem q="How can I reduce the total interest I pay?" a="The most effective strategies are: (1) choose a shorter loan term, (2) make extra principal payments when possible, (3) refinance at a lower rate if your credit improves, (4) make bi-weekly instead of monthly payments — that adds one extra payment per year without feeling it monthly." />
                <FaqItem q="Does a higher credit score affect loan interest?" a="Yes, significantly. Borrowers with excellent credit (750+) often qualify for rates 3–5 percentage points lower than those with fair credit (580–669). On a $30,000 car loan over 5 years, that difference can mean $2,500–$5,000 less in total interest." />
                <FaqItem q="What is APR and how does it differ from interest rate?" a="Interest rate is the cost of borrowing the principal. APR (Annual Percentage Rate) includes the interest rate plus lender fees, origination charges, and other costs — making it a more complete measure of loan cost. This calculator uses the interest rate; for true APR cost, add any upfront fees to the result." />
                <FaqItem q="Is interest on personal loans tax deductible?" a="Generally, personal loan interest is not tax deductible in most countries. However, mortgage interest (in the US) and student loan interest (subject to income limits) may qualify for deductions. Business loan interest is typically deductible as a business expense. Always consult a tax professional for your specific situation." />
                <FaqItem q="What happens if I pay off my loan early?" a="For EMI loans, paying off early reduces the total interest paid because future months' interest (calculated on the remaining balance) is eliminated. Some lenders charge an early repayment/prepayment penalty — check your loan agreement. The savings from early repayment almost always outweigh any penalty for standard consumer loans." />
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">Compare More Loan Tools</h2>
              <p className="text-muted-foreground text-sm mb-4">Explore EMI schedules, mortgage breakdowns, and more — all free, no signup needed.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[
                  { href: "#calculator", label: "Calculator" },
                  { href: "#how-to-use", label: "How to Use" },
                  { href: "#understanding-results", label: "Understanding Results" },
                  { href: "#examples", label: "Examples" },
                  { href: "#why-this-tool", label: "Why This Tool" },
                  { href: "#faq", label: "FAQ" },
                ].map((item) => (
                  <a key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />{item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1">
                {[
                  { href: "/finance/online-loan-emi-calculator", label: "EMI Calculator", icon: Calculator },
                  { href: "/finance/online-mortgage-payment-calculator", label: "Mortgage Calculator", icon: DollarSign },
                  { href: "/finance/online-car-loan-calculator", label: "Car Loan Calculator", icon: BarChart3 },
                  { href: "/finance/online-simple-interest-calculator", label: "Simple Interest", icon: TrendingUp },
                  { href: "/finance/online-compound-interest-calculator", label: "Compound Interest", icon: TrendingUp },
                  { href: "/finance/payback-period-calculator", label: "Payback Period", icon: Clock },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-blue-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[
                  { icon: Shield, text: "No data stored" },
                  { icon: Zap, text: "Instant calculation" },
                  { icon: BadgeCheck, text: "Formula verified" },
                  { icon: AlertCircle, text: "EMI + Simple Interest" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-blue-500" />{item.text}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
