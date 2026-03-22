import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  Ruler, Box, Circle, ToggleLeft,
  BarChart3, Percent, Heart,
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
        // column or tube (cylinder)
        const diaFt = parseFloat(diameterFt) || 0;
        const diaIn = parseFloat(diameterIn) || 0;
        const diameter = diaFt + diaIn / 12;
        if (diameter <= 0 || depthTotal <= 0) return null;
        const radius = diameter / 2;
        cubicFeet = Math.PI * radius * radius * depthTotal;
      }
    } else {
      // metric
      const depth = parseFloat(depthM) || 0;

      if (shape === "slab") {
        const length = parseFloat(lengthM) || 0;
        const width = parseFloat(widthM) || 0;
        if (length <= 0 || width <= 0 || depth <= 0) return null;
        cubicFeet = length * width * depth * 35.3147; // cubic meters to cubic feet
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

  const message = `You need approximately ${fmt(result.cubicYards)} cubic yards (${fmt(result.cubicFeet)} cu ft) of concrete${result.wasteApplied ? " including a 10% waste factor" : ""}. That's about ${result.bags60lb} pre-mixed 60lb bags or ${result.bags80lb} pre-mixed 80lb bags. For larger projects, ordering ready-mix concrete by the cubic yard is usually more cost-effective.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
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

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Salary Calculator", slug: "salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 152 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 217 },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 25 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 45 },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Heart className="w-5 h-5" />, color: 340 },
  { title: "Tip Calculator", slug: "tip-calculator", icon: <Calculator className="w-5 h-5" />, color: 265 },
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
        title="Concrete Calculator - Free Online Tool | How Much Concrete Do I Need?"
        description="Free online concrete calculator. Calculate cubic yards, cubic feet, and number of bags needed for slabs, columns, and tubes. Instant results with waste factor, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction & DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Concrete Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Box className="w-3.5 h-3.5" />
                Construction & DIY
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Concrete Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate exactly how much concrete you need for your project. Get volume in cubic yards, cubic feet, and cubic meters, plus the number of pre-mixed bags required — free, instant, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter your dimensions below — results update as you type. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 25 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Concrete Volume Calculator</h3>
                </div>

                {/* Unit Toggle & Shape Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                    <div className="flex rounded-lg overflow-hidden border border-border">
                      <button
                        onClick={() => calc.setUnit("imperial")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        Imperial (ft)
                      </button>
                      <button
                        onClick={() => calc.setUnit("metric")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        Metric (m)
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Shape</label>
                    <select
                      className="tool-calc-input w-full"
                      value={calc.shape}
                      onChange={e => calc.setShape(e.target.value as Shape)}
                    >
                      <option value="slab">Rectangular Slab (L x W x D)</option>
                      <option value="column">Column / Cylinder (Dia x D)</option>
                      <option value="tube">Tube / Sonotube (Dia x D)</option>
                    </select>
                  </div>
                </div>

                {/* Dimension Inputs */}
                {calc.unit === "imperial" ? (
                  <div className="space-y-4 mb-5">
                    {calc.shape === "slab" ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Length (feet)</label>
                            <input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.lengthFt} onChange={e => calc.setLengthFt(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Length (inches)</label>
                            <input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.lengthIn} onChange={e => calc.setLengthIn(e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Width (feet)</label>
                            <input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.widthFt} onChange={e => calc.setWidthFt(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Width (inches)</label>
                            <input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.widthIn} onChange={e => calc.setWidthIn(e.target.value)} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Diameter (feet)</label>
                          <input type="number" placeholder="2" className="tool-calc-input w-full" value={calc.diameterFt} onChange={e => calc.setDiameterFt(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Diameter (inches)</label>
                          <input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.diameterIn} onChange={e => calc.setDiameterIn(e.target.value)} />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Depth (feet)</label>
                        <input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.depthFt} onChange={e => calc.setDepthFt(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Depth (inches)</label>
                        <input type="number" placeholder="4" className="tool-calc-input w-full" value={calc.depthIn} onChange={e => calc.setDepthIn(e.target.value)} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-5">
                    {calc.shape === "slab" ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Length (meters)</label>
                            <input type="number" placeholder="6" className="tool-calc-input w-full" value={calc.lengthM} onChange={e => calc.setLengthM(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Width (meters)</label>
                            <input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.widthM} onChange={e => calc.setWidthM(e.target.value)} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Diameter (meters)</label>
                        <input type="number" placeholder="0.6" className="tool-calc-input w-full" value={calc.diameterM} onChange={e => calc.setDiameterM(e.target.value)} />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Depth (meters)</label>
                      <input type="number" placeholder="0.1" className="tool-calc-input w-full" value={calc.depthM} onChange={e => calc.setDepthM(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Waste Factor Toggle */}
                <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-muted/50">
                  <button
                    onClick={() => calc.setIncludeWaste(!calc.includeWaste)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${calc.includeWaste ? "bg-primary" : "bg-border"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${calc.includeWaste ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                  </button>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Include 10% waste factor</span>
                    <p className="text-xs text-muted-foreground">Recommended to account for spillage, uneven surfaces, and over-excavation.</p>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Cubic Yards</div>
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                      {calc.result ? fmt(calc.result.cubicYards) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Cubic Feet</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {calc.result ? fmt(calc.result.cubicFeet) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Cubic Meters</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {calc.result ? fmt(calc.result.cubicMeters) : "--"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">60lb Bags</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      {calc.result ? calc.result.bags60lb.toLocaleString() : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">80lb Bags</div>
                    <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                      {calc.result ? calc.result.bags80lb.toLocaleString() : "--"}
                    </div>
                  </div>
                </div>

                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Enter Your Dimensions</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Input the length, width, and depth for slabs, or diameter and depth for columns and tubes. Switch between imperial (feet/inches) and metric (meters) units.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Volume Calculation</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">For slabs: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Volume = L x W x D</code>. For cylinders: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Volume = pi x r^2 x D</code>. Cubic yards = cubic feet / 27. An optional 10% waste factor is included by default.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Bag Estimates</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Pre-mixed bag counts are calculated using standard yields: a 60lb bag covers 0.45 cu ft and an 80lb bag covers 0.6 cu ft. For projects over 1 cubic yard, ready-mix delivery is typically more economical.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Box className="w-4 h-4 text-orange-500" />
                    <h4 className="font-bold text-foreground text-sm">Driveway</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 20 ft x 10 ft driveway at 4 inches deep requires <strong className="text-foreground">2.47 cubic yards</strong> of concrete (with 10% waste), or about <strong className="text-foreground">123 bags</strong> of 60lb mix.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Patio</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 12 ft x 12 ft patio at 4 inches deep needs about <strong className="text-foreground">1.78 cubic yards</strong> with waste included, or roughly <strong className="text-foreground">88 bags</strong> of 60lb mix.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Box className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Foundation Footing</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A foundation footing 40 ft x 2 ft x 1 ft deep requires approximately <strong className="text-foreground">3.26 cubic yards</strong> of concrete with the waste factor applied.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Sidewalk</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 30 ft long, 3 ft wide sidewalk at 4 inches thick needs about <strong className="text-foreground">1.22 cubic yards</strong> with waste, or around <strong className="text-foreground">61 bags</strong> of 60lb mix.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant concrete volume results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Supports slabs, columns, and tube shapes" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "Built-in 10% waste factor option" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Imperial and metric unit support" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How Much Concrete Do I Need?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  Whether you are pouring a driveway, building a patio, setting fence posts, or laying a foundation, knowing exactly how much concrete you need is essential to avoid costly over-ordering or frustrating shortages. This free online concrete calculator takes the guesswork out of your project planning by instantly converting your dimensions into cubic yards, cubic feet, and cubic meters — plus the exact number of pre-mixed bags required.
                </p>
                <p>
                  Concrete is typically sold in two ways: pre-mixed bags (60lb and 80lb) for smaller DIY projects, and ready-mix delivery by the cubic yard for larger pours. A standard 60-pound bag of concrete mix yields approximately 0.45 cubic feet when mixed, while an 80-pound bag yields about 0.6 cubic feet. For projects requiring more than one cubic yard of concrete, ordering a ready-mix truck is usually more cost-effective and ensures a consistent mix.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Understanding Concrete Volume Calculations</h3>
                <p>
                  For rectangular slabs like driveways, patios, sidewalks, and foundation footings, the volume formula is straightforward: multiply length by width by depth. For round columns, sonotubes, and pier footings, the formula uses pi times the radius squared times the depth. In both cases, converting to cubic yards (dividing cubic feet by 27) gives you the standard ordering unit used by concrete suppliers.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Why Include a Waste Factor?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Uneven ground and subgrade variations require extra concrete to maintain proper depth",
                    "Spillage and overflow during the pouring and finishing process",
                    "Over-excavation that creates voids needing to be filled",
                    "Form board irregularities that increase the actual volume",
                    "Running short mid-pour can create cold joints and weaken the structure",
                    "Industry standard recommends 5-10% extra for most residential projects",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I calculate how much concrete I need?"
                  a="For rectangular slabs, multiply length x width x depth (all in feet) to get cubic feet, then divide by 27 to convert to cubic yards. For round columns or tubes, use pi x radius squared x depth. Our calculator handles both shapes automatically and includes an optional 10% waste factor."
                />
                <FaqItem
                  q="How many bags of concrete do I need for a 10x10 slab?"
                  a="A 10 ft x 10 ft slab at 4 inches deep requires about 1.23 cubic yards, or approximately 82 bags of 60lb concrete mix (or 62 bags of 80lb mix) with a 10% waste factor included. Without waste factor, you need about 74 bags of 60lb mix."
                />
                <FaqItem
                  q="What is the difference between 60lb and 80lb concrete bags?"
                  a="A 60lb bag of pre-mixed concrete yields approximately 0.45 cubic feet when mixed with water, while an 80lb bag yields about 0.6 cubic feet. The 80lb bags are more cost-effective per cubic foot but heavier to handle. Both produce the same strength concrete (typically 4,000 PSI)."
                />
                <FaqItem
                  q="Should I add extra concrete for waste?"
                  a="Yes, it is strongly recommended to order 5-10% more concrete than your calculated volume. This accounts for spillage, uneven ground, over-excavation, and form irregularities. Running short during a pour can create weak cold joints, so it is always better to have a little extra."
                />
                <FaqItem
                  q="When should I order ready-mix concrete instead of bags?"
                  a="For projects requiring more than 1 cubic yard of concrete (about 27 cubic feet), ready-mix delivery is typically more practical and cost-effective. Mixing 45+ bags of concrete by hand is extremely labor-intensive and difficult to maintain consistent quality across the entire pour."
                />
                <FaqItem
                  q="Is this concrete calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. The calculator runs entirely in your browser — your project data never leaves your device. Use it as many times as you need for any concrete project."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Construction Calculators?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including length converters, percentage calculators, unit converters, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others calculate concrete for their projects.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
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
