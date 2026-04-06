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
  Radical,
  Percent,
  Star,
} from "lucide-react";

type ExponentResult =
  | { ok: true; value: number; expanded: string | null }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 12 });
}

function isIntegerLike(n: number): boolean {
  return Number.isFinite(n) && Math.abs(n - Math.round(n)) < 1e-12;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
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
  { title: "Power Calculator", slug: "power-calculator", icon: <Sigma className="w-5 h-5" />, color: 30, benefit: "Power, roots, and solve exponent" },
  { title: "Logarithm Calculator", slug: "logarithm-calculator", icon: <Radical className="w-5 h-5" />, color: 265, benefit: "Inverse exponent calculations" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <Sigma className="w-5 h-5" />, color: 217, benefit: "Advanced exponential functions" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and growth calculations" },
];

export default function ExponentsCalculator() {
  const [base, setBase] = useState("");
  const [exponent, setExponent] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<ExponentResult>(() => {
    const b = parseFloat(base);
    const e = parseFloat(exponent);
    if (Number.isNaN(b) || Number.isNaN(e)) return null;
    if (b < 0 && !isIntegerLike(e)) return { ok: false, error: "Negative bases require an integer exponent for real-number output." };
    if (b === 0 && e < 0) return { ok: false, error: "0 raised to a negative exponent is undefined." };

    const value = Math.pow(b, e);
    if (!Number.isFinite(value)) return { ok: false, error: "Result overflow. Use smaller values." };

    let expanded: string | null = null;
    if (isIntegerLike(e) && e >= 0 && e <= 8) {
      const parts = Array.from({ length: Math.round(e) }, () => `${b}`);
      expanded = parts.length ? parts.join(" × ") : "1";
    }

    return { ok: true, value, expanded };
  }, [base, exponent]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    const b = parseFloat(base);
    const e = parseFloat(exponent);
    if (e < 0) return `${base}^${exponent} = ${fmt(result.value)} (reciprocal of ${fmt(Math.pow(b, Math.abs(e)))})`;
    if (e === 0) return `Any non-zero base raised to 0 equals 1.`;
    return `${base}^${exponent} = ${fmt(result.value)}`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Exponents Calculator",
    description: "Free online exponents calculator to compute any base raised to any exponent.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/exponents-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Exponents Calculator - Raise Any Number to Any Power"
        description="Free online exponents calculator. Compute base^exponent instantly, including negative and fractional exponents with real-number checks."
        canonical="https://usonlinetools.com/math/exponents-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Exponents Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-sky-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Exponents Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate powers quickly and accurately. Enter any base and exponent to get instant results with clear validation for edge cases.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-sky-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Exponent Engine</p>
                      <p className="text-sm text-muted-foreground">Calculates base^exponent with domain validation for real outputs.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 230 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Calculate a Power</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Base" className="tool-calc-input w-full sm:w-40" value={base} onChange={(e) => setBase(e.target.value)} />
                      <span className="text-2xl font-black text-muted-foreground">^</span>
                      <input type="number" placeholder="Exponent" className="tool-calc-input w-full sm:w-40" value={exponent} onChange={(e) => setExponent(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result flex-1 w-full text-indigo-600 dark:text-indigo-400">{result && result.ok ? fmt(result.value) : "--"}</div>
                    </div>

                    {result && result.ok && result.expanded && (
                      <div className="mt-4 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Expanded Form</p>
                        <p className="text-sm font-mono text-foreground break-all">{result.expanded}</p>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Exponents Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter the base</p><p className="text-muted-foreground text-sm leading-relaxed">The base is the number being multiplied repeatedly.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter the exponent</p><p className="text-muted-foreground text-sm leading-relaxed">Use positive, negative, or fractional exponents as needed.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Read the result and interpretation</p><p className="text-muted-foreground text-sm leading-relaxed">The tool also shows reciprocal context for negative exponents and expanded form for small integer powers.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Positive exponent</p><p className="text-sm text-muted-foreground">Represents repeated multiplication of the base.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Zero exponent</p><p className="text-sm text-muted-foreground">Any non-zero base raised to 0 equals 1.</p></div>
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20"><p className="font-bold text-foreground mb-1">Negative exponent</p><p className="text-sm text-muted-foreground">Converts to reciprocal form: a^-n = 1 / a^n.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Exponents Calculator"
              primaryKeyword="exponents calculator"
              intro="This exponents calculator computes powers with positive, negative, and fractional exponents while validating real-number edge cases. It helps students, analysts, and engineers evaluate power expressions quickly and accurately."
              formulas={[
                { expression: "a^n", explanation: "Exponentiation multiplies base a by itself n times for integer n." },
                { expression: "a^-n = 1 / a^n", explanation: "Negative exponents represent reciprocal power values." },
                { expression: "a^(p/q) = q√(a^p)", explanation: "Fractional exponents link exponentiation to root operations." },
              ]}
              useCases={[
                { title: "Scientific notation and scale changes", description: "Powers of 10 are fundamental for orders of magnitude and unit scaling." },
                { title: "Financial and growth calculations", description: "Exponential terms model compounding, depreciation, and repeated change over time." },
                { title: "STEM exam and homework checks", description: "Students verify simplification steps and avoid sign or domain mistakes." },
              ]}
              tips={[
                "Check whether base and exponent combination stays in the real-number domain.",
                "Use reciprocal interpretation to sanity-check negative exponent outputs.",
                "For fractional exponents, verify root parity before accepting negative-base results.",
                "Keep higher precision during intermediate steps and round only in final output.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Expression</th><th className="text-left px-4 py-3 font-bold text-foreground">Value</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Meaning</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 font-mono text-foreground">2^8</td><td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">256</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Binary scaling</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-foreground">10^-3</td><td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">0.001</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Reciprocal power</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-foreground">9^0.5</td><td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Square root form</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Fast, clear, and accurate for both simple and advanced exponent problems."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Exponents Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Built for real input cases.</strong> Handles negative and fractional exponents with clear domain checks.</p>
                <p><strong className="text-foreground">Educational output.</strong> Expanded form is shown for small integer exponents to improve clarity.</p>
                <p><strong className="text-foreground">SEO-ready content structure.</strong> Includes examples, interpretation, and FAQs aligned to search intent.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is an exponent?" a="An exponent shows how many times a base is multiplied by itself." />
                <FaqItem q="Can exponents be negative?" a="Yes. Negative exponents represent reciprocals." />
                <FaqItem q="Can exponents be fractions?" a="Yes. Fractional exponents represent roots, such as 1/2 for square root." />
                <FaqItem q="Why is 0^-1 invalid?" a="It would require division by zero, which is undefined." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Move from exponents to logarithms, roots, and advanced statistics with matching layouts.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-indigo-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with anyone solving exponent problems.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-500 font-medium py-1.5 transition-colors">
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
