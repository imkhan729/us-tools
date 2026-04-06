import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Calculator,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  BarChart3,
  Info,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtCur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const fmtPct = (n: number) => `${n.toFixed(2)}%`;

// ─── FAQ accordion ──────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── amortization row ───────────────────────────────────────────────────────
interface AmorRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function buildSchedule(principal: number, annualRate: number, months: number): AmorRow[] {
  const r = annualRate / 100 / 12;
  const payment = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const rows: AmorRow[] = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const prin = payment - interest;
    balance = Math.max(0, balance - prin);
    rows.push({ period: i, payment, principal: prin, interest, balance });
  }
  return rows;
}

// ─── main component ─────────────────────────────────────────────────────────
export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState("200000");
  const [annualRate, setAnnualRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [showAll, setShowAll] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(loanAmount) || 0;
    const r = parseFloat(annualRate) || 0;
    const m = (parseFloat(years) || 0) * 12;
    if (p <= 0 || r < 0 || m <= 0) return null;
    const rows = buildSchedule(p, r, m);
    const totalPaid = rows.reduce((s, x) => s + x.payment, 0);
    const totalInterest = totalPaid - p;
    const monthlyPayment = rows[0]?.payment ?? 0;
    return { rows, totalPaid, totalInterest, monthlyPayment, months: m };
  }, [loanAmount, annualRate, years]);

  const displayRows = result
    ? showAll
      ? result.rows
      : result.rows.slice(0, 12)
    : [];

  const interestPct = result ? (result.totalInterest / result.totalPaid) * 100 : 0;

  return (
    <div style={{ "--calc-hue": "195" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Amortization Calculator — Full Loan Payment Schedule"
        description="Generate a complete amortization schedule for any loan. See monthly principal, interest, and balance breakdown. Free online amortization calculator."
      />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Amortization Calculator</span>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,50%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Finance & Cost
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Amortization Calculator
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "No Signup", "Instant Results", "Full Schedule"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Generate a complete month-by-month amortization schedule. See exactly how each payment splits between principal and interest over the life of your loan.
        </p>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Calculator ─────────────────────────────────────── */}
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[hsl(var(--calc-hue),70%,50%)]" />
              Loan Details
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Loan Amount ($)</label>
                <input className="tool-calc-input" type="number" min="0" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="200000" />
              </div>
              <div>
                <label className="tool-calc-label">Annual Interest Rate (%)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} placeholder="6.5" />
              </div>
              <div>
                <label className="tool-calc-label">Loan Term (Years)</label>
                <input className="tool-calc-input" type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} placeholder="30" />
              </div>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${loanAmount}-${annualRate}-${years}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Monthly Payment", value: fmtCur(result.monthlyPayment), icon: <DollarSign className="w-4 h-4" />, color: "text-blue-600" },
                      { label: "Total Interest", value: fmtCur(result.totalInterest), icon: <TrendingDown className="w-4 h-4" />, color: "text-red-500" },
                      { label: "Total Paid", value: fmtCur(result.totalPaid), icon: <BarChart3 className="w-4 h-4" />, color: "text-amber-600" },
                      { label: "Loan Term", value: `${years} yrs`, icon: <Calendar className="w-4 h-4" />, color: "text-green-600" },
                    ].map((c) => (
                      <div key={c.label} className="tool-calc-result text-center">
                        <div className={`flex justify-center mb-1 ${c.color}`}>{c.icon}</div>
                        <div className="tool-calc-number text-lg">{c.value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Interest vs Principal bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Principal — {fmtPct(100 - interestPct)}</span>
                      <span>Interest — {fmtPct(interestPct)}</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden bg-muted flex">
                      <div
                        className="h-full bg-[hsl(var(--calc-hue),70%,50%)] transition-all duration-500"
                        style={{ width: `${100 - interestPct}%` }}
                      />
                      <div className="h-full bg-red-400 flex-1" />
                    </div>
                  </div>

                  {/* Amortization table */}
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          {["Month", "Payment", "Principal", "Interest", "Balance"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayRows.map((row) => (
                          <tr key={row.period} className="border-t border-border hover:bg-muted/20 transition-colors">
                            <td className="px-3 py-2 text-muted-foreground">{row.period}</td>
                            <td className="px-3 py-2 font-medium">{fmtCur(row.payment)}</td>
                            <td className="px-3 py-2 text-[hsl(var(--calc-hue),60%,45%)]">{fmtCur(row.principal)}</td>
                            <td className="px-3 py-2 text-red-500">{fmtCur(row.interest)}</td>
                            <td className="px-3 py-2">{fmtCur(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {result.months > 12 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="mt-3 w-full py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/40 transition-colors flex items-center justify-center gap-2"
                    >
                      {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {showAll ? "Show First 12 Months" : `Show All ${result.months} Months`}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calculator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter loan details above to generate your schedule.</p>
              </div>
            )}
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Use This Calculator</h2>
            <ol className="space-y-3">
              {[
                ["Enter Loan Amount", "Type the total amount borrowed (principal)."],
                ["Set Annual Rate", "Enter your annual interest rate from your loan agreement."],
                ["Choose Term", "Enter the loan duration in years (e.g., 30 for a standard mortgage)."],
                ["View Schedule", "The full month-by-month breakdown appears instantly."],
                ["Expand All Rows", "Click 'Show All Months' to see the complete schedule."],
              ].map(([step, desc], i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--calc-hue),70%,50%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-semibold">{step}: </span>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 bg-muted/40 rounded-xl p-4 font-mono text-sm">
              <p className="font-semibold mb-1 text-foreground">Monthly Payment Formula:</p>
              <code className="text-[hsl(var(--calc-hue),60%,45%)]">
                M = P × [r(1+r)^n] / [(1+r)^n − 1]
              </code>
              <p className="mt-1 text-muted-foreground text-xs">P = principal, r = monthly rate, n = total payments</p>
            </div>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Your Results</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Monthly Payment", desc: "Fixed amount paid each month. It stays the same throughout the loan but the split between principal and interest shifts.", color: "border-l-blue-500" },
                { title: "Principal Portion", desc: "The share of each payment that reduces your loan balance. Starts small but grows each month as interest decreases.", color: "border-l-cyan-500" },
                { title: "Interest Portion", desc: "Cost of borrowing. Highest in early months and shrinks as the balance reduces — this is amortization in action.", color: "border-l-red-400" },
                { title: "Remaining Balance", desc: "Outstanding loan balance after each payment. Reaches zero on your final scheduled payment.", color: "border-l-green-500" },
              ].map((c) => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Examples */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Quick Examples</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Loan</th>
                    <th className="px-3 py-2 text-left font-semibold">Rate</th>
                    <th className="px-3 py-2 text-left font-semibold">Term</th>
                    <th className="px-3 py-2 text-left font-semibold">Monthly</th>
                    <th className="px-3 py-2 text-left font-semibold">Total Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["$200,000", "6.5%", "30 yrs", "$1,264", "$255,088"],
                    ["$200,000", "6.5%", "15 yrs", "$1,743", "$113,811"],
                    ["$30,000", "5.0%", "5 yrs", "$566", "$3,968"],
                    ["$500,000", "7.0%", "30 yrs", "$3,327", "$698,027"],
                  ].map((row) => (
                    <tr key={row[0] + row[2]} className="border-t border-border">
                      {row.map((cell, i) => (
                        <td key={i} className="px-3 py-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mb-3">
              <strong>The 15-year vs 30-year tradeoff</strong> is one of the most impactful financial decisions homebuyers face. On a $200,000 loan at 6.5%, choosing a 15-year mortgage saves over $141,000 in interest — but requires a monthly payment that is $479 higher. The right choice depends entirely on your cash flow and financial goals.
            </p>
            <p className="text-muted-foreground mb-3">
              <strong>Extra payments dramatically reduce total interest.</strong> Even a single extra principal payment per year can shorten a 30-year loan by several years and save tens of thousands in interest. Use the schedule to identify which months benefit most from extra payments.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>In early years, most of your payment is interest.</strong> On a typical 30-year mortgage, more than 75% of your first payment goes to interest. That ratio flips gradually — by year 25, most of your payment reduces principal.
            </p>

            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),70%,50%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "Understanding your amortization schedule is one of the most powerful things you can do as a borrower. It turns a confusing monthly payment into a clear roadmap of where every dollar goes."
            </blockquote>
          </div>

          {/* Why Use This Tool */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Use This Amortization Calculator?</h2>
            <p className="text-muted-foreground mb-3">
              Most people sign a loan agreement without fully understanding how their payments are structured. An amortization schedule removes that mystery. Instead of paying blindly each month, you can see exactly how each payment contributes to reducing your debt.
            </p>
            <p className="text-muted-foreground mb-3">
              This calculator is especially useful when comparing loan offers. Two loans with the same monthly payment can have very different total costs depending on their term and rate. Generating schedules side by side makes this immediately apparent.
            </p>
            <p className="text-muted-foreground mb-3">
              For homebuyers considering refinancing, the schedule shows your current equity position at any point in the loan — critical information when deciding whether a refinance makes financial sense.
            </p>
            <p className="text-muted-foreground mb-3">
              Investors and business owners use amortization schedules to model debt service costs, understand the tax implications of interest deductions, and plan cash flow around debt obligations.
            </p>
            <p className="text-xs text-muted-foreground border border-border rounded-xl p-4 mt-2">
              <Info className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
              <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual loan terms may include fees, insurance, taxes, and other costs not reflected here. Always verify with your lender.
            </p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is amortization?" a="Amortization is the process of paying off a loan through regular scheduled payments over time. Each payment covers accrued interest first, then the remainder reduces the principal balance." />
              <FaqItem q="Why does so much of my early payment go to interest?" a="Because interest is calculated on the outstanding balance. When the balance is high (early in the loan), the interest charge is large. As the balance shrinks, less interest accrues and more of each payment reduces principal." />
              <FaqItem q="Can I pay off my loan early?" a="Yes. Making extra principal payments reduces your balance faster, shortens the loan term, and saves interest. Our schedule shows the standard track — any extra payments would accelerate balance reduction beyond what is shown." />
              <FaqItem q="What's the difference between amortization and interest-only loans?" a="Amortizing loans reduce the principal with every payment. Interest-only loans only charge interest during the interest-only period, meaning the balance never decreases until you start making principal payments." />
              <FaqItem q="How does refinancing affect my amortization?" a="Refinancing replaces your current loan with a new one, restarting the amortization clock. You may get a lower rate, but extending the term means paying interest for longer — always compare total interest costs, not just monthly payment differences." />
              <FaqItem q="Is my monthly payment the same every month?" a="For a fixed-rate amortizing loan, yes — the payment amount stays constant. The split between principal and interest changes each month, but the total payment remains the same." />
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,50%)] to-[hsl(var(--calc-hue),60%,40%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Explore Your Loan Options?</h2>
            <p className="mb-5 opacity-90">Use our related calculators to compare mortgage payments, car loans, and more.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance/online-mortgage-payment-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                Mortgage Calculator
              </Link>
              <Link href="/finance/online-loan-emi-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                Loan EMI Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            {/* On-page nav */}
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1 text-sm">
                {["Calculator", "How to Use", "Understanding Results", "Quick Examples", "Why Use This Tool", "FAQ"].map((s) => (
                  <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="block py-1 text-muted-foreground hover:text-foreground transition-colors">
                    {s}
                  </a>
                ))}
              </nav>
            </div>

            {/* Related tools */}
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["/finance/online-mortgage-payment-calculator", "Mortgage Calculator"],
                  ["/finance/online-loan-emi-calculator", "Loan EMI Calculator"],
                  ["/finance/loan-interest-calculator", "Loan Interest Calculator"],
                  ["/finance/online-car-loan-calculator", "Car Loan Calculator"],
                  ["/finance/down-payment-calculator", "Down Payment Calculator"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,50%)] shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Free to use, no login", "Works on all devices", "Results in real time", "No data stored"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
