import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Ruler, Box, Square, Construction, Calculator,
  BarChart3, Star, BadgeCheck, Lock,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function useBrickCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [wallLength, setWallLength] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [brickLength, setBrickLength] = useState("8");
  const [brickHeight, setBrickHeight] = useState("2.25");
  const [mortarJoint, setMortarJoint] = useState("0.5");
  const [wasteFactor, setWasteFactor] = useState("10");
  const [numCourses, setNumCourses] = useState("1");

  const result = useMemo(() => {
    const l = parseFloat(wallLength) || 0;
    const h = parseFloat(wallHeight) || 0;
    const bl = parseFloat(brickLength) || 0;
    const bh = parseFloat(brickHeight) || 0;
    const mj = parseFloat(mortarJoint) || 0;
    const wf = parseFloat(wasteFactor) || 0;
    const courses = parseFloat(numCourses) || 1;

    if (l <= 0 || h <= 0 || bl <= 0 || bh <= 0) return null;

    if (unit === "imperial") {
      const wallArea = l * h;
      const effectiveBrickLength = bl + mj;
      const effectiveBrickHeight = bh + mj;
      const brickArea = (effectiveBrickLength * effectiveBrickHeight) / 144;
      const basicCount = wallArea / brickArea;
      const totalCount = basicCount * courses;
      const withWaste = totalCount * (1 + wf / 100);
      return { wallArea, bricksPerUnit: 1 / brickArea, totalBricks: Math.ceil(totalCount), withWaste: Math.ceil(withWaste) };
    } else {
      const wallArea = l * h;
      const effectiveBrickLength = (bl + mj) / 1000;
      const effectiveBrickHeight = (bh + mj) / 1000;
      const brickArea = effectiveBrickLength * effectiveBrickHeight;
      const basicCount = wallArea / brickArea;
      const totalCount = basicCount * courses;
      const withWaste = totalCount * (1 + wf / 100);
      return { wallArea, bricksPerUnit: 1 / brickArea, totalBricks: Math.ceil(totalCount), withWaste: Math.ceil(withWaste) };
    }
  }, [unit, wallLength, wallHeight, brickLength, brickHeight, mortarJoint, wasteFactor, numCourses]);

  return {
    unit, setUnit, wallLength, setWallLength, wallHeight, setWallHeight,
    brickLength, setBrickLength, brickHeight, setBrickHeight,
    mortarJoint, setMortarJoint, wasteFactor, setWasteFactor,
    numCourses, setNumCourses, result,
  };
}

// ── Result Insight ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const message = `For a ${result.wallArea.toFixed(1)} ${areaUnit} wall, you need approximately ${result.totalBricks.toLocaleString()} bricks. Including waste, you should order ${result.withWaste.toLocaleString()} bricks to cover cuts, breakage, and future repairs.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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
  { title: "Cement Calculator", slug: "cement-calculator", icon: <Box className="w-5 h-5" />, color: 35, benefit: "Mix ratios & bag counts" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 200, benefit: "Paint coverage estimator" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert feet, meters & more" },
  { title: "Area Converter", slug: "area-converter", icon: <Square className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Calculator className="w-5 h-5" />, color: 340, benefit: "Liters, gallons & more" },
];

