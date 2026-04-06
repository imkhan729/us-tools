import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Grid3X3, Ruler, Box, Calculator, Layers,
  Star, BadgeCheck, Lock, CheckCircle2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Unit = "imperial" | "metric";

function useTileCalc() {
  const [unit, setUnit] = useState<Unit>("metric");

  // Room dimensions
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");

  // Tile dimensions (cm or inches)
  const [tileLength, setTileLength] = useState("");
  const [tileWidth, setTileWidth] = useState("");

  const [gap, setGap] = useState("0");
  const [wastePercentage, setWastePercentage] = useState("10");

  const [tilesPerBox, setTilesPerBox] = useState("12");

  const result = useMemo(() => {
    const rl = parseFloat(roomLength) || 0;
    const rw = parseFloat(roomWidth) || 0;
    const tl = parseFloat(tileLength) || 0;
    const tw = parseFloat(tileWidth) || 0;
    const g = parseFloat(gap) || 0;
    const waste = parseFloat(wastePercentage) || 0;
    const boxSize = parseInt(tilesPerBox) || 1;

    if (rl <= 0 || rw <= 0 || tl <= 0 || tw <= 0) return null;

    let roomArea = 0;
    let actualTileLength = 0;
    let actualTileWidth = 0;

    if (unit === "metric") {
      // Room in m, Tile in cm, Gap in mm
      roomArea = rl * rw; // m²
      actualTileLength = (tl / 100) + (g / 1000); // converting cm & mm to m
      actualTileWidth = (tw / 100) + (g / 1000);
    } else {
      // Room in ft, Tile in inches, Gap in inches
      roomArea = rl * rw; // sq ft
      actualTileLength = (tl + g) / 12; // converting inches to ft
      actualTileWidth = (tw + g) / 12;
    }

    const tileArea = actualTileLength * actualTileWidth;
    if (tileArea <= 0) return null;

    // Exact mathematical tiles
    const exactTiles = roomArea / tileArea;
    
    // Add waste
    const tilesWithWaste = exactTiles * (1 + waste / 100);
    const totalTilesToBuy = Math.ceil(tilesWithWaste);

    // Boxes
    const totalBoxes = Math.ceil(totalTilesToBuy / boxSize);

    return {
      roomArea,
      exactTiles,
      totalTilesToBuy,
      totalBoxes,
      wasteAdded: totalTilesToBuy - Math.ceil(exactTiles),
    };
  }, [unit, roomLength, roomWidth, tileLength, tileWidth, gap, wastePercentage, tilesPerBox]);

  return {
    unit, setUnit,
    roomLength, setRoomLength, roomWidth, setRoomWidth,
    tileLength, setTileLength, tileWidth, setTileWidth,
    gap, setGap,
    wastePercentage, setWastePercentage,
    tilesPerBox, setTilesPerBox,
    result,
  };
}

