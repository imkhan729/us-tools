import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Percent, Calculator, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Scale, BarChart3, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Star,
} from "lucide-react";

type ChangeMode = "change" | "increase" | "decrease" | "difference";

// ── Calculator Logic ──
function useCalc1() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => {
    const px = parseFloat(x), py = parseFloat(y);
    if (isNaN(px) || isNaN(py)) return null;
    return (px / 100) * py;
  }, [x, y]);
  return { x, setX, y, setY, result };
}

function useCalc2() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => {
    const px = parseFloat(x), py = parseFloat(y);
    if (isNaN(px) || isNaN(py) || py === 0) return null;
    return (px / py) * 100;
  }, [x, y]);
  return { x, setX, y, setY, result };
}

function useCalc3(mode: ChangeMode) {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => {
    const px = parseFloat(x), py = parseFloat(y);
    if (isNaN(px) || isNaN(py)) return null;

    if (mode === "difference") {
      const change = Math.abs(py - px);
      const avg = (Math.abs(px) + Math.abs(py)) / 2;
      if (avg === 0) return 0;
      return (change / avg) * 100;
    }

    if (px === 0) return null;

    if (mode === "decrease") {
      return ((px - py) / Math.abs(px)) * 100;
    }

    // "change" (signed) and "increase" share the same formula; display rules differ in UI
    return ((py - px) / Math.abs(px)) * 100;
  }, [mode, x, y]);
  return { x, setX, y, setY, result };
}

// ── Result Insight Component ──
function ResultInsight({
  type,
  result,
  inputs,
  changeMode,
}: {
  type: 1 | 2 | 3;
  result: number | null;
  inputs: { x: string; y: string };
  changeMode?: ChangeMode;
}) {
  if (result === null) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 4 });

  let message = "";
  if (type === 1) {
    message = `${inputs.x}% of ${inputs.y} is ${fmt(result)}. This means if you take ${inputs.x} out of every 100 parts of ${inputs.y}, you get ${fmt(result)}.`;
  } else if (type === 2) {
    message = `${inputs.x} is ${fmt(result)}% of ${inputs.y}. This means ${inputs.x} represents about ${fmt(result)} out of every 100 units of ${inputs.y}.`;
  } else {
    const resolvedMode = changeMode ?? "change";
    if (resolvedMode === "difference") {
      message = `The two values differ by ${fmt(result)}% (measured relative to their average). This is useful when there is no clear “original” value.`;
    } else if (resolvedMode === "decrease") {
      message = `From ${inputs.x} to ${inputs.y}, the value decreased by ${fmt(result)}% (relative to the original).`;
    } else if (resolvedMode === "increase") {
      const isIncrease = result >= 0;
      message = isIncrease
        ? `From ${inputs.x} to ${inputs.y}, the value increased by ${fmt(result)}% (relative to the original).`
        : `From ${inputs.x} to ${inputs.y}, the value did not increase. It changed by ${fmt(result)}% (negative means a decrease).`;
    } else {
      const direction = result > 0 ? "increase" : result < 0 ? "decrease" : "no change";
      message = `There is a ${fmt(Math.abs(result))}% ${direction} from ${inputs.x} to ${inputs.y}. ${result > 0 ? "The value went up." : result < 0 ? "The value went down." : "The value stayed the same."}`;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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
  { title: "Percentage Increase Calculator", slug: "percentage-increase-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152, benefit: "Find exact growth between two values" },
  { title: "Percentage Decrease Calculator", slug: "percentage-decrease-calculator", icon: <TrendingUp className="w-5 h-5 rotate-180" />, color: 340, benefit: "Calculate drops, markdowns, and losses" },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25, benefit: "See final price after any % off" },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Scale className="w-5 h-5" />, color: 265, benefit: "Simplify and compare ratios instantly" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 217, benefit: "Mean, median, mode in one tool" },
  { title: "Percentage Difference Calculator", slug: "percentage-difference-calculator", icon: <Percent className="w-5 h-5" />, color: 45, benefit: "Compare two values symmetrically" },
];

