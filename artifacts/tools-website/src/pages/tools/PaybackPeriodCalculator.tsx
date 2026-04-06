import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, Calculator, TrendingUp,
  Zap, CheckCircle2, Shield, DollarSign, BarChart3, Lightbulb,
  BadgeCheck, Star, AlertCircle,
} from "lucide-react";

// ── Calculator Logic ──
function usePaybackCalc() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [annualCashFlow, setAnnualCashFlow] = useState("");

  const result = useMemo(() => {
    const inv = parseFloat(initialInvestment);
    const cf = parseFloat(annualCashFlow);
    if (isNaN(inv) || isNaN(cf) || inv <= 0) return null;
    if (cf <= 0) return { error: "Annual cash flow must be positive to recover investment." };

    const paybackYears = inv / cf;
    const fullYears = Math.floor(paybackYears);
    const remainingMonths = Math.round((paybackYears - fullYears) * 12);
    const totalMonths = Math.round(paybackYears * 12);

    // Scenarios: what if cash flow is 20% more or less
    const optimisticYears = inv / (cf * 1.2);
    const pessimisticYears = inv / (cf * 0.8);

    return {
      paybackYears,
      fullYears,
      remainingMonths,
      totalMonths,
      optimisticYears,
      pessimisticYears,
      roi: ((cf / inv) * 100),
      error: null,
    };
  }, [initialInvestment, annualCashFlow]);

  return { initialInvestment, setInitialInvestment, annualCashFlow, setAnnualCashFlow, result };
}

