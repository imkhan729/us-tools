import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  DollarSign, Percent, BarChart3, Wallet, TrendingDown, Globe2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

function useInflationCalc() {
  const [amount, setAmount] = useState("");
  const [fromYear, setFromYear] = useState("2000");
  const [toYear, setToYear] = useState("2024");
  const [rate, setRate] = useState("3");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const fy = parseInt(fromYear);
    const ty = parseInt(toYear);
    const r = parseFloat(rate);
    if (isNaN(a) || a <= 0 || isNaN(r) || r < 0 || isNaN(fy) || isNaN(ty) || fy === ty) return null;
    const years = ty - fy;
    const adjustedAmount = a * Math.pow(1 + r / 100, years);
    const purchasingPowerLost = adjustedAmount - a;
    const purchasingPowerPct = ((adjustedAmount - a) / a) * 100;
    const realValue = a / Math.pow(1 + r / 100, Math.abs(years));
    return { adjustedAmount, purchasingPowerLost, purchasingPowerPct, realValue, years: Math.abs(years), direction: years > 0 ? "future" : "past" as const, originalAmount: a, rate: r };
  }, [amount, fromYear, toYear, rate]);

  return { amount, setAmount, fromYear, setFromYear, toYear, setToYear, rate, setRate, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useInflationCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          {fmt(result.originalAmount)} in {result.direction === "future" ? "the earlier year" : "the later year"} has the same purchasing power as <strong>{fmt(result.adjustedAmount)}</strong> {result.direction === "future" ? "today" : "in the earlier year"} after {result.years} years at {result.rate}% annual inflation.
          That's a <strong>{result.purchasingPowerPct.toFixed(1)}%</strong> change in purchasing power.
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
  { title: "Savings Calculator", slug: "savings-calculator", icon: <Wallet className="w-5 h-5" />, color: 152 },
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 217 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 265 },
  { title: "Salary Calculator", slug: "salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 45 },
  { title: "Tax Calculator", slug: "tax-calculator", icon: <Percent className="w-5 h-5" />, color: 340 },
  { title: "Mortgage Payment Calculator", slug: "mortgage-payment-calculator", icon: <Globe2 className="w-5 h-5" />, color: 25 },
];

// Historical US CPI inflation rates
const HISTORICAL_RATES = [
  { decade: "1970s", avg: "7.4%", note: "High inflation decade (oil crisis)" },
  { decade: "1980s", avg: "5.1%", note: "Declining from early 80s peak (14%)" },
  { decade: "1990s", avg: "2.9%", note: "Stable growth era" },
  { decade: "2000s", avg: "2.6%", note: "Low and stable" },
  { decade: "2010s", avg: "1.8%", note: "Post-financial crisis low inflation" },
  { decade: "2020s", avg: "~4.9%", note: "COVID-era surge to 9.1% in 2022" },
];

