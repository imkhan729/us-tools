import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Home, Ruler, Box, Calculator, ArrowUpRight, Umbrella,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function useRoofCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  
  // House Base Dimensions
  const [houseLength, setHouseLength] = useState("");
  const [houseWidth, setHouseWidth] = useState("");
  
  // Overhangs
  const [overhang, setOverhang] = useState("0");
  
  // Pitch
  const [pitch, setPitch] = useState(""); // pitch multiplier or ratio

  const result = useMemo(() => {
    const hl = parseFloat(houseLength) || 0;
    const hw = parseFloat(houseWidth) || 0;
    const oh = parseFloat(overhang) || 0;
    
    // Convert pitch standard (e.g. 4/12 pitch = 4)
    const pValue = parseFloat(pitch) || 0;

    if (hl <= 0 || hw <= 0) return null;

    // Add overhang directly to lengths (x2 for both sides)
    const totalLength = hl + (oh * 2);
    const totalWidth = hw + (oh * 2);
    const flatArea = totalLength * totalWidth;

    let multiplier = 1;
    let pitchDegrees = 0;

    if (pValue > 0) {
      if (unit === "imperial") {
        // Assume x/12 pitch
        // the multiplier = sqrt((x/12)^2 + 1)
        const riseOverRun = pValue / 12;
        multiplier = Math.sqrt(Math.pow(riseOverRun, 2) + 1);
        pitchDegrees = Math.atan(riseOverRun) * (180 / Math.PI);
      } else {
        // Assume input is degrees if metric
        if (pValue < 90) {
          pitchDegrees = pValue;
          multiplier = 1 / Math.cos(pValue * (Math.PI / 180));
        }
      }
    }

    const pitchedArea = flatArea * multiplier;
    // Standard waste for roofing is 10% for gable, 15% for complex
    const areaWithWaste = pitchedArea * 1.10; 
    
    // Roofing squares (imperial) = 100 sq ft
    const squares = unit === "imperial" ? pitchedArea / 100 : 0;

    return {
      flatArea,
      pitchedArea,
      pitchDegrees,
      multiplier,
      areaWithWaste,
      squares
    };
  }, [unit, houseLength, houseWidth, overhang, pitch]);

  return {
    unit, setUnit,
    houseLength, setHouseLength, houseWidth, setHouseWidth,
    overhang, setOverhang,
    pitch, setPitch,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit, pitch }: { result: any; unit: Unit; pitch: string }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "m²";

  const pitchDesc = parseFloat(pitch) > 0 ? ` Factoring in your exact roof pitch angle (${result.pitchDegrees.toFixed(1)}°), the true physical roof surface area extends to ${result.pitchedArea.toFixed(2)} ${areaUnit}.` : " We recommend inputting your roof pitch for an absolutely precise surface area.";
  const wasteText = ` Including a standard 10% cutting waste buffer, you should prepare materials for ${result.areaWithWaste.toFixed(2)} ${areaUnit}.`;
  const squareText = unit === "imperial" && result.squares > 0 ? ` (Approximately ${Math.ceil(result.squares)} roofing squares).` : "";

  const message = `Your flat footprint area including overhangs is ${result.flatArea.toFixed(2)} ${areaUnit}.${pitchDesc}${wasteText}${squareText}`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-cyan-600/5 border border-cyan-600/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-cyan-600/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-cyan-600">
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
  { title: "Room Area Calculator", slug: "room-area-calculator", icon: <Home className="w-5 h-5" />, color: 230, benefit: "Floor & internal maps" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Box className="w-5 h-5" />, color: 38, benefit: "Volume for slab foundations" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <Umbrella className="w-5 h-5" />, color: 320, benefit: "Coverage for exterior walls" },
];

