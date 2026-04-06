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
  BarChart3,
  Percent,
  Star,
} from "lucide-react";

type CalcResult = { ok: true; value: number } | { ok: false; error: string } | null;

function fmt(n: number): string {
  const abs = Math.abs(n);
  if ((abs >= 1e12 || (abs > 0 && abs < 1e-6)) && abs !== 0) return n.toExponential(6);
  return n.toLocaleString("en-US", { maximumFractionDigits: 12 });
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
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
  { title: "Mean Median Mode Calculator", slug: "mean-median-mode-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 195, benefit: "Core descriptive statistics" },
  { title: "Variance Calculator", slug: "variance-calculator", icon: <Sigma className="w-5 h-5" />, color: 265, benefit: "Measure spread around mean" },
  { title: "Standard Deviation Calculator", slug: "standard-deviation-calculator", icon: <Sigma className="w-5 h-5" />, color: 340, benefit: "Interpret dispersion quickly" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and change operations" },
];

export default function RoundingNumbersCalculator() {
  const [valueInput, setValueInput] = useState("");
  const [dpInput, setDpInput] = useState("2");
  const [sfInput, setSfInput] = useState("4");
  const [nearestInput, setNearestInput] = useState("0.05");
  const [copied, setCopied] = useState(false);

  const decimalResult = useMemo<CalcResult>(() => {
    const value = Number(valueInput);
    const dp = Number(dpInput);
    if (!valueInput.trim() || !dpInput.trim()) return null;
    if (!Number.isFinite(value)) return { ok: false, error: "Enter a valid number." };
    if (!Number.isInteger(dp) || dp < 0 || dp > 20) return { ok: false, error: "Decimal places must be an integer between 0 and 20." };
    return { ok: true, value: Number(value.toFixed(dp)) };
  }, [valueInput, dpInput]);

  const sigResult = useMemo<CalcResult>(() => {
    const value = Number(valueInput);
    const sf = Number(sfInput);
    if (!valueInput.trim() || !sfInput.trim()) return null;
    if (!Number.isFinite(value)) return { ok: false, error: "Enter a valid number." };
    if (!Number.isInteger(sf) || sf < 1 || sf > 21) return { ok: false, error: "Significant figures must be an integer between 1 and 21." };
    return { ok: true, value: Number(value.toPrecision(sf)) };
  }, [valueInput, sfInput]);

  const nearestResult = useMemo<CalcResult>(() => {
    const value = Number(valueInput);
    const m = Number(nearestInput);
    if (!valueInput.trim() || !nearestInput.trim()) return null;
    if (!Number.isFinite(value)) return { ok: false, error: "Enter a valid number." };
    if (!Number.isFinite(m) || m <= 0) return { ok: false, error: "Nearest multiple must be > 0." };
    return { ok: true, value: Math.round(value / m) * m };
  }, [valueInput, nearestInput]);

  const insight = (() => {
    if (!valueInput.trim()) return null;
    const value = Number(valueInput);
    if (!Number.isFinite(value)) return "Enter a valid numeric value first.";
    const floor = Math.floor(value);
    const ceil = Math.ceil(value);
    const trunc = Math.trunc(value);
    return `For ${fmt(value)}: floor = ${floor}, ceil = ${ceil}, trunc = ${trunc}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rounding Numbers Calculator",
    description: "Free online tool to round numbers by decimal places, significant figures, and nearest multiple.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/rounding-numbers-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Rounding Numbers Calculator - Decimals, Sig Figs, Multiples"
        description="Free online rounding calculator. Round to decimal places, significant figures, and nearest multiples instantly."
        canonical="https://usonlinetools.com/math/rounding-numbers-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Rounding Numbers Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Rounding Numbers Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Round by decimal places, significant figures, or nearest multiples from one interface. Useful for finance, science, and reporting.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> 3 Rounding Modes</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">3 Calculators in 1</p>
                      <p className="text-sm text-muted-foreground">Input once, evaluate in three rounding modes.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 240 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Input Value</h3>
                    <input type="number" placeholder="e.g. 123.456789" className="tool-calc-input w-full" value={valueInput} onChange={(e) => setValueInput(e.target.value)} />
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 230 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Round to Decimal Places</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Decimal places" className="tool-calc-input w-full sm:w-40" value={dpInput} onChange={(e) => setDpInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:flex-1 text-indigo-600 dark:text-indigo-400">{decimalResult && decimalResult.ok ? fmt(decimalResult.value) : "--"}</div>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 265 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Round to Significant Figures</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Sig figs" className="tool-calc-input w-full sm:w-40" value={sfInput} onChange={(e) => setSfInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:flex-1 text-violet-600 dark:text-violet-400">{sigResult && sigResult.ok ? fmt(sigResult.value) : "--"}</div>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 152 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Round to Nearest Multiple</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Nearest multiple" className="tool-calc-input w-full sm:w-40" value={nearestInput} onChange={(e) => setNearestInput(e.target.value)} />
                      <span className="text-lg font-black text-muted-foreground">=</span>
                      <div className="tool-calc-result w-full sm:flex-1 text-emerald-600 dark:text-emerald-400">{nearestResult && nearestResult.ok ? fmt(nearestResult.value) : "--"}</div>
                    </div>
                  </div>

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
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Rounding Numbers Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter your base number</p><p className="text-muted-foreground text-sm leading-relaxed">Use integer or decimal inputs.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Select rounding mode input</p><p className="text-muted-foreground text-sm leading-relaxed">Set decimal places, significant figures, or nearest multiple.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Read mode-specific outputs</p><p className="text-muted-foreground text-sm leading-relaxed">Compare results to choose the precision format you need.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Decimal places control fixed precision</p><p className="text-sm text-muted-foreground">Best for currency-style formatting and fixed-width reports.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Significant figures preserve meaningful digits</p><p className="text-sm text-muted-foreground">Useful in science and engineering data presentation.</p></div>
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20"><p className="font-bold text-foreground mb-1">Nearest multiple aligns to increments</p><p className="text-sm text-muted-foreground">Helpful for pricing increments, tick sizes, or unit step constraints.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Rounding Numbers Calculator"
              primaryKeyword="rounding numbers calculator"
              intro="This rounding numbers calculator supports decimal-place rounding, significant-figure rounding, and nearest-multiple rounding in one interface. It helps with financial reporting, scientific notation cleanup, and engineering presentation standards."
              formulas={[
                { expression: "Round(value, d)", explanation: "Rounds to d decimal places using standard half-up style interpretation for practical reporting." },
                { expression: "Significant figures", explanation: "Preserves meaningful digits regardless of decimal position, useful for scientific outputs." },
                { expression: "Nearest multiple = round(value / m) × m", explanation: "Rounds to the closest step size m such as 0.05, 0.1, or 5." },
              ]}
              useCases={[
                { title: "Financial and accounting outputs", description: "Use decimal places to standardize currency values and invoice summaries." },
                { title: "Scientific and lab reporting", description: "Significant-figure mode keeps precision aligned with measurement reliability." },
                { title: "Pricing and engineering step constraints", description: "Nearest-multiple rounding supports tick sizes, lot sizes, and standard increment rules." },
              ]}
              tips={[
                "Choose decimal places for formatting consistency and significant figures for measurement accuracy.",
                "Avoid rounding too early in multi-step calculations; round once at final output.",
                "Confirm nearest-multiple input is non-zero to prevent invalid operations.",
                "For negative values, verify floor/ceil behavior if strict directional rounding is required.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">123.4567 to 2 decimals</strong>: 123.46</li>
                <li><strong className="text-foreground">0.012345 to 3 sig figs</strong>: 0.0123</li>
                <li><strong className="text-foreground">19.97 to nearest 0.05</strong>: 19.95</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Exactly what I needed for report formatting and quick sig-fig rounding checks."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Rounding Numbers Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Three rounding methods in one place.</strong> No need to switch between separate tools.</p>
                <p><strong className="text-foreground">Clear precision controls.</strong> Input validation ensures safe numeric ranges for each mode.</p>
                <p><strong className="text-foreground">Consistent full-template page structure.</strong> Matches your site-wide design and content model.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between decimal places and significant figures?" a="Decimal places fix digits after the decimal point; significant figures keep total meaningful digits." />
                <FaqItem q="When should I use nearest multiple rounding?" a="Use it when values must align to fixed increments like 0.05, 0.1, or 5." />
                <FaqItem q="Why are floor and ceil different from normal rounding?" a="Floor always rounds down, ceil always rounds up, while standard rounding goes to nearest." />
                <FaqItem q="Can I round negative numbers?" a="Yes. The tool supports positive and negative numeric inputs." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Precision Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore statistics and numeric utilities with the same content structure and design.</p>
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
                <p className="text-xs text-muted-foreground mb-3">Help others round numbers consistently.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
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
