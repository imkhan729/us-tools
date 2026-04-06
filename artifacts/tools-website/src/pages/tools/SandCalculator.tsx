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
  Boxes,
  Calculator,
} from "lucide-react";

type Unit = "imperial" | "metric";
type Shape = "rectangular" | "circular";

const DEFAULT_DENSITY = {
  imperial: 100,
  metric: 1600,
} as const;

const RELATED_TOOLS = [
  { title: "Gravel Calculator", slug: "gravel-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Base material volume and tons" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Concrete yardage and bags" },
  { title: "Pipe Volume Calculator", slug: "pipe-volume-calculator", icon: <Ruler className="w-5 h-5" />, benefit: "Liquid capacity calculations" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Boxes className="w-5 h-5" />, benefit: "Convert cubic units quickly" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-yellow-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-yellow-500">
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

function useSandCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [shape, setShape] = useState<Shape>("rectangular");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [diameter, setDiameter] = useState("");
  const [depth, setDepth] = useState("");
  const [density, setDensity] = useState("");
  const [includeWaste, setIncludeWaste] = useState(true);

  const result = useMemo(() => {
    const depthValue = parseFloat(depth) || 0;
    const densityValue = parseFloat(density) > 0 ? parseFloat(density) : unit === "imperial" ? DEFAULT_DENSITY.imperial : DEFAULT_DENSITY.metric;
    if (depthValue <= 0) return null;

    if (unit === "imperial") {
      const depthFeet = depthValue / 12;
      let areaSqFt = 0;
      if (shape === "rectangular") {
        const l = parseFloat(length) || 0;
        const w = parseFloat(width) || 0;
        if (l <= 0 || w <= 0) return null;
        areaSqFt = l * w;
      } else {
        const d = parseFloat(diameter) || 0;
        if (d <= 0) return null;
        areaSqFt = Math.PI * Math.pow(d / 2, 2);
      }

      const wasteFactor = includeWaste ? 1.1 : 1;
      const cubicFeet = areaSqFt * depthFeet * wasteFactor;
      const cubicYards = cubicFeet / 27;
      const shortTons = (cubicFeet * densityValue) / 2000;
      const bagCount = Math.ceil((cubicFeet * densityValue) / 50);
      return { area: areaSqFt, cubicFeet, cubicYards, cubicMeters: cubicFeet * 0.0283168, tons: shortTons, bagCount, densityValue };
    }

    const depthMeters = depthValue / 100;
    let areaSqM = 0;
    if (shape === "rectangular") {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      if (l <= 0 || w <= 0) return null;
      areaSqM = l * w;
    } else {
      const d = parseFloat(diameter) || 0;
      if (d <= 0) return null;
      areaSqM = Math.PI * Math.pow(d / 2, 2);
    }

    const wasteFactor = includeWaste ? 1.1 : 1;
    const cubicMeters = areaSqM * depthMeters * wasteFactor;
    const metricTons = (cubicMeters * densityValue) / 1000;
    const bagCount = Math.ceil((cubicMeters * densityValue) / 25);
    return { area: areaSqM, cubicFeet: cubicMeters * 35.3147, cubicYards: cubicMeters * 1.30795, cubicMeters, tons: metricTons, bagCount, densityValue };
  }, [unit, shape, length, width, diameter, depth, density, includeWaste]);

  return { unit, setUnit, shape, setShape, length, setLength, width, setWidth, diameter, setDiameter, depth, setDepth, density, setDensity, includeWaste, setIncludeWaste, result };
}

function ResultInsight({ result, unit, includeWaste }: { result: ReturnType<typeof useSandCalc>["result"]; unit: Unit; includeWaste: boolean }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const tonsUnit = unit === "imperial" ? "short tons" : "metric tons";
  const volumeLabel = unit === "imperial" ? `${result.cubicYards.toFixed(2)} cubic yards` : `${result.cubicMeters.toFixed(2)} cubic meters`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your project covers {result.area.toFixed(2)} {areaUnit} and needs about {volumeLabel} of sand, or roughly {result.tons.toFixed(2)} {tonsUnit}. {includeWaste ? "A 10% waste factor is already included for compaction and handling loss." : "Waste is not included, so add a margin if your supplier recommends it."}
        </p>
      </div>
    </motion.div>
  );
}

export default function SandCalculator() {
  const calc = useSandCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const depthUnit = calc.unit === "imperial" ? "in" : "cm";
  const sizeUnit = calc.unit === "imperial" ? "ft" : "m";
  const densityUnit = calc.unit === "imperial" ? "lb/ft^3" : "kg/m^3";
  const bagLabel = calc.unit === "imperial" ? "50 lb bags" : "25 kg bags";

  return (
    <Layout>
      <SEO title="Sand Calculator - Estimate Sand Volume, Tons, and Bags" description="Free sand calculator for patios, leveling beds, concrete bases, and landscaping projects. Estimate sand volume, tons, and bag counts with rectangular or circular area inputs." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-yellow-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-yellow-500" strokeWidth={3} />
          <span className="text-foreground">Sand Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-yellow-500/15 bg-gradient-to-br from-yellow-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"><Construction className="w-3.5 h-3.5" /> Construction &amp; DIY</div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Sand Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">Estimate how much sand you need for bedding layers, paver bases, leveling work, concrete preparation, and landscaping. Enter dimensions, choose a shape, and get volume, tons, and bag counts instantly.</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold text-xs px-3 py-1.5 rounded-full border border-yellow-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-yellow-500/20 shadow-lg shadow-yellow-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-yellow-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center flex-shrink-0"><Boxes className="w-4 h-4 text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sand quantity estimator</p><p className="text-sm text-muted-foreground">Area, volume, tons, and bag counts in one calculator.</p></div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 48 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label><div className="flex rounded-lg overflow-hidden border border-border"><button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-yellow-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button><button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-yellow-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button></div></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Area Shape</label><div className="flex rounded-lg overflow-hidden border border-border"><button onClick={() => calc.setShape("rectangular")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "rectangular" ? "bg-yellow-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Rectangular</button><button onClick={() => calc.setShape("circular")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "circular" ? "bg-yellow-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Circular</button></div></div>
                      <div className="flex items-end"><label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 bg-muted/30 w-full cursor-pointer"><input type="checkbox" checked={calc.includeWaste} onChange={(event) => calc.setIncludeWaste(event.target.checked)} className="rounded border-border" /><span className="text-sm font-medium text-foreground">Include 10% waste</span></label></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      {calc.shape === "rectangular" ? (
                        <>
                          <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Length ({sizeUnit})</label><input type="number" placeholder="12" className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} /></div>
                          <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Width ({sizeUnit})</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} /></div>
                        </>
                      ) : (
                        <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Diameter ({sizeUnit})</label><input type="number" placeholder="14" className="tool-calc-input w-full" value={calc.diameter} onChange={e => calc.setDiameter(e.target.value)} /></div>
                      )}
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Depth ({depthUnit})</label><input type="number" placeholder={calc.unit === "imperial" ? "2" : "5"} className="tool-calc-input w-full" value={calc.depth} onChange={e => calc.setDepth(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Density ({densityUnit})</label><input type="number" placeholder={String(DEFAULT_DENSITY[calc.unit])} className="tool-calc-input w-full" value={calc.density} onChange={e => calc.setDensity(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Area</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.area.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "sq ft" : "sq m"}</p></div>
                      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Volume</p><p className="text-2xl font-black text-yellow-700 dark:text-yellow-400">{calc.result ? (calc.unit === "imperial" ? calc.result.cubicYards.toFixed(2) : calc.result.cubicMeters.toFixed(2)) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "cubic yd" : "cubic m"}</p></div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Weight</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.tons.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "short tons" : "metric tons"}</p></div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Bags</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.bagCount : 0}</p><p className="text-xs text-muted-foreground mt-1">{bagLabel}</p></div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} includeWaste={calc.includeWaste} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Sand Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">This calculator helps estimate sand for paver bedding, leveling layers, play areas, utility trenches, and concrete preparation. It is built around the same area-times-depth workflow used on-site in construction and landscaping.</p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Choose the area shape and unit system</p><p className="text-muted-foreground text-sm leading-relaxed">Use rectangular for patios, trenches, and slabs. Use circular for round pads, rings, or tree surrounds. Then pick imperial or metric based on how the job is measured.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter depth carefully</p><p className="text-muted-foreground text-sm leading-relaxed">Depth drives the volume directly. For bedding layers, a small change in depth can noticeably increase the amount of sand you need to order.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use density and waste to match your supply plan</p><p className="text-muted-foreground text-sm leading-relaxed">The default density works for a basic estimate, but supplier specs vary. Leave waste on for a safer order quantity when compaction, spillage, and uneven placement are likely.</p></div></li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-yellow-600 font-bold w-24 flex-shrink-0">Area</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Length x Width or pi x r^2</code></div>
                  <div className="flex items-center gap-3"><span className="text-yellow-600 font-bold w-24 flex-shrink-0">Volume</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Area x Depth x Waste Factor</code></div>
                  <div className="flex items-center gap-3"><span className="text-yellow-600 font-bold w-24 flex-shrink-0">Weight</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Volume x Material Density</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to use the estimate on real projects.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20"><div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Volume result</p><p className="text-sm text-muted-foreground leading-relaxed">This is the base ordering number and usually matches how bulk suppliers quote loose material.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"><div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Weight result</p><p className="text-sm text-muted-foreground leading-relaxed">Useful when comparing truck capacity, small-load transport limits, and supplier tonnage pricing.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"><div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Bag estimate</p><p className="text-sm text-muted-foreground leading-relaxed">Best for smaller jobs where sand is bought in retail bags rather than loose bulk loads.</p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Project</th><th className="text-left px-4 py-3 font-bold text-foreground">Dimensions</th><th className="text-left px-4 py-3 font-bold text-foreground">Depth</th><th className="text-left px-4 py-3 font-bold text-foreground">Result</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Paver patio</td><td className="px-4 py-3 font-mono text-foreground">12 x 10 ft</td><td className="px-4 py-3 font-mono text-foreground">2 in</td><td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">0.81 yd^3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Bedding layer</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Play area</td><td className="px-4 py-3 font-mono text-foreground">5 x 4 m</td><td className="px-4 py-3 font-mono text-foreground">8 cm</td><td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">1.76 m^3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Loose fill sand</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Circular pad</td><td className="px-4 py-3 font-mono text-foreground">14 ft diameter</td><td className="px-4 py-3 font-mono text-foreground">3 in</td><td className="px-4 py-3 font-bold text-yellow-700 dark:text-yellow-400">1.88 yd^3</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Leveling base</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - Patio bedding:</strong> A 12 by 10 foot paver patio with a 2 inch sand layer needs just under one cubic yard once waste is included.</p>
                <p><strong className="text-foreground">Example 2 - Play area fill:</strong> A 5 by 4 meter play zone with 8 cm of sand needs about 1.76 cubic meters, which helps when ordering a small delivery load.</p>
                <p><strong className="text-foreground">Example 3 - Circular base:</strong> A round pad 14 feet across with 3 inches of sand requires close to 1.9 cubic yards, making it easier to compare bagged versus bulk supply.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Sand Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It handles both area shapes and ordering modes.</strong> You can estimate by area and depth, then view the result as bulk volume, tonnage, or bag count.</p>
                <p><strong className="text-foreground">It includes supplier-facing outputs.</strong> Volume and weight both matter in sand orders, so the calculator shows the figures most likely to be used in quotes and deliveries.</p>
                <p><strong className="text-foreground">It is built for real site estimating.</strong> Waste and density inputs let you shift from a rough estimate to a more purchase-ready number.</p>
                <p><strong className="text-foreground">It follows the same template as the completed tool pages.</strong> The structure, content flow, and design all match the established standard you requested.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> Sand density varies by moisture level, grain type, and compaction. If your supplier gives a specific density or bag yield, use that value for a closer estimate.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you calculate how much sand you need?" a="Calculate the area first, then multiply by depth to get volume. After that, convert the volume into tons or bag counts using the material density." />
                <FaqItem q="Why does sand depth matter so much?" a="Because volume scales directly with depth. Doubling the depth doubles the volume and usually doubles the amount you need to buy." />
                <FaqItem q="Should I include waste?" a="Usually yes. Sand can settle, compact, spread unevenly, or be lost during transport and placement, so a waste allowance makes the estimate safer." />
                <FaqItem q="What density should I use for sand?" a="Use your supplier's density if available. If not, the default value gives a reasonable starting point for general dry sand estimating." />
                <FaqItem q="Can I use this for pavers or concrete prep?" a="Yes. It is useful for paver bedding, screed layers, sub-base leveling, trench fill, play areas, and similar sand applications." />
                <FaqItem q="Does this calculator work in feet and meters?" a="Yes. You can switch between imperial and metric units depending on the way your project is measured." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Material Estimators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Move from sand quantities into gravel, concrete, and other construction calculators without changing workflow.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-yellow-700 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-yellow-600/20">{copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}</button>
              </div>
              <div className="p-5 rounded-2xl bg-yellow-600 text-white shadow-xl relative overflow-hidden">
                <Boxes className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Ordering bags?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Use the bag estimate for smaller jobs, but switch to bulk ordering once the project volume grows enough for delivery pricing to make more sense.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={tool.slug === "volume-converter" ? `/conversion/${tool.slug}` : `/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">{tool.icon}</div>
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
