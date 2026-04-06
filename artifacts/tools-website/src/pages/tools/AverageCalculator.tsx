import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  Calculator, Lightbulb, Copy, Check,
  BarChart3, Sigma, Activity, BookOpen, Hash, Percent,
  BadgeCheck, Lock, Star,
} from "lucide-react";

// ── Calculator Logic ──
function useAverageCalc() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const nums = input
      .split(/[\s,;]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
    if (nums.length === 0) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;

    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    // Mode
    const freq: Record<number, number> = {};
    nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq)
      .filter(([, f]) => f === maxFreq)
      .map(([n]) => parseFloat(n));
    const modeDisplay = maxFreq === 1 ? "No mode" : modes.join(", ");

    const range = sorted[sorted.length - 1] - sorted[0];

    // Standard deviation (population)
    const variance = nums.reduce((a, n) => a + Math.pow(n - mean, 2), 0) / nums.length;
    const stdDev = Math.sqrt(variance);

    return {
      count: nums.length,
      sum,
      mean,
      median,
      modeDisplay,
      range,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      stdDev,
      nums,
    };
  }, [input]);

  return { input, setInput, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: ReturnType<typeof useAverageCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => parseFloat(n.toFixed(4)).toString();
  const skew = result.mean > result.median ? "right-skewed" : result.mean < result.median ? "left-skewed" : "symmetric";
  const message = `Your dataset of ${result.count} numbers has a mean of ${fmt(result.mean)} and a median of ${fmt(result.median)}. The distribution appears ${skew} (mean ${result.mean > result.median ? ">" : result.mean < result.median ? "<" : "="} median). The standard deviation is ${fmt(result.stdDev)}, indicating how spread out your data is.`;
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
  { title: "Standard Deviation Calculator", slug: "online-standard-deviation-calculator", icon: <Activity className="w-5 h-5" />, color: 45, benefit: "Calculate data spread and variability" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <Calculator className="w-5 h-5" />, color: 270, benefit: "Advanced math functions" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 25, benefit: "Calculate percentages and ratios" },
  { title: "GPA Calculator", slug: "gpa-calculator", icon: <BookOpen className="w-5 h-5" />, color: 152, benefit: "Grade point average calculator" },
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 265, benefit: "Calculate investment growth" },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Hash className="w-5 h-5" />, color: 340, benefit: "Body mass index calculator" },
];

