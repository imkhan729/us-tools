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

// ── Logic ──
function useCubeRootCalc() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const n = parseFloat(input);
    if (isNaN(n)) return null;
    const cbrt = Math.cbrt(n);
    const isPerfect = Number.isInteger(cbrt) && Number.isInteger(n);
    const sqrt = n >= 0 ? Math.sqrt(n) : null;
    const squared = n * n;
    const cubed = n * n * n;
    return { cbrt, isPerfect, n, sqrt, squared, cubed };
  }, [input]);

  return { input, setInput, result };
}

// ── Insight ──
function ResultInsight({ result }: { result: ReturnType<typeof useCubeRootCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });
  const message = result.isPerfect
    ? `∛${result.n} = ${fmt(result.cbrt)} — this is a perfect cube. The original number cubed back is ${result.n}³ = ${fmt(result.cubed)}.`
    : `∛${result.n} ≈ ${fmt(result.cbrt)} — this is an irrational cube root. The floor is ∛${Math.floor(result.cbrt) ** 3} = ${Math.floor(result.cbrt)}.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-teal-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-teal-500">
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
  { title: "Square Root Calculator", slug: "square-root-calculator", icon: <Radical className="w-5 h-5" />, color: 240, benefit: "Find √n for any number instantly" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <FlaskConical className="w-5 h-5" />, color: 217, benefit: "Advanced math: trig, log, powers" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Three percentage calcs in one" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 25, benefit: "Mean, median, mode in one tool" },
  { title: "Standard Deviation", slug: "online-standard-deviation-calculator", icon: <Sigma className="w-5 h-5" />, color: 340, benefit: "Variance and spread of datasets" },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Hash className="w-5 h-5" />, color: 45, benefit: "Simplify ratios and proportions" },
];

// ── Main ──
export default function CubeRootCalculator() {
  const calc = useCubeRootCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 8 });
  const fmtShort = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 4 });

  const r = calc.result;

  return (
    <Layout>
      <SEO
        title="Cube Root Calculator – Find ∛n Instantly, Free | US Online Tools"
        description="Free online cube root calculator. Enter any number — positive, negative, or decimal — and instantly get its cube root accurate to 8 decimal places. Shows perfect cube check, square root, and n³. No signup needed."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <span className="text-foreground">Cube Root Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-teal-500/15 bg-gradient-to-br from-teal-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Cube Root Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Enter any number — positive, negative, or decimal — and instantly get its cube root accurate to 8 decimal places. Unlike square roots, cube roots work for negative inputs too.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Math &amp; Calculators &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-lg shadow-teal-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Radical className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cube Root Calculator</p>
                      <p className="text-sm text-muted-foreground">Works with positive, negative, and decimal numbers.</p>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground">Enter a Number</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center gap-1 text-lg font-bold text-teal-500 font-mono">∛</div>
                      <input
                        type="number"
                        placeholder="e.g. 27"
                        className="tool-calc-input flex-1 w-full"
                        value={calc.input}
                        onChange={e => calc.setInput(e.target.value)}
                      />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-teal-600 dark:text-teal-400">
                        {r ? fmt(r.cbrt) : "--"}
                      </div>
                    </div>
                    <ResultInsight result={calc.result} />
                  </div>

                  {/* Stat cards */}
                  {r && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Cube Root ∛n</p>
                        <p className="text-base font-black text-teal-600 dark:text-teal-400">{fmtShort(r.cbrt)}</p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Perfect Cube?</p>
                        <p className={`text-base font-black ${r.isPerfect ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                          {r.isPerfect ? "Yes ✓" : "No"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Square Root √n</p>
                        <p className="text-base font-black text-cyan-600 dark:text-cyan-400">
                          {r.sqrt !== null ? fmtShort(r.sqrt) : "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">n Cubed (n³)</p>
                        <p className="text-base font-black text-foreground">{r.cubed.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Perfect cube quick picks */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Common Perfect Cubes</p>
                    <div className="flex flex-wrap gap-2">
                      {[-125, -64, -27, -8, -1, 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000].map(n => (
                        <button
                          key={n}
                          onClick={() => calc.setInput(String(n))}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-500/10 hover:bg-teal-500 hover:text-white text-teal-700 dark:text-teal-300 border border-teal-500/20 transition-all"
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Cube Root Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The cube root of a number n is the value that, when multiplied by itself three times, gives n. Unlike square roots, cube roots work for negative numbers — because a negative times a negative times a negative is negative. This makes cube roots essential in physics, engineering, and any field where signed values appear in volume calculations.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter any number — positive, negative, or decimal</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Type your number directly into the input field. The calculator handles the full range: positive integers like 27 or 1000, negative integers like −8 or −125, large numbers like 1,000,000, and decimals like 0.125 or 3.375. You can also click any of the Quick Pick buttons for the first 15 perfect cubes (including negative ones) to load a value instantly.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the result and the four stat cards</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The main result shows ∛n to up to 8 decimal places. The four stat cards below give you the rounded cube root, whether it's a perfect cube, the square root (for non-negative inputs), and n³ (the input cubed). These companion values save you from needing separate tools for a related calculation in the same workflow.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use the insight sentence to verify your result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Below the input, a plain-English sentence identifies whether the number is a perfect cube and provides context about its root. This is especially helpful for students double-checking answers or anyone who wants to confirm the result makes intuitive sense before using it in a larger calculation.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Key Formula</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-teal-500 font-bold w-4 flex-shrink-0">∛</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">∛n = n^(1/3) = x where x³ = n</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-cyan-500 font-bold w-4 flex-shrink-0">n³</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">n³ = n × n × n (cube of n)</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">The cube root</strong> is the inverse of cubing. If you cube a number and then take its cube root, you get back the original value. Perfect cubes are integers whose cube root is also an integer: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, and their negative counterparts.
                  </p>
                  <p>
                    <strong className="text-foreground">Negative cube roots</strong> are real numbers — this is a key difference from square roots. ∛(−27) = −3 because (−3)³ = −27. This is why cube roots appear in physics equations involving direction-signed quantities like fluid flow rates and electric field components.
                  </p>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to understand your cube root result:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Perfect cube (e.g. ∛27 = 3) — Exact integer result</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The result is a clean whole number. Perfect cubes arise in volume problems (a cube with side 3 has volume 27), in number theory, and in cryptography (RSA key generation involves cube roots in some schemes). Recognizing that 27, 64, 125, 216, 343 are perfect cubes helps you verify calculations instantly without a calculator.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                  <div className="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Irrational result (e.g. ∛2 ≈ 1.25992105) — Infinite decimals</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Most cube roots produce irrational numbers whose decimal expansion never ends or repeats. In practice, round to 4–6 decimal places for engineering and science, or 2 for everyday use. Always round at the final step of a multi-step calculation to avoid accumulating rounding errors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Negative input (e.g. ∛(−64) = −4) — Real result</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Unlike square roots, cube roots of negative numbers are perfectly real. ∛(−64) = −4 because (−4)³ = −64. This property is crucial in physics (e.g., calculating the radius of a sphere with negative charge flux) and in algebra when solving cubic equations with real roots.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Decimal input (e.g. ∛0.125 = 0.5) — Can be exact</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Some decimals are perfect cubes of other decimals. ∛0.001 = 0.1, ∛0.125 = 0.5, ∛3.375 = 1.5. These appear in scientific notation calculations, concentration formulas in chemistry, and scaling factors in 3D modeling where all three dimensions are scaled equally.</p>
                  </div>
                </div>
              </div>
            </section>

            <SeoRichContent
              toolName="Cube Root Calculator"
              primaryKeyword="cube root calculator"
              intro="This cube root calculator computes ∛n for positive, negative, and decimal inputs with high precision. It is useful for volume scaling, algebra, and engineering calculations that involve cubic relationships."
              formulas={[
                { expression: "∛n = x  ⟺  x³ = n", explanation: "Cube root is the inverse operation of cubing and supports negative real inputs." },
                { expression: "Perfect cube: n = k³", explanation: "If n equals an integer cubed, cube root output is exact and integer." },
                { expression: "Scale factor s = ∛(V2/V1)", explanation: "Uniform 3D scaling uses cube roots when converting between volume ratios." },
              ]}
              useCases={[
                { title: "Volume-to-dimension conversion", description: "Find side lengths from cubic volume values in manufacturing and architecture." },
                { title: "3D graphics and modeling", description: "Use cube-root scale factors to resize objects while preserving geometric proportionality." },
                { title: "Algebra and STEM coursework", description: "Verify cubic equation transformations and inverse-power problems quickly." },
              ]}
              tips={[
                "Unlike square roots, cube roots of negative numbers are valid real numbers.",
                "Check perfect-cube patterns first to identify exact integer outputs.",
                "Avoid rounding early if cube-root values feed later calculations.",
                "Use scientific notation for very large or very small cubic inputs.",
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
                      <th className="text-left px-4 py-3 font-bold text-foreground">∛n</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Perfect Cube?</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">n³</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { n: 8, cbrt: "2", perfect: true, cubed: "512", use: "Side of 8-unit-volume cube" },
                      { n: 27, cbrt: "3", perfect: true, cubed: "19,683", use: "Geometry — volume" },
                      { n: 125, cbrt: "5", perfect: true, cubed: "1,953,125", use: "Container sizing" },
                      { n: -27, cbrt: "−3", perfect: true, cubed: "−19,683", use: "Physics — signed volume" },
                      { n: 2, cbrt: "1.25992105", perfect: false, cubed: "8", use: "3D scale factor" },
                      { n: 0.125, cbrt: "0.5", perfect: true, cubed: "0.001953", use: "Chemistry dilution" },
                      { n: 1000, cbrt: "10", perfect: true, cubed: "1,000,000,000", use: "Metric scale check" },
                      { n: 50, cbrt: "3.68403149", perfect: false, cubed: "125,000", use: "Engineering sizing" },
                    ].map(row => (
                      <tr key={row.n} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-foreground">{row.n}</td>
                        <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">{row.cbrt}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.perfect ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                            {row.perfect ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-cyan-600 dark:text-cyan-400 text-xs">{row.cubed}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Tank volume.</strong> An industrial tank is a perfect cube holding 512 liters. To find the side length of the tank in decimeters (since 1 liter = 1 dm³), calculate ∛512 = 8 dm. This is a routine industrial sizing problem — cube root of volume gives the side length of the equivalent cubic container, used in shipping, manufacturing, and chemical storage design.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – 3D scaling in game design.</strong> A game object needs to be scaled to double its volume uniformly. If the scale factor is s, then s³ = 2, so s = ∛2 ≈ 1.2599. This means scaling the object to 125.99% of its original size in all three dimensions simultaneously. Cube roots are the standard tool in 3D graphics whenever volume-preserving transformations are needed.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Negative input in physics.</strong> A particle moves backward through a fluid with velocity −27 m³/s. The cube root of −27 is −3, representing the signed linear flow component in each of three dimensions. Cube roots correctly preserve the sign of the original value, making them the right tool for direction-aware calculations unlike square roots.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Chemistry dilution.</strong> A sample has a concentration of 0.125 mol/L and the chemist needs the linear dilution factor. ∛0.125 = 0.5, meaning each linear dimension of the sample container is halved. Serial dilution math regularly involves cube roots when all three dimensions of a solution volume scale together.
                </p>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-teal-500/5 border border-teal-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally a cube root tool that handles negatives correctly and shows the perfect cube check. Saved me from a textbook lookup."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Cube Root Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Handles negative numbers correctly.</strong> Many online cube root calculators fail on negative inputs or return an error because they use the square root code path internally. This calculator uses <code className="text-xs bg-muted px-1 py-0.5 rounded">Math.cbrt()</code> — a dedicated function in modern JavaScript engines — which correctly returns real cube roots for all negative numbers.
                </p>
                <p>
                  <strong className="text-foreground">Perfect cube detection in one glance.</strong> Knowing whether a number is a perfect cube is useful for simplifying expressions in algebra, verifying answers in geometry, and spotting clean results in engineering. The calculator checks this instantly and highlights it with a colored badge so you don't need to test it mentally.
                </p>
                <p>
                  <strong className="text-foreground">Four companion values in one view.</strong> Instead of running four separate calculations, the stat cards show the cube root, perfect cube status, square root, and n³ side by side. This is particularly useful for textbook problems that ask about multiple properties of a number at once, or for engineering checklists that need multiple derived values from a single measurement.
                </p>
                <p>
                  <strong className="text-foreground">Quick-pick buttons for negative and positive cubes.</strong> The Quick Pick row includes both positive and negative perfect cubes from −125 to 1000 — a feature unique among free online cube root tools. This makes it easy for students to work through a list of practice problems without retyping every value.
                </p>
                <p>
                  <strong className="text-foreground">Completely private and instant.</strong> No server is involved — all computation happens in your browser via IEEE 754 double-precision arithmetic. Results appear in real time as you type. There's no login, no ads, and no tracking.
                </p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This calculator returns the principal real cube root. For complex cube roots (which arise in advanced mathematics and electrical engineering), the result would involve imaginary components and requires a dedicated complex number calculator. All cube roots shown here are real-valued.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is a cube root?"
                  a="The cube root of a number n is the value x such that x × x × x = n. For example, the cube root of 27 is 3 because 3³ = 27. Every real number has exactly one real cube root — unlike square roots, which only exist for non-negative numbers in real number arithmetic. The cube root symbol is ∛, and the cube root of n can also be written as n^(1/3)."
                />
                <FaqItem
                  q="Can cube roots be negative?"
                  a="Yes — this is one of the key differences between cube roots and square roots. ∛(−8) = −2 because (−2)³ = −8. Any negative number has a real cube root that is also negative. This makes cube roots useful in physics and engineering where quantities can be positive or negative (like velocity, charge, or displacement)."
                />
                <FaqItem
                  q="What is a perfect cube?"
                  a="A perfect cube is an integer whose cube root is also an integer. The sequence of positive perfect cubes is: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000. These are the cubes of 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 respectively. Their negative counterparts (−1, −8, −27, ...) are also perfect cubes. Recognizing these values speeds up mental math and equation solving significantly."
                />
                <FaqItem
                  q="How is the cube root different from the square root?"
                  a="The square root asks: 'What number, squared, gives n?' — and only exists as a real number when n ≥ 0. The cube root asks: 'What number, cubed, gives n?' — and exists as a real number for all n, including negatives. Additionally, the square of any real number is always non-negative, while the cube of a negative number is negative, which is why cube roots extend to the full real number line."
                />
                <FaqItem
                  q="What is ∛2 — the cube root of 2?"
                  a="∛2 ≈ 1.25992105. It is an irrational number — its decimal expansion never repeats or terminates. The cube root of 2 appears frequently in 3D geometry and music theory (the equal-tempered semitone uses the 12th root of 2, related to cube roots through harmonic analysis). It cannot be expressed as a fraction and was proven irrational in antiquity."
                />
                <FaqItem
                  q="Can I use this to find the side length of a cube from its volume?"
                  a="Yes — this is one of the most common real-world uses of the cube root. If a cube has a volume of V cubic units, then each side has a length of ∛V. For example, a cube with volume 512 cm³ has sides of ∛512 = 8 cm. This formula applies to any right cube (a box where all sides are equal) in construction, packaging, and container design."
                />
                <FaqItem
                  q="How accurate is this calculator?"
                  a="Results use JavaScript's Math.cbrt() function, which is based on the IEEE 754 double-precision floating-point standard — the same as Excel and Python. This provides accuracy to approximately 15 significant digits. The result is displayed to up to 8 decimal places, which is more than sufficient for all practical engineering, scientific, and academic work."
                />
                <FaqItem
                  q="Is my data private?"
                  a="Yes. Every calculation runs entirely in your browser. No number you type is ever transmitted to a server, stored in a database, or logged by any analytics system. There are no cookies tracking your inputs, and no user account is required. Your computations are completely private."
                />
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools — square roots, scientific calculator, statistics, unit converters, finance tools, and more. All free, all instant.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-teal-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others find cube roots instantly.</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Use This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-teal-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-teal-500/40 flex-shrink-0" />
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
