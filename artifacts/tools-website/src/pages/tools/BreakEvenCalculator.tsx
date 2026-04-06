import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, BadgeCheck, Lock, Shield, Smartphone,
  Calculator, Lightbulb, Copy, Check, Star,
  BarChart3, DollarSign, Percent, TrendingUp, Package,
} from "lucide-react";

// ── Calculator Logic ──
function useBreakEvenCalc() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("");

  const result = useMemo(() => {
    const fc = parseFloat(fixedCosts);
    const ppu = parseFloat(pricePerUnit);
    const vcpu = parseFloat(variableCostPerUnit);
    if (isNaN(fc) || isNaN(ppu) || isNaN(vcpu)) return null;
    if (fc < 0 || ppu <= 0 || vcpu < 0) return { error: "invalid" as const };
    const contributionMargin = ppu - vcpu;
    if (contributionMargin <= 0) return { error: "no-margin" as const };
    const bepUnits = fc / contributionMargin;
    const bepRevenue = bepUnits * ppu;
    const contributionMarginRatio = (contributionMargin / ppu) * 100;
    const targetProfit500 = (fc + 500) / contributionMargin;
    const targetProfit1000 = (fc + 1000) / contributionMargin;
    return {
      ok: true as const,
      bepUnits,
      bepRevenue,
      contributionMargin,
      contributionMarginRatio,
      targetProfit500,
      targetProfit1000,
      fixedCosts: fc,
      pricePerUnit: ppu,
      variableCostPerUnit: vcpu,
    };
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);

  return { fixedCosts, setFixedCosts, pricePerUnit, setPricePerUnit, variableCostPerUnit, setVariableCostPerUnit, result };
}

