import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  BarChart3, Hash, Percent, BookOpen, Activity, Sigma,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

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

// ── Result Insight ──
function ResultInsight({ result }: { result: ReturnType<typeof useAverageCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => parseFloat(n.toFixed(4)).toString();
  const skew = result.mean > result.median ? "right-skewed" : result.mean < result.median ? "left-skewed" : "symmetric";
  const message = `Your dataset of ${result.count} numbers has a mean of ${fmt(result.mean)} and a median of ${fmt(result.median)}. The distribution appears ${skew} (mean ${result.mean > result.median ? ">" : result.mean < result.median ? "<" : "="} median). The standard deviation is ${fmt(result.stdDev)}, indicating how spread out your data is.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Standard Deviation Calculator", slug: "standard-deviation-calculator", icon: <Activity className="w-5 h-5" />, color: 217 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 45 },
  { title: "GPA Calculator", slug: "gpa-calculator", icon: <BookOpen className="w-5 h-5" />, color: 152 },
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265 },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 340 },
  { title: "Random Number Generator", slug: "random-number-generator", icon: <Hash className="w-5 h-5" />, color: 25 },
];

// ── Main Component ──
export default function AverageCalculator() {
  const calc = useAverageCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number | undefined) => n === undefined ? "--" : parseFloat(n.toFixed(6)).toString();

  return (
    <Layout>
      <SEO
        title="Average Calculator - Mean, Median, Mode & Range | Free Online Statistics Tool"
        description="Free online average calculator. Instantly find the mean, median, mode, range, min, max, and standard deviation of any set of numbers. No signup required."
      />
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Average Calculator", "url": "https://usonlinetools.com/math/average-calculator", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }, "description": "Calculate mean, median, mode, range, and standard deviation for any dataset." },
          { "@type": "FAQPage", "mainEntity": [
            { "@type": "Question", "name": "How do you calculate the average?", "acceptedAnswer": { "@type": "Answer", "text": "Add all numbers together and divide by the count. For example, the average of 4, 8, and 12 is (4+8+12)/3 = 8." } },
            { "@type": "Question", "name": "What is the difference between mean and average?", "acceptedAnswer": { "@type": "Answer", "text": "Mean and average refer to the same thing — the sum of all values divided by the count. 'Mean' is the technical term used in statistics." } },
          ]}
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* BREADCRUMB */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Average Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* 1. PAGE HEADER */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Sigma className="w-3.5 h-3.5" />
                Math & Statistics
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Average Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate the mean, median, mode, range, standard deviation, sum, min, and max of any set of numbers instantly. Enter comma-separated values and get full statistics in one click — free, fast, and no signup needed.
              </p>
            </section>

            {/* QUICK ANSWER BOX (Featured Snippet Target) */}
            <section className="p-5 rounded-xl bg-blue-500/5 border-2 border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <h2 className="font-black text-foreground text-base">Quick Answer: How to Calculate Average</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Average (Mean) = Sum of all numbers ÷ Count of numbers.</strong>{" "}
                For example: The average of 10, 20, and 30 is (10 + 20 + 30) ÷ 3 = <strong className="text-foreground">20</strong>.
                Use the calculator below for instant results with any dataset.
              </p>
            </section>

            {/* 2. QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant statistics</p>
                <p className="text-muted-foreground text-sm">Enter numbers separated by commas, spaces, or new lines — results update instantly.</p>
              </div>
            </section>

            {/* 3. TOOL SECTION */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Enter Your Numbers</h3>
                </div>
                <textarea
                  placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 4, 8, 15, 16, 23, 42"
                  className="tool-calc-input w-full h-28 resize-none font-mono text-sm"
                  value={calc.input}
                  onChange={e => calc.setInput(e.target.value)}
                />

                {/* Results Grid */}
                {calc.result && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    {[
                      { label: "Mean (Average)", value: fmt(calc.result.mean), color: "text-blue-600 dark:text-blue-400" },
                      { label: "Median", value: fmt(calc.result.median), color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Mode", value: calc.result.modeDisplay, color: "text-purple-600 dark:text-purple-400" },
                      { label: "Range", value: fmt(calc.result.range), color: "text-amber-600 dark:text-amber-400" },
                      { label: "Sum", value: fmt(calc.result.sum), color: "text-teal-600 dark:text-teal-400" },
                      { label: "Count", value: calc.result.count.toString(), color: "text-indigo-600 dark:text-indigo-400" },
                      { label: "Minimum", value: fmt(calc.result.min), color: "text-rose-600 dark:text-rose-400" },
                      { label: "Maximum", value: fmt(calc.result.max), color: "text-orange-600 dark:text-orange-400" },
                      { label: "Std Deviation", value: fmt(calc.result.stdDev), color: "text-cyan-600 dark:text-cyan-400", span: true },
                    ].map((item, i) => (
                      <div key={i} className={`tool-calc-result text-center ${(item as any).span ? "col-span-2 sm:col-span-2" : ""}`}>
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{item.label}</div>
                        <div className={`text-lg font-black ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* FORMULA REFERENCE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Formula Reference</h2>
              <div className="space-y-3">
                {[
                  { name: "Mean", formula: "Sum ÷ Count", example: "(4+8+12) ÷ 3 = 8" },
                  { name: "Median", formula: "Middle value when sorted", example: "1, 3, 7, 9, 11 → median = 7" },
                  { name: "Mode", formula: "Most frequently occurring value", example: "2, 3, 3, 5, 7 → mode = 3" },
                  { name: "Range", formula: "Max − Min", example: "12 − 4 = 8" },
                  { name: "Std Deviation", formula: "√(Σ(x − mean)² ÷ n)", example: "Measures data spread from the mean" },
                ].map((row, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-muted/40 text-sm">
                    <span className="font-bold text-foreground w-32 flex-shrink-0">{row.name}</span>
                    <code className="bg-muted px-2 py-0.5 rounded font-mono text-xs text-primary flex-1">{row.formula}</code>
                    <span className="text-muted-foreground text-xs">{row.example}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "emerald", title: "Enter Your Numbers", desc: "Type or paste a list of numbers separated by commas, spaces, semicolons, or new lines. The calculator accepts any format." },
                  { color: "blue", title: "Instant Calculation", desc: "As you type, the calculator instantly computes mean, median, mode, range, sum, count, min, max, and standard deviation." },
                  { color: "purple", title: "Analyze Results", desc: "Compare the mean vs. median to understand distribution skewness. A higher mean than median indicates right-skewed data (outliers pulling average up)." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Student Test Scores</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Scores: 72, 85, 90, 68, 95. Mean = <strong className="text-foreground">82</strong>, Median = <strong className="text-foreground">85</strong>. The lower mean suggests a low outlier (68) pulling the average down.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Monthly Sales Data</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Sales in $K: 45, 52, 48, 61, 55, 49. Mean = <strong className="text-foreground">$51.7K</strong>. Use this to identify months above or below average performance.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">Temperature Readings</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Daily temps (°F): 68, 72, 75, 80, 73, 70. Average = <strong className="text-foreground">73°F</strong>. Helps in weather trend analysis and climate monitoring.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Stock Price Analysis</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Weekly closing prices: 142, 148, 155, 151, 159. The mean of <strong className="text-foreground">151</strong> vs median of <strong className="text-foreground">151</strong> indicates a symmetric distribution.</p>
                </div>
              </div>
            </section>

            {/* 7. BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Sigma className="w-4 h-4" />, text: "Calculates 9 statistics simultaneously" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Handles any number of values" },
                  { icon: <Shield className="w-4 h-4" />, text: "100% private — runs in your browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-friendly, works on any device" },
                  { icon: <Clock className="w-4 h-4" />, text: "Results update as you type" },
                  { icon: <Zap className="w-4 h-4" />, text: "Accepts comma, space, or line-separated input" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* PRO TIPS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Pro Tips for Using Statistics</h2>
              <div className="space-y-4">
                {[
                  { tip: "Use median for skewed data", detail: "When your dataset has extreme outliers (like income data), the median is a better measure of the 'typical' value than the mean." },
                  { tip: "Mean = Median means symmetric distribution", detail: "When the mean equals the median, your data is likely normally distributed — a bell curve. This is important for statistical testing." },
                  { tip: "Low standard deviation = consistent data", detail: "A small standard deviation means values are clustered near the mean (consistent results). A large one means high variability." },
                  { tip: "Paste spreadsheet data directly", detail: "You can copy a column from Excel or Google Sheets and paste directly into the input box — the calculator handles newline-separated numbers." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">{item.tip}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Mean, Median, and Mode</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>An <strong className="text-foreground">average calculator</strong> is one of the most fundamental math tools used in school, business, and scientific research. The term "average" typically refers to the <em>arithmetic mean</em> — the sum of all values divided by the count. However, true data analysis requires understanding all measures of central tendency: mean, median, and mode.</p>
                <p>The <strong className="text-foreground">mean</strong> is sensitive to extreme values (outliers). A single very high or low number can pull the average significantly in one direction. That's why statisticians also look at the <strong className="text-foreground">median</strong>, which is the exact middle value when data is sorted — it's resistant to outliers and better represents "typical" values in skewed datasets like income or housing prices.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Mean vs. Median: Which Should You Use?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Use mean when data is normally distributed with no extreme outliers",
                    "Use median for income, real estate prices, or any right-skewed data",
                    "Use mode to find the most common value in categorical or discrete data",
                    "Use standard deviation to measure consistency and variability in your dataset",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="text-xl font-bold text-foreground pt-2">When Is This Calculator Useful?</h3>
                <p>This free mean calculator is used by students calculating GPA components, teachers averaging test scores, business analysts computing average revenue, researchers finding statistical summaries, and anyone who needs quick descriptive statistics. It saves time compared to manual calculation, especially for large datasets with 20+ numbers.</p>
              </div>
            </section>

            {/* 10. FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between mean, median, and mode?" a="Mean is the sum of all values divided by their count. Median is the middle value in a sorted list. Mode is the most frequently occurring value. All three are measures of central tendency, but each tells a different story about your data." />
                <FaqItem q="How do I calculate the average of a list of numbers?" a="Add all the numbers together, then divide by how many numbers there are. For example, to find the average of 10, 20, and 30: (10 + 20 + 30) ÷ 3 = 20. Our calculator does this instantly for any size dataset." />
                <FaqItem q="What is standard deviation and why does it matter?" a="Standard deviation measures how spread out numbers are from the mean. A low standard deviation (e.g., 2) means values are close together. A high standard deviation (e.g., 50) means values are widely dispersed. It's essential for understanding data variability." />
                <FaqItem q="Can this calculator handle large datasets?" a="Yes, you can paste hundreds or thousands of numbers. Separate them with commas, spaces, semicolons, or new lines. The calculator processes all values instantly in your browser." />
                <FaqItem q="What if my dataset has no mode?" a="If all numbers appear exactly once, there is no mode. Our calculator displays 'No mode' in this case. If multiple values tie for the highest frequency, all are listed as modes (this is called multimodal data)." />
                <FaqItem q="Is this calculator accurate for decimal numbers?" a="Yes, the calculator handles integers and decimal numbers with full precision. Results are displayed with up to 6 significant figures to avoid unnecessary rounding in scientific or financial calculations." />
              </div>
            </section>

            {/* 11. FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Math Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Access 400+ free online tools including standard deviation calculators, percentage tools, GPA calculators, and more — all free and instant.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help students and analysts find this free statistics calculator.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "Quick Answer", "Formulas", "How It Works", "Examples", "Pro Tips", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors">
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
