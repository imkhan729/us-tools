import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  DollarSign, Percent, Landmark, Wallet, PiggyBank, Target,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type Compound = "monthly" | "quarterly" | "annually";

function useSavingsCalc() {
  const [initial, setInitial] = useState("");
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compound, setCompound] = useState<Compound>("monthly");

  const result = useMemo(() => {
    const p = parseFloat(initial) || 0;
    const pmt = parseFloat(monthly) || 0;
    const r = parseFloat(rate);
    const t = parseFloat(years);
    if (isNaN(r) || r < 0 || isNaN(t) || t <= 0) return null;

    const n = compound === "monthly" ? 12 : compound === "quarterly" ? 4 : 1;
    const periods = t * n;
    const ratePerPeriod = r / 100 / n;
    const pmtPerPeriod = pmt * (12 / n);

    let futureValue: number;
    if (ratePerPeriod === 0) {
      futureValue = p + pmtPerPeriod * periods;
    } else {
      // FV of lump sum
      const fvLump = p * Math.pow(1 + ratePerPeriod, periods);
      // FV of regular contributions
      const fvPmt = pmtPerPeriod * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod);
      futureValue = fvLump + fvPmt;
    }

    const totalContributions = p + pmt * 12 * t;
    const interestEarned = futureValue - totalContributions;

    return { futureValue, totalContributions, interestEarned, years: t, rate: r };
  }, [initial, monthly, rate, years, compound]);

  return { initial, setInitial, monthly, setMonthly, rate, setRate, years, setYears, compound, setCompound, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useSavingsCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const interestPct = ((result.interestEarned / result.futureValue) * 100).toFixed(1);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          After {result.years} years, your savings grow to <strong>{fmt(result.futureValue)}</strong>. You contributed <strong>{fmt(result.totalContributions)}</strong> and earned <strong>{fmt(result.interestEarned)}</strong> in interest — that's <strong>{interestPct}%</strong> of the final balance from compound growth alone.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span>
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

const RELATED_TOOLS = [
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <Landmark className="w-5 h-5" />, color: 217 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265 },
  { title: "Retirement Calculator", slug: "retirement-calculator", icon: <Target className="w-5 h-5" />, color: 45 },
  { title: "Salary Calculator", slug: "salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 152 },
  { title: "Tax Calculator", slug: "tax-calculator", icon: <Percent className="w-5 h-5" />, color: 25 },
  { title: "Car Loan Calculator", slug: "car-loan-calculator", icon: <Wallet className="w-5 h-5" />, color: 340 },
];

export default function SavingsCalculator() {
  const calc = useSavingsCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number | undefined) => n === undefined ? "--" : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <Layout>
      <SEO
        title="Savings Calculator - Calculate Savings Growth with Compound Interest | Free Tool"
        description="Free savings calculator. See how your savings grow with compound interest. Enter initial savings, monthly contributions, interest rate, and years to project your balance."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Savings Calculator", "url": "https://usonlinetools.com/finance/savings-calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Savings Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <PiggyBank className="w-3.5 h-3.5" />
                Savings & Investment
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Savings Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Project how much your savings will grow with compound interest. Enter your starting balance, monthly contributions, interest rate, and time horizon to see your future balance, total contributions, and interest earned.
              </p>
            </section>

            {/* QUICK ANSWER */}
            <section className="p-5 rounded-xl bg-emerald-500/5 border-2 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-emerald-500" />
                <h2 className="font-black text-foreground text-base">The Power of Compound Interest</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Saving just <strong className="text-foreground">$200/month</strong> at 7% annual return for <strong className="text-foreground">30 years</strong> = <strong className="text-foreground">$243,994</strong> total, with only $72,000 contributed. Compound interest earns you an extra <strong className="text-foreground">$171,994</strong>.
              </p>
            </section>

            {/* QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">See your savings grow instantly</p>
                <p className="text-muted-foreground text-sm">Adjust any field to instantly see how changes in rate, time, or contributions affect your final balance.</p>
              </div>
            </section>

            {/* TOOL */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Savings Growth Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Initial Savings ($)</label>
                    <input type="number" placeholder="1000" className="tool-calc-input w-full" value={calc.initial} onChange={e => calc.setInitial(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Monthly Contribution ($)</label>
                    <input type="number" placeholder="200" className="tool-calc-input w-full" value={calc.monthly} onChange={e => calc.setMonthly(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Annual Interest Rate (%)</label>
                    <input type="number" placeholder="7" className="tool-calc-input w-full" value={calc.rate} onChange={e => calc.setRate(e.target.value)} step="0.1" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Time Period (Years)</label>
                    <input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.years} onChange={e => calc.setYears(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-muted-foreground mb-2 block">Compounding Frequency</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["monthly", "quarterly", "annually"] as Compound[]).map(c => (
                        <button key={c} onClick={() => calc.setCompound(c)} className={`py-2.5 rounded-xl border font-bold text-sm transition-all capitalize ${calc.compound === c ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {calc.result && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="tool-calc-result text-center col-span-1 sm:col-span-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Future Balance</div>
                      <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{fmt(calc.result.futureValue)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Contributions</div>
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400">{fmt(calc.result.totalContributions)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Interest Earned</div>
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400">{fmt(calc.result.interestEarned)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Growth Multiplier</div>
                      <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {calc.result.totalContributions > 0 ? (calc.result.futureValue / calc.result.totalContributions).toFixed(2) + "×" : "--"}
                      </div>
                    </div>
                  </div>
                )}
                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "emerald", title: "Start with Your Balance", desc: "Enter your current savings and monthly deposit. Even starting with $0 works — regular contributions compound over time." },
                  { color: "blue", title: "Choose Interest Rate & Duration", desc: "Enter the expected annual return. High-yield savings accounts offer 4–5%, index funds average 7–10% historically." },
                  { color: "purple", title: "Compound Interest Does the Work", desc: "The calculator applies the compound interest formula: FV = P(1+r/n)^(nt) + PMT × [(1+r/n)^(nt) − 1] / (r/n)." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div><h4 className="font-bold text-foreground mb-1">{step.title}</h4><p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>

            {/* REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><PiggyBank className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Emergency Fund</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$500 initial + $300/mo at 4.5% HY savings for 3 years = <strong className="text-foreground">$12,195</strong>. A solid 6-month emergency fund.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Retirement Savings</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$5,000 initial + $500/mo at 7% for 30 years = <strong className="text-foreground">$656,827</strong>. Only $185K contributed; $471K from compound interest.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">House Down Payment</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$2,000 initial + $800/mo at 5% for 5 years = <strong className="text-foreground">$56,283</strong>. A 20% down payment on a $280K home.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">College Fund</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$10,000 initial + $250/mo at 6% for 18 years = <strong className="text-foreground">$130,505</strong>. Enough to cover most 4-year college expenses.</p>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Savings Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <PiggyBank className="w-4 h-4" />, text: "Shows contributions vs. interest earned" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Monthly, quarterly, and annual compounding" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collected — runs in browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-friendly for on-the-go planning" },
                  { icon: <Clock className="w-4 h-4" />, text: "Instant results as you adjust inputs" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Shows growth multiplier for motivation" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Compound Interest Changes Everything</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Einstein reportedly called compound interest the "eighth wonder of the world." Whether or not he said it, the math is undeniable: compound interest lets your money earn interest on interest, creating exponential growth over time. A <strong className="text-foreground">savings calculator</strong> lets you visualize this growth before you commit your money.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">High-Yield Savings vs. Investment Accounts</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "HYSA (High-Yield Savings Account): 4–5% APY in 2024, FDIC insured, liquid",
                    "CDs (Certificates of Deposit): 4–5.5% APY, fixed term, low risk",
                    "Index funds (S&P 500): ~10% average annual return, higher risk, long-term",
                    "401(k) / IRA: Tax-advantaged accounts, best for long-term retirement savings",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How much should I save per month?" a="A common guideline is the 50/30/20 rule: 20% of take-home pay goes to savings and debt repayment. On a $5,000/month take-home, that's $1,000 saved. Even $100–$200/month invested early compounds into significant wealth over 20–30 years." />
                <FaqItem q="What interest rate should I use for projections?" a="For high-yield savings accounts, use 4–5%. For index fund investments over 10+ years, many planners use 6–7% (inflation-adjusted) or 10% nominal. Be conservative in projections to avoid overestimating your future balance." />
                <FaqItem q="What is the difference between APY and APR?" a="APY (Annual Percentage Yield) includes compound interest effects. APR (Annual Percentage Rate) is the base rate before compounding. For savings accounts, look for the APY — it's the actual return you'll receive, accounting for how often interest compounds." />
                <FaqItem q="How does monthly compounding differ from annual?" a="Monthly compounding applies interest 12 times per year, so interest earns interest more frequently. On $10,000 at 5% for 10 years: annual compounding = $16,289, monthly compounding = $16,470 — a $181 difference that grows larger over longer periods." />
                <FaqItem q="Can I use this for a 401(k) or IRA projection?" a="Yes, enter your current retirement account balance as the initial savings, your monthly contribution as the regular deposit, your expected return rate (often 6–7% inflation-adjusted), and the years until retirement." />
                <FaqItem q="What is the Rule of 72?" a="Divide 72 by the annual interest rate to estimate how many years it takes to double your money. At 6%, money doubles every 12 years (72÷6=12). At 9%, it doubles every 8 years. It's a quick mental math shortcut for compound growth." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Financial Planning Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore compound interest, ROI, mortgage, and retirement calculators — all free and instant.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others plan their savings goals.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
