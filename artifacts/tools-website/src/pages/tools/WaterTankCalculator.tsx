import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Home, Ruler, Box, Calculator, Droplets, Droplet,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";
type TankShape = "cylinder" | "rectangular";

function useWaterTankCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [shape, setShape] = useState<TankShape>("cylinder");
  
  // Dimensions
  const [diameter, setDiameter] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const result = useMemo(() => {
    let volumeCubic = 0;

    const h = parseFloat(height) || 0;
    
    if (shape === "cylinder") {
      const d = parseFloat(diameter) || 0;
      if (h <= 0 || d <= 0) return null;
      const radius = d / 2;
      volumeCubic = Math.PI * Math.pow(radius, 2) * h;
    } else {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      if (h <= 0 || l <= 0 || w <= 0) return null;
      volumeCubic = l * w * h;
    }

    // Determine capacities
    let liters = 0;
    let gallonsUS = 0;
    let gallonsUK = 0;

    if (unit === "metric") {
      // Input is in meters. 1 cubic meter = 1000 liters
      liters = volumeCubic * 1000;
      gallonsUS = liters / 3.78541;
      gallonsUK = liters / 4.54609;
    } else {
      // Input is in feet. 1 cubic foot = 28.3168 liters
      liters = volumeCubic * 28.3168;
      gallonsUS = volumeCubic * 7.48052;
      gallonsUK = liters / 4.54609; // or volumeCubic * 6.22883
    }

    return {
      volumeCubic,
      liters,
      gallonsUS,
      gallonsUK
    };
  }, [unit, shape, diameter, length, width, height]);

  return {
    unit, setUnit,
    shape, setShape,
    diameter, setDiameter,
    length, setLength,
    width, setWidth,
    height, setHeight,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const cubicUnit = unit === "imperial" ? "cu ft" : "m³";
  
  const message = `Your physical tank structurally displaces ${result.volumeCubic.toFixed(2)} ${cubicUnit}. Filled completely to the absolute brim, it holds precisely ${result.liters.toFixed(0)} liters or ${result.gallonsUS.toFixed(1)} US fluid gallons securely.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Box className="w-5 h-5" />, color: 38, benefit: "Volume in cubic yards" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Calculator className="w-5 h-5" />, color: 172, benefit: "Liters to gallons exactly" },
];

export default function WaterTankCalculator() {
  const calc = useWaterTankCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimUnit = calc.unit === "imperial" ? "ft" : "m";

  return (
    <Layout>
      <SEO
        title="Water Tank Capacity Calculator – Liters & Gallons | US Online Tools"
        description="Calculate water tank dimensions instantly. Convert physical tank lengths or cylinder radius cleanly into total gross water capacity, Liters, and fluid UK/US Gallons."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Water Tank Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Droplet className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Water Tank Capacity Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Evaluate liquid retention storage dimensions mathematically. Directly convert raw cylindrical silo spans or huge rectangular concrete foundation reservoirs into exact total US gallons and usable metric liters natively.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Volumetric Liquid Analyzer</p>
                      <p className="text-sm text-muted-foreground">Select structure geometry, input metric ranges.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 210 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Tank Physical Shape</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setShape("cylinder")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "cylinder" ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Cylindrical (Round)</button>
                          <button onClick={() => calc.setShape("rectangular")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "rectangular" ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Rectangular Base</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Measurement System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric (Meters)</button>
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial (Feet)</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">Internal Dimensions</span></div>
                      
                      {calc.shape === "cylinder" ? (
                        <>
                          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Inner Diameter ({dimUnit})</label><input type="number" placeholder="2.5" className="tool-calc-input w-full" value={calc.diameter} onChange={e => calc.setDiameter(e.target.value)} /></div>
                          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Maximum Height ({dimUnit})</label><input type="number" placeholder="4" className="tool-calc-input w-full" value={calc.height} onChange={e => calc.setHeight(e.target.value)} /></div>
                        </>
                      ) : (
                        <>
                          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Inner Length ({dimUnit})</label><input type="number" placeholder="5" className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} /></div>
                          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Inner Width ({dimUnit})</label><input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} /></div>
                          <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Maximum Height ({dimUnit})</label><input type="number" placeholder="2" className="tool-calc-input w-full" value={calc.height} onChange={e => calc.setHeight(e.target.value)} /></div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                       <div className="tool-calc-result p-4 text-center rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Global Liters</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? Math.round(calc.result.liters).toLocaleString() : "--"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Liters</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">US Gallon Scope</p>
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{calc.result ? Math.round(calc.result.gallonsUS).toLocaleString() : "--"}</p>
                        <p className="text-xs text-muted-foreground mt-1">US Gal</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">UK Imperial Scope</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? Math.round(calc.result.gallonsUK).toLocaleString() : "--"}</p>
                        <p className="text-xs text-muted-foreground mt-1">UK Imperial Gal</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Analyzing Rigid Mass Liquid Displacement</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Securing vast reservoirs of internal water structurally demands perfect material strength factoring massively against static water pressure pushing horizontally against container bulkheads. Before committing to massive rainwater silos, mathematically predicting gross volumes is scientifically vital.</p>
              
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Defining Perfect Inner Diameter Parameters</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Unlike hollow thin-shell glass, structural dense concrete or thick polyethylene storage units dramatically minimize internal water space versus outer radius footprints. Never measure the external shell casing. Always securely run tape physically stretched explicitly against pure absolute internal walls to ascertain pure tank volume reliably.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Cubic Conversion</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">1 Cubic Meter (1m x 1m x 1m geometric grid) explicitly houses precisely 1,000 liquid liters globally. Thus an underground 5-meter deep square pool rapidly captures thousands directly upon minor dimensional expansion curves.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Differentiating US vs UK Gallon Metrics</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Purchasing foreign equipment frequently conflates 'Gallon' parameters disastrously. A standard US isolated Gallon specifically equals merely 3.78 Liters tightly, whilst the traditional overarching UK Imperial Gallon spans vastly wider at absolutely 4.54 metric Liters respectfully.</p>
                  </div>
                </li>
              </ol>

            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Aquifer Safety Constraints</h2>
              <p className="text-muted-foreground text-sm mb-6">Crucial safety parameters applied to raw tank capacities:</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Expansion Overfill Buffers</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Water undeniably shrinks and expands depending fundamentally upon shifting freezing seasonal variances. You specifically never practically operate a commercial tank filled forcefully 100% touching the uppermost roof barrier seals due inherently to burst hazards; leaving explicitly a dedicated 5% empty upper threshold is architecturally necessary.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Dead Liquid Thresholds at Evacuation</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Pump intake valves actively situated inches high heavily away directly from settling debris floor silt permanently fail to drain physical absolute zeroes. Out of a listed 200-gallon maximum threshold footprint, truly only 190 gallons safely circulates back reliably outside.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How profoundly heavy is a filled water tank?" a="Raw physical water weighs identically essentially 1 metric straight Kilogram precisely identically aligned universally per localized individual Liter explicitly. A relatively modest 1,500 Liter tank fundamentally equates identically therefore against supporting literally 1,500 kg forcefully." />
                <FaqItem q="Why are cylindrical standard silo silos dominant physically?" a="Rigid circular hoops inherently securely bind shifting pressure pushing outwards universally identically horizontally, entirely neutralizing sharp 90-degree corner wall blowouts explicitly. Round shapes vastly minimize exterior panel material physically shielding identically high internal cubic capacities." />
                <FaqItem q="Can I easily convert US Gallons backwards directly?" a="You simply identically safely multiply explicit raw US fluid Gallons natively exactly tightly by firmly rigid standard 3.7854 constantly natively to absolutely yield true metric Liter volumes directly invariably." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
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
