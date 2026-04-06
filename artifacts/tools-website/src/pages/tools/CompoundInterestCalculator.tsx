import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, TrendingUp, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, DollarSign, Calculator, Calendar
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const COMPOUND_FREQUENCIES = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

const RELATED = [
  { title: "Simple Interest Calculator",slug: "online-simple-interest-calculator", cat: "finance", icon: <Calculator className="w-5 h-5" />, color: 25,  benefit: "Calculate non-compounding loans" },
  { title: "Savings Calculator",        slug: "savings-calculator",         cat: "finance", icon: <DollarSign className="w-5 h-5" />, color: 152, benefit: "Calculate total savings over time" },
  { title: "Tip Calculator",            slug: "tip-calculator",             cat: "finance", icon: <DollarSign className="w-5 h-5" />, color: 217, benefit: "Calculate tip and split bills" },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("0");
  const [years, setYears] = useState("10");
  const [interestRate, setInterestRate] = useState("5");
  const [frequency, setFrequency] = useState(12);

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0;
    const pmt = parseFloat(monthlyContribution) || 0;
    const t = parseFloat(years) || 0;
    const r = (parseFloat(interestRate) || 0) / 100;
    const n = frequency;

    if (t <= 0 || r <= 0) return null;

    // A = P(1 + r/n)^(nt)
    // PMT × {[(1 + r/n)^(nt) - 1] / (r/n)}
    const ratePerPeriod = r / n;
    const periods = n * t;

    // Compound Interest on Principal
    const futureValuePrincipal = p * Math.pow(1 + ratePerPeriod, periods);
    
    // Future Value of a Series (Monthly Contributions)
    // Adjust monthly contribution to the compounding frequency period if they don't exactly match
    // Easiest approximation: calculate Annual compounding: effectively PMT * 12 is added per year.
    // Standard formula assumes PMT happens exactly at each compounding period. Let's do a basic iterative approximation or exact formula
    // For exact standard: A = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
    // We will do exact standard assuming payments match compound frequency for simplicity (n=12 => monthly payment),
    // Or we iterative for monthly payments + varying compound frequency.
    let futureValueTotal = futureValuePrincipal;
    let totalPrincipalAndContributions = p + (pmt * 12 * t);
    
    if (pmt > 0) {
      if (n === 12) {
        // PMT per compound period = monthlyContribution
        futureValueTotal += pmt * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
      } else {
        // PMT per month, compound n times a year
        let balance = p;
        for (let month = 1; month <= t * 12; month++) {
          balance += pmt;
          // Apply interest only at compound periods (rough discrete approx for common calculators)
          // Simple continuous equivalent:
          // Since it's a generic calculator, standard compound formula is often sufficient.
        }
        // Let's use standard compound on principal + simple annuity adjusted for monthly
        const effectiveAnnualRate = Math.pow(1 + r/n, n) - 1;
        const equivalentMonthlyRate = Math.pow(1 + effectiveAnnualRate, 1/12) - 1;
        const altFV = p * Math.pow(1 + equivalentMonthlyRate, t * 12) + pmt * ((Math.pow(1 + equivalentMonthlyRate, t * 12) - 1) / equivalentMonthlyRate);
        futureValueTotal = altFV;
      }
    }

    const totalInterest = futureValueTotal - totalPrincipalAndContributions;

    return {
      futureValue: futureValueTotal,
      principal: p,
      contributions: pmt * 12 * t,
      totalInvested: totalPrincipalAndContributions,
      totalInterest: Math.max(0, totalInterest),
    };
  }, [principal, monthlyContribution, years, interestRate, frequency]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Total Value: $${fmt(result.futureValue)} | Principal: $${fmt(result.principal)} | Total Interest: $${fmt(result.totalInterest)}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Compound Interest Calculator – Project Your Financial Growth | US Online Tools"
        description="Free compound interest calculator. Calculate future value, total interest, and investment growth over time with monthly contributions and custom compounding intervals."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Compound Interest Calculator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Finance Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Compound Interest Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            See how your money grows over time with the power of compound interest. Factor in your initial deposit, regular monthly contributions, and adjust compounding frequencies to visualize your total future savings.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Zap className="w-3.5 h-3.5" /> Real-time Math</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Investment Growth</p>
                      <p className="text-sm text-muted-foreground">Results update instantly as you change inputs.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 142 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Initial Principal ($)</label>
                        <input type="number" placeholder="10000" className="tool-calc-input w-full" value={principal} onChange={e => setPrincipal(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Monthly Deposit ($)</label>
                        <input type="number" placeholder="500" className="tool-calc-input w-full" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Years to Grow</label>
                        <input type="number" placeholder="10" className="tool-calc-input w-full" value={years} onChange={e => setYears(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Interest Rate (%)</label>
                        <input type="number" placeholder="5.0" step="0.1" className="tool-calc-input w-full" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Compounding Frequency</label>
                      <div className="flex flex-wrap gap-2">
                        {COMPOUND_FREQUENCIES.map(f => (
                          <button key={f.value} onClick={() => setFrequency(f.value)}
                            className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${frequency === f.value ? "bg-emerald-500 border-emerald-500 text-white" : "border-border text-muted-foreground hover:border-emerald-500/40"}`}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results */}
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Future Investment Value</p>
                          <p className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400">${fmt(result.futureValue)}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Starting Amount</p>
                            <p className="font-bold text-foreground">${fmt(result.principal)}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Deposits</p>
                            <p className="font-bold text-foreground">${fmt(result.contributions)}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Invested</p>
                            <p className="font-bold text-blue-600">${fmt(result.totalInvested)}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-1">Total Interest</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">${fmt(result.totalInterest)}</p>
                          </div>
                        </div>

                        <button onClick={copyResult} className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors mt-2">
                          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Summary</>}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Compound Interest Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Compound interest is the interest on your principal PLUS the interest that has already accrued on it over previous periods. This creates a "snowball effect" that accelerates wealth building.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set Your Starting Principal</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The lump sum you currently have in your bank account, brokerage, or retirement fund.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add Recurring Deposits</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter how much you plan to save monthly. Consistent investments heavily boost long-term total value.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select Time & Rate</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose an expected average annual percentage yield (APY/Interest Rate) and the number of years. The S&P 500 historically averages ~7-10% annually over long decades.</p>
                  </div>
                </li>
              </ol>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between Simple and Compound Interest?" a="Simple interest is based strictly on the original principal amount. Compound interest is based on the principal amount PLUS the interest that accumulates on it every period." />
                <FaqItem q="How does Compounding Frequency change the result?" a="More frequent compounding periods (e.g., Daily vs. Annually) generate slightly higher total returns because your earned interest starts earning its own interest much sooner." />
                <FaqItem q="Is this calculator accounting for inflation?" a="No. These numbers represent raw nominal future value. For actual purchasing power, you'd subtract average inflation (e.g., ~2.5% to 3%) from your expected interest rate." />
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator","How to Use","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />{label}
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
