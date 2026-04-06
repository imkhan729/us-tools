import { useMemo, useState, type CSSProperties } from "react";
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
  PaintBucket,
  Calculator,
  Hammer,
  SquareStack,
} from "lucide-react";

type Unit = "imperial" | "metric";

const RELATED_TOOLS = [
  { title: "Wall Area Calculator", slug: "wall-area-calculator", icon: <SquareStack className="w-5 h-5" />, benefit: "Measure wall surface before plastering" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <PaintBucket className="w-5 h-5" />, benefit: "Estimate finish coating after plaster work" },
  { title: "Material Cost Calculator", slug: "material-cost-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Turn plaster quantity into project cost" },
  { title: "Deck Area Calculator", slug: "deck-area-calculator", icon: <Hammer className="w-5 h-5" />, benefit: "Estimate surfaces and material takeoff in a similar way" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-rose-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-rose-500">
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

function usePlasterCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [wallLength, setWallLength] = useState("24");
  const [wallHeight, setWallHeight] = useState("9");
  const [openingsArea, setOpeningsArea] = useState("18");
  const [thickness, setThickness] = useState("0.5");
  const [wastePercent, setWastePercent] = useState("10");
  const [bagYield, setBagYield] = useState("0.6");

  const result = useMemo(() => {
    const length = parseFloat(wallLength) || 0;
    const height = parseFloat(wallHeight) || 0;
    const openings = Math.max(0, parseFloat(openingsArea) || 0);
    const coatThickness = parseFloat(thickness) || 0;
    const waste = Math.max(0, parseFloat(wastePercent) || 0);
    const yieldPerBag = parseFloat(bagYield) || 0;

    if (length <= 0 || height <= 0 || coatThickness <= 0 || yieldPerBag <= 0) return null;

    const grossArea = length * height;
    const netArea = Math.max(grossArea - openings, 0);
    const thicknessBase = unit === "imperial" ? coatThickness / 12 : coatThickness / 1000;
    const wetVolume = netArea * thicknessBase;
    const dryMixVolume = wetVolume * 1.27;
    const adjustedDryMixVolume = dryMixVolume * (1 + waste / 100);
    const bagCount = Math.ceil(adjustedDryMixVolume / yieldPerBag);

    return { grossArea, netArea, wetVolume, dryMixVolume, adjustedDryMixVolume, bagCount, waste };
  }, [unit, wallLength, wallHeight, openingsArea, thickness, wastePercent, bagYield]);

  return { unit, setUnit, wallLength, setWallLength, wallHeight, setWallHeight, openingsArea, setOpeningsArea, thickness, setThickness, wastePercent, setWastePercent, bagYield, setBagYield, result };
}

function ResultInsight({ result, unit }: { result: ReturnType<typeof usePlasterCalc>["result"]; unit: Unit }) {
  if (!result) return null;

  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const volumeUnit = unit === "imperial" ? "cu ft" : "cu m";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Gross wall area is {result.grossArea.toFixed(2)} {areaUnit}, and after subtracting openings the plastering area is {result.netArea.toFixed(2)} {areaUnit}. At the selected thickness, wet plaster volume is {result.wetVolume.toFixed(3)} {volumeUnit}. After dry-mix allowance and {result.waste.toFixed(1)}% waste, plan for about {result.adjustedDryMixVolume.toFixed(3)} {volumeUnit} of dry mix, or roughly {result.bagCount} bags at the yield entered.
        </p>
      </div>
    </motion.div>
  );
}

