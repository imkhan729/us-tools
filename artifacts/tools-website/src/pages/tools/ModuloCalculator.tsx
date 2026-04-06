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
  Percent,
  Sigma,
  BarChart3,
  Star,
} from "lucide-react";

type ModResult =
  | {
      ok: true;
      dividend: number;
      divisor: number;
      quotient: number;
      remainder: number;
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function euclideanRemainder(a: number, b: number): number {
  const absB = Math.abs(b);
  return ((a % absB) + absB) % absB;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
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
  { title: "Divisibility Checker", slug: "divisibility-checker", icon: <Sigma className="w-5 h-5" />, color: 145, benefit: "Check exact divisibility" },
  { title: "GCD Calculator", slug: "online-gcd-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 152, benefit: "Common divisors and factors" },
  { title: "LCM Calculator", slug: "online-lcm-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 28, benefit: "Least common multiple" },
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Percent className="w-5 h-5" />, color: 245, benefit: "Prime/composite validation" },
];

export default function ModuloCalculator() {
  const [dividendInput, setDividendInput] = useState("");
  const [divisorInput, setDivisorInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<ModResult>(() => {
    const a = parseFloat(dividendInput);
    const b = parseFloat(divisorInput);
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    if (b === 0) return { ok: false, error: "Modulo by zero is undefined." };
    const remainder = euclideanRemainder(a, b);
    const quotient = (a - remainder) / b;
    return { ok: true, dividend: a, divisor: b, quotient, remainder };
  }, [dividendInput, divisorInput]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `${fmt(result.dividend)} mod ${fmt(result.divisor)} = ${fmt(result.remainder)}. Quotient part is ${fmt(result.quotient)}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Modulo Calculator",
    description: "Free online modulo calculator to find remainders quickly.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/modulo-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Modulo Calculator - Find Division Remainder"
        description="Free online modulo calculator. Compute a mod b instantly and view quotient plus remainder with clean math output."
        canonical="https://usonlinetools.com/math/modulo-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Modulo Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Modulo Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find remainders instantly for modular arithmetic, cyclic indexing, and number theory workflows.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
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
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Remainder Engine</p>
                      <p className="text-sm text-muted-foreground">Uses Euclidean remainder so results stay within the modular range.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 260 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Calculate a mod b</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Dividend (a)" className="tool-calc-input w-full sm:w-48" value={dividendInput} onChange={(e) => setDividendInput(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">mod</span>
                      <input type="number" placeholder="Divisor (b)" className="tool-calc-input w-full sm:w-48" value={divisorInput} onChange={(e) => setDivisorInput(e.target.value)} />
                    </div>

                    {result && result.ok && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="tool-calc-result text-violet-600 dark:text-violet-400">Remainder: {fmt(result.remainder)}</div>
                        <div className="tool-calc-result">Quotient: {fmt(result.quotient)}</div>
                        <div className="tool-calc-result">Identity: a = bq + r</div>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Modulo Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter dividend (a)</p><p className="text-muted-foreground text-sm leading-relaxed">This is the number being divided.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter divisor (b)</p><p className="text-muted-foreground text-sm leading-relaxed">The divisor cannot be zero.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Read remainder and quotient</p><p className="text-muted-foreground text-sm leading-relaxed">Use the remainder for cycle logic, indices, and modular math.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Remainder shows position in cycle</p><p className="text-sm text-muted-foreground">In periodic systems, modulo gives wrap-around index values.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Zero remainder means exact division</p><p className="text-sm text-muted-foreground">When a mod b = 0, a is divisible by b.</p></div>
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"><p className="font-bold text-foreground mb-1">Euclidean modulo keeps remainder non-negative</p><p className="text-sm text-muted-foreground">Helpful for predictable behavior in programming and indexing.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Modulo Calculator"
              primaryKeyword="modulo calculator"
              intro="This modulo calculator finds remainders quickly and explains quotient-remainder identity for modular arithmetic. It is useful for programming logic, cyclic scheduling, hashing, and number-theory workflows."
              formulas={[
                { expression: "a mod b = r", explanation: "Modulo returns the remainder r after dividing a by b." },
                { expression: "a = bq + r", explanation: "Division identity links dividend, divisor, quotient, and remainder." },
                { expression: "a ≡ r (mod b)", explanation: "Congruence notation expresses equivalence classes in modular arithmetic." },
              ]}
              useCases={[
                { title: "Programming and indexing", description: "Modulo wraps values into bounded ranges for arrays, cyclic buffers, and rotations." },
                { title: "Time and cycle arithmetic", description: "Use modulo to compute repeating schedules, periodic events, and clock-style calculations." },
                { title: "Cryptography and hashing basics", description: "Modular operations are foundational in hashing, checksums, and public-key mathematics." },
              ]}
              tips={[
                "Never use zero as divisor; modulo by zero is undefined.",
                "Prefer Euclidean remainder for consistent non-negative output ranges.",
                "Validate negative-input behavior against your language/runtime rules.",
                "Use quotient + remainder identity to sanity-check manual calculations.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">29 mod 6:</strong> remainder 5</li>
                <li><strong className="text-foreground">100 mod 10:</strong> remainder 0</li>
                <li><strong className="text-foreground">-7 mod 5:</strong> Euclidean remainder 3</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-violet-500/5 border border-violet-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Great for quick modular arithmetic checks in coding tasks."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Modulo Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Clear modulo behavior.</strong> Uses Euclidean-style remainder for consistent outcomes.</p>
                <p><strong className="text-foreground">Practical output.</strong> Shows both quotient and remainder for immediate interpretation.</p>
                <p><strong className="text-foreground">Same SEO template standard.</strong> Structured content mirrors your upgraded calculator pages.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is modulo?" a="Modulo returns the remainder after dividing one number by another." />
                <FaqItem q="Is modulo the same as percentage?" a="No. Modulo is remainder arithmetic; percentage compares parts of a whole." />
                <FaqItem q="Can modulo be used in programming?" a="Yes. It is common in array indexing, hashing, and cycle logic." />
                <FaqItem q="Why does modulo by zero fail?" a="Division by zero is undefined, so modulo by zero is also undefined." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Number Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with divisibility, GCD, LCM, and prime-check calculators.</p>
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
                <p className="text-xs text-muted-foreground mb-3">Share for fast remainder and modular checks.</p>
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