// ── Result Insight ──
function ResultInsight({ result }: { result: ReturnType<typeof useBreakEvenCalc>["result"] }) {
  if (!result) return null;
  if ("error" in result) {
    const msg = result.error === "no-margin"
      ? "Your selling price must be higher than the variable cost per unit to calculate a break-even point. When selling price equals variable cost, every unit sold makes zero contribution toward fixed costs — meaning you can never break even."
      : "Please enter valid positive values. Fixed costs and price per unit must be greater than zero.";
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <div className="flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">{msg}</p>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          You break even at <strong>{fmt(result.bepUnits)} units</strong> — at that sales volume,
          revenue exactly covers all fixed and variable costs. Each unit sold above {fmt(result.bepUnits)} generates{" "}
          <strong>${fmtMoney(result.contributionMargin)} in contribution</strong> toward profit.
        </p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Markup Calculator", slug: "markup-calculator", icon: <Percent className="w-5 h-5" />, color: 145, benefit: "Cost to selling price with margin" },
  { title: "Profit Margin Calculator", slug: "profit-margin-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 152, benefit: "Gross and net profit margins" },
  { title: "ROI Calculator", slug: "online-roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265, benefit: "Return on any investment" },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <DollarSign className="w-5 h-5" />, color: 30, benefit: "Final price after any discount" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 217, benefit: "Any percentage calculation" },
  { title: "Savings Calculator", slug: "savings-calculator", icon: <Package className="w-5 h-5" />, color: 185, benefit: "Savings growth over time" },
];

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const fmtMoney = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Main Component ──
export default function BreakEvenCalculator() {
  const calc = useBreakEvenCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const okResult = calc.result && "ok" in calc.result && calc.result.ok ? calc.result : null;
  const hasResult = okResult !== null;

  return (
    <Layout>
      <SEO
        title="Break Even Calculator – Find Your Break-Even Point Instantly, Free | US Online Tools"
        description="Free online break-even calculator. Enter fixed costs, price per unit, and variable cost per unit to find break-even units, revenue, and contribution margin. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Break Even Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Break Even Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find the exact sales volume where your revenue covers all costs — and every unit beyond that is pure profit. Enter fixed costs, selling price, and variable cost per unit. Instant results, no login required.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
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
            Category: Finance &amp; Cost &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── CALCULATOR WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Break-Even Analysis</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">Enter Your Cost &amp; Price Data</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                          Fixed Costs ($)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          className="tool-calc-input w-full"
                          value={calc.fixedCosts}
                          onChange={e => calc.setFixedCosts(e.target.value)}
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Rent, salaries, insurance…</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                          Price Per Unit ($)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 25"
                          className="tool-calc-input w-full"
                          value={calc.pricePerUnit}
                          onChange={e => calc.setPricePerUnit(e.target.value)}
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">What you charge per sale</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                          Variable Cost / Unit ($)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          className="tool-calc-input w-full"
                          value={calc.variableCostPerUnit}
                          onChange={e => calc.setVariableCostPerUnit(e.target.value)}
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Materials, packaging…</p>
                      </div>
                    </div>

                    {okResult && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                        <div className="tool-calc-result text-center">
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Break-Even Units</div>
                          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                            {fmt(okResult.bepUnits)}
                          </div>
                        </div>
                        <div className="tool-calc-result text-center">
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Break-Even Revenue</div>
                          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                            ${fmtMoney(okResult.bepRevenue)}
                          </div>
                        </div>
                        <div className="tool-calc-result text-center">
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Contribution Margin</div>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            ${fmtMoney(okResult.contributionMargin)}
                          </div>
                        </div>
                        <div className="tool-calc-result text-center">
                          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">CM Ratio</div>
                          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            {fmt(okResult.contributionMarginRatio)}%
                          </div>
                        </div>
                      </div>
                    )}

                    <ResultInsight result={calc.result} />

                    {okResult && (
                      <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Target Profit Scenarios</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                            <span className="text-sm font-semibold text-muted-foreground">To earn $500 profit</span>
                            <span className="font-black text-foreground">{fmt(okResult.targetProfit500)} units</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                            <span className="text-sm font-semibold text-muted-foreground">To earn $1,000 profit</span>
                            <span className="font-black text-foreground">{fmt(okResult.targetProfit1000)} units</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Break Even Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool performs a standard cost-volume-profit (CVP) break-even analysis in seconds. Whether you're launching a product, evaluating a business model, or preparing a financial plan, here's how to get the most accurate result from each field.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your total fixed costs</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Fixed costs are expenses that do not change regardless of how many units you produce or sell. Common examples include monthly rent or lease payments, annual insurance premiums, salaried employee wages, software subscriptions, loan repayments, and depreciation on equipment. Add all these together and enter the total for the period you're analyzing — typically one month or one year. If you're doing a monthly analysis, divide annual fixed costs by 12. Do not include variable costs like raw materials here — those go in the third field.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the selling price per unit</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      This is the price your customer pays for one unit of your product or service — before any discounts. If you sell at multiple price points (e.g., different SKUs or tiers), run the calculator once for each price to compare their break-even thresholds. For service businesses, define one "unit" as a standard hour of service, a single project, or a monthly subscription seat. The selling price must be strictly greater than the variable cost per unit — otherwise the contribution margin is zero or negative and a break-even point mathematically does not exist.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the variable cost per unit</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Variable costs are expenses that rise proportionally with each unit produced or sold — materials, packaging, shipping, per-transaction fees, or hourly labor directly tied to production. Calculate the average variable cost for one unit by dividing total variable costs by units produced in a recent period. For pure digital products (e.g., downloadable software), variable cost per unit may be close to zero — the break-even point will then be determined almost entirely by fixed costs and price. If your variable costs vary significantly by batch size, use the average cost across a typical production run.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read all four output metrics</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The calculator returns four values: <strong className="text-foreground">break-even units</strong> (how many you must sell), <strong className="text-foreground">break-even revenue</strong> (the dollar equivalent), <strong className="text-foreground">contribution margin per unit</strong> (profit contribution from each unit above fixed costs), and <strong className="text-foreground">contribution margin ratio</strong> (the percentage of each dollar of revenue that contributes to covering fixed costs). Use the target profit scenarios to plan beyond break-even — for example, how many units you need to generate $1,000 in net profit.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Contribution Margin = Selling Price − Variable Cost per Unit</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Break-Even Units = Fixed Costs ÷ Contribution Margin</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Break-Even Revenue = Break-Even Units × Selling Price</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">4</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Units for Target Profit = (Fixed Costs + Target Profit) ÷ Contribution Margin</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Formula 1 — Contribution Margin:</strong> This is the engine of break-even analysis. Every unit sold at your price contributes this dollar amount toward covering fixed costs. Once accumulated contributions equal total fixed costs, you've broken even. After that, each unit contributes directly to profit. A higher contribution margin means you reach break-even faster and profit faster beyond it.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 2 — Break-Even Units:</strong> Divide total fixed costs by the contribution margin per unit. The result is a count — how many units must be sold before revenue equals total cost. If the result is a decimal (e.g., 334.7), you round up to 335 because you can't sell a fraction of a physical unit. For service businesses where partial "units" are billable, you may use the exact decimal.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 4 — Target Profit Units:</strong> This extends break-even analysis into profit planning. By replacing Fixed Costs with (Fixed Costs + Desired Profit), you calculate how many units generate a specific profit level. This is invaluable for setting sales targets and evaluating whether a business model can achieve its profit goals at realistic volumes.
                  </p>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your Break-Even Results</h2>
              <p className="text-muted-foreground text-sm mb-6">What each metric means and how to act on it:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Break-Even Units — Your minimum viable sales target</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This number tells you the absolute minimum you must sell to avoid a loss for the period. It's your baseline survival target. If your realistic sales forecast falls short of this number, you're looking at a guaranteed loss — and no amount of operational efficiency on the variable side will fix it unless you either increase price, reduce fixed costs, or reduce variable costs to widen the contribution margin. Treat the break-even unit count as a non-negotiable threshold when writing a business plan or preparing a pitch deck. Investors and lenders use this metric to assess whether a business model is viable at achievable volumes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Break-Even Revenue — Cash flow planning benchmark</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is the dollar amount of revenue at which you neither make nor lose money. Compare this against your historical revenue data or projected revenue to gauge how far above or below break-even your business typically operates. The gap between your projected revenue and break-even revenue is called the "margin of safety" — the larger this gap, the more resilient your business is to sales downturns. A margin of safety of 20% or more is generally considered healthy; below 10% means you're highly exposed to even small revenue dips. Use this figure for cash flow projections and investor reporting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Contribution Margin per Unit — Profit engine per sale</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The contribution margin shows how much each sale directly contributes to paying off fixed costs and then generating profit. A higher contribution margin per unit means you need fewer sales to break even and earn more from each additional unit sold beyond break-even. If your contribution margin feels uncomfortably low — for example, $2 on a $20 product — consider whether you can raise prices, negotiate lower material costs, or streamline production. Small increases in the contribution margin have a compounding effect: raising it from $2 to $3 (50% improvement) reduces the break-even unit count by 33%.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Contribution Margin Ratio — Efficiency across price points</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The CM ratio expresses contribution margin as a percentage of selling price. A 60% CM ratio means 60 cents of every dollar in revenue contributes to fixed cost coverage and profit. This metric is especially useful when comparing products with different price points — a lower-priced product may still have a higher CM ratio and be more profitable per dollar of revenue than a higher-priced one. Industry benchmarks vary widely: software products often achieve 70–90% CM ratios, while manufacturing typically runs 30–50%, and grocery retail as low as 15–25%. Use CM ratio to benchmark against your industry and identify pricing or cost inefficiencies.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Fixed Costs</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Price/Unit</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Variable/Unit</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Break-Even</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Food truck (monthly)</td>
                      <td className="px-4 py-3 font-mono text-foreground">$3,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">$12</td>
                      <td className="px-4 py-3 font-mono text-foreground">$4</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">375 meals</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">SaaS product (monthly)</td>
                      <td className="px-4 py-3 font-mono text-foreground">$8,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">$49</td>
                      <td className="px-4 py-3 font-mono text-foreground">$2</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">171 users</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Handmade candles (yearly)</td>
                      <td className="px-4 py-3 font-mono text-foreground">$6,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">$18</td>
                      <td className="px-4 py-3 font-mono text-foreground">$7</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">546 candles</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Freelance consulting</td>
                      <td className="px-4 py-3 font-mono text-foreground">$2,500</td>
                      <td className="px-4 py-3 font-mono text-foreground">$150</td>
                      <td className="px-4 py-3 font-mono text-foreground">$10</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">18 hours</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">E-commerce (monthly)</td>
                      <td className="px-4 py-3 font-mono text-foreground">$1,500</td>
                      <td className="px-4 py-3 font-mono text-foreground">$35</td>
                      <td className="px-4 py-3 font-mono text-foreground">$14</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">72 orders</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Food truck:</strong> A mobile food truck operator pays $3,000 per month in fixed costs (permit, commissary rental, insurance, truck payment). Each meal sells for $12 and costs $4 in ingredients and packaging — a contribution margin of $8. Dividing $3,000 by $8 gives a break-even of 375 meals per month, or about 12 to 13 meals per operating day across 30 days. This threshold helps the operator decide whether a particular location or route generates sufficient daily traffic to justify operating costs.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – SaaS product:</strong> A software founder spends $8,000 per month on hosting, customer support, and developer time (fixed). The product is sold at $49/month per user with a variable cost of $2 per user (payment processing, email). The $47 contribution margin divided into $8,000 fixed costs gives 171 users for break-even — a specific, actionable subscriber target. Knowing this number allows the founder to evaluate whether their current user growth rate will reach break-even within a reasonable runway.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Freelance consulting:</strong> A freelance consultant pays $2,500/month in fixed costs (software tools, home office, professional development). At $150/hour with $10 in variable costs (transaction fees), the contribution margin is $140. Break-even is just 18 billable hours per month — roughly one day per week. This low break-even point illustrates why high-margin service businesses are attractive: fixed costs are covered quickly, and most hours beyond 18 generate near-pure profit.
                </p>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Used this to prepare my business plan. Seeing the break-even number gave me a concrete sales target to present to investors — much more convincing than a spreadsheet full of formulas."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2026</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Break Even Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">All four key CVP metrics in one view.</strong> Most break-even calculators return only units or only revenue — leaving you to calculate the contribution margin and CM ratio manually. This tool shows all four output metrics simultaneously: break-even units, break-even revenue, contribution margin per unit, and contribution margin ratio. You also get two immediate profit target scenarios ($500 and $1,000) to help you plan beyond break-even. All values update in real time as you type.
                </p>
                <p>
                  <strong className="text-foreground">No registration, no ads, no limits.</strong> Many business calculation tools online require account creation, show intrusive advertisements, or lock advanced features behind paywalls. This calculator is entirely free with no limitations, no account required, and no data transmitted to any server. Your financial figures are processed exclusively in your browser and never stored or shared.
                </p>
                <p>
                  <strong className="text-foreground">Designed for real business scenarios.</strong> The field labels include practical examples of what belongs in each input — fixed costs (rent, salaries, insurance), selling price (per unit), and variable costs (materials, packaging, shipping). This reduces the most common mistake in break-even analysis: incorrectly categorizing costs, which can dramatically distort the result. If you're not sure whether a cost is fixed or variable, ask: does this cost change if I produce zero units? If yes, it's variable. If no, it's fixed.
                </p>
                <p>
                  <strong className="text-foreground">Handles edge cases gracefully.</strong> The calculator catches and explains two common error states: entering a zero or negative value for selling price, and entering a variable cost that equals or exceeds the selling price (resulting in zero or negative contribution margin). Both produce a clear, plain-English explanation rather than a confusing NaN or infinity output, helping you diagnose and correct the issue immediately.
                </p>
                <p>
                  <strong className="text-foreground">Part of a 400+ tool ecosystem.</strong> This break-even calculator is part of a broader suite of free financial tools including profit margin calculator, ROI calculator, markup calculator, compound interest calculator, and more. All tools share the same design language and mobile-responsive layout — once you've used one, the others feel immediately familiar.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Break-even analysis assumes a constant selling price and variable cost per unit, which is a simplification. In practice, costs may vary by production volume (economies of scale), and prices may change across customer segments (discounts, tiered pricing). This calculator is designed for single-product, single-price-point scenarios. For multi-product break-even analysis or sensitivity modeling, you may wish to use a spreadsheet tool or financial modeling software. Results are for planning purposes only and should not substitute professional financial or accounting advice.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is a break-even point?"
                  a="The break-even point is the sales volume at which total revenue equals total costs — producing neither profit nor loss. It is the minimum threshold a business must reach to avoid a financial loss in a given period. Below break-even, every unit sold generates a loss; above break-even, every unit sold generates profit. It is calculated by dividing total fixed costs by the contribution margin (selling price minus variable cost per unit)."
                />
                <FaqItem
                  q="What is the difference between fixed costs and variable costs?"
                  a="Fixed costs remain constant regardless of production volume — examples include rent, salaries, insurance, and equipment lease payments. Variable costs change proportionally with each unit produced or sold — examples include raw materials, packaging, shipping, and transaction fees. The distinction is critical for break-even analysis: misclassifying costs will make your break-even point inaccurate. When in doubt, ask: 'If I produced zero units this month, would I still pay this cost?' If yes, it's fixed."
                />
                <FaqItem
                  q="What is contribution margin and why does it matter?"
                  a="Contribution margin is the amount each unit sold contributes toward covering fixed costs and then generating profit. It equals selling price minus variable cost per unit. A high contribution margin means you reach break-even faster and retain more from each sale above that threshold. It's one of the most important metrics in business model evaluation — a business with a $1 contribution margin needs to sell vastly more units than one with a $50 contribution margin to cover the same fixed costs."
                />
                <FaqItem
                  q="How do I calculate break-even for a service business?"
                  a="For service businesses, define one 'unit' as a standard billable hour, a single project, or a monthly subscription seat. Then estimate the variable cost of delivering one unit (time, tools, transaction fees), your fixed monthly overhead, and your price. For hourly services, if your billable rate is $100 and your direct variable cost per hour is $5, your contribution margin is $95. If your fixed costs are $2,850/month, you break even at 30 billable hours — a very concrete and actionable target."
                />
                <FaqItem
                  q="What happens if variable costs are higher than selling price?"
                  a="If variable costs equal or exceed the selling price, the contribution margin is zero or negative — meaning every unit you sell either covers zero fixed costs or actively increases your loss. There is no mathematical break-even point in this scenario. You must either raise your selling price, reduce variable costs, or fundamentally rethink the business model. This situation is sometimes called 'selling below cost' and can occur when pricing is set too aggressively in a competitive market without accounting for all per-unit costs."
                />
                <FaqItem
                  q="Can I use this for a new product launch?"
                  a="Yes — break-even analysis is one of the most valuable tools in new product planning. Before launching, estimate your monthly fixed costs (development amortization, marketing, overheads), projected selling price, and expected variable cost per unit. The resulting break-even unit count gives you a target to include in your go-to-market plan and validate against your sales channel capacity. If the break-even requires more units than your market realistically supports, you'll know to adjust pricing, reduce costs, or reconsider the launch before investing further."
                />
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Finance &amp; Business Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">Try our profit margin calculator, ROI calculator, markup calculator, and 400+ more free business and finance tools.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</p>
                        <p className="text-xs text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others find their break-even point.</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Understanding Results",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
