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

type SequenceMode = "arithmetic" | "geometric";

type SequenceResult =
  | {
      ok: true;
      terms: number[];
      nthTerm: number;
      sum: number;
      formula: string;
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-teal-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-teal-500">
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
  { title: "Exponents Calculator", slug: "exponents-calculator", icon: <Sigma className="w-5 h-5" />, color: 230, benefit: "Powers for geometric sequences" },
  { title: "Mean Median Mode Calculator", slug: "mean-median-mode-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 195, benefit: "Analyze generated sequences" },
  { title: "Variance Calculator", slug: "variance-calculator", icon: <Activity className="w-5 h-5" />, color: 320, benefit: "Spread of sequence values" },
  { title: "Rounding Numbers Calculator", slug: "rounding-numbers-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 240, benefit: "Format output precision" },
];

export default function NumberSequenceGenerator() {
  const [mode, setMode] = useState<SequenceMode>("arithmetic");
  const [firstTerm, setFirstTerm] = useState("");
  const [step, setStep] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<SequenceResult>(() => {
    const a1 = parseFloat(firstTerm);
    const dOrR = parseFloat(step);
    const n = parseInt(lengthInput, 10);

    if (Number.isNaN(a1) || Number.isNaN(dOrR) || Number.isNaN(n)) return null;
    if (n <= 0) return { ok: false, error: "Number of terms must be greater than 0." };
    if (n > 200) return { ok: false, error: "For performance, please keep terms at 200 or below." };

    const terms: number[] = [];
    if (mode === "arithmetic") {
      for (let i = 0; i < n; i += 1) terms.push(a1 + i * dOrR);
      const nthTerm = a1 + (n - 1) * dOrR;
      const sum = (n / 2) * (2 * a1 + (n - 1) * dOrR);
      const formula = `a_n = ${fmt(a1)} + (n - 1) * ${fmt(dOrR)}`;
      return { ok: true, terms, nthTerm, sum, formula };
    }

    let current = a1;
    for (let i = 0; i < n; i += 1) {
      terms.push(current);
      current *= dOrR;
      if (!Number.isFinite(current)) return { ok: false, error: "Sequence overflow. Reduce ratio or number of terms." };
    }
    const nthTerm = a1 * Math.pow(dOrR, n - 1);
    const sum = dOrR === 1 ? a1 * n : a1 * ((1 - Math.pow(dOrR, n)) / (1 - dOrR));
    const formula = `a_n = ${fmt(a1)} * ${fmt(dOrR)}^(n - 1)`;
    return { ok: true, terms, nthTerm, sum, formula };
  }, [firstTerm, step, lengthInput, mode]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `${mode === "arithmetic" ? "Arithmetic" : "Geometric"} sequence generated with ${result.terms.length} terms. nth term = ${fmt(result.nthTerm)}, sum = ${fmt(result.sum)}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Number Sequence Generator",
    description: "Free online number sequence generator for arithmetic and geometric sequences.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/number-sequence-generator",
  };

  return (
    <Layout>
      <SEO
        title="Number Sequence Generator - Arithmetic and Geometric"
        description="Free online number sequence generator. Create arithmetic and geometric sequences, then compute nth term and sequence sum instantly."
        canonical="https://usonlinetools.com/math/number-sequence-generator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <span className="text-foreground">Number Sequence Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-teal-500/15 bg-gradient-to-br from-teal-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Number Sequence Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate arithmetic and geometric sequences quickly. Get full term lists, nth term formulas, and sequence sums in one interface.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-lg shadow-teal-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sequence Builder</p>
                      <p className="text-sm text-muted-foreground">Switch between arithmetic and geometric progression models.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 175 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Generate Sequence</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => setMode("arithmetic")}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                          mode === "arithmetic"
                            ? "bg-teal-500 text-white border-teal-500"
                            : "bg-muted text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        Arithmetic
                      </button>
                      <button
                        onClick={() => setMode("geometric")}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                          mode === "geometric"
                            ? "bg-teal-500 text-white border-teal-500"
                            : "bg-muted text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        Geometric
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="number" placeholder="First term (a1)" className="tool-calc-input" value={firstTerm} onChange={(e) => setFirstTerm(e.target.value)} />
                      <input
                        type="number"
                        placeholder={mode === "arithmetic" ? "Common difference (d)" : "Common ratio (r)"}
                        className="tool-calc-input"
                        value={step}
                        onChange={(e) => setStep(e.target.value)}
                      />
                      <input type="number" placeholder="Number of terms (n)" className="tool-calc-input" value={lengthInput} onChange={(e) => setLengthInput(e.target.value)} />
                    </div>

                    {result && result.ok && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="tool-calc-result text-teal-600 dark:text-teal-400">nth Term: {fmt(result.nthTerm)}</div>
                          <div className="tool-calc-result text-cyan-600 dark:text-cyan-400">Sum: {fmt(result.sum)}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-500/20">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Formula</p>
                          <p className="text-sm font-mono text-foreground break-all">{result.formula}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Terms</p>
                          <p className="text-sm text-foreground leading-relaxed break-all">{result.terms.map((t) => fmt(t)).join(", ")}</p>
                        </div>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Number Sequence Generator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Choose sequence type</p><p className="text-muted-foreground text-sm leading-relaxed">Pick arithmetic for additive steps or geometric for multiplicative growth.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter first term, step/ratio, and term count</p><p className="text-muted-foreground text-sm leading-relaxed">Set your starting value and progression behavior.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Review terms, nth term, and sum</p><p className="text-muted-foreground text-sm leading-relaxed">Use the generated formula to validate manual calculations.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Arithmetic sequences grow linearly</p><p className="text-sm text-muted-foreground">Each term adds a fixed difference from the previous term.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Geometric sequences grow exponentially</p><p className="text-sm text-muted-foreground">Each term multiplies by a fixed ratio.</p></div>
                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20"><p className="font-bold text-foreground mb-1">Sum helps with planning models</p><p className="text-sm text-muted-foreground">Use sequence sums for savings schedules, forecasts, and algorithm analysis.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Number Sequence Generator"
              primaryKeyword="number sequence generator"
              intro="This number sequence generator creates arithmetic and geometric progressions with term lists, nth-term formulas, and sequence sums. It supports academic math practice, forecasting, and quick pattern-generation workflows."
              formulas={[
                { expression: "Arithmetic nth term: a_n = a1 + (n - 1)d", explanation: "Each term increases or decreases by a constant difference d." },
                { expression: "Geometric nth term: a_n = a1 × r^(n - 1)", explanation: "Each term is multiplied by common ratio r, producing exponential behavior." },
                { expression: "Arithmetic sum: S_n = n/2 × [2a1 + (n - 1)d]", explanation: "Closed-form sum helps evaluate total accumulation quickly." },
              ]}
              useCases={[
                { title: "Classroom and exam preparation", description: "Students validate arithmetic and geometric progression answers with full formula context." },
                { title: "Savings and payment planning", description: "Sequence sums help model recurring contributions or step-based cash-flow plans." },
                { title: "Algorithm and pattern generation", description: "Developers test sequence logic for loops, recurrences, and synthetic datasets." },
              ]}
              tips={[
                "Choose arithmetic for fixed increments and geometric for multiplicative growth.",
                "Keep term count realistic when ratios are large to avoid overflow-level values.",
                "Use nth-term formulas to verify that generated lists follow intended rules.",
                "For negative ratios, expect alternating signs across geometric sequence terms.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Arithmetic:</strong> a1 = 3, d = 4, n = 5 gives 3, 7, 11, 15, 19</li>
                <li><strong className="text-foreground">Geometric:</strong> a1 = 2, r = 3, n = 5 gives 2, 6, 18, 54, 162</li>
                <li><strong className="text-foreground">Flat sequence:</strong> r = 1 keeps all geometric terms identical.</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-teal-500/5 border border-teal-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Useful for homework and modeling. The formula output is especially helpful."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Number Sequence Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Dual sequence modes.</strong> Arithmetic and geometric workflows are both built in.</p>
                <p><strong className="text-foreground">Formula transparency.</strong> Shows nth-term formula so users can verify logic quickly.</p>
                <p><strong className="text-foreground">Template consistency.</strong> Matches the same content-heavy layout used across upgraded tools.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is an arithmetic sequence?" a="A sequence where each term differs by a fixed amount." />
                <FaqItem q="What is a geometric sequence?" a="A sequence where each term is multiplied by a fixed ratio." />
                <FaqItem q="Can the ratio be negative?" a="Yes. The signs of terms will alternate when ratio is negative." />
                <FaqItem q="Why limit the number of terms?" a="A practical cap keeps performance smooth across all devices." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with exponent, variance, and rounding tools built with the same structure.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-teal-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with students, analysts, and engineers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-teal-500 font-medium py-1.5 transition-colors">
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
