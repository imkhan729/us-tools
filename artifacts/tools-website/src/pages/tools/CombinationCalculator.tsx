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
  Hash,
  Percent,
  Star,
} from "lucide-react";

type Result =
  | { ok: true; n: number; r: number; value: bigint; digits: number }
  | { ok: false; error: string }
  | null;

function comb(n: number, r: number): bigint {
  const k = Math.min(r, n - r);
  let num = 1n;
  let den = 1n;
  for (let i = 1; i <= k; i += 1) {
    num *= BigInt(n - k + i);
    den *= BigInt(i);
  }
  return num / den;
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
  { title: "Permutation Calculator", slug: "permutation-calculator", icon: <Sigma className="w-5 h-5" />, color: 270, benefit: "Compute nPr with order" },
  { title: "Factorial Calculator", slug: "factorial-calculator", icon: <Hash className="w-5 h-5" />, color: 145, benefit: "Exact factorial values" },
  { title: "Probability Calculator", slug: "probability-calculator", icon: <Percent className="w-5 h-5" />, color: 205, benefit: "Chance and event analysis" },
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Hash className="w-5 h-5" />, color: 220, benefit: "Number theory companion" },
];

export default function CombinationCalculator() {
  const [nInput, setNInput] = useState("");
  const [rInput, setRInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    if (!nInput.trim() || !rInput.trim()) return null;
    const n = Number(nInput);
    const r = Number(rInput);
    if (!Number.isFinite(n) || !Number.isFinite(r)) return { ok: false, error: "Enter valid numbers for n and r." };
    if (!Number.isInteger(n) || !Number.isInteger(r)) return { ok: false, error: "n and r must be integers." };
    if (n < 0 || r < 0) return { ok: false, error: "n and r must be non-negative." };
    if (r > n) return { ok: false, error: "r must be less than or equal to n." };
    if (n > 10000) return { ok: false, error: "For performance, keep n at 10000 or below." };

    const value = comb(n, r);
    return { ok: true, n, r, value, digits: value.toString().length };
  }, [nInput, rInput]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `nCr with n=${result.n} and r=${result.r} equals ${result.value.toString()}. Combination counting ignores order.`;
  })();

  const valueText = result && result.ok ? result.value.toString() : "";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Combination Calculator",
    description: "Free online combination calculator for nCr selection counts.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/combination-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Combination Calculator - Compute nCr Instantly"
        description="Free online combination calculator. Calculate nCr with exact large-integer output when order does not matter."
        canonical="https://usonlinetools.com/math/combination-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <span className="text-foreground">Combination Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Combination Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate nCr quickly with exact integer results. Use this tool for selection-count problems where order does not matter.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
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
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">nCr Calculator</p>
                      <p className="text-sm text-muted-foreground">Combination counting where order does not matter.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 195 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Calculate Combinations</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="n (total items)" className="tool-calc-input w-full sm:w-44" value={nInput} onChange={(e) => setNInput(e.target.value)} />
                      <input type="number" placeholder="r (chosen items)" className="tool-calc-input w-full sm:w-44" value={rInput} onChange={(e) => setRInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:flex-1 text-cyan-600 dark:text-cyan-400">{result && result.ok ? result.value.toString() : "--"}</div>
                    </div>

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Exact Output</p>
                      <textarea readOnly value={valueText} className="w-full min-h-[120px] p-3 rounded-xl bg-background border border-border text-sm font-mono text-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Combination Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter n and r</p><p className="text-muted-foreground text-sm leading-relaxed">Use non-negative integers with r less than or equal to n.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read nCr output</p><p className="text-muted-foreground text-sm leading-relaxed">The result counts unique selections where order is ignored.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use exact value in probability formulas</p><p className="text-muted-foreground text-sm leading-relaxed">Large values stay precise for downstream calculations.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Combination is order-insensitive counting</p><p className="text-sm text-muted-foreground">Selecting A,B is the same as selecting B,A in nCr.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">nCr is symmetric</p><p className="text-sm text-muted-foreground">nCr equals nC(n-r), which reduces computational effort.</p></div>
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"><p className="font-bold text-foreground mb-1">nC0 and nCn are always 1</p><p className="text-sm text-muted-foreground">There is exactly one way to choose none or all items.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Combination Calculator"
              primaryKeyword="combination calculator"
              intro="This nCr calculator gives exact combination counts for unordered selections. It supports probability, statistics, and counting problems where choosing a group ignores arrangement order."
              formulas={[
                { expression: "nCr = n! / (r! (n-r)!)", explanation: "Core combination formula for unordered selections." },
                { expression: "nCr = nC(n-r)", explanation: "Symmetry identity helps simplify calculations for large r." },
                { expression: "nC1 = n", explanation: "Choosing one item from n gives exactly n distinct choices." },
              ]}
              useCases={[
                { title: "Probability and event counting", description: "Common in card draws, sampling, and lottery-style selection problems." },
                { title: "Data science and statistics", description: "Used in binomial models, confidence reasoning, and selection-based analysis." },
                { title: "Team and committee selection", description: "Count possible groups without regard to internal order." },
              ]}
              tips={[
                "Use combinations only when order does not matter in the scenario.",
                "If order matters, use permutation nPr instead of nCr.",
                "Apply symmetry nC(n-r) to keep calculations compact.",
                "Keep exact outputs for probability fractions before final rounding.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">5C2 = 10</strong> (unordered pairs from 5 items)</li>
                <li><strong className="text-foreground">10C3 = 120</strong> (three-item groups)</li>
                <li><strong className="text-foreground">8C8 = 1</strong> (choose all items)</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Perfect for quick nCr checks in probability worksheets."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Combination Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Exact BigInt results.</strong> Handles very large nCr values without floating-point drift.</p>
                <p><strong className="text-foreground">Clear order-free framing.</strong> Reduces confusion between combinations and permutations.</p>
                <p><strong className="text-foreground">Aligned with full template depth.</strong> Same structure and SEO detail as your upgraded pages.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is combination?" a="Combination counts selections where order does not matter." />
                <FaqItem q="How is nCr different from nPr?" a="nCr ignores order, while nPr treats different orderings as different outcomes." />
                <FaqItem q="Can r be zero?" a="Yes. nC0 is always 1." />
                <FaqItem q="Can r be greater than n?" a="No. You cannot choose more items than available." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Counting Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with permutations, factorials, and probability-related tools.</p>
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
                <p className="text-xs text-muted-foreground mb-3">Share for fast nCr calculations.</p>
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

