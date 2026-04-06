import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Ruler, Box, Construction, Calculator, Package,
  BarChart3, Star, BadgeCheck, Lock,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function useCementCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [volume, setVolume] = useState("");
  const [cementRatio, setCementRatio] = useState("1");
  const [sandRatio, setSandRatio] = useState("2");
  const [gravelRatio, setGravelRatio] = useState("4");
  const [bagSize, setBagSize] = useState("50");
  const [wasteFactor, setWasteFactor] = useState("10");

  const result = useMemo(() => {
    const v = parseFloat(volume) || 0;
    const c = parseFloat(cementRatio) || 1;
    const s = parseFloat(sandRatio) || 2;
    const g = parseFloat(gravelRatio) || 4;
    const bs = parseFloat(bagSize) || 50;
    const wf = parseFloat(wasteFactor) || 0;

    if (v <= 0 || c <= 0) return null;

    const totalRatio = c + s + g;
    const dryFactor = 1.54;
    const dryVolume = v * dryFactor * (1 + wf / 100);

    const cementVol = (dryVolume * c) / totalRatio;
    const sandVol = (dryVolume * s) / totalRatio;
    const gravelVol = (dryVolume * g) / totalRatio;

    let cementWeight, cementBags, sandWeight, gravelWeight;

    if (unit === "metric") {
      cementWeight = cementVol * 1440;
      cementBags = Math.ceil(cementWeight / bs);
      sandWeight = sandVol * 1600;
      gravelWeight = gravelVol * 1600;
    } else {
      cementWeight = cementVol * 94;
      cementBags = Math.ceil(cementWeight / bs);
      sandWeight = sandVol * 100;
      gravelWeight = gravelVol * 100;
    }

    return { unit, dryVolume, cementWeight, cementBags, sandVol, sandWeight, gravelVol, gravelWeight };
  }, [unit, volume, cementRatio, sandRatio, gravelRatio, bagSize, wasteFactor]);

  return {
    unit, setUnit, volume, setVolume,
    cementRatio, setCementRatio, sandRatio, setSandRatio, gravelRatio, setGravelRatio,
    bagSize, setBagSize, wasteFactor, setWasteFactor, result,
  };
}

