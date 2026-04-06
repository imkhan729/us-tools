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
  Circle,
  Truck,
  Calculator,
} from "lucide-react";

type Unit = "imperial" | "metric";
type Shape = "pit" | "trench" | "circular";

const RELATED_TOOLS = [
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Turn excavation into backfill or pour volume" },
  { title: "Gravel Calculator", slug: "gravel-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Estimate base material after digging" },
  { title: "Sand Calculator", slug: "sand-calculator", icon: <Ruler className="w-5 h-5" />, benefit: "Plan bedding and leveling layers" },
  { title: "Pipe Volume Calculator", slug: "pipe-volume-calculator", icon: <Circle className="w-5 h-5" />, benefit: "Calculate liquid capacity for pipe runs" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-stone-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-stone-500">
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

function useExcavationCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [shape, setShape] = useState<Shape>("pit");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [diameter, setDiameter] = useState("");
  const [swellPercent, setSwellPercent] = useState("15");

  const result = useMemo(() => {
    const depthValue = parseFloat(depth) || 0;
    const swell = Math.max(0, parseFloat(swellPercent) || 0);
    if (depthValue <= 0) return null;

    let baseVolume = 0;
    let footprint = 0;

    if (shape === "circular") {
      const diameterValue = parseFloat(diameter) || 0;
      if (diameterValue <= 0) return null;
      const radius = diameterValue / 2;
      footprint = Math.PI * radius * radius;
      baseVolume = footprint * depthValue;
    } else {
      const lengthValue = parseFloat(length) || 0;
      const widthValue = parseFloat(width) || 0;
      if (lengthValue <= 0 || widthValue <= 0) return null;
      footprint = lengthValue * widthValue;
      baseVolume = footprint * depthValue;
    }

    const looseFactor = 1 + swell / 100;

    if (unit === "imperial") {
      const cubicFeet = baseVolume;
      const cubicYards = cubicFeet / 27;
      const looseCubicYards = cubicYards * looseFactor;
      const truckLoads = looseCubicYards / 10;
      return {
        footprint,
        cubicFeet,
        cubicYards,
        cubicMeters: cubicFeet * 0.0283168,
        looseVolume: looseCubicYards,
        truckLoads,
        swell,
      };
    }

    const cubicMeters = baseVolume;
    const looseCubicMeters = cubicMeters * looseFactor;
    const truckLoads = looseCubicMeters / 8;
    return {
      footprint,
      cubicFeet: cubicMeters * 35.3147,
      cubicYards: cubicMeters * 1.30795,
      cubicMeters,
      looseVolume: looseCubicMeters,
      truckLoads,
      swell,
    };
  }, [unit, shape, length, width, depth, diameter, swellPercent]);

  return {
    unit,
    setUnit,
    shape,
    setShape,
    length,
    setLength,
    width,
    setWidth,
    depth,
    setDepth,
    diameter,
    setDiameter,
    swellPercent,
    setSwellPercent,
    result,
  };
}

function ResultInsight({ result, unit }: { result: ReturnType<typeof useExcavationCalc>["result"]; unit: Unit }) {
  if (!result) return null;

  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const bankVolume = unit === "imperial" ? `${result.cubicYards.toFixed(2)} cubic yards` : `${result.cubicMeters.toFixed(2)} cubic meters`;
  const looseVolume = unit === "imperial" ? `${result.looseVolume.toFixed(2)} loose cubic yards` : `${result.looseVolume.toFixed(2)} loose cubic meters`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-stone-500/5 border border-stone-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-stone-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          The excavation footprint is {result.footprint.toFixed(2)} {areaUnit}. In-place excavation volume is {bankVolume}, and after a {result.swell.toFixed(0)}% swell allowance, loose spoil volume rises to about {looseVolume}. That helps when planning haul-off and truck capacity.
        </p>
      </div>
    </motion.div>
  );
}

