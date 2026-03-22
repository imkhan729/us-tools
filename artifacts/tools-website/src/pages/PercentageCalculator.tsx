import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Percent, Calculator, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Scale, BarChart3, Lightbulb, Copy, Check,
} from "lucide-react";

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

function useCalc3() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const result = useMemo(() => {
    const px = parseFloat(x), py = parseFloat(y);
    if (isNaN(px) || isNaN(py) || px === 0) return null;
    return ((py - px) / Math.abs(px)) * 100;
  }, [x, y]);
  return { x, setX, y, setY, result };
}

// ── Result Insight Component ──
function ResultInsight({ type, result, inputs }: { type: 1 | 2 | 3; result: number | null; inputs: { x: string; y: string } }) {
  if (result === null) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 4 });

  let message = "";
  if (type === 1) {
    message = `${inputs.x}% of ${inputs.y} is ${fmt(result)}. This means if you take ${inputs.x} out of every 100 parts of ${inputs.y}, you get ${fmt(result)}.`;
  } else if (type === 2) {
    message = `${inputs.x} is ${fmt(result)}% of ${inputs.y}. This means ${inputs.x} represents about ${fmt(result)} out of every 100 units of ${inputs.y}.`;
  } else {
    const direction = result > 0 ? "increase" : result < 0 ? "decrease" : "no change";
    message = `There is a ${fmt(Math.abs(result))}% ${direction} from ${inputs.x} to ${inputs.y}. ${result > 0 ? "The value went up." : result < 0 ? "The value went down." : "The value stayed the same."}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
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

// ── Related Tool Card ──
const RELATED_TOOLS = [
  { title: "Percentage Increase Calculator", slug: "percentage-increase-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152 },
  { title: "Percentage Decrease Calculator", slug: "percentage-decrease-calculator", icon: <TrendingUp className="w-5 h-5 rotate-180" />, color: 340 },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25 },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Scale className="w-5 h-5" />, color: 265 },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 217 },
  { title: "Percentage Difference Calculator", slug: "percentage-difference-calculator", icon: <Percent className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function PercentageCalculator() {
  const calc1 = useCalc1();
  const calc2 = useCalc2();
  const calc3 = useCalc3();
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
        title="Percentage Calculator - Free Online Tool | US Online Tools"
        description="Free online percentage calculator. Calculate what percent X is of Y, find percentage change, increase and decrease. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── 1. BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Percentage Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Calculator className="w-3.5 h-3.5" />
                Math & Calculators
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Percentage Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate percentages instantly — find what percent X is of Y, determine percentage change, and more. Free, accurate, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter your values below — results update as you type. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
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

              {/* Calculator 3: Percentage Change */}
              <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">3</div>
                  <h3 className="text-lg font-bold text-foreground">Percentage Change from X to Y</h3>
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
                  <div className={`tool-calc-result flex-1 w-full ${calc3.result !== null && calc3.result >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {calc3.result !== null ? `${calc3.result > 0 ? "+" : ""}${fmt(calc3.result)}%` : "--"}
                  </div>
                </div>
                <ResultInsight type={3} result={calc3.result} inputs={{ x: calc3.x, y: calc3.y }} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">What is X% of Y?</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Result = (X / 100) × Y</code>. For example, 15% of 200 = (15/100) × 200 = 30.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">X is what percent of Y?</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Result = (X / Y) × 100</code>. For example, 25 is what % of 200? → (25/200) × 100 = 12.5%.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Percentage Change</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Uses the formula: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Change = ((Y - X) / |X|) × 100</code>. For example, from 80 to 100 → ((100-80)/80) × 100 = 25% increase.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Shopping Discount</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A jacket costs $120 and has a 25% discount. What's the discount amount? → 25% of 120 = <strong className="text-foreground">$30 off</strong>. You pay $90.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Exam Score</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">You scored 42 out of 50 on a test. What's your percentage? → 42 is what % of 50 = <strong className="text-foreground">84%</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Salary Increase</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Your salary went from $50,000 to $55,000. What's the raise? → Percentage change = <strong className="text-foreground">+10%</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Restaurant Tip</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Your bill is $85 and you want to tip 18%. How much? → 18% of 85 = <strong className="text-foreground">$15.30</strong>.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate to 4 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads needed" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Three calculators in one tool" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What is a Percentage?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  A percentage is a way of expressing a number as a fraction of 100. The word comes from the Latin <em>"per centum"</em>, meaning "by the hundred." When you say 45%, you mean 45 out of every 100.
                </p>
                <p>
                  Percentages are everywhere in daily life — from calculating discounts and tips to understanding interest rates, tax, grades, and data. This calculator makes it easy to handle all common percentage calculations without any manual math.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use a Percentage Calculator?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Finding how much you save during a sale (e.g., 30% off $150)",
                    "Calculating exam scores or grades (e.g., 38 out of 45)",
                    "Tracking investment growth or portfolio changes",
                    "Working out tips at restaurants",
                    "Comparing price changes over time",
                    "Business metrics like profit margins and conversion rates",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-foreground pt-2">Quick Mental Math Tips</h3>
                <p>
                  To find <strong>10%</strong> of any number, simply move the decimal point one place to the left. For <strong>5%</strong>, take half of 10%. For <strong>20%</strong>, double 10%. For <strong>1%</strong>, divide by 100. These tricks let you estimate percentages quickly in your head.
                </p>
                <p>
                  For example, 15% tip on a $60 bill: 10% = $6, plus 5% = $3, so 15% = $9. Quick and easy.
                </p>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I calculate a percentage of a number?"
                  a="Divide the percentage by 100, then multiply by the number. For example, 20% of 150 = (20/100) × 150 = 30. Our calculator does this instantly — just enter the values."
                />
                <FaqItem
                  q="What is percentage change and how is it calculated?"
                  a="Percentage change shows how much a value increased or decreased relative to its original amount. Formula: ((New Value - Old Value) / |Old Value|) × 100. A positive result means increase, negative means decrease."
                />
                <FaqItem
                  q="Is this percentage calculator accurate?"
                  a="Yes, it calculates results accurate to 4 decimal places using standard mathematical formulas. Results update in real-time as you type."
                />
                <FaqItem
                  q="Can I use this for business calculations?"
                  a="Absolutely. This calculator is great for profit margins, markups, discounts, sales tax, conversion rates, growth metrics, and any business scenario involving percentages."
                />
                <FaqItem
                  q="Is this calculator really free?"
                  a="100% free with no ads, no signup, and no data collection. It runs entirely in your browser — your numbers never leave your device."
                />
                <FaqItem
                  q="What's the difference between percentage increase and percentage change?"
                  a="Percentage increase specifically measures growth (positive change), while percentage change covers both increases and decreases. Our third calculator handles both — positive results show increase, negative shows decrease."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Calculators?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including financial calculators, unit converters, developer tools, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others calculate percentages easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
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
