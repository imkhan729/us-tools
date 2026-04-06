import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Construction, Ruler, Box, Calculator, Palette,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function usePaintCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [numDoors, setNumDoors] = useState("");
  const [numWindows, setNumWindows] = useState("");
  const [coveragePerUnit, setCoveragePerUnit] = useState("10");
  const [numCoats, setNumCoats] = useState("2");

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const d = parseFloat(numDoors) || 0;
    const w = parseFloat(numWindows) || 0;
    const cov = parseFloat(coveragePerUnit) || 10;
    const coats = parseFloat(numCoats) || 2;

    if (l <= 0 || h <= 0) return null;

    let totalArea = l * h;
    let doorArea = 0;
    let windowArea = 0;

    if (unit === "imperial") {
      doorArea = d * 21;
      windowArea = w * 12;
    } else {
      doorArea = d * 2;
      windowArea = w * 1.5;
    }

    const netArea = Math.max(0, totalArea - doorArea - windowArea);
    const paintNeededTotal = (netArea / cov) * coats;
    return { netArea, paintNeeded: paintNeededTotal, numCoats: coats };
  }, [unit, length, height, numDoors, numWindows, coveragePerUnit, numCoats]);

  return {
    unit, setUnit, length, setLength, height, setHeight,
    numDoors, setNumDoors, numWindows, setNumWindows,
    coveragePerUnit, setCoveragePerUnit, numCoats, setNumCoats, result,
  };
}

