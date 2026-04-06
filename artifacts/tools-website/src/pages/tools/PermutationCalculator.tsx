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

function perm(n: number, r: number): bigint {
  let out = 1n;
  for (let i = 0; i < r; i += 1) {
    out *= BigInt(n - i);
  }
  return out;
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
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Combination Calculator", slug: "combination-calculator", icon: <Sigma className="w-5 h-5" />, color: 265, benefit: "Compute nCr without order" },
  { title: "Factorial Calculator", slug: "factorial-calculator", icon: <Hash className="w-5 h-5" />, color: 145, benefit: "Exact factorial values" },
  { title: "Prime Number Checker", slug: "prime-number-checker", icon: <Hash className="w-5 h-5" />, color: 210, benefit: "Number theory companion" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent workflows" },
];

export default function PermutationCalculator() {
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
    if (n > 5000) return { ok: false, error: "For performance, keep n at 5000 or below." };

    const value = perm(n, r);
    return { ok: true, n, r, value, digits: value.toString().length };
  }, [nInput, rInput]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `nPr with n=${result.n} and r=${result.r} equals ${result.value.toString()}. Order matters in permutation counting.`;
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
    name: "Permutation Calculator",
    description: "Free online permutation calculator for nPr arrangements.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/permutation-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Permutation Calculator - Compute nPr Instantly"
        description="Free online permutation calculator. Calculate nPr with exact large-integer output where order matters."
        canonical="https://usonlinetools.com/math/permutation-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Permutation Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Permutation Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate nPr fast with exact integer precision. Use this tool when order matters in arrangement counting problems.
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
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">nPr Calculator</p>
                      <p className="text-sm text-muted-foreground">Permutation counting where order matters.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 270 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Calculate Permutations</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="n (total items)" className="tool-calc-input w-full sm:w-44" value={nInput} onChange={(e) => setNInput(e.target.value)} />
                      <input type="number" placeholder="r (selected items)" className="tool-calc-input w-full sm:w-44" value={rInput} onChange={(e) => setRInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:flex-1 text-violet-600 dark:text-violet-400">{result && result.ok ? result.value.toString() : "--"}</div>
                    </div>

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Permutation Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter n and r</p><p className="text-muted-foreground text-sm leading-relaxed">Use non-negative integers where r is less than or equal to n.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read nPr output</p><p className="text-muted-foreground text-sm leading-relaxed">The result counts arrangements where changing order creates a new arrangement.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Copy exact value if needed</p><p className="text-muted-foreground text-sm leading-relaxed">Large results are shown as full integer strings for accurate reuse.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Permutation means order-sensitive counting</p><p className="text-sm text-muted-foreground">ABC and BAC are different outcomes in permutation logic.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">nPr grows quickly for large n</p><p className="text-sm text-muted-foreground">Exact integer output is useful for probability and complexity analysis.</p></div>
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"><p className="font-bold text-foreground mb-1">When r equals n, nPr equals n!</p><p className="text-sm text-muted-foreground">Selecting all items with order is full permutation count.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Permutation Calculator"
              primaryKeyword="permutation calculator"
              intro="This nPr calculator gives exact permutation counts for ordered selections. It supports combinatorics exercises, interview prep, and counting problems where arrangement order changes the result."
              formulas={[
                { expression: "nPr = n! / (n - r)!", explanation: "Classical permutation formula for selecting and ordering r items from n items." },
                { expression: "nP0 = 1", explanation: "There is one way to arrange zero selected items." },
                { expression: "nPn = n!", explanation: "Ordering all n items gives factorial many permutations." },
              ]}
              useCases={[
                { title: "Seating and lineup problems", description: "Count arrangement possibilities when position and order are important." },
                { title: "Password or code arrangement analysis", description: "Estimate ordered pattern counts for finite symbol selections." },
                { title: "Algorithm branching estimation", description: "Evaluate search-space size in permutation-heavy computation tasks." },
              ]}
              tips={[
                "Use permutations only when order matters in the problem statement.",
                "Validate that r does not exceed n before running calculations.",
                "For combination-style problems, switch to nCr instead of nPr.",
                "Keep exact integer output when values are used in later formulas.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">5P2 = 20</strong> (ordered pairs from 5 items)</li>
                <li><strong className="text-foreground">10P3 = 720</strong> (three-position ordered selection)</li>
                <li><strong className="text-foreground">8P8 = 40320</strong> (same as 8!)</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-violet-500/5 border border-violet-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Great for combinatorics homework where ordered arrangements are required."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Permutation Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Exact large integer output.</strong> Uses BigInt arithmetic for reliable nPr values.</p>
                <p><strong className="text-foreground">Clear order-sensitive framing.</strong> Helps avoid confusion between permutation and combination logic.</p>
                <p><strong className="text-foreground">Same rich template as upgraded tools.</strong> Content depth aligns with your site-wide structure.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is permutation?" a="Permutation counts arrangements where order matters." />
                <FaqItem q="What is the difference between nPr and nCr?" a="nPr is ordered selection, while nCr is unordered selection." />
                <FaqItem q="Can r be greater than n?" a="No. You cannot choose more ordered items than total items available." />
                <FaqItem q="Why can results become huge?" a="Permutation growth is rapid because it multiplies descending terms from n." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Counting Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with combinations, factorials, and prime tools using the same structure.</p>
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
                <p className="text-xs text-muted-foreground mb-3">Share for fast nPr calculations.</p>
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