export default function RoofAreaCalculator() {
  const calc = useRoofCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimUnit = calc.unit === "imperial" ? "ft" : "m";
  const areaUnit = calc.unit === "imperial" ? "sq ft" : "m²";

  return (
    <Layout>
      <SEO
        title="Roof Area Calculator – Square Footage & Pitch | US Online Tools"
        description="Calculate total roof area based on pitch, length, and width overhangs. Perfect for estimating shingles, metal sheets, and underlayment requirements."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-600" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-600" strokeWidth={3} />
          <span className="text-foreground">Roof Area Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-cyan-600/15 bg-gradient-to-br from-cyan-600/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Roof Area Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Determine the exact surface area of any gabled, hip, or flat roof. Incorporate pitch multipliers and extended eave overhangs to formulate total shingle and underlayment estimates immediately.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-600/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-cyan-600/20 shadow-lg shadow-cyan-600/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-600 to-blue-500" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Umbrella className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Roof Dimensions Evaluator</p>
                      <p className="text-sm text-muted-foreground">Type base length, add overhang, calculate angled pitch scale.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 190 } as React.CSSProperties}>
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                      <div className="flex rounded-lg overflow-hidden border border-border sm:w-1/2">
                         <button onClick={() => calc.setUnit("metric")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-cyan-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Metric (m / m²)</button>
                        <button onClick={() => calc.setUnit("imperial")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-cyan-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Imperial (ft / sq ft)</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">1. House Base Dimensions</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Base Length ({dimUnit})</label><input type="number" placeholder={calc.unit==="metric"?"12":"40"} className="tool-calc-input w-full" value={calc.houseLength} onChange={e => calc.setHouseLength(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Base Width ({dimUnit})</label><input type="number" placeholder={calc.unit==="metric"?"8":"30"} className="tool-calc-input w-full" value={calc.houseWidth} onChange={e => calc.setHouseWidth(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Eave Overhang ({dimUnit})</label><input type="number" placeholder={calc.unit==="metric"?"0.5":"1.5"} className="tool-calc-input w-full" value={calc.overhang} onChange={e => calc.setOverhang(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">2. Roof Angle / Pitch</span></div>
                      <div className="col-span-full">
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">{calc.unit === "imperial" ? "Pitch Ratio (Rise per 12 inches run, e.g., '4' for 4/12)" : "Pitch Angle (Degrees, e.g., 20)"}</label>
                        <input type="number" placeholder={calc.unit === "imperial" ? "6" : "25"} className="tool-calc-input w-full" value={calc.pitch} onChange={e => calc.setPitch(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                       <div className="tool-calc-result p-4 text-center rounded-xl bg-cyan-600/5 border border-cyan-600/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">True Roof Area (No Waste)</p>
                        <p className="text-4xl font-black text-foreground">{calc.result ? calc.result.pitchedArea.toFixed(2) : "--"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit} total</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-cyan-600/10 border border-cyan-600/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Material Area (+10% Waste)</p>
                        <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400">{calc.result ? calc.result.areaWithWaste.toFixed(2) : "--"}</p>
                         <p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" && calc.result ? `${Math.ceil(calc.result.squares * 1.1)} Squares` : "Recommended Material Limit"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} pitch={calc.pitch} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Ascertaining Complete Roofing Loads</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Roofing calculations differ wildly from internal floor setups because roofs inherently ascend through three-dimensional space. The footprint mapped strictly on the ground wildly underestimates the actual slant driving up the rafter truss framework.</p>
              
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">House Footprint + Total Overhangs</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Roofs extend past standard brick lines defensively guarding windows against rainfall. A house measuring 30ft x 40ft experiencing an 18-inch overhang technically creates a total flat 2D shadow boundary of specifically 33ft x 43ft. The calculator performs this geometric duplication for all sides intrinsically when factoring overhang inputs simultaneously.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Applying the Pitch Multiplier Factor</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">To accurately calculate a slanted surface, the 2D footprint is amplified matching trigonometric angles. A 6/12 pitch (climbing exactly 6 inches vertically across every 12 inches horizontally) structurally scales the base flat area precisely by a mathematical factor of 1.118 constantly. The steeper the angle, the significantly larger the actual roofing surface area rendered.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Industry "Squares" (Imperial Specific)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Most US retail building distributors exclusively sell asphalt shingles grouped into structural "Squares". A single Square identically covers roughly 100 gross sq. ft. So, attempting to clad a massive 2200 sq. ft. target automatically entails purchasing effectively 22 separate heavy squares, typically stacked three localized bundles directly tied into one full square dynamically.</p>
                  </div>
                </li>
              </ol>

            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Complexity & Waste Requirements</h2>
              <p className="text-muted-foreground text-sm mb-6">Waste buffer factors radically differ based on intricate truss models:</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Gable Roof (10% Buffer)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Gable roofs resemble simple triangles operating on parallel planes. With fewer awkward geometric cuts required when terminating the shingles against the exterior ridges, a tight 10% safety buffer comfortably handles standard cutting debris effectively.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Hip & Valley Roof Networks (15%+ Buffer)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Hip architecture folds downward safely on all four outer extremities, whilst deep valleys sharply intersect internally. Navigating complex diagonal angles permanently requires radically snapping heavy shingle corners, accelerating outright waste thresholds deeply past 15% quickly.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I find out my exact roof pitch?" a="Safely ascend an interior attic trapdoor bridging the flat ceiling joists and evaluate the truss directly. Laying heavily a flat 12-inch rigid scale horizontally outwards against the slanted rafter immediately allows a secondary vertical tape measure precisely marking down to note its 'rise'. This instantly provides the standard X/12 mathematical designation legally." />
                <FaqItem q="Do architectural shingles span identically to 3-Tab styles?" a="Whilst dimensional architectural sheets generally occupy heavily similar gross structural scale formats mathematically compared closely against traditional thin 3-Tab shingles, their specific bundle weights differ drastically. Be hyper-aware regarding roof timber load capacities heavily bearing thickened fiberglass weights sequentially." />
                <FaqItem q="Is the underlayment area exactly equivalent?" a="Yes! Raw OSB decking plywood boards explicitly must directly receive unbroken synthetic paper underlayment wraps securely beneath all final slate shingles. They share precisely identically mirrored surface volume demands identically." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-cyan-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
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