export default function PlasterCalculator() {
  const calc = usePlasterCalc();
  const [copied, setCopied] = useState(false);

  const sizeUnit = calc.unit === "imperial" ? "ft" : "m";
  const areaUnit = calc.unit === "imperial" ? "sq ft" : "sq m";
  const thicknessUnit = calc.unit === "imperial" ? "in" : "mm";
  const volumeUnit = calc.unit === "imperial" ? "cu ft" : "cu m";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO title="Plaster Calculator - Estimate Plaster Volume and Bags" description="Free plaster calculator for wall area, plaster thickness, dry-mix volume, waste allowance, and bag count. Estimate plastering materials in feet or meters." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">Plaster Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Plaster Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate plastering area, wet plaster volume, dry-mix quantity, and bag count for walls and similar surfaces. Use it for gypsum plaster, cement plaster, patching work, and room preparation takeoffs.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <PaintBucket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall plaster estimator</p>
                      <p className="text-sm text-muted-foreground">Net area, plaster volume, dry-mix allowance, and bag planning in one tool.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 350 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-rose-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-rose-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waste Allowance (%)</label>
                        <input type="number" min="0" placeholder="10" className="tool-calc-input w-full" value={calc.wastePercent} onChange={(e) => calc.setWastePercent(e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-2">Useful for uneven walls, touch-ups, spillage, and extra coats in problem areas.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Length ({sizeUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "24" : "7.2"} className="tool-calc-input w-full" value={calc.wallLength} onChange={(e) => calc.setWallLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Height ({sizeUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "9" : "2.7"} className="tool-calc-input w-full" value={calc.wallHeight} onChange={(e) => calc.setWallHeight(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Openings Area ({areaUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "18" : "1.7"} className="tool-calc-input w-full" value={calc.openingsArea} onChange={(e) => calc.setOpeningsArea(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Plaster Thickness ({thicknessUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "0.5" : "12"} className="tool-calc-input w-full" value={calc.thickness} onChange={(e) => calc.setThickness(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Bag Yield ({volumeUnit} per bag)</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "0.6" : "0.017"} className="tool-calc-input w-full" value={calc.bagYield} onChange={(e) => calc.setBagYield(e.target.value)} />
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">Bag yield varies by mix type, manufacturer, water ratio, and plaster thickness. Use the real published yield for the product you plan to buy if available.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Gross Area</p>
                        <p className="text-2xl font-black text-rose-700 dark:text-rose-400">{calc.result ? calc.result.grossArea.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Net Area</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.netArea.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Wet Volume</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.wetVolume.toFixed(3) : "0.000"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{volumeUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Dry Mix</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.dryMixVolume.toFixed(3) : "0.000"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{volumeUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">With Waste</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.adjustedDryMixVolume.toFixed(3) : "0.000"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{volumeUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Bags</p>
                        <p className="text-2xl font-black text-orange-700 dark:text-orange-400">{calc.result ? calc.result.bagCount : "0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">rounded up</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Plaster Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool is built for wall plaster takeoff and material planning. Start with the overall wall dimensions, subtract doors or windows if needed, then apply the plaster thickness and bag yield for the mix you plan to use.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure the full wall face first</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use the complete wall length and height to get gross area. That creates the baseline before deductions for windows, doors, niches, or other large openings.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Subtract openings and enter actual thickness</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Openings reduce the plastering area, while thickness directly controls volume. Even a small change in coat thickness can materially change the dry-mix requirement.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use waste and bag yield for a purchase-ready estimate</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Dry-mix allowance accounts for bulking over wet volume, and waste covers real site losses. Bag count rounds up so the estimate is easier to use when buying materials.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-rose-700 dark:text-rose-400 font-bold w-28 flex-shrink-0">Net Area</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Gross Wall Area - Openings Area</code></div>
                  <div className="flex items-center gap-3"><span className="text-rose-700 dark:text-rose-400 font-bold w-28 flex-shrink-0">Wet Volume</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Net Area x Thickness</code></div>
                  <div className="flex items-center gap-3"><span className="text-rose-700 dark:text-rose-400 font-bold w-28 flex-shrink-0">Dry Mix</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Wet Volume x 1.27</code></div>
                  <div className="flex items-center gap-3"><span className="text-rose-700 dark:text-rose-400 font-bold w-28 flex-shrink-0">Bag Count</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">ceil((Dry Mix x Waste Factor) / Bag Yield)</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">What the plaster outputs mean when estimating labor and materials.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <div className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Gross and net area</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Gross area shows the full wall face. Net area is the more useful plastering number because it reflects large openings that do not receive the full coat.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Wet and dry-mix volume</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Wet volume describes the installed coat, while dry-mix volume reflects the larger quantity you need to prepare or purchase before water and site handling are considered.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Waste-adjusted quantity and bags</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">These are the most practical ordering figures. Waste-adjusted volume reflects site reality, and bag count gives a rounded purchasing number instead of a fractional estimate.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Project</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Wall Setup</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Thickness</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Net Area</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Bedroom wall</td>
                      <td className="px-4 py-3 font-mono text-foreground">24 x 9 ft, 18 sq ft openings</td>
                      <td className="px-4 py-3 font-mono text-foreground">1/2 in</td>
                      <td className="px-4 py-3 font-bold text-rose-700 dark:text-rose-400">198 sq ft</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Single-room replastering</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Hallway patch job</td>
                      <td className="px-4 py-3 font-mono text-foreground">18 x 8 ft, 0 openings</td>
                      <td className="px-4 py-3 font-mono text-foreground">3/8 in</td>
                      <td className="px-4 py-3 font-bold text-rose-700 dark:text-rose-400">144 sq ft</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Repair and skim coating</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Metric wall section</td>
                      <td className="px-4 py-3 font-mono text-foreground">7.2 x 2.7 m, 1.7 sq m openings</td>
                      <td className="px-4 py-3 font-mono text-foreground">12 mm</td>
                      <td className="px-4 py-3 font-bold text-rose-700 dark:text-rose-400">17.74 sq m</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Interior finish planning</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - standard room wall:</strong> A 24 by 9 foot wall with one door opening still leaves nearly 200 square feet to plaster. Thickness and waste then drive how much material actually needs to be ordered.</p>
                <p><strong className="text-foreground">Example 2 - patch and skim work:</strong> Even when the area is modest, skim thickness and site waste can change the bag requirement enough to matter on small jobs.</p>
                <p><strong className="text-foreground">Example 3 - metric finish coat:</strong> A 12 millimeter coat over a larger metric wall section quickly turns surface area into a measurable dry-mix volume, which is more useful than area alone for material planning.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Plaster Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It handles both area and volume.</strong> That matters because plastering is not only a surface problem. Thickness changes the amount of mix required in a way area-only tools cannot capture.</p>
                <p><strong className="text-foreground">It subtracts openings and adds waste.</strong> Those two adjustments make the estimate more practical for real rooms instead of idealized flat surfaces.</p>
                <p><strong className="text-foreground">It converts material need into bag count.</strong> Bag count is usually the number crews and buyers actually need when moving from estimate to purchase.</p>
                <p><strong className="text-foreground">It follows the same full-page template.</strong> The page structure, content depth, and design pattern match the percentage-calculator style you asked me to standardize.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator is for planning. Surface preparation, corner beads, mesh, multiple coats, finish skim layers, and product-specific coverage data can all affect the final quantity required.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you calculate plaster quantity for a wall?" a="Start with the wall area, subtract major openings, then multiply by plaster thickness to get wet volume. From there, convert to a dry-mix requirement and add waste before estimating bags." />
                <FaqItem q="Why does plaster thickness matter so much?" a="Because plaster quantity is volume-based. Doubling the thickness roughly doubles the amount of material needed over the same wall area." />
                <FaqItem q="Should I subtract doors and windows?" a="Usually yes for large openings, because they materially reduce plaster area. Very small interruptions may be ignored depending on your estimating method and site conditions." />
                <FaqItem q="What bag yield should I use?" a="Use the manufacturer yield for the plaster product you plan to buy whenever possible. Different mixes and water ratios can produce noticeably different coverage." />
                <FaqItem q="Can I use this for gypsum plaster and cement plaster?" a="Yes. The calculator works for either approach as long as the bag yield you enter matches the actual product and mix system being used." />
                <FaqItem q="Does this cover ceilings too?" a="You can use the same calculation logic for ceilings by entering the ceiling dimensions as the plaster area, but field application and waste may differ from wall work." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Surface and Cost Estimates Too?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Use wall area, paint, and material cost tools together if you want to plan the full finishing workflow from substrate to final coat.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-rose-700 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-rose-600/20">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-rose-600 text-white shadow-xl relative overflow-hidden">
                <PaintBucket className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Planning bag quantities?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Real yield varies by product, thickness control, and wall condition. Using the manufacturer bag yield makes this estimate more reliable.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">{tool.icon}</div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tool.benefit}</p>
                      </div>
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
