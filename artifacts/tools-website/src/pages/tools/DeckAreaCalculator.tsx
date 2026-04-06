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
  Ruler,
  Hammer,
  Calculator,
  PanelsTopLeft,
} from "lucide-react";

type Unit = "imperial" | "metric";

const RELATED_TOOLS = [
  { title: "Lumber Calculator", slug: "lumber-calculator", icon: <Hammer className="w-5 h-5" />, benefit: "Estimate framing and deck board lumber" },
  { title: "Material Cost Calculator", slug: "material-cost-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Turn deck quantities into a project budget" },
  { title: "Fence Length Calculator", slug: "fence-length-calculator", icon: <Ruler className="w-5 h-5" />, benefit: "Useful for guardrail and perimeter planning" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Estimate footings and pads below the deck" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-sky-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
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

function useDeckCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [length, setLength] = useState("16");
  const [width, setWidth] = useState("12");
  const [boardWidth, setBoardWidth] = useState("5.5");
  const [gap, setGap] = useState("0.125");
  const [wastePercent, setWastePercent] = useState("10");

  const result = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const bw = parseFloat(boardWidth) || 0;
    const g = parseFloat(gap) || 0;
    const waste = Math.max(0, parseFloat(wastePercent) || 0);

    if (l <= 0 || w <= 0 || bw <= 0) return null;

    const area = l * w;
    const perimeter = (l + w) * 2;
    const adjustedArea = area * (1 + waste / 100);
    const coverageWidth = bw + g;
    const boardCount = coverageWidth > 0 ? Math.ceil((w * (unit === "imperial" ? 12 : 100)) / coverageWidth) : 0;
    const totalBoardLength = boardCount * l;
    const adjustedBoardLength = totalBoardLength * (1 + waste / 100);

    return { area, perimeter, adjustedArea, boardCount, totalBoardLength, adjustedBoardLength, waste, coverageWidth };
  }, [unit, length, width, boardWidth, gap, wastePercent]);

  return { unit, setUnit, length, setLength, width, setWidth, boardWidth, setBoardWidth, gap, setGap, wastePercent, setWastePercent, result };
}

function ResultInsight({ result, unit }: { result: ReturnType<typeof useDeckCalc>["result"]; unit: Unit }) {
  if (!result) return null;

  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const lengthUnit = unit === "imperial" ? "ft" : "m";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          The deck footprint is {result.area.toFixed(2)} {areaUnit} with a perimeter of {result.perimeter.toFixed(2)} {lengthUnit}. After a {result.waste.toFixed(1)}% waste allowance, planning area rises to {result.adjustedArea.toFixed(2)} {areaUnit}. Based on the board width and gap entered, you need about {result.boardCount} deck boards across the width and roughly {result.adjustedBoardLength.toFixed(2)} {lengthUnit} of total board length including waste.
        </p>
      </div>
    </motion.div>
  );
}

