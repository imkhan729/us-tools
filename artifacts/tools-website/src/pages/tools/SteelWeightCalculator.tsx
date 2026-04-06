import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Construction, Ruler, Calculator, Box, Scale,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Shape = "round" | "square" | "flat" | "hexagonal";
type Unit = "metric" | "imperial";

// Standard density of mild steel
const DENSITY_KG_M3 = 7850;
const DENSITY_LB_IN3 = 0.2836;

function useSteelWeightCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [shape, setShape] = useState<Shape>("round");

  // Metric inputs (mm/m)
  const [diameterMm, setDiameterMm] = useState("");
  const [widthMm, setWidthMm] = useState("");
  const [thicknessMm, setThicknessMm] = useState("");
  const [lengthM, setLengthM] = useState("");

  // Imperial inputs (inches/feet)
  const [diameterIn, setDiameterIn] = useState("");
  const [widthIn, setWidthIn] = useState("");
  const [thicknessIn, setThicknessIn] = useState("");
  const [lengthFt, setLengthFt] = useState("");

  const [quantity, setQuantity] = useState("1");

  const result = useMemo(() => {
    const qty = parseFloat(quantity) || 1;
    let singleWeightKg = 0;
    let singleWeightLb = 0;

    if (unit === "metric") {
      const lenM = parseFloat(lengthM) || 0;
      if (lenM <= 0) return null;

      let areaMm2 = 0;
      if (shape === "round") {
        const d = parseFloat(diameterMm) || 0;
        areaMm2 = Math.PI * Math.pow(d / 2, 2);
      } else if (shape === "square") {
        const w = parseFloat(widthMm) || 0;
        areaMm2 = w * w;
      } else if (shape === "flat") {
        const w = parseFloat(widthMm) || 0;
        const t = parseFloat(thicknessMm) || 0;
        areaMm2 = w * t;
      } else if (shape === "hexagonal") {
        const w = parseFloat(widthMm) || 0; // width across flats
        areaMm2 = (Math.sqrt(3) / 2) * w * w;
      }

      if (areaMm2 <= 0) return null;

      const areaM2 = areaMm2 / 1000000;
      const volM3 = areaM2 * lenM;
      singleWeightKg = volM3 * DENSITY_KG_M3;
      singleWeightLb = singleWeightKg * 2.20462;
    } else {
      const lenFt = parseFloat(lengthFt) || 0;
      if (lenFt <= 0) return null;
      const lenIn = lenFt * 12;

      let areaIn2 = 0;
      if (shape === "round") {
        const d = parseFloat(diameterIn) || 0;
        areaIn2 = Math.PI * Math.pow(d / 2, 2);
      } else if (shape === "square") {
        const w = parseFloat(widthIn) || 0;
        areaIn2 = w * w;
      } else if (shape === "flat") {
        const w = parseFloat(widthIn) || 0;
        const t = parseFloat(thicknessIn) || 0;
        areaIn2 = w * t;
      } else if (shape === "hexagonal") {
        const w = parseFloat(widthIn) || 0;
        areaIn2 = (Math.sqrt(3) / 2) * w * w;
      }

      if (areaIn2 <= 0) return null;

      const volIn3 = areaIn2 * lenIn;
      singleWeightLb = volIn3 * DENSITY_LB_IN3;
      singleWeightKg = singleWeightLb / 2.20462;
    }

    return {
      singleWeightKg,
      singleWeightLb,
      totalWeightKg: singleWeightKg * qty,
      totalWeightLb: singleWeightLb * qty,
      quantity: qty,
    };
  }, [unit, shape, diameterMm, widthMm, thicknessMm, lengthM, diameterIn, widthIn, thicknessIn, lengthFt, quantity]);

  return {
    unit, setUnit, shape, setShape,
    diameterMm, setDiameterMm, widthMm, setWidthMm, thicknessMm, setThicknessMm, lengthM, setLengthM,
    diameterIn, setDiameterIn, widthIn, setWidthIn, thicknessIn, setThicknessIn, lengthFt, setLengthFt,
    quantity, setQuantity, result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const primaryWeight = unit === "metric" ? result.totalWeightKg : result.totalWeightLb;
  const secondaryWeight = unit === "metric" ? result.totalWeightLb : result.totalWeightKg;
  const primaryUnit = unit === "metric" ? "kg" : "lbs";
  const secondaryUnit = unit === "metric" ? "lbs" : "kg";
  const isMultiple = result.quantity > 1;

  const message = `The estimated total weight of your steel order is ${primaryWeight.toFixed(2)} ${primaryUnit} (${secondaryWeight.toFixed(2)} ${secondaryUnit}). ${isMultiple ? `Each individual piece weighs approximately ${(unit === "metric" ? result.singleWeightKg : result.singleWeightLb).toFixed(2)} ${primaryUnit}.` : ""} This is calculated using the standard density of mild steel (7,850 kg/m³ or 490 lb/ft³).`;

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
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, color: 38, benefit: "Volume & bags for any pour" },
  { title: "Weight Converter", slug: "weight-converter", icon: <Scale className="w-5 h-5" />, color: 280, benefit: "Convert kg, lbs & more" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert feet, meters & more" },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
];

