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
  FlaskConical,
  Percent,
  Radical,
  Star,
} from "lucide-react";

type CalcResult = { ok: true; value: number } | { ok: false; error: string } | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
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

function ResultInsight({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

const RELATED_TOOLS = [
  { title: "Power Calculator", slug: "power-calculator", icon: <Sigma className="w-5 h-5" />, color: 30, benefit: "Exponents, roots, and solve for x" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <FlaskConical className="w-5 h-5" />, color: 217, benefit: "Advanced math functions in one place" },
  { title: "Square Root Calculator", slug: "square-root-calculator", icon: <Radical className="w-5 h-5" />, color: 240, benefit: "Square roots and perfect square checks" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and growth calculations" },
];

export default function LogarithmCalculator() {
  const [x10, setX10] = useState("");
  const [xln, setXln] = useState("");
  const [base, setBase] = useState("");
  const [xcustom, setXcustom] = useState("");
  const [copied, setCopied] = useState(false);

  const log10Result = useMemo<CalcResult>(() => {
    const x = parseFloat(x10);
    if (Number.isNaN(x)) return null;
    if (x <= 0) return { ok: false, error: "log10 is defined only for x > 0." };
    return { ok: true, value: Math.log10(x) };
  }, [x10]);

  const lnResult = useMemo<CalcResult>(() => {
    const x = parseFloat(xln);
    if (Number.isNaN(x)) return null;
    if (x <= 0) return { ok: false, error: "ln is defined only for x > 0." };
    return { ok: true, value: Math.log(x) };
  }, [xln]);

  const customResult = useMemo<CalcResult>(() => {
    const b = parseFloat(base);
    const x = parseFloat(xcustom);
    if (Number.isNaN(b) || Number.isNaN(x)) return null;
    if (b <= 0 || b === 1) return { ok: false, error: "Base must be > 0 and not equal to 1." };
    if (x <= 0) return { ok: false, error: "Input x must be > 0." };
    const out = Math.log(x) / Math.log(b);
    if (!Number.isFinite(out)) return { ok: false, error: "Could not compute a finite value." };
    return { ok: true, value: out };
  }, [base, xcustom]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const log10Insight = (() => {
    if (!log10Result) return null;
    if (log10Result.ok) return `log10(${x10}) = ${fmt(log10Result.value)}`;
    return log10Result.error;
  })();

  const lnInsight = (() => {
    if (!lnResult) return null;
    if (lnResult.ok) return `ln(${xln}) = ${fmt(lnResult.value)}`;
    return lnResult.error;
  })();

  const customInsight = (() => {
    if (!customResult) return null;
    if (customResult.ok) return `log_${base}(${xcustom}) = ${fmt(customResult.value)}`;
    return customResult.error;
  })();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Logarithm Calculator",
    description: "Free online logarithm calculator for log10, ln, and custom base logarithms.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/logarithm-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Logarithm Calculator - log10, ln, and log base n"
        description="Free online logarithm calculator. Compute common log, natural log, and custom-base logarithms instantly."
        canonical="https://usonlinetools.com/math/logarithm-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Logarithm Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Logarithm Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Three log calculators in one: common log (base 10), natural log (base e), and custom base log. Domain checks are built in for correct results.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-indigo-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3 Calculators in 1</p>
                      <p className="text-sm text-muted-foreground">All log modes enforce valid math domains automatically.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 270 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">1</div><h3 className="text-lg font-bold text-foreground">Common Log: log10(x)</h3></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="x > 0" className="tool-calc-input w-full sm:w-40" value={x10} onChange={e => setX10(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">log10(x) =</span>
                      <div className="tool-calc-result flex-1 w-full text-violet-600 dark:text-violet-400">{log10Result && log10Result.ok ? fmt(log10Result.value) : "--"}</div>
                    </div>
                    <ResultInsight message={log10Insight} />
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 225 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">2</div><h3 className="text-lg font-bold text-foreground">Natural Log: ln(x)</h3></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="x > 0" className="tool-calc-input w-full sm:w-40" value={xln} onChange={e => setXln(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">ln(x) =</span>
                      <div className="tool-calc-result flex-1 w-full text-indigo-600 dark:text-indigo-400">{lnResult && lnResult.ok ? fmt(lnResult.value) : "--"}</div>
                    </div>
                    <ResultInsight message={lnInsight} />
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 152 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">3</div><h3 className="text-lg font-bold text-foreground">Custom Base: log_b(x)</h3></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="base b" className="tool-calc-input w-full sm:w-28" value={base} onChange={e => setBase(e.target.value)} />
                      <input type="number" placeholder="x > 0" className="tool-calc-input w-full sm:w-40" value={xcustom} onChange={e => setXcustom(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">log_b(x) =</span>
                      <div className="tool-calc-result flex-1 w-full text-emerald-600 dark:text-emerald-400">{customResult && customResult.ok ? fmt(customResult.value) : "--"}</div>
                    </div>
                    <ResultInsight message={customInsight} />
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Logarithm Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Use calculator 1 for base-10 logs</p><p className="text-muted-foreground text-sm leading-relaxed">Common logs are widely used in pH calculations, decibel scales, and order-of-magnitude analysis.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Use calculator 2 for natural logs</p><p className="text-muted-foreground text-sm leading-relaxed">Natural log uses base e and appears in exponential growth/decay, finance compounding, and calculus.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use calculator 3 for any custom base</p><p className="text-muted-foreground text-sm leading-relaxed">Enter base b and value x to compute log_b(x). Base must be greater than 0 and not equal to 1.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Positive results mean exponent above 1</p><p className="text-sm text-muted-foreground">Example: log10(1000) = 3 because 10^3 = 1000.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Values between 0 and 1 return negative logs</p><p className="text-sm text-muted-foreground">Example: log10(0.01) = -2 because 10^-2 = 0.01.</p></div>
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"><p className="font-bold text-foreground mb-1">Input domain is strictly positive</p><p className="text-sm text-muted-foreground">Logarithms are undefined for zero or negative values in real-number arithmetic.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Logarithm Calculator"
              primaryKeyword="logarithm calculator"
              intro="This logarithm calculator supports common logarithm (log base 10), natural logarithm (ln), and custom-base logarithm in one place. It helps with exponential equation solving, scientific notation analysis, and formula inversion where powers need to be isolated."
              formulas={[
                { expression: "log_b(x) = y  ⟺  b^y = x", explanation: "A logarithm returns the exponent y needed to transform base b into target value x." },
                { expression: "ln(x) = log_e(x)", explanation: "Natural logarithm uses base e and appears in continuous growth, calculus, and probability models." },
                { expression: "log_b(x) = ln(x) / ln(b)", explanation: "Change-of-base formula computes logs for any valid base using natural logarithms." },
              ]}
              useCases={[
                { title: "Science and engineering scales", description: "Logarithmic scales are used in pH chemistry, decibels in audio engineering, and earthquake magnitude models." },
                { title: "Finance and growth modeling", description: "Log transformations help solve compounding equations and estimate time-to-target in growth scenarios." },
                { title: "Computer science and analytics", description: "Logs are used in algorithm analysis, information theory, and machine learning feature scaling." },
              ]}
              tips={[
                "Keep inputs in the valid real domain: x must be greater than zero for all log calculations.",
                "For custom logs, base b must be positive and cannot equal 1.",
                "Use ln for formulas derived from e-based exponential models and differential equations.",
                "When checking results, verify by exponentiating the base with the computed logarithm.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Type</th><th className="text-left px-4 py-3 font-bold text-foreground">Input</th><th className="text-left px-4 py-3 font-bold text-foreground">Result</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Scenario</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 text-muted-foreground">Common Log</td><td className="px-4 py-3 font-mono text-foreground">log10(1000)</td><td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Magnitude scaling</td></tr>
                    <tr><td className="px-4 py-3 text-muted-foreground">Natural Log</td><td className="px-4 py-3 font-mono text-foreground">ln(e)</td><td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">1</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Calculus identities</td></tr>
                    <tr><td className="px-4 py-3 text-muted-foreground">Custom Base</td><td className="px-4 py-3 font-mono text-foreground">log_2(64)</td><td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">6</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Binary systems</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-violet-500/5 border border-violet-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"The domain checks and custom-base section are exactly what I needed for coursework."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Logarithm Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Covers all common log workflows.</strong> It includes log10, ln, and custom-base log in a single interface.</p>
                <p><strong className="text-foreground">Domain-first validation.</strong> Invalid inputs are explained clearly to prevent silent math mistakes.</p>
                <p><strong className="text-foreground">SEO-oriented educational depth.</strong> The page includes formula context, examples, and FAQ for strong search intent alignment.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a logarithm?" a="A logarithm asks which exponent is needed on a base to get a target value." />
                <FaqItem q="What is the difference between log and ln?" a="log usually means base-10; ln means base-e (natural logarithm)." />
                <FaqItem q="Why does zero or negative input fail?" a="Real-number logarithms are defined only for positive arguments." />
                <FaqItem q="Can base be 1?" a="No. Base 1 is invalid because 1 raised to any exponent is always 1." />
                <FaqItem q="How is custom-base log computed?" a="Using the change-of-base identity: log_b(x) = ln(x) / ln(b)." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Jump to power, roots, and scientific calculator pages using the same layout and interaction model.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others solve logarithm problems faster.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
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
