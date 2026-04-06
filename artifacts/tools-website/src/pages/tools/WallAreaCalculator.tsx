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
  Construction,
  Ruler,
  Grid3x3,
  Calculator,
  BadgeCheck,
  Lock,
} from "lucide-react";

type Unit = "imperial" | "metric";

const DEFAULT_OPENING_AREAS = {
  imperial: { door: 21, window: 12, customLabel: "sq ft" },
  metric: { door: 2, window: 1.5, customLabel: "sq m" },
} as const;

const RELATED_TOOLS = [
  { title: "Paint Calculator", slug: "paint-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Turn wall area into paint quantity" },
  { title: "Room Area Calculator", slug: "room-area-calculator", icon: <Grid3x3 className="w-5 h-5" />, benefit: "Measure floors and rectangular rooms" },
  { title: "Roof Area Calculator", slug: "roof-area-calculator", icon: <Ruler className="w-5 h-5" />, benefit: "Estimate roof surface coverage" },
  { title: "Flooring Calculator", slug: "flooring-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Plan boards, tiles, and waste" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
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

function useWallAreaCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [doorCount, setDoorCount] = useState("1");
  const [windowCount, setWindowCount] = useState("2");
  const [customOpeningArea, setCustomOpeningArea] = useState("");
  const [includeOpenings, setIncludeOpenings] = useState(true);

  const result = useMemo(() => {
    const length = parseFloat(roomLength) || 0;
    const width = parseFloat(roomWidth) || 0;
    const height = parseFloat(wallHeight) || 0;
    const doors = parseFloat(doorCount) || 0;
    const windows = parseFloat(windowCount) || 0;
    const customArea = parseFloat(customOpeningArea) || 0;

    if (length <= 0 || width <= 0 || height <= 0) return null;

    const perimeter = 2 * (length + width);
    const grossWallArea = perimeter * height;
    const defaults = DEFAULT_OPENING_AREAS[unit];
    const openingArea = includeOpenings ? doors * defaults.door + windows * defaults.window + customArea : 0;
    const netWallArea = Math.max(0, grossWallArea - openingArea);

    return { perimeter, grossWallArea, openingArea, netWallArea };
  }, [unit, roomLength, roomWidth, wallHeight, doorCount, windowCount, customOpeningArea, includeOpenings]);

  return {
    unit,
    setUnit,
    roomLength,
    setRoomLength,
    roomWidth,
    setRoomWidth,
    wallHeight,
    setWallHeight,
    doorCount,
    setDoorCount,
    windowCount,
    setWindowCount,
    customOpeningArea,
    setCustomOpeningArea,
    includeOpenings,
    setIncludeOpenings,
    result,
  };
}

function ResultInsight({ result, unit, includeOpenings }: { result: ReturnType<typeof useWallAreaCalc>["result"]; unit: Unit; includeOpenings: boolean }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const lengthUnit = unit === "imperial" ? "ft" : "m";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your room perimeter is {result.perimeter.toFixed(2)} {lengthUnit}, creating a gross wall area of {result.grossWallArea.toFixed(2)} {areaUnit}. {includeOpenings ? `After deducting openings, the net usable wall area is ${result.netWallArea.toFixed(2)} ${areaUnit}.` : `Opening deductions are turned off, so the full wall area remains ${result.netWallArea.toFixed(2)} ${areaUnit}.`}
        </p>
      </div>
    </motion.div>
  );
}

