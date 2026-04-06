import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Shield, Smartphone, Lock, BadgeCheck,
  Calculator, Lightbulb, Copy, Check, Star,
  Radical, Hash, Sigma, FlaskConical, BarChart3, Percent,
} from "lucide-react";

type NegativeSqrtResult = {
  error: "negative";
  n: number;
};

type PositiveSqrtResult = {
  sqrt: number;
  isPerfect: boolean;
  n: number;
  nearestBelow: number;
  nearestAbove: number;
  floorSqrt: number;
  squared: number;
  cubeRoot: number;
};

// ── Calculator Logic ──
function useSqrtCalc() {
  const [input, setInput] = useState("");

  const result = useMemo<PositiveSqrtResult | NegativeSqrtResult | null>(() => {
    const n = parseFloat(input);
    if (isNaN(n)) return null;
    if (n < 0) return { error: "negative", n };
    const sqrt = Math.sqrt(n);
    const isPerfect = Number.isInteger(sqrt);
    const floorSqrt = Math.floor(sqrt);
    const nearestBelow = floorSqrt * floorSqrt;
    const nearestAbove = (floorSqrt + 1) * (floorSqrt + 1);
    const squared = n * n;
    const cubeRoot = Math.cbrt(n);
    return { sqrt, isPerfect, n, nearestBelow, nearestAbove, floorSqrt, squared, cubeRoot };
  }, [input]);

  return { input, setInput, result };
}

type RealSqrtResult = PositiveSqrtResult;

// ── Result Insight ──
function ResultInsight({ result }: { result: ReturnType<typeof useSqrtCalc>["result"] }) {
  if (!result) return null;
  if ("error" in result && result.error === "negative") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <div className="flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            The square root of a negative number is not a real number — it requires imaginary numbers (denoted <strong>i</strong>). For example, √−9 = 3i. Enter a non-negative value to get a real result.
          </p>
        </div>
      </motion.div>
    );
  }
  if ("sqrt" in result) {
    const realResult: RealSqrtResult = result;
    const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });
    const message = realResult.isPerfect
      ? `√${realResult.n} = ${fmt(realResult.sqrt)} — this is a perfect square. Its square (${realResult.n}²) is ${fmt(realResult.squared)}.`
      : `√${realResult.n} ≈ ${fmt(realResult.sqrt)} — this is an irrational number. It lies between √${realResult.nearestBelow} = ${realResult.floorSqrt} and √${realResult.nearestAbove} = ${realResult.floorSqrt + 1}.`;
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
        <div className="flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
        </div>
      </motion.div>
    );
  }
  return null;
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-indigo-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
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
  { title: "Cube Root Calculator", slug: "cube-root-calculator", icon: <Radical className="w-5 h-5" />, color: 265, benefit: "Find ∛n for any number instantly" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <FlaskConical className="w-5 h-5" />, color: 217, benefit: "Advanced math: trig, log, powers" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Calculate any percentage instantly" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 25, benefit: "Mean, median, mode in one tool" },
  { title: "Standard Deviation", slug: "online-standard-deviation-calculator", icon: <Sigma className="w-5 h-5" />, color: 340, benefit: "Variance and spread of datasets" },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Hash className="w-5 h-5" />, color: 45, benefit: "Simplify ratios and proportions" },
];

