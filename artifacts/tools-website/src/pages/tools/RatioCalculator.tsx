import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  Calculator, Lightbulb, Copy, Check,
  Scale, Percent, BookOpen, Activity, Hash, Target,
  BadgeCheck, Lock, Star,
} from "lucide-react";

// ── Calculator Logic ──
type Mode = "simplify" | "equivalent" | "proportion" | "scale";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a * 1e6));
  b = Math.abs(Math.round(b * 1e6));
  while (b) { [a, b] = [b, a % b]; }
  return a / 1e6;
}

function fmtRatio(a: number, b: number): string {
  if (a === 0 && b === 0) return "0 : 0";
  const g = gcd(a, b);
  return `${parseFloat((a / g).toPrecision(10))} : ${parseFloat((b / g).toPrecision(10))}`;
}

function useRatioCalculator() {
  const [mode, setMode] = useState<Mode>("simplify");
  // Simplify
  const [sa, setSa] = useState("12");
  const [sb, setSb] = useState("8");
  // Equivalent
  const [ea, setEa] = useState("3");
  const [eb, setEb] = useState("4");
  const [emul, setEmul] = useState("5");
  // Proportion A:B = C:?
  const [pa, setPa] = useState("2");
  const [pb, setPb] = useState("3");
  const [pc, setPc] = useState("8");
  // Scale
  const [sca, setSca] = useState("3");
  const [scb, setScb] = useState("5");
  const [scfactor, setScfactor] = useState("3");

  const simplifyResult = useMemo(() => {
    const a = parseFloat(sa), b = parseFloat(sb);
    if (!isFinite(a) || !isFinite(b) || a < 0 || b < 0) return null;
    const g = gcd(a, b);
    const ra = parseFloat((a / g).toPrecision(10));
    const rb = parseFloat((b / g).toPrecision(10));
    const total = a + b;
    return {
      simplified: `${ra} : ${rb}`,
      pctA: total > 0 ? parseFloat(((a / total) * 100).toFixed(2)) : 0,
      pctB: total > 0 ? parseFloat(((b / total) * 100).toFixed(2)) : 0,
      decimal: parseFloat((a / b).toPrecision(6))
    };
  }, [sa, sb]);

  const equivalentResult = useMemo(() => {
    const a = parseFloat(ea), b = parseFloat(eb), m = parseFloat(emul);
    if (!isFinite(a) || !isFinite(b) || !isFinite(m)) return null;
    return { a: parseFloat((a * m).toPrecision(10)), b: parseFloat((b * m).toPrecision(10)) };
  }, [ea, eb, emul]);

  const proportionResult = useMemo(() => {
    const a = parseFloat(pa), b = parseFloat(pb), c = parseFloat(pc);
    if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) return null;
    return { d: parseFloat(((b * c) / a).toPrecision(10)) };
  }, [pa, pb, pc]);

  const scaleResult = useMemo(() => {
    const a = parseFloat(sca), b = parseFloat(scb), f = parseFloat(scfactor);
    if (!isFinite(a) || !isFinite(b) || !isFinite(f)) return null;
    return { a: parseFloat((a * f).toPrecision(10)), b: parseFloat((b * f).toPrecision(10)) };
  }, [sca, scb, scfactor]);

  return {
    mode, setMode,
    sa, setSa, sb, setSb,
    ea, setEa, eb, setEb, emul, setEmul,
    pa, setPa, pb, setPb, pc, setPc,
    sca, setSca, scb, setScb, scfactor, setScfactor,
    simplifyResult, equivalentResult, proportionResult, scaleResult
  };
}

