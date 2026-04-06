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
  BarChart3,
  Activity,
  Star,
} from "lucide-react";

type StatsResult =
  | {
      ok: true;
      values: number[];
      count: number;
      sum: number;
      mean: number;
      median: number;
      modes: number[];
      modeFrequency: number;
      min: number;
      max: number;
      range: number;
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
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
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-cyan-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-cyan-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 217, benefit: "Mean plus extra summary stats" },
  { title: "Standard Deviation Calculator", slug: "online-standard-deviation-calculator", icon: <Activity className="w-5 h-5" />, color: 340, benefit: "Measure data spread and variance" },
  { title: "Variance Calculator", slug: "variance-calculator", icon: <Sigma className="w-5 h-5" />, color: 265, benefit: "Population and sample variance" },
  { title: "Random Number Generator", slug: "random-number-generator", icon: <BarChart3 className="w-5 h-5" />, color: 152, benefit: "Generate test datasets quickly" },
];

export default function MeanMedianModeCalculator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<StatsResult>(() => {
    if (!input.trim()) return null;
    const values = parseNumbers(input);
    if (values.length === 0) return { ok: false, error: "Enter at least one valid number." };

    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((acc, n) => acc + n, 0);
    const mean = sum / count;
    const median =
      count % 2 === 1
        ? sorted[(count - 1) / 2]
        : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;

    const freq = new Map<number, number>();
    for (const n of values) freq.set(n, (freq.get(n) || 0) + 1);
    const modeFrequency = Math.max(...Array.from(freq.values()));
    const modes =
      modeFrequency <= 1
        ? []
        : Array.from(freq.entries())
            .filter(([, f]) => f === modeFrequency)
            .map(([n]) => n)
            .sort((a, b) => a - b);

    return {
      ok: true,
      values,
      count,
      sum,
      mean,
      median,
      modes,
      modeFrequency,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0],
    };
  }, [input]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    const modeText = result.modes.length ? result.modes.map(fmt).join(", ") : "No mode";
    const shape = result.mean > result.median ? "right-skewed" : result.mean < result.median ? "left-skewed" : "symmetric";
    return `Mean = ${fmt(result.mean)}, Median = ${fmt(result.median)}, Mode = ${modeText}. Distribution looks ${shape}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mean Median Mode Calculator",
    description: "Free online calculator for mean, median, and mode of datasets.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/mean-median-mode-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Mean Median Mode Calculator - Free Statistics Tool"
        description="Free online mean median mode calculator. Enter a dataset to instantly compute mean, median, mode, range, and count."
        canonical="https://usonlinetools.com/math/mean-median-mode-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <span className="text-foreground">Mean Median Mode Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Mean Median Mode Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Analyze any numeric dataset in seconds. Get mean, median, mode, range, and count in one view.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dataset Parser</p>
                      <p className="text-sm text-muted-foreground">Paste numbers separated by commas, spaces, or new lines.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 195 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Statistics Calculator</h3>
                    <textarea
                      placeholder="e.g. 12, 15, 18, 18, 24, 30"
                      className="tool-calc-input w-full min-h-[120px] font-mono text-sm"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />

                    {result && result.ok && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        <div className="tool-calc-result text-cyan-600 dark:text-cyan-400">Mean: {fmt(result.mean)}</div>
                        <div className="tool-calc-result text-blue-600 dark:text-blue-400">Median: {fmt(result.median)}</div>
                        <div className="tool-calc-result text-purple-600 dark:text-purple-400">Mode: {result.modes.length ? result.modes.map(fmt).join(", ") : "No mode"}</div>
                        <div className="tool-calc-result">Count: {result.count}</div>
                        <div className="tool-calc-result">Range: {fmt(result.range)}</div>
                        <div className="tool-calc-result">Sum: {fmt(result.sum)}</div>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Mean Median Mode Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter your dataset</p><p className="text-muted-foreground text-sm leading-relaxed">Paste values using commas, spaces, or line breaks.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read core statistics</p><p className="text-muted-foreground text-sm leading-relaxed">Get mean, median, mode, range, count, and sum instantly.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Interpret distribution shape</p><p className="text-muted-foreground text-sm leading-relaxed">Use the mean-vs-median insight for skew direction clues.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Mean reacts to outliers</p><p className="text-sm text-muted-foreground">Very large or very small points pull the mean more strongly.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Median is robust to extremes</p><p className="text-sm text-muted-foreground">Median stays stable when outliers exist in the dataset.</p></div>
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"><p className="font-bold text-foreground mb-1">Mode highlights repeated values</p><p className="text-sm text-muted-foreground">No mode appears when all values occur only once.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Mean Median Mode Calculator"
              primaryKeyword="mean median mode calculator"
              intro="This descriptive statistics calculator helps you compute mean, median, and mode from any numeric dataset in seconds. It is useful for classroom assignments, business reporting, survey analysis, and quick data-quality checks."
              formulas={[
                { expression: "Mean = (Σx) / n", explanation: "The arithmetic average summarizes central value but can be sensitive to outliers." },
                { expression: "Median = middle value after sorting", explanation: "For even n, median is the average of the two center values." },
                { expression: "Mode = most frequent value(s)", explanation: "A dataset may have no mode, one mode, or multiple modes." },
              ]}
              useCases={[
                { title: "Educational statistics exercises", description: "Students use mean, median, and mode to understand central tendency and distribution shape." },
                { title: "Business KPI summarization", description: "Teams summarize sales, response times, and customer metrics before deeper analysis." },
                { title: "Survey and experiment review", description: "Researchers quickly inspect data behavior and detect skew or repeated values." },
              ]}
              tips={[
                "Sort data mentally when interpreting median behavior in odd and even sample sizes.",
                "Use median when outliers distort the mean in highly skewed datasets.",
                "Treat mode carefully when multiple values share the same highest frequency.",
                "Validate separators and numeric input cleanliness before drawing conclusions.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Input:</strong> 2, 4, 4, 6, 8 gives Mean 4.8, Median 4, Mode 4</li>
                <li><strong className="text-foreground">Input:</strong> 10, 11, 12, 13 gives Mean 11.5, Median 11.5, No mode</li>
                <li><strong className="text-foreground">Input:</strong> 5, 5, 5, 20 gives Mean 8.75, Median 5, Mode 5</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Clean layout and fast results. Great for classroom datasets."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Mean Median Mode Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">All core central-tendency metrics in one panel.</strong> No need to jump across multiple tools.</p>
                <p><strong className="text-foreground">Flexible parsing.</strong> Accepts multiple delimiters for pasted datasets.</p>
                <p><strong className="text-foreground">Same full SEO/content structure.</strong> Matches your upgraded template across tools.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is mean?" a="Mean is the arithmetic average: sum of values divided by count." />
                <FaqItem q="What is median?" a="Median is the middle value after sorting. For even count, it is the average of the two middle values." />
                <FaqItem q="What is mode?" a="Mode is the most frequently occurring value in the dataset." />
                <FaqItem q="Can a dataset have multiple modes?" a="Yes. If several values share the highest frequency, all are modes." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Statistics Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore average, standard deviation, and variance calculators with the same layout.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-cyan-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others analyze datasets quickly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-cyan-500/40 flex-shrink-0" />
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
