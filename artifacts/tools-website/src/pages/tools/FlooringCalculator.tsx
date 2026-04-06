import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Home, Ruler, Box, Calculator, Layers, LayoutGrid,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function useFlooringCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  
  // Room dimensions
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  
  // Box details
  const [boxCoverage, setBoxCoverage] = useState("");
  const [wastePercentage, setWastePercentage] = useState("10");

  // Optional Cost details
  const [pricePerBox, setPricePerBox] = useState("");

  const result = useMemo(() => {
    const rl = parseFloat(roomLength) || 0;
    const rw = parseFloat(roomWidth) || 0;
    const coverage = parseFloat(boxCoverage) || 0;
    const waste = parseFloat(wastePercentage) || 0;
    const price = parseFloat(pricePerBox) || 0;

    if (rl <= 0 || rw <= 0) return null;

    const netArea = rl * rw;
    const areaWithWaste = netArea * (1 + waste / 100);

    let boxesNeeded = 0;
    let exactBoxesFloat = 0;
    if (coverage > 0) {
      exactBoxesFloat = areaWithWaste / coverage;
      boxesNeeded = Math.ceil(exactBoxesFloat);
    }

    const totalCost = boxesNeeded * price;

    return {
      netArea,
      areaWithWaste,
      exactBoxesFloat,
      boxesNeeded,
      totalCost,
      wasteAmount: areaWithWaste - netArea,
    };
  }, [unit, roomLength, roomWidth, boxCoverage, wastePercentage, pricePerBox]);

  return {
    unit, setUnit,
    roomLength, setRoomLength, roomWidth, setRoomWidth,
    boxCoverage, setBoxCoverage,
    wastePercentage, setWastePercentage,
    pricePerBox, setPricePerBox,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit, price }: { result: any; unit: Unit; price: string }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "m²";
  const costText = parseFloat(price) > 0 ? ` and your material will cost approximately $${result.totalCost.toFixed(2)}` : "";
  const boxText = result.boxesNeeded > 0 ? ` You should order ${result.boxesNeeded} full boxes${costText}.` : "";

  const message = `Your base floor area is ${result.netArea.toFixed(2)} ${areaUnit}. Factoring in your requested waste buffer, you require ${result.areaWithWaste.toFixed(2)} ${areaUnit} of flooring total.${boxText}`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-600/5 border border-orange-600/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-600/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-600">
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
  { title: "Tile Calculator", slug: "tile-calculator", icon: <LayoutGrid className="w-5 h-5" />, color: 24, benefit: "Floor & Wall Ceramic Needs" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Box className="w-5 h-5" />, color: 38, benefit: "Volume & bags for any pour" },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
];