// ── Result Insight Component ──
function ResultInsight({ mode, result }: { mode: Mode, result: any }) {
  if (!result) return null;

  let message = "";
  if (mode === "simplify") {
    message = `The ratio ${result.simplified} represents the simplified form. Part A makes up ${result.pctA}% of the total, while part B makes up ${result.pctB}%. The decimal equivalent is ${result.decimal}.`;
  } else if (mode === "equivalent") {
    message = `The equivalent ratio is ${result.a} : ${result.b}. This maintains the same proportional relationship as the original ratio.`;
  } else if (mode === "proportion") {
    message = `In the proportion, the missing value D equals ${result.d}. This satisfies the equation A:B = C:D where cross-multiplication gives A×D = B×C.`;
  } else if (mode === "scale") {
    message = `The scaled ratio is ${result.a} : ${result.b}. This maintains the same proportional relationship but at a different magnitude.`;
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
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 217, benefit: "Calculate percentages and ratios" },
  { title: "Fraction to Decimal", slug: "fraction-to-decimal-calculator", icon: <Hash className="w-5 h-5" />, color: 152, benefit: "Convert fractions to decimals" },
  { title: "Average Calculator", slug: "average-calculator", icon: <Activity className="w-5 h-5" />, color: 265, benefit: "Mean, median, mode calculator" },
  { title: "Proportion Calculator", slug: "proportion-calculator", icon: <Target className="w-5 h-5" />, color: 25, benefit: "Solve proportional equations" },
  { title: "Decimal to Fraction", slug: "decimal-to-fraction-calculator", icon: <BookOpen className="w-5 h-5" />, color: 340, benefit: "Convert decimals to fractions" },
  { title: "GCD Calculator", slug: "online-gcd-calculator", icon: <Calculator className="w-5 h-5" />, color: 45, benefit: "Find greatest common divisor" },
];