// ── Main Component ──
export default function PercentageCalculator() {
  const calc1 = useCalc1();
  const calc2 = useCalc2();
  const [changeMode, setChangeMode] = useState<ChangeMode>("change");
  const calc3 = useCalc3(changeMode);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | null) => {
    if (n === null) return "--";
    return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
  };

  return (
    <Layout>
      <SEO
        title="Percentage Calculator – Percent Of, Increase, Decrease & Difference (All-in-One) | US Online Tools"
        description="Free all-in-one percentage calculator: find X% of Y, what percent X is of Y, and calculate percentage change, increase, decrease, or difference. Instant results, accurate to 4 decimals."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Online Percentage Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Percentage Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Three percentage calculators in one — find a percentage of a number, express one value as a percent of another, or calculate percentage change. Instant results, no login required.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
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
            Category: Math &amp; Calculators &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 2. TOOL WIDGET ── */}
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Percent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3 Calculators in 1</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Calculator 1: What is X% of Y? */}
                  <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">What is X% of Y?</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">What is</span>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="10"
                          className="tool-calc-input w-28"
                          value={calc1.x}
                          onChange={e => calc1.setX(e.target.value)}
                        />
                        <Percent className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">of</span>
                      <input
                        type="number"
                        placeholder="200"
                        className="tool-calc-input w-32"
                        value={calc1.y}
                        onChange={e => calc1.setY(e.target.value)}
                      />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-blue-600 dark:text-blue-400">
                        {fmt(calc1.result)}
                      </div>
                    </div>
                    <ResultInsight type={1} result={calc1.result} inputs={{ x: calc1.x, y: calc1.y }} />
                  </div>

                  {/* Calculator 2: X is what % of Y? */}
                  <div className="tool-calc-card" style={{ "--calc-hue": 275 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">2</div>
                      <h3 className="text-lg font-bold text-foreground">X is what percent of Y?</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="number"
                        placeholder="25"
                        className="tool-calc-input w-32"
                        value={calc2.x}
                        onChange={e => calc2.setX(e.target.value)}
                      />
                      <span className="text-sm font-semibold text-muted-foreground">is what % of</span>
                      <input
                        type="number"
                        placeholder="200"
                        className="tool-calc-input w-32"
                        value={calc2.y}
                        onChange={e => calc2.setY(e.target.value)}
                      />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-purple-600 dark:text-purple-400">
                        {calc2.result !== null ? `${fmt(calc2.result)}%` : "--"}
                      </div>
                    </div>
                    <ResultInsight type={2} result={calc2.result} inputs={{ x: calc2.x, y: calc2.y }} />
                  </div>

                  {/* Calculator 3: Change / Increase / Decrease / Difference */}
                  <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">3</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">Percentage Change (Increase / Decrease / Difference)</h3>
                        <p className="text-sm text-muted-foreground mt-1">Pick the variant you need, then enter two values.</p>
                      </div>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {([
                        ["change", "Change"],
                        ["increase", "Increase"],
                        ["decrease", "Decrease"],
                        ["difference", "Difference"],
                      ] as const).map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => setChangeMode(value)}
                          className={`rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors ${
                            changeMode === value
                              ? "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                              : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-blue-500/20"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">From</span>
                      <input
                        type="number"
                        placeholder="80"
                        className="tool-calc-input w-32"
                        value={calc3.x}
                        onChange={e => calc3.setX(e.target.value)}
                      />
                      <span className="text-sm font-semibold text-muted-foreground">to</span>
                      <input
                        type="number"
                        placeholder="100"
                        className="tool-calc-input w-32"
                        value={calc3.y}
                        onChange={e => calc3.setY(e.target.value)}
                      />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div
                        className={`tool-calc-result flex-1 w-full ${
                          changeMode === "difference"
                            ? "text-amber-600 dark:text-amber-400"
                            : changeMode === "decrease"
                              ? "text-red-600 dark:text-red-400"
                              : calc3.result !== null && calc3.result >= 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {calc3.result !== null
                          ? `${changeMode === "difference" ? "" : changeMode === "decrease" ? "−" : calc3.result > 0 ? "+" : ""}${fmt(
                              Math.abs(calc3.result),
                            )}%`
                          : "--"}
                      </div>
                    </div>
                    <ResultInsight type={3} result={calc3.result} inputs={{ x: calc3.x, y: calc3.y }} changeMode={changeMode} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Percentage Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool combines three of the most common percentage calculations into a single, no-fuss interface. Whether you're a student checking a test score, a shopper calculating a discount, or a business owner tracking growth metrics, here's exactly how to get the most out of each calculator.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose the right calculator for your question</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use <strong className="text-foreground">Calculator 1</strong> ("What is X% of Y?") when you know the percentage and the whole value — for example, finding a 20% tip on a $50 bill, or calculating 15% VAT on a product price. Use <strong className="text-foreground">Calculator 2</strong> ("X is what % of Y?") when you know both values but want to express their relationship as a percentage — ideal for exam scores, market share, or recipe ratios. Use <strong className="text-foreground">Calculator 3</strong> when comparing two values: choose <strong className="text-foreground">Change</strong> for signed movement, <strong className="text-foreground">Increase</strong> or <strong className="text-foreground">Decrease</strong> for directional calculations, and <strong className="text-foreground">Difference</strong> when there’s no clear “original.”
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your values in any order</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Type directly into the input fields — decimals are fully supported, so you can enter values like 12.5 or 99.99 without issue. Negative numbers also work in Calculator 3, which correctly handles cases where a value drops below zero. On mobile, the inputs are stacked vertically for thumb-friendly tapping. On desktop, they sit side-by-side on a single row. You do not need to press Enter or click a button — the result appears the moment both fields contain valid numbers.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the plain-English explanation below the result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Every result is accompanied by a short sentence that puts the number in context — for example, "45 is 90% of 50. This means 45 represents about 90 out of every 100 units of 50." This is especially useful when sharing results with someone else or including numbers in a report. If a result seems unexpected, double-check that you've entered the values in the correct fields — a common mistake is swapping the numerator and denominator in Calculator 2.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Result = (X ÷ 100) × Y</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-purple-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Result = (X ÷ Y) × 100</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Change = ((Y − X) ÷ |X|) × 100</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-red-500 font-bold w-4 flex-shrink-0">4</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Decrease = ((X − Y) ÷ |X|) × 100</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-500 font-bold w-4 flex-shrink-0">5</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Difference = |X − Y| ÷ ((|X| + |Y|) ÷ 2) × 100</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Formula 1</strong> converts a percentage into an actual amount. "Per cent" literally means "per hundred" — so 30% is 30 per 100, or 0.30. Multiplying 0.30 by any number gives you 30% of that number. This formula has been used since the Roman era when merchants calculated portions of 100 units for tax and trade.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 2</strong> is the inverse — it tells you what fraction of the whole one number represents, scaled to 100. Dividing X by Y gives a decimal ratio; multiplying by 100 converts it to a percentage. An edge case: if Y is zero, the result is undefined (you cannot divide by zero), so the calculator leaves the result blank rather than showing an error.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 3</strong> measures relative change. Using the absolute value of X in the denominator ensures the formula works correctly even when the starting value is negative — for example, a business that improves from a loss of −$5,000 to a profit of $2,500. The result is signed: positive for growth, negative for decline.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 4</strong> is the standard percentage decrease formula. It’s directional and uses the original value as the base — common for discounts, losses, and drops.
                  </p>
                  <p>
                    <strong className="text-foreground">Formula 5</strong> is percentage difference. It is symmetric (no “before/after”), which is ideal for comparing options like two vendor quotes when neither is the “original.”
                  </p>
                </div>
              </div>
            </section>

            {/* ── 4. RESULT INTERPRETATION ── */}
            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories & Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read and act on your percentage result:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Positive result (e.g. +25%) — Growth / Increase</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The new value is higher than the original. In business contexts, a positive percentage change on revenue or profit is desirable and worth highlighting in quarterly reports. In personal finance, a positive change on a savings account or investment portfolio means your money is growing. Even a small positive change — say +2.3% on a monthly basis — compounds significantly over 12 months (roughly +31% annualized). Celebrate small wins; they add up.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Negative result (e.g. −15%) — Loss / Decrease</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The new value is lower than the original. A negative percentage change on costs or expenses is actually positive for a business — it means spending went down. Context matters enormously. A −10% change in website traffic deserves attention, while a −10% change in body weight might be a health achievement. Always interpret the sign relative to what you're measuring and what direction is considered favorable.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Zero result (0%) — No Change</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The two values are identical, or the change is too small to register at 4 decimal places. In practice, a true zero change is rare in dynamic systems like markets or biology. If you see 0%, verify that both your input values are correct and not duplicates of each other. A 0% change on a fixed-rate savings account, for example, simply means no interest was credited for that period.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Over 100% — More Than Doubled</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A result above 100% means the value has grown by more than its original amount — for example, going from 50 to 110 is a +120% increase. This is common in high-growth startups, viral content metrics, and commodity price spikes. While exciting, results over 100% often need verification since they may indicate a data-entry error or a short baseline period that exaggerates the magnitude of change.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                For Calculators 1 and 2, result interpretation is more straightforward: the number is simply the calculated portion or ratio. Percentages above 100% in Calculator 2 mean the part exceeds the whole — valid in contexts like interest payments that surpass the principal, or a score earned through bonus marks.
              </p>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Calculation</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Input A</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Input B</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Result</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Scenario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">What is X% of Y?</td>
                      <td className="px-4 py-3 font-mono text-foreground">25%</td>
                      <td className="px-4 py-3 font-mono text-foreground">200</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">50</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Shopping discount</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">X is what % of Y?</td>
                      <td className="px-4 py-3 font-mono text-foreground">42</td>
                      <td className="px-4 py-3 font-mono text-foreground">50</td>
                      <td className="px-4 py-3 font-bold text-purple-600 dark:text-purple-400">84%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Exam score</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">% Change</td>
                      <td className="px-4 py-3 font-mono text-foreground">50,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">55,000</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">+10%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Salary raise</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">What is X% of Y?</td>
                      <td className="px-4 py-3 font-mono text-foreground">18%</td>
                      <td className="px-4 py-3 font-mono text-foreground">85</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">15.3</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Restaurant tip</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">% Change</td>
                      <td className="px-4 py-3 font-mono text-foreground">1,200</td>
                      <td className="px-4 py-3 font-mono text-foreground">960</td>
                      <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">−20%</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Price drop</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Shopping discount:</strong> A jacket is priced at $200 and carries a 25% markdown during a seasonal sale. Entering 25 and 200 into Calculator 1 gives $50 — the exact dollar amount saved. You pay $150. This scenario is used millions of times daily as shoppers verify that the cashier's system applied the correct discount. Being able to confirm this in seconds prevents overpayment.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Exam score:</strong> A student answers 42 questions correctly out of 50 total. Using Calculator 2 (42 is what % of 50) gives 84%. Most educational systems grade at 90%+ for an A, 80%–89% for a B, and so on. Knowing the percentage immediately tells the student where they stand relative to the grading curve — and how many more marks they needed for the next grade.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Salary negotiation:</strong> An employee's base salary rises from $50,000 to $55,000 during an annual review. Calculator 3 shows a +10% increase — a strong benchmark, since the US Bureau of Labor Statistics reports average annual wage growth of roughly 4–5%. Knowing you received double the average increase is valuable data for future negotiations and for updating a LinkedIn profile or resume.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Price drop tracking:</strong> A piece of software subscription drops from $1,200 to $960 per year. Calculator 3 shows −20%, which justifies renewing immediately and locking in the discounted rate before the promotion ends. Businesses frequently use this type of calculation when comparing vendor quotes year-over-year to identify cost savings.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Fast and accurate — use it weekly. I switched from a spreadsheet formula I kept getting wrong to this tool, and it's saved me so much frustration."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Percentage Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It's genuinely free — no strings attached.</strong> Many percentage calculators online are free to open but quickly prompt you to create an account, watch an ad, or pay for "premium" decimal precision. This tool has no paywall, no advertisements, and no registration of any kind. You can run unlimited calculations, bookmark the page, and share it freely — it will always be free.
                </p>
                <p>
                  <strong className="text-foreground">Your data never leaves your device.</strong> Every calculation happens entirely inside your browser using JavaScript. No value you type is transmitted to any server, stored in any database, or linked to any profile. This is especially important for business users entering sensitive financial figures, HR professionals calculating salary changes, or anyone who values privacy by default.
                </p>
                <p>
                  <strong className="text-foreground">Three calculators built into one clean interface.</strong> Most standalone tools solve only one type of percentage problem. By combining all three variants — percentage of a number, percentage proportion, and percentage change — into a single page, this calculator eliminates the need to jump between tabs or rephrase your question. Power users can run all three calculations simultaneously.
                </p>
                <p>
                  <strong className="text-foreground">Accurate to 4 decimal places, instantly.</strong> Results are computed using IEEE 754 double-precision floating-point arithmetic — the same standard used in spreadsheet software like Excel and Google Sheets. For everyday use, results are displayed up to 4 decimal places, which is more than sufficient for financial, academic, and scientific contexts. The display rounds gracefully without losing precision in the underlying computation.
                </p>
                <p>
                  <strong className="text-foreground">Part of a 400+ tool ecosystem.</strong> This calculator lives within a suite of over 400 free online tools spanning finance, health, unit conversion, developer utilities, and more. All tools share the same design language, dark/light mode support, and mobile-responsive layout — so once you're familiar with one, the others feel instantly intuitive.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool is designed for everyday arithmetic percentage calculations and is not a substitute for professional financial, tax, or investment advice. For complex scenarios — such as compound interest, weighted averages, or actuarial computations — consider using a specialized calculator from our Finance category or consulting a qualified professional. Results depend entirely on the accuracy of the values you enter; always verify inputs before using results in formal reports or contracts.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I calculate a percentage of a number?"
                  a="Divide the percentage by 100, then multiply by the number. For example, 20% of 150 = (20 ÷ 100) × 150 = 30. Use Calculator 1 above — enter 20 in the first field and 150 in the second. The result appears instantly without pressing any button. This works for any real number including decimals and large values."
                />
                <FaqItem
                  q="What is percentage change and how is it different from percentage difference?"
                  a="Percentage change measures how much a value shifted from a specific starting point — it's directional (positive or negative). Percentage difference, by contrast, compares two values symmetrically without a defined 'before' and 'after,' using their average as the base. Use Calculator 3 here for percentage change; check our Percentage Difference Calculator for the symmetric version."
                />
                <FaqItem
                  q="Can this calculator handle decimals and negative numbers?"
                  a="Yes — all three calculators accept any real number: decimals like 12.75, large values like 1,500,000, and negative numbers. Calculator 3 correctly handles cases where the starting value is negative (e.g., a loss turning into a profit). Results are displayed to up to 4 decimal places for maximum precision without visual clutter."
                />
                <FaqItem
                  q="Is this calculator accurate enough for business and financial use?"
                  a="Yes. Results use double-precision floating-point arithmetic — the same standard as Microsoft Excel and Google Sheets — accurate to approximately 15 significant digits. For everyday business tasks like profit margins, markup calculations, conversion rates, discount pricing, and year-over-year growth analysis, this tool is fully reliable. For legal or tax-filing purposes, always verify with a certified accountant."
                />
                <FaqItem
                  q="Why does Calculator 2 show no result when I enter zero in the second field?"
                  a="Dividing by zero is mathematically undefined — there's no number that, when multiplied by zero, gives a non-zero result. Rather than displaying an error or an infinity symbol, the calculator simply shows a blank result. This is intentional behavior that prevents confusion. Ensure the second field (the 'whole' value) is a non-zero number."
                />
                <FaqItem
                  q="Does this tool work on mobile phones and tablets?"
                  a="Yes. The layout adapts automatically: on smaller screens the input fields stack vertically for comfortable thumb entry, while on tablets and desktops they display in a horizontal row. The tool does not require any app download or installation — it runs entirely in your mobile browser. iOS Safari and Android Chrome are both fully supported."
                />
                <FaqItem
                  q="How is this different from just using a search engine like Google?"
                  a="Google's built-in calculator handles one calculation at a time and doesn't explain the result in plain English or show the formula used. This tool offers three calculators simultaneously, displays an explanatory sentence for every result, and provides full context on formulas and interpretation — making it far more educational and efficient for repeated use or when sharing results with others."
                />
                <FaqItem
                  q="Is my input data private? Are my numbers stored anywhere?"
                  a="All calculations run locally in your browser. No data is sent to any server, no cookies track your inputs, and no analytics capture the numbers you enter. When you close the tab, your values are gone. This tool has no user accounts and no data collection of any kind — your numbers are 100% private."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including financial calculators, unit converters, developer tools, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate percentages easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
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