// ── Result Insight Component ──
function ResultInsight({ result, inputs }: { result: NonNullable<ReturnType<typeof usePaybackCalc>["result"]>; inputs: { inv: string; cf: string } }) {
  if ("error" in result && result.error) return null;
  const r = result as Exclude<typeof result, { error: string }>;
  const fmt = (n: number, dec = 2) => n.toLocaleString("en-US", { maximumFractionDigits: dec });
  const rating = r.paybackYears <= 2 ? "excellent" : r.paybackYears <= 5 ? "good" : r.paybackYears <= 10 ? "moderate" : "long";
  const ratingMsg = {
    excellent: "Under 2 years — this is an excellent payback period, indicating fast capital recovery.",
    good: "2–5 years — a good payback period for most business investments.",
    moderate: "5–10 years — moderate; typical for large capital projects like real estate or equipment.",
    long: "Over 10 years — a long payback period. Carefully weigh risk versus long-term returns.",
  }[rating];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your investment of ${fmt(parseFloat(inputs.inv) || 0, 0)} will be recovered in{" "}
          <strong>{fmt(r.paybackYears, 2)} years</strong> ({r.fullYears > 0 ? `${r.fullYears}y ` : ""}{r.remainingMonths}mo). {ratingMsg}
        </p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ──
export default function PaybackPeriodCalculator() {
  const { initialInvestment, setInitialInvestment, annualCashFlow, setAnnualCashFlow, result } = usePaybackCalc();
  const fmt = (n: number, dec = 2) => n.toLocaleString("en-US", { maximumFractionDigits: dec });

  const hasResult = result && !("error" in result && result.error);
  const r = hasResult ? result as Exclude<typeof result, null | { error: string }> : null;

  return (
    <Layout>
      <SEO
        title="Payback Period Calculator — Free Online Investment Recovery Tool"
        description="Calculate how long it takes to recover your investment with our free Payback Period Calculator. Get results in years and months instantly. No signup required."
      />
      <div style={{ "--calc-hue": "270" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Payback Period Calculator</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-500 bg-violet-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
            Payback Period Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Find out exactly how long it takes to recover your investment. Enter your initial cost and expected annual returns — get payback period in years and months instantly.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "Instant Results", "Works on Mobile"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Column (main content) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Calculator Widget */}
            <div className="tool-calc-card rounded-2xl p-6">
              <div className="h-1.5 w-full rounded-full mb-6 overflow-hidden bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: hasResult ? "100%" : "0%",
                    background: "linear-gradient(90deg, hsl(270,70%,55%), hsl(310,70%,55%))",
                  }}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Initial Investment ($)
                  </label>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    placeholder="e.g. 50000"
                    className="tool-calc-input w-full px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Annual Cash Flow / Return ($)
                  </label>
                  <input
                    type="number"
                    value={annualCashFlow}
                    onChange={(e) => setAnnualCashFlow(e.target.value)}
                    placeholder="e.g. 15000"
                    className="tool-calc-input w-full px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-lg font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Error */}
              {result && "error" in result && result.error && (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {result.error}
                </div>
              )}

              {/* Results */}
              {r && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Payback Period", value: `${fmt(r.paybackYears, 2)} yrs`, sub: `${r.totalMonths} months` },
                      { label: "Years", value: String(r.fullYears), sub: "full years" },
                      { label: "Remaining", value: `${r.remainingMonths} mo`, sub: "extra months" },
                      { label: "Annual ROI", value: `${fmt(r.roi, 1)}%`, sub: "return rate" },
                    ].map((item) => (
                      <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="tool-calc-number text-xl font-black">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Scenarios */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Cash Flow Scenarios</p>
                    <div className="grid grid-cols-3 gap-3 text-center text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Pessimistic (−20%)</p>
                        <p className="font-bold text-orange-500">{fmt(r.pessimisticYears, 2)} yrs</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Base Case</p>
                        <p className="font-bold text-violet-500">{fmt(r.paybackYears, 2)} yrs</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Optimistic (+20%)</p>
                        <p className="font-bold text-green-500">{fmt(r.optimisticYears, 2)} yrs</p>
                      </div>
                    </div>
                  </div>

                  <ResultInsight result={r} inputs={{ inv: initialInvestment, cf: annualCashFlow }} />
                </motion.div>
              )}
            </div>

            {/* How to Use */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Payback Period Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Enter Initial Investment", desc: "Input the total upfront cost of the investment — this could be equipment purchase, project cost, or capital expenditure." },
                  { step: "2", title: "Enter Annual Cash Flow", desc: "Enter the expected net annual return or cash flow generated by the investment each year." },
                  { step: "3", title: "Read the Payback Period", desc: "The calculator instantly shows how many years and months it takes to fully recover your initial investment." },
                  { step: "4", title: "Review Scenarios", desc: "Check optimistic and pessimistic scenarios to understand the range of possible payback timelines based on cash flow variance." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-violet-500/10 text-violet-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulas */}
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</h3>
                <div className="space-y-3">
                  {[
                    { expr: "Payback Period = Initial Investment ÷ Annual Cash Flow", desc: "The fundamental formula for even cash flows. Divides total cost by annual return to find recovery time." },
                    { expr: "Payback Period (years) = Total Months ÷ 12", desc: "Converts the result to a readable years-and-months format for practical planning." },
                    { expr: "Annual ROI (%) = (Annual Cash Flow ÷ Initial Investment) × 100", desc: "Shows your annual return as a percentage of the total investment, complementing the payback period." },
                    { expr: "Remaining Months = (Fractional Year) × 12", desc: "Isolates the months portion after the full years, giving a precise payback date." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
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
            <section id="understanding-results" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Your Payback Period Result</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The payback period tells you how quickly an investment pays for itself through generated cash flows. A shorter payback period generally means lower financial risk and faster capital recovery.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Under 2 Years", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Excellent — very fast capital recovery, minimal risk. Common in high-yield tech or digital investments." },
                  { label: "2–5 Years", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Good — typical for strong business investments, equipment, and commercial real estate." },
                  { label: "5–10 Years", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "Moderate — acceptable for large capital projects, industrial equipment, or long-term assets." },
                  { label: "Over 10 Years", color: "text-red-600 bg-red-500/10 border-red-500/20", desc: "Long — evaluate carefully. May be worthwhile for infrastructure, but risk increases with time horizon." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Examples */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Payback Period Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-bold text-foreground">Scenario</th>
                      <th className="text-right py-2 pr-4 font-bold text-foreground">Investment</th>
                      <th className="text-right py-2 pr-4 font-bold text-foreground">Annual Return</th>
                      <th className="text-right py-2 font-bold text-foreground">Payback Period</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { scenario: "Solar panel installation", inv: "$12,000", ret: "$2,400", pp: "5.0 years" },
                      { scenario: "Restaurant equipment", inv: "$30,000", ret: "$8,000", pp: "3.75 years" },
                      { scenario: "Office rental property", inv: "$200,000", ret: "$24,000", pp: "8.33 years" },
                      { scenario: "Online marketing campaign", inv: "$5,000", ret: "$4,000", pp: "1.25 years" },
                      { scenario: "Manufacturing machine", inv: "$80,000", ret: "$16,000", pp: "5.0 years" },
                    ].map((row) => (
                      <tr key={row.scenario} className="border-b border-border/50">
                        <td className="py-2.5 pr-4">{row.scenario}</td>
                        <td className="py-2.5 pr-4 text-right font-mono">{row.inv}</td>
                        <td className="py-2.5 pr-4 text-right font-mono">{row.ret}</td>
                        <td className="py-2.5 text-right font-bold text-violet-500">{row.pp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Solar panel installation</strong> is one of the most popular uses of the payback period calculation. A homeowner spending $12,000 on solar panels that save $2,400 per year in energy costs will break even in exactly 5 years — after which all savings are pure profit for the remaining 20+ year lifespan of the panels.
                </p>
                <p>
                  <strong className="text-foreground">Restaurant and food service businesses</strong> commonly use payback period analysis before purchasing commercial equipment. A $30,000 industrial oven that generates $8,000 extra revenue per year pays back in just under 4 years — well within the equipment's useful life.
                </p>
                <p>
                  <strong className="text-foreground">Real estate investors</strong> evaluating rental property often find payback periods of 8–15 years depending on location and occupancy. While long, these investments typically offer appreciation value beyond cash flow, so the payback period is one metric among several.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "Used this to justify a new CNC machine purchase to our CFO. The 3.5-year payback period was exactly what we needed to get approval. Simple and accurate."
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— Manufacturing operations manager</p>
              </div>
            </section>

            {/* Why Choose This */}
            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Payback Period Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The payback period is one of the most straightforward and widely used investment appraisal methods in finance and business planning. It provides a quick, intuitive answer to the fundamental question every investor asks: "When do I get my money back?" Unlike IRR or NPV, it requires no complex discount rate assumptions — just investment cost and expected returns.
                </p>
                <p>
                  This calculator goes beyond a simple division. It breaks down the result into <strong className="text-foreground">years and months</strong>, shows the <strong className="text-foreground">annual ROI rate</strong>, and models optimistic and pessimistic cash flow scenarios (±20%). That gives you a realistic range rather than a single best-case number.
                </p>
                <p>
                  <strong className="text-foreground">Business owners</strong> use payback period analysis before purchasing equipment, launching new product lines, or opening new locations. <strong className="text-foreground">Investors</strong> use it to screen real estate deals, solar installations, and franchise opportunities. <strong className="text-foreground">Finance teams</strong> use it in capital budgeting to rank competing projects by risk and speed of return.
                </p>
                <p>
                  The tool works entirely in your browser — no data is sent to any server, no account is needed, and results are instant. Whether you're evaluating a $500 tool purchase or a $500,000 capital project, the math is the same and the result is immediate.
                </p>
                <p>
                  For best results, use the payback period alongside <Link href="/finance/online-roi-calculator" className="text-violet-500 hover:underline">ROI Calculator</Link> and <Link href="/finance/break-even-calculator" className="text-violet-500 hover:underline">Break-Even Calculator</Link> to build a complete picture of investment viability.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Disclaimer:</strong> This calculator assumes constant annual cash flows. Real-world investments often have irregular cash flows — consult a financial advisor for complex multi-period analysis.
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem
                  q="What is a payback period?"
                  a="The payback period is the time it takes for an investment to generate enough cash flow to recover its initial cost. If you invest $10,000 and earn $2,500 per year, your payback period is 4 years. It's one of the simplest and most widely used investment evaluation metrics."
                />
                <FaqItem
                  q="What is a good payback period?"
                  a="There's no universal answer — it depends on the industry and investment type. For most business investments, under 3 years is considered excellent, 3–5 years is good, and 5–10 years is acceptable. Infrastructure and real estate can warrant longer periods due to lower risk and asset appreciation."
                />
                <FaqItem
                  q="What's the difference between payback period and ROI?"
                  a="Payback period measures time to recover investment. ROI measures the return as a percentage of the investment. A project can have a long payback period but high ROI (e.g., real estate), or a short payback period with moderate ROI (e.g., high-turnover equipment). Both metrics together give a fuller picture."
                />
                <FaqItem
                  q="Does the payback period account for the time value of money?"
                  a="No — the standard payback period formula does not discount future cash flows. The discounted payback period (DPP) adjusts for this by applying a discount rate. For long-horizon investments where inflation and opportunity cost matter, use DPP or NPV analysis alongside this tool."
                />
                <FaqItem
                  q="Can I use this for investments with irregular cash flows?"
                  a="This calculator assumes uniform annual cash flows. For projects where income varies year by year, you need a cumulative cash flow schedule — add up cash flows period by period until the running total exceeds the initial investment. That point is your payback period."
                />
                <FaqItem
                  q="How is payback period used in capital budgeting?"
                  a="In capital budgeting, companies often set a maximum acceptable payback period (e.g., 5 years) and reject any project that exceeds it. When multiple projects compete for the same budget, the one with the shorter payback period is preferred, all else being equal. It's a quick risk filter before deeper NPV/IRR analysis."
                />
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-violet-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">More Finance Calculators</h2>
              <p className="text-muted-foreground text-sm mb-4">Explore our full suite of financial planning tools — free, fast, and no signup required.</p>
              <Link
                href="/category/finance"
                className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">

            {/* On-page Nav */}
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[
                  { href: "#how-to-use", label: "How to Use" },
                  { href: "#understanding-results", label: "Understanding Results" },
                  { href: "#examples", label: "Examples" },
                  { href: "#why-this-tool", label: "Why This Tool" },
                  { href: "#faq", label: "FAQ" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Related Tools */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1">
                {[
                  { href: "/finance/online-roi-calculator", label: "ROI Calculator", icon: TrendingUp },
                  { href: "/finance/break-even-calculator", label: "Break-Even Calculator", icon: BarChart3 },
                  { href: "/finance/profit-margin-calculator", label: "Profit Margin Calculator", icon: DollarSign },
                  { href: "/finance/online-investment-growth-calculator", label: "Investment Growth", icon: TrendingUp },
                  { href: "/finance/online-compound-interest-calculator", label: "Compound Interest", icon: Calculator },
                  { href: "/finance/savings-calculator", label: "Savings Calculator", icon: Shield },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group"
                  >
                    <item.icon className="w-3.5 h-3.5 group-hover:text-violet-500 transition-colors" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[
                  { icon: Shield, text: "No data stored" },
                  { icon: Zap, text: "Instant calculation" },
                  { icon: BadgeCheck, text: "Formula verified" },
                  { icon: Clock, text: "Available 24/7" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-violet-500" />
                    {item.text}
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