export default function SteelWeightCalculator() {
  const calc = useSteelWeightCalc();
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
        title="Steel Weight Calculator – Free Online Tool | US Online Tools"
        description="Calculate the weight of steel bars, rods, and beams. Supports round, square, flat, and hexagonal shapes. Instant precise results in kg and lbs with no signup needed."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Steel Weight Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-yellow-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Scale className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Steel Weight Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate the exact weight of steel bars online. Support for round rods, square bars, flat sheets, and hexagonal shapes in both metric and imperial units.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Steel Dimensions Input</p>
                      <p className="text-sm text-muted-foreground">Instantly updates as you map out the values.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 38 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                           <button onClick={() => calc.setUnit("metric")}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >Metric (mm/m)</button>
                          <button onClick={() => calc.setUnit("imperial")}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                          >Imperial (in/ft)</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Steel Shape</label>
                        <select className="tool-calc-input w-full" value={calc.shape} onChange={e => calc.setShape(e.target.value as Shape)}>
                          <option value="round">Round Solid Bar</option>
                          <option value="square">Square Solid Bar</option>
                          <option value="flat">Flat / Rectangular Bar</option>
                          <option value="hexagonal">Hexagonal Solid Bar</option>
                        </select>
                      </div>
                    </div>

                    {calc.unit === "metric" ? (
                      <div className="space-y-4 mb-6">
                        {calc.shape === "round" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Diameter (mm)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.diameterMm} onChange={e => calc.setDiameterMm(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (m)</label><input type="number" placeholder="6" className="tool-calc-input w-full" value={calc.lengthM} onChange={e => calc.setLengthM(e.target.value)} /></div>
                          </div>
                        )}
                        {calc.shape === "square" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width/Side (mm)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.widthMm} onChange={e => calc.setWidthMm(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (m)</label><input type="number" placeholder="6" className="tool-calc-input w-full" value={calc.lengthM} onChange={e => calc.setLengthM(e.target.value)} /></div>
                          </div>
                        )}
                        {calc.shape === "flat" && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width (mm)</label><input type="number" placeholder="50" className="tool-calc-input w-full" value={calc.widthMm} onChange={e => calc.setWidthMm(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Thickness (mm)</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.thicknessMm} onChange={e => calc.setThicknessMm(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (m)</label><input type="number" placeholder="6" className="tool-calc-input w-full" value={calc.lengthM} onChange={e => calc.setLengthM(e.target.value)} /></div>
                          </div>
                        )}
                        {calc.shape === "hexagonal" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width Across Flats (mm)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.widthMm} onChange={e => calc.setWidthMm(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (m)</label><input type="number" placeholder="6" className="tool-calc-input w-full" value={calc.lengthM} onChange={e => calc.setLengthM(e.target.value)} /></div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        {calc.shape === "round" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Diameter (inches)</label><input type="number" placeholder="0.5" className="tool-calc-input w-full" value={calc.diameterIn} onChange={e => calc.setDiameterIn(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (feet)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.lengthFt} onChange={e => calc.setLengthFt(e.target.value)} /></div>
                          </div>
                        )}
                        {calc.shape === "square" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width/Side (inches)</label><input type="number" placeholder="0.5" className="tool-calc-input w-full" value={calc.widthIn} onChange={e => calc.setWidthIn(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (feet)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.lengthFt} onChange={e => calc.setLengthFt(e.target.value)} /></div>
                          </div>
                        )}
                        {calc.shape === "flat" && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width (inches)</label><input type="number" placeholder="2" className="tool-calc-input w-full" value={calc.widthIn} onChange={e => calc.setWidthIn(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Thickness (inches)</label><input type="number" placeholder="0.25" className="tool-calc-input w-full" value={calc.thicknessIn} onChange={e => calc.setThicknessIn(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (feet)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.lengthFt} onChange={e => calc.setLengthFt(e.target.value)} /></div>
                          </div>
                        )}
                        {calc.shape === "hexagonal" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width Across Flats (inches)</label><input type="number" placeholder="0.5" className="tool-calc-input w-full" value={calc.widthIn} onChange={e => calc.setWidthIn(e.target.value)} /></div>
                            <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length (feet)</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.lengthFt} onChange={e => calc.setLengthFt(e.target.value)} /></div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Quantity</label>
                      <input type="number" placeholder="1" className="tool-calc-input w-full sm:w-1/3" value={calc.quantity} onChange={e => calc.setQuantity(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Weight (kg)</p>
                        <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{fmt(calc.result?.totalWeightKg ?? null)} <span className="text-sm font-semibold">kg</span></p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Weight (lbs)</p>
                        <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{fmt(calc.result?.totalWeightLb ?? null)} <span className="text-sm font-semibold">lbs</span></p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Steel Weight</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Determining the weight of steel bars is essential for structural engineering, purchasing materials, and calculating shipping costs. This calculator uses standard density formulas to provide instant weight approximations for various common profiles.</p>
              
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select Unit System and Shape</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose Metric (mm/m) or Imperial (inches/feet) for dimensions. Select the profile type: round, square, flat, or hexagonal. The required dimensions fields will update based on this shape.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter Cross-sectional Dimensions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">For round bars, input the outer diameter. For flat rectangular sheets, enter width and thickness. For square or hexagonal bars, enter the width across flats. Standard measurements should match the product specification.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">State Length and Quantity</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter the total length per item (e.g., standard 6-meter or 20-foot bar), then supply how many pieces you are working with. The calculator provides the cumulative total payload in both kilograms and pounds automatically.</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Formulas Used</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><span className="text-amber-500 font-bold w-12 flex-shrink-0">Volume</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Cross-sectional Area × Length</code></div>
                  <div className="flex items-center gap-3 text-sm"><span className="text-amber-500 font-bold w-12 flex-shrink-0">Weight</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Volume × Density</code></div>
                  <div className="flex items-center gap-3 text-sm"><span className="text-amber-500 font-bold w-12 flex-shrink-0">Density</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">7850 kg/m³ or 0.2836 lb/in³</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Steel Density & Application Notes</h2>
              <p className="text-muted-foreground text-sm mb-6">Why density matters and constraints on accuracy:</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Density Assumed</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This tool calculates weight using 7.85 g/cm³ (7850 kg/m³), the international standard for mild and structural steel. You can confidently rely on these estimates for carbon steel varieties like A36.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Steel Grades Variance</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Different alloys change standard steel density slightly. Stainless steels (like 304 or 316 series) generally range up to 8000 kg/m³. Results here will skew slightly lighter than actual for high-chromium or nickel-heavy alloys.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How is the weight of a round steel bar calculated?" a="It uses the formula for cylinder volume: Area (π × radius²) multiplied by length. This volume is then scaled by steel density (7850 kg per cubic meter or 0.2836 lbs per cubic inch)." />
                <FaqItem q="What forms of steel is this calculator accurate for?" a="This application works best for mild steel, structural steel, carbon steel, and rolled steel bars since their densities align strongly with the assumed 7.85 g/cm³. For stainless steel, the weight in reality may be slightly heavier (by 1-3%)." />
                <FaqItem q="Why do I need to enter mm for width but m for length in metric mode?" a="This is an international industrial convention. Cross-sectional profiles are almost always marketed globally using mm specs for high precision, whereas lengthy stock bars or beams are sold by the meter." />
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
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
