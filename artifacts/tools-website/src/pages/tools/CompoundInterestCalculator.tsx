import { useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  TrendingUp,
  ArrowRight,
  Zap,
  Smartphone,
  Shield,
  Lightbulb,
  Copy,
  Check,
  BadgeCheck,
  Lock,
  DollarSign,
  Calculator,
  PiggyBank,
  LineChart,
  CalendarClock,
  CircleDollarSign,
} from "lucide-react";

type CompoundFrequency = 1 | 2 | 4 | 12 | 365;

const COMPOUND_FREQUENCIES: Array<{ label: string; value: CompoundFrequency }> = [
  { label: "Annually", value: 1 },
  { label: "Semi-Annually", value: 2 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

const RELATED_TOOLS = [
  { title: "Simple Interest Calculator", slug: "online-simple-interest-calculator", icon: <Calculator className="w-5 h-5" />, color: 25, benefit: "Compare non-compounding growth" },
  { title: "Savings Calculator", slug: "savings-calculator", icon: <PiggyBank className="w-5 h-5" />, color: 152, benefit: "Project recurring savings goals" },
  { title: "ROI Calculator", slug: "online-roi-calculator", icon: <LineChart className="w-5 h-5" />, color: 217, benefit: "Measure return percentages quickly" },
  { title: "Inflation Calculator", slug: "online-inflation-calculator", icon: <CalendarClock className="w-5 h-5" />, color: 265, benefit: "Estimate real purchasing power" },
  { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <CircleDollarSign className="w-5 h-5" />, color: 45, benefit: "Contrast investing vs borrowing costs" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-emerald-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
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

function ResultInsight({
  principal,
  monthlyContribution,
  years,
  interestRate,
  totalInvested,
  totalInterest,
  futureValue,
}: {
  principal: number;
  monthlyContribution: number;
  years: number;
  interestRate: number;
  totalInvested: number;
  totalInterest: number;
  futureValue: number;
}) {
  const contributionShare = futureValue > 0 ? (totalInterest / futureValue) * 100 : 0;
  const monthlyMessage =
    monthlyContribution > 0
      ? `With recurring deposits of $${monthlyContribution.toLocaleString("en-US", { maximumFractionDigits: 2 })} per month, regular saving contributes heavily to your final value.`
      : "Without recurring deposits, growth depends entirely on your initial principal and compounding.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Over {years.toLocaleString("en-US", { maximumFractionDigits: 2 })} years at{" "}
          {interestRate.toLocaleString("en-US", { maximumFractionDigits: 2 })}% annual rate, you invest{" "}
          ${totalInvested.toLocaleString("en-US", { maximumFractionDigits: 2 })} and earn{" "}
          ${totalInterest.toLocaleString("en-US", { maximumFractionDigits: 2 })} in growth.
          Interest accounts for about {contributionShare.toLocaleString("en-US", { maximumFractionDigits: 2 })}% of the final
          ${futureValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}. {monthlyMessage}
          {principal <= 0 ? " Add a positive starting amount for realistic projections." : ""}
        </p>
      </div>
    </motion.div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("300");
  const [years, setYears] = useState("15");
  const [interestRate, setInterestRate] = useState("8");
  const [frequency, setFrequency] = useState<CompoundFrequency>(12);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const result = useMemo(() => {
    const principalValue = parseFloat(principal);
    const monthlyContributionValue = parseFloat(monthlyContribution);
    const yearsValue = parseFloat(years);
    const annualRatePercent = parseFloat(interestRate);

    if (
      Number.isNaN(principalValue) ||
      Number.isNaN(monthlyContributionValue) ||
      Number.isNaN(yearsValue) ||
      Number.isNaN(annualRatePercent)
    ) {
      return null;
    }

    const p = Math.max(0, principalValue);
    const pmt = Math.max(0, monthlyContributionValue);
    const t = clamp(yearsValue, 0, 100);
    const annualRate = annualRatePercent / 100;

    if (t <= 0) {
      return null;
    }

    const periods = Math.max(1, Math.round(12 * t));
    const monthlyRate = annualRate > 0 ? Math.pow(1 + annualRate / frequency, frequency / 12) - 1 : 0;

    let balance = p;
    for (let i = 0; i < periods; i += 1) {
      if (monthlyRate > 0) {
        balance *= 1 + monthlyRate;
      }
      balance += pmt;
    }

    const contributions = pmt * periods;
    const totalInvested = p + contributions;
    const totalInterest = Math.max(0, balance - totalInvested);
    const cagr =
      p > 0 && t > 0
        ? (Math.pow(Math.max(balance, 0) / p, 1 / t) - 1) * 100
        : null;

    return {
      futureValue: balance,
      principal: p,
      contributions,
      totalInvested,
      totalInterest,
      years: t,
      annualRatePercent,
      monthlyContribution: pmt,
      cagr,
      frequency,
    };
  }, [frequency, interestRate, monthlyContribution, principal, years]);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const copySummary = () => {
    if (!result) return;
    const payload = [
      `Future Value: $${fmt(result.futureValue)}`,
      `Total Invested: $${fmt(result.totalInvested)}`,
      `Total Interest: $${fmt(result.totalInterest)}`,
      `Years: ${result.years}`,
      `Annual Rate: ${result.annualRatePercent}%`,
      `Compounding: ${COMPOUND_FREQUENCIES.find((option) => option.value === result.frequency)?.label ?? "Custom"}`,
    ].join(" | ");
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Compound Interest Calculator - Future Value, Interest Earned & Monthly Contributions | US Online Tools"
        description="Free compound interest calculator with monthly contributions. Estimate future value, total invested amount, and interest earned with annual, quarterly, monthly, or daily compounding."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Online Compound Interest Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Finance &amp; Cost
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Compound Interest Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Project portfolio growth with compounding and recurring monthly deposits. Compare contribution impact against earned interest and plan realistic long-term savings targets.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Projection
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
            Category: Finance &amp; Cost · Last updated: April 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compound Growth Projection</p>
                      <p className="text-sm text-muted-foreground">Edit values to instantly compare invested capital versus earned growth.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 142 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Starting Principal ($)</label>
                        <input type="number" className="tool-calc-input w-full" value={principal} onChange={(event) => setPrincipal(event.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Monthly Contribution ($)</label>
                        <input type="number" className="tool-calc-input w-full" value={monthlyContribution} onChange={(event) => setMonthlyContribution(event.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Years to Invest</label>
                        <input type="number" className="tool-calc-input w-full" value={years} onChange={(event) => setYears(event.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Annual Interest Rate (%)</label>
                        <input type="number" step="0.01" className="tool-calc-input w-full" value={interestRate} onChange={(event) => setInterestRate(event.target.value)} />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Compounding Frequency</label>
                      <div className="flex flex-wrap gap-2">
                        {COMPOUND_FREQUENCIES.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setFrequency(option.value)}
                            className={`rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors ${
                              frequency === option.value
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-emerald-500/20"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {result ? (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Projected Future Value</p>
                          <p className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                            ${fmt(result.futureValue)}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Starting Amount</p>
                            <p className="font-bold text-foreground">${fmt(result.principal)}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Deposits Added</p>
                            <p className="font-bold text-foreground">${fmt(result.contributions)}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Invested</p>
                            <p className="font-bold text-blue-600 dark:text-blue-400">${fmt(result.totalInvested)}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase mb-1">Interest Earned</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">${fmt(result.totalInterest)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-4 rounded-xl bg-background border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Estimated CAGR</p>
                            <p className="font-bold text-foreground">
                              {result.cagr !== null ? `${result.cagr.toLocaleString("en-US", { maximumFractionDigits: 2 })}% / yr` : "--"}
                            </p>
                          </div>
                          <button
                            onClick={copySummary}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors"
                          >
                            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Summary</>}
                          </button>
                        </div>

                        <ResultInsight
                          principal={result.principal}
                          monthlyContribution={result.monthlyContribution}
                          years={result.years}
                          interestRate={result.annualRatePercent}
                          totalInvested={result.totalInvested}
                          totalInterest={result.totalInterest}
                          futureValue={result.futureValue}
                        />
                      </motion.div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Enter a valid time horizon and rate to generate your projection.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use This Compound Interest Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Compound growth improves over time because each period earns returns on both your original capital and prior gains. Use this calculator to test realistic scenarios before committing to long-term savings plans.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your principal and monthly contribution</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Principal is your starting balance. Monthly contribution models ongoing deposits and has a strong long-term impact.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set a time horizon and expected annual rate</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use conservative assumptions for planning. Long durations amplify both rate differences and contribution discipline.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Toggle compounding frequency and compare outcomes</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Higher compounding frequency usually increases final value slightly. Use it to match your product details (FD, savings, SIP, etc.).</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula Structure</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">A = P(1 + r/n)^(n*t)</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Future Value = Principal Growth + Contribution Growth</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-violet-500 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Interest Earned = Future Value - Total Invested</code>
                  </div>
                </div>
              </div>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">Use these checkpoints to evaluate your projection quality:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Interest exceeds contributions</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This usually indicates your plan has matured enough for compounding to do heavy lifting. Time-in-market becomes your strongest advantage.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Contributions dominate final value</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Common in short horizons. Increasing duration by a few years often raises interest share significantly without increasing monthly burden.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Very aggressive rates (12%+)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Treat high assumptions carefully. For planning, run optimistic, base, and conservative scenarios to avoid overestimating outcomes.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Inputs</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Result Snapshot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Starter SIP Plan</td>
                      <td className="px-4 py-3 font-mono text-foreground">$5,000 + $200/mo · 10 yrs · 8%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">~$41,100 future value</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Long Horizon Growth</td>
                      <td className="px-4 py-3 font-mono text-foreground">$10,000 + $500/mo · 20 yrs · 9%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">~$374,000 future value</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">No Monthly Contributions</td>
                      <td className="px-4 py-3 font-mono text-foreground">$25,000 + $0/mo · 15 yrs · 7%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">~$68,965 future value</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These are illustrative estimates for planning workflows. Real returns vary across market cycles, fees, taxes, and timing of deposits.
              </p>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Practical savings planning.</strong> It combines principal, monthly deposits, duration, and frequency in one place, so you can evaluate real household investment routines.</p>
                <p><strong className="text-foreground">Scenario-friendly workflow.</strong> Toggle one variable at a time and watch immediate impact, which makes rate sensitivity and contribution strategy clearer.</p>
                <p><strong className="text-foreground">Private by default.</strong> All calculations run in your browser with no account required and no personal financial data submission.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is compound interest in simple words?" a="Compound interest means you earn returns on both your original amount and the returns accumulated in earlier periods. Over time, this creates accelerating growth." />
                <FaqItem q="Why include monthly contributions?" a="Because most people invest periodically, not as one lump sum. Monthly deposits often drive a large share of final portfolio value, especially in early years." />
                <FaqItem q="Does higher compounding frequency always help?" a="Usually yes, but the difference between monthly and daily compounding is often small compared to changes in contribution amount, duration, or annual rate assumptions." />
                <FaqItem q="Does this include taxes, fees, or inflation?" a="No. This is a clean growth model. For realistic planning, reduce expected annual return for costs and inflation or run a conservative scenario." />
                <FaqItem q="Can I use this for SIP or retirement estimates?" a="Yes. It is useful for SIP-style planning and retirement projections. Always pair it with risk tolerance and asset allocation decisions." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Finance Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore free calculators for ROI, loan payments, budgeting, tax estimates, and more financial planning workflows.
                </p>
                <Link
                  href="/category/finance"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore Finance Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this projection calculator with your team or family.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />
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
