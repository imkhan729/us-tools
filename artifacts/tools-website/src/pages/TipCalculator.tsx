import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ReceiptText, Users, DollarSign, Calculator,
  ArrowRight, Zap, Smartphone, Shield, BadgeCheck, Lock, Copy, Check,
  Percent, TrendingUp, Star, Lightbulb
} from "lucide-react";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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
  { title: "Discount Calculator", slug: "discount-calculator", icon: <Calculator className="w-4 h-4" />, color: 25, benefit: "See final price after any % off" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-4 h-4" />, color: 217, benefit: "Calculate any percentage instantly" },
  { title: "Budget Calculator", slug: "budget-calculator", icon: <DollarSign className="w-4 h-4" />, color: 152, benefit: "Track and plan monthly expenses" },
  { title: "Tax Calculator", slug: "tax-calculator", icon: <ReceiptText className="w-4 h-4" />, color: 275, benefit: "Calculate tax on any purchase" },
  { title: "Split Bill Calculator", slug: "split-bill-calculator", icon: <Users className="w-4 h-4" />, color: 45, benefit: "Divide any bill perfectly" },
  { title: "Currency Converter", slug: "currency-converter", icon: <TrendingUp className="w-4 h-4" />, color: 152, benefit: "Convert between world currencies" },
];

