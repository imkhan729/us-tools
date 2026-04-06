import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check, ArrowRight,
  Zap, Smartphone, Shield, Copy, CheckCircle,
  PiggyBank, ArrowDownRight, BadgeCheck, DollarSign
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

const RELATED = [
  { title: "Mortgage Calculator", slug: "online-mortgage-payment-calculator",cat: "finance", icon: <DollarSign className="w-5 h-5" />,  color: 142, benefit: "Calculate complex house loans" },
  { title: "Compound Interest",   slug: "online-compound-interest-calculator",cat:"finance", icon: <ArrowDownRight className="w-5 h-5" />,color: 152, benefit: "Project future investment values" },
  { title: "Discount Calculator", slug: "discount-calculator",         cat: "finance", icon: <PiggyBank className="w-5 h-5" />,   color: 25,  benefit: "Calculate retail discount margins" },
];

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState("50000");
  const [interest, setInterest] = useState("6.5");
  const [tenure, setTenure] = useState("60"); // months
  const [tenureType, setTenureType] = useState<"months" | "years">("months");
  
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(interest);
    const t = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) return null;

    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const R = (r / 12) / 100;
    const N = tenureType === "years" ? t * 12 : t;

    // Monthly Payment
    const emi = (p * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emi * N;
    const totalInterest = totalAmount - p;

    // Principle vs Interest Pie Chart logic
    const principalPct = (p / totalAmount) * 100;
    const interestPct = (totalInterest / totalAmount) * 100;

    return {
      emi,
      totalInterest,
      totalAmount,
      principal: p,
      principalPct,
      interestPct,
      N
    };
  }, [principal, interest, tenure, tenureType]);

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Monthly EMI: $${fmt(result.emi)} | Total Interest: $${fmt(result.totalInterest)} | Total Payment: $${fmt(result.totalAmount)}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Loan EMI Calculator – Car, Personal & Education Loans | US Online Tools"
        description="Free online Loan EMI Calculator. Quickly calculate your monthly Equal Monthly Installment (EMI), total interest, and total payable amount for any custom loan."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Loan EMI Calculator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <PiggyBank className="w-3.5 h-3.5" /> Finance Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Online Loan EMI Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your Equated Monthly Installment (EMI) for personal, car, or education loans instantly. Find out the exact ratio of interest to your principal amount across the entire payment schedule.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Zap className="w-3.5 h-3.5" /> Real-time Math</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> No Signup</span>
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
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">EMI Projection</p>
                      <p className="text-sm text-muted-foreground">Enter loan components to view amortization structure.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 142 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Loan Amount ($)</label>
                        <input type="number" placeholder="50000" className="tool-calc-input w-full" value={principal} onChange={e => setPrincipal(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Interest Rate (%)</label>
                        <input type="number" placeholder="6.5" step="0.1" className="tool-calc-input w-full" value={interest} onChange={e => setInterest(e.target.value)} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                           <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Loan Tenure</label>
                           <button onClick={() => setTenureType(t => t === "months" ? "years" : "months")} className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full hover:bg-emerald-500/20 transition">Switch to {tenureType === "months" ? "Years" : "Months"}</button>
                        </div>
                        <div className="relative">
                          <input type="number" placeholder="60" className="tool-calc-input w-full pr-16" value={tenure} onChange={e => setTenure(e.target.value)} />
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-muted-foreground text-sm font-medium">{tenureType}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results View */}
                    <AnimatePresence mode="wait">
                      {result ? (
                         <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                          <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Monthly EMI</p>
                            <p className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400">${fmt(result.emi)}</p>
                            <p className="text-xs font-medium text-emerald-600/60 dark:text-emerald-400/60 mt-2 tracking-wide block">Paid over {result.N} total installments</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-2">
                             <div className="p-5 rounded-xl bg-card border border-border">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Total Interest</p>
                                <p className="text-2xl font-black text-rose-500">${fmt(result.totalInterest)}</p>
                             </div>
                             <div className="p-5 rounded-xl bg-card border border-border">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Total Payment</p>
                                <p className="text-2xl font-black text-foreground">${fmt(result.totalAmount)}</p>
                             </div>
                          </div>

                          {/* Minimal Visual Bar */}
                          <div className="space-y-2 mt-4">
                            <div className="flex items-center justify-between text-xs font-bold px-1">
                               <div className="text-emerald-500flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 inline-block align-middle mr-1.5"/>Principal (<span className="text-foreground">{result.principalPct.toFixed(1)}%</span>)</div>
                               <div className="text-rose-500 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 inline-block align-middle mr-1.5"/>Interest (<span className="text-foreground">{result.interestPct.toFixed(1)}%</span>)</div>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden flex">
                               <div className="bg-emerald-500 h-full" style={{ width: `${result.principalPct}%` }} />
                               <div className="bg-rose-500 h-full" style={{ width: `${result.interestPct}%` }} />
                            </div>
                          </div>
                          
                          <button onClick={copyResult} className="w-full mt-4 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                            {copied ? <><CheckCircle className="w-4 h-4" /> Copied Layout!</> : <><Copy className="w-4 h-4" /> Copy EMI Numbers</>}
                          </button>
                       </motion.div>
                      ) : (
                        <div className="text-center py-8 opacity-50">
                          <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="font-bold text-lg text-foreground">Awaiting Valuess</p>
                          <p className="text-sm text-muted-foreground">Input valid numbers above to instantly generate EMI schedules.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Loan EMI Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                An EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs apply to both interest and principal each month, so over a specified number of years, the loan is paid off in full.
              </p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Amortization Truths:</strong> In the initial years of an EMI loan, a massive portion of the monthly payment goes strictly toward paying off the interest, with very little reducing the principal base. Over subsequent years, this ratio mathematically flips, and the majority of payments directly reduce your principal.</p>
                <p><strong className="text-foreground">Why Loan Tenure Matters:</strong> Paying a loan across fewer months structurally bumps your monthly EMI to be larger. Conversely, long-term 60 or 72-month terms severely lower your monthly payment but drastically bloat the "Total Interest" bank payout.</p>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common EMI Interest Impacts</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Loan Amount</th><th className="text-left px-4 py-3 font-bold text-foreground">Interest / Term</th><th className="text-left px-4 py-3 font-bold text-foreground">Monthly EMI</th><th className="text-left px-4 py-3 font-bold text-foreground">Total Interest Burden</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">$20,000</td><td className="px-4 py-3 text-muted-foreground">4% over 3 Yrs (36m)</td><td className="px-4 py-3 font-mono text-emerald-500">$590.48</td><td className="px-4 py-3 font-mono text-rose-500">$1,257.28</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">$20,000</td><td className="px-4 py-3 text-muted-foreground">4% over 5 Yrs (60m)</td><td className="px-4 py-3 font-mono text-emerald-500">$368.33</td><td className="px-4 py-3 font-mono text-rose-500">$2,099.80</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">$50,000</td><td className="px-4 py-3 text-muted-foreground">7% over 5 Yrs (60m)</td><td className="px-4 py-3 font-mono text-emerald-500">$990.06</td><td className="px-4 py-3 font-mono text-rose-500">$9,403.60</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">$50,000</td><td className="px-4 py-3 text-muted-foreground">12% over 5 Yrs (60m)</td><td className="px-4 py-3 font-mono text-emerald-500">$1,112.22</td><td className="px-4 py-3 font-mono text-rose-500">$16,733.20</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="Does calculating EMI account for missing or early payments?" a="No, standard EMI calculators assume that there are absolutely zero deviations from the schedule. All scheduled payments precisely arrive on time without extra principal payments or late penalties." />
                <FaqItem q="Can I use this for home mortgages?" a="While mathematically sound for base principal and base interest, home mortgages often include escrowing for property taxes, PMI (Private Mortgage Insurance), and homeowner's insurance. We recommend using a dedicated Mortgage Calculator for housing." />
                <FaqItem q="Is Loan EMI different than 'Simple Interest'?" a="Yes. Simple Interest is rarely used for standard consumer loans. EMI compounds monthly. It recalculates the interest on the remaining diminishing balance each month, whereas Simple Interest just establishes a flat rate universally derived from the original loan amount." />
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
                  {["EMI Calculator","How to Use", "Quick Examples", "FAQ"].map(label => (
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
