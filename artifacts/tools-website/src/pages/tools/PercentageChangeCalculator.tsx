import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, TrendingUp, Calculator, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, Percent,
  DollarSign, Scale, BarChart3, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Star, TrendingDown,
} from "lucide-react";

// ── Calculator Logic ──
function usePercentageCalculator(mode: "increase" | "decrease" | "difference") {
  const [original, setOriginal] = useState("");
  const [newValue, setNewValue] = useState("");

  const result = useMemo(() => {
    const orig = parseFloat(original);
    const newVal = parseFloat(newValue);
    if (isNaN(orig) || isNaN(newVal) || (mode !== "difference" && orig === 0)) return null;

    let percentage: number;
    let change: number;

    if (mode === "increase") {
      change = newVal - orig;
      percentage = (change / Math.abs(orig)) * 100;
    } else if (mode === "decrease") {
      change = orig - newVal;
      percentage = (change / Math.abs(orig)) * 100;
    } else {
      // Percentage difference
      change = Math.abs(orig - newVal);
      const avg = (Math.abs(orig) + Math.abs(newVal)) / 2;
      percentage = avg === 0 ? 0 : (change / avg) * 100;
    }

    return {
      change: parseFloat(change.toFixed(4)),
      percentage: parseFloat(percentage.toFixed(4)),
      original: orig,
      newValue: newVal
    };
  }, [original, newValue, mode]);

  return { original, setOriginal, newValue, setNewValue, result };
}

// ── Result Insight Component ──
function ResultInsight({ result, mode }: { result: { change: number; percentage: number; original: number; newValue: number } | null, mode: "increase" | "decrease" | "difference" }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 4 });

  let message = "";
  if (mode === "difference") {
    message = `The absolute difference between the two values is ${fmt(result.change)}. This represents ${fmt(result.percentage)}% of their average.`;
  } else if (mode === "increase") {
    message = result.percentage >= 0
      ? `The value increased by ${fmt(result.change)} (${fmt(result.percentage)}%). This means the new value is ${fmt(result.percentage)}% higher than the original.`
      : `The value decreased by ${fmt(Math.abs(result.change))} (${fmt(Math.abs(result.percentage))}%). This means the new value is ${fmt(Math.abs(result.percentage))}% lower than the original.`;
  } else {
    message = result.percentage >= 0
      ? `The value decreased by ${fmt(result.change)} (${fmt(result.percentage)}%). This means the new value is ${fmt(result.percentage)}% lower than the original.`
      : `The value increased by ${fmt(Math.abs(result.change))} (${fmt(Math.abs(result.percentage))}%). This means the new value is ${fmt(Math.abs(result.percentage))}% higher than the original.`;
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
  { title: "Percentage Decrease Calculator", slug: "percentage-decrease-calculator", icon: <TrendingUp className="w-5 h-5 rotate-180" />, color: 340, benefit: "Calculate drops, markdowns, and losses" },
  { title: "Percentage Difference Calculator", slug: "percentage-difference-calculator", icon: <Percent className="w-5 h-5" />, color: 45, benefit: "Compare two values symmetrically" },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25, benefit: "See final price after any % off" },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Scale className="w-5 h-5" />, color: 265, benefit: "Simplify and compare ratios instantly" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 217, benefit: "Mean, median, mode in one tool" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 217, benefit: "Three percentage calculators in one" },
];

