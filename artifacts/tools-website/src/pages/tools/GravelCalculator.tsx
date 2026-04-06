import { useMemo, useState } from "react";
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
  Boxes,
  Calculator,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type Unit = "imperial" | "metric";
type Shape = "rectangular" | "circular";

const DEFAULT_DENSITY = {
  imperial: 105,
  metric: 1680,
} as const;

const RELATED_TOOLS = [
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, color: 38, benefit: "Volume and mix planning" },
  { title: "Asphalt Calculator", slug: "asphalt-calculator", icon: <Truck className="w-5 h-5" />, color: 28, benefit: "Paving tonnage estimates" },
  { title: "Room Area Calculator", slug: "room-area-calculator", icon: <Ruler className="w-5 h-5" />, color: 230, benefit: "Measure rectangular spaces" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Convert cubic units quickly" },
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
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useGravelCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [shape, setShape] = useState<Shape>("rectangular");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [diameter, setDiameter] = useState("");
  const [depth, setDepth] = useState("");
  const [density, setDensity] = useState("");
  const [includeWaste, setIncludeWaste] = useState(true);

  const result = useMemo(() => {
    const parsedDepth = parseFloat(depth) || 0;
    const densityValue = parseFloat(density) > 0
      ? parseFloat(density)
      : unit === "imperial"
        ? DEFAULT_DENSITY.imperial
        : DEFAULT_DENSITY.metric;

    if (parsedDepth <= 0) return null;

    if (unit === "imperial") {
      const depthFeet = parsedDepth / 12;
      let areaSqFt = 0;

      if (shape === "rectangular") {
        const parsedLength = parseFloat(length) || 0;
        const parsedWidth = parseFloat(width) || 0;
        if (parsedLength <= 0 || parsedWidth <= 0) return null;
        areaSqFt = parsedLength * parsedWidth;
      } else {
        const parsedDiameter = parseFloat(diameter) || 0;
        if (parsedDiameter <= 0) return null;
        const radius = parsedDiameter / 2;
        areaSqFt = Math.PI * radius * radius;
      }

      const wasteFactor = includeWaste ? 1.1 : 1;
      const cubicFeet = areaSqFt * depthFeet * wasteFactor;
      const cubicYards = cubicFeet / 27;
      const cubicMeters = cubicFeet * 0.0283168;
      const shortTons = (cubicFeet * densityValue) / 2000;
      const bulkBags = Math.ceil(shortTons);

      return {
        area: areaSqFt,
        cubicFeet,
        cubicYards,
        cubicMeters,
        tons: shortTons,
        bulkBags,
        densityUsed: densityValue,
      };
    }

    const depthMeters = parsedDepth / 100;
    let areaSqM = 0;

    if (shape === "rectangular") {
      const parsedLength = parseFloat(length) || 0;
      const parsedWidth = parseFloat(width) || 0;
      if (parsedLength <= 0 || parsedWidth <= 0) return null;
      areaSqM = parsedLength * parsedWidth;
    } else {
      const parsedDiameter = parseFloat(diameter) || 0;
      if (parsedDiameter <= 0) return null;
      const radius = parsedDiameter / 2;
      areaSqM = Math.PI * radius * radius;
    }

    const wasteFactor = includeWaste ? 1.1 : 1;
    const cubicMeters = areaSqM * depthMeters * wasteFactor;
    const cubicFeet = cubicMeters * 35.3147;
    const cubicYards = cubicMeters * 1.30795;
    const metricTons = (cubicMeters * densityValue) / 1000;
    const bulkBags = Math.ceil(metricTons);

    return {
      area: areaSqM,
      cubicFeet,
      cubicYards,
      cubicMeters,
      tons: metricTons,
      bulkBags,
      densityUsed: densityValue,
    };
  }, [unit, shape, length, width, diameter, depth, density, includeWaste]);

  return {
    unit,
    setUnit,
    shape,
    setShape,
    length,
    setLength,
    width,
    setWidth,
    diameter,
    setDiameter,
    depth,
    setDepth,
    density,
    setDensity,
    includeWaste,
    setIncludeWaste,
    result,
  };
}

function ResultInsight({ result, unit, includeWaste }: { result: ReturnType<typeof useGravelCalc>["result"]; unit: Unit; includeWaste: boolean }) {
  if (!result) return null;

  const tonsLabel = unit === "imperial" ? "short tons" : "metric tons";
  const densityUnit = unit === "imperial" ? "lb/ft^3" : "kg/m^3";
  const areaLabel = unit === "imperial" ? "sq ft" : "m^2";
  const volumeLabel = unit === "imperial" ? `${result.cubicYards.toFixed(2)} cubic yards` : `${result.cubicMeters.toFixed(2)} cubic meters`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your project covers {result.area.toFixed(2)} {areaLabel} and needs about {volumeLabel} of gravel, which is roughly {result.tons.toFixed(2)} {tonsLabel} at {result.densityUsed.toFixed(0)} {densityUnit}.{includeWaste ? " A 10% waste factor is already included for settling, compaction, and spillage." : " Waste is not included, so order a little extra if your supplier recommends it."}
        </p>
      </div>
    </motion.div>
  );
}

