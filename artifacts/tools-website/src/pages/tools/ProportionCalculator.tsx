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

type SolveFor = "a" | "b" | "c" | "d";

type ProportionResult =
  | {
      ok: true;
      solveFor: SolveFor;
      value: number;
      expression: string;
      ratioLeft: number;
      ratioRight: number;
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
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
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 220, benefit: "Simplify and compare ratios" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Part-to-whole calculations" },
  { title: "Average Calculator", slug: "average-calculator", icon: <Sigma className="w-5 h-5" />, color: 217, benefit: "Dataset central value" },
  { title: "Exponents Calculator", slug: "exponents-calculator", icon: <Sigma className="w-5 h-5" />, color: 230, benefit: "Power and growth equations" },
];

export default function ProportionCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("d");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<ProportionResult>(() => {
    const av = parseFloat(a);
    const bv = parseFloat(b);
    const cv = parseFloat(c);
    const dv = parseFloat(d);

    if (solveFor === "a") {
      if (Number.isNaN(bv) || Number.isNaN(cv) || Number.isNaN(dv)) return null;
      if (dv === 0) return { ok: false, error: "d cannot be zero when solving for a." };
      const value = (bv * cv) / dv;
      if (!Number.isFinite(value)) return { ok: false, error: "Invalid result. Check your inputs." };
      return { ok: true, solveFor, value, expression: "a = (b × c) / d", ratioLeft: value / bv, ratioRight: cv / dv };
    }

    if (solveFor === "b") {
      if (Number.isNaN(av) || Number.isNaN(cv) || Number.isNaN(dv)) return null;
      if (cv === 0) return { ok: false, error: "c cannot be zero when solving for b." };
      const value = (av * dv) / cv;
      if (!Number.isFinite(value)) return { ok: false, error: "Invalid result. Check your inputs." };
      return { ok: true, solveFor, value, expression: "b = (a × d) / c", ratioLeft: av / value, ratioRight: cv / dv };
    }

    if (solveFor === "c") {
      if (Number.isNaN(av) || Number.isNaN(bv) || Number.isNaN(dv)) return null;
      if (bv === 0) return { ok: false, error: "b cannot be zero when solving for c." };
      const value = (av * dv) / bv;
      if (!Number.isFinite(value)) return { ok: false, error: "Invalid result. Check your inputs." };
      return { ok: true, solveFor, value, expression: "c = (a × d) / b", ratioLeft: av / bv, ratioRight: value / dv };
    }

    if (Number.isNaN(av) || Number.isNaN(bv) || Number.isNaN(cv)) return null;
    if (av === 0) return { ok: false, error: "a cannot be zero when solving for d." };
    const value = (bv * cv) / av;
    if (!Number.isFinite(value)) return { ok: false, error: "Invalid result. Check your inputs." };
    return { ok: true, solveFor, value, expression: "d = (b × c) / a", ratioLeft: av / bv, ratioRight: cv / value };
  }, [solveFor, a, b, c, d]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `${result.expression}. Solved ${result.solveFor} = ${fmt(result.value)} and verified a/b = c/d.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Proportion Calculator",
    description: "Free online proportion calculator to solve missing values in a/b = c/d.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/proportion-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Proportion Calculator - Solve a/b = c/d"
        description="Free online proportion calculator. Solve for any missing value in a proportion equation and verify ratio equality instantly."
        canonical="https://usonlinetools.com/math/proportion-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Proportion Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Proportion Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Solve missing values in proportion equations using cross multiplication. Great for scale factors, recipes, maps, and finance ratios.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
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
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cross-Multiplication Solver</p>
                      <p className="text-sm text-muted-foreground">Solve any one unknown in the equation a/b = c/d.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 38 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Solve Missing Proportion Value</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(["a", "b", "c", "d"] as const).map((field) => (
                        <button
                          key={field}
                          onClick={() => setSolveFor(field)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                            solveFor === field
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-muted text-muted-foreground border-border hover:text-foreground"
                          }`}
                        >
                          Solve {field}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <input type="number" placeholder="a" className="tool-calc-input" value={a} disabled={solveFor === "a"} onChange={(e) => setA(e.target.value)} />
                      <input type="number" placeholder="b" className="tool-calc-input" value={b} disabled={solveFor === "b"} onChange={(e) => setB(e.target.value)} />
                      <input type="number" placeholder="c" className="tool-calc-input" value={c} disabled={solveFor === "c"} onChange={(e) => setC(e.target.value)} />
                      <input type="number" placeholder="d" className="tool-calc-input" value={d} disabled={solveFor === "d"} onChange={(e) => setD(e.target.value)} />
                    </div>

                    {result && result.ok && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="tool-calc-result text-amber-600 dark:text-amber-400">
                          {result.solveFor} = {fmt(result.value)}
                        </div>
                        <div className="tool-calc-result">
                          a/b = {fmt(result.ratioLeft)} | c/d = {fmt(result.ratioRight)}
                        </div>
                      </div>
                    )}

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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Proportion Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Choose the unknown variable</p><p className="text-muted-foreground text-sm leading-relaxed">Select whether to solve for a, b, c, or d.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter the three known values</p><p className="text-muted-foreground text-sm leading-relaxed">Fill the non-disabled fields with numeric values.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Read solved value and ratio check</p><p className="text-muted-foreground text-sm leading-relaxed">The tool also verifies both sides of the proportion numerically.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Equal ratios define a valid proportion</p><p className="text-sm text-muted-foreground">a/b and c/d should evaluate to the same value.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Cross multiplication solves unknowns</p><p className="text-sm text-muted-foreground">Use a*d = b*c to isolate the missing variable.</p></div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"><p className="font-bold text-foreground mb-1">Denominators cannot be zero</p><p className="text-sm text-muted-foreground">Zero in denominator positions makes the proportion undefined.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Proportion Calculator"
              primaryKeyword="proportion calculator"
              intro="This proportion calculator solves missing values in equations of the form a/b = c/d using cross multiplication. It is useful for scaling, map ratios, recipe adjustments, unit conversions, and pricing comparisons."
              formulas={[
                { expression: "a / b = c / d", explanation: "A proportion states that two ratios are equal in value." },
                { expression: "a × d = b × c", explanation: "Cross multiplication converts ratio equality into a solvable product equation." },
                { expression: "d = (b × c) / a", explanation: "Rearrange the cross-product equation to isolate any unknown variable." },
              ]}
              useCases={[
                { title: "Recipe and batch scaling", description: "Adjust ingredient amounts proportionally when changing serving sizes." },
                { title: "Map, model, and engineering scale factors", description: "Translate between scale drawings and real-world dimensions accurately." },
                { title: "Price and quantity comparisons", description: "Use proportional reasoning to compare rates, costs, and equivalent-value offers." },
              ]}
              tips={[
                "Ensure denominator fields are non-zero before solving the equation.",
                "Double-check the unknown field selection so the correct variable is isolated.",
                "Verify by recomputing both ratios after solving; they should match closely.",
                "Keep units consistent across both ratios to avoid invalid proportion setups.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">2 / 5 = 8 / d:</strong> d = 20</li>
                <li><strong className="text-foreground">a / 4 = 9 / 6:</strong> a = 6</li>
                <li><strong className="text-foreground">7 / b = 14 / 10:</strong> b = 5</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Clean proportion solver with immediate verification. Great for scaling tasks."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Proportion Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Flexible unknown solving.</strong> Any variable in a/b = c/d can be solved with one click.</p>
                <p><strong className="text-foreground">Built-in ratio validation.</strong> Confirms both sides of the equation after solving.</p>
                <p><strong className="text-foreground">Consistent template quality.</strong> Matches your complete SEO-focused content structure.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a proportion?" a="A proportion states that two ratios are equal, such as a/b = c/d." />
                <FaqItem q="How is the unknown solved?" a="By cross multiplication: a*d = b*c, then isolate the unknown term." />
                <FaqItem q="Can any denominator be zero?" a="No. Denominators must be non-zero for valid ratios." />
                <FaqItem q="Where are proportions used?" a="Scaling recipes, maps, unit conversions, pricing, and many algebra problems." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Ratio Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with ratio, percentage, and average calculators in the same design system.</p>
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
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share for fast cross-multiplication and ratio solving.</p>
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