export default function FlooringCalculator() {
  const calc = useFlooringCalc();
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
        title="Flooring Calculator – Laminate, Hardwood & Vinyl Estimates | US Online Tools"
        description="Free online flooring calculator. Estimate the exact number of boxes, square footage, wood or vinyl planks required, factoring in waste percentages securely."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-600" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-600" strokeWidth={3} />
          <span className="text-foreground">Flooring Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-600/15 bg-gradient-to-br from-orange-600/5 via-card to-red-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-600/10 text-orange-700 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Home className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Flooring Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Hardwood, laminate, carpet or vinyl? Get immediate material purchasing estimates, total required square meters or feet, and instantaneous cost approximations using standard supplier coverage metrics.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-600/10 text-orange-700 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-600/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-600/20 shadow-lg shadow-orange-600/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-red-500" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center flex-shrink-0">
                      <LayoutGrid className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Floor Area & Box Evaluator</p>
                      <p className="text-sm text-muted-foreground">Type dimensions, preview total load automatically.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 16 } as React.CSSProperties}>
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                      <div className="flex rounded-lg overflow-hidden border border-border sm:w-1/2">
                         <button onClick={() => calc.setUnit("metric")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-orange-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Metric (m / m²)</button>
                        <button onClick={() => calc.setUnit("imperial")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-orange-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Imperial (ft / sq ft)</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">1. Room Dimensions</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length ({dimUnit})</label><input type="number" placeholder="5" className="tool-calc-input w-full" value={calc.roomLength} onChange={e => calc.setRoomLength(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width ({dimUnit})</label><input type="number" placeholder="4" className="tool-calc-input w-full" value={calc.roomWidth} onChange={e => calc.setRoomWidth(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">2. Material Settings</span></div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Box Coverage ({areaUnit})</label>
                        <input type="number" placeholder={calc.unit==="metric"?"1.5":"20"} className="tool-calc-input w-full" value={calc.boxCoverage} onChange={e => calc.setBoxCoverage(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Waste Allowance (%)</label>
                        <input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.wastePercentage} onChange={e => calc.setWastePercentage(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Price per Box ($)</label>
                        <input type="number" placeholder="45" className="tool-calc-input w-full" value={calc.pricePerBox} onChange={e => calc.setPricePerBox(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                       <div className="tool-calc-result p-4 text-center rounded-xl bg-orange-600/5 border border-orange-600/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Area</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? calc.result.areaWithWaste.toFixed(2) : "--"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit} total</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-orange-600/10 border border-orange-600/20">
                        <Box className="w-6 h-6 text-orange-600 mx-auto mb-1 opacity-50" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Boxes to Buy</p>
                        <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{calc.result?.boxesNeeded ?? "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-green-500/5 border border-green-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Cost</p>
                        <p className="text-3xl font-black text-green-600 dark:text-green-400">{calc.result && calc.result.totalCost > 0 ? `$${calc.result.totalCost.toFixed(2)}` : "--"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} price={calc.pricePerBox} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Master Your Flooring Measurements</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Regardless of whether you are securing pure hardwood timber, snap-and-click LVP (Luxury Vinyl Plank), heavy rolled carpet, or synthetic laminate boards — accurately predicting room scale completely prevents nightmare scenarios where your lot stock fully extinguishes a few meters away from completion.</p>
              
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-700 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Evaluating Gross Dimensions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Most simple rooms adhere directly to rectangular bounds. A 10ft wide and 12ft long dimension returns exactly 120 sq ft. This forms the indisputable geometric base. Do not deduct the central spaces for non-fixed furniture, always assume an empty slate underlying the room surface.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-700 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Applying Strict Waste Percentages</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">It is impossible to finish a floor without cutting end boards to flush alignment against drywall lines. As corners build and boards are cut identically offset at opposing walls to maintain visual structural stagger, the waste pieces often total 10%. Diagonal alignment typically demands 15% due to angled snapping.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-700 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Box Mapping</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Unlike bulk paint or poured concrete, floors aren't sold fractionally. They are tightly boxed into predetermined total coverage limits, such as exactly 20.35 sq. ft. per flat laminate case. The mathematical total must universally be rounded upwards to the nearest absolute integer unit box.</p>
                  </div>
                </li>
              </ol>

            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Cost & Extraneous Applications Evaluated</h2>
              <p className="text-muted-foreground text-sm mb-6">What lies beyond raw materials when undertaking a domestic floor remodelling?</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Underlayment / Foam Barriers</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Most floating floor models securely demand heavy protective acoustic / vapor barriers directly rolled atop the concrete or sub-surface. The underlay volume generally tracks explicitly 1:1 against the Base Box Coverage calculation, completely devoid of the 10% cutting waste threshold.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Skirting Boards & Perimeter Trim</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Calculating trim length requires measuring perimeter lines, omitting door spaces entirely. Instead of surface Area formula, utilize purely Length + Width + Length + Width and securely minus any door widths.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Are extra boxes returnable if unopened?" a="Almost universally, provided they were structurally unaltered with factory seals heavily intact. Large DIY infrastructure megastores easily restock standard identical product barcodes inside standard 30-90 day boundaries." />
                <FaqItem q="Why must hardwood floor be acclimated?" a="Natural timber explicitly swells with ambient moisture and firmly retracts in drier climates. Acclimatizing stacked boxes unsealed directly inside the target remodelled bedroom for firmly 48-72 hours forces structural alignment identically matching ongoing thermal variables, permanently halting potential future board cupping or bucking damages." />
                <FaqItem q="Is the waste identical for carpets?" a="Roll-based carpets operate entirely outside boxed principles. Standard carpeting utilizes strict 12-foot rigid standard widths globally. If a room is exclusively 14 ft width, you generally cannot paste a minor two-foot strip aesthetically. Seamless carpet measuring relies directly on massive single directional drops which inherently induces staggeringly high unseen waste." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
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
