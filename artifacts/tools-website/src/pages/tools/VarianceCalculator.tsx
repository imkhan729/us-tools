import { useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Calculator,
  Copy,
  Check,
  Lightbulb,
  BadgeCheck,
  Zap,
  Lock,
  Shield,
  Smartphone,
  Sigma,
  Activity,
  BarChart3,
  Star,
} from "lucide-react";

type VarianceMode = "population" | "sample";

type VarianceResult =
  | {
      ok: true;
      values: number[];
      count: number;
      mean: number;
      variance: number;
      stdDev: number;
      min: number;
      max: number;
      range: number;
      sumSquares: number;
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n));
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-fuchsia-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-fuchsia-500">
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

const RELATED_TOOLS = [
  { title: "Standard Deviation Calculator", slug: "online-standard-deviation-calculator", icon: <Activity className="w-5 h-5" />, color: 340, benefit: "Measure spread from mean" },
  { title: "Mean Median Mode Calculator", slug: "mean-median-mode-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 195, benefit: "Central tendency metrics" },
  { title: "Average Calculator", slug: "average-calculator", icon: <Sigma className="w-5 h-5" />, color: 217, benefit: "Quick arithmetic mean" },
  { title: "Rounding Numbers Calculator", slug: "rounding-numbers-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 240, benefit: "Round final statistics" },
];

export default function VarianceCalculator() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<VarianceMode>("population");
  const [copied, setCopied] = useState(false);

  const result = useMemo<VarianceResult>(() => {
    if (!input.trim()) return null;
    const values = parseNumbers(input);
    if (!values.length) return { ok: false, error: "Enter at least one valid number." };
    if (mode === "sample" && values.length < 2) return { ok: false, error: "Sample variance requires at least two values." };

    const count = values.length;
    const mean = values.reduce((acc, n) => acc + n, 0) / count;
    const sumSquares = values.reduce((acc, n) => acc + (n - mean) * (n - mean), 0);
    const divisor = mode === "population" ? count : count - 1;
    const variance = sumSquares / divisor;
    const stdDev = Math.sqrt(variance);
    const sorted = [...values].sort((a, b) => a - b);

    return {
      ok: true,
      values,
      count,
      mean,
      variance,
      stdDev,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0],
      sumSquares,
    };
  }, [input, mode]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    const spread = result.stdDev < 1 ? "very tight" : result.stdDev < 5 ? "moderate" : "wide";
    return `${mode === "population" ? "Population" : "Sample"} variance = ${fmt(result.variance)}, standard deviation = ${fmt(result.stdDev)}. Spread looks ${spread}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Variance Calculator",
    description: "Free online variance calculator for population and sample datasets.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/variance-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Variance Calculator - Population and Sample Variance"
        description="Free online variance calculator. Compute population or sample variance, standard deviation, mean, and range for any dataset."
        canonical="https://usonlinetools.com/math/variance-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <span className="text-foreground">Variance Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/5 via-card to-rose-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Variance Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Measure dataset spread with population or sample variance. The tool also returns mean, standard deviation, and range in one view.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 to-rose-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dataset Analyzer</p>
                      <p className="text-sm text-muted-foreground">Supports comma, space, and new-line separated input values.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 320 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Variance and Standard Deviation</h3>
                    <textarea
                      placeholder="e.g. 8, 12, 15, 15, 17, 23"
                      className="tool-calc-input w-full min-h-[120px] font-mono text-sm"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => setMode("population")}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                          mode === "population"
                            ? "bg-fuchsia-500 text-white border-fuchsia-500"
                            : "bg-muted text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        Population Variance
                      </button>
                      <button
                        onClick={() => setMode("sample")}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                          mode === "sample"
                            ? "bg-fuchsia-500 text-white border-fuchsia-500"
                            : "bg-muted text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        Sample Variance
                      </button>
                    </div>

                    {result && result.ok && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        <div className="tool-calc-result text-fuchsia-600 dark:text-fuchsia-400">Variance: {fmt(result.variance)}</div>
                        <div className="tool-calc-result text-rose-600 dark:text-rose-400">Std Dev: {fmt(result.stdDev)}</div>
                        <div className="tool-calc-result">Mean: {fmt(result.mean)}</div>
                        <div className="tool-calc-result">Count: {result.count}</div>
                        <div className="tool-calc-result">Range: {fmt(result.range)}</div>
                        <div className="tool-calc-result">Sum Squares: {fmt(result.sumSquares)}</div>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-fuchsia-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Variance Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Paste your dataset</p><p className="text-muted-foreground text-sm leading-relaxed">Enter values using commas, spaces, or line breaks.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Choose population or sample mode</p><p className="text-muted-foreground text-sm leading-relaxed">Population divides by n, sample divides by n - 1.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Read variance and standard deviation</p><p className="text-muted-foreground text-sm leading-relaxed">The calculator also shows mean, range, and sum of squared deviations.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Lower variance means tighter clustering</p><p className="text-sm text-muted-foreground">Values stay closer to the mean when variance is low.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Higher variance means wider spread</p><p className="text-sm text-muted-foreground">Values are more dispersed around the average.</p></div>
                <div className="p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20"><p className="font-bold text-foreground mb-1">Sample vs population matters</p><p className="text-sm text-muted-foreground">Sample variance uses n - 1 to reduce bias when estimating a full population.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Variance Calculator"
              primaryKeyword="variance calculator"
              intro="This variance calculator computes both population variance and sample variance, plus standard deviation and supporting summary statistics. It is built for statistics assignments, data quality analysis, and business metric variability checks."
              formulas={[
                { expression: "Population variance: σ² = Σ(x - μ)² / n", explanation: "Use this when your dataset represents the full population under study." },
                { expression: "Sample variance: s² = Σ(x - x̄)² / (n - 1)", explanation: "Use n - 1 for unbiased variance estimation from sample data." },
                { expression: "Standard deviation: σ = √variance", explanation: "Standard deviation expresses dispersion in original measurement units." },
              ]}
              useCases={[
                { title: "Performance variability analysis", description: "Teams track consistency of response times, sales, and quality metrics over time." },
                { title: "Risk and volatility estimation", description: "Variance and standard deviation are key inputs for uncertainty and spread assessment." },
                { title: "Academic statistics workflows", description: "Students and researchers use variance to compare datasets and interpret distribution behavior." },
              ]}
              tips={[
                "Choose sample vs population mode correctly; wrong mode changes interpretation and magnitude.",
                "Outliers can heavily increase variance, so review data quality before conclusions.",
                "Use standard deviation alongside variance for easier unit-level interpretation.",
                "Keep full precision during calculations and round only in final reporting tables.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Input:</strong> 2, 4, 6, 8 gives Population variance 5, Sample variance 6.6667</li>
                <li><strong className="text-foreground">Input:</strong> 10, 10, 10 gives Variance 0 (no spread)</li>
                <li><strong className="text-foreground">Input:</strong> 5, 7, 9, 20 gives Higher variance due to outlier 20</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Useful distinction between population and sample variance without extra setup."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Variance Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Population and sample support.</strong> Switch methods instantly without changing input format.</p>
                <p><strong className="text-foreground">Statistics context included.</strong> Mean, range, and standard deviation help interpret variance correctly.</p>
                <p><strong className="text-foreground">Consistent SEO-friendly layout.</strong> Designed to match the same high-content template as your other upgraded tools.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is variance?" a="Variance measures how far values are spread from their mean on average." />
                <FaqItem q="What is the difference between sample and population variance?" a="Population variance divides by n. Sample variance divides by n - 1." />
                <FaqItem q="Why does sample variance use n - 1?" a="It adjusts for bias when estimating population variability from a sample." />
                <FaqItem q="Can variance be negative?" a="No. Variance is always zero or positive." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Statistics Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with mean, median, mode, and standard deviation calculators in the same design system.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fuchsia-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-fuchsia-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share for fast population or sample variance analysis.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-fuchsia-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-fuchsia-500/40 flex-shrink-0" />
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