export default function InflationCalculator() {
  const calc = useInflationCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number | undefined) => n === undefined ? "--" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (1900 + i).toString()).reverse();

  return (
    <Layout>
      <SEO
        title="Inflation Calculator - Calculate Purchasing Power & Cost of Living | Free Tool"
        description="Free inflation calculator. See how inflation erodes purchasing power over time. Calculate the real value of money from any year using custom or historical inflation rates."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Inflation Calculator", "url": "https://usonlinetools.com/finance/inflation-calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "How does inflation affect purchasing power?", "acceptedAnswer": { "@type": "Answer", "text": "Inflation reduces purchasing power over time. At 3% annual inflation, $100 today will only buy what $74 buys in 10 years. The formula is: Adjusted Amount = Original × (1 + rate)^years." } }] }
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Inflation Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <TrendingDown className="w-3.5 h-3.5" />
                Economics & Finance
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Inflation Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate the impact of inflation on purchasing power over any time period. See how much a dollar from the past is worth today, or project future purchasing power. Use historical average rates or enter a custom inflation rate.
              </p>
            </section>

            {/* QUICK ANSWER */}
            <section className="p-5 rounded-xl bg-red-500/5 border-2 border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-red-500" />
                <h2 className="font-black text-foreground text-base">Inflation Impact: Quick Facts</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {[
                  { label: "$1,000 in 2000", value: "≈ $1,804 in 2024", note: "At 2.5% avg. inflation" },
                  { label: "3% inflation", value: "Halves value in 24 years", note: "Rule of 72: 72/3 = 24 yrs" },
                  { label: "2024 US CPI", value: "~3.1% annual rate", note: "Coming down from 9.1% peak" },
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                    <div className="font-black text-foreground text-sm">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.note}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Instant purchasing power calculation</p>
                <p className="text-muted-foreground text-sm">Enter an amount, two years, and an inflation rate — see the adjusted value instantly. Use 3% for the US historical average.</p>
              </div>
            </section>

            {/* TOOL */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 0 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Inflation / Purchasing Power Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Amount ($)</label>
                    <input type="number" placeholder="1000" className="tool-calc-input w-full" value={calc.amount} onChange={e => calc.setAmount(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Annual Inflation Rate (%)</label>
                    <input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.rate} onChange={e => calc.setRate(e.target.value)} step="0.1" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">From Year</label>
                    <select className="tool-calc-input w-full" value={calc.fromYear} onChange={e => calc.setFromYear(e.target.value)}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">To Year</label>
                    <select className="tool-calc-input w-full" value={calc.toYear} onChange={e => calc.setToYear(e.target.value)}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  {/* Quick rate presets */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-muted-foreground mb-2 block">Quick Rate Presets</label>
                    <div className="flex flex-wrap gap-2">
                      {[{ label: "US Avg (3%)", rate: "3" }, { label: "Fed Target (2%)", rate: "2" }, { label: "2022 Peak (8%)", rate: "8" }, { label: "Low (1%)", rate: "1" }].map(preset => (
                        <button key={preset.rate} onClick={() => calc.setRate(preset.rate)} className={`px-3 py-1.5 rounded-lg border font-semibold text-xs transition-all ${calc.rate === preset.rate ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{preset.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {calc.result && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    <div className="tool-calc-result text-center col-span-2">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Inflation-Adjusted Value</div>
                      <div className="text-3xl font-black text-red-600 dark:text-red-400">{fmt(calc.result.adjustedAmount)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Purchasing Power Change</div>
                      <div className="text-lg font-black text-orange-600 dark:text-orange-400">+{calc.result.purchasingPowerPct.toFixed(1)}%</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Change ($)</div>
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400">{fmt(calc.result.purchasingPowerLost)}</div>
                    </div>
                  </div>
                )}
                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* HISTORICAL RATES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">US Inflation by Decade</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold text-foreground">Decade</th>
                      <th className="text-left p-3 font-bold text-foreground">Avg. Annual Rate</th>
                      <th className="text-left p-3 font-bold text-foreground">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HISTORICAL_RATES.map((row, i) => (
                      <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 font-bold text-foreground">{row.decade}</td>
                        <td className="p-3 font-mono font-bold text-red-600 dark:text-red-400">{row.avg}</td>
                        <td className="p-3 text-muted-foreground text-xs">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Inflation Is Calculated</h2>
              <div className="space-y-5">
                {[
                  { color: "red", title: "Compound Growth Formula", desc: "Inflation compounds like interest: Adjusted Amount = Original × (1 + rate/100)^years. At 3% for 10 years, $1,000 becomes $1,344." },
                  { color: "amber", title: "Purchasing Power Loss", desc: "If $1,000 becomes $1,344 after 10 years of 3% inflation, that means today's $1,000 only buys what $744 would have bought 10 years ago." },
                  { color: "blue", title: "Real vs. Nominal Values", desc: "Nominal value = face value in dollar terms. Real value = inflation-adjusted purchasing power. Economists use real values for meaningful comparisons across time." },
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Inflation Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-red-500" /><h4 className="font-bold text-foreground text-sm">Salary Stagnation</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A $50,000 salary from 2015 with 3% inflation would need to be <strong className="text-foreground">$67,196</strong> in 2024 just to maintain the same purchasing power.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Cash Under the Mattress</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$10,000 kept as cash from 2000 to 2024 at 2.5% inflation lost <strong className="text-foreground">$7,970</strong> in real value — worth only about $5,770 in real terms.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Wallet className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Retirement Planning</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A $1M retirement target in 30 years at 3% inflation means you actually need <strong className="text-foreground">$2.43M</strong> to maintain today's lifestyle.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><Globe2 className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">Historical Comparison</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A movie ticket that cost $0.25 in 1950 would cost about <strong className="text-foreground">$3.20</strong> in 2024 adjusting for inflation — yet actual movie ticket prices are now $15–20.</p>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <TrendingDown className="w-4 h-4" />, text: "Visualize inflation's impact on savings" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Quick rate presets (US avg, Fed target)" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collected — runs in browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on mobile for on-the-go estimates" },
                  { icon: <Clock className="w-4 h-4" />, text: "Any year range from 1900 to present" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Historical US inflation table included" },
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Inflation and Purchasing Power</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Inflation is the rate at which the general price level of goods and services rises, eroding the purchasing power of money. Even modest 2–3% annual inflation compounds significantly over decades — this is why financial planners factor inflation into every long-term projection.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">How the Fed Measures Inflation</h3>
                <p>The US Federal Reserve uses the <strong className="text-foreground">Consumer Price Index (CPI)</strong> and Personal Consumption Expenditures (PCE) to measure inflation. The Fed's target is 2% annual inflation — enough to prevent deflation, not so much that savings erode rapidly. During 2021–2022, inflation spiked to 40-year highs of 7–9%, driven by supply chain disruptions and fiscal stimulus.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">How to Beat Inflation</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Invest in assets that historically outpace inflation (stocks, real estate, TIPS)",
                    "Keep emergency fund in high-yield savings accounts (4–5% APY in 2024)",
                    "Maximize contributions to inflation-protected retirement accounts (I-bonds, 401k)",
                    "Negotiate salary increases that match or exceed CPI each year",
                    "Avoid holding large amounts of cash long-term — it loses real value",
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
                <FaqItem q="What is the average US inflation rate?" a="The US long-term average inflation rate is approximately 3% per year. The Federal Reserve targets 2%. During 2021–2022 it surged to 7–9% (highest since the 1980s). For long-term financial planning, 2.5–3% is a reasonable estimate." />
                <FaqItem q="How does inflation reduce purchasing power?" a="If inflation is 3% per year, the same basket of goods costs 3% more each year. Over 10 years, prices roughly rise 34% (compounded). This means $1,000 today only buys what $742 bought 10 years ago." />
                <FaqItem q="What is the Rule of 72 for inflation?" a="Divide 72 by the inflation rate to find how many years it takes for prices to double (or purchasing power to halve). At 3% inflation: 72/3 = 24 years. At 6% inflation: 72/6 = 12 years." />
                <FaqItem q="Are stocks a good hedge against inflation?" a="Historically yes — the S&P 500 has returned ~10% annually on average, well above the 3% long-term inflation rate. However, stocks have short-term volatility. During high inflation periods (1970s), commodities and real estate often outperformed." />
                <FaqItem q="What are TIPS and I-bonds?" a="Treasury Inflation-Protected Securities (TIPS) and Series I savings bonds are US government bonds designed to track inflation. Their principal or interest adjusts with CPI, protecting the real value of your investment. I-bonds were particularly popular when their rate hit 9.62% in 2022." />
                <FaqItem q="How do I adjust historical salary for inflation?" a="Use this calculator: enter the old salary as the amount, the year you want to convert from, and today's year with the average inflation rate for that period. The result shows what that salary is worth in today's dollars." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Finance Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore savings calculators, compound interest, tax tools, and 400+ more — all free, instant.</p>
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
                <p className="text-sm text-muted-foreground mb-4">Help others understand inflation's impact.</p>
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