export default function DeckAreaCalculator() {
  const calc = useDeckCalc();
  const [copied, setCopied] = useState(false);

  const sizeUnit = calc.unit === "imperial" ? "ft" : "m";
  const areaUnit = calc.unit === "imperial" ? "sq ft" : "sq m";
  const boardUnit = calc.unit === "imperial" ? "in" : "cm";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO title="Deck Area Calculator - Estimate Deck Size and Boards" description="Free deck area calculator for deck size, perimeter, waste allowance, and estimated board count. Plan decking materials in feet or meters." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Deck Area Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Deck Area Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate deck area, perimeter, estimated board count, and total board length with a built-in waste allowance. Use it for backyard decks, porches, platforms, and simple rectangular decking layouts.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-sky-500/20 shadow-lg shadow-sky-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <PanelsTopLeft className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rectangular deck planner</p>
                      <p className="text-sm text-muted-foreground">Area, perimeter, board count, and waste-adjusted material planning in one tool.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 200 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-sky-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-sky-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waste Allowance (%)</label>
                        <input type="number" min="0" placeholder="10" className="tool-calc-input w-full" value={calc.wastePercent} onChange={(e) => calc.setWastePercent(e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-2">Useful for offcuts, defects, and layout waste around edges and picture-frame borders.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Deck Length ({sizeUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "16" : "5"} className="tool-calc-input w-full" value={calc.length} onChange={(e) => calc.setLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Deck Width ({sizeUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "12" : "3.6"} className="tool-calc-input w-full" value={calc.width} onChange={(e) => calc.setWidth(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Board Width ({boardUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "5.5" : "14"} className="tool-calc-input w-full" value={calc.boardWidth} onChange={(e) => calc.setBoardWidth(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Board Gap ({boardUnit})</label>
                        <input type="number" min="0" placeholder={calc.unit === "imperial" ? "0.125" : "0.5"} className="tool-calc-input w-full" value={calc.gap} onChange={(e) => calc.setGap(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Area</p>
                        <p className="text-2xl font-black text-sky-700 dark:text-sky-400">{calc.result ? calc.result.area.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Perimeter</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.perimeter.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sizeUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Adj. Area</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.adjustedArea.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Boards Across</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.boardCount : "0"}</p>
                        <p className="text-xs text-muted-foreground mt-1">count</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Board Length</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.totalBoardLength.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sizeUnit}</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">With Waste</p>
                        <p className="text-2xl font-black text-cyan-700 dark:text-cyan-400">{calc.result ? calc.result.adjustedBoardLength.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sizeUnit}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Deck Area Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool is designed for simple rectangular deck layouts. Enter the deck length and width, then add the actual board width and the spacing gap you plan to use. The calculator estimates the footprint, perimeter, and an approximate decking board count based on the width being covered.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure the overall deck footprint</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use outside dimensions for the full rectangular platform. This gives you the gross deck area and perimeter before railing offsets or border details are considered.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the real board coverage width</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Board count depends on actual board width plus the installation gap. Using nominal board sizes without checking real face width can understate material needs.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add waste before buying boards</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Waste accounts for cutoffs, defects, border details, and orientation decisions. The waste-adjusted board length helps you plan more realistically before ordering materials.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-sky-700 dark:text-sky-400 font-bold w-28 flex-shrink-0">Deck Area</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Length x Width</code></div>
                  <div className="flex items-center gap-3"><span className="text-sky-700 dark:text-sky-400 font-bold w-28 flex-shrink-0">Perimeter</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">2 x (Length + Width)</code></div>
                  <div className="flex items-center gap-3"><span className="text-sky-700 dark:text-sky-400 font-bold w-28 flex-shrink-0">Board Count</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">ceil(Deck Width / (Board Width + Gap))</code></div>
                  <div className="flex items-center gap-3"><span className="text-sky-700 dark:text-sky-400 font-bold w-28 flex-shrink-0">Waste Plan</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Total x (1 + Waste % / 100)</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to use the deck outputs during planning and material takeoff.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
                  <div className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Area and adjusted area</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Area gives the raw deck footprint. Adjusted area is more useful for ordering because it adds a buffer for waste and layout loss.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Perimeter</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Perimeter helps with fascia, trim, guardrail lines, and edge-detail planning. It is also useful when comparing the visual scale of different deck options.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Board count and lineal length</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Board count estimates how many courses run across the deck width. Total board length gives a better purchasing view because decking is often ordered by stock length rather than pure board count alone.</p>
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
                      <th className="text-left px-4 py-3 font-bold text-foreground">Dimensions</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Board Setup</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Area</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Small backyard deck</td>
                      <td className="px-4 py-3 font-mono text-foreground">12 x 10 ft</td>
                      <td className="px-4 py-3 font-mono text-foreground">5.5 in board, 1/8 in gap</td>
                      <td className="px-4 py-3 font-bold text-sky-700 dark:text-sky-400">120 sq ft</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Starter deck project</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Entertaining deck</td>
                      <td className="px-4 py-3 font-mono text-foreground">16 x 12 ft</td>
                      <td className="px-4 py-3 font-mono text-foreground">5.5 in board, 1/8 in gap</td>
                      <td className="px-4 py-3 font-bold text-sky-700 dark:text-sky-400">192 sq ft</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Common family deck size</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Metric platform deck</td>
                      <td className="px-4 py-3 font-mono text-foreground">5 x 3.6 m</td>
                      <td className="px-4 py-3 font-mono text-foreground">14 cm board, 0.5 cm gap</td>
                      <td className="px-4 py-3 font-bold text-sky-700 dark:text-sky-400">18.00 sq m</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Modern garden deck</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - compact deck:</strong> A 12 by 10 foot deck gives 120 square feet of surface area, but the actual material order should still reflect board spacing and a waste allowance.</p>
                <p><strong className="text-foreground">Example 2 - mid-size family deck:</strong> A 16 by 12 foot deck is large enough that board count and total lineal length become much more useful than just area when you start comparing stock lengths and pricing.</p>
                <p><strong className="text-foreground">Example 3 - metric platform:</strong> A 5 by 3.6 meter deck reaches 18 square meters of footprint. With decking laid across the shorter direction, board count quickly becomes the deciding factor for ordering.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Deck Area Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It goes beyond simple area.</strong> The calculator also estimates perimeter, board count, and total board length, which are the numbers you usually need before ordering decking material.</p>
                <p><strong className="text-foreground">It includes practical waste planning.</strong> Waste allowance is built in so the result is more realistic for actual purchasing and not just ideal geometry.</p>
                <p><strong className="text-foreground">It works in both imperial and metric units.</strong> That makes it useful for a wider range of deck layouts and material specifications without forcing manual conversion first.</p>
                <p><strong className="text-foreground">It follows the same full-page template.</strong> The section structure, content depth, and design pattern match the percentage-calculator style you asked me to keep consistent.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator assumes a simple rectangular deck and straight board layout. Picture-frame borders, angles, stairs, multi-level decks, and diagonal decking should be priced with additional layout adjustment.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you calculate deck area?" a="For a rectangular deck, multiply length by width. That gives the footprint area before adding any waste or material overage." />
                <FaqItem q="Why does board count depend on board width and gap?" a="Deck boards cover the surface one course at a time. The actual face width plus the installation gap determines how many courses fit across the deck width." />
                <FaqItem q="What waste percentage should I use for decking?" a="Many simple rectangular decks can work with a modest waste allowance, but more complex layouts, border details, diagonal decking, and premium material selections usually need a higher waste factor." />
                <FaqItem q="Does perimeter help with deck materials?" a="Yes. Perimeter is useful for fascia, trim, rail lines, edge detailing, and visual planning even though the main deck boards are typically ordered from area and course count." />
                <FaqItem q="Can I use this for composite decking?" a="Yes. The calculator works for both wood and composite decking as long as you enter the actual board width and gap recommended for the product being installed." />
                <FaqItem q="Does this replace a structural deck design?" a="No. It is a takeoff and planning tool. Joist sizing, beam spans, footings, rail requirements, and local code review still need to be handled separately." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Pricing After the Takeoff?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Once the deck footprint and board quantities are clear, use the material cost and lumber tools to turn the takeoff into a more realistic project budget.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-sky-700 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-sky-600/20">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-sky-600 text-white shadow-xl relative overflow-hidden">
                <PanelsTopLeft className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Ordering deck boards?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Board length usually matters more than raw area once you start matching stock sizes, board orientation, and waste from offcuts.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">{tool.icon}</div>
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