// ── Main Component ──
export default function PercentageChangeCalculator() {
  const [mode, setMode] = useState<"increase" | "decrease" | "difference">("increase");

  // Detect mode from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("percentage-increase")) {
      setMode("increase");
    } else if (path.includes("percentage-decrease")) {
      setMode("decrease");
    } else if (path.includes("percentage-difference")) {
      setMode("difference");
    }
  }, []);

  const calculator = usePercentageCalculator(mode);
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

  // Dynamic content based on mode
  const toolConfig = {
    increase: {
      title: "Percentage Increase Calculator",
      description: "Calculate the percentage increase between any two values. Find out how much something grew by as a percentage — perfect for tracking growth, raises, investments, and more.",
      metaTitle: "Percentage Increase Calculator – Calculate Growth Between Two Values | US Online Tools",
      metaDesc: "Free online percentage increase calculator. Find what percentage a value increased by between two numbers. Calculate growth, raises, and gains instantly.",
      keywords: "percentage increase calculator, calculate percentage increase, percent growth calculator, percentage change calculator",
      color: "emerald",
      icon: <TrendingUp className="w-4 h-4 text-white" />,
      gradient: "from-emerald-500 to-teal-400",
      bgGradient: "from-emerald-500/5 via-card to-teal-500/5",
      borderColor: "emerald-500/20",
      shadowColor: "emerald-500/5",
      resultColor: "text-emerald-600 dark:text-emerald-400",
      label1: "From",
      label2: "to",
      resultPrefix: "+",
      formula: "Increase = ((New Value − Original Value) / |Original Value|) × 100"
    },
    decrease: {
      title: "Percentage Decrease Calculator",
      description: "Calculate the percentage decrease between any two values. Find out how much something dropped by as a percentage — perfect for tracking losses, discounts, and reductions.",
      metaTitle: "Percentage Decrease Calculator – Calculate Loss Between Two Values | US Online Tools",
      metaDesc: "Free online percentage decrease calculator. Find what percentage a value decreased by between two numbers. Calculate drops, markdowns, and losses instantly.",
      keywords: "percentage decrease calculator, calculate percentage decrease, percent drop calculator, percentage change calculator",
      color: "red",
      icon: <TrendingDown className="w-4 h-4 text-white" />,
      gradient: "from-red-500 to-pink-400",
      bgGradient: "from-red-500/5 via-card to-pink-500/5",
      borderColor: "red-500/20",
      shadowColor: "red-500/5",
      resultColor: "text-red-600 dark:text-red-400",
      label1: "From",
      label2: "to",
      resultPrefix: "−",
      formula: "Decrease = ((Original Value − New Value) / |Original Value|) × 100"
    },
    difference: {
      title: "Percentage Difference Calculator",
      description: "Calculate the percentage difference between any two values. Find out how different two values are as a percentage — perfect for comparing options symmetrically.",
      metaTitle: "Percentage Difference Calculator – Compare Two Values Symmetrically | US Online Tools",
      metaDesc: "Free online percentage difference calculator. Find what percentage two values differ by. Compare options, prices, and values symmetrically.",
      keywords: "percentage difference calculator, calculate percentage difference, percent comparison calculator, percentage change calculator",
      color: "amber",
      icon: <Percent className="w-4 h-4 text-white" />,
      gradient: "from-amber-500 to-orange-400",
      bgGradient: "from-amber-500/5 via-card to-orange-500/5",
      borderColor: "amber-500/20",
      shadowColor: "amber-500/5",
      resultColor: "text-amber-600 dark:text-amber-400",
      label1: "Value A",
      label2: "Value B",
      resultPrefix: "",
      formula: "Difference = |A − B| / ((|A| + |B|) / 2) × 100"
    }
  };

  const config = toolConfig[mode];

  return (
    <Layout>
      <SEO
        title={config.metaTitle}
        description={config.metaDesc}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">{config.title}</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className={`rounded-2xl overflow-hidden border border-${config.color}/15 bg-gradient-to-br ${config.bgGradient} px-8 md:px-12 py-10 md:py-14 mb-10`}>
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            {config.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            {config.description}
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
            <section className="space-y-5">
              <div className={`rounded-2xl overflow-hidden border border-${config.borderColor} shadow-lg shadow-${config.shadowColor}`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`} />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Percentage {mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Calculator */}
                  <div className="tool-calc-card" style={{ "--calc-hue": mode === "increase" ? 152 : mode === "decrease" ? 0 : 45 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">Calculate Percentage {mode.charAt(0).toUpperCase() + mode.slice(1)}</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">{config.label1}</span>
                      <input
                        type="number"
                        placeholder={mode === "difference" ? "100" : "100"}
                        className="tool-calc-input w-32"
                        value={calculator.original}
                        onChange={e => calculator.setOriginal(e.target.value)}
                      />
                      <span className="text-sm font-semibold text-muted-foreground">{config.label2}</span>
                      <input
                        type="number"
                        placeholder={mode === "difference" ? "120" : mode === "increase" ? "125" : "80"}
                        className="tool-calc-input w-32"
                        value={calculator.newValue}
                        onChange={e => calculator.setNewValue(e.target.value)}
                      />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className={`tool-calc-result flex-1 w-full ${config.resultColor}`}>
                        {calculator.result ? `${config.resultPrefix}${fmt(calculator.result.percentage)}%` : "--"}
                      </div>
                    </div>
                    <ResultInsight result={calculator.result} mode={mode} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Percentage {mode.charAt(0).toUpperCase() + mode.slice(1)}</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {mode === "increase" && "Percentage increase measures how much a value has grown, expressed as a percentage of the original amount. It's commonly used for tracking growth in investments, sales, salaries, and other metrics."}
                {mode === "decrease" && "Percentage decrease measures how much a value has dropped, expressed as a percentage of the original amount. It's commonly used for tracking losses, discounts, reductions, and declines."}
                {mode === "difference" && "Percentage difference measures how different two values are, expressed as a percentage using their average as the base. It's commonly used for comparing options when neither value is clearly the 'original'."}
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your values</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {mode === "difference"
                        ? "Type the two values you want to compare in the input fields. The calculator will find the absolute difference and express it as a percentage of the average of both values."
                        : `Type the original value in the first field and the ${mode === "increase" ? "new higher" : "new lower"} value in the second field. The percentage ${mode} will be calculated automatically.`}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The result shows the percentage {mode}. {mode === "difference" ? "This is always a positive value since it measures absolute difference." : `A ${mode === "increase" ? "positive" : "negative"} result means the value actually ${mode === "increase" ? "grew" : "dropped"}.`}
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">%</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">{config.formula}</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {mode === "increase" && (
                    <>
                      <p><strong className="text-foreground">Step 1:</strong> Subtract the original value from the new value to find the absolute increase.</p>
                      <p><strong className="text-foreground">Step 2:</strong> Divide by the absolute value of the original amount.</p>
                      <p><strong className="text-foreground">Step 3:</strong> Multiply by 100 to convert to a percentage.</p>
                    </>
                  )}
                  {mode === "decrease" && (
                    <>
                      <p><strong className="text-foreground">Step 1:</strong> Subtract the new value from the original value to find the absolute decrease.</p>
                      <p><strong className="text-foreground">Step 2:</strong> Divide by the absolute value of the original amount.</p>
                      <p><strong className="text-foreground">Step 3:</strong> Multiply by 100 to convert to a percentage.</p>
                    </>
                  )}
                  {mode === "difference" && (
                    <>
                      <p><strong className="text-foreground">Step 1:</strong> Find the absolute difference between the two values.</p>
                      <p><strong className="text-foreground">Step 2:</strong> Calculate the average of the absolute values of both numbers.</p>
                      <p><strong className="text-foreground">Step 3:</strong> Divide the difference by the average and multiply by 100.</p>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* ── 4. EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Percentage Increase Examples</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Investment Growth
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Your stock portfolio grew from $10,000 to $12,500.</p>
                  <div className="bg-background rounded-lg p-3 font-mono text-sm">
                    <div>Original: $10,000</div>
                    <div>New: $12,500</div>
                    <div className="text-emerald-600 font-bold">Increase: +25%</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Salary Raise
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Your annual salary increased from $50,000 to $57,500.</p>
                  <div className="bg-background rounded-lg p-3 font-mono text-sm">
                    <div>Original: $50,000</div>
                    <div>New: $57,500</div>
                    <div className="text-emerald-600 font-bold">Increase: +15%</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    Business Revenue
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Monthly sales increased from $25,000 to $31,250.</p>
                  <div className="bg-background rounded-lg p-3 font-mono text-sm">
                    <div>Original: $25,000</div>
                    <div>New: $31,250</div>
                    <div className="text-emerald-600 font-bold">Increase: +25%</div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    Population Growth
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">City population grew from 500,000 to 525,000.</p>
                  <div className="bg-background rounded-lg p-3 font-mono text-sm">
                    <div>Original: 500,000</div>
                    <div>New: 525,000</div>
                    <div className="text-emerald-600 font-bold">Increase: +5%</div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. FAQ ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <FaqItem
                  q="Can percentage increase be more than 100%?"
                  a="Yes! A percentage increase can exceed 100%. For example, if a value doubles from 50 to 100, that's a 100% increase. If it triples from 50 to 150, that's a 200% increase. There's no upper limit on percentage increase."
                />
                <FaqItem
                  q="What if the original value is negative?"
                  a="The formula handles negative original values correctly by using the absolute value in the denominator. For example, if a business loss improves from -$5,000 to -$2,000, that's a 60% increase (improvement)."
                />
                <FaqItem
                  q="How is percentage increase different from percentage change?"
                  a="Percentage increase specifically measures growth from an original value to a new value. Percentage change can be either positive (increase) or negative (decrease). This calculator focuses on increases, but will show negative results if the new value is actually lower."
                />
                <FaqItem
                  q="What's the difference between percentage increase and markup?"
                  a="Percentage increase measures how much something has grown. Markup is the percentage added to cost to determine selling price. For example, a 50% markup on a $10 cost item gives a $15 selling price (50% increase from cost)."
                />
              </div>
            </section>

          </div>

          {/* ── RIGHT COLUMN (Sidebar) ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Share */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Share This Tool
              </h3>
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            {/* Related Tools */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Related Tools</h3>
              <div className="space-y-3">
                {RELATED_TOOLS.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/math/${tool.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `hsl(${tool.color}, 70%, 95%)`, color: `hsl(${tool.color}, 70%, 40%)` }}
                    >
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {tool.benefit}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}