// ── Main Component ──
export default function AverageCalculator() {
  const calc = useAverageCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | undefined) => n === undefined ? "--" : parseFloat(n.toFixed(6)).toString();

  return (
    <Layout>
      <SEO
        title="Average Calculator - Mean, Median, Mode & Range | Free Online Statistics Tool"
        description="Free online average calculator. Instantly find the mean, median, mode, range, min, max, and standard deviation of any set of numbers. Perfect for statistics, grades, and data analysis."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Average Calculator</span>
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
            Average Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate mean, median, mode, range, and standard deviation for any dataset. Perfect for statistics, grades, data analysis, and finding central tendency measures.
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
                      <Sigma className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Average Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Calculator */}
                  <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">Calculate Averages & Statistics</h3>
                    </div>

                    <div className="mb-5">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Enter Numbers</label>
                      <textarea
                        placeholder="10, 15, 20, 25, 30"
                        className="tool-calc-input w-full h-20 resize-none"
                        value={calc.input}
                        onChange={e => calc.setInput(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Separate numbers with commas, spaces, or line breaks.</p>
                    </div>

                    {calc.result && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Count (n)</p>
                            <p className="text-lg font-bold">{calc.result.count}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Mean (Average)</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{fmt(calc.result.mean)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Median</p>
                            <p className="text-lg font-bold">{fmt(calc.result.median)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Mode</p>
                            <p className="text-lg font-bold">{calc.result.modeDisplay}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Range</p>
                            <p className="text-lg font-bold">{fmt(calc.result.range)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Minimum</p>
                            <p className="text-lg font-bold">{fmt(calc.result.min)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Maximum</p>
                            <p className="text-lg font-bold">{fmt(calc.result.max)}</p>
                          </div>
                          <div className="tool-calc-result text-center">
                            <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
                            <p className="text-lg font-bold">{fmt(calc.result.stdDev)}</p>
                          </div>
                        </div>

                        <ResultInsight result={calc.result} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Averages</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Averages help you understand the central tendency of your data. The mean, median, and mode each provide different insights into your dataset's characteristics.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your data</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Input your numbers separated by commas, spaces, or line breaks. The calculator accepts any numeric values.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the statistics</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      View the mean (average), median, mode, range, and other statistical measures calculated from your data.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Interpret the results</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the insight explanation to understand what the statistics tell you about your data distribution.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Statistical Measures Explained</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold w-12 flex-shrink-0">Mean</span>
                      <span className="flex-1">Average value (sum ÷ count)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold w-12 flex-shrink-0">Median</span>
                      <span className="flex-1">Middle value when sorted</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold w-12 flex-shrink-0">Mode</span>
                      <span className="flex-1">Most frequent value(s)</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold w-12 flex-shrink-0">Range</span>
                      <span className="flex-1">Maximum - minimum</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold w-12 flex-shrink-0">Std Dev</span>
                      <span className="flex-1">Measure of data spread</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500 font-bold w-12 flex-shrink-0">Count</span>
                      <span className="flex-1">Total number of values</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">When to use each measure:</strong> Mean for normal data, median for skewed data, mode for categorical data.</p>
                  <p><strong className="text-foreground">Outliers:</strong> Extreme values can heavily influence the mean but have little effect on the median.</p>
                  <p><strong className="text-foreground">Data symmetry:</strong> When mean and median are close, data is symmetric. When mean is greater than median, data is right-skewed.</p>
                </div>
              </div>
            </section>

            {/* ── 4. EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Average Calculator Examples</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <h3 className="font-bold text-foreground mb-3">Student Grades</h3>
                  <p className="text-sm text-muted-foreground mb-3">Calculate average test scores:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Scores: 85, 92, 78, 96, 88</p>
                    <p>Mean: 87.8</p>
                    <p>Median: 88</p>
                    <p>Mode: No mode</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <h3 className="font-bold text-foreground mb-3">Monthly Expenses</h3>
                  <p className="text-sm text-muted-foreground mb-3">Average spending over 6 months:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Expenses: 1200, 1350, 1180, 1420, 1290, 1310</p>
                    <p>Mean: $1291.67</p>
                    <p>Median: $1300</p>
                    <p>Range: $240</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20">
                  <h3 className="font-bold text-foreground mb-3">Survey Responses</h3>
                  <p className="text-sm text-muted-foreground mb-3">Rating scale (1-5) responses:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Ratings: 4, 5, 3, 4, 5, 4, 3, 4</p>
                    <p>Mean: 4.0</p>
                    <p>Median: 4</p>
                    <p>Mode: 4</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <h3 className="font-bold text-foreground mb-3">Temperature Data</h3>
                  <p className="text-sm text-muted-foreground mb-3">Daily high temperatures:</p>
                  <div className="bg-background rounded-lg p-3 text-sm font-mono">
                    <p>Temps: 72, 75, 68, 78, 71, 73, 69</p>
                    <p>Mean: 72.3°F</p>
                    <p>Median: 72°F</p>
                    <p>Std Dev: 3.4°F</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. FAQ ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <FaqItem
                  q="How do you calculate the average?"
                  a="Add all numbers together and divide by the count. For example, the average of 4, 8, and 12 is (4+8+12)/3 = 8."
                />
                <FaqItem
                  q="What is the difference between mean and average?"
                  a="Mean and average refer to the same thing — the sum of all values divided by the count. 'Mean' is the technical term used in statistics."
                />
                <FaqItem
                  q="When should I use median instead of mean?"
                  a="Use median when your data has outliers or is skewed. The median is less affected by extreme values than the mean."
                />
                <FaqItem
                  q="What does 'no mode' mean?"
                  a="'No mode' means all values in your dataset appear equally often. There is no single most frequent value."
                />
                <FaqItem
                  q="How is standard deviation related to the average?"
                  a="Standard deviation measures how spread out your data is from the mean. A low standard deviation means values are close to the average."
                />
                <FaqItem
                  q="What is the range and why is it useful?"
                  a="Range is the difference between the maximum and minimum values. It gives you a quick sense of how spread out your data is."
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
