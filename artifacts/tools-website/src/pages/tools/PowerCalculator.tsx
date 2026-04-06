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
  Radical,
  Sigma,
  FlaskConical,
  Percent,
  Star,
} from "lucide-react";

type CalcResult = { ok: true; value: number } | { ok: false; error: string } | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function isIntegerLike(n: number): boolean {
  return Number.isFinite(n) && Math.abs(n - Math.round(n)) < 1e-12;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

const RELATED_TOOLS = [
  { title: "Logarithm Calculator", slug: "logarithm-calculator", icon: <Sigma className="w-5 h-5" />, color: 265, benefit: "log10, ln, and log base n" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <FlaskConical className="w-5 h-5" />, color: 217, benefit: "Trig, logs, and advanced functions" },
  { title: "Square Root Calculator", slug: "square-root-calculator", icon: <Radical className="w-5 h-5" />, color: 240, benefit: "Roots and perfect square checks" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and change calculations" },
];

export default function PowerCalculator() {
  const [base, setBase] = useState("");
  const [exp, setExp] = useState("");
  const [rootValue, setRootValue] = useState("");
  const [rootIndex, setRootIndex] = useState("");
  const [solveBase, setSolveBase] = useState("");
  const [solveTarget, setSolveTarget] = useState("");
  const [copied, setCopied] = useState(false);

  const powerResult = useMemo<CalcResult>(() => {
    const b = parseFloat(base);
    const e = parseFloat(exp);
    if (Number.isNaN(b) || Number.isNaN(e)) return null;
    if (b < 0 && !isIntegerLike(e)) return { ok: false, error: "Negative base with fractional exponent is not a real number." };
    const out = Math.pow(b, e);
    if (!Number.isFinite(out)) return { ok: false, error: "Result overflow. Try smaller values." };
    return { ok: true, value: out };
  }, [base, exp]);

  const rootResult = useMemo<CalcResult>(() => {
    const x = parseFloat(rootValue);
    const n = parseFloat(rootIndex);
    if (Number.isNaN(x) || Number.isNaN(n)) return null;
    if (n === 0) return { ok: false, error: "Root index cannot be zero." };
    if (x < 0) {
      if (!isIntegerLike(n)) return { ok: false, error: "Negative value needs an integer root index." };
      const ni = Math.round(n);
      if (Math.abs(ni) % 2 === 0) return { ok: false, error: "Even roots of negative values are not real." };
      return { ok: true, value: -Math.pow(Math.abs(x), 1 / ni) };
    }
    const out = Math.pow(x, 1 / n);
    if (!Number.isFinite(out)) return { ok: false, error: "Result overflow. Try smaller values." };
    return { ok: true, value: out };
  }, [rootValue, rootIndex]);

  const solveResult = useMemo<CalcResult>(() => {
    const b = parseFloat(solveBase);
    const y = parseFloat(solveTarget);
    if (Number.isNaN(b) || Number.isNaN(y)) return null;
    if (b <= 0 || b === 1) return { ok: false, error: "Base must be > 0 and not equal to 1." };
    if (y <= 0) return { ok: false, error: "Target y must be greater than 0." };
    const out = Math.log(y) / Math.log(b);
    if (!Number.isFinite(out)) return { ok: false, error: "Could not compute a finite exponent." };
    return { ok: true, value: out };
  }, [solveBase, solveTarget]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const powerInsight = (() => {
    if (!powerResult) return null;
    if (powerResult.ok) return `${base}^${exp} = ${fmt(powerResult.value)}`;
    return powerResult.error;
  })();

  const rootInsight = (() => {
    if (!rootResult) return null;
    if (rootResult.ok) return `${rootIndex}th root of ${rootValue} = ${fmt(rootResult.value)}`;
    return rootResult.error;
  })();

  const solveInsight = (() => {
    if (!solveResult) return null;
    if (solveResult.ok) return `For ${solveBase}^x = ${solveTarget}, x = ${fmt(solveResult.value)}`;
    return solveResult.error;
  })();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Power Calculator",
    description: "Free online power calculator for exponents, roots, and solving b^x = y.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/power-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Power Calculator - Exponents, Roots, and Solve for x"
        description="Free online power calculator. Compute x^y, nth roots, and solve b^x = y instantly with real-time results."
        canonical="https://usonlinetools.com/math/power-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Power Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Power Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Three calculators in one: exponent power, nth roots, and solving unknown exponents. Built for algebra, finance growth models, and science formulas.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3 Calculators in 1</p>
                      <p className="text-sm text-muted-foreground">Results update as you type with real-number domain validation.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">1</div><h3 className="text-lg font-bold text-foreground">Power: x^y</h3></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Base x" className="tool-calc-input w-full sm:w-36" value={base} onChange={e => setBase(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">to the power of</span>
                      <input type="number" placeholder="Exponent y" className="tool-calc-input w-full sm:w-36" value={exp} onChange={e => setExp(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-orange-600 dark:text-orange-400">{powerResult && powerResult.ok ? fmt(powerResult.value) : "--"}</div>
                    </div>
                    <ResultInsight message={powerInsight} />
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 205 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">2</div><h3 className="text-lg font-bold text-foreground">Nth Root: x^(1/n)</h3></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Value x" className="tool-calc-input w-full sm:w-36" value={rootValue} onChange={e => setRootValue(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">root index n</span>
                      <input type="number" placeholder="n" className="tool-calc-input w-full sm:w-28" value={rootIndex} onChange={e => setRootIndex(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-sky-600 dark:text-sky-400">{rootResult && rootResult.ok ? fmt(rootResult.value) : "--"}</div>
                    </div>
                    <ResultInsight message={rootInsight} />
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 152 } as CSSProperties}>
                    <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">3</div><h3 className="text-lg font-bold text-foreground">Solve Exponent: b^x = y</h3></div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Base b" className="tool-calc-input w-full sm:w-28" value={solveBase} onChange={e => setSolveBase(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">target y</span>
                      <input type="number" placeholder="y" className="tool-calc-input w-full sm:w-32" value={solveTarget} onChange={e => setSolveTarget(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">x =</span>
                      <div className="tool-calc-result flex-1 w-full text-emerald-600 dark:text-emerald-400">{solveResult && solveResult.ok ? fmt(solveResult.value) : "--"}</div>
                    </div>
                    <ResultInsight message={solveInsight} />
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Power Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Use calculator 1 for direct powers</p><p className="text-muted-foreground text-sm leading-relaxed">Enter base and exponent to compute x^y. Useful for repeated growth and polynomial terms.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Use calculator 2 for roots</p><p className="text-muted-foreground text-sm leading-relaxed">Roots are inverse exponents. Example: 5th root of 32 is 2 because 2^5 = 32.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use calculator 3 to solve for unknown exponent</p><p className="text-muted-foreground text-sm leading-relaxed">If b^x = y, it computes x = log(y)/log(b). This is common in time-to-target growth problems.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Negative exponents produce reciprocals</p><p className="text-sm text-muted-foreground">Example: 2^-3 = 1 / (2^3) = 0.125.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Fractional exponents represent roots</p><p className="text-sm text-muted-foreground">Example: 16^(1/2) = 4 and 27^(1/3) = 3.</p></div>
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"><p className="font-bold text-foreground mb-1">Domain restrictions matter</p><p className="text-sm text-muted-foreground">Negative base with fractional exponent may be non-real. Root and log operations are validated automatically.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Power Calculator"
              primaryKeyword="power calculator"
              intro="This free power calculator helps you solve exponent, root, and inverse-exponent problems from one screen. It is useful when you need fast answers for algebra homework, exponential growth analysis, financial forecasting, or engineering formulas that include powers."
              formulas={[
                { expression: "x^y", explanation: "Raise base x to exponent y to model repeated multiplication and exponential growth." },
                { expression: "x^(1/n)", explanation: "Compute the nth root as an inverse exponent operation, commonly used in geometric and scientific calculations." },
                { expression: "x = log(y) / log(b)", explanation: "Solve unknown exponents in equations of the form b^x = y using the change-of-base logarithm identity." },
              ]}
              useCases={[
                { title: "Compound growth and decay modeling", description: "Use power calculations for investment growth, inflation-adjusted estimates, and biological growth curves where values change exponentially over time." },
                { title: "Engineering scale relationships", description: "Power laws appear in physics and engineering when area, volume, force, or signal intensity scale non-linearly with input size." },
                { title: "Algebra and exam preparation", description: "Students use exponent and root workflows to simplify expressions, solve equations, and verify homework answers quickly." },
              ]}
              tips={[
                "Check domain rules first: negative bases with fractional exponents may not have real-number results.",
                "Use parentheses for negative bases and full expressions to avoid order-of-operations mistakes.",
                "For very large outputs, interpret scientific notation instead of rounding too early.",
                "When solving b^x = y, ensure b is positive and not equal to 1 to keep logarithms valid.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Operation</th><th className="text-left px-4 py-3 font-bold text-foreground">Input</th><th className="text-left px-4 py-3 font-bold text-foreground">Result</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use Case</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 text-muted-foreground">Power</td><td className="px-4 py-3 font-mono text-foreground">2^10</td><td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1024</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Binary scaling</td></tr>
                    <tr><td className="px-4 py-3 text-muted-foreground">Root</td><td className="px-4 py-3 font-mono text-foreground">5th root of 32</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">2</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Inverse power</td></tr>
                    <tr><td className="px-4 py-3 text-muted-foreground">Solve Exponent</td><td className="px-4 py-3 font-mono text-foreground">3^x = 81</td><td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">x = 4</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Growth model solving</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Exactly the structure I needed: power, roots, and solve-for-x in one page."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Power Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">One workflow for connected operations.</strong> Power, root, and exponent solving are handled together so you do not switch tools mid-problem.</p>
                <p><strong className="text-foreground">Clear domain validation.</strong> Invalid real-number operations are explained with plain language instead of returning blank outputs.</p>
                <p><strong className="text-foreground">SEO-friendly educational content.</strong> Formulas, examples, and FAQs are included for better discoverability and user intent coverage.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What does x^y mean?" a="x^y means x raised to the exponent y. It is repeated multiplication for positive integer exponents." />
                <FaqItem q="Can I use negative exponents?" a="Yes. Negative exponents return reciprocal values. Example: 10^-2 = 0.01." />
                <FaqItem q="How does root mode work?" a="It computes x^(1/n), which is the nth root of x." />
                <FaqItem q="How does solve-exponent mode work?" a="It uses x = log(y) / log(b) for equations of the form b^x = y." />
                <FaqItem q="Why do some negative inputs fail?" a="Some expressions are outside the real-number domain, especially even roots of negative values." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore logarithm, root, ratio, and statistics tools in the same layout and quality level.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others solve exponent problems quickly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
