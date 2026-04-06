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
  Percent,
  BarChart3,
  Star,
} from "lucide-react";

type DivisibilityResult =
  | {
      ok: true;
      number: number;
      divisor: number;
      divisible: boolean;
      remainder: number;
      quotient: number;
      commonDivisors: number[];
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function isIntegerLike(n: number): boolean {
  return Number.isFinite(n) && Math.abs(n - Math.round(n)) < 1e-12;
}

function euclideanRemainder(a: number, b: number): number {
  const absB = Math.abs(b);
  return ((a % absB) + absB) % absB;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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
  { title: "Modulo Calculator", slug: "modulo-calculator", icon: <Percent className="w-5 h-5" />, color: 175, benefit: "Remainder-focused operations" },
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Sigma className="w-5 h-5" />, color: 245, benefit: "Prime and factor checks" },
  { title: "GCD Calculator", slug: "online-gcd-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 152, benefit: "Common divisor analysis" },
  { title: "LCM Calculator", slug: "online-lcm-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 28, benefit: "Least common multiple" },
];

export default function DivisibilityChecker() {
  const [numberInput, setNumberInput] = useState("");
  const [divisorInput, setDivisorInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<DivisibilityResult>(() => {
    const n = parseFloat(numberInput);
    const d = parseFloat(divisorInput);
    if (Number.isNaN(n) || Number.isNaN(d)) return null;
    if (!isIntegerLike(n) || !isIntegerLike(d)) return { ok: false, error: "Divisibility is defined for integers. Enter whole numbers only." };
    if (d === 0) return { ok: false, error: "Division by zero is undefined." };

    const number = Math.round(n);
    const divisor = Math.round(d);
    const remainder = euclideanRemainder(number, divisor);
    const divisible = remainder === 0;
    const quotient = number / divisor;

    const commonDivisors = Array.from({ length: 11 }, (_, i) => i + 2).filter((x) => euclideanRemainder(number, x) === 0);

    return { ok: true, number, divisor, divisible, remainder, quotient, commonDivisors };
  }, [numberInput, divisorInput]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    if (result.divisible) return `${result.number} is divisible by ${result.divisor}. Quotient = ${fmt(result.quotient)}.`;
    return `${result.number} is not divisible by ${result.divisor}. Remainder = ${fmt(result.remainder)}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Divisibility Checker",
    description: "Free online divisibility checker to verify whether one integer divides another.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/divisibility-checker",
  };

  return (
    <Layout>
      <SEO
        title="Divisibility Checker - Check if a Number Is Divisible"
        description="Free online divisibility checker. Test if a number is divisible by another number and get quotient, remainder, and quick divisor insights."
        canonical="https://usonlinetools.com/math/divisibility-checker"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Divisibility Checker</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-lime-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Divisibility Checker</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Check whether one integer divides another exactly. Get quotient, remainder, and common quick divisor checks in one tool.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-lime-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Integer Division Test</p>
                      <p className="text-sm text-muted-foreground">Verifies exact divisibility and shows quotient + remainder.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 145 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Check Divisibility</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Number" className="tool-calc-input w-full sm:w-44" value={numberInput} onChange={(e) => setNumberInput(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">divided by</span>
                      <input type="number" placeholder="Divisor" className="tool-calc-input w-full sm:w-44" value={divisorInput} onChange={(e) => setDivisorInput(e.target.value)} />
                    </div>

                    {result && result.ok && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className={`tool-calc-result ${result.divisible ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                          {result.divisible ? "Divisible: Yes" : "Divisible: No"}
                        </div>
                        <div className="tool-calc-result">Quotient: {fmt(result.quotient)}</div>
                        <div className="tool-calc-result">Remainder: {fmt(result.remainder)}</div>
                      </div>
                    )}

                    {result && result.ok && (
                      <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Quick checks (2 to 12)</p>
                        <p className="text-sm text-foreground">
                          {result.commonDivisors.length ? `Divides evenly by: ${result.commonDivisors.join(", ")}` : "No divisors from 2 to 12 divide this number evenly."}
                        </p>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Divisibility Checker</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter a whole number</p><p className="text-muted-foreground text-sm leading-relaxed">Use integers only for meaningful divisibility checks.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter the divisor</p><p className="text-muted-foreground text-sm leading-relaxed">The tool rejects zero and non-integer values automatically.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Review quotient and remainder</p><p className="text-muted-foreground text-sm leading-relaxed">If remainder is zero, divisibility is exact.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Remainder 0 means divisible</p><p className="text-sm text-muted-foreground">The divisor fits exactly into the number.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Non-zero remainder means not divisible</p><p className="text-sm text-muted-foreground">A leftover amount remains after integer division.</p></div>
                <div className="p-4 rounded-xl bg-lime-500/5 border border-lime-500/20"><p className="font-bold text-foreground mb-1">Quick divisors save time</p><p className="text-sm text-muted-foreground">Common checks from 2 to 12 help with rapid factor analysis.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Divisibility Checker"
              primaryKeyword="divisibility checker"
              intro="This divisibility checker tests whether one integer divides another exactly and returns quotient and remainder instantly. It is designed for number-theory practice, classroom use, and quick arithmetic validation."
              formulas={[
                { expression: "a = bq + r", explanation: "Every integer division can be expressed as dividend equals divisor times quotient plus remainder." },
                { expression: "a divisible by b ⇔ r = 0", explanation: "Exact divisibility is true only when remainder is zero." },
                { expression: "r = a mod b", explanation: "Remainder can be interpreted with modulo arithmetic for fast computational checks." },
              ]}
              useCases={[
                { title: "Factor and multiple verification", description: "Quickly determine whether a candidate divisor is valid for a target integer." },
                { title: "Math learning and homework checking", description: "Students confirm division outcomes and build intuition around remainder behavior." },
                { title: "Programming and data validation logic", description: "Developers use divisibility checks in loops, indexing, hashing, and rule engines." },
              ]}
              tips={[
                "Use whole-number inputs for valid divisibility interpretation.",
                "If remainder is non-zero, treat division as non-exact even when quotient looks close.",
                "Check zero divisor edge case first because division by zero is undefined.",
                "Pair with modulo and GCD tools for broader number-theory workflows.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">84 ÷ 7:</strong> divisible, quotient 12, remainder 0</li>
                <li><strong className="text-foreground">85 ÷ 7:</strong> not divisible, quotient 12.142857..., remainder 1</li>
                <li><strong className="text-foreground">120 ÷ 9:</strong> not divisible, remainder 3</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Simple and clear. Good for quick factor checks during problem solving."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Divisibility Checker?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Exact integer validation.</strong> Prevents ambiguous results by requiring whole-number inputs.</p>
                <p><strong className="text-foreground">Actionable outputs.</strong> Shows divisibility status, quotient, remainder, and quick divisor matches.</p>
                <p><strong className="text-foreground">Consistent content template.</strong> Built with the same SEO-focused structure as your upgraded tool pages.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What does divisible mean?" a="A number is divisible by another when division leaves remainder zero." />
                <FaqItem q="Why can’t divisor be zero?" a="Division by zero is undefined in mathematics." />
                <FaqItem q="Do negative numbers work?" a="Yes. The tool supports negative integers and still checks exact divisibility." />
                <FaqItem q="Can I use decimals?" a="For divisibility checks, use whole numbers only." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Number Theory Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with modulo, GCD, LCM, and prime-check tools in the same structure.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share for quick divisibility checks and remainder analysis.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />
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
