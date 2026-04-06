import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Zap,
  Smartphone,
  Shield,
  Lightbulb,
  Copy,
  Check,
  BadgeCheck,
  Lock,
  Construction,
  Ruler,
  Calculator,
  Home,
  Boxes,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type Unit = "imperial" | "metric";

const RELATED_TOOLS = [
  { title: "Gravel Calculator", slug: "gravel-calculator", icon: <Boxes className="w-5 h-5" />, color: 38, benefit: "Base material estimates" },
  { title: "Room Area Calculator", slug: "room-area-calculator", icon: <Home className="w-5 h-5" />, color: 230, benefit: "Measure rectangular spaces" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, color: 28, benefit: "Footing and slab volume" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert ft, m, and more" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-lime-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-lime-500">
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

function useFenceCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [gates, setGates] = useState("1");
  const [gateWidth, setGateWidth] = useState("");
  const [postSpacing, setPostSpacing] = useState("");

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const gateCount = parseFloat(gates) || 0;
    const gateOpening = parseFloat(gateWidth) || 0;
    const spacing = parseFloat(postSpacing) || 0;

    if (l <= 0 || w <= 0 || spacing <= 0) return null;

    const perimeter = (l + w) * 2;
    const totalGateWidth = Math.max(0, gateCount * gateOpening);
    const fenceRun = Math.max(0, perimeter - totalGateWidth);
    const linePosts = Math.max(0, Math.ceil(fenceRun / spacing) - 1);
    const cornerPosts = 4;
    const gatePosts = gateCount > 0 ? gateCount * 2 : 0;
    const totalPosts = cornerPosts + gatePosts + Math.max(0, linePosts);

    return {
      perimeter,
      fenceRun,
      totalGateWidth,
      linePosts,
      cornerPosts,
      gatePosts,
      totalPosts,
    };
  }, [length, width, gates, gateWidth, postSpacing]);

  return {
    unit,
    setUnit,
    length,
    setLength,
    width,
    setWidth,
    gates,
    setGates,
    gateWidth,
    setGateWidth,
    postSpacing,
    setPostSpacing,
    result,
  };
}

function ResultInsight({ result, unit }: { result: ReturnType<typeof useFenceCalc>["result"]; unit: Unit }) {
  if (!result) return null;

  const linearUnit = unit === "imperial" ? "ft" : "m";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-lime-500/5 border border-lime-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-lime-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your lot perimeter is {result.perimeter.toFixed(2)} {linearUnit}. After subtracting gate openings, you need about {result.fenceRun.toFixed(2)} {linearUnit} of fence line and an estimated {result.totalPosts} posts based on the spacing you entered.
        </p>
      </div>
    </motion.div>
  );
}

