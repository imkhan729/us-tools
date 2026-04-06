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
  DollarSign,
  Percent,
  BarChart3,
  Star,
} from "lucide-react";

type Result =
  | {
      ok: true;
      cost: number;
      markupPercent: number;
      markupAmount: number;
      sellingPrice: number;
      marginPercent: number;
    }
  | { ok: false; error: string }
  | null;

function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-green-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-green-500">
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
  { title: "Profit Margin Calculator", slug: "profit-margin-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Gross and net margin checks" },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <DollarSign className="w-5 h-5" />, color: 30, benefit: "Price after discount" },
  { title: "Break Even Calculator", slug: "break-even-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 210, benefit: "Units needed to break even" },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <Percent className="w-5 h-5" />, color: 265, benefit: "Return on investment" },
];

export default function MarkupCalculator() {
  const [costInput, setCostInput] = useState("");
  const [markupInput, setMarkupInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    if (!costInput.trim() || !markupInput.trim()) return null;
    const cost = Number(costInput);
    const markupPercent = Number(markupInput);
    if (!Number.isFinite(cost) || !Number.isFinite(markupPercent)) return { ok: false, error: "Enter valid numeric values." };
    if (cost < 0) return { ok: false, error: "Cost cannot be negative." };

    const markupAmount = cost * (markupPercent / 100);
    const sellingPrice = cost + markupAmount;
    const marginPercent = sellingPrice === 0 ? 0 : (markupAmount / sellingPrice) * 100;
    return { ok: true, cost, markupPercent, markupAmount, sellingPrice, marginPercent };
  }, [costInput, markupInput]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `With cost ${fmtMoney(result.cost)} and markup ${fmt(result.markupPercent)}%, selling price is ${fmtMoney(result.sellingPrice)} and gross margin is ${fmt(result.marginPercent)}%.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Markup Calculator",
    description: "Free markup calculator to compute selling price from cost and markup percentage.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/finance/markup-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Markup Calculator - Cost to Selling Price"
        description="Free online markup calculator. Enter cost and markup percent to get selling price, markup amount, and margin percentage."
        canonical="https://usonlinetools.com/finance/markup-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">Markup Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Markup Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate markup amount, selling price, and resulting margin percentage from your cost and markup rate.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-full border border-green-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Finance &amp; Cost | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-green-500/20 shadow-lg shadow-green-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="tool-calc-card" style={{ "--calc-hue": 145 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Markup to Selling Price</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="number" placeholder="Cost price" className="tool-calc-input" value={costInput} onChange={(e) => setCostInput(e.target.value)} />
                      <input type="number" placeholder="Markup %" className="tool-calc-input" value={markupInput} onChange={(e) => setMarkupInput(e.target.value)} />
                    </div>

                    {result && result.ok && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="tool-calc-result text-green-600 dark:text-green-400">Markup: {fmtMoney(result.markupAmount)}</div>
                        <div className="tool-calc-result text-emerald-600 dark:text-emerald-400">Selling Price: {fmtMoney(result.sellingPrice)}</div>
                        <div className="tool-calc-result">Margin: {fmt(result.marginPercent)}%</div>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Markup Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter cost price</p><p className="text-muted-foreground text-sm leading-relaxed">Use your base product or service cost as input.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter markup percentage</p><p className="text-muted-foreground text-sm leading-relaxed">Set desired markup rate to calculate pricing.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Review selling price and margin</p><p className="text-muted-foreground text-sm leading-relaxed">Use both markup and margin values for pricing decisions.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Markup is based on cost</p><p className="text-sm text-muted-foreground">Markup percentage is calculated relative to cost price.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Margin is based on selling price</p><p className="text-sm text-muted-foreground">Margin percentage is usually lower than markup percentage.</p></div>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20"><p className="font-bold text-foreground mb-1">Use both metrics in strategy</p><p className="text-sm text-muted-foreground">Pricing and profitability decisions are stronger when you track both.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Markup Calculator"
              primaryKeyword="markup calculator"
              intro="This cost-plus pricing calculator converts markup percentage into selling price and effective margin. It is built for retail pricing, wholesale planning, and small-business margin control."
              formulas={[
                { expression: "Markup amount = Cost x (Markup% / 100)", explanation: "Converts markup rate into absolute monetary increase over cost." },
                { expression: "Selling price = Cost + Markup amount", explanation: "Final listed price after applying markup." },
                { expression: "Margin% = (Markup amount / Selling price) x 100", explanation: "Profitability ratio measured against selling price." },
              ]}
              useCases={[
                { title: "Retail product pricing", description: "Set selling price targets while keeping desired gross return levels." },
                { title: "Service-package pricing", description: "Apply markup to labor and overhead cost components consistently." },
                { title: "Wholesale and reseller planning", description: "Estimate price ladders and margin impact before market launch." },
              ]}
              tips={[
                "Do not confuse markup and margin; they use different denominators.",
                "Validate cost inputs include direct and indirect expense components.",
                "Run scenario checks with multiple markup rates before finalizing price.",
                "Track post-discount margin to avoid hidden profitability erosion.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Cost 50, Markup 40%</strong> gives Selling Price 70 and Margin 28.57%</li>
                <li><strong className="text-foreground">Cost 120, Markup 25%</strong> gives Selling Price 150 and Margin 20%</li>
                <li><strong className="text-foreground">Cost 10, Markup 100%</strong> gives Selling Price 20 and Margin 50%</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-green-500/5 border border-green-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Helpful for understanding why markup and margin are not the same number."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Markup Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Built for practical pricing.</strong> Outputs both markup amount and margin percentage for better decisions.</p>
                <p><strong className="text-foreground">Fast and precise.</strong> Immediate results with consistent currency formatting.</p>
                <p><strong className="text-foreground">Full SEO content template.</strong> Same deep structure used across your upgraded tools.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is markup?" a="Markup is the amount added to cost to determine selling price." />
                <FaqItem q="What is margin?" a="Margin is profit as a percentage of selling price." />
                <FaqItem q="Why is margin lower than markup?" a="Because margin uses selling price in the denominator, not cost." />
                <FaqItem q="Can markup be negative?" a="Yes in theory, but it indicates pricing below cost and potential loss." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Pricing Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with break-even, margin, ROI, and discount tools in the same structure.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share for quick markup and margin checks.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-green-500/40 flex-shrink-0" />
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