// ── Main Component ──
export default function SquareRootCalculator() {
  const calc = useSqrtCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });
  const fmtShort = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 4 });

  const sqrtResult = calc.result && !("error" in calc.result) ? calc.result : null;

  return (
    <Layout>
      <SEO
        title="Square Root Calculator – Find √n Instantly, Free | US Online Tools"
        description="Free online square root calculator. Enter any positive number and instantly get its square root accurate to 8 decimal places. Also shows perfect square check, cube root, and nearest perfect squares. No signup needed."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Square Root Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Square Root Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Enter any positive number and instantly get its exact square root — accurate to 8 decimal places. See whether it's a perfect square, view nearest perfect squares, and get the cube root all in one place.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
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
            Category: Math &amp; Calculators &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <Radical className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Square Root Calculator</p>
                      <p className="text-sm text-muted-foreground">Result updates instantly as you type.</p>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground">Enter a Number</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center gap-2 text-lg font-bold text-indigo-500">√</div>
                      <input
                        type="number"
                        placeholder="e.g. 144"
                        className="tool-calc-input flex-1 w-full"
                        value={calc.input}
                        onChange={e => calc.setInput(e.target.value)}
                        min={0}
                      />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-indigo-600 dark:text-indigo-400">
                        {sqrtResult ? fmt(sqrtResult.sqrt) : (calc.result && "error" in calc.result ? "Not real" : "--")}
                      </div>
                    </div>
                    <ResultInsight result={calc.result} />
                  </div>

                  {/* Extra info cards */}
                  {sqrtResult && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Square Root</p>
                        <p className="text-base font-black text-indigo-600 dark:text-indigo-400">{fmtShort(sqrtResult.sqrt)}</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Perfect Square?</p>
                        <p className={`text-base font-black ${sqrtResult.isPerfect ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                          {sqrtResult.isPerfect ? "Yes ✓" : "No"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Cube Root ∛n</p>
                        <p className="text-base font-black text-violet-600 dark:text-violet-400">{fmtShort(sqrtResult.cubeRoot)}</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">n Squared (n²)</p>
                        <p className="text-base font-black text-foreground">{sqrtResult.squared.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Perfect squares reference */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Common Perfect Squares</p>
                    <div className="flex flex-wrap gap-2">
                      {[1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225].map(n => (
                        <button
                          key={n}
                          onClick={() => calc.setInput(String(n))}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 transition-all"
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Square Root Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This calculator is designed for anyone who needs square roots quickly — students working through algebra, engineers verifying dimensions, developers checking mathematical logic, or anyone curious about a number. It goes beyond a basic √ key by also showing whether your number is a perfect square, its cube root, and the nearest perfect squares for context.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Type any non-negative number into the input field</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter any number — whole numbers like 144 or 256, decimals like 2.5 or 0.0625, or large values like 1,000,000. The calculator handles all of them. Negative numbers are flagged with an explanatory message since their square roots are imaginary (they require complex number notation). You can also click any of the Quick Pick buttons (1, 4, 9, 16, …) to instantly load common perfect squares.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the main result and the four stat cards</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The main result shows √n to up to 8 decimal places — precise enough for science, engineering, and finance. Below the result, four stat cards give you additional context: the rounded square root, whether the number is a perfect square, the cube root (∛n), and n² (the number squared). These extra values save you from needing a second tool or a manual calculation.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use the plain-English insight to understand the result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Beneath the input, a sentence explains whether the result is exact or irrational and where it falls relative to the nearest perfect squares. For example, √50 ≈ 7.0711 lies between √49 = 7 and √64 = 8. This framing helps students estimate without a calculator and verify that results are in the right ballpark before using them in equations.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Key Formula</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-500 font-bold w-4 flex-shrink-0">√</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">√n = n^(1/2) = the number whose square equals n</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-violet-500 font-bold w-4 flex-shrink-0">∛</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">∛n = n^(1/3) = the number whose cube equals n</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">The square root</strong> of n is the non-negative value x such that x × x = n. Every positive number has exactly one positive square root (called the principal root) and one negative square root. This calculator always returns the principal (positive) root. If you need both roots, remember the second one is simply −√n.
                  </p>
                  <p>
                    <strong className="text-foreground">Perfect squares</strong> are integers whose square root is also an integer: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, and so on. For all other positive integers, the square root is irrational — it cannot be expressed as a simple fraction and its decimal expansion never repeats or terminates. The most famous example is √2 ≈ 1.41421356…
                  </p>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to understand your square root result:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Perfect square (e.g. √144 = 12) — Exact whole number</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The result is a clean integer with no decimal. Perfect squares arise naturally in geometry (areas of square rooms), computer science (image dimensions, hash tables), and everyday measurement. When you see a perfect square result, you can use it directly without any rounding or approximation. Common examples include 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, and all squares of whole numbers up to any size.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Irrational result (e.g. √2 ≈ 1.41421356) — Infinite decimals</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The decimal portion never ends or repeats. These are irrational numbers — they cannot be written as a fraction of two integers. In practice, you round to the precision you need (4 decimal places for most engineering, 2 for everyday use). For precise work, always carry more decimal places than you need and round at the final step, not in intermediate calculations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Decimal input (e.g. √0.25 = 0.5) — Can produce clean output</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Some decimals are perfect squares of other decimals. √0.25 = 0.5, √0.0625 = 0.25, √2.25 = 1.5. These appear in financial calculations (square-rooting variance to get standard deviation) and signal processing. The calculator handles all of them correctly — just enter the decimal value as-is.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Negative input — Imaginary result (not shown)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">√−4 = 2i, not a real number. The calculator shows a warning rather than an invalid result. Imaginary numbers are essential in electrical engineering (impedance calculations), quantum mechanics, and signal processing, but they require a dedicated complex number calculator for full computation. If you need imaginary roots, use our Scientific Calculator instead.</p>
                  </div>
                </div>
              </div>
            </section>

            <SeoRichContent
              toolName="Square Root Calculator"
              primaryKeyword="square root calculator"
              intro="This square root calculator returns precise real square roots and provides interpretation support for perfect squares and irrational results. It is practical for geometry, statistics, and engineering calculations."
              formulas={[
                { expression: "√n = x  ⟺  x² = n", explanation: "Square root is the inverse of squaring and returns the principal non-negative real root." },
                { expression: "Perfect square: n = k²", explanation: "If n is an integer square, the square root is exact and non-decimal." },
                { expression: "Standard deviation = √variance", explanation: "Square root converts variance back into original measurement units." },
              ]}
              useCases={[
                { title: "Geometry and distance formulas", description: "Used for diagonals, hypotenuse calculations, and area-to-side conversions." },
                { title: "Statistics and analytics", description: "Supports standard deviation and dispersion calculations in data workflows." },
                { title: "Engineering equations", description: "Appears in formulas for energy, velocity, signal models, and physical systems." },
              ]}
              tips={[
                "Use non-negative inputs for real-number outputs in square-root calculations.",
                "Estimate quickly by bracketing values between nearby perfect squares.",
                "Keep extra decimal precision in intermediate steps and round at the end.",
                "Use a complex-number calculator if negative roots are required.",
              ]}
            />

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Input (n)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">√n</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Perfect Square?</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">∛n</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { n: 4, sqrt: "2", perfect: true, cbrt: "1.587", use: "Basic arithmetic" },
                      { n: 9, sqrt: "3", perfect: true, cbrt: "2.080", use: "3×3 square grid" },
                      { n: 2, sqrt: "1.41421356", perfect: false, cbrt: "1.25992", use: "Diagonal of unit square" },
                      { n: 100, sqrt: "10", perfect: true, cbrt: "4.64159", use: "Exam score base" },
                      { n: 144, sqrt: "12", perfect: true, cbrt: "5.24148", use: "Dozen × dozen" },
                      { n: 225, sqrt: "15", perfect: true, cbrt: "6.08220", use: "Pythagorean triple" },
                      { n: 50, sqrt: "7.07106781", perfect: false, cbrt: "3.68403", use: "Distance formula" },
                      { n: 0.25, sqrt: "0.5", perfect: true, cbrt: "0.62996", use: "Variance → std dev" },
                    ].map(row => (
                      <tr key={row.n} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-foreground">{row.n}</td>
                        <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{row.sqrt}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.perfect ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                            {row.perfect ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-violet-600 dark:text-violet-400 text-xs">{row.cbrt}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Geometry: room diagonal.</strong> A square room is 9 meters on each side. The diagonal across the room is √(9² + 9²) = √162 ≈ 12.73 meters. This is the classic Pythagorean theorem in action — the square root is the key step in any diagonal or hypotenuse calculation, from architecture to game development collision detection.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Statistics: standard deviation.</strong> You have a dataset with a variance of 64. The standard deviation is simply √64 = 8. Standard deviation is one of the most-used statistics in science, business analytics, and finance — and it always requires a square root as its final step. This calculator is fast enough to handle this check without pulling up a stats package.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Finance: volatility.</strong> In options pricing (Black-Scholes model), volatility is expressed as an annualized standard deviation. To convert monthly volatility of 0.02 to annual, you multiply by √12 ≈ 3.4641. Time-based volatility scaling always uses square roots because variance (not volatility) scales linearly with time — making √12 a constant that every options trader knows.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Computer science: pixel distance.</strong> The distance between two pixels at coordinates (0,0) and (3,4) is √(3² + 4²) = √(9+16) = √25 = 5. This 3-4-5 Pythagorean triple is the simplest whole-number distance in 2D space and appears constantly in graphics rendering, mapping applications, and UI layout engines. Recognizing perfect squares like 25 lets you skip the calculator entirely.
                </p>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Exactly what I needed for my engineering homework — fast, accurate, and shows the cube root too which saved me a second lookup."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Square Root Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">More than just √n.</strong> Most square root calculators show a single result and nothing else. This tool goes further: it tells you whether the number is a perfect square, shows the cube root alongside it, displays n², and highlights the nearest perfect squares if the result is irrational. That contextual information is what turns a one-second answer into an actual learning moment — or a genuine time-saver for complex work.
                </p>
                <p>
                  <strong className="text-foreground">Precision to 8 decimal places.</strong> The result is computed using JavaScript's native <code className="text-xs bg-muted px-1 py-0.5 rounded">Math.sqrt()</code> function, which uses the IEEE 754 double-precision standard — the same engine as Excel, Python, and most scientific software. This gives you up to 15 significant digits of accuracy, displayed up to 8 decimal places so you can always round to your exact requirement.
                </p>
                <p>
                  <strong className="text-foreground">Quick-pick buttons for the most common inputs.</strong> The first 15 perfect squares (1 through 225) are available as one-click shortcuts below the input. Tap any value to load it instantly — useful for students checking their work, teachers demonstrating patterns, or anyone who needs to reference perfect squares repeatedly without retyping.
                </p>
                <p>
                  <strong className="text-foreground">Completely private — no data sent anywhere.</strong> Your number never leaves your browser. There's no server-side processing, no logging of queries, and no analytics on what you type. This matters for users who handle confidential data — engineers with proprietary dimensions, analysts with financial figures, or students in online exams where browser activity is monitored.
                </p>
                <p>
                  <strong className="text-foreground">Part of a full math suite.</strong> This calculator links to the Cube Root Calculator, Scientific Calculator, Standard Deviation Calculator, and others — all built to the same design standard and precision level. When a single calculation isn't enough, the related tools in the sidebar let you branch into the next step without starting over.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool computes real-valued square roots only. For complex or imaginary roots (inputs less than 0), the calculator displays an explanatory message. For cube roots of negative numbers, the tool correctly returns the negative real root (e.g., ∛−8 = −2). All calculations occur entirely in your browser — no server, no storage, no cookies.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is a square root?"
                  a="The square root of a number n is the value x such that x × x = n. For example, the square root of 25 is 5 because 5 × 5 = 25. Every positive number has two square roots — a positive one (called the principal root) and a negative one. This calculator always returns the positive principal root. The square root symbol √ comes from the Latin word 'radix' meaning root."
                />
                <FaqItem
                  q="What is a perfect square?"
                  a="A perfect square is an integer whose square root is also an integer. The sequence is: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, and so on. These are the squares of 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 respectively. Recognizing perfect squares speeds up mental math and helps verify calculation results in geometry and algebra."
                />
                <FaqItem
                  q="Why is the square root of 2 irrational?"
                  a="A number is irrational if it cannot be expressed as a fraction of two integers. √2 ≈ 1.41421356… was proven irrational by ancient Greek mathematicians around 500 BCE — legend says Hippasus was drowned for revealing this truth, as it upended the Pythagorean belief that all numbers are rational. The proof by contradiction shows that if √2 = p/q in lowest terms, then both p and q must be even — a contradiction. Most square roots of non-perfect-squares are irrational."
                />
                <FaqItem
                  q="How accurate is this calculator?"
                  a="Results are computed using IEEE 754 double-precision floating-point arithmetic, which is accurate to approximately 15–16 significant decimal digits. The result is displayed to up to 8 decimal places. For most practical purposes — engineering, finance, science, and education — this level of precision is more than sufficient. Only highly specialized numerical applications (high-performance computing, cryptography) require higher precision."
                />
                <FaqItem
                  q="Can I calculate the square root of a decimal?"
                  a="Yes — enter any positive decimal such as 2.5, 0.04, or 12.75. The calculator handles these correctly. For example, √0.04 = 0.2, √2.25 = 1.5, and √12.75 ≈ 3.5707. Some decimals produce exact results (like √0.25 = 0.5) because they are perfect squares of other decimals. Others produce irrational decimals, which are displayed to 8 decimal places."
                />
                <FaqItem
                  q="What is the square root of a negative number?"
                  a="In the realm of real numbers, negative numbers have no square root — because any real number squared is always non-negative. In the complex number system, √−n = i√n, where i is the imaginary unit (i² = −1). For example, √−4 = 2i. This calculator operates in real numbers only and shows a warning for negative inputs. For complex arithmetic, use our Scientific Calculator or a dedicated complex number tool."
                />
                <FaqItem
                  q="How do I estimate a square root without a calculator?"
                  a="Find the two perfect squares surrounding your number. For example, to estimate √50: you know √49 = 7 and √64 = 8, so √50 is slightly above 7. A good linear estimate: 7 + (50−49)/(64−49) = 7 + 1/15 ≈ 7.067. The actual value is 7.0711 — very close. This technique (linear interpolation between known perfect squares) was used by engineers before digital calculators and is still useful for quick mental checks."
                />
                <FaqItem
                  q="Is my input data private?"
                  a="Yes. Every calculation runs entirely in your browser using JavaScript. No value you type is sent to any server, stored in any database, or tracked in any analytics system. When you close the tab, your inputs are gone permanently. This tool has no user accounts, no login, and no data collection of any kind."
                />
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including cube roots, scientific calculator, statistics tools, unit converters, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-indigo-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others find square roots instantly.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Use This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-indigo-500/40 flex-shrink-0" />
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