export default function WallAreaCalculator() {
  const calc = useWallAreaCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const areaUnit = calc.unit === "imperial" ? "sq ft" : "sq m";
  const lengthUnit = calc.unit === "imperial" ? "ft" : "m";
  const defaults = DEFAULT_OPENING_AREAS[calc.unit];

  return (
    <Layout>
      <SEO
        title="Wall Area Calculator - Measure Paintable Wall Surface Online"
        description="Free wall area calculator for paint, wallpaper, tile, and drywall planning. Measure gross wall area, deduct doors and windows, and get net wall coverage instantly."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Wall Area Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Wall Area Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Measure total wall surface for paint, wallpaper, drywall, plaster, or tile work. Enter room dimensions, deduct doors and windows, and get net wall area instantly.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Grid3x3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall surface estimator</p>
                      <p className="text-sm text-muted-foreground">Gross area, opening deductions, and net wall coverage in one result.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 235 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-indigo-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-indigo-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 bg-muted/30 w-full cursor-pointer">
                          <input type="checkbox" checked={calc.includeOpenings} onChange={(event) => calc.setIncludeOpenings(event.target.checked)} className="rounded border-border" />
                          <span className="text-sm font-medium text-foreground">Deduct openings</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Room Length ({lengthUnit})</label><input type="number" placeholder="12" className="tool-calc-input w-full" value={calc.roomLength} onChange={e => calc.setRoomLength(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Room Width ({lengthUnit})</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.roomWidth} onChange={e => calc.setRoomWidth(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Wall Height ({lengthUnit})</label><input type="number" placeholder={calc.unit === "imperial" ? "8" : "2.4"} className="tool-calc-input w-full" value={calc.wallHeight} onChange={e => calc.setWallHeight(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Doors</label>
                        <input type="number" placeholder="1" className="tool-calc-input w-full" value={calc.doorCount} onChange={e => calc.setDoorCount(e.target.value)} />
                        <p className="text-[11px] text-muted-foreground mt-1">Default {defaults.door} {defaults.customLabel} each</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Windows</label>
                        <input type="number" placeholder="2" className="tool-calc-input w-full" value={calc.windowCount} onChange={e => calc.setWindowCount(e.target.value)} />
                        <p className="text-[11px] text-muted-foreground mt-1">Default {defaults.window} {defaults.customLabel} each</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Extra Opening Area ({defaults.customLabel})</label>
                        <input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.customOpeningArea} onChange={e => calc.setCustomOpeningArea(e.target.value)} />
                        <p className="text-[11px] text-muted-foreground mt-1">For arches, vents, or custom cutouts</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div className="rounded-2xl border border-border bg-muted/30 p-5 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Perimeter</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? calc.result.perimeter.toFixed(2) : "0.00"}</p>
                        <p className="text-sm text-muted-foreground mt-1">{lengthUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-5 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Gross Wall Area</p>
                        <p className="text-3xl font-black text-foreground">{calc.result ? calc.result.grossWallArea.toFixed(2) : "0.00"}</p>
                        <p className="text-sm text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Net Wall Area</p>
                        <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{calc.result ? calc.result.netWallArea.toFixed(2) : "0.00"}</p>
                        <p className="text-sm text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} includeOpenings={calc.includeOpenings} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Wall Area Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool estimates the total wall surface inside a standard rectangular room. It is useful
                for paint planning, wallpaper quantities, drywall estimates, plastering takeoffs, and tile-layout prep.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure room length, width, and wall height</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter the interior room length and width, then the finished wall height. The calculator uses those values to build the perimeter and total gross wall area across all four walls.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add openings you do not want to cover</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Deduct doors, windows, and unusual openings if you need a true finish area. Turn deductions off if you want the full wall envelope only.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use the net area for finish coverage</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The net wall area is usually the right number for paint, wallpaper, tile, or board calculations because it reflects the actual surface that needs coverage.</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-indigo-500 font-bold w-20 flex-shrink-0">Perimeter</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">2 x (Length + Width)</code></div>
                  <div className="flex items-center gap-3"><span className="text-indigo-500 font-bold w-20 flex-shrink-0">Gross Area</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Perimeter x Wall Height</code></div>
                  <div className="flex items-center gap-3"><span className="text-indigo-500 font-bold w-20 flex-shrink-0">Net Area</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Gross Wall Area - Opening Area</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to use gross and net wall area correctly in real projects.</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Gross wall area</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Use this when you want the full wall envelope before any deductions, such as broad finish planning or early project takeoffs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Net wall area</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is usually the number you want for paint, wallpaper, drywall, and tile estimates because it removes doors and windows from the coverage zone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Opening deductions</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Deductions help reduce over-ordering, but real jobs may still need a waste allowance for trimming, overlaps, repairs, and offcuts.</p>
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
                      <th className="text-left px-4 py-3 font-bold text-foreground">Room</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Dimensions</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Openings</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Net Area</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Small bedroom</td>
                      <td className="px-4 py-3 font-mono text-foreground">12 x 10 x 8 ft</td>
                      <td className="px-4 py-3 text-muted-foreground">1 door, 1 window</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">315 sq ft</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Paint planning</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Home office</td>
                      <td className="px-4 py-3 font-mono text-foreground">4 x 3 x 2.4 m</td>
                      <td className="px-4 py-3 text-muted-foreground">1 door, 2 windows</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">29.1 sq m</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Wallpaper estimate</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Bathroom</td>
                      <td className="px-4 py-3 font-mono text-foreground">8 x 6 x 8 ft</td>
                      <td className="px-4 py-3 text-muted-foreground">1 door, small vent</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">187 sq ft</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Tile wall prep</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - Painting a bedroom:</strong> A 12 by 10 foot bedroom with 8 foot walls has a perimeter of 44 feet and a gross wall area of 352 square feet. Deduct one door and one window, and the paintable area falls to about 315 square feet.</p>
                <p><strong className="text-foreground">Example 2 - Ordering wallpaper:</strong> A 4 by 3 meter office with 2.4 meter walls creates a gross wall area of 33.6 square meters. After subtracting a door and two windows, the usable surface is about 29.1 square meters.</p>
                <p><strong className="text-foreground">Example 3 - Tiling a wet wall area:</strong> A small bathroom may have limited floor space but substantial vertical coverage. Using wall area instead of floor area prevents under-ordering tile, board, adhesive, and trim.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Wall Area Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It focuses on the number you actually need.</strong> Many people start with floor area and then guess wall coverage. This calculator starts from perimeter and wall height, which is the correct basis for vertical-surface work.</p>
                <p><strong className="text-foreground">It separates gross and net area clearly.</strong> That makes it easier to compare raw room surface against actual coverage requirements, especially when doors and windows remove a meaningful amount of wall space.</p>
                <p><strong className="text-foreground">It works for practical finishing jobs.</strong> Use it for paint, wallpaper, plaster, paneling, drywall estimates, and tile planning without needing a spreadsheet or manual perimeter math.</p>
                <p><strong className="text-foreground">It matches the established calculator template.</strong> The interaction pattern, supporting sections, and content structure follow the same full-page format used across the completed tools.</p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator assumes a standard rectangular room with four full-height walls. For vaulted ceilings, stairwells, partial walls, or irregular layouts, measure each wall separately and total the areas manually.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I calculate wall area?" a="Multiply the room perimeter by wall height. For a rectangular room, the perimeter is 2 x (length + width). If you need a usable finish area, subtract doors, windows, and other openings from the gross result." />
                <FaqItem q="Should I deduct doors and windows?" a="Usually yes for paint, wallpaper, drywall, and tile coverage estimates. If you want the full wall envelope for broader planning, leave deductions off and work from the gross wall area." />
                <FaqItem q="What is the difference between gross wall area and net wall area?" a="Gross wall area is the full surface of all walls before deductions. Net wall area is the remaining usable surface after subtracting openings like doors and windows." />
                <FaqItem q="Can I use this for paint estimates?" a="Yes. This tool gives you the correct wall surface figure first. Then you can use that number inside a dedicated paint calculator or divide it by your paint coverage rate per gallon or liter." />
                <FaqItem q="Does this calculator work in both feet and meters?" a="Yes. You can switch between imperial and metric units. The default opening assumptions also update to match the selected unit system." />
                <FaqItem q="What if my room is not a simple rectangle?" a="Use this calculator as a baseline estimate only. For L-shaped rooms, angled walls, sloped ceilings, or mixed heights, measure each wall separately and total the individual wall areas." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Material Quantities Next?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Once you know your wall area, move into paint, drywall, flooring, and related calculators to turn measurements into real material orders.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">
                  Browse Construction Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-indigo-600/20">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-xl relative overflow-hidden">
                <Grid3x3 className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Planning finishes?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Use the net wall area when pricing paint, wallpaper, tile, adhesive, or drywall. That usually reflects the real coverage surface better than floor area.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">{tool.icon}</div>
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
