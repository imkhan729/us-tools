import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  DollarSign, Percent, BarChart3, Briefcase, Building2, ShoppingBag,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type CalcMode = "margin" | "markup" | "revenue";

function useProfitCalc() {
  const [mode, setMode] = useState<CalcMode>("margin");
  const [cost, setCost] = useState("");
  const [revenue, setRevenue] = useState("");
  const [marginPct, setMarginPct] = useState("");

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const r = parseFloat(revenue);
    const m = parseFloat(marginPct);

    if (mode === "margin" && !isNaN(c) && !isNaN(r) && r > 0) {
      const profit = r - c;
      const grossMargin = (profit / r) * 100;
      const markup = (profit / c) * 100;
      return { profit, grossMargin, markup, revenue: r, cost: c };
    }
    if (mode === "markup" && !isNaN(c) && !isNaN(m)) {
      const price = c * (1 + m / 100);
      const profit = price - c;
      const grossMargin = (profit / price) * 100;
      return { profit, grossMargin, markup: m, revenue: price, cost: c };
    }
    if (mode === "revenue" && !isNaN(r) && !isNaN(m)) {
      const profit = r * (m / 100);
      const c2 = r - profit;
      return { profit, grossMargin: m, markup: (profit / c2) * 100, revenue: r, cost: c2 };
    }
    return null;
  }, [mode, cost, revenue, marginPct]);

  return { mode, setMode, cost, setCost, revenue, setRevenue, marginPct, setMarginPct, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useProfitCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const health = result.grossMargin >= 40 ? "healthy" : result.grossMargin >= 20 ? "moderate" : "low";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Revenue {fmt(result.revenue)} − Cost {fmt(result.cost)} = <strong>Profit {fmt(result.profit)}</strong>.
          Gross margin of <strong>{result.grossMargin.toFixed(2)}%</strong> is considered <strong>{health}</strong> for most industries.
          Markup over cost is <strong>{result.markup.toFixed(2)}%</strong>.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-green-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-green-500"><ChevronDown className="w-5 h-5" /></motion.span>
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
  { title: "ROI Calculator", slug: "roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265, benefit: "Measure return on any investment" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 45, benefit: "Find any percentage instantly" },
  { title: "Salary Calculator", slug: "salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 152, benefit: "Convert hourly to annual salary" },
  { title: "Tax Calculator", slug: "tax-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 340, benefit: "Estimate your tax liability" },
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <Building2 className="w-5 h-5" />, color: 217, benefit: "See how interest compounds over time" },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <ShoppingBag className="w-5 h-5" />, color: 25, benefit: "See final price after any % off" },
];

export default function ProfitMarginCalculator() {
  const calc = useProfitCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt2 = (n: number | undefined) => n === undefined ? "--" : n.toFixed(2);
  const fmtDollar = (n: number | undefined) => n === undefined ? "--" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Profit Margin Calculator - Gross Margin, Markup & Revenue | Free Business Tool"
        description="Free profit margin calculator. Calculate gross profit margin, markup percentage, and revenue from cost. Essential for pricing products and analyzing business profitability."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Profit Margin Calculator", "url": "https://usonlinetools.com/finance/profit-margin-calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "What is a good profit margin?", "acceptedAnswer": { "@type": "Answer", "text": "A good gross profit margin varies by industry. Retail averages 20–35%, software 60–80%, restaurants 3–9%. Net profit margin of 10%+ is generally considered healthy." } }] }
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">Profit Margin Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BarChart3 className="w-3.5 h-3.5" /> Business Finance
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Profit Margin Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate gross profit margin, markup percentage, and selling price from cost. Works in three modes: margin from revenue, markup from cost, or revenue from desired margin — free, instant, no signup.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-full border border-green-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Clock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Finance &amp; Cost &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 142 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Profit Margin Calculator</h3>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Calculation Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "margin", label: "From Revenue" },
                      { value: "markup", label: "From Markup" },
                      { value: "revenue", label: "From Margin %" },
                    ] as { value: CalcMode; label: string }[]).map(m => (
                      <button key={m.value} onClick={() => calc.setMode(m.value)} className={`py-2.5 rounded-xl border font-bold text-sm transition-all ${calc.mode === m.value ? "bg-green-500 text-white border-green-500" : "border-border hover:border-green-500/40 text-muted-foreground"}`}>{m.label}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {calc.mode !== "revenue" && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Cost / COGS ($)</label>
                      <input type="number" placeholder="50.00" className="tool-calc-input w-full" value={calc.cost} onChange={e => calc.setCost(e.target.value)} step="0.01" />
                    </div>
                  )}
                  {calc.mode === "margin" && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Revenue / Selling Price ($)</label>
                      <input type="number" placeholder="100.00" className="tool-calc-input w-full" value={calc.revenue} onChange={e => calc.setRevenue(e.target.value)} step="0.01" />
                    </div>
                  )}
                  {calc.mode === "markup" && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Markup (%)</label>
                      <input type="number" placeholder="100" className="tool-calc-input w-full" value={calc.marginPct} onChange={e => calc.setMarginPct(e.target.value)} step="0.1" />
                    </div>
                  )}
                  {calc.mode === "revenue" && (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Revenue / Selling Price ($)</label>
                        <input type="number" placeholder="100.00" className="tool-calc-input w-full" value={calc.revenue} onChange={e => calc.setRevenue(e.target.value)} step="0.01" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Desired Profit Margin (%)</label>
                        <input type="number" placeholder="40" className="tool-calc-input w-full" value={calc.marginPct} onChange={e => calc.setMarginPct(e.target.value)} step="0.1" />
                      </div>
                    </>
                  )}
                </div>

                {calc.result && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Gross Profit", value: fmtDollar(calc.result.profit), color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Profit Margin", value: fmt2(calc.result.grossMargin) + "%", color: "text-green-600 dark:text-green-400" },
                      { label: "Markup", value: fmt2(calc.result.markup) + "%", color: "text-blue-600 dark:text-blue-400" },
                      { label: calc.mode === "margin" ? "Revenue" : "Selling Price", value: fmtDollar(calc.result.revenue), color: "text-amber-600 dark:text-amber-400" },
                    ].map((item, i) => (
                      <div key={i} className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{item.label}</div>
                        <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* INDUSTRY BENCHMARKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Industry Profit Margin Benchmarks</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold text-foreground">Industry</th>
                      <th className="text-left p-3 font-bold text-foreground">Gross Margin</th>
                      <th className="text-left p-3 font-bold text-foreground">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { industry: "Software / SaaS", gross: "65–80%", net: "10–25%" },
                      { industry: "E-commerce / Retail", gross: "20–45%", net: "2–5%" },
                      { industry: "Restaurants", gross: "60–70%", net: "3–9%" },
                      { industry: "Healthcare", gross: "20–40%", net: "4–8%" },
                      { industry: "Manufacturing", gross: "25–35%", net: "5–10%" },
                      { industry: "Consulting", gross: "50–70%", net: "15–30%" },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 font-medium text-foreground">{row.industry}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{row.gross}</td>
                        <td className="p-3 font-mono text-blue-600 dark:text-blue-400">{row.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "green", title: "Gross Profit Margin from Revenue", desc: "Enter cost and selling price. The calculator computes profit = revenue − cost, then gross margin % = profit / revenue × 100." },
                  { color: "blue", title: "Selling Price from Markup", desc: "Enter your cost and desired markup %. Selling price = cost × (1 + markup/100). Useful for pricing products when you know your COGS." },
                  { color: "amber", title: "Implied Cost from Desired Margin", desc: "Enter revenue and target margin %. The calculator finds the maximum allowable cost to achieve that margin: cost = revenue × (1 − margin/100)." },
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
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15">
                  <div className="flex items-center gap-2 mb-2"><ShoppingBag className="w-4 h-4 text-green-500" /><h4 className="font-bold text-foreground text-sm">Retail Product Pricing</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">T-shirt costs $12 to make, sells for $30. Gross margin = <strong className="text-foreground">60%</strong>, markup = <strong className="text-foreground">150%</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Freelance Project</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Project billed at $5,000, costs (time + tools) = $1,500. Margin = <strong className="text-foreground">70%</strong>. Well above the consulting benchmark.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><Building2 className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">SaaS Subscription</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$99/mo plan, $18 server + support cost. Margin = <strong className="text-foreground">81.8%</strong>. Typical for high-margin software businesses.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">Target Pricing</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Want 40% margin on a $200 product? Max allowable cost = $200 × (1−0.40) = <strong className="text-foreground">$120</strong>. Use mode 3 to reverse-engineer your cost budget.</p>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <BarChart3 className="w-4 h-4" />, text: "Three calculation modes for flexibility" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Industry benchmarks included" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data stored — private calculations" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Use while negotiating prices on mobile" },
                  { icon: <Clock className="w-4 h-4" />, text: "Instant results as you type" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Shows both margin % and markup %" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-green-500">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Profit Margin vs. Markup: Know the Difference</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Many business owners confuse <strong className="text-foreground">profit margin</strong> and <strong className="text-foreground">markup</strong>. Profit margin is the percentage of revenue that is profit. Markup is the percentage added to cost to arrive at the selling price. The same transaction produces different percentages depending on which you calculate.</p>
                <p>Example: Cost = $50, Price = $100. Margin = (50/100) × 100 = <strong className="text-foreground">50%</strong>. Markup = (50/50) × 100 = <strong className="text-foreground">100%</strong>. This is why retailers and suppliers sometimes seem to be using different numbers for the same deal — they may be using different bases.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Gross Margin vs. Net Margin</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Gross margin = (Revenue − COGS) / Revenue — only accounts for direct production costs",
                    "Net margin = Net profit / Revenue — accounts for all expenses including overhead, taxes",
                    "A high gross margin but low net margin signals high operating expenses",
                    "SaaS companies often have 70–80% gross margins but lower net margins due to R&D and sales costs",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
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
                <FaqItem q="What is a good profit margin for a small business?" a="It depends on the industry. Retail averages 2–5% net margin, restaurants 3–9%, services 15–30%. For gross margin, 20%+ is generally sustainable for most businesses. Higher margins give more room to cover operating expenses." />
                <FaqItem q="What is the difference between profit margin and markup?" a="Profit margin = profit divided by revenue. Markup = profit divided by cost. The same profit produces a lower margin % and higher markup %. A 100% markup equals a 50% margin. Knowing which one you're using is critical for accurate pricing." />
                <FaqItem q="How do I calculate gross profit margin?" a="Gross Profit Margin = (Revenue − Cost of Goods Sold) / Revenue × 100. For example, if you sell a product for $100 and it costs $60 to produce, your gross margin is (100−60)/100 = 40%." />
                <FaqItem q="What's the formula to find selling price from cost and desired margin?" a="Selling Price = Cost / (1 − Desired Margin). For a 40% margin on a product costing $30: Selling Price = $30 / (1 − 0.40) = $30 / 0.60 = $50. Use Mode 3 in the calculator above." />
                <FaqItem q="How do restaurants calculate food cost percentage?" a="Food cost % = (Cost of Ingredients / Menu Price) × 100. Most restaurants target 28–35% food cost, which is a 65–72% gross margin. Labor and overhead determine net profit from there." />
                <FaqItem q="Why is my markup percentage higher than my margin percentage?" a="Because they use different denominators. Markup divides profit by cost (smaller number), while margin divides profit by revenue (larger number). This always makes markup % higher than margin % for the same transaction." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Business Finance Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">ROI, savings, salary, discount, and 400+ more business calculators — all free, all instant.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
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
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help business owners calculate profit margins.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-green-500/40 flex-shrink-0" />{label}
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
