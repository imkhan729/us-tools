import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, BadgePercent, ArrowRight,
  Zap, Smartphone, Shield, Wallet, Banknote, CalendarCheck, TrendingDown
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
  { title: "Loan EMI Calc", slug: "loan-emi-calculator", cat: "finance", icon: <Banknote className="w-5 h-5"/>, color: 140, benefit: "Analyze Equated Installments" },
  { title: "Amortization", slug: "amortization-calculator", cat: "finance", icon: <TrendingDown className="w-5 h-5"/>, color: 170, benefit: "Map out full loan schedules" },
  { title: "Savings Calculator", slug: "savings-calculator", cat: "finance", icon: <Wallet className="w-5 h-5"/>, color: 200, benefit: "Project compound savings" },
];

export default function CreditCardPayoffCalculator() {
  const [balanceStr, setBalance] = useState("");
  const [aprStr, setApr] = useState("");
  const [paymentStr, setPayment] = useState("");

  const payload = useMemo(() => {
    let balance = parseFloat(balanceStr);
    let apr = parseFloat(aprStr);
    let payment = parseFloat(paymentStr);

    if (isNaN(balance) || balance <= 0 || isNaN(payment) || payment <= 0) return null;

    let monthlyRate = (apr / 100) / 12;
    // Edge case if APR is 0 or no interest
    if (apr === 0 || isNaN(apr)) {
      let months = Math.ceil(balance / payment);
      return { months, totalInterest: 0, totalPaid: balance, viable: true };
    }

    // Checking if the payment is enough to cover interest
    let interestThreshold = balance * monthlyRate;
    if (payment <= interestThreshold) {
      return { months: 0, totalInterest: 0, totalPaid: 0, viable: false }; // Never pays off
    }

    // Formula for Months: N = -(1 / ln(1 + r)) * ln(1 - (B * r) / P)
    let nPart1 = Math.log(1 - ((balance * monthlyRate) / payment));
    let nPart2 = Math.log(1 + monthlyRate);
    let exactMonths = -(nPart1 / nPart2);
    let months = Math.ceil(exactMonths);

    // Calc Total Interest
    // P * N - B
    // Wait, the precise interest considers exactly how the float is processed down to the penny.
    let remaining = balance;
    let totalInterest = 0;
    let count = 0;
    while (remaining > 0 && count < 10000) {
      let intCharge = remaining * monthlyRate;
      totalInterest += intCharge;
      remaining = remaining + intCharge - payment;
      count++;
    }

    if (count >= 10000) return { months: 0, totalInterest: 0, totalPaid: 0, viable: false };

    return {
       months: count,
       totalInterest,
       totalPaid: balance + totalInterest,
       viable: true
    };
  }, [balanceStr, aprStr, paymentStr]);

  return (
    <Layout>
      <SEO
        title="Credit Card Payoff Calculator – Calculate Debt Free Timeline"
        description="Free online Credit Card Payoff Calculator. See exactly how many months it will take to eliminate your credit card debt based on your interest rate."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Credit Card Payoff</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Wallet className="w-3.5 h-3.5" /> Debt Management
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Credit Card Payoff Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Input your credit card balance and Annual Percentage Rate (APR) to map out exactly how long it takes to clear the debt completely, and visualize how much total interest the bank claims.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><BadgePercent className="w-3.5 h-3.5" /> Compounding Logic</span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><CalendarCheck className="w-3.5 h-3.5" /> Real Timelines</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> Private Client Side</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* INTEGRATED BUILDER */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-600" />
                <div className="bg-card p-6 md:p-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5"/> Outstanding Balance</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">$</div>
                        <input type="number" placeholder="5000" className="tool-calc-input w-full pl-8" value={balanceStr} onChange={(e) => setBalance(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><BadgePercent className="w-3.5 h-3.5"/> Interest Rate (APR %)</label>
                      <div className="relative">
                        <input type="number" placeholder="18.99" className="tool-calc-input w-full pr-8" value={aprStr} onChange={(e) => setApr(e.target.value)} />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">%</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5"/> Monthly Payment</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">$</div>
                        <input type="number" placeholder="150" className="tool-calc-input w-full pl-8" value={paymentStr} onChange={(e) => setPayment(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Results Wrapper */}
                  <AnimatePresence mode="wait">
                    {payload && payload.viable ? (
                      <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-6 rounded-2xl bg-muted/40 border border-border text-center">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Time To Payoff</p>
                             <p className="text-3xl font-black text-foreground tracking-tight">
                               {Math.floor(payload.months / 12) > 0 ? `${Math.floor(payload.months / 12)}y ` : ''}{(payload.months % 12)}m
                             </p>
                             <p className="text-xs text-muted-foreground mt-1">({payload.months} total months)</p>
                          </div>
                          
                          <div className="p-6 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-center relative overflow-hidden">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Interest Lost</p>
                             <p className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">${payload.totalInterest.toFixed(2)}</p>
                          </div>
                          
                          <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 text-center relative overflow-hidden">
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Amount Paid</p>
                             <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">${payload.totalPaid.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Ratio breakdown */}
                        <div className="w-full bg-border h-4 rounded-full overflow-hidden flex shadow-inner mt-4">
                           <div style={{ width: `${(parseFloat(balanceStr) / payload.totalPaid) * 100}%` }} className="bg-emerald-500 h-full" title="Principal Paid" />
                           <div style={{ width: `${(payload.totalInterest / payload.totalPaid) * 100}%` }} className="bg-rose-500 h-full" title="Interest Paid" />
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Principal ({((parseFloat(balanceStr) / payload.totalPaid) * 100).toFixed(1)}%)</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5">Interest Lost ({((payload.totalInterest / payload.totalPaid) * 100).toFixed(1)}%) <span className="w-2 h-2 rounded-full bg-rose-500" /></p>
                        </div>
                      </motion.div>
                    ) : payload && !payload.viable ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-center">
                          <Shield className="w-10 h-10 mx-auto text-rose-500 mb-3" />
                          <p className="font-bold text-lg text-rose-600 dark:text-rose-400">Payment Too Low</p>
                          <p className="text-sm text-rose-600/80 dark:text-rose-400/80 font-medium">Your monthly payment is lower than the amount of compounding interest aggregating every month. You will never pay off this card without raising the monthly payment.</p>
                      </motion.div>
                    ) : (
                      <div className="text-center py-8 opacity-50 bg-muted/20 border border-border rounded-xl border-dashed">
                        <Banknote className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                        <p className="font-bold text-sm text-foreground">Awaiting Financial Statement details.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="documentation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Credit Card APR Destroys Wealth</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most big bank credit cards advertise an APR (Annual Percentage Rate) around `19%` to `29%`. However, interest is actually assessed on a **daily** or **monthly** basis depending on the issuer algorithm. Whenever a month passes without eliminating the principal balance, the bank calculates interest on the remaining amount and adds it directly back onto the principal—creating a compounding debt spiral.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="p-5 border border-border rounded-xl bg-muted/30 relative overflow-hidden">
                   <div className="absolute -top-4 -right-4 p-3"><TrendingDown className="w-16 h-16 text-rose-500/10" /></div>
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest relative z-10">Minimum Payments Trap</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed relative z-10">Banks usually set minimum due amounts to only cover `1%` of the principal + the monthly interest. This mathematically ensures they keep you paying back interest streams for decades.</p>
                </div>
                <div className="p-5 border border-border rounded-xl bg-muted/30 relative overflow-hidden">
                   <div className="absolute -top-4 -right-4 p-3"><Zap className="w-16 h-16 text-emerald-500/10" /></div>
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest relative z-10">The Extra $50 Trick</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed relative z-10">Throwing just $50 to $100 above the minimum due payment massively slashes the timeline. Play with our calculator inputs above to watch 20-year debt timelines drop to just 5 years via small bumps.</p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="What does APR stand for on a credit card statement?" a="It stands for Annual Percentage Rate. It represents the yearly interest rate charged to users carrying revolving balances past the grace period." />
                <FaqItem q="Why did the calculator say 'Payment Too Low'?" a="If your input payment is $50, but the interest generated on the balance alone reaches $60 every month, then your debt is actively growing despite you paying it. The calculator stops running to shield against an infinite loop representing permanent unrecoverable debt traps." />
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
                  {["Payoff Engine", "How Banks Exploit Interest", "FAQ"].map(label => (
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
