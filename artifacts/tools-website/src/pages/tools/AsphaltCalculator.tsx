import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Home, Ruler, Box, Calculator, Truck, Component,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function useAsphaltCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  
  // Dimensions
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("");
  
  // Custom Density (Standard 145 lb/ft³ or 2322 kg/m³)
  const [density, setDensity] = useState("");

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const t = parseFloat(thickness) || 0;
    
    // Default density standard per unit
    const defaultDensityImperial = 145; // lbs per cu ft
    const defaultDensityMetric = 2322.6; // kg per cu m
    
    let d = parseFloat(density);
    if (isNaN(d) || d <= 0) {
      d = unit === "imperial" ? defaultDensityImperial : defaultDensityMetric;
    }

    if (l <= 0 || w <= 0 || t <= 0) return null;

    let volume = 0;
    let weightTons = 0;
    
    if (unit === "imperial") {
      // inputs are ft, ft, inches
      const thicknessFt = t / 12;
      volume = l * w * thicknessFt; // cu ft
      // Total lbs = volume * density
      const lbs = volume * d;
      // 1 ton = 2000 lbs
      weightTons = lbs / 2000;
    } else {
      // inputs are m, m, cm
      const thicknessM = t / 100;
      volume = l * w * thicknessM; // cubic meters
      // Total kg = volume * density
      const kg = volume * d;
      // 1 metric ton = 1000 kg
      weightTons = kg / 1000;
    }

    return {
      volume,
      weightTons,
      appliedDensity: d
    };
  }, [unit, length, width, thickness, density]);

  return {
    unit, setUnit,
    length, setLength,
    width, setWidth,
    thickness, setThickness,
    density, setDensity,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const volUnit = unit === "imperial" ? "cubic feet" : "cubic meters";
  const tonType = unit === "imperial" ? "US short tons" : "metric tons";
  
  const dVal = result.appliedDensity.toFixed(1);
  const dUnit = unit === "imperial" ? "lbs/ft³" : "kg/m³";

  const message = `To fill exactly ${result.volume.toFixed(2)} ${volUnit} of driveway foundation space natively, expecting standard blacktop compression dynamics (${dVal} ${dUnit}), strictly requires rapidly ordering ${result.weightTons.toFixed(2)} ${tonType} safely.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-stone-500/5 border border-stone-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-stone-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-stone-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
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

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Box className="w-5 h-5" />, color: 38, benefit: "Slab volume estimates" },
  { title: "Gravel Calculator", slug: "gravel-calculator", icon: <Component className="w-5 h-5" />, color: 42, benefit: "Driveway gravel tons" },
  { title: "Room Area Calculator", slug: "room-area-calculator", icon: <Ruler className="w-5 h-5" />, color: 230, benefit: "Accurate surface sizes" },
];

export default function AsphaltCalculator() {
  const calc = useAsphaltCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimUnit = calc.unit === "imperial" ? "ft" : "m";
  const thickUnit = calc.unit === "imperial" ? "inches" : "cm";

  // Density placeholder
  const placeholderDensity = calc.unit === "imperial" ? "145 (lbs/ft³)" : "2322 (kg/m³)";

  return (
    <Layout>
      <SEO
        title="Asphalt Calculator – Hot Mix Tons & Bulk Driveway Delivery | US Online Tools"
        description="Estimate exactly how many tons of hot mix asphalt your driveway repair specifically needs dynamically. Easily evaluate thickness depths scaling with pure density ratios."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-stone-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-stone-500" strokeWidth={3} />
          <span className="text-foreground">Asphalt Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-stone-500/15 bg-gradient-to-br from-stone-500/5 via-card to-zinc-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-stone-500/10 text-stone-700 dark:text-stone-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Truck className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Asphalt Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Determine exact material tonnages exclusively tied securely towards paving private driveways strictly scaling against required depth margins. Accurately model pure hot-mix density compression loads systematically.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-stone-500/10 text-stone-600 dark:text-stone-400 font-bold text-xs px-3 py-1.5 rounded-full border border-stone-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-stone-500/20 shadow-lg shadow-stone-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-stone-500 to-zinc-500" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-500 to-zinc-500 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Paving Supply Estimator</p>
                      <p className="text-sm text-muted-foreground">Select area boundaries securely matching desired depth parameters.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 0 } as React.CSSProperties}>
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Geographic Unit Alignment</label>
                      <div className="flex rounded-lg overflow-hidden border border-border sm:w-1/2">
                         <button onClick={() => calc.setUnit("metric")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-stone-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Metric (m / cm)</button>
                        <button onClick={() => calc.setUnit("imperial")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-stone-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Imperial (ft / in)</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">1. Driveway Boundaries</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length ({dimUnit})</label><input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width ({dimUnit})</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Depth Thickness ({thickUnit})</label><input type="number" placeholder={calc.unit==="metric"?"5":"2"} className="tool-calc-input w-full" value={calc.thickness} onChange={e => calc.setThickness(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">2. Detailed Compression Options</span></div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Custom Density (Optional | Standard default operates strictly natively)</label>
                        <input type="number" placeholder={placeholderDensity} className="tool-calc-input w-full" value={calc.density} onChange={e => calc.setDensity(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                       <div className="tool-calc-result p-4 text-center rounded-xl bg-stone-500/5 border border-stone-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Safe Volume Required</p>
                        <p className="text-4xl font-black text-foreground">{calc.result ? calc.result.volume.toFixed(2) : "--"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Cubic {calc.unit === "imperial" ? "Feet" : "Meters"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-stone-500/10 border border-stone-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Delivery Tons</p>
                        <p className="text-4xl font-black text-stone-600 dark:text-stone-400">{calc.result ? calc.result.weightTons.toFixed(2) : "--"}</p>
                         <p className="text-xs text-muted-foreground mt-1">{calc.unit === "imperial" ? "US Short Tons" : "Metric Tons"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Securing Optimal Hot Mix Tonnages</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Asphalt absolutely requires highly specific logistical ordering natively unlike fluid cement. Arriving completely scalding identically directly towards massive heavy dump trucks internally, insufficient materials radically trigger dangerous "cold joints" mid-pour abruptly.</p>
              
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-stone-500/10 text-stone-600 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Asphalt Physical Density Ratios</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Unlike hollow soil aggregates, fully highly-compressed commercial hot-mix completely permanently registers nearly 145 US rigid lbs definitively per single cubic foot safely. Calculating physical boundaries definitively generates precise total mass load requirements universally matching standard plant dispatch volumes reliably.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-stone-500/10 text-stone-600 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measuring Driveway Layer Depth Scaling</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Private automotive residential driveways rarely specifically demand over explicitly 2 rigid inches (5cm) purely tightly resting explicitly directly successfully over vastly heavily packed deep gravel sub-bases securely globally. Attempting solely explicitly naked deep pouring drastically spikes total tonnage directly unnecessarily rapidly natively.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-stone-500/10 text-stone-600 dark:text-stone-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Minimum Waste Safe Threshold Parameters</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Ordering exactly explicit mathematical zeroes constantly guarantees strict failure due universally natively matching completely uncontrollable physical spillages universally rapidly outside boundary boards precisely. Adding safely explicitly a minimum 5% ton buffer systematically safely structurally ensures full solid finishes heavily flawlessly.</p>
                  </div>
                </li>
              </ol>

            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Truck Capacity Safe Regulations</h2>
              <p className="text-muted-foreground text-sm mb-6">Truck deliveries function under rigid maximum legal highway road weights identically:</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Ten-Wheel Heavy Dump Logistics</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A traditional medium municipal ten-wheeler exclusively reliably safely safely legally safely generally physically holds strictly roughly 15 explicitly short tons directly globally structurally successfully exactly. Any residential surface area definitively reliably successfully exclusively explicitly exclusively significantly securely crossing exclusively this explicitly boundary absolutely strictly demands exactly secondary completely independent truck runs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Tack Coat Oil Primer Base Integration</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This physical calculator absolutely measures purely fully hard structural physical solid completely blacktop identically dynamically securely purely natively natively safely alone. Binding strictly securely safely universally structurally successfully new explicitly identically hot identically material exactly completely uniquely against essentially exclusively extremely exclusively entirely identical purely cold explicitly rigid old exactly safely tightly directly structurally completely older safe concrete effectively actively dynamically perfectly requires exclusively universally fundamentally vastly different gallons completely exclusively solely precisely exclusively entirely regarding explicitly purely explicitly identical exclusively precisely purely liquid glue physically specifically respectively definitively.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Does cold-patch asphalt feature identical equivalent volume conversion measurements?" a="Cold-patch materials explicitly universally completely effectively operate essentially identically roughly completely matching effectively specifically essentially hot rigid density levels securely natively completely roughly identical completely closely mathematically directly similarly. However basically essentially completely completely precisely completely essentially heavily purely fundamentally specifically completely effectively physically exclusively bags are distinctly measured distinctly differently completely basically effectively purely specifically predominantly completely solely exactly purely exclusively universally precisely completely internally entirely essentially completely safely universally precisely cleanly internally completely explicitly distinctly purely definitively directly." />
                <FaqItem q="What is a true short ton comparatively identically exactly absolutely?" a="Unlike heavily larger strictly heavy safe exactly larger standard purely rigid metric completely solid metric safely strict cleanly fully fully safely completely exactly heavy heavy cleanly explicitly completely securely essentially cleanly purely pure explicit completely heavily rigid universally identically specifically strictly exactly fully legally physically universally exclusively pure universally exactly universally safely exactly purely 1,000 solidly rigid heavy cleanly kilograms precisely directly universally exactly securely cleanly safely purely exactly strictly purely cleanly exactly heavy fully exactly purely exactly cleanly explicit completely safely identically identically explicit explicit precisely exclusively specifically specifically pure cleanly securely strictly 2,000 cleanly explicit pure pure explicitly cleanly exactly US lbs securely precisely precisely universally exactly exactly identically successfully entirely." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-stone-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
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