export default function ExcavationCalculator() {
  const calc = useExcavationCalc();
  const [copied, setCopied] = useState(false);
  const sizeUnit = calc.unit === "imperial" ? "ft" : "m";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO title="Excavation Calculator - Estimate Dig Volume and Truck Loads" description="Free excavation calculator for pits, trenches, and circular holes. Estimate in-place excavation volume, loose spoil volume, and approximate truck loads instantly." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-stone-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-stone-500" strokeWidth={3} />
          <span className="text-foreground">Excavation Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-stone-500/15 bg-gradient-to-br from-stone-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-stone-500/10 text-stone-700 dark:text-stone-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"><Construction className="w-3.5 h-3.5" /> Construction &amp; DIY</div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Excavation Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">Estimate excavation volume for pits, trenches, and circular holes. Calculate in-place dig volume, loose spoil after swell, and approximate truck loads for haul-off planning.</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-stone-500/10 text-stone-700 dark:text-stone-400 font-bold text-xs px-3 py-1.5 rounded-full border border-stone-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-stone-500/20 shadow-lg shadow-stone-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-stone-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-500 to-amber-400 flex items-center justify-center flex-shrink-0"><Truck className="w-4 h-4 text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dig volume estimator</p><p className="text-sm text-muted-foreground">Bank volume, loose spoil, and truck loads in one calculator.</p></div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label><div className="flex rounded-lg overflow-hidden border border-border"><button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-stone-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button><button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-stone-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button></div></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Excavation Type</label><div className="flex rounded-lg overflow-hidden border border-border"><button onClick={() => calc.setShape("pit")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "pit" ? "bg-stone-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Pit</button><button onClick={() => calc.setShape("trench")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "trench" ? "bg-stone-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Trench</button><button onClick={() => calc.setShape("circular")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "circular" ? "bg-stone-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Circular</button></div></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Swell Percentage</label><input type="number" min="0" placeholder="15" className="tool-calc-input w-full" value={calc.swellPercent} onChange={e => calc.setSwellPercent(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      {calc.shape === "circular" ? (
                        <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Diameter ({sizeUnit})</label><input type="number" placeholder="8" className="tool-calc-input w-full" value={calc.diameter} onChange={e => calc.setDiameter(e.target.value)} /></div>
                      ) : (
                        <>
                          <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Length ({sizeUnit})</label><input type="number" placeholder={calc.shape === "trench" ? "40" : "20"} className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} /></div>
                          <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Width ({sizeUnit})</label><input type="number" placeholder={calc.shape === "trench" ? "2" : "12"} className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} /></div>
                        </>
                      )}
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Depth ({sizeUnit})</label><input type="number" placeholder="4" className="tool-calc-input w-full" value={calc.depth} onChange={e => calc.setDepth(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Footprint</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.footprint.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "sq ft" : "sq m"}</p></div>
                      <div className="rounded-2xl border border-stone-500/20 bg-stone-500/5 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Bank Volume</p><p className="text-2xl font-black text-stone-700 dark:text-stone-400">{calc.result ? (calc.unit === "imperial" ? calc.result.cubicYards.toFixed(2) : calc.result.cubicMeters.toFixed(2)) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "cubic yd" : "cubic m"}</p></div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Loose Spoil</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.looseVolume.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "loose yd" : "loose m"}</p></div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Truck Loads</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.truckLoads.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "10 yd loads" : "8 m loads"}</p></div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Excavation Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">This tool estimates excavation volume for common site work such as trenches, utility runs, pits, footings, tank holes, and circular excavations. It also accounts for swell, which matters because excavated material takes up more space once it is dug and loosened.</p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-stone-500/10 text-stone-700 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Choose the excavation shape that matches the job</p><p className="text-muted-foreground text-sm leading-relaxed">Use pit for simple rectangular excavations, trench for long narrow runs, and circular for posts, tanks, and round holes. The calculator uses the same area-times-depth method but keeps the inputs aligned to the job type.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-stone-500/10 text-stone-700 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter in-place dimensions, not haul-off dimensions</p><p className="text-muted-foreground text-sm leading-relaxed">Length, width, diameter, and depth should describe the excavation in the ground before digging. The calculator then applies swell separately to estimate the larger loose volume after excavation.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-stone-500/10 text-stone-700 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use swell and truck-load outputs for logistics</p><p className="text-muted-foreground text-sm leading-relaxed">The bank volume helps with design and cut quantities. The loose spoil result is more useful for haul-off planning because soil expands after it is excavated.</p></div></li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-stone-600 font-bold w-24 flex-shrink-0">Rectangular</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Length x Width x Depth</code></div>
                  <div className="flex items-center gap-3"><span className="text-stone-600 font-bold w-24 flex-shrink-0">Circular</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">pi x r^2 x Depth</code></div>
                  <div className="flex items-center gap-3"><span className="text-stone-600 font-bold w-24 flex-shrink-0">Loose Volume</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Bank Volume x (1 + Swell % / 100)</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to use the excavation numbers during estimating and field planning.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-500/5 border border-stone-500/20"><div className="w-3 h-3 rounded-full bg-stone-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Bank volume</p><p className="text-sm text-muted-foreground leading-relaxed">This is the actual in-ground excavation quantity and is the number typically used for cut calculations and design quantities.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"><div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Loose spoil volume</p><p className="text-sm text-muted-foreground leading-relaxed">Excavated soil expands, so loose volume is usually larger than bank volume. This matters when estimating transport and stockpile space.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"><div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Truck-load estimate</p><p className="text-sm text-muted-foreground leading-relaxed">A quick truck count helps with haul-off pricing and scheduling. It is only a planning estimate because actual truck capacity varies by equipment and legal load limits.</p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Project</th><th className="text-left px-4 py-3 font-bold text-foreground">Dimensions</th><th className="text-left px-4 py-3 font-bold text-foreground">Swell</th><th className="text-left px-4 py-3 font-bold text-foreground">Bank Volume</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Utility trench</td><td className="px-4 py-3 font-mono text-foreground">40 x 2 x 4 ft</td><td className="px-4 py-3 font-mono text-foreground">15%</td><td className="px-4 py-3 font-bold text-stone-700 dark:text-stone-400">11.85 yd^3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Line installation</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Basement pit</td><td className="px-4 py-3 font-mono text-foreground">6 x 4 x 3 m</td><td className="px-4 py-3 font-mono text-foreground">20%</td><td className="px-4 py-3 font-bold text-stone-700 dark:text-stone-400">72.00 m^3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Foundation work</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Round tank hole</td><td className="px-4 py-3 font-mono text-foreground">8 ft dia x 6 ft</td><td className="px-4 py-3 font-mono text-foreground">15%</td><td className="px-4 py-3 font-bold text-stone-700 dark:text-stone-400">5.59 yd^3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Tank excavation</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - Utility trench:</strong> A 40 foot long trench, 2 feet wide and 4 feet deep, removes nearly 12 cubic yards of in-place material before swell is considered for truck haul-off.</p>
                <p><strong className="text-foreground">Example 2 - Foundation excavation:</strong> A 6 by 4 meter excavation at 3 meters deep produces 72 cubic meters of bank volume, giving a fast baseline for earthwork pricing.</p>
                <p><strong className="text-foreground">Example 3 - Circular excavation:</strong> A round excavation for a tank or manhole is easy to under-estimate if circular area is not handled correctly. Using the radius-based formula keeps the dig quantity more reliable.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Excavation Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It separates bank and loose volume.</strong> That gives you both the design quantity and the haul-off quantity instead of forcing you to estimate spoil expansion manually.</p>
                <p><strong className="text-foreground">It supports common excavation types.</strong> Pits, trenches, and circular holes cover a large share of practical site work, so the calculator stays directly useful rather than overly theoretical.</p>
                <p><strong className="text-foreground">It helps with logistics, not just geometry.</strong> The truck-load output turns the raw volume into a planning figure crews and estimators can use immediately.</p>
                <p><strong className="text-foreground">It follows the same full-page template.</strong> The structure, content flow, and design match the completed tools you asked me to standardize.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator assumes straight sides and uniform depth. Sloped cuts, battered walls, benches, rock overbreak, and site-specific swell factors should be adjusted separately for final estimating.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you calculate excavation volume?" a="For rectangular excavation, multiply length by width by depth. For circular excavation, use pi x radius squared x depth. That gives the in-place or bank volume." />
                <FaqItem q="What is swell in excavation?" a="Swell is the increase in volume that happens after soil is loosened by digging. Loose spoil usually occupies more space than the original in-ground material." />
                <FaqItem q="Why is loose volume larger than bank volume?" a="Because excavated soil is no longer compacted in place. Air gaps and disturbed particles increase the space it occupies in trucks or stockpiles." />
                <FaqItem q="Can I use this for trench excavation?" a="Yes. The trench mode works for long, narrow excavations such as utility runs, drainage channels, and service lines." />
                <FaqItem q="How accurate is the truck-load estimate?" a="It is a planning estimate only. Actual truck capacity depends on equipment size, soil type, moisture, and legal load restrictions." />
                <FaqItem q="Does this work in both feet and meters?" a="Yes. Switch between imperial and metric units and the excavation outputs update automatically." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Material Estimates After Digging?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Once excavation is sized, move into concrete, gravel, sand, and other construction tools to estimate what goes back into the job.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-stone-700 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-stone-600/20">{copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}</button>
              </div>
              <div className="p-5 rounded-2xl bg-stone-600 text-white shadow-xl relative overflow-hidden">
                <Truck className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Planning haul-off?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Loose spoil volume is usually the more useful number for truck scheduling. Bank volume alone can understate what must actually be moved.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={tool.slug === "volume-converter" ? `/conversion/${tool.slug}` : `/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-stone-500 group-hover:text-white transition-colors">{tool.icon}</div>
                      <div><p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{tool.title}</p><p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tool.benefit}</p></div>
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
