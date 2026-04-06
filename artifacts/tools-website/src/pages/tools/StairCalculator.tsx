import { useMemo, useState, type CSSProperties } from "react";
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
  Hammer,
} from "lucide-react";

type Unit = "imperial" | "metric";

const RELATED_TOOLS = [
  { title: "Lumber Calculator", slug: "lumber-calculator", icon: <Hammer className="w-5 h-5" />, benefit: "Estimate framing and stair stringer lumber" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Plan poured steps, pads, and landings" },
  { title: "Fence Length Calculator", slug: "fence-length-calculator", icon: <Ruler className="w-5 h-5" />, benefit: "Useful for railing and perimeter planning" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Estimate finish materials for stair walls and trim" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
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

function formatLength(value: number, unit: Unit) {
  return unit === "imperial" ? `${value.toFixed(2)} in` : `${value.toFixed(1)} cm`;
}

function formatSecondaryLength(value: number, unit: Unit) {
  return unit === "imperial" ? `${(value / 12).toFixed(2)} ft` : `${(value / 100).toFixed(2)} m`;
}

function useStairCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [totalRise, setTotalRise] = useState("108");
  const [targetRiser, setTargetRiser] = useState("7");
  const [treadDepth, setTreadDepth] = useState("10.5");
  const [stairWidth, setStairWidth] = useState("36");

  const result = useMemo(() => {
    const rise = parseFloat(totalRise) || 0;
    const riserGoal = parseFloat(targetRiser) || 0;
    const tread = parseFloat(treadDepth) || 0;
    const width = parseFloat(stairWidth) || 0;

    if (rise <= 0 || riserGoal <= 0 || tread <= 0 || width <= 0) return null;

    const risers = Math.max(1, Math.ceil(rise / riserGoal));
    const exactRiser = rise / risers;
    const treads = Math.max(risers - 1, 1);
    const totalRun = treads * tread;
    const stringerLength = Math.hypot(rise, totalRun);
    const angle = (Math.atan2(rise, totalRun) * 180) / Math.PI;
    const comfortRule = exactRiser * 2 + tread;
    const walkingArea = (totalRun * width) / (unit === "imperial" ? 144 : 10000);

    const guidance =
      unit === "imperial"
        ? comfortRule >= 24 && comfortRule <= 25
          ? "Balanced proportions for many residential layouts."
          : comfortRule < 24
            ? "The stair may feel shallow. Consider a taller riser or shorter tread."
            : "The stair may feel steep. Consider a shorter riser or deeper tread."
        : comfortRule >= 62 && comfortRule <= 64
          ? "Balanced proportions for many residential layouts."
          : comfortRule < 62
            ? "The stair may feel shallow. Consider a taller riser or shorter tread."
            : "The stair may feel steep. Consider a shorter riser or deeper tread.";

    return { risers, exactRiser, treads, tread, totalRun, stringerLength, angle, comfortRule, walkingArea, guidance };
  }, [unit, totalRise, targetRiser, treadDepth, stairWidth]);

  return { unit, setUnit, totalRise, setTotalRise, targetRiser, setTargetRiser, treadDepth, setTreadDepth, stairWidth, setStairWidth, result };
}

function ResultInsight({ result, unit }: { result: ReturnType<typeof useStairCalc>["result"]; unit: Unit }) {
  if (!result) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          This layout uses {result.risers} risers at an exact rise of {formatLength(result.exactRiser, unit)} each and {result.treads} treads at {formatLength(result.tread, unit)}. Total horizontal run is {formatLength(result.totalRun, unit)} ({formatSecondaryLength(result.totalRun, unit)}), stringer length is {formatLength(result.stringerLength, unit)} ({formatSecondaryLength(result.stringerLength, unit)}), and the stair angle is {result.angle.toFixed(1)} degrees. {result.guidance}
        </p>
      </div>
    </motion.div>
  );
}

export default function StairCalculator() {
  const calc = useStairCalc();
  const [copied, setCopied] = useState(false);
  const lengthUnit = calc.unit === "imperial" ? "in" : "cm";
  const areaUnit = calc.unit === "imperial" ? "sq ft" : "sq m";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO title="Stair Calculator - Rise, Run, Treads, and Stringer Length" description="Free stair calculator for rise, run, tread count, stair angle, and stringer length. Plan straight stairs in inches or centimeters with instant results." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Stair Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Stair Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Plan straight stairs with a clean rise, tread count, total run, stringer length, and stair angle. Use it for interior stairs, deck steps, porch entries, and layout checks before cutting material.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Ruler className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Straight stair planner</p>
                      <p className="text-sm text-muted-foreground">Rise count, run, stringer, angle, and comfort check in one layout tool.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 35 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{calc.unit === "imperial" ? "Use inches for rise, tread depth, and width." : "Use centimeters for rise, tread depth, and width."}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Straight Stair Width ({lengthUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "36" : "90"} className="tool-calc-input w-full" value={calc.stairWidth} onChange={(e) => calc.setStairWidth(e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-2">Used to estimate walking surface area for material planning.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Total Rise ({lengthUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "108" : "280"} className="tool-calc-input w-full" value={calc.totalRise} onChange={(e) => calc.setTotalRise(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Target Riser Height ({lengthUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "7" : "17.5"} className="tool-calc-input w-full" value={calc.targetRiser} onChange={(e) => calc.setTargetRiser(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Tread Depth ({lengthUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "10.5" : "28"} className="tool-calc-input w-full" value={calc.treadDepth} onChange={(e) => calc.setTreadDepth(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Risers</p>
                        <p className="text-2xl font-black text-amber-700 dark:text-amber-400">{calc.result ? calc.result.risers : "0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">count</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Exact Riser</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.exactRiser.toFixed(calc.unit === "imperial" ? 2 : 1) : "0.0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{lengthUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Treads</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.treads : "0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">count</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Run</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.totalRun.toFixed(1) : "0.0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{lengthUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Stringer</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.stringerLength.toFixed(1) : "0.0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{lengthUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Angle</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.angle.toFixed(1) : "0.0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">degrees</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Comfort Rule</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.comfortRule.toFixed(calc.unit === "imperial" ? 2 : 1) : "0.0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "2R + T in inches" : "2R + T in centimeters"}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Walking Surface</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.walkingArea.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Stair Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This stair calculator is built for straight stair planning. Enter the vertical rise you need to cover, the riser height you want to aim for, and your planned tread depth. The tool converts those inputs into a practical stair layout with riser count, exact rise per step, total run, and stringer length.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure the total finished rise</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use the vertical distance from one finished floor or landing to the next. For deck stairs, measure from the landing surface to the finished grade or slab where the bottom step will land.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose a target riser and tread depth</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The calculator rounds the riser count up so the exact riser height stays at or below your target. Tread depth controls how much horizontal room the stair will need.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the buildable layout before cutting material</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use the riser count, total run, angle, and stringer length together. That helps you confirm whether the stair fits the available space and whether your proportions feel balanced.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-amber-700 dark:text-amber-400 font-bold w-28 flex-shrink-0">Riser Count</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">ceil(Total Rise / Target Riser)</code></div>
                  <div className="flex items-center gap-3"><span className="text-amber-700 dark:text-amber-400 font-bold w-28 flex-shrink-0">Exact Riser</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Total Rise / Risers</code></div>
                  <div className="flex items-center gap-3"><span className="text-amber-700 dark:text-amber-400 font-bold w-28 flex-shrink-0">Total Run</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Treads x Tread Depth</code></div>
                  <div className="flex items-center gap-3"><span className="text-amber-700 dark:text-amber-400 font-bold w-28 flex-shrink-0">Stringer</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">sqrt((Total Rise)^2 + (Total Run)^2)</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read the stair outputs when checking layout, comfort, and site fit.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Risers and exact rise</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The calculator gives you a whole-number riser count and then recalculates the exact rise for each step. That exact rise matters more than the original target because it is the number you would actually build from.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Treads and total run</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Treads control the footprint of the stair. A deeper tread makes the stair feel less steep, but it also demands more floor space or deck projection.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Stringer length and angle</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Stringer length is useful for estimating framing stock and rough cuts. Stair angle gives a quick sense of whether the layout is relaxed, typical, or steep.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Comfort rule</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The 2R + T rule is a practical proportion check. It is not a substitute for code review, but it does help catch layouts that may feel too steep or too shallow before you start building.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Project</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Inputs</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Layout</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Run</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Why it matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Deck steps</td>
                      <td className="px-4 py-3 font-mono text-foreground">36 rise, 7 riser, 10 tread</td>
                      <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400">6 risers / 5 treads</td>
                      <td className="px-4 py-3 font-mono text-foreground">50 in</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Quick backyard stair fit check</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Interior straight stair</td>
                      <td className="px-4 py-3 font-mono text-foreground">108 rise, 7.5 riser, 10.5 tread</td>
                      <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400">15 risers / 14 treads</td>
                      <td className="px-4 py-3 font-mono text-foreground">147 in</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Checks whether the stair fits the floor plan</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Outdoor metric stair</td>
                      <td className="px-4 py-3 font-mono text-foreground">280 rise, 17.5 riser, 28 tread</td>
                      <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400">16 risers / 15 treads</td>
                      <td className="px-4 py-3 font-mono text-foreground">420 cm</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Useful for porch and garden entries</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - deck stair:</strong> With 36 inches of rise and a 7 inch target riser, the tool rounds up to 6 risers. That keeps the actual rise at 6 inches, which is easier to build consistently than forcing a fractional count.</p>
                <p><strong className="text-foreground">Example 2 - interior stair:</strong> A 108 inch floor-to-floor rise with 10.5 inch treads creates a long run of 147 inches. This is the type of number that quickly tells you whether the stair belongs in the available plan space.</p>
                <p><strong className="text-foreground">Example 3 - metric outdoor layout:</strong> A 280 centimeter rise with 16 risers gives an exact rise of 17.5 centimeters per step. That is a clean, easy-to-read layout for exterior stairs and landings.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Stair Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It turns rough targets into a buildable stair layout.</strong> Instead of leaving you with a fractional riser count, it rounds to a practical count and recalculates the exact rise you would actually use.</p>
                <p><strong className="text-foreground">It shows geometry and usability together.</strong> You get run, stringer length, angle, and a simple comfort check in one place, which is more useful than only seeing rise and tread count.</p>
                <p><strong className="text-foreground">It works for common stair planning tasks.</strong> Interior stairs, deck stairs, porch entries, and utility stairs all benefit from the same rise-run workflow.</p>
                <p><strong className="text-foreground">It follows the same full-page template.</strong> The content flow, design system, and section structure match the percentage-calculator style you asked me to standardize across tools.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator is for planning straight stairs. Final construction should still be checked against local building code, nosing details, landing rules, headroom requirements, and framing tolerances.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you calculate stair rise and run?" a="Start with the total vertical rise. Divide that by your target riser height to get a riser count, round up to a whole number, then divide the total rise by that count to get the exact riser height. Multiply the number of treads by tread depth to get total run." />
                <FaqItem q="Why are there usually fewer treads than risers?" a="In a straight stair between two finished levels, the upper floor or landing acts as the final stepping surface. That is why the tread count is commonly one less than the riser count." />
                <FaqItem q="What does the stringer length mean?" a="Stringer length is the diagonal distance from the stair base to the top landing. It helps when estimating framing material and checking whether your layout fits available stock lengths." />
                <FaqItem q="What is the 2R + T rule?" a="It is a common stair proportion rule where two risers plus one tread are checked together. It is used as a comfort guideline to avoid stairs that feel too steep or too shallow." />
                <FaqItem q="Can I use this stair calculator for deck stairs?" a="Yes. It works well for deck and porch stairs as long as you measure the finished rise correctly and then verify local code requirements for outdoor construction." />
                <FaqItem q="Does this replace building code review?" a="No. It is a planning calculator, not a code authority. Always confirm dimensions, guard requirements, headroom, landing size, and local stair rules before construction." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Material Estimates After the Layout?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Once the stair geometry is set, move into concrete, lumber, and other construction tools to estimate framing, landings, and finish materials.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-amber-700 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-amber-600/20">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-amber-600 text-white shadow-xl relative overflow-hidden">
                <Hammer className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Laying out stringers?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Use the exact riser and total run from this calculator, not just the target values. Consistent geometry matters more than rough round numbers once cutting begins.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">{tool.icon}</div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tool.benefit}</p>
                      </div>
                    </Link>
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