// ── Main Component ──
export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");
  const [copied, setCopied] = useState(false);

  const PRESETS = [10, 15, 18, 20, 25];

  const effectiveTip = customTip !== "" ? parseFloat(customTip) : tipPct;
  const billNum = parseFloat(bill) || 0;
  const peopleNum = Math.max(1, parseInt(people) || 1);
  const tipAmount = (billNum * effectiveTip) / 100;
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;
  const tipPerPerson = tipAmount / peopleNum;

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Tip Calculator – Calculate Tip Amount & Split Bill Instantly | US Online Tools"
        description="Free tip calculator. Find the right tip amount and split the bill evenly for any group size. Choose 10%, 15%, 18%, 20%, 25% or enter a custom tip percentage."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Shopping</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Tip Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <ReceiptText className="w-3.5 h-3.5" />
            Finance &amp; Shopping
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Tip Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate the right tip amount and split the total bill evenly among any number of people. Choose from standard percentages or enter a custom tip — results update instantly.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Users className="w-3.5 h-3.5" /> Bill Splitter
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
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                      <ReceiptText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tip &amp; Bill Splitter</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Bill Amount */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">
                      Bill Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-4 py-3 pl-9 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-emerald-500 transition-colors text-lg"
                        value={bill}
                        onChange={e => setBill(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Tip Percentage Presets */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">
                      Tip Percentage
                    </label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {PRESETS.map(p => (
                        <button
                          key={p}
                          onClick={() => { setTipPct(p); setCustomTip(""); }}
                          className={`px-4 py-2 rounded-xl font-black text-sm border-2 transition-all ${customTip === "" && tipPct === p ? "bg-emerald-500 text-white border-emerald-500" : "bg-card text-foreground border-border hover:border-emerald-500"}`}
                        >
                          {p}%
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="Custom %"
                        className="px-4 py-2 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm focus:outline-none focus:border-emerald-500 w-28 transition-colors"
                        value={customTip}
                        onChange={e => setCustomTip(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently using: <strong className="text-foreground">{isNaN(effectiveTip) ? "—" : `${effectiveTip}%`}</strong> tip
                    </p>
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">
                      Split Between
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPeople(p => String(Math.max(1, parseInt(p) - 1)))}
                        className="w-12 h-12 rounded-xl border-2 border-border bg-card text-foreground font-black text-xl hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center"
                      >−</button>
                      <input
                        type="number"
                        min="1"
                        className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-black text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                        value={people}
                        onChange={e => setPeople(e.target.value)}
                      />
                      <button
                        onClick={() => setPeople(p => String(parseInt(p) + 1))}
                        className="w-12 h-12 rounded-xl border-2 border-border bg-card text-foreground font-black text-xl hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center"
                      >+</button>
                      <span className="text-muted-foreground font-bold text-sm">{peopleNum === 1 ? "person" : "people"}</span>
                    </div>
                  </div>

                  {/* Result Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-xl p-4 text-center border-2 bg-emerald-500/10 border-emerald-500/30">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tip Amount</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{billNum > 0 ? fmt(tipAmount) : "$0.00"}</p>
                    </div>
                    <div className="rounded-xl p-4 text-center border-2 bg-card border-border">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Bill</p>
                      <p className="text-2xl font-black text-foreground">{billNum > 0 ? fmt(total) : "$0.00"}</p>
                    </div>
                    <div className="rounded-xl p-4 text-center border-2 bg-card border-border">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tip / Person</p>
                      <p className="text-2xl font-black text-foreground">{billNum > 0 ? fmt(tipPerPerson) : "$0.00"}</p>
                    </div>
                    <div className="rounded-xl p-4 text-center border-2 bg-emerald-500/10 border-emerald-500/30">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total / Person</p>
                      <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{billNum > 0 ? fmt(perPerson) : "$0.00"}</p>
                    </div>
                  </div>

                  {/* Contextual Insight */}
                  {billNum > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                    >
                      <div className="flex gap-2 items-start">
                        <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          A {isNaN(effectiveTip) ? "—" : effectiveTip}% tip on a {fmt(billNum)} bill comes to {fmt(tipAmount)}, making your total {fmt(total)}.
                          {peopleNum > 1 ? ` Split {peopleNum} ways, each person pays ${fmt(perPerson)} (including ${fmt(tipPerPerson)} tip).` : ""}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Tip Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're settling a dinner bill, splitting a tab at a bar, or rewarding great service at a hotel, this tip calculator gives you exact numbers in seconds. Here's how to get the most out of every feature.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the total bill amount before tip</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Type the subtotal from your receipt — the amount before any tip is added. This should be the pre-tip figure shown at the bottom of the bill. Decimals are fully supported, so you can enter values like $47.85 or $123.50 without any issues. If you're unsure whether to tip on the pre-tax or post-tax amount, US etiquette traditionally uses pre-tax, but either approach is acceptable and widely practiced.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select a tip percentage from the presets or enter a custom amount</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click any of the five preset buttons — 10%, 15%, 18%, 20%, or 25% — to instantly set the tip rate. The active preset is highlighted in emerald green. If you want a non-standard percentage (like 22% for a particularly attentive server, or 12% for mediocre service), type it directly into the Custom % field. Entering a custom value automatically overrides whichever preset was selected.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set the number of people splitting the bill</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the − and + buttons to decrease or increase the party count, or type a number directly into the field. The calculator defaults to 1 person (no split). When you set 2 or more, all four result cards automatically divide accordingly — you'll see both per-person totals update in real time. The minimum is always 1, so the calculator never divides by zero.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the 4-card breakdown instantly</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The four result cards display Tip Amount, Total Bill, Tip Per Person, and Total Per Person. The two emerald-highlighted cards (Tip Amount and Total Per Person) are typically the most-referenced figures at a table. All values update in real time as you adjust any input — no need to press a Calculate button or refresh the page.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Tip Amount = Bill × (Tip% ÷ 100)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-teal-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Total = Bill + Tip Amount</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-600 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Per Person = Total ÷ Number of People</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Formula 1</strong> converts a percentage into a dollar amount. Dividing the tip percentage by 100 converts it to a decimal multiplier — for example, 18% becomes 0.18. Multiplying that by the bill gives the exact tip in dollars. The result is always proportional: a larger bill always produces a larger tip for the same percentage.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 2</strong> simply sums the original bill and the tip to produce the grand total you'll pay. This is the number to hand to your server or enter when paying by card. If you're in a jurisdiction where service charge is already included, the bill amount you enter should reflect that so you don't double-tip.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 3</strong> divides the total evenly among all diners. This assumes everyone is splitting equally — for uneven splits, consider our Split Bill Calculator. Tip per person is computed the same way, dividing the tip amount by the number of people. Both quotients are rounded to the nearest cent in the display.
                  </p>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">What each tip percentage signals in the US dining context:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">10% — Minimal tip, counter service or poor service</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A 10% tip is considered minimal for table-service restaurants in the United States and is typically reserved for counter service, carry-out orders where tipping is optional, or situations where service was genuinely poor. In many parts of the country, a 10% tip at a sit-down restaurant may be interpreted as dissatisfaction. It's entirely appropriate, however, for quick-service counters, coffee shops, or situations where the server's involvement was minimal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">15% — Standard tip, acceptable sit-down restaurant service</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">15% was the long-standing standard tip in the United States for decades and remains acceptable for sit-down restaurants where service was satisfactory but unremarkable. As of the mid-2020s, this percentage is increasingly seen as the minimum for table service in metropolitan areas. For restaurants where staff wages are partially subsidized by tips, 15% often falls below what servers need to reach minimum wage standards, depending on the state.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">18–20% — Good tip, recommended for most restaurants</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">18–20% is the current de facto standard for good service at US sit-down restaurants. Most restaurant industry professionals, etiquette guides, and financial writers cite 20% as the modern baseline, largely because it simplifies mental math (move the decimal point, double it). Tipping 18–20% for attentive, friendly service is widely appreciated and helps servers earn a living wage in a tip-based compensation system.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">25%+ — Excellent service, special occasions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A tip of 25% or more signals genuine appreciation for outstanding service — a server who went well beyond expectations, remembered dietary restrictions without prompting, or handled a difficult situation with grace. It's also common on special occasions like anniversaries or birthdays when the restaurant staff contributes meaningfully to the experience. Some diners tip 25–30% as a matter of personal policy to support service workers regardless of circumstance.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Tipping norms vary significantly by country. The percentages above reflect US standards where tipping is an expected, primary component of server income. In many other countries (Australia, Japan, most of Europe), tipping is optional, modest, or even considered impolite. This calculator uses US conventions.
              </p>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Bill</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Tip %</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Tip</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Total / Person</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Solo dinner</td>
                      <td className="px-4 py-3 font-mono text-foreground">$50.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">20%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">$10.00</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">$60.00 (1 person)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Group dinner, 4 people</td>
                      <td className="px-4 py-3 font-mono text-foreground">$120.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">18%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">$21.60</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">$35.40 / person</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Date night, 2 people</td>
                      <td className="px-4 py-3 font-mono text-foreground">$85.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">22%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">$18.70</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">$51.85 / person</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Special occasion, 6 people</td>
                      <td className="px-4 py-3 font-mono text-foreground">$200.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">25%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">$50.00</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">$41.67 / person</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Counter service</td>
                      <td className="px-4 py-3 font-mono text-foreground">$15.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">10%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">$1.50</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">$16.50 (1 person)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Solo dinner at 20%:</strong> A $50 dinner for one with a 20% tip is one of the most common tip calculations in the US. Moving the decimal point one place gives $5, then doubling gives $10 — the exact tip. The grand total is $60. This mental math trick works for any bill: find 10%, then double it to get 20%. This calculator confirms that arithmetic instantly and without the possibility of error.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Group dinner at 18%:</strong> A $120 dinner split four ways with an 18% tip produces a $21.60 tip and a $141.60 total. Dividing among four people means each owes $35.40. Group bills are where this calculator shines — it eliminates the awkward mental math at the table and prevents the "who owes what" confusion that often delays payment. Simply show everyone the per-person total on your phone screen.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Custom 22% tip:</strong> An $85 bill for two people with a custom 22% tip yields an $18.70 tip and a $103.70 total, or $51.85 per person. Non-standard percentages like 22% are where the custom input field is invaluable — no preset covers this, and doing it in your head for a non-round number is error-prone. The calculator handles any decimal percentage instantly.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Special occasion at 25%:</strong> A $200 celebration dinner for six with a 25% tip comes to a $50 tip and a $250 total. Split six ways, each person pays $41.67. On large group bills, even small percentage differences translate to meaningful dollar amounts — the difference between 20% and 25% on a $200 bill is $10 in tip, which is worth knowing before you commit to a percentage at the table.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I use this at the table every time we go out — way faster than doing it in my head and it saves us from the awkward 'who owes what' math every time the check arrives."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Tip Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It's completely free with no ads or upsells.</strong> Plenty of tip calculators exist in app stores and online, but many are padded with advertisements, limited to a few free uses, or require creating an account. This tool has no paywall, no advertisements, and no registration of any kind. Open it, calculate your tip, and close the tab — it will always be free.
                </p>
                <p>
                  <strong className="text-foreground">Your data stays on your device.</strong> Every calculation runs entirely in your browser using JavaScript. No value you type — not your bill amount, not your party size — is ever sent to a server, stored in a database, or associated with a profile. This matters at a restaurant where you're handling real financial figures in a semi-public setting.
                </p>
                <p>
                  <strong className="text-foreground">Five preset buttons save time at the table.</strong> The preset buttons for 10%, 15%, 18%, 20%, and 25% cover the full range of standard US tip rates. Tap once to switch between them — the highlighted button tells you at a glance which rate is active. No scrolling through a dropdown or entering numbers from scratch for the most common scenarios.
                </p>
                <p>
                  <strong className="text-foreground">Custom tip input handles any percentage.</strong> When 18% doesn't feel right and 20% is too much or too little, the Custom % field accepts any number including decimals. Type 22.5, 12, or 30 — the calculator adapts immediately. This flexibility is especially useful for tipping delivery drivers, hotel staff, or service providers where standard restaurant percentages may not apply.
                </p>
                <p>
                  <strong className="text-foreground">Optimized for use at the table on mobile.</strong> The large tap targets, high-contrast results, and stacked layout are designed for one-handed use on a phone screen in a restaurant. You don't need to squint at tiny numbers or navigate a complex interface. Tip Amount and Total Per Person — the two figures you actually need — are displayed prominently in emerald green, distinct from the secondary figures.
                </p>
              </div>

              {/* Note */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Tip conventions vary significantly by country. This tool uses US standards where tipping is a primary component of server income and 18–20% is the expected baseline for sit-down restaurants. In many other countries, tipping customs differ greatly — from optional small amounts in Europe to being considered impolite in Japan. Always research local customs when traveling internationally.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How much should I tip at a restaurant in the US?"
                  a="In the United States, 18–20% is the standard tip for sit-down restaurants with table service. Many industry professionals and etiquette experts now cite 20% as the baseline for good service, largely because it's easy to calculate mentally (find 10%, then double it). 15% is acceptable for average service, while 25% or more signals exceptional service. Counter-service and fast-casual spots typically see 10–15%, though tipping is optional there."
                />
                <FaqItem
                  q="Do I tip on the pre-tax or post-tax amount?"
                  a="Traditionally, US tipping etiquette calculates the tip on the pre-tax subtotal — the food and beverage cost before sales tax is added. In practice, many people tip on the full total (including tax), and this is widely accepted. The difference is usually small: on a $100 pre-tax bill with 8% sales tax, a 20% tip on the pre-tax amount is $20.00, versus $21.60 on the post-tax total. Use whichever feels right to you; servers appreciate both."
                />
                <FaqItem
                  q="How do I calculate an 18% tip mentally?"
                  a="To find 18% mentally: first find 10% by moving the decimal point left one place (e.g., $45 → $4.50). Then find 8% by taking 80% of that 10% value ($4.50 × 0.8 = $3.60). Add them together: $4.50 + $3.60 = $8.10. Alternatively, find 20% (double the 10% figure) and subtract 2% (one-fifth of the 10% figure). For $45: 20% = $9.00, 2% = $0.90, so 18% = $8.10. Or, simply use this calculator."
                />
                <FaqItem
                  q="What is a good tip for delivery drivers?"
                  a="For food delivery, a tip of 15–20% of the order total is standard, with a minimum of $3–5 regardless of order size. Delivery drivers use their own vehicles, pay their own gas, and often work in variable weather conditions. For large orders, poor weather, long distances, or exceptional speed and accuracy, 20–25% is appreciated. Many delivery apps build in a tip prompt — ensure any pre-selected amount reflects your actual intention before submitting."
                />
                <FaqItem
                  q="Should I tip on alcohol?"
                  a="Yes — in a restaurant setting, alcohol is typically included in the bill total that you tip on, and bartenders and servers expect it. Alcohol often has high margins for the restaurant but does not increase server wages directly. For a separate bar tab, $1–2 per drink is standard for simple orders like beers or well drinks; $2–3 per craft cocktail is more appropriate given the preparation involved. If ordering a bottle of wine, 15–20% applies just as it would for food."
                />
                <FaqItem
                  q="How do I split a bill unevenly?"
                  a="This tip calculator splits the total evenly among all diners. If your group ordered very different amounts and wants to pay individually, the fairest approach is to calculate each person's subtotal separately and apply the tip percentage to their portion. Our Split Bill Calculator (linked in the sidebar) is designed specifically for uneven splits. Alternatively, some restaurant payment systems let each diner pay their portion by card directly."
                />
                <FaqItem
                  q="Is tipping mandatory?"
                  a="In the US, tipping is not legally required, but it is socially expected for table-service restaurants and many personal services. Many restaurants include an automatic gratuity (typically 18–20%) for large parties, usually noted at the bottom of the menu or bill — in that case, an additional tip is at your discretion. In countries like Japan, Australia, and much of Europe, tipping is not culturally expected and can even be seen as rude. Always check local customs."
                />
                <FaqItem
                  q="Does the calculator work for any currency?"
                  a="The calculator works with any numeric bill amount — the dollar sign ($) is used as a display label since this tool is built for US standards, but the math is currency-agnostic. If your bill is £85, €120, or ¥5,000, simply enter that number and interpret the results in your local currency. Tip percentages are universal arithmetic; only the customary percentage ranges vary by country."
                />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Finance Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including budget calculators, currency converters, discount finders, tax calculators, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate tips easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
