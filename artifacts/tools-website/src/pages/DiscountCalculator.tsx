import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Tag, DollarSign, ReceiptText, TrendingUp,
  Percent, Calculator, ArrowRight, Zap, CheckCircle2, Smartphone, Shield,
  BadgeCheck, Lock, Copy, Check, Lightbulb, Star
} from "lucide-react";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
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

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Tip Calculator", slug: "tip-calculator", icon: <ReceiptText className="w-4 h-4" />, color: 152, benefit: "Split bills and tip perfectly" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-4 h-4" />, color: 217, benefit: "Calculate any percentage instantly" },
  { title: "GST Calculator", slug: "gst-calculator", icon: <Calculator className="w-4 h-4" />, color: 25, benefit: "Add or remove GST from any price" },
  { title: "Profit Margin Calculator", slug: "profit-margin-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 152, benefit: "Find margin and markup fast" },
  { title: "Budget Calculator", slug: "budget-calculator", icon: <DollarSign className="w-4 h-4" />, color: 45, benefit: "Track and plan monthly expenses" },
  { title: "Sales Tax Calculator", slug: "sales-tax-calculator", icon: <ReceiptText className="w-4 h-4" />, color: 275, benefit: "Calculate tax on any purchase" },
];

// ── Main Component ──
export default function DiscountCalculator() {
  const [mode, setMode] = useState<"pct" | "amount" | "final">("pct");
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const calc = () => {
    const orig = parseFloat(original);
    const disc = parseFloat(discount);
    const fin = parseFloat(finalPrice);
    if (mode === "pct") {
      if (!orig || isNaN(disc)) return null;
      const saving = (orig * disc) / 100;
      return { saving, final: orig - saving, pct: disc };
    }
    if (mode === "amount") {
      if (!orig || isNaN(disc)) return null;
      return { saving: disc, final: orig - disc, pct: (disc / orig) * 100 };
    }
    if (mode === "final") {
      if (!orig || isNaN(fin)) return null;
      const saving = orig - fin;
      return { saving, final: fin, pct: (saving / orig) * 100 };
    }
    return null;
  };

  const result = calc();

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-amber-500 transition-colors text-base";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Discount Calculator – Calculate Savings, Final Price & Discount % Instantly | US Online Tools"
        description="Free online discount calculator. Find the final price after a discount, calculate how much you save, or discover the discount percentage. Works three ways — instant results."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Shopping</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Discount Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Tag className="w-3.5 h-3.5" />
            Finance &amp; Shopping
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Discount Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate exactly how much you save, what the final price is, and the discount percentage — three ways to calculate any discount. Instant results, no signup required.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20">
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

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Finance &amp; Shopping &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5" id="calculator">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3 Modes in 1</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Mode tabs */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Calculate by</label>
                    <div className="flex rounded-xl border-2 border-border overflow-hidden">
                      {[
                        { key: "pct", label: "% Discount" },
                        { key: "amount", label: "$ Off Amount" },
                        { key: "final", label: "Final Price" },
                      ].map(m => (
                        <button
                          key={m.key}
                          onClick={() => setMode(m.key as typeof mode)}
                          className={`flex-1 py-3 font-black uppercase text-xs tracking-wider transition-colors ${mode === m.key ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Original Price ($)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className={`${inputCls} pl-8`}
                          value={original}
                          onChange={e => setOriginal(e.target.value)}
                        />
                      </div>
                    </div>
                    {mode === "pct" && (
                      <div>
                        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Discount (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="e.g. 30"
                            className={`${inputCls} pr-8`}
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">%</span>
                        </div>
                      </div>
                    )}
                    {mode === "amount" && (
                      <div>
                        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Discount Amount ($)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className={`${inputCls} pl-8`}
                            value={discount}
                            onChange={e => setDiscount(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {mode === "final" && (
                      <div>
                        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Final Price ($)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className={`${inputCls} pl-8`}
                            value={finalPrice}
                            onChange={e => setFinalPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Results */}
                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-3 gap-3"
                    >
                      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-5 text-center">
                        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">You Save</p>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{fmt(result.saving)}</p>
                      </div>
                      <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5 text-center">
                        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Final Price</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{fmt(result.final)}</p>
                      </div>
                      <div className="bg-card border-2 border-border rounded-xl p-5 text-center">
                        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Discount %</p>
                        <p className="text-2xl font-black text-foreground">{result.pct.toFixed(1)}%</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed border-border">
                      <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="font-bold text-muted-foreground">Enter values above to calculate your savings</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Discount Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool combines the three most common discount calculations into a single, instant interface. Whether you're a shopper verifying a sale price, a retailer setting markdown amounts, or a budget-conscious consumer comparing deals, here's exactly how each mode works and when to use it.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your calculation mode</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use <strong className="text-foreground">% Discount</strong> when you know the original price and the percentage being taken off — for example, a jacket on sale for 30% off. Use <strong className="text-foreground">$ Off Amount</strong> when you know the dollar value of the discount rather than the percentage — for example, "$12 off your next order." Use <strong className="text-foreground">Final Price</strong> when you know both the original price and what you actually paid, and want to discover the savings amount and the discount percentage that was applied. This reverse-calculation mode is especially useful for comparing deals across different stores when prices are not labeled with a percentage.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your values</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Type the original price in the first field — decimals are fully supported, so you can enter values like $12.99 or $1,299.00 without any issue. Then enter the second value relevant to your chosen mode: a percentage, a dollar-off amount, or the final price you paid. You do not need to press Enter or click a button — the three result cards update the moment both fields contain valid numbers. On mobile, the fields stack vertically for easy thumb entry; on desktop they sit side-by-side.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read your savings breakdown</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The results appear in three color-coded cards. The amber <strong className="text-foreground">You Save</strong> card shows the exact dollar amount you're saving — the difference between original and final price. The emerald <strong className="text-foreground">Final Price</strong> card shows what you actually pay. The slate <strong className="text-foreground">Discount %</strong> card shows the percentage discount, expressed to one decimal place. All three cards update simultaneously, so if you switch modes and re-enter values, you always see the complete picture at a glance.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Final Price = Original × (1 − Discount% ÷ 100)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Discount% = (Savings ÷ Original) × 100</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Savings = Original − Final Price</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Formula 1</strong> is the foundation of discount math. Subtracting the decimal form of the percentage from 1 gives the "keep" multiplier — for example, a 30% discount means you keep 70%, so multiply the original by 0.70. This formula is used in point-of-sale systems worldwide and is directly applied in the % Discount mode.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 2</strong> works in reverse — it derives the percentage from the two dollar amounts. Dividing savings by the original price gives a decimal ratio; multiplying by 100 converts that ratio to a human-readable percentage. This is what powers the $ Off Amount and Final Price modes.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 3</strong> is the simplest: the savings are always the difference between what something was priced at and what you actually pay. This figure is the most emotionally salient for shoppers — seeing "$180 saved" on a TV purchase is often more motivating than seeing "30% off."
                  </p>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read discount percentages and what they typically signal in retail and commerce:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Small discount (1–15%) — Standard retail markdown</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A discount of 1% to 15% is considered a standard retail markdown and is extremely common in everyday shopping. Grocery stores routinely discount staple items by 5–10% for loyalty card holders, and clothing retailers offer 10–15% to email subscribers. These discounts are designed to encourage purchase without significantly eroding the retailer's margin. If you see a single-digit discount on a high-ticket item, it may not be worth rushing to buy — these discounts are offered frequently and the item is likely to go on sale again soon.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Mid discount (16–40%) — Seasonal sales &amp; clearance</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Discounts in the 16–40% range represent genuine sales territory. You'll encounter these during Black Friday, end-of-season clearance, or promotional events like Amazon Prime Day. A 25% discount on full-price goods is a meaningful saving — $25 back on a $100 item or $250 back on a $1,000 appliance. At this level, it's usually worth acting on the deal if you were already planning to buy. Retailers typically can sustain these discounts by tapping into promotional budgets or moving excess inventory.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Large discount (41–70%) — Flash sales &amp; bulk deals</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Discounts above 40% signal a flash sale, liquidation event, or bulk-purchase incentive. These are less common in standard retail and are often time-limited or quantity-limited. Software subscriptions, online courses, and direct-to-consumer brands are the most frequent offenders of "75% off" promotions — in these cases, be aware that the listed "original price" may be an inflated anchor rather than a genuine market price. For physical goods from established retailers, a 50%+ discount is a genuine bargain worth acting on quickly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Extreme discount (71%+) — Closeout, damaged, or suspicious</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Discounts above 70% are rare in legitimate retail and almost always indicate a closeout sale (store closing, end-of-life product), damaged or returned merchandise, or — most commonly online — a misleading anchor price. Before purchasing at this discount level, verify the original MSRP against independent sources like manufacturer websites or price-tracking tools. Legitimate extreme discounts do exist — a discontinued TV model or a floor demo unit — but they require due diligence to confirm the item's condition and warranty status.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep in mind that discount percentage alone doesn't tell the full story. A 50% discount on a $10 item saves you $5, while a 10% discount on a $1,000 item saves you $100. Always consider the absolute dollar saving alongside the percentage — the "You Save" card in the calculator shows you exactly this figure.
              </p>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Original</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Discount</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">You Save</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Final Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Clothing sale</td>
                      <td className="px-4 py-3 font-mono text-foreground">$80.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">30%</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">$24.00</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">$56.00</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Restaurant bill</td>
                      <td className="px-4 py-3 font-mono text-foreground">$45.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">$12 off</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">$12.00</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">$33.00</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Electronics</td>
                      <td className="px-4 py-3 font-mono text-foreground">$599.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">Final $479</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">$120.00</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">$479.00</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Grocery item</td>
                      <td className="px-4 py-3 font-mono text-foreground">$5.49</td>
                      <td className="px-4 py-3 font-mono text-foreground">Final $3.99</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">$1.50</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">$3.99</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Luxury item</td>
                      <td className="px-4 py-3 font-mono text-foreground">$1,200.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">15%</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">$180.00</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">$1,020.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Clothing sale (30% off $80):</strong> A retailer marks down a $80 jacket by 30% for end-of-season clearance. Enter $80 as the original price and 30 as the discount percentage using the % Discount mode. The calculator instantly returns a saving of $24.00 and a final price of $56.00. This is the most common use case for the tool — verifying in seconds that the cashier or e-commerce cart has applied the correct markdown before you complete your purchase.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Restaurant coupon ($12 off $45):</strong> A dining app offers $12 off a bill of $45. Rather than estimating mentally, switch to the $ Off Amount mode, enter $45 as the original and $12 as the dollar saving. The result shows a final bill of $33.00 and reveals the effective discount was 26.7% — useful for comparing the coupon's value against a percentage-off alternative deal from a competing app.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Electronics (marked from $599 to $479):</strong> A laptop's price tag shows $599 crossed out with $479 written below it. Use the Final Price mode — enter $599 as original and $479 as final — to learn that you save exactly $120.00, which is a 20.03% discount. This reverse calculation is invaluable when shopping in stores that display crossed-out prices without stating the percentage, letting you make an instant apples-to-apples comparison with other offers.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Luxury handbag (15% off $1,200):</strong> A department store loyalty event offers 15% off all accessories. On a $1,200 handbag, 15% might feel modest — but the calculator shows $180.00 saved, bringing the total to $1,020.00. This illustrates why percentage alone can be misleading for high-ticket items: a "small" 15% off a large price point often represents more real money saved than a "big" 50% off a $20 item.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I use this every time I shop online. Being able to work backward from a final price to see the real discount percentage has saved me from falling for fake markdowns."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Discount Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It's genuinely free — no strings attached.</strong> Many discount calculators online are free to load but quickly prompt you to register, disable an ad blocker, or pay for "pro" features like saving history. This tool has no paywall, no advertisements interrupting the interface, and no registration of any kind. You can run unlimited calculations, bookmark the page, and share it with friends — it will always be completely free.
                </p>
                <p>
                  <strong className="text-foreground">Your data never leaves your device.</strong> Every calculation happens entirely inside your browser using JavaScript. No price you type is transmitted to any server, stored in any database, or associated with any profile. This is especially important for business users who may be entering confidential pricing data, or individuals who prefer not to have their purchase behavior tracked. There are no analytics attached to the input fields.
                </p>
                <p>
                  <strong className="text-foreground">Three calculation modes in one clean interface.</strong> Most standalone discount tools solve only one variant: either "% off" or "final price." This calculator handles all three approaches — percentage-based, dollar-amount-based, and reverse-from-final-price — in a single tabbed widget. Switching between modes takes one click, and the layout stays consistent so there's no learning curve when you change your approach.
                </p>
                <p>
                  <strong className="text-foreground">Instant results as you type.</strong> Results update in real time with every keystroke — there's no submit button to press and no page refresh. This live feedback makes it easy to experiment: try a few different discount percentages to find the price point you're willing to pay, or adjust the original price to see how savings scale across different quantities. The three result cards always stay in sync.
                </p>
                <p>
                  <strong className="text-foreground">Part of a 400+ tool ecosystem.</strong> This calculator lives within a suite of over 400 free online tools covering finance, health, unit conversion, developer utilities, and more. All tools share the same design language, dark/light mode support, and mobile-responsive layout — so once you're comfortable with one tool, the others feel instantly familiar. The Finance &amp; Shopping category alone includes tip calculators, GST tools, profit margin calculators, and more.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Results depend entirely on the accuracy of the values you enter. This tool calculates discounts based on the numbers provided and is not a substitute for official receipts, invoices, or professional pricing advice. Always verify final amounts against your receipt or checkout summary before completing a purchase or financial transaction. For tax-inclusive pricing, enter the tax-inclusive original price if you want the discount applied after tax.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I calculate 30% off a price?"
                  a="Multiply the original price by 0.30 to get the discount amount, then subtract from the original. Example: $80 × 0.30 = $24 off → final price is $56. Or use the % Discount mode above: enter 80 as the original price and 30 as the discount percentage. The result appears instantly — you'll see $24.00 saved and a final price of $56.00 without pressing any button."
                />
                <FaqItem
                  q="What is the discount formula?"
                  a="There are three core formulas. Final Price = Original × (1 − Discount% ÷ 100). Discount% = (Savings ÷ Original) × 100. Savings = Original − Final Price. All three are implemented in this calculator — the mode you select determines which formula is applied and which value is derived. For example, in % Discount mode, the calculator uses the first formula to find Final Price and Savings."
                />
                <FaqItem
                  q="Can I work backward from the final price?"
                  a="Yes — that's exactly what the Final Price mode is for. Enter the original price in the first field and the price you actually paid in the second field. The calculator derives the exact dollar amount saved and the discount percentage automatically. This is particularly useful when a store shows a crossed-out price next to a sale price without labeling the percentage discount."
                />
                <FaqItem
                  q="Why is the discount percentage different from what the store advertises?"
                  a="If your calculated percentage doesn't match the advertised discount, there are a few possible reasons. The store may have applied additional fees or taxes before the discount. The original 'reference' price may be an inflated anchor rather than the genuine previous selling price. Or the discount may have been applied only to part of the order total, not the full amount. Always verify that you're entering the correct pre-discount base price. Consumer protection agencies in many jurisdictions require that advertised 'before' prices reflect a genuine selling price within a defined recent period."
                />
                <FaqItem
                  q="Does this work for tax-inclusive prices?"
                  a="Yes, but with an important caveat. If the original price includes tax and the discount is applied to the pre-tax amount, you should enter the pre-tax price as the original. If the discount is applied to the full tax-inclusive price, use the tax-inclusive total. The calculator is agnostic to taxes — it simply works with whatever numbers you enter. For precise after-tax pricing, use our Sales Tax Calculator in conjunction with this tool."
                />
                <FaqItem
                  q="Can I use decimals for prices?"
                  a="Yes — all input fields accept decimal values. You can enter prices like $12.99, $599.00, or $1,249.95 without any issue. The 'You Save' and 'Final Price' results are formatted as currency with two decimal places. The Discount % result is shown to one decimal place (e.g., 26.7%), which is sufficient precision for all practical shopping comparisons."
                />
                <FaqItem
                  q="Is this tool accurate for financial reporting?"
                  a="For everyday purchase decisions, yes — the calculator is fully accurate using standard floating-point arithmetic. For formal financial reporting, invoicing, or accounting purposes, you should verify results against your accounting software or a certified professional, since financial statements may require specific rounding conventions (e.g., banker's rounding) or currency precision rules that differ from consumer-grade calculations. This tool is designed for personal and informal business use."
                />
                <FaqItem
                  q="Is my data private?"
                  a="All calculations run entirely inside your browser — no data is transmitted to any server, no input values are stored in cookies, and no analytics capture the numbers you enter. When you close the tab, your values are gone. This tool has no user accounts, no tracking of individual calculations, and no data collection of any kind. Your prices and savings figures are 100% private."
                />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Finance Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including tip calculators, tax calculators, profit margin tools, unit converters, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate discounts easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
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
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-amber-500/40 flex-shrink-0" />
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