// ── Main Component ──
export default function RatioCalculator() {
  const calc = useRatioCalculator();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS: { key: Mode; label: string }[] = [
    { key: "simplify", label: "Simplify Ratio" },
    { key: "equivalent", label: "Equivalent Ratio" },
    { key: "proportion", label: "Solve Proportion" },
    { key: "scale", label: "Scale Ratio" },
  ];

  return (
    <Layout>
      <SEO
        title="Ratio Calculator – Simplify, Solve & Scale Ratios | US Online Tools"
        description="Free online ratio calculator. Simplify ratios, find equivalent ratios, solve proportions (A:B = C:?), and scale ratios up or down. Perfect for math, cooking, and engineering."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Ratio Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Ratio Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Simplify ratios, find equivalent ratios, solve proportions, and scale ratios up or down. Perfect for math homework, cooking recipes, and engineering calculations.
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
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ratio Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Calculator */}
                  <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">Calculate Ratios</h3>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 bg-muted/60 rounded-xl p-1">
                      {TABS.map(t => (
                        <button key={t.key} onClick={() => calc.setMode(t.key)}
                          className={`flex-1 min-w-[130px] py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${calc.mode === t.key ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Simplify */}
                    {calc.mode === "simplify" && (
                      <div>
                        <div className="flex items-center gap-3 mb-5 justify-center">
                          <span className="text-sm font-semibold text-muted-foreground">Simplify</span>
                          <input
                            type="number"
                            placeholder="12"
                            className="tool-calc-input w-24"
                            value={calc.sa}
                            onChange={e => calc.setSa(e.target.value)}
                          />
                          <span className="text-lg font-black text-muted-foreground">:</span>
                          <input
                            type="number"
                            placeholder="8"
                            className="tool-calc-input w-24"
                            value={calc.sb}
                            onChange={e => calc.setSb(e.target.value)}
                          />
                        </div>
                        {calc.simplifyResult && (
                          <div className="space-y-4">
                            <div className="tool-calc-result flex-1 w-full text-center">
                              <p className="text-xs text-muted-foreground mb-1">Simplified Ratio</p>
                              <p className="text-2xl font-bold">{calc.simplifyResult.simplified}</p>
                            </div>
                            <ResultInsight mode={calc.mode} result={calc.simplifyResult} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Equivalent */}
                    {calc.mode === "equivalent" && (
                      <div>
                        <div className="flex items-center gap-3 mb-5 justify-center">
                          <span className="text-sm font-semibold text-muted-foreground">Find equivalent of</span>
                          <input
                            type="number"
                            placeholder="3"
                            className="tool-calc-input w-20"
                            value={calc.ea}
                            onChange={e => calc.setEa(e.target.value)}
                          />
                          <span className="text-lg font-black text-muted-foreground">:</span>
                          <input
                            type="number"
                            placeholder="4"
                            className="tool-calc-input w-20"
                            value={calc.eb}
                            onChange={e => calc.setEb(e.target.value)}
                          />
                          <span className="text-sm font-semibold text-muted-foreground">multiplied by</span>
                          <input
                            type="number"
                            placeholder="5"
                            className="tool-calc-input w-20"
                            value={calc.emul}
                            onChange={e => calc.setEmul(e.target.value)}
                          />
                        </div>
                        {calc.equivalentResult && (
                          <div className="space-y-4">
                            <div className="tool-calc-result flex-1 w-full text-center">
                              <p className="text-xs text-muted-foreground mb-1">Equivalent Ratio</p>
                              <p className="text-2xl font-bold">{calc.equivalentResult.a} : {calc.equivalentResult.b}</p>
                            </div>
                            <ResultInsight mode={calc.mode} result={calc.equivalentResult} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Proportion */}
                    {calc.mode === "proportion" && (
                      <div>
                        <div className="flex items-center gap-3 mb-5 justify-center">
                          <input
                            type="number"
                            placeholder="2"
                            className="tool-calc-input w-20"
                            value={calc.pa}
                            onChange={e => calc.setPa(e.target.value)}
                          />
                          <span className="text-lg font-black text-muted-foreground">:</span>
                          <input
                            type="number"
                            placeholder="3"
                            className="tool-calc-input w-20"
                            value={calc.pb}
                            onChange={e => calc.setPb(e.target.value)}
                          />
                          <span className="text-lg font-black text-muted-foreground">=</span>
                          <input
                            type="number"
                            placeholder="8"
                            className="tool-calc-input w-20"
                            value={calc.pc}
                            onChange={e => calc.setPc(e.target.value)}
                          />
                          <span className="text-lg font-black text-muted-foreground">:</span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">?</span>
                        </div>
                        {calc.proportionResult && (
                          <div className="space-y-4">
                            <div className="tool-calc-result flex-1 w-full text-center">
                              <p className="text-xs text-muted-foreground mb-1">Missing Value (D)</p>
                              <p className="text-2xl font-bold">{calc.proportionResult.d}</p>
                            </div>
                            <ResultInsight mode={calc.mode} result={calc.proportionResult} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Scale */}
                    {calc.mode === "scale" && (
                      <div>
                        <div className="flex items-center gap-3 mb-5 justify-center">
                          <span className="text-sm font-semibold text-muted-foreground">Scale</span>
                          <input
                            type="number"
                            placeholder="3"
                            className="tool-calc-input w-20"
                            value={calc.sca}
                            onChange={e => calc.setSca(e.target.value)}
                          />
                          <span className="text-lg font-black text-muted-foreground">:</span>
                          <input
                            type="number"
                            placeholder="5"
                            className="tool-calc-input w-20"
                            value={calc.scb}
                            onChange={e => calc.setScb(e.target.value)}
                          />
                          <span className="text-sm font-semibold text-muted-foreground">by factor</span>
                          <input
                            type="number"
                            placeholder="3"
                            className="tool-calc-input w-20"
                            value={calc.scfactor}
                            onChange={e => calc.setScfactor(e.target.value)}
                          />
                        </div>
                        {calc.scaleResult && (
                          <div className="space-y-4">
                            <div className="tool-calc-result flex-1 w-full text-center">
                              <p className="text-xs text-muted-foreground mb-1">Scaled Ratio</p>
                              <p className="text-2xl font-bold">{calc.scaleResult.a} : {calc.scaleResult.b}</p>
                            </div>
                            <ResultInsight mode={calc.mode} result={calc.scaleResult} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Ratio Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Ratios compare two or more quantities and are fundamental in mathematics, cooking, engineering, and finance. This calculator handles four common ratio operations with step-by-step explanations.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your operation</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Select from Simplify Ratio, Equivalent Ratio, Solve Proportion, or Scale Ratio using the tabs above.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your values</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Input the numbers for your chosen operation. The calculator updates automatically as you type.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      View your calculated ratio and read the insight explanation below for additional context.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Ratio Concepts</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">A:B</span>
                    <span className="flex-1">Ratio notation comparing quantity A to quantity B</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">GCD</span>
                    <span className="flex-1">Greatest Common Divisor - used to simplify ratios</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">A:B=C:D</span>
                    <span className="flex-1">Proportion where A×D = B×C (cross-multiplication)</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">Simplifying ratios:</strong> Divide both parts by their GCD to get the simplest form.</p>
                  <p><strong className="text-foreground">Equivalent ratios:</strong> Multiply both parts by the same number to maintain proportion.</p>
                  <p><strong className="text-foreground">Proportions:</strong> Two ratios are equal when cross-multiplication yields the same result.</p>
                  <p><strong className="text-foreground">Scaling:</strong> Multiply both parts by a factor to change magnitude while preserving ratio.</p>
                </div>
              </div>
            </section>

            {/* ── 4. EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Ratio Calculator Examples</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <h3 className="font-bold text-foreground mb-3">Recipe Scaling</h3>
                  <p className="text-sm text-muted-foreground mb-3">A cookie recipe calls for 2:3 (flour:sugar). Scale it for 4 cups of flour:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>2:3 = 4:x</p>
                    <p>x = (3 × 4) ÷ 2 = 6</p>
                    <p><strong>Result: 4:6 ratio</strong></p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <h3 className="font-bold text-foreground mb-3">Ratio Simplification</h3>
                  <p className="text-sm text-muted-foreground mb-3">Simplify the ratio 15:20:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>GCD(15,20) = 5</p>
                    <p>15÷5 = 3, 20÷5 = 4</p>
                    <p><strong>Result: 3:4 ratio</strong></p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h3 className="font-bold text-foreground mb-3">Map Scale</h3>
                  <p className="text-sm text-muted-foreground mb-3">A map uses 1:1000 scale. Find distance for 5cm on map:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>1cm on map = 1000cm actual</p>
                    <p>5cm on map = 5000cm actual</p>
                    <p><strong>Result: 5000cm (50 meters)</strong></p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <h3 className="font-bold text-foreground mb-3">Concrete Mix</h3>
                  <p className="text-sm text-muted-foreground mb-3">Mix concrete in 1:2:4 ratio (cement:sand:gravel):</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>1 part cement</p>
                    <p>2 parts sand</p>
                    <p>4 parts gravel</p>
                    <p><strong>Total: 7 parts</strong></p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. FAQ ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <FaqItem
                  q="How do you simplify a ratio?"
                  a="Divide both parts of the ratio by their Greatest Common Divisor (GCD). For 12:8, GCD(12,8)=4, so 12:8 = 3:2. The simplified ratio has the same relationship but uses the smallest whole numbers."
                />
                <FaqItem
                  q="How do you solve a proportion?"
                  a="In a proportion A:B = C:D, the cross-products are equal: A×D = B×C. To find the missing value, isolate it. For example: 2:3 = x:12 → x = (2×12)/3 = 8."
                />
                <FaqItem
                  q="What is the difference between a ratio and a fraction?"
                  a="A fraction represents a part of a whole (3/4 = three-quarters of something). A ratio compares two separate quantities (3:4 = for every 3 of A there are 4 of B). Fractions are a special case of ratios."
                />
                <FaqItem
                  q="How do you scale a ratio up or down?"
                  a="Multiply or divide both parts by the same number. If a recipe calls for 2:3 (flour:sugar) and you want to double it, multiply both by 2 to get 4:6 (which simplifies back to 2:3)."
                />
                <FaqItem
                  q="What is a ratio in baking or cooking?"
                  a="Cooking ratios help scale recipes. The classic bread ratio is 5:3 (flour:water) by weight. The pasta dough ratio is 2:1 (flour:eggs). Knowing ratios lets you scale any recipe up or down correctly."
                />
                <FaqItem
                  q="How do you express a ratio as a percentage?"
                  a="In ratio A:B, the total is A+B. A% = A/(A+B) × 100, B% = B/(A+B) × 100. For example, 3:7 → 3 is 30% and 7 is 70% of the total."
                />
              </div>
            </section>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* ── 6. RELATED TOOLS ── */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Related Tools</h3>
              <div className="space-y-3">
                {RELATED_TOOLS.map((tool, i) => (
                  <Link key={i} href={`/tools/${tool.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: `hsl(${tool.color}, 70%, 20%)` }}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{tool.title}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{tool.benefit}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>

            {/* ── 7. SHARE ── */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Share This Tool</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
}
