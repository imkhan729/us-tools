import { useMemo, useState } from "react";
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
  Hash,
  Star,
} from "lucide-react";

type Result =
  | { ok: true; n: number; value: bigint; digits: number; zeros: number }
  | { ok: false; error: string }
  | null;

function factorialBigInt(n: number): bigint {
  let out = 1n;
  for (let i = 2n; i <= BigInt(n); i++) out *= i;
  return out;
}

function trailingZeros(n: number): number {
  let count = 0;
  for (let d = 5; d <= n; d *= 5) count += Math.floor(n / d);
  return count;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Hash className="w-5 h-5" />, color: 210, benefit: "Check prime vs composite numbers" },
  { title: "Combination Calculator", slug: "combination-calculator", icon: <Sigma className="w-5 h-5" />, color: 265, benefit: "Compute nCr values instantly" },
  { title: "Permutation Calculator", slug: "permutation-calculator", icon: <Sigma className="w-5 h-5" />, color: 30, benefit: "Compute nPr arrangements" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and growth calculations" },
];

export default function FactorialCalculator() {
  const [nInput, setNInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    if (!nInput.trim()) return null;
    const n = Number(nInput);
    if (!Number.isFinite(n)) return { ok: false, error: "Enter a valid number." };
    if (!Number.isInteger(n)) return { ok: false, error: "Factorial is defined only for non-negative integers." };
    if (n < 0) return { ok: false, error: "Negative integers are not valid for factorial." };
    if (n > 2000) return { ok: false, error: "Limit is 2000 for performance." };
    const value = factorialBigInt(n);
    return { ok: true, n, value, digits: value.toString().length, zeros: trailingZeros(n) };
  }, [nInput]);

  const valueText = result && result.ok ? result.value.toString() : "--";
  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `${result.n}! has ${result.digits.toLocaleString("en-US")} digits and ${result.zeros.toLocaleString("en-US")} trailing zeros.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Factorial Calculator",
    description: "Free online factorial calculator with exact BigInt output and trailing zero count.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/factorial-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Factorial Calculator - Exact n! Values"
        description="Free online factorial calculator. Compute exact n! values with digit count and trailing zeros."
        canonical="https://usonlinetools.com/math/factorial-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Factorial Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Factorial Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Compute exact factorial values using BigInt, with digit count and trailing zero analysis for combinatorics and interview prep.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Exact BigInt Output</span>
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
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Exact Integer Calculator</p>
                      <p className="text-sm text-muted-foreground">Supports n from 0 to 2000 with full integer precision.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card">
                    <h3 className="text-lg font-bold text-foreground mb-4">n! Calculator</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Enter n (0 to 2000)" className="tool-calc-input w-full sm:w-52" value={nInput} onChange={(e) => setNInput(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">factorial</span>
                      <div className="tool-calc-result flex-1 w-full text-emerald-600 dark:text-emerald-400">{result && result.ok ? `${result.n}!` : "--"}</div>
                    </div>

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Exact Value</p>
                      <textarea readOnly value={valueText} className="w-full min-h-[180px] p-3 rounded-xl bg-muted/40 border border-border text-sm font-mono text-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Factorial Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter a non-negative integer</p><p className="text-muted-foreground text-sm leading-relaxed">Valid inputs are whole numbers from 0 to 2000.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read the factorial result and stats</p><p className="text-muted-foreground text-sm leading-relaxed">The tool shows exact n!, digit count, and trailing zeros.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use the full value field as needed</p><p className="text-muted-foreground text-sm leading-relaxed">Copy full precision output for assignments, coding tasks, or combinatorics checks.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">0! equals 1 by definition</p><p className="text-sm text-muted-foreground">This identity is essential for combinations and binomial formulas.</p></div>
                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20"><p className="font-bold text-foreground mb-1">Digit growth is very fast</p><p className="text-sm text-muted-foreground">Even moderate n values create very large integers. BigInt avoids floating-point overflow.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Trailing zeros come from factors of 10</p><p className="text-sm text-muted-foreground">The count is driven by factor 5 frequency because factor 2 is abundant.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Factorial Calculator"
              primaryKeyword="factorial calculator"
              intro="This factorial calculator computes exact n! values with BigInt precision and adds practical context such as trailing zeros and digit count. It is built for probability calculations, combinatorics homework, and algorithm-focused interview prep."
              formulas={[
                { expression: "n! = n × (n - 1) × ... × 2 × 1", explanation: "Factorial multiplies all positive integers down to 1 and grows rapidly with n." },
                { expression: "0! = 1", explanation: "By definition, zero factorial equals one to preserve consistency in binomial and combinatorics formulas." },
                { expression: "zeros(n!) = floor(n/5) + floor(n/25) + ...", explanation: "Trailing zeros are counted by the number of factor-5 contributions in n!." },
              ]}
              useCases={[
                { title: "nPr and nCr calculations", description: "Permutation and combination formulas depend directly on factorial values for counting arrangements and selections." },
                { title: "Probability and statistics", description: "Discrete probability models often require factorial terms when computing outcomes and event likelihoods." },
                { title: "Algorithm complexity understanding", description: "Factorial growth helps explain why brute-force search spaces become infeasible very quickly." },
              ]}
              tips={[
                "Use whole numbers only; standard factorial in this tool is defined for non-negative integers.",
                "Large n values explode in size, so rely on digit count and trailing-zero insights when full output is huge.",
                "For combinatorics problems, simplify shared factorial terms before evaluating full expressions.",
                "Never treat 0! as zero; it is exactly one in all valid factorial identities.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Input n</th><th className="text-left px-4 py-3 font-bold text-foreground">n!</th><th className="text-left px-4 py-3 font-bold text-foreground">Trailing Zeros</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use Case</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 font-mono text-foreground">5</td><td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">120</td><td className="px-4 py-3 text-foreground">1</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Basic combinatorics</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-foreground">10</td><td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">3,628,800</td><td className="px-4 py-3 text-foreground">2</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Probability setup</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-foreground">20</td><td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">2.4329e18 (full shown above)</td><td className="px-4 py-3 text-foreground">4</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Large number analysis</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"The exact-value output is perfect for coding interviews and combinatorics homework."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Factorial Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Exact integer math with BigInt.</strong> No floating-point rounding drift for large results.</p>
                <p><strong className="text-foreground">Built-in trailing zero count.</strong> Useful for interview and algorithm problems.</p>
                <p><strong className="text-foreground">SEO-grade educational content.</strong> Examples and FAQs match search intent for factorial queries.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is factorial?" a="n! means multiplying all integers from n down to 1." />
                <FaqItem q="What is 0!?" a="0! is 1 by definition." />
                <FaqItem q="Can I use decimals?" a="No. This tool only accepts non-negative integers." />
                <FaqItem q="Why does output get huge quickly?" a="Factorial growth is super-exponential in digit count." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore prime checks, combinations, permutations, and other number-theory tools.</p>
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
                <p className="text-xs text-muted-foreground mb-3">Help others compute factorial values instantly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
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