export default function FenceLengthCalculator() {
  const calc = useFenceCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unitLabel = calc.unit === "imperial" ? "ft" : "m";
  const defaultGate = calc.unit === "imperial" ? "4" : "1.2";
  const defaultSpacing = calc.unit === "imperial" ? "8" : "2.4";

  return (
    <Layout>
      <SEO
        title="Fence Length Calculator - Perimeter, Panels, and Posts"
        description="Free fence length calculator. Estimate total fence run, gate openings, and post count from lot dimensions and post spacing for residential fence planning."
        canonical="https://usonlinetools.com/construction/fence-length-calculator"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Fence Length Calculator",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          description: "Calculate fence perimeter, fence run, gate opening deductions, and estimated post count.",
          url: "https://usonlinetools.com/construction/fence-length-calculator",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <span className="text-foreground">Fence Length Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Fence Length Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate total fence length, subtract gate openings, and get a practical post count for rectangular yard layouts. This is built for real planning, not just a bare perimeter formula.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-emerald-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Ruler className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Perimeter and Post Planner</p>
                      <p className="text-sm text-muted-foreground">Built for rectangular lots, common gate openings, and standard post spacing.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 100 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-lime-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-lime-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">What it includes</p>
                        <p className="text-sm text-muted-foreground">Perimeter, gate deductions, line posts, corner posts, and gate posts.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Lot Length ({unitLabel})</label>
                        <input type="number" placeholder={calc.unit === "imperial" ? "80" : "24"} className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Lot Width ({unitLabel})</label>
                        <input type="number" placeholder={calc.unit === "imperial" ? "50" : "15"} className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Number of Gates</label>
                        <input type="number" placeholder="1" className="tool-calc-input w-full" value={calc.gates} onChange={e => calc.setGates(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Gate Width ({unitLabel})</label>
                        <input type="number" placeholder={defaultGate} className="tool-calc-input w-full" value={calc.gateWidth} onChange={e => calc.setGateWidth(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Post Spacing ({unitLabel})</label>
                        <input type="number" placeholder={defaultSpacing} className="tool-calc-input w-full" value={calc.postSpacing} onChange={e => calc.setPostSpacing(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Perimeter</p>
                        <p className="text-2xl font-black text-lime-600 dark:text-lime-400">{calc.result ? calc.result.perimeter.toFixed(2) : "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fence Run</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.fenceRun.toFixed(2) : "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Gate Width</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.totalGateWidth.toFixed(2) : "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Posts</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.totalPosts : "--"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Fence Length Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Fence planning usually starts with perimeter, but most projects also need gate deductions and a rough post count. This page combines those common planning steps so you can move from lot size to material planning faster.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the rectangular lot dimensions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the overall length and width of the area you want to fence. This calculator is designed for standard rectangular layouts, which covers many residential backyards and side yards.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Subtract gates from the total fence run</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Gates take up space that does not use regular fence panels. Adding the gate count and gate width gives you a cleaner estimate for actual linear fence material.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use post spacing for a planning estimate</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Post count depends on panel system, local code, terrain, and corner details, but spacing gives you a practical estimate for budgeting and early material planning.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Formula</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lime-500 font-bold w-24 flex-shrink-0">Perimeter</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">2 × (Length + Width)</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lime-500 font-bold w-24 flex-shrink-0">Fence Run</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Perimeter - Total Gate Width</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lime-500 font-bold w-24 flex-shrink-0">Post Estimate</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Corner Posts + Gate Posts + Line Posts</code>
                  </div>
                </div>
              </div>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding the Fence Estimate</h2>
              <p className="text-muted-foreground text-sm mb-6">Perimeter is the start, but usable fence run and post count are what usually drive budgeting.</p>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Perimeter tells you enclosure size</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This is the total distance around the lot. It is useful for early planning, comparing layout options, and understanding the maximum boundary length before you subtract openings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-lime-500/5 border border-lime-500/20">
                  <div className="w-3 h-3 rounded-full bg-lime-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Fence run is closer to your material order</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Once gate widths are removed, the remaining fence run is a better estimate for panels, rails, boards, or rolls of fencing material than the raw perimeter alone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Post count is still an estimate</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Slopes, terrain changes, code requirements, and chosen fence system can all change the final count. This result is a planning number, not a substitute for a finished site layout.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Lot</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Gate Setup</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Spacing</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">80 ft × 50 ft</td>
                      <td className="px-4 py-3 text-muted-foreground">1 gate at 4 ft</td>
                      <td className="px-4 py-3 font-mono text-foreground">8 ft</td>
                      <td className="px-4 py-3 font-bold text-lime-600 dark:text-lime-400">256 ft run</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">120 ft × 80 ft</td>
                      <td className="px-4 py-3 text-muted-foreground">2 gates at 4 ft</td>
                      <td className="px-4 py-3 font-mono text-foreground">8 ft</td>
                      <td className="px-4 py-3 font-bold text-lime-600 dark:text-lime-400">392 ft run</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">24 m × 15 m</td>
                      <td className="px-4 py-3 text-muted-foreground">1 gate at 1.2 m</td>
                      <td className="px-4 py-3 font-mono text-foreground">2.4 m</td>
                      <td className="px-4 py-3 font-bold text-lime-600 dark:text-lime-400">76.8 m run</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 - backyard privacy fence:</strong> A homeowner usually wants the total fence line after subtracting a single walk gate. That gives a better panel estimate than using the raw perimeter.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 - side and rear enclosure:</strong> If you are fencing a simple rectangular yard, a perimeter-plus-gate calculation is often enough for an initial quote request.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 - early budget planning:</strong> Post count is useful when comparing wood, vinyl, chain-link, or composite systems because installation cost often tracks with both fence length and number of posts.
                </p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Fence Length Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It focuses on the numbers people actually need first.</strong> Fence planning usually starts with linear length and gate openings, not a full CAD drawing. This tool gives those planning numbers quickly and clearly.
                </p>
                <p>
                  <strong className="text-foreground">The content stays practical.</strong> It explains how to move from lot size to fence run and why post count is only an estimate, which is more useful than padding the page with generic filler.
                </p>
                <p>
                  <strong className="text-foreground">It works well on mobile during site checks.</strong> If you are measuring a yard or comparing fence layouts on-site, the interface stays simple enough to use one-handed without extra clutter.
                </p>
                <p>
                  <strong className="text-foreground">Your measurements stay local.</strong> The calculations run in the browser, so site dimensions and planning numbers are not sent anywhere by this page.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This calculator assumes a standard rectangular layout. Irregular lots, shared property adjustments, and local code setbacks should be checked separately before purchase or installation.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I calculate fence length around a yard?" a="For a rectangular yard, add the length and width, then multiply by two. That gives the perimeter. Subtract any gate openings to estimate actual fence run." />
                <FaqItem q="Why subtract gate width from the perimeter?" a="A gate opening takes space that is not filled with standard fence panels or boards, so removing that width gives a better estimate for actual fence material." />
                <FaqItem q="How many posts do I need for a fence?" a="That depends on spacing, corners, gates, and the fence system you choose. This calculator gives a practical estimate based on spacing, but the final count can change with layout details and code requirements." />
                <FaqItem q="What post spacing should I use?" a="Use the spacing recommended by your fence system, installer, or local code. Many residential layouts use a regular spacing pattern, but the exact number varies by material and structural needs." />
                <FaqItem q="Can I use this for chain-link, wood, and vinyl fencing?" a="Yes. The perimeter and fence-run math is still useful across systems. The final panel count and hardware list will depend on the specific product you install." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Yard and Material Calculators</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Keep planning with gravel, concrete, area, and other construction tools designed for practical job estimates.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-lime-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-lime-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with homeowners, estimators, and contractors.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    ["Calculator", "#calculator"],
                    ["How to Use", "#how-to-use"],
                    ["Result Interpretation", "#result-interpretation"],
                    ["Quick Examples", "#quick-examples"],
                    ["Why Choose This", "#why-choose-this"],
                    ["FAQ", "#faq"],
                  ].map(([label, href]) => (
                    <a key={label} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-lime-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-lime-500/40 flex-shrink-0" />
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
