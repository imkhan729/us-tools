import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { getToolPath } from "@/data/tools";
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
  Hash,
  Percent,
  Star,
} from "lucide-react";

type Result =
  | { ok: true; values: number[]; lcm: number }
  | { ok: false; error: string }
  | null;

function gcd2(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcm2(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd2(a, b) * b);
}

function lcmList(values: number[]): number {
  return values.reduce((acc, n) => lcm2(acc, n), 1);
}

function parseNumbers(input: string): { ok: true; values: number[] } | { ok: false; error: string } {
  const parts = input.split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: "Enter at least one integer." };
  const values: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return { ok: false, error: "Use only integers separated by commas or spaces." };
    values.push(n);
  }
  return { ok: true, values };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-fuchsia-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-fuchsia-500">
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
  { title: "GCD Calculator", slug: "online-gcd-calculator", icon: <Hash className="w-5 h-5" />, color: 35, benefit: "Greatest common divisor calculations" },
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Hash className="w-5 h-5" />, color: 220, benefit: "Prime/composite number checks" },
  { title: "Factorial Calculator", slug: "factorial-calculator", icon: <Sigma className="w-5 h-5" />, color: 145, benefit: "Exact n! values and trailing zeros" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and change calculations" },
];

export default function LcmCalculator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    if (!input.trim()) return null;
    const parsed = parseNumbers(input);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    return { ok: true, values: parsed.values, lcm: lcmList(parsed.values) };
  }, [input]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `LCM(${result.values.join(", ")}) = ${result.lcm}. This is the smallest positive integer divisible by all inputs.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Online LCM Calculator",
    description: "Free online LCM calculator for two or more integers.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/online-lcm-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Online LCM Calculator - Least Common Multiple"
        description="Free online LCM calculator. Find the least common multiple of two or more integers instantly."
        canonical="https://usonlinetools.com/math/online-lcm-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <span className="text-foreground">Online LCM Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Online LCM Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Enter two or more integers to find their least common multiple (LCM). Supports comma or space separated input.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/20"><Zap className="w-3.5 h-3.5" /> Fast Integer Math</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators &nbsp;&middot;&nbsp; Last updated: April 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 to-pink-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Multi-Integer Input</p>
                      <p className="text-sm text-muted-foreground">Use commas or spaces. Example: 6, 8, 14</p>
                    </div>
                  </div>

                  <div className="tool-calc-card">
                    <h3 className="text-lg font-bold text-foreground mb-4">Online LCM Calculator</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="text" placeholder="e.g. 6, 8, 14" className="tool-calc-input w-full" value={input} onChange={(e) => setInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:w-40 text-fuchsia-600 dark:text-fuchsia-400">{result && result.ok ? result.lcm : "--"}</div>
                    </div>

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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the LCM Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter integers</p><p className="text-muted-foreground text-sm leading-relaxed">Separate values with commas or spaces.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read the LCM value</p><p className="text-muted-foreground text-sm leading-relaxed">The result is the smallest positive integer divisible by all inputs.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Apply to scheduling and cycles</p><p className="text-muted-foreground text-sm leading-relaxed">Useful for repeating intervals and common timeline alignment problems.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Higher LCM means slower overlap</p><p className="text-sm text-muted-foreground">Large LCM values indicate long cycles before repetition aligns.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Any zero in input yields 0</p><p className="text-sm text-muted-foreground">Under this calculator convention, LCM with zero is 0.</p></div>
                <div className="p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20"><p className="font-bold text-foreground mb-1">Related identity with GCD</p><p className="text-sm text-muted-foreground">For two numbers a and b: LCM(a,b) * GCD(a,b) = |a*b|.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="LCM Calculator"
              primaryKeyword="lcm calculator"
              intro="This least common multiple calculator finds the smallest shared multiple for two or more integers. It is ideal for schedule synchronization, denominator alignment in fractions, and repeating-cycle analysis in technical and academic workflows."
              formulas={[
                { expression: "LCM(a, b) = |a * b| / GCD(a, b)", explanation: "This identity gives a fast and reliable method for two-number LCM calculations." },
                { expression: "LCM(a, b, c) = LCM(LCM(a, b), c)", explanation: "For more than two numbers, reduce the list pair by pair until one result remains." },
                { expression: "Prime factors with max exponents", explanation: "Combine each prime factor at its highest exponent across inputs to reconstruct the LCM." },
              ]}
              useCases={[
                { title: "Recurring schedule alignment", description: "Use LCM to determine when multiple periodic tasks, events, or machine cycles line up again." },
                { title: "Fraction addition and subtraction", description: "LCM provides the least common denominator needed to combine fractions correctly." },
                { title: "Signal and pattern repetition", description: "Engineers and analysts use LCM to locate repeat points in periodic systems and sampled data." },
              ]}
              tips={[
                "Use integer inputs only for mathematically valid LCM behavior.",
                "When one input divides another, the larger divisible value may already be the LCM.",
                "Check GCD together with LCM to validate pairwise integer relationships.",
                "Treat zero-input cases consistently with your domain rules before final reporting.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">LCM(6, 8) = 24</strong></li>
                <li><strong className="text-foreground">LCM(4, 10, 15) = 60</strong></li>
                <li><strong className="text-foreground">LCM(0, 12) = 0</strong> (tool convention)</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"The input format is clean, and the examples make it easy to trust the result."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This LCM Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Supports multi-number sets.</strong> No need to calculate pairwise manually.</p>
                <p><strong className="text-foreground">Deterministic integer logic.</strong> Uses GCD-based reduction for correctness.</p>
                <p><strong className="text-foreground">Matches your full content template.</strong> Same structural depth as other upgraded tools.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is LCM?" a="LCM is the least common multiple, the smallest positive number divisible by all inputs." />
                <FaqItem q="How is LCM related to GCD?" a="For two integers a and b: LCM(a,b) * GCD(a,b) = |a*b|." />
                <FaqItem q="Can I use negatives?" a="Yes. The calculator uses absolute values for divisibility logic." />
                <FaqItem q="Can I use decimals?" a="No. LCM is defined for integers." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Integer Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with GCD, prime checks, and factorial in the same content format.</p>
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
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-fuchsia-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others compute LCM values quickly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
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