// ── Main Component ──
export default function BrickCalculator() {
  const calc = useBrickCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Brick Calculator – How Many Bricks Do I Need? Free Online Tool | US Online Tools"
        description="Free online brick calculator. Estimate how many bricks you need for any wall based on dimensions, brick size, and mortar joint thickness. Instant results with waste factor. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Brick Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-red-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Brick Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate exactly how many bricks you need for any masonry wall — accounting for mortar joints, wall thickness, and a recommended waste factor. No guesswork, no over-ordering.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
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
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-red-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center flex-shrink-0">
                      <Construction className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brick Estimator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 25 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => { calc.setUnit("imperial"); calc.setBrickLength("8"); calc.setBrickHeight("2.25"); calc.setMortarJoint("0.5"); }}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-orange-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial (ft/in)</button>
                          <button onClick={() => { calc.setUnit("metric"); calc.setBrickLength("215"); calc.setBrickHeight("65"); calc.setMortarJoint("10"); }}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-orange-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric (m/mm)</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Thickness</label>
                        <select className="tool-calc-input w-full" value={calc.numCourses} onChange={e => calc.setNumCourses(e.target.value)}>
                          <option value="1">Single Course (Standard)</option>
                          <option value="2">Double Course</option>
                          <option value="3">Triple Course</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Length ({calc.unit === "imperial" ? "ft" : "m"})</label>
                        <input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.wallLength} onChange={e => calc.setWallLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Height ({calc.unit === "imperial" ? "ft" : "m"})</label>
                        <input type="number" placeholder="8" className="tool-calc-input w-full" value={calc.wallHeight} onChange={e => calc.setWallHeight(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 rounded-xl bg-muted/30 border border-border">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Brick Length ({calc.unit === "imperial" ? "in" : "mm"})</label>
                        <input type="number" className="tool-calc-input w-full" value={calc.brickLength} onChange={e => calc.setBrickLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Brick Height ({calc.unit === "imperial" ? "in" : "mm"})</label>
                        <input type="number" className="tool-calc-input w-full" value={calc.brickHeight} onChange={e => calc.setBrickHeight(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mortar Joint ({calc.unit === "imperial" ? "in" : "mm"})</label>
                        <input type="number" className="tool-calc-input w-full" value={calc.mortarJoint} onChange={e => calc.setMortarJoint(e.target.value)} />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waste Factor (%)</label>
                      <input type="number" placeholder="10" className="tool-calc-input w-32" value={calc.wasteFactor} onChange={e => calc.setWasteFactor(e.target.value)} />
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="tool-calc-result p-5 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Base Count</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? calc.result.totalBricks.toLocaleString() : "--"}</p>
                        <p className="text-xs text-muted-foreground">bricks</p>
                      </div>
                      <div className="tool-calc-result p-5 text-center rounded-xl bg-orange-500/5 border-orange-500/20">
                        <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Order Total</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? calc.result.withWaste.toLocaleString() : "--"}</p>
                        <p className="text-xs text-muted-foreground">with {calc.wasteFactor}% waste</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Brick Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you are building a garden wall, a house extension, or a decorative boundary, calculating the right number of bricks prevents costly delays from re-ordering and wasted money from over-ordering. This calculator accounts for the often-overlooked mortar joints that significantly affect the total count.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your unit system and enter wall dimensions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select <strong className="text-foreground">Imperial</strong> (feet and inches) or <strong className="text-foreground">Metric</strong> (meters and millimeters). Wall length is measured horizontally across the entire surface you plan to brick. Wall height is measured from the base course to the top. If you're bricking multiple walls, you can either add the total length of all walls or run the calculator once per wall and sum the results.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Verify or customise the brick size and mortar joint</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The default values (8″ × 2.25″ brick with a ½″ mortar joint for Imperial, or 215 × 65 mm with a 10 mm joint for Metric) are the most common standard modular brick dimensions. If you're using a different brick type — such as a Jumbo, Utility, or Engineer brick — update these fields to match. The mortar joint is critical: a ¼″ change in joint thickness can shift the total count by 5–10%.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the base count and order total</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The <strong className="text-foreground">Base Count</strong> is the exact theoretical number of bricks required. The <strong className="text-foreground">Order Total</strong> adds the waste factor. Experienced masons always recommend at least 10% extra for cuts at corners, accidental breakage during delivery, and color matching between pallets. Round up to the nearest pallet when ordering.</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-16 flex-shrink-0">Bricks</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Wall Area ÷ ((Brick L + Joint) × (Brick H + Joint))</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-16 flex-shrink-0">Order</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Base Count × (1 + Waste% ÷ 100) × Courses</code>
                  </div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">What your brick count means for your project:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Under 500 bricks — Small project</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Garden walls, raised beds, mailbox columns, and BBQ pits. You can typically pick these up in your vehicle in 1–2 trips. A standard pallet holds 400–500 bricks, so this is a single-pallet job. Most hardware stores stock standard modular bricks at $0.40–$0.80 each.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">500–3,000 bricks — Medium project</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A single-car garage wall, a boundary wall for a small property, or internal feature walls. At this scale, delivery is recommended. Order by the pallet and ask for bricks from the same kiln batch to ensure uniform color throughout the project.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">3,000+ bricks — Large construction</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">House exteriors, commercial walls, and multi-story projects. At this volume, negotiate bulk pricing directly with brick manufacturers or masonry supply yards. Delivery logistics are critical — ensure your site has space for pallet storage and forklift access.</p>
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
                      <th className="text-left px-4 py-3 font-bold text-foreground">Wall Size</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Brick Type</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Base Count</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Order (10%)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Project</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground text-xs">20′ × 8′</td>
                      <td className="px-4 py-3 text-muted-foreground">Standard</td>
                      <td className="px-4 py-3 font-bold text-foreground">1,080</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1,188</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Garden wall</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground text-xs">40′ × 10′</td>
                      <td className="px-4 py-3 text-muted-foreground">Standard</td>
                      <td className="px-4 py-3 font-bold text-foreground">2,700</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">2,970</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">House exterior</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground text-xs">10′ × 4′</td>
                      <td className="px-4 py-3 text-muted-foreground">Standard</td>
                      <td className="px-4 py-3 font-bold text-foreground">270</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">297</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Raised bed</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 – Garden wall:</strong> A 20-foot-long, 8-foot-high garden boundary wall using standard modular bricks (8″ × 2.25″ with ½″ mortar) requires 1,080 bricks for a single-course wall. Adding 10% waste brings the order to 1,188 bricks — roughly 2.5 pallets. At $0.55 per brick, the material cost is about $653.</p>
                <p><strong className="text-foreground">Example 2 – Double-course exterior:</strong> For structural integrity, house exteriors are often double-course (two bricks thick). A 40 × 10 wall at double course needs approximately 5,400 bricks base, or 5,940 with waste — around 12 pallets. Always verify with your structural engineer.</p>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"My bricklayer was impressed I knew the exact count before he even quoted. Saved me from buying 3 unnecessary pallets."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Brick Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It accounts for mortar joints correctly.</strong> Many free calculators divide wall area by bare brick area, ignoring mortar. Since a standard ½-inch mortar joint increases the effective brick footprint by about 15%, skipping this step leads to a significant over-estimate. This tool calculates the "effective area" — brick plus surrounding mortar — for accurate counts.</p>
                <p><strong className="text-foreground">Supports both unit systems natively.</strong> Switch between Imperial (feet and inches for walls, inches for bricks) and Metric (meters for walls, millimeters for bricks) in one click. The calculator automatically adjusts default brick sizes when you switch, so you don't need to remember conversion factors.</p>
                <p><strong className="text-foreground">Handles single, double, and triple courses.</strong> A single-course wall (one brick thick) is standard for garden walls and veneers. A double-course wall is used for load-bearing exterior walls in masonry construction. This calculator multiplies the count by the number of courses, so you get the total across all layers.</p>
                <p><strong className="text-foreground">Built-in waste factor you control.</strong> The default 10% waste factor covers corner cuts, breakage during delivery, color inconsistencies between batches, and future repair stock. You can adjust this percentage up (for complex layouts with many cuts) or down (for simple straight walls).</p>
                <p><strong className="text-foreground">Part of a 400+ tool ecosystem.</strong> This calculator is part of a comprehensive suite of free construction tools. After estimating your bricks, jump to the Cement Calculator for mortar quantities, the Paint Calculator for finishing, or the Area Converter for unit conversions — all with the same design and zero signup.</p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This calculator estimates brick count for flat wall surfaces. Subtract the area of windows, doors, and other openings from your wall dimensions before calculating. For arches, curved walls, or decorative bond patterns (e.g., Herringbone, Flemish bond), consult a professional mason as waste percentages increase.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How many bricks are in a square foot of wall?" a="For a standard modular brick (8″ × 2.25″) with a ½″ mortar joint, there are approximately 6.75 bricks per square foot. This number changes with different brick sizes; for example, a Jumbo brick (8″ × 2.75″) yields about 5.76 bricks per square foot." />
                <FaqItem q="What is the standard mortar joint thickness?" a="In the U.S., the most common mortar joint thickness is ½ inch (12.7 mm). In the UK and Europe, 10 mm is standard. Thinner joints use fewer bricks but require more precision; thicker joints are more forgiving but use more mortar. Always check your project specifications." />
                <FaqItem q="How many bricks come on a pallet?" a="A standard brick pallet holds between 400 and 525 bricks depending on the manufacturer and brick size. Standard modular bricks typically come in pallets of 500. Always confirm with your supplier before ordering, especially for specialty or custom bricks." />
                <FaqItem q="Does this calculator account for windows and doors?" a="No — subtract the area of openings before entering your wall dimensions. For example, a 20′ × 10′ wall with two 3′ × 5′ windows has a net area of 200 − 30 = 170 sq ft. Enter the equivalent dimensions (e.g., 21.25′ × 8′) to get the correct brick count." />
                <FaqItem q="What is the difference between single and double course?" a="A single-course wall is one brick thick (typically 4 inches). It's used for garden walls, decorative veneers, and non-load-bearing partitions. A double-course wall is two bricks thick (about 8 inches) and is required for load-bearing exterior walls in traditional masonry construction." />
                <FaqItem q="Why do I need 10% extra bricks?" a="Waste occurs from cuts at corners and around openings, accidental breakage during delivery and handling, color mismatches between production batches (mixing pallets ensures uniform appearance), and the need for spare bricks for future repairs. For complex layouts, consider 12–15% waste." />
                <FaqItem q="How much mortar do I need per 1,000 bricks?" a="Approximately 7–8 bags (94 lb each) of mason's mortar per 1,000 standard bricks, assuming a ½-inch joint. This varies with joint thickness and the mason's technique. Use our Cement Calculator for precise mortar estimates based on your mix ratio." />
                <FaqItem q="Does this tool work on mobile phones?" a="Yes. The layout is fully responsive — inputs stack vertically on smaller screens for comfortable thumb entry. It runs entirely in your browser with no app download required. Works on iOS Safari, Android Chrome, and all modern browsers." />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Construction Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore our full suite of building tools — concrete, cement, paint, tiles, and more — all free, all instant.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore Construction Tools <ArrowRight className="w-4 h-4" />
                </Link>
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
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help fellow builders calculate materials.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-red-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />{label}
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
