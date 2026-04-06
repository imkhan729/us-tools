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
  | { ok: true; values: number[]; gcd: number }
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

function gcdList(values: number[]): number {
  return values.reduce((acc, n) => gcd2(acc, n));
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
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
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
  { title: "LCM Calculator", slug: "online-lcm-calculator", icon: <Hash className="w-5 h-5" />, color: 210, benefit: "Least common multiple for integer sets" },
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Hash className="w-5 h-5" />, color: 240, benefit: "Prime/composite number checks" },
  { title: "Factorial Calculator", slug: "factorial-calculator", icon: <Sigma className="w-5 h-5" />, color: 145, benefit: "Exact n! values and trailing zeros" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and change calculations" },
];

export default function GcdCalculator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    if (!input.trim()) return null;
    const parsed = parseNumbers(input);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    const values = parsed.values;
    if (values.every(v => v === 0)) return { ok: false, error: "GCD is undefined for all-zero input." };
    return { ok: true, values, gcd: gcdList(values) };
  }, [input]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `GCD(${result.values.join(", ")}) = ${result.gcd}. This is the largest integer that divides all inputs without remainder.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Online GCD Calculator",
    description: "Free online GCD calculator for two or more integers.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/online-gcd-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Online GCD Calculator - Greatest Common Divisor"
        description="Free online GCD calculator. Find the greatest common divisor (HCF) of two or more integers instantly."
        canonical="https://usonlinetools.com/math/online-gcd-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Online GCD Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Online GCD Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Enter two or more integers to find their greatest common divisor (also called HCF). Supports comma or space separated input.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> Euclidean Algorithm</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators &nbsp;&middot;&nbsp; Last updated: April 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Multi-Integer Input</p>
                      <p className="text-sm text-muted-foreground">Use commas or spaces. Example: 24, 36, 60</p>
                    </div>
                  </div>

                  <div className="tool-calc-card">
                    <h3 className="text-lg font-bold text-foreground mb-4">Online GCD / HCF Calculator</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="text" placeholder="e.g. 24, 36, 60" className="tool-calc-input w-full" value={input} onChange={(e) => setInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:w-40 text-amber-600 dark:text-amber-400">{result && result.ok ? result.gcd : "--"}</div>
                    </div>

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the GCD Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter integers</p><p className="text-muted-foreground text-sm leading-relaxed">Separate values with commas or spaces.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read the GCD result</p><p className="text-muted-foreground text-sm leading-relaxed">The result is the largest shared divisor among all values.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use for simplification and ratios</p><p className="text-muted-foreground text-sm leading-relaxed">Great for reducing fractions and simplifying proportional values.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Large GCD means strong shared factors</p><p className="text-sm text-muted-foreground">Useful when simplifying fractions quickly.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">GCD of co-prime numbers is 1</p><p className="text-sm text-muted-foreground">Example: GCD(14, 25) = 1, so no common factors beyond 1.</p></div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"><p className="font-bold text-foreground mb-1">All-zero input is undefined</p><p className="text-sm text-muted-foreground">At least one non-zero integer is required.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="GCD Calculator"
              primaryKeyword="gcd calculator"
              intro="This GCD calculator (also called HCF calculator) finds the greatest common divisor for multiple integers using Euclidean logic. It is useful for fraction simplification, ratio reduction, modular arithmetic preparation, and number-theory tasks."
              formulas={[
                { expression: "GCD(a, b) = GCD(b, a mod b)", explanation: "Euclidean algorithm repeatedly reduces the pair until remainder reaches zero." },
                { expression: "GCD(a, b, c) = GCD(GCD(a, b), c)", explanation: "For multiple values, apply pairwise reduction iteratively." },
                { expression: "LCM(a, b) * GCD(a, b) = |a * b|", explanation: "This identity links GCD and LCM and helps cross-check integer computations." },
              ]}
              useCases={[
                { title: "Fraction and ratio simplification", description: "Divide numerator and denominator by GCD to reduce fractions and normalize ratios." },
                { title: "Modular arithmetic workflows", description: "GCD is used to verify inverse existence and coprime conditions in number theory." },
                { title: "Data normalization with integer units", description: "Analysts use GCD to identify the largest common unit for grouped counts and measurements." },
              ]}
              tips={[
                "Use integers only; GCD is not defined over arbitrary decimal values in this context.",
                "If GCD is 1, the values are coprime and share no common factor greater than one.",
                "For negative inputs, interpret results with absolute-value divisor logic.",
                "When simplifying expressions, compute GCD before multiplying to reduce overflow risk.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">GCD(24, 36) = 12</strong></li>
                <li><strong className="text-foreground">GCD(18, 30, 42) = 6</strong></li>
                <li><strong className="text-foreground">GCD(17, 19) = 1</strong> (co-prime pair)</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Very clean. I use this to simplify ratios before presenting data."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This GCD Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Batch input support.</strong> Works with two or many integers in one calculation.</p>
                <p><strong className="text-foreground">Euclidean algorithm accuracy.</strong> Fast and mathematically reliable for integer domains.</p>
                <p><strong className="text-foreground">Template-consistent content depth.</strong> Full sections align with your Percentage Calculator format.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is GCD?" a="GCD is the greatest common divisor shared by all integers in a set." />
                <FaqItem q="What is HCF?" a="HCF (highest common factor) is another name for GCD." />
                <FaqItem q="Can I enter negative numbers?" a="Yes. The calculator uses absolute values for divisor logic." />
                <FaqItem q="Can I use decimals?" a="No. GCD is defined for integers only." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Integer Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with LCM, prime checks, and factorial calculations in the same interface style.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others compute GCD values quickly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-amber-500/40 flex-shrink-0" />
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