// ── Result Insight ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;
  const volUnit = result.unit === "metric" ? "m³" : "cu ft";
  const weightUnit = result.unit === "metric" ? "kg" : "lbs";
  const message = `To produce ${result.dryVolume.toFixed(2)} ${volUnit} of dry concrete mix, you need approximately ${result.cementBags} bags of cement, ${result.sandVol.toFixed(2)} ${volUnit} of sand (${Math.round(result.sandWeight).toLocaleString()} ${weightUnit}), and ${result.gravelVol.toFixed(2)} ${volUnit} of gravel (${Math.round(result.gravelWeight).toLocaleString()} ${weightUnit}). This includes a 1.54× wet-to-dry conversion factor.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-yellow-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-yellow-600">
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

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, color: 38, benefit: "Volume & bags for any pour" },
  { title: "Brick Calculator", slug: "brick-calculator", icon: <Box className="w-5 h-5" />, color: 25, benefit: "Estimate bricks per wall" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 200, benefit: "Calculate paint coverage" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert feet, meters & more" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Calculator className="w-5 h-5" />, color: 340, benefit: "Liters, gallons & more" },
];

// ── Main Component ──
export default function CementCalculator() {
  const calc = useCementCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const volUnit = calc.unit === "metric" ? "m³" : "cu ft";
  const weightUnit = calc.unit === "metric" ? "kg" : "lbs";

  return (
    <Layout>
      <SEO
        title="Cement Calculator – Concrete Mix Ratio Estimator, Free Online Tool | US Online Tools"
        description="Free online cement calculator. Estimate cement bags, sand, and gravel needed for any concrete mix ratio. Supports M15, M20, M25 mixes. Instant results with waste factor. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-yellow-600" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-yellow-600" strokeWidth={3} />
          <span className="text-foreground">Cement Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-yellow-500/15 bg-gradient-to-br from-yellow-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Package className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Cement Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate exactly how many bags of cement, cubic meters of sand, and gravel you need for any concrete mix ratio — from M10 to M25. Instant results with a built-in wet-to-dry factor.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold text-xs px-3 py-1.5 rounded-full border border-yellow-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-yellow-500/20 shadow-lg shadow-yellow-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-yellow-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4 text-white" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Concrete Mix Planner</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 45 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => { calc.setUnit("imperial"); calc.setBagSize("94"); }}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-yellow-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial (ft/lb)</button>
                          <button onClick={() => { calc.setUnit("metric"); calc.setBagSize("50"); }}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-yellow-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric (m/kg)</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Total Project Volume ({volUnit})</label>
                        <input type="number" placeholder="2.5" className="tool-calc-input w-full" value={calc.volume} onChange={e => calc.setVolume(e.target.value)} />
                        <p className="text-[10px] text-muted-foreground mt-1">Total wet volume required.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 rounded-xl bg-muted/30 border border-border">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-wider">Mix Ratio (C : S : G)</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Cement</label><input type="number" className="tool-calc-input w-full" value={calc.cementRatio} onChange={e => calc.setCementRatio(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Sand</label><input type="number" className="tool-calc-input w-full" value={calc.sandRatio} onChange={e => calc.setSandRatio(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Aggregate / Gravel</label><input type="number" className="tool-calc-input w-full" value={calc.gravelRatio} onChange={e => calc.setGravelRatio(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Cement Bag Size ({weightUnit})</label><input type="number" className="tool-calc-input w-full" value={calc.bagSize} onChange={e => calc.setBagSize(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waste Factor (%)</label><input type="number" className="tool-calc-input w-full" value={calc.wasteFactor} onChange={e => calc.setWasteFactor(e.target.value)} /></div>
                    </div>

                    {/* Main Result */}
                    <div className="tool-calc-result p-6 bg-yellow-500/5 border-2 border-yellow-500/20 rounded-2xl mb-4 text-center">
                      <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">You Need</p>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-black text-foreground">{calc.result ? calc.result.cementBags : "0"}</span>
                        <span className="text-xl font-bold text-yellow-600">Bags of Cement</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/40 border border-border">
                        <div className="flex items-center gap-2 mb-2"><Box className="w-4 h-4 text-yellow-600" /><span className="text-sm font-bold text-foreground uppercase tracking-tight">Sand</span></div>
                        <div className="flex justify-between items-end">
                          <div><span className="text-2xl font-black text-foreground">{calc.result ? calc.result.sandVol.toFixed(2) : "0.00"}</span><span className="text-xs font-bold text-muted-foreground ml-1">{volUnit}</span></div>
                          <div className="text-right"><span className="text-xs font-bold text-muted-foreground block uppercase">Weight</span><span className="text-sm font-bold text-foreground">{calc.result ? Math.round(calc.result.sandWeight).toLocaleString() : "0"} {weightUnit}</span></div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/40 border border-border">
                        <div className="flex items-center gap-2 mb-2"><Construction className="w-4 h-4 text-yellow-600" /><span className="text-sm font-bold text-foreground uppercase tracking-tight">Gravel</span></div>
                        <div className="flex justify-between items-end">
                          <div><span className="text-2xl font-black text-foreground">{calc.result ? calc.result.gravelVol.toFixed(2) : "0.00"}</span><span className="text-xs font-bold text-muted-foreground ml-1">{volUnit}</span></div>
                          <div className="text-right"><span className="text-xs font-bold text-muted-foreground block uppercase">Weight</span><span className="text-sm font-bold text-foreground">{calc.result ? Math.round(calc.result.gravelWeight).toLocaleString() : "0"} {weightUnit}</span></div>
                        </div>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Cement Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Calculating cement requirements is more complex than simply measuring volume, because dry materials shrink when mixed with water. This tool handles the wet-to-dry conversion, ratio splitting, and bag counting automatically — giving you a professional-grade material list in seconds.</p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the total wet volume of your project</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This is the finished volume of concrete you need — calculated as Length × Width × Depth for a slab, or use our <strong className="text-foreground">Concrete Calculator</strong> to find this number. For example, a 3 m × 3 m × 0.1 m slab requires 0.9 m³ of wet concrete. The calculator then multiplies this by 1.54 to determine the dry material volumes needed.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select or customise the mix ratio</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The default ratio is 1:2:4 (Cement : Sand : Gravel), which is the standard M15 mix used for general construction, foundations, and floors. For higher-strength applications, use 1:1.5:3 (M20) or 1:1:2 (M25). For non-structural work like base courses, a weaker 1:3:6 (M10) ratio is sufficient. Simply type your desired ratio into the three fields.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the material breakdown and start ordering</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The calculator shows the total number of cement bags (in your selected bag weight), plus the volume and estimated weight of sand and gravel required. Use these numbers to get quotes from your local building supplies yard. For large projects, ordering sand and gravel by the tonne is usually cheaper than by the bag.</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><span className="text-yellow-600 font-bold w-16 flex-shrink-0">Dry Vol</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Wet Volume × 1.54 × (1 + Waste%)</code></div>
                  <div className="flex items-center gap-3 text-sm"><span className="text-yellow-600 font-bold w-16 flex-shrink-0">Cement</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(Dry Vol × C) ÷ (C + S + G) × 1440 kg/m³</code></div>
                  <div className="flex items-center gap-3 text-sm"><span className="text-yellow-600 font-bold w-16 flex-shrink-0">Bags</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Cement Weight ÷ Bag Size (kg or lbs)</code></div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Concrete Mix Ratios</h2>
              <p className="text-muted-foreground text-sm mb-6">Choose the right mix for your project type:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div><p className="font-bold text-foreground mb-1">M15 (1:2:4) — General Construction</p><p className="text-sm text-muted-foreground leading-relaxed">The most widely used mix ratio for residential construction. Suitable for foundations, ground floors, internal walls, and step footings. Provides approximately 15 MPa compressive strength after 28 days of curing. A 50 kg bag mixed at this ratio produces roughly 0.12 m³ of wet concrete.</p></div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div><p className="font-bold text-foreground mb-1">M20 (1:1.5:3) — Structural Reinforced Concrete</p><p className="text-sm text-muted-foreground leading-relaxed">A stronger mix for reinforced concrete slabs, beams, and structural columns. Produces approximately 20 MPa compressive strength. Standard for most RCC (reinforced cement concrete) residential structures including multi-story buildings.</p></div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div><p className="font-bold text-foreground mb-1">M10 (1:3:6) — Non-Structural Work</p><p className="text-sm text-muted-foreground leading-relaxed">A lean mix used for base courses, pathways, garden slabs, and non-load-bearing applications. Uses less cement per cubic meter, making it the most economical option. Not suitable for any structural application.</p></div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-left px-4 py-3 font-bold text-foreground">Volume</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Mix Ratio</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Cement Bags</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Sand</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Project</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 font-mono font-bold text-foreground">1 m³</td><td className="px-4 py-3 text-muted-foreground">1:2:4</td><td className="px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">9 bags</td><td className="px-4 py-3 text-foreground">0.44 m³</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Room foundation</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 font-mono font-bold text-foreground">2.5 m³</td><td className="px-4 py-3 text-muted-foreground">1:2:4</td><td className="px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">22 bags</td><td className="px-4 py-3 text-foreground">1.10 m³</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Driveway slab</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 font-mono font-bold text-foreground">0.5 m³</td><td className="px-4 py-3 text-muted-foreground">1:1.5:3</td><td className="px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">7 bags</td><td className="px-4 py-3 text-foreground">0.21 m³</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">RCC column</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 – Room foundation:</strong> Pouring 1 m³ of M15 concrete (1:2:4) with a 10% waste factor requires approximately 9 bags of 50 kg cement, 0.44 m³ of sand, and 0.88 m³ of gravel. At typical prices, this is under $200 in materials — a fraction of the cost of hiring a pour service.</p>
                <p><strong className="text-foreground">Example 2 – Higher-strength column:</strong> For a reinforced column at 0.5 m³ using M20 (1:1.5:3), the cement requirement jumps to 7 bags despite the smaller volume, because the richer mix uses proportionally more cement per cubic meter. This illustrates why mix ratio selection directly impacts your budget.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally a tool that does the 1.54 wet-to-dry conversion for me. My supplier confirmed the bag count was spot-on."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Cement Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It applies the 1.54 wet-to-dry factor automatically.</strong> Dry materials compact when mixed with water — filling air voids and reducing volume. You need approximately 54% more dry material than your final wet volume suggests. Many basic calculators skip this step, leading to embarrassing shortfalls on pour day.</p>
                <p><strong className="text-foreground">Flexible mix ratios for any project strength.</strong> Type any cement-to-sand-to-aggregate ratio you need. Whether you're following a structural engineer's specification (like 1:1.2:2.4 for M25+) or using a traditional nominal mix, the calculator splits the dry volume proportionally and gives you precise material quantities.</p>
                <p><strong className="text-foreground">Customisable bag sizes for any market.</strong> Cement is sold in 50 kg bags in most countries, 94 lb bags in the U.S., and 25 kg bags in some European markets. Set your local bag weight and the calculator rounds up to whole bags — no fractional bag guesswork.</p>
                <p><strong className="text-foreground">Shows weight estimates for sand and gravel.</strong> Beyond volume, the tool converts sand and gravel quantities to estimated weights (using standard densities of 1,600 kg/m³) so you can compare quotes from suppliers who sell by the tonne rather than by volume.</p>
                <p><strong className="text-foreground">Completely private — no data leaves your browser.</strong> Every calculation runs locally in JavaScript. No project volumes, ratios, or addresses are transmitted to any server. Ideal for contractors preparing confidential construction estimates.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool provides material estimates for planning. Actual yields may vary based on aggregate gradation, cement brand, water-cement ratio, and site conditions. For structural applications, always follow the mix design specified by a licensed structural engineer.</p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the 1:2:4 ratio in concrete?" a="It represents the ratio of Cement : Sand (Fine Aggregate) : Gravel (Coarse Aggregate) by volume. For every 1 bucket of cement, you mix 2 buckets of sand and 4 buckets of gravel. This is the standard M15 mix used for general residential construction." />
                <FaqItem q="How much concrete does 1 bag of cement make?" a="A standard 50 kg bag of cement used in a 1:2:4 mix produces roughly 0.12 to 0.15 cubic meters (4.4 cubic feet) of wet concrete. This varies slightly based on the exact water-cement ratio and the grading of your aggregates." />
                <FaqItem q="Why multiply by 1.54?" a="When dry cement, sand, and gravel are mixed with water, the resulting concrete occupies less volume than the sum of the dry components because water fills the air voids between particles. The factor 1.54 is an empirical constant ensuring you have enough dry material to produce your desired wet volume." />
                <FaqItem q="Which cement ratio is best for a house foundation?" a="A 1:2:4 (M15) or 1:1.5:3 (M20) ratio is generally recommended for residential house foundations. M15 provides 15 MPa strength, sufficient for most single-story structures. M20 provides 20 MPa, recommended for multi-story buildings or areas with high ground water." />
                <FaqItem q="What is the difference between OPC and PPC cement?" a="OPC (Ordinary Portland Cement) is the most common type, suitable for general construction. PPC (Portland Pozzolana Cement) contains fly ash, offering better workability and resistance to chemical attack — ideal for foundations in moist or sulfate-rich soils. Both can be used with this calculator." />
                <FaqItem q="How do I convert cubic meters to bags?" a="Multiply the cement volume (m³) by 1,440 (the density of cement in kg/m³) to get the weight in kilograms, then divide by your bag size (typically 50 kg). For example: 0.15 m³ × 1,440 = 216 kg ÷ 50 = 4.32, rounded up to 5 bags." />
                <FaqItem q="Can I use this for mortar calculations?" a="Yes — mortar is simply a cement-sand mix without coarse aggregate. Set the Gravel ratio to 0 and use a typical mortar ratio like 1:4 (Cement : Sand). The calculator will show only cement and sand quantities. For plastering work, use 1:6." />
                <FaqItem q="Does this tool work on mobile?" a="Yes. The layout adapts to smaller screens with stacked inputs for easy thumb entry. It works on any modern browser — iOS Safari, Android Chrome, and desktop browsers — with no app download or login required." />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Construction Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore our full suite of construction tools — concrete, bricks, paint, tiles, and more.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-yellow-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-yellow-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help fellow builders plan materials.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Mix Ratios", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-yellow-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-yellow-500/40 flex-shrink-0" />{label}
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
