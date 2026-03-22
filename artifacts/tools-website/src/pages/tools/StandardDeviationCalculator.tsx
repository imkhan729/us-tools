import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  BarChart3, Sigma, Activity, BookOpen, Hash, Percent,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type DataType = "population" | "sample";

function useStdDevCalc() {
  const [input, setInput] = useState("");
  const [dataType, setDataType] = useState<DataType>("population");

  const result = useMemo(() => {
    const nums = input.split(/[\s,;]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length < 2) return null;
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const squaredDiffs = nums.map(x => Math.pow(x - mean, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((a, b) => a + b, 0);
    const variance = dataType === "population" ? sumSquaredDiffs / n : sumSquaredDiffs / (n - 1);
    const stdDev = Math.sqrt(variance);
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const cv = (stdDev / Math.abs(mean)) * 100; // coefficient of variation
    const se = stdDev / Math.sqrt(n); // standard error

    return {
      n, sum, mean, median,
      variance, stdDev, cv, se,
      min: sorted[0], max: sorted[n - 1],
      range: sorted[n - 1] - sorted[0],
      squaredDiffs,
      nums,
      dataType,
    };
  }, [input, dataType]);

  return { input, setInput, dataType, setDataType, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useStdDevCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => parseFloat(n.toFixed(4)).toString();
  const spread = result.cv < 10 ? "low variability (consistent data)" : result.cv < 30 ? "moderate variability" : "high variability (spread out data)";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Dataset of <strong>{result.n}</strong> values: mean = <strong>{fmt(result.mean)}</strong>, {result.dataType} std dev = <strong>{fmt(result.stdDev)}</strong>.
          The coefficient of variation is <strong>{fmt(result.cv)}%</strong>, indicating <strong>{spread}</strong>.
          About 68% of data falls within {fmt(result.mean - result.stdDev)} – {fmt(result.mean + result.stdDev)}.
        </p>
      </div>
    </motion.div>
  );
}

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

const RELATED_TOOLS = [
  { title: "Average Calculator", slug: "average-calculator", icon: <Sigma className="w-5 h-5" />, color: 217 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 45 },
  { title: "GPA Calculator", slug: "gpa-calculator", icon: <BookOpen className="w-5 h-5" />, color: 152 },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 340 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265 },
  { title: "Random Number Generator", slug: "random-number-generator", icon: <Hash className="w-5 h-5" />, color: 25 },
];

export default function StandardDeviationCalculator() {
  const calc = useStdDevCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number) => parseFloat(n.toFixed(6)).toString();

  return (
    <Layout>
      <SEO
        title="Standard Deviation Calculator - Population & Sample Std Dev | Free Stats Tool"
        description="Free standard deviation calculator. Calculate population or sample standard deviation, variance, mean, coefficient of variation, and standard error. Instant results."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Standard Deviation Calculator", "url": "https://usonlinetools.com/math/standard-deviation-calculator", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [
            { "@type": "Question", "name": "What is standard deviation?", "acceptedAnswer": { "@type": "Answer", "text": "Standard deviation measures how spread out numbers are from the mean. A low standard deviation means values are clustered near the mean; a high one means they are widely dispersed." } },
            { "@type": "Question", "name": "What is the difference between population and sample standard deviation?", "acceptedAnswer": { "@type": "Answer", "text": "Population std dev divides by n (use when you have all data). Sample std dev divides by n-1 (use when your data is a sample from a larger population). Sample std dev is slightly larger to correct for bias." } },
          ]}
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Statistics</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Standard Deviation Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Activity className="w-3.5 h-3.5" />
                Statistics Calculator
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Standard Deviation Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate population or sample standard deviation, variance, mean, coefficient of variation, and standard error for any dataset. Paste your numbers and get a full statistical summary instantly — free, no signup needed.
              </p>
            </section>

            {/* QUICK ANSWER */}
            <section className="p-5 rounded-xl bg-purple-500/5 border-2 border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                <h2 className="font-black text-foreground text-base">Standard Deviation Formula</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-mono">
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-1 font-sans font-semibold uppercase tracking-wider">Population (σ)</div>
                  <div className="text-foreground">σ = √(Σ(x−μ)² / N)</div>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="text-xs text-muted-foreground mb-1 font-sans font-semibold uppercase tracking-wider">Sample (s)</div>
                  <div className="text-foreground">s = √(Σ(x−x̄)² / (n−1))</div>
                </div>
              </div>
            </section>

            {/* QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Instant statistical analysis</p>
                <p className="text-muted-foreground text-sm">Enter comma or space-separated numbers. You can paste directly from Excel or Google Sheets.</p>
              </div>
            </section>

            {/* TOOL */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 280 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Standard Deviation Calculator</h3>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Data Type</label>
                  <div className="flex gap-3">
                    {(["population", "sample"] as DataType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => calc.setDataType(t)}
                        className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${calc.dataType === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}
                      >
                        {t === "population" ? "Population (σ)" : "Sample (s)"}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {calc.dataType === "population" ? "Use when you have data for the entire group (divides by n)" : "Use when your data is a sample from a larger population (divides by n−1)"}
                  </p>
                </div>

                <div className="mb-5">
                  <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Enter Numbers</label>
                  <textarea
                    placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 10, 20, 30, 15, 25"
                    className="tool-calc-input w-full h-28 resize-none font-mono text-sm"
                    value={calc.input}
                    onChange={e => calc.setInput(e.target.value)}
                  />
                </div>

                {calc.result && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Std Deviation", value: fmt(calc.result.stdDev), color: "text-purple-600 dark:text-purple-400" },
                      { label: "Variance", value: fmt(calc.result.variance), color: "text-indigo-600 dark:text-indigo-400" },
                      { label: "Mean", value: fmt(calc.result.mean), color: "text-blue-600 dark:text-blue-400" },
                      { label: "Std Error", value: fmt(calc.result.se), color: "text-cyan-600 dark:text-cyan-400" },
                      { label: "Coeff. of Variation", value: fmt(calc.result.cv) + "%", color: "text-teal-600 dark:text-teal-400" },
                      { label: "Count (n)", value: calc.result.n.toString(), color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Sum", value: fmt(calc.result.sum), color: "text-amber-600 dark:text-amber-400" },
                      { label: "Range", value: fmt(calc.result.range), color: "text-orange-600 dark:text-orange-400" },
                      { label: "Min / Max", value: `${fmt(calc.result.min)} / ${fmt(calc.result.max)}`, color: "text-rose-600 dark:text-rose-400", span: true },
                    ].map((item, i) => (
                      <div key={i} className={`tool-calc-result text-center ${(item as any).span ? "col-span-2 sm:col-span-3" : ""}`}>
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">{item.label}</div>
                        <div className={`text-lg font-black ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Standard Deviation</h2>
              <div className="space-y-5">
                {[
                  { color: "purple", title: "Find the Mean", desc: "Add all values and divide by the count (n). This is your average." },
                  { color: "blue", title: "Calculate Squared Differences", desc: "For each value, subtract the mean, then square the result: (x − mean)². Squaring removes negative signs and amplifies outliers." },
                  { color: "emerald", title: "Compute Variance and Std Dev", desc: "Average the squared differences (dividing by n for population, n−1 for sample) to get variance. The square root of variance is standard deviation." },
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

            {/* REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">Exam Score Analysis</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Scores: 70, 85, 90, 72, 88. Mean = 81. Std dev ≈ <strong className="text-foreground">8.2</strong>. A teacher uses this to see if students' performance is consistent or widely spread.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Investment Volatility</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Stock returns: 2%, -1%, 5%, 3%, -2%. High std dev = high risk. A low std dev stock is more predictable. Portfolio managers use this daily.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Quality Control</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A factory measures screw lengths. Low std dev means consistent manufacturing. A 6-sigma process has std dev so small that defects are < 3.4 per million.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Scientific Research</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Clinical trial results use standard error (SE = σ/√n) to show precision of the mean. Smaller SE = more confidence in the measured average.</p>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Sigma className="w-4 h-4" />, text: "Both population and sample std dev" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Shows variance, mean, CV, and SE too" },
                  { icon: <Shield className="w-4 h-4" />, text: "Runs in browser — no data uploaded" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Paste directly from Excel or Sheets" },
                  { icon: <Clock className="w-4 h-4" />, text: "Handles hundreds of values instantly" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Results update as you type" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Standard Deviation</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Standard deviation is one of the most important measures in statistics. It quantifies how much the values in a dataset deviate from the mean (average). A <strong className="text-foreground">small standard deviation</strong> means values are tightly clustered; a <strong className="text-foreground">large standard deviation</strong> means they are spread widely.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">The 68-95-99.7 Rule (Empirical Rule)</h3>
                <p>For normally distributed data: <strong className="text-foreground">68%</strong> of values fall within 1 std dev of the mean, <strong className="text-foreground">95%</strong> within 2 std devs, and <strong className="text-foreground">99.7%</strong> within 3 std devs. This is why six-sigma quality control targets ±6 standard deviations.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">When to Use Population vs. Sample</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Population std dev (σ): Use when you have data for every member of the group",
                    "Sample std dev (s): Use when your dataset is a subset drawn from a larger population",
                    "Sample std dev divides by (n−1) instead of n to correct for sampling bias (Bessel's correction)",
                    "For most real-world research, sample std dev is the appropriate choice",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What does a high standard deviation mean?" a="A high standard deviation means the values in your dataset are spread far from the mean. It indicates high variability or inconsistency. For example, high stock return std dev means the investment is volatile." />
                <FaqItem q="What is the difference between variance and standard deviation?" a="Variance is the average of squared differences from the mean. Standard deviation is the square root of variance. Standard deviation is preferred because it's in the same units as the original data (variance is in squared units)." />
                <FaqItem q="When should I use sample vs. population standard deviation?" a="Use population std dev when your data contains all members of the group. Use sample std dev when your data is a subset from a larger population — this is more common in research and analytics." />
                <FaqItem q="What is the coefficient of variation?" a="The coefficient of variation (CV) is the standard deviation divided by the mean, expressed as a percentage. It normalizes variability, allowing comparison across datasets with different units or scales. A CV under 15% is generally considered low variability." />
                <FaqItem q="What is standard error and how is it different from standard deviation?" a="Standard error (SE = σ / √n) measures the precision of the sample mean. Standard deviation measures spread within a dataset; standard error measures how accurately the sample mean estimates the population mean. SE decreases as sample size increases." />
                <FaqItem q="Can I paste data from Excel into this calculator?" a="Yes! Copy a column of numbers from Excel or Google Sheets and paste it directly into the input box. The calculator handles newline, comma, space, and semicolon-separated values automatically." />
              </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Statistics & Math Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore average calculators, GPA tools, percentage calculators, and 400+ more — all free, all instant, no signup.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help students and analysts with this free statistics calculator.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "Formula", "How It Works", "Examples", "FAQ"].map(label => (
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