// ── Result Insight Component ──
function ResultInsight({ result, unit }: { result: any; unit: Unit }) {
  if (!result) return null;
  const areaUnit = unit === "imperial" ? "sq ft" : "m²";

  const message = `For your ${result.roomArea.toFixed(1)} ${areaUnit} room, you mathematically need ${Math.ceil(result.exactTiles)} tiles. With your requested waste allowance, you should buy roughly ${result.totalTilesToBuy} tiles, tracking to ${result.totalBoxes} boxes.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
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
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Box className="w-5 h-5" />, color: 38, benefit: "Volume & bags for any pour" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <Layers className="w-5 h-5" />, color: 200, benefit: "Estimate total paint volume" },
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 265, benefit: "Convert feet, meters & more" },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 152, benefit: "Square feet to meters" },
];

export default function TileCalculator() {
  const calc = useTileCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const areaUnitRoom = calc.unit === "imperial" ? "ft" : "m";
  const dimUnitTile = calc.unit === "imperial" ? "in" : "cm";
  const gapUnit = calc.unit === "imperial" ? "in" : "mm";

  return (
    <Layout>
      <SEO
        title="Tile Calculator – How Many Tiles Do I Need? Free Online Tool | US Online Tools"
        description="Free online tile calculator. Figure out exactly how many floor, wall, or bathroom tiles you need. Calculate boxes and include a standard waste allowance effortlessly."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Tile Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Grid3X3 className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Tile Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Avoid running short or buying far too much. Instantly estimate the correct number of tiles and boxes required for your flooring, kitchen splashback, or bathroom remodel.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Grid3X3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Floor / Wall Tiles Needs</p>
                      <p className="text-sm text-muted-foreground">Results update dynamically.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 24 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 mb-6">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                      <div className="flex rounded-lg overflow-hidden border border-border">
                         <button onClick={() => calc.setUnit("metric")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-orange-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Metric (m / cm)</button>
                        <button onClick={() => calc.setUnit("imperial")}
                          className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-orange-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                        >Imperial (ft / in)</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">1. Room / Surface Dimensions</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Length ({areaUnitRoom})</label><input type="number" placeholder="5" className="tool-calc-input w-full" value={calc.roomLength} onChange={e => calc.setRoomLength(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Width ({areaUnitRoom})</label><input type="number" placeholder="4" className="tool-calc-input w-full" value={calc.roomWidth} onChange={e => calc.setRoomWidth(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 bg-muted/30 border border-border rounded-xl">
                      <div className="col-span-full mb-1"><span className="text-xs font-bold text-foreground uppercase tracking-widest">2. Tile Size</span></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Tile Length ({dimUnitTile})</label><input type="number" placeholder={calc.unit==="metric"?"30":"12"} className="tool-calc-input w-full" value={calc.tileLength} onChange={e => calc.setTileLength(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Tile Width ({dimUnitTile})</label><input type="number" placeholder={calc.unit==="metric"?"30":"12"} className="tool-calc-input w-full" value={calc.tileWidth} onChange={e => calc.setTileWidth(e.target.value)} /></div>
                      <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Grout Gap ({gapUnit})</label><input type="number" placeholder={calc.unit==="metric"?"2":"0.125"} className="tool-calc-input w-full" value={calc.gap} onChange={e => calc.setGap(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waste / Cuts Allowance (%)</label><input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.wastePercentage} onChange={e => calc.setWastePercentage(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Tiles per Box</label><input type="number" placeholder="12" className="tool-calc-input w-full" value={calc.tilesPerBox} onChange={e => calc.setTilesPerBox(e.target.value)} /></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div className="tool-calc-result p-6 text-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Tiles to Buy</p>
                        <p className="text-5xl font-black text-foreground">{calc.result?.totalTilesToBuy ?? "--"}</p>
                        <p className="text-xs text-muted-foreground mt-2">includes {calc.result?.wasteAdded ?? "0"} for waste/cuts</p>
                      </div>
                      <div className="tool-calc-result p-6 text-center rounded-xl bg-orange-500/5 border border-orange-500/20">
                        <Box className="w-8 h-8 text-orange-500 mx-auto mb-2 opacity-50" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Boxes to Buy</p>
                        <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{calc.result?.totalBoxes ?? "--"}</p>
                        <p className="text-xs text-muted-foreground mt-2">based on {calc.tilesPerBox || "--"} tiles/box</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Tile Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Laying out tiles optimally is all about planning. Over-purchasing can eat rapidly into your renovation budget, while under-purchasing will lead to panic when finding out your tile batch has run out of stock or subsequent batches don't identically colour-match. Here is exactly how to manage expectations with our system:</p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure the Area Accurately</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Simply enter the entire flat length and breadth of your room. The formula scales effortlessly into square footage/square metering. Avoid subtracting islands or fixtures manually unless they are huge and permanently anchored; it's safer to buy and have spare cuts.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Consider Tile Extents and Grout Density</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter individual tile geometry. A 30cm length with a 2mm grout joint implies each tile inherently occupies 30.2cm in reality. Our engine safely accounts for all microscopic joint margins cumulatively across an entire wall or floor.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">The Critical "Waste" Margin</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">No room is a perfect square fit for your desired tiles. Tilers have to crack, slice, and discard edges constantly. The golden industry rule specifies adding 10% wastage buffer to your total order — up to 15% if planning angular patterns (like herringbone).</p>
                  </div>
                </li>
              </ol>

            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Tile Waste & Best Practice Adjustments</h2>
              <p className="text-muted-foreground text-sm mb-6">Determining the exact breakdown for your required extras:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">10% – Standard Straight Lay</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A standard parallel alignment along existing walls minimizes trimming and snapping. It's the most structurally common application. Almost all general bathroom & kitchen tile orders sit securely in this range.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">15% – Diagonal / Herringbone Pattern</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Tiles angled 45 degrees against straight borders demand endless partial triangle corner pieces. Waste accumulates rapidly here. 15% is heavily encouraged to remain safe.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">20% – Heavy Intricate Cuttings & Intrusions</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Navigating extensive pipes, custom unmovable sinks, curved step drops and complex architectures heavily compromises whole tiles. Protect your project visually without halting midway by buying slightly more up front.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Can I return unused boxes of tiles afterwards?" a="This strictly depends on the supplier. Typically, major big box hardware stores accept returns of entirely sealed factory boxes providing they fall inside chronological return policy windows (usually 30 days). Ensure you keep your receipt." />
                <FaqItem q="Does grout gap affect the total quantity needed?" a="Normally yes, although the overall metric impact is minor across extremely small surfaces. Across a massive area - like a 100 sq meter commercial lobby - using thick 5mm grout joints drastically reduces exact overall ceramic consumed." />
                <FaqItem q="Are bathroom wall tiles sized identically to the floor ones?" a="Wall tiles are traditionally drastically lighter, thinner, and shaped in rectangular brick layers while modern bathroom floors focus directly on larger squares supporting higher non-slip loads. It is heavily recommended you perform two separate calculations on this application tool and order distinct materials." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
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