export default function GravelCalculator() {
  const calc = useGravelCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (value: number | null, digits = 2) => {
    if (value === null) return "--";
    return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
  };

  return (
    <Layout>
      <SEO
        title="Gravel Calculator - Estimate Gravel Volume and Tons"
        description="Free gravel calculator for driveways, paths, beds, and drainage projects. Estimate cubic yards, cubic meters, tons, and bulk bags with rectangular or circular area inputs."
        canonical="https://usonlinetools.com/construction/gravel-calculator"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Gravel Calculator",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          description: "Estimate gravel needed by volume and weight for driveways, landscaping, drainage, and DIY projects.",
          url: "https://usonlinetools.com/construction/gravel-calculator",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Gravel Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-yellow-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Gravel Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate how much gravel you need for a driveway, path, drainage trench, or landscaping base. Enter your dimensions, choose a shape, and get volume plus weight in one clean result.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Boxes className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bulk Material Estimator</p>
                      <p className="text-sm text-muted-foreground">Works for rectangular and circular gravel areas.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 38 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Shape</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setShape("rectangular")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "rectangular" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Rectangular</button>
                          <button onClick={() => calc.setShape("circular")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.shape === "circular" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Circular</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                      </div>
                    </div>

                    {calc.shape === "rectangular" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Length ({calc.unit === "imperial" ? "ft" : "m"})</label>
                          <input type="number" placeholder={calc.unit === "imperial" ? "20" : "6"} className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Width ({calc.unit === "imperial" ? "ft" : "m"})</label>
                          <input type="number" placeholder={calc.unit === "imperial" ? "10" : "3"} className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Depth ({calc.unit === "imperial" ? "in" : "cm"})</label>
                          <input type="number" placeholder={calc.unit === "imperial" ? "4" : "10"} className="tool-calc-input w-full" value={calc.depth} onChange={e => calc.setDepth(e.target.value)} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Diameter ({calc.unit === "imperial" ? "ft" : "m"})</label>
                          <input type="number" placeholder={calc.unit === "imperial" ? "12" : "3.5"} className="tool-calc-input w-full" value={calc.diameter} onChange={e => calc.setDiameter(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Depth ({calc.unit === "imperial" ? "in" : "cm"})</label>
                          <input type="number" placeholder={calc.unit === "imperial" ? "3" : "8"} className="tool-calc-input w-full" value={calc.depth} onChange={e => calc.setDepth(e.target.value)} />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Density ({calc.unit === "imperial" ? "lb/ft^3" : "kg/m^3"})</label>
                        <input
                          type="number"
                          placeholder={String(calc.unit === "imperial" ? DEFAULT_DENSITY.imperial : DEFAULT_DENSITY.metric)}
                          className="tool-calc-input w-full"
                          value={calc.density}
                          onChange={e => calc.setDensity(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave blank to use a typical bulk gravel density.</p>
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-border bg-background px-4 py-3 mt-5 sm:mt-0">
                        <input type="checkbox" checked={calc.includeWaste} onChange={e => calc.setIncludeWaste(e.target.checked)} className="w-4 h-4 accent-amber-500 rounded" />
                        <span className="text-sm font-semibold text-foreground">Include 10% waste</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cubic Yards</p>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{fmt(calc.result?.cubicYards ?? null)}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cubic Meters</p>
                        <p className="text-2xl font-black text-foreground">{fmt(calc.result?.cubicMeters ?? null)}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Tons</p>
                        <p className="text-2xl font-black text-foreground">{fmt(calc.result?.tons ?? null)}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Bulk Bags</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.bulkBags : "--"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} includeWaste={calc.includeWaste} />
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Gravel Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Gravel is usually ordered by volume or weight, but suppliers often quote both. This calculator bridges that gap so you can move from site measurements to an order amount without doing manual conversions.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose the shape that matches your project</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the rectangular option for driveways, walkways, trenches, and shed bases. Use the circular option for tree rings, round pads, or decorative gravel beds.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter area dimensions and finished depth</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Depth matters more than many people expect. A path at 2 inches deep needs far less material than a driveway base at 4 to 6 inches, even with the same surface area.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Adjust density only if your supplier gives a specific figure</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The default density works for common bulk gravel. If your supplier provides a product-specific density for pea gravel, crushed stone, limestone, or drainage aggregate, enter that value for a tighter estimate.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Formula</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-amber-500 font-bold w-20 flex-shrink-0">Rectangle</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Volume = Length × Width × Depth</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-500 font-bold w-20 flex-shrink-0">Circle</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Volume = π × Radius² × Depth</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-500 font-bold w-20 flex-shrink-0">Weight</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Tons = Volume × Bulk Density</code>
                  </div>
                </div>
              </div>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your Gravel Estimate</h2>
              <p className="text-muted-foreground text-sm mb-6">The same area can produce very different order quantities depending on depth, compaction, and material type.</p>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Decorative top layer projects</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Decorative gravel beds and garden borders often use shallow depths, commonly around 1.5 to 2 inches. In that range, the cubic-yard result is usually more important than the tonnage result.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Base layers and driveways</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Base layers often run 4 inches or deeper, which increases both volume and weight quickly. For these projects, suppliers frequently quote by ton, so the tonnage result becomes the most useful output.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Why waste and compaction matter</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Gravel settles, spreads, and compacts during installation. Adding a modest waste factor usually avoids the more expensive problem of running short halfway through a project.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Project</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Dimensions</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Depth</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Garden path</td>
                      <td className="px-4 py-3 font-mono text-foreground">20 ft × 3 ft</td>
                      <td className="px-4 py-3 font-mono text-foreground">2 in</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">0.45 yd³</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Driveway base</td>
                      <td className="px-4 py-3 font-mono text-foreground">30 ft × 12 ft</td>
                      <td className="px-4 py-3 font-mono text-foreground">4 in</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">4.89 yd³</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Round tree ring</td>
                      <td className="px-4 py-3 font-mono text-foreground">10 ft diameter</td>
                      <td className="px-4 py-3 font-mono text-foreground">3 in</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">0.89 yd³</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Drainage trench</td>
                      <td className="px-4 py-3 font-mono text-foreground">15 m × 0.4 m</td>
                      <td className="px-4 py-3 font-mono text-foreground">15 cm</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">0.99 m³</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 - driveway planning:</strong> A driveway base usually needs both volume and weight because many suppliers sell crushed stone by the ton. A calculator that only shows cubic yards leaves you doing extra math before you can place an order.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 - landscaping work:</strong> Decorative pea gravel is often purchased for visual coverage, but the final look still depends on finished depth. Estimating only by surface area can leave the stone layer too thin.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 - drainage trenches:</strong> Drainage gravel is commonly installed in narrow, deep sections. In those cases, depth drives the estimate more than width, so small measurement errors matter.
                </p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Gravel Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It answers the practical question suppliers ask.</strong> Many gravel pages stop at cubic volume, but yards and meters are not always enough. This tool also estimates weight so you can translate site measurements into a realistic order quantity.
                </p>
                <p>
                  <strong className="text-foreground">The inputs are scoped for real projects.</strong> Rectangular and circular layouts cover most driveway, bed, and trench jobs without overcomplicating the interface. That keeps the page faster to use on both desktop and mobile.
                </p>
                <p>
                  <strong className="text-foreground">The content is written to help a person finish a job.</strong> Instead of thin SEO filler, the page explains when volume matters, when tonnage matters, and why density changes the result.
                </p>
                <p>
                  <strong className="text-foreground">Your measurements stay local.</strong> The calculations happen in the browser, so dimensions and order estimates are not sent anywhere by the tool.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Gravel density varies by stone type, moisture, and compaction. Use the default value for a quick estimate, but use your supplier's density if you have it and verify final order amounts for large deliveries.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How deep should a gravel driveway be?" a="That depends on the project and soil conditions, but many residential gravel driveways use a deeper compacted base than a simple decorative path. Always check your local install standard or contractor recommendation for finished depth." />
                <FaqItem q="Why does gravel get sold by both cubic yard and ton?" a="Volume describes how much space the material fills. Weight reflects density, which matters for transport and supplier pricing. Some yards sell decorative material by volume, while base stone is often quoted by ton." />
                <FaqItem q="What density should I use for crushed stone?" a="If your supplier gives a density, use that value. If not, the built-in default gives a solid estimate for common bulk gravel and crushed stone. It is intended as a practical average, not a lab measurement." />
                <FaqItem q="Should I include waste?" a="Usually yes. Gravel spreads, settles, and can compact below the intended finish level. Adding a small waste factor is often cheaper than paying for a second delivery." />
                <FaqItem q="Can I use this for pea gravel, limestone, or drainage rock?" a="Yes. The formula is the same, but the density can change by material. If you know the product density, enter it in the optional density field for a closer estimate." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Construction Calculators</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Keep planning with concrete, asphalt, area, and other material calculators built for real project estimates.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
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

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with contractors, landscapers, and DIY builders.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    ["Calculator", "#calculator"],
                    ["How to Use", "#how-to-use"],
                    ["Result Interpretation", "#result-interpretation"],
                    ["Quick Examples", "#quick-examples"],
                    ["Why Choose This", "#why-choose-this"],
                    ["FAQ", "#faq"],
                  ].map(([label, href]) => (
                    <a key={label} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors">
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