// ── Result Insight ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const paintUnit = unit === "imperial" ? "gallons" : "liters";
  const message = `For a ${result.netArea.toFixed(1)} ${areaUnit} wall area (after subtracting doors and windows), you need approximately ${result.paintNeeded.toFixed(2)} ${paintUnit} of paint for ${result.numCoats} coats. For textured walls, add an extra 15–20%.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-sky-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-sky-500">
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
  { title: "Cement Calculator", slug: "cement-calculator", icon: <Calculator className="w-5 h-5" />, color: 45, benefit: "Mix ratios & bag counts" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert feet, meters & more" },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
];

// ── Main Component ──
export default function PaintCalculator() {
  const calc = usePaintCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const areaUnit = calc.unit === "imperial" ? "ft" : "m";
  const paintUnit = calc.unit === "imperial" ? "gallons" : "liters";
  const coverageUnit = calc.unit === "imperial" ? "sq ft/gal" : "sq m/L";

  return (
    <Layout>
      <SEO
        title="Paint Calculator – How Much Paint Do I Need? Free Online Tool | US Online Tools"
        description="Free online paint calculator. Estimate exactly how many liters or gallons of paint you need for any room. Accounts for doors, windows, and number of coats. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Paint Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Palette className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Paint Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate exactly how many liters or gallons of paint you need for any room — accounting for doors, windows, and multiple coats. No more extra trips to the hardware store.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
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
              <div className="rounded-2xl overflow-hidden border border-sky-500/20 shadow-lg shadow-sky-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center flex-shrink-0"><Palette className="w-4 h-4 text-white" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Room Paint Estimator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 200 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => { calc.setUnit("imperial"); calc.setCoveragePerUnit("350"); }}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-sky-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial (ft/gal)</button>
                          <button onClick={() => { calc.setUnit("metric"); calc.setCoveragePerUnit("10"); }}
                            className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-sky-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric (m/L)</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Number of Coats</label>
                        <select className="tool-calc-input w-full" value={calc.numCoats} onChange={e => calc.setNumCoats(e.target.value)}>
                          <option value="1">1 Coat (Touch up)</option>
                          <option value="2">2 Coats (Standard)</option>
                          <option value="3">3 Coats (Major color change)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Total Wall Length ({areaUnit})</label><input type="number" placeholder="12" className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Height ({areaUnit})</label><input type="number" placeholder="8" className="tool-calc-input w-full" value={calc.height} onChange={e => calc.setHeight(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">Deductions &amp; Coverage</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Doors</label><input type="number" placeholder="1" className="tool-calc-input w-full" value={calc.numDoors} onChange={e => calc.setNumDoors(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Windows</label><input type="number" placeholder="2" className="tool-calc-input w-full" value={calc.numWindows} onChange={e => calc.setNumWindows(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Coverage ({coverageUnit})</label><input type="number" className="tool-calc-input w-full" value={calc.coveragePerUnit} onChange={e => calc.setCoveragePerUnit(e.target.value)} /></div>
                    </div>

                    {/* Result */}
                    <div className="tool-calc-result p-6 bg-sky-500/5 border-2 border-sky-500/20 rounded-2xl text-center">
                      <Palette className="w-10 h-10 text-sky-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Estimated Paint Required</p>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-black text-foreground">{calc.result ? calc.result.paintNeeded.toFixed(2) : "0.00"}</span>
                        <span className="text-2xl font-bold text-sky-500 uppercase">{paintUnit}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">For {calc.result ? calc.result.numCoats : "0"} coats on {calc.result ? calc.result.netArea.toFixed(1) : "0"} {areaUnit}²</p>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Paint Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">When planning a home improvement project, one of the most common questions is "How much paint do I actually need?" This calculator takes the physical dimensions of your room and accounts for standard openings to give you a professional-grade estimate — preventing both under-buying (mid-project hardware store runs) and over-buying (wasted paint sitting in your garage).</p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure the total wall length (perimeter)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Measure the length of every wall you intend to paint and add them together. For a rectangular room, this is 2 × (room length + room width). For example, a 12 × 14 foot room has a perimeter of 52 feet. Enter the total combined length — the calculator treats all walls as one continuous surface.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the wall height and deductions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Measure from the baseboard to the ceiling (standard residential height is 8 ft / 2.4 m). Then count your doors and windows — the calculator deducts standard-sized openings automatically: 21 sq ft (2 m²) per door and 12 sq ft (1.5 m²) per window. For non-standard openings, adjust the coverage rate accordingly.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select the number of coats and review the estimate</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Two coats is standard for most paint jobs — the first coat provides coverage and the second ensures depth and durability. If you're making a dramatic color change (dark to light or vice versa), select 3 coats. The result shows the total paint volume in liters or gallons, rounded to two decimal places. Round up to the nearest whole unit when purchasing.</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><span className="text-sky-500 font-bold w-16 flex-shrink-0">Net Area</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(Length × Height) − (Doors × 21 sq ft) − (Windows × 12 sq ft)</code></div>
                  <div className="flex items-center gap-3 text-sm"><span className="text-sky-500 font-bold w-16 flex-shrink-0">Paint</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(Net Area ÷ Coverage per Unit) × Number of Coats</code></div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Coverage Factors to Consider</h2>
              <p className="text-muted-foreground text-sm mb-6">Your actual paint consumption may vary based on these factors:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div><p className="font-bold text-foreground mb-1">Smooth drywall — Standard coverage</p><p className="text-sm text-muted-foreground leading-relaxed">On smooth, primed drywall, a liter of quality emulsion paint covers approximately 10–12 sq m (110–130 sq ft). This is the ideal scenario where the calculator's estimates are most accurate. Always prime new drywall first for best coverage.</p></div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div><p className="font-bold text-foreground mb-1">Textured or rough walls — Add 15–20% more paint</p><p className="text-sm text-muted-foreground leading-relaxed">Textured surfaces (like orange peel, knockdown, or stucco) have more surface area than flat walls. The paint fills the grooves and peaks, consuming significantly more per square unit. Reduce the "coverage" field by 15–20% to account for this.</p></div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div><p className="font-bold text-foreground mb-1">Bare or unpainted surfaces — Use a primer first</p><p className="text-sm text-muted-foreground leading-relaxed">New plaster, bare wood, and metal surfaces absorb the first coat heavily. Applying a dedicated primer before painting reduces total paint consumption and provides a better final finish. Without primer, you may need 3 coats of paint instead of 2.</p></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex gap-2 items-center text-sm"><CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" /><span><strong className="text-foreground">Rollers</strong> use ~10% less paint than sprayers</span></div>
                <div className="flex gap-2 items-center text-sm"><CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" /><span><strong className="text-foreground">Brushes</strong> apply the least paint per area</span></div>
                <div className="flex gap-2 items-center text-sm"><CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" /><span><strong className="text-foreground">Glossy finishes</strong> may show streaks easier</span></div>
                <div className="flex gap-2 items-center text-sm"><CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" /><span><strong className="text-foreground">Darker colors</strong> may need 3+ coats for full hide</span></div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-left px-4 py-3 font-bold text-foreground">Room</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Perimeter × Height</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Coats</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Paint Needed</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Scenario</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Bedroom</td><td className="px-4 py-3 font-mono text-foreground text-xs">48′ × 8′</td><td className="px-4 py-3 text-foreground">2</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">1.8 gal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">12×12 room, 1 door, 2 windows</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Living room</td><td className="px-4 py-3 font-mono text-foreground text-xs">60′ × 9′</td><td className="px-4 py-3 text-foreground">2</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">2.6 gal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">15×15 room, 2 doors, 3 windows</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Hallway</td><td className="px-4 py-3 font-mono text-foreground text-xs">30′ × 8′</td><td className="px-4 py-3 text-foreground">2</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">1.2 gal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Narrow corridor, 3 doors, 0 windows</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 – Standard bedroom:</strong> A 12 × 12 foot room (perimeter 48 ft) with 8-foot ceilings, one door, and two windows has a net wall area of about 315 sq ft. At standard coverage (350 sq ft/gallon) and two coats, you need approximately 1.8 gallons. Buy 2 gallons and save the remainder for touch-ups.</p>
                <p><strong className="text-foreground">Example 2 – Major color change:</strong> Painting a dark navy living room to bright white may require 3 coats or a tinted primer plus 2 topcoats. For a 15 × 15 room with 9-foot ceilings, this pushes the requirement from 2.6 gallons (2 coats) to about 3.9 gallons (3 coats) — a significant difference in both cost and time.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-sky-500/5 border border-sky-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-sky-400 text-sky-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Bought exactly 2 gallons for our spare bedroom — used every last drop. No waste and no extra trip. Perfect estimate."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Paint Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Automatic deductions for doors and windows.</strong> Most simple paint calculators only handle total wall area. This tool subtracts standard-sized doors (21 sq ft / 2 m²) and windows (12 sq ft / 1.5 m²) automatically. Just enter how many you have — no manual area subtraction needed.</p>
                <p><strong className="text-foreground">Multi-coat support built in.</strong> Professional painters almost always recommend two coats. Select 1 coat for touch-ups, 2 for standard jobs, or 3 for drastic color changes. The calculator multiplies the paint volume by the coat count so you see the true total.</p>
                <p><strong className="text-foreground">Adjustable coverage rate in a familiar format.</strong> Coverage varies by paint brand, quality, and finish. Cheap paint may cover only 8 sq m/L while premium paint covers 14 sq m/L. The default (10 sq m/L or 350 sq ft/gal) is a safe average. Adjust this field based on the coverage stated on your paint can.</p>
                <p><strong className="text-foreground">Imperial and Metric with smart defaults.</strong> Switching units automatically adjusts the default coverage rate from sq ft/gal to sq m/L, so you never accidentally use the wrong unit — a common error that leads to wildly inaccurate estimates.</p>
                <p><strong className="text-foreground">Privacy by design — nothing leaves your device.</strong> Room dimensions are not transmitted to any server. All calculations happen in your browser using JavaScript. This is especially useful for contractors preparing estimates for client properties where privacy matters.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool estimates wall paint only. For ceiling paint, calculate the ceiling area separately (Length × Width) and run a second calculation. Trim paint (baseboards, crown molding, door frames) is typically estimated at 10% of wall paint volume.</p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How much area does one liter of paint cover?" a="On average, one liter of interior emulsion paint covers 10–12 sq m (110–130 sq ft) in a single coat on smooth, primed drywall. This decreases to 8–10 sq m on textured walls and 6–8 sq m on bare, unprimed surfaces. Always check the coverage stated on your paint can." />
                <FaqItem q="How many gallons of paint for a 12×12 room?" a="A standard 12×12 room with 8-foot ceilings has about 384 sq ft of wall area. After deducting a door (21 sq ft) and two windows (24 sq ft), the net area is ~339 sq ft. At 350 sq ft/gallon, one coat requires ~1 gallon. For two coats (standard), buy 2 gallons." />
                <FaqItem q="Do I include the ceiling in my calculation?" a="Typically, ceilings are painted with a separate flat white paint. Calculate the ceiling area separately (Length × Width of the room) and run the calculator again with that number as the wall area. Ceiling paint often has different coverage characteristics." />
                <FaqItem q="Does this work for exterior walls?" a="Yes, but exterior walls (brick, stucco, wood siding) are more absorbent and textured. Reduce the coverage per unit by 20–30% to account for the increased paint absorption. For rough brick, coverage can drop to as low as 5 sq m/L." />
                <FaqItem q="Should I use primer before painting?" a="Primer is recommended whenever painting over new drywall, bare wood, stained surfaces, or when making a dramatic color change. Primer is less expensive than paint and ensures the topcoat adheres properly and covers evenly. Without primer, you may need an extra coat of paint." />
                <FaqItem q="What's the difference between mat, satin, and gloss paint?" a="Mat (flat) finishes hide imperfections but are harder to clean. Satin provides a subtle sheen with better washability — ideal for bedrooms, hallways, and living rooms. Gloss is the most durable and moisture-resistant, best for kitchens, bathrooms, and trim work." />
                <FaqItem q="How long does paint last once opened?" a="Properly sealed and stored paint (in a cool, dry place) can last 2–5 years for latex/water-based paint and up to 15 years for oil-based paint. If the paint smells foul or has lumps that won't mix, it has spoiled and should be disposed of properly." />
                <FaqItem q="Does this tool work on mobile phones?" a="Yes. The layout is fully responsive — inputs stack vertically on small screens for easy thumb entry. It runs in your browser with no app download required. Works on iOS Safari, Android Chrome, and all modern browsers." />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Complete Your Project Planning</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore our full DIY toolkit — concrete, bricks, cement, tiles, and more — all free, all instant.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">All Tools <ArrowRight className="w-4 h-4" /></Link>
                  <Link href="/category/construction" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-xl border border-sky-300/30 hover:-translate-y-0.5 transition-transform">Construction Hub</Link>
                </div>
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-sky-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help friends plan their paint job.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-sky-500 to-blue-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Coverage Factors", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-sky-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-sky-500/40 flex-shrink-0" />{label}
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
