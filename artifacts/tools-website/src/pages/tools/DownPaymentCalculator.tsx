import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Home, DollarSign, Calculator,
  Zap, CheckCircle2, Shield, Clock, TrendingUp, Lightbulb,
  BadgeCheck, Star,
} from "lucide-react";

function useDownPaymentCalc() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [downPct, setDownPct] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [annualRate, setAnnualRate] = useState("");

  const result = useMemo(() => {
    const price = parseFloat(purchasePrice);
    const pct = parseFloat(downPct);
    if (isNaN(price) || isNaN(pct) || price <= 0 || pct <= 0 || pct > 100) return null;

    const downPaymentAmount = price * (pct / 100);
    const loanAmount = price - downPaymentAmount;
    const current = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlySavings) || 0;
    const r = parseFloat(annualRate) || 0;
    const remaining = Math.max(0, downPaymentAmount - current);

    let monthsNeeded = 0;
    let interestEarned = 0;
    if (remaining > 0 && monthly > 0) {
      const monthlyRate = r / 100 / 12;
      if (monthlyRate === 0) {
        monthsNeeded = Math.ceil(remaining / monthly);
      } else {
        // Solve for n: remaining = monthly * [(1+r)^n - 1] / r  (simplified, ignoring growth on existing savings for brevity)
        monthsNeeded = Math.ceil(Math.log(1 + (remaining * monthlyRate) / monthly) / Math.log(1 + monthlyRate));
      }
      // Future value of contributions
      const fv = r > 0 ? monthly * ((Math.pow(1 + r / 100 / 12, monthsNeeded) - 1) / (r / 100 / 12)) : monthly * monthsNeeded;
      interestEarned = fv - monthly * monthsNeeded;
    }

    // PMI context: if down < 20%, estimate PMI
    const pmiMonthly = pct < 20 ? loanAmount * 0.01 / 12 : 0;
    const scenarios = [5, 10, 20].map((p) => ({ pct: p, amount: price * p / 100, loan: price * (1 - p / 100) }));

    return { downPaymentAmount, loanAmount, remaining, monthsNeeded, interestEarned, pmiMonthly, scenarios, pct };
  }, [purchasePrice, downPct, currentSavings, monthlySavings, annualRate]);

  return { purchasePrice, setPurchasePrice, downPct, setDownPct, currentSavings, setCurrentSavings, monthlySavings, setMonthlySavings, annualRate, setAnnualRate, result };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors">
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DownPaymentCalculator() {
  const { purchasePrice, setPurchasePrice, downPct, setDownPct, currentSavings, setCurrentSavings, monthlySavings, setMonthlySavings, annualRate, setAnnualRate, result } = useDownPaymentCalc();
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtD = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Down Payment Calculator — How Much Down Payment Do You Need?"
        description="Calculate your exact down payment amount for any home or car purchase. See your loan amount, PMI impact, and how long to save. Free Down Payment Calculator."
      />
      <div style={{ "--calc-hue": "195" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Down Payment Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">Down Payment Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Calculate the down payment needed for any home or vehicle purchase. See your loan amount, PMI implications, and a personalized savings plan to reach your down payment goal.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "PMI Analysis", "Savings Timeline"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">

            <div className="tool-calc-card rounded-2xl p-6">
              <div className="h-1.5 w-full rounded-full mb-6 overflow-hidden bg-muted">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: result ? "100%" : "0%", background: "linear-gradient(90deg, hsl(195,70%,50%), hsl(215,70%,55%))" }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Purchase Price ($)", val: purchasePrice, set: setPurchasePrice, ph: "e.g. 350000" },
                  { label: "Down Payment (%)", val: downPct, set: setDownPct, ph: "e.g. 20" },
                  { label: "Current Savings ($)", val: currentSavings, set: setCurrentSavings, ph: "e.g. 15000" },
                  { label: "Monthly Savings ($)", val: monthlySavings, set: setMonthlySavings, ph: "e.g. 1000" },
                  { label: "Annual Interest Rate (%)", val: annualRate, set: setAnnualRate, ph: "e.g. 4.5" },
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
                      { label: "Down Payment Needed", value: fmt(result.downPaymentAmount) },
                      { label: "Loan Amount", value: fmt(result.loanAmount) },
                      { label: result.remaining > 0 ? "Still to Save" : "Already Have It ✓", value: result.remaining > 0 ? fmt(result.remaining) : fmt(0) },
                      { label: result.monthsNeeded > 0 ? "Months to Goal" : "Savings Plan", value: result.monthsNeeded > 0 ? `${result.monthsNeeded} mo` : "Ready now" },
                    ].map((item) => (
                      <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="tool-calc-number text-xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {result.pmiMonthly > 0 && (
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm">
                      <p className="font-bold text-orange-600 mb-1">PMI Required — Down Payment Under 20%</p>
                      <p className="text-muted-foreground text-xs">With {result.pct}% down, you'll likely pay Private Mortgage Insurance of approximately <strong className="text-foreground">{fmtD(result.pmiMonthly)}/month</strong> (~1% annual) until you reach 20% equity. A 20% down payment eliminates this cost.</p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Down Payment Scenarios</p>
                    <div className="grid grid-cols-3 gap-3 text-sm text-center">
                      {result.scenarios.map((s) => (
                        <div key={s.pct} className={`p-3 rounded-xl border ${s.pct === 20 ? "border-cyan-500/40 bg-cyan-500/5" : "border-border"}`}>
                          <p className="text-xs text-muted-foreground mb-1">{s.pct}% Down</p>
                          <p className="font-bold text-foreground">{fmt(s.amount)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Loan: {fmt(s.loan)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {result.remaining <= 0
                          ? `You already have enough for a ${result.pct}% down payment of ${fmt(result.downPaymentAmount)}. Your loan amount would be ${fmt(result.loanAmount)}.`
                          : result.monthsNeeded > 0
                          ? `Saving ${fmtD(parseFloat(""))} /month, you'll reach your ${fmt(result.downPaymentAmount)} goal in ${result.monthsNeeded} months${result.interestEarned > 0 ? `, earning ${fmtD(result.interestEarned)} in interest` : ""}.`
                          : `You need ${fmt(result.remaining)} more. Add a monthly savings amount to see your timeline.`}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Down Payment Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Enter the Purchase Price", desc: "Input the full price of the home or vehicle you're planning to buy. For homes, use the asking price or your estimated budget." },
                  { step: "2", title: "Enter Your Down Payment Percentage", desc: "Common options: 3.5% (FHA minimum), 5%, 10%, or 20% (to avoid PMI). The calculator shows the dollar amount for any percentage you enter." },
                  { step: "3", title: "Add Savings Details", desc: "Enter your current savings toward this goal and how much you can save monthly. The calculator shows your timeline to reach the target." },
                  { step: "4", title: "Review PMI and Scenarios", desc: "If you enter less than 20%, you'll see an estimated PMI cost. The scenario panel compares 5%, 10%, and 20% down payment amounts side by side." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
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
                    { expr: "Down Payment = Purchase Price × (Down % ÷ 100)", desc: "The dollar amount of the down payment required at your chosen percentage." },
                    { expr: "Loan Amount = Purchase Price − Down Payment", desc: "How much you'll need to finance through a mortgage or auto loan." },
                    { expr: "PMI ≈ Loan Amount × 1% ÷ 12 (monthly)", desc: "Estimated Private Mortgage Insurance cost when down payment is under 20%. Actual rate varies by lender and credit score." },
                    { expr: "Months to Goal = log(1 + remaining × r / monthly) / log(1 + r)", desc: "Time to accumulate remaining savings with monthly contributions and compound interest." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <div>
                        <code className="px-2 py-1.5 bg-background rounded text-xs font-mono inline-block mb-1 break-all">{item.expr}</code>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="understanding-results" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How Down Payment Size Affects Your Loan</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Your down payment percentage directly affects monthly payments, total interest paid, PMI costs, and interest rate. Bigger down payments reduce risk for lenders — who reward you with better terms.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "3–5% Down", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "Lowest barrier to entry (FHA: 3.5%, conventional: 3–5%). PMI required. Higher monthly payment, more interest over loan life." },
                  { label: "10% Down", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Lower loan amount, smaller monthly payment. PMI still required below 20% but often at a lower rate than 5% down." },
                  { label: "20% Down", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "The sweet spot. Eliminates PMI, qualifies for better rates, and dramatically reduces total interest paid over the loan life." },
                  { label: "Over 20% Down", color: "text-purple-600 bg-purple-500/10 border-purple-500/20", desc: "Maximum benefit. Lowest monthly payments, smallest loan, best rates. May be better to invest excess beyond 20% depending on rate environment." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Down Payment Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Purchase</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Price</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Down %</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Down Amount</th>
                      <th className="text-right py-2 font-bold text-foreground">Loan</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { purchase: "Starter home", price: "$280,000", pct: "5%", down: "$14,000", loan: "$266,000" },
                      { purchase: "Suburban home", price: "$450,000", pct: "20%", down: "$90,000", loan: "$360,000" },
                      { purchase: "New car", price: "$35,000", pct: "20%", down: "$7,000", loan: "$28,000" },
                      { purchase: "Used car", price: "$18,000", pct: "10%", down: "$1,800", loan: "$16,200" },
                      { purchase: "Investment property", price: "$320,000", pct: "25%", down: "$80,000", loan: "$240,000" },
                    ].map((row) => (
                      <tr key={row.purchase} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.purchase}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.price}</td>
                        <td className="py-2.5 pr-3 text-right">{row.pct}</td>
                        <td className="py-2.5 pr-3 text-right font-bold text-cyan-500">{row.down}</td>
                        <td className="py-2.5 text-right font-mono">{row.loan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">The 20% home down payment</strong> eliminates PMI, which on a $450,000 home can easily cost $300–$450/month. Over 7 years before reaching 20% equity organically, that's $25,000–$38,000 in extra insurance costs — money that could have gone toward principal.</p>
                <p><strong className="text-foreground">Vehicle down payments</strong> work the same way: a larger down payment means a smaller loan, lower monthly payments, and less total interest. For vehicles, 10–20% is a common starting point, with 20% recommended for new cars to avoid being "underwater" as the vehicle depreciates.</p>
                <p><strong className="text-foreground">Investment property</strong> typically requires 25% down minimum from most conventional lenders — higher than primary residence requirements. This reflects the greater perceived risk of rental property financing.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic">"We used this to decide between buying now at 5% down versus waiting 18 months to hit 20%. The PMI cost tipped us to wait — and we ended up with a lower rate too."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— First-time homebuyer, Texas</p>
              </div>
            </section>

            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Down Payment Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>A down payment is typically the largest single cash outlay in most people's lives — and the decision about how much to put down has significant long-term financial implications. This calculator makes those implications visible and comparable.</p>
                <p>The built-in <strong className="text-foreground">PMI estimation</strong> is particularly valuable. Many first-time buyers are surprised to learn that their "affordable" 5% down payment adds $300–$500/month in insurance costs on top of mortgage principal and interest. Seeing this upfront changes the calculus of how much to save before buying.</p>
                <p>The <strong className="text-foreground">savings timeline</strong> feature connects the down payment target to a concrete monthly savings plan. Instead of an abstract goal ("save for a house"), you get a specific number ("save $1,200/month for 14 months to hit 20% on a $350,000 home").</p>
                <p>The <strong className="text-foreground">scenario comparison</strong> — showing 5%, 10%, and 20% side by side — helps you evaluate trade-offs: buy sooner with less down versus wait longer but pay no PMI and get better terms.</p>
                <p>Pair this with the <Link href="/finance/online-mortgage-payment-calculator" className="text-cyan-500 hover:underline">Mortgage Payment Calculator</Link> to see full monthly payments at different down payment levels, or the <Link href="/finance/savings-goal-calculator" className="text-cyan-500 hover:underline">Savings Goal Calculator</Link> to plan your savings journey.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> PMI rates vary significantly by lender, credit score, and loan type. The 1% annual estimate is a general approximation. Get actual PMI quotes from your lender during the pre-approval process.
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="What is a down payment?" a="A down payment is the upfront cash payment made when purchasing a home, car, or other financed asset. It represents the buyer's initial equity and reduces the amount that needs to be borrowed. For homes, down payments are expressed as a percentage of the purchase price." />
                <FaqItem q="What is the minimum down payment for a home?" a="Minimum down payments vary by loan type: FHA loans require 3.5% (with 580+ credit score). Conventional loans can go as low as 3% for first-time buyers. VA loans (military) require 0% down. USDA loans (rural areas) require 0% down. Jumbo loans typically require 10–20%." />
                <FaqItem q="What is PMI and how do I avoid it?" a="Private Mortgage Insurance (PMI) protects the lender if you default. It's required on conventional loans with less than 20% down, typically costing 0.5–1.5% of the loan amount annually. Avoid it by: putting 20% down, using a piggyback second mortgage, or taking a lender-paid PMI (slightly higher rate). PMI is automatically removed when you reach 20% equity." />
                <FaqItem q="Is it better to put more or less down?" a="More down: lower monthly payments, no PMI, better interest rates, more equity from day one. Less down: keep more cash liquid for emergencies/investments, buy sooner, preserve cash for renovations. The right answer depends on your cash reserves, interest rate environment, and how long you plan to own. Avoid going below $10,000 emergency fund to make a down payment." />
                <FaqItem q="Can I use gift money for a down payment?" a="Yes — most loan types allow gift funds from family members. FHA loans allow 100% gift funds. Conventional loans may require you to contribute a minimum amount yourself (typically 3–5% of the purchase price) if you put less than 20% down. The gift must be documented and the donor must sign a gift letter confirming no repayment is required." />
                <FaqItem q="Does a larger down payment affect my mortgage rate?" a="Yes — lenders use Loan-to-Value (LTV) ratio as a risk indicator. Lower LTV (more equity) = lower rate. The biggest improvements come at 80% LTV (20% down) and above. Some lenders offer incremental rate improvements at 75%, 70%, and 65% LTV. The difference can be 0.25–0.75% in rate, which over a 30-year mortgage on a large loan translates to tens of thousands of dollars." />
              </div>
            </section>

            <section className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">Plan Every Step of Your Home Purchase</h2>
              <p className="text-muted-foreground text-sm mb-4">Mortgage payments, savings timelines, and more — all free, no signup required.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[{ href: "#how-to-use", label: "How to Use" }, { href: "#understanding-results", label: "Down Payment Impact" }, { href: "#examples", label: "Examples" }, { href: "#why-this-tool", label: "Why This Tool" }, { href: "#faq", label: "FAQ" }].map((item) => (
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
                  { href: "/finance/online-mortgage-payment-calculator", label: "Mortgage Calculator", icon: Home },
                  { href: "/finance/savings-goal-calculator", label: "Savings Goal Calculator", icon: TrendingUp },
                  { href: "/finance/online-car-loan-calculator", label: "Car Loan Calculator", icon: Calculator },
                  { href: "/finance/online-loan-emi-calculator", label: "EMI Calculator", icon: DollarSign },
                  { href: "/finance/net-worth-calculator", label: "Net Worth Calculator", icon: TrendingUp },
                  { href: "/finance/online-budget-calculator", label: "Budget Calculator", icon: Clock },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-cyan-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[{ icon: Shield, text: "No data stored" }, { icon: Zap, text: "PMI analysis" }, { icon: BadgeCheck, text: "3 scenarios compared" }, { icon: Clock, text: "Savings timeline" }].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-cyan-500" />{item.text}
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
