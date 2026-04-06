import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Lightbulb, Copy, Check,
  Ruler, Box, Circle,
  BarChart3, Percent, Calculator, Star,
  BadgeCheck, Lock, Construction,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Shape = "slab" | "column" | "tube";
type Unit = "imperial" | "metric";

function useConcreteCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [shape, setShape] = useState<Shape>("slab");
  const [lengthFt, setLengthFt] = useState("");
  const [lengthIn, setLengthIn] = useState("");
  const [widthFt, setWidthFt] = useState("");
  const [widthIn, setWidthIn] = useState("");
  const [depthFt, setDepthFt] = useState("");
  const [depthIn, setDepthIn] = useState("");
  const [diameterFt, setDiameterFt] = useState("");
  const [diameterIn, setDiameterIn] = useState("");
  const [lengthM, setLengthM] = useState("");
  const [widthM, setWidthM] = useState("");
  const [depthM, setDepthM] = useState("");
  const [diameterM, setDiameterM] = useState("");
  const [includeWaste, setIncludeWaste] = useState(true);

  const result = useMemo(() => {
    let cubicFeet = 0;

    if (unit === "imperial") {
      const dFt = parseFloat(depthFt) || 0;
      const dIn = parseFloat(depthIn) || 0;
      const depthTotal = dFt + dIn / 12;

      if (shape === "slab") {
        const lFt = parseFloat(lengthFt) || 0;
        const lIn = parseFloat(lengthIn) || 0;
        const wFt = parseFloat(widthFt) || 0;
        const wIn = parseFloat(widthIn) || 0;
        const length = lFt + lIn / 12;
        const width = wFt + wIn / 12;
        if (length <= 0 || width <= 0 || depthTotal <= 0) return null;
        cubicFeet = length * width * depthTotal;
      } else {
        const diaFt = parseFloat(diameterFt) || 0;
        const diaIn = parseFloat(diameterIn) || 0;
        const diameter = diaFt + diaIn / 12;
        if (diameter <= 0 || depthTotal <= 0) return null;
        const radius = diameter / 2;
        cubicFeet = Math.PI * radius * radius * depthTotal;
      }
    } else {
      const depth = parseFloat(depthM) || 0;

      if (shape === "slab") {
        const length = parseFloat(lengthM) || 0;
        const width = parseFloat(widthM) || 0;
        if (length <= 0 || width <= 0 || depth <= 0) return null;
        cubicFeet = length * width * depth * 35.3147;
      } else {
        const diameter = parseFloat(diameterM) || 0;
        if (diameter <= 0 || depth <= 0) return null;
        const radius = diameter / 2;
        const cubicMeters = Math.PI * radius * radius * depth;
        cubicFeet = cubicMeters * 35.3147;
      }
    }

    const wasteFactor = includeWaste ? 1.1 : 1;
    const totalCubicFeet = cubicFeet * wasteFactor;
    const cubicYards = totalCubicFeet / 27;
    const cubicMeters = totalCubicFeet / 35.3147;
    const bags60lb = Math.ceil(totalCubicFeet / 0.45);
    const bags80lb = Math.ceil(totalCubicFeet / 0.6);

    return {
      cubicFeet: totalCubicFeet,
      cubicYards,
      cubicMeters,
      bags60lb,
      bags80lb,
      wasteApplied: includeWaste,
    };
  }, [unit, shape, lengthFt, lengthIn, widthFt, widthIn, depthFt, depthIn, diameterFt, diameterIn, lengthM, widthM, depthM, diameterM, includeWaste]);

  return {
    unit, setUnit, shape, setShape,
    lengthFt, setLengthFt, lengthIn, setLengthIn,
    widthFt, setWidthFt, widthIn, setWidthIn,
    depthFt, setDepthFt, depthIn, setDepthIn,
    diameterFt, setDiameterFt, diameterIn, setDiameterIn,
    lengthM, setLengthM, widthM, setWidthM, depthM, setDepthM, diameterM, setDiameterM,
    includeWaste, setIncludeWaste,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { cubicFeet: number; cubicYards: number; cubicMeters: number; bags60lb: number; bags80lb: number; wasteApplied: boolean } | null }) {
  if (!result) return null;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const message = `You need approximately ${fmt(result.cubicYards)} cubic yards (${fmt(result.cubicFeet)} cu ft) of concrete${result.wasteApplied ? " including a 10% waste factor" : ""}. That's about ${result.bags60lb} pre-mixed 60 lb bags or ${result.bags80lb} pre-mixed 80 lb bags. For larger projects, ordering ready-mix concrete by the cubic yard is usually more cost-effective.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
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

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Brick Calculator", slug: "brick-calculator", icon: <Construction className="w-5 h-5" />, color: 25, benefit: "Estimate bricks for any wall" },
  { title: "Cement Calculator", slug: "cement-calculator", icon: <Box className="w-5 h-5" />, color: 35, benefit: "Cement bags & mix ratios" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 200, benefit: "Calculate paint coverage" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert feet, meters & more" },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Circle className="w-5 h-5" />, color: 340, benefit: "Liters, gallons & more" },
];

// ── Main Component ──
export default function ConcreteCalculator() {
  const calc = useConcreteCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | null) => {
    if (n === null) return "--";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  return (
    <Layout>
      <SEO
        title="Concrete Calculator – How Much Concrete Do I Need? Free Online Tool | US Online Tools"
        description="Free online concrete calculator. Calculate cubic yards, cubic meters, and pre-mixed bags needed for slabs, columns, and tubes. Instant results with waste factor. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Concrete Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-yellow-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Concrete Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate exactly how much concrete you need for slabs, footings, columns, and tubes — in cubic yards, cubic meters, or pre-mixed bags. Instant results with a built-in waste factor.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Construction &amp; DIY &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Construction className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Slab · Column · Tube</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 38 } as React.CSSProperties}>
                    {/* Shape & Unit Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Shape</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          {(["slab", "column", "tube"] as Shape[]).map(s => (
                            <button key={s} onClick={() => calc.setShape(s)}
                              className={`flex-1 py-2 text-sm font-bold transition-colors capitalize ${calc.shape === s ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                            >{s}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >Imperial (ft/in)</button>
                          <button onClick={() => calc.setUnit("metric")}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >Metric (m)</button>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    {calc.unit === "imperial" ? (
                      <div className="space-y-4 mb-6">
                        {calc.shape === "slab" ? (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (ft)</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.lengthFt} onChange={e => calc.setLengthFt(e.target.value)} /></div>
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (in)</label><input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.lengthIn} onChange={e => calc.setLengthIn(e.target.value)} /></div>
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width (ft)</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.widthFt} onChange={e => calc.setWidthFt(e.target.value)} /></div>
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width (in)</label><input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.widthIn} onChange={e => calc.setWidthIn(e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Depth (ft)</label><input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.depthFt} onChange={e => calc.setDepthFt(e.target.value)} /></div>
                              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Depth (in)</label><input type="number" placeholder="4" className="tool-calc-input w-full" value={calc.depthIn} onChange={e => calc.setDepthIn(e.target.value)} /></div>
                            </div>
                          </>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Diameter (ft)</label><input type="number" placeholder="1" className="tool-calc-input w-full" value={calc.diameterFt} onChange={e => calc.setDiameterFt(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Diameter (in)</label><input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.diameterIn} onChange={e => calc.setDiameterIn(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Height (ft)</label><input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.depthFt} onChange={e => calc.setDepthFt(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Height (in)</label><input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.depthIn} onChange={e => calc.setDepthIn(e.target.value)} /></div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        {calc.shape === "slab" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (m)</label><input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.lengthM} onChange={e => calc.setLengthM(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width (m)</label><input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.widthM} onChange={e => calc.setWidthM(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Depth (m)</label><input type="number" placeholder="0.1" className="tool-calc-input w-full" value={calc.depthM} onChange={e => calc.setDepthM(e.target.value)} /></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Diameter (m)</label><input type="number" placeholder="0.3" className="tool-calc-input w-full" value={calc.diameterM} onChange={e => calc.setDiameterM(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Height (m)</label><input type="number" placeholder="1" className="tool-calc-input w-full" value={calc.depthM} onChange={e => calc.setDepthM(e.target.value)} /></div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Waste Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer mb-6 p-3 rounded-xl bg-muted/30 border border-border">
                      <input type="checkbox" checked={calc.includeWaste} onChange={e => calc.setIncludeWaste(e.target.checked)} className="w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-sm font-semibold text-foreground">Include 10% waste factor (recommended)</span>
                    </label>

                    {/* Results */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cubic Yards</p>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{fmt(calc.result?.cubicYards ?? null)}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cubic Feet</p>
                        <p className="text-2xl font-black text-foreground">{fmt(calc.result?.cubicFeet ?? null)}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">60 lb Bags</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.bags60lb : "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">80 lb Bags</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.bags80lb : "--"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Concrete Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you are pouring a backyard patio, setting fence posts, or building a foundation for a new shed, getting the correct concrete quantity is critical. This calculator walks you through the process step by step, so you never over-order or under-order again.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select the shape of your pour</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Choose <strong className="text-foreground">Slab</strong> for flat rectangular pours like patios, driveways, sidewalks, and garage floors. Choose <strong className="text-foreground">Column</strong> or <strong className="text-foreground">Tube</strong> for round cylindrical pours like fence post holes, Sonotubes, piers, and pillars. The calculator uses the correct formula (length × width × depth for rectangles, π × r² × height for cylinders) based on your selection.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your dimensions in Imperial or Metric units</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      For Imperial, input dimensions in feet and inches separately — both fields are combined automatically. For example, a slab that is 10 feet 6 inches long is entered as 10 in the "ft" field and 6 in the "in" field. For Metric, all inputs are in meters. You can switch between unit systems at any time; the calculation updates instantly.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review results and decide on bags vs. ready-mix</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The calculator instantly shows results in cubic yards, cubic feet, cubic meters, and equivalent pre-mixed bag counts (60 lb and 80 lb sizes). A plain-English explanation appears below the results summarizing your total order. For projects larger than 1 cubic yard, consider ordering ready-mix delivery from a local plant — it is typically cheaper and faster than hand-mixing bags.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-500 font-bold w-12 flex-shrink-0">Slab</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Volume = Length × Width × Depth</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-500 font-bold w-12 flex-shrink-0">Tube</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Volume = π × (Diameter ÷ 2)² × Height</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-amber-500 font-bold w-12 flex-shrink-0">Waste</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Total = Volume × 1.10 (adds 10% extra)</code>
                  </div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to act on your concrete volume result:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Under 1 cubic yard — Hand-mix bags</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">For small projects like a single fence post, mailbox footing, or a small step, buying pre-mixed bags (60 lb or 80 lb) from a hardware store is the most practical option. You can mix these in a wheelbarrow or a portable mixer. No delivery fee and no minimum order.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">1–3 cubic yards — Trailer load or small delivery</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Mid-size projects like a garden shed pad or a walkway slab. Some suppliers offer "short load" truck deliveries (with a surcharge for under-capacity trucks). Alternatively, you can rent a small trailer-mounted mixer. This range is usually the tipping point where ready-mix becomes more cost-effective than bags.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">3+ cubic yards — Full ready-mix truck delivery</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Large projects like driveways, garage floors, and house foundations. A standard ready-mix truck holds 8–10 cubic yards. Ready-mix is machine-blended, consistent quality, and much faster than hand-mixing. Always have enough labor on hand — concrete starts setting within 60–90 minutes after water is added.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Project</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Dimensions</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Cu Yards</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">80 lb Bags</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Scenario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Slab</td>
                      <td className="px-4 py-3 font-mono text-foreground text-xs">10′ × 10′ × 4″</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">1.23</td>
                      <td className="px-4 py-3 font-bold text-foreground">56</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Patio or shed pad</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Slab</td>
                      <td className="px-4 py-3 font-mono text-foreground text-xs">20′ × 20′ × 6″</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">7.41</td>
                      <td className="px-4 py-3 font-bold text-foreground">334</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Two-car driveway</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Tube</td>
                      <td className="px-4 py-3 font-mono text-foreground text-xs">12″ dia × 3′ deep</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">0.09</td>
                      <td className="px-4 py-3 font-bold text-foreground">4</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Deck post footing</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Slab</td>
                      <td className="px-4 py-3 font-mono text-foreground text-xs">4′ × 30′ × 4″</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">1.48</td>
                      <td className="px-4 py-3 font-bold text-foreground">67</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Sidewalk</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Patio slab:</strong> A homeowner builds a 10 × 10 foot outdoor patio at the standard 4-inch depth. The calculator shows 1.23 cubic yards (with waste), requiring around 56 bags of 80 lb concrete. At an average retail price of $5–6 per bag, the total material cost is $280–$336 — achievable in a weekend with two people and a rented mixer.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Deck post footing:</strong> A DIYer setting a 12-inch diameter Sonotube 3 feet deep needs only about 0.09 cubic yards — roughly 4 bags of 80 lb concrete. This is a common scenario when building a deck and illustrates why tube calculations are important: the volume is much less than people expect due to the circular cross-section.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Driveway pour:</strong> A 20 × 20 foot driveway at 6-inch depth requires 7.41 cubic yards — well past the point where ready-mix delivery is recommended. Buying 334 bags would be both expensive and exhausting; a ready-mix truck delivery is typically 30–50% cheaper per cubic yard for this volume and can pour the entire slab in under an hour.
                </p>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Saved me from over-ordering by 2 cubic yards on my garage floor. The waste factor tip alone was worth coming here."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Concrete Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It handles every common pour shape.</strong> Most free calculators online only support rectangular slabs. This tool also covers cylindrical shapes — essential for fence posts, Sonotubes, and pier footings. You don't need to search for a separate "tube volume calculator" or manually work out π × r² yourself.
                </p>
                <p>
                  <strong className="text-foreground">Imperial and Metric with split-field precision.</strong> In Imperial mode, you can enter feet and inches separately instead of converting everything to decimals. That means "10 feet 6 inches" is entered as two fields, not 10.5 — reducing mental math errors on the jobsite. Metric mode uses meters for all inputs.
                </p>
                <p>
                  <strong className="text-foreground">A built-in 10% waste factor you can toggle.</strong> Experienced contractors always order 5–10% more concrete than the calculated volume to account for uneven subgrade, spillage, and form leaks. This calculator includes a toggle that adds 10% by default — or you can turn it off for exact-volume estimates when planning rather than ordering.
                </p>
                <p>
                  <strong className="text-foreground">Instant bag-count conversion.</strong> The output includes equivalent bag counts for both 60 lb and 80 lb pre-mixed bags — the two most common sizes at hardware stores like Home Depot and Lowe's. This lets you walk into the store knowing exactly how many bags to load on your cart.
                </p>
                <p>
                  <strong className="text-foreground">Your data stays on your device.</strong> Every calculation is performed in your browser using JavaScript. No dimensions, volumes, or project details are transmitted to any server. This is important for contractors working on pre-construction estimates where project details may be confidential.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool provides material volume estimates for planning purposes. Actual quantities may vary based on subgrade conditions, form accuracy, and concrete mix design. For structural applications, always consult a licensed engineer. Ready-mix concrete plants may require minimum orders (typically 1 cubic yard) and charge extra for short loads.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How many bags of concrete do I need for a 10×10 slab?"
                  a="A 10×10 foot slab at 4 inches thick requires approximately 1.23 cubic yards of concrete — about 56 bags of 80 lb pre-mixed concrete (like Quikrete or Sakrete). At 6 inches thick, the same slab needs 1.85 cubic yards, or about 84 bags. Always add 10% extra for waste."
                />
                <FaqItem
                  q="What is the difference between cubic yards and cubic feet?"
                  a="One cubic yard equals 27 cubic feet. Ready-mix concrete suppliers quote prices per cubic yard, while pre-mixed bags list their yield in cubic feet. A single 80 lb bag yields approximately 0.6 cubic feet. This calculator converts between all units automatically so you can compare options easily."
                />
                <FaqItem
                  q="Why should I add a 10% waste factor?"
                  a="Waste occurs from uneven subgrade causing the slab to use more concrete in low spots, spillage during pouring, concrete left in the mixer or wheelbarrow, and slight inaccuracies in form dimensions. Professional contractors typically add 5–10%. We use 10% as a safe default — you can toggle it off if you prefer exact estimates."
                />
                <FaqItem
                  q="How thick should a concrete slab be?"
                  a="For a standard residential patio or walkway, 4 inches (100 mm) is typical. Driveways should be at least 5–6 inches to support vehicle weight. Garage floors are usually 6 inches. For heavy-duty applications like RV pads or commercial loading areas, 8 inches or more may be needed. When in doubt, consult your local building code."
                />
                <FaqItem
                  q="How much does concrete cost per cubic yard?"
                  a="Ready-mix concrete typically costs $125–$175 per cubic yard delivered (2024–2025 pricing, U.S. national average), depending on your region, mix design, and delivery distance. Pre-mixed bags cost more per cubic yard — roughly $250–$400 — but avoid delivery minimums and are practical for jobs under 1 cubic yard."
                />
                <FaqItem
                  q="Can I use this calculator for footings and foundations?"
                  a="Yes. For strip footings, enter the length, width, and depth of the trench as a slab calculation. For pier footings (round), use the tube/column mode. For complex foundation shapes, calculate each section separately and add the results. This calculator handles any rectangular or cylindrical geometry."
                />
                <FaqItem
                  q="How many 80 lb bags fit in a cubic yard?"
                  a="One cubic yard of concrete requires approximately 45 bags of 80 lb pre-mixed concrete (each bag yields about 0.6 cu ft, and 1 cu yd = 27 cu ft). For 60 lb bags — which yield about 0.45 cu ft each — you would need approximately 60 bags per cubic yard."
                />
                <FaqItem
                  q="Does this calculator work on mobile phones?"
                  a="Yes. The layout adapts automatically to smaller screens — inputs stack vertically for thumb-friendly entry. The tool runs entirely in your browser, requires no app download, and works on any modern smartphone (iOS Safari, Android Chrome). You can use it right on the jobsite."
                />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Construction Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore our full suite of construction and DIY calculators — bricks, cement, paint, tiles, and more — all free, all instant.
                </p>
                <Link
                  href="/category/construction"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore Construction Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help fellow builders calculate materials.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors"
                    >
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
