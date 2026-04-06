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
  Calculator,
  Boxes,
  Home,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type Unit = "imperial" | "metric";

const RELATED_TOOLS = [
  { title: "Fence Length Calculator", slug: "fence-length-calculator", icon: <Ruler className="w-5 h-5" />, color: 100, benefit: "Linear fencing estimates" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, color: 28, benefit: "Volume for pours and footings" },
  { title: "Room Area Calculator", slug: "room-area-calculator", icon: <Home className="w-5 h-5" />, color: 230, benefit: "Measure rooms and surfaces" },
  { title: "Gravel Calculator", slug: "gravel-calculator", icon: <Boxes className="w-5 h-5" />, color: 38, benefit: "Bulk material quantity" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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

function useLumberCalc() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [thickness, setThickness] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [waste, setWaste] = useState("10");

  const result = useMemo(() => {
    const t = parseFloat(thickness) || 0;
    const w = parseFloat(width) || 0;
    const l = parseFloat(length) || 0;
    const q = parseFloat(quantity) || 0;
    const wastePct = parseFloat(waste) || 0;

    if (t <= 0 || w <= 0 || l <= 0 || q <= 0) return null;

    let boardFeet = 0;
    let cubicFeet = 0;
    let cubicMeters = 0;

    if (unit === "imperial") {
      boardFeet = (t * w * l * q) / 12;
      cubicFeet = boardFeet / 12;
      cubicMeters = cubicFeet * 0.0283168;
    } else {
      const thicknessInches = t / 25.4;
      const widthInches = w / 25.4;
      const lengthFeet = l * 3.28084;
      boardFeet = (thicknessInches * widthInches * lengthFeet * q) / 12;
      cubicFeet = boardFeet / 12;
      cubicMeters = cubicFeet * 0.0283168;
    }

    const multiplier = 1 + wastePct / 100;
    return {
      boardFeet: boardFeet * multiplier,
      cubicFeet: cubicFeet * multiplier,
      cubicMeters: cubicMeters * multiplier,
      quantity: q,
      wastePct,
    };
  }, [unit, thickness, width, length, quantity, waste]);

  return {
    unit,
    setUnit,
    thickness,
    setThickness,
    width,
    setWidth,
    length,
    setLength,
    quantity,
    setQuantity,
    waste,
    setWaste,
    result,
  };
}

function ResultInsight({ result }: { result: ReturnType<typeof useLumberCalc>["result"] }) {
  if (!result) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          This estimate includes {result.quantity} piece{result.quantity === 1 ? "" : "s"} and a {result.wastePct}% waste factor, which helps cover cuts, defects, and layout losses. The board-foot result is the number most lumber yards use when pricing rough-sawn material.
        </p>
      </div>
    </motion.div>
  );
}

export default function LumberCalculator() {
  const calc = useLumberCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Lumber Calculator - Board Feet and Volume Estimator"
        description="Free lumber calculator for board feet, cubic feet, and cubic meters. Estimate rough lumber quantity from thickness, width, length, quantity, and waste."
        canonical="https://usonlinetools.com/construction/lumber-calculator"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Lumber Calculator",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          description: "Calculate board feet and total wood volume for lumber orders and project estimates.",
          url: "https://usonlinetools.com/construction/lumber-calculator",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Lumber Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Lumber Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate board feet and total wood volume for rough lumber orders. Enter board dimensions, quantity, and waste allowance to get a practical material estimate in one place.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Boxes className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Board Foot Estimator</p>
                      <p className="text-sm text-muted-foreground">Built for lumber yard estimates, shop planning, and material budgeting.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 28 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-orange-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-orange-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Common use</p>
                        <p className="text-sm text-muted-foreground">Estimate rough-cut stock for framing, trim, shelving, furniture, and shop builds.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Thickness ({calc.unit === "imperial" ? "in" : "mm"})</label>
                        <input type="number" placeholder={calc.unit === "imperial" ? "2" : "50"} className="tool-calc-input w-full" value={calc.thickness} onChange={e => calc.setThickness(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Width ({calc.unit === "imperial" ? "in" : "mm"})</label>
                        <input type="number" placeholder={calc.unit === "imperial" ? "6" : "150"} className="tool-calc-input w-full" value={calc.width} onChange={e => calc.setWidth(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 border border-border rounded-xl">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Length ({calc.unit === "imperial" ? "ft" : "m"})</label>
                        <input type="number" placeholder={calc.unit === "imperial" ? "10" : "3"} className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Quantity</label>
                        <input type="number" placeholder="1" className="tool-calc-input w-full" value={calc.quantity} onChange={e => calc.setQuantity(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Waste (%)</label>
                        <input type="number" placeholder="10" className="tool-calc-input w-full" value={calc.waste} onChange={e => calc.setWaste(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Board Feet</p>
                        <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{calc.result ? calc.result.boardFeet.toFixed(2) : "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cubic Feet</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.cubicFeet.toFixed(2) : "--"}</p>
                      </div>
                      <div className="tool-calc-result p-4 text-center rounded-xl">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cubic Meters</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.cubicMeters.toFixed(3) : "--"}</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Lumber Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lumber quantities are often priced in board feet, especially for rough stock and hardwood orders. This calculator helps you move from piece dimensions to a yard-style order estimate without manual conversion.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter actual material dimensions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the stock thickness, width, and length you plan to buy or cut. If you are estimating rough lumber, enter real dimensions rather than nominal label names.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add quantity and waste allowance</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Quantity scales the total across multiple identical pieces. Waste helps account for cutting loss, defects, grain selection, and layout changes during the build.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use board feet for ordering, volume for comparison</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Board feet is the standard estimate for many lumber suppliers, while cubic volume helps when comparing to metric stock, storage space, or shipping volume.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Formula</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold w-24 flex-shrink-0">Board Feet</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(Thickness × Width × Length × Quantity) ÷ 12</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold w-24 flex-shrink-0">Imperial Basis</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Thickness and width in inches, length in feet</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold w-24 flex-shrink-0">Waste</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Total × (1 + Waste Percentage)</code>
                  </div>
                </div>
              </div>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding the Lumber Estimate</h2>
              <p className="text-muted-foreground text-sm mb-6">Board feet is the most recognizable result for many woodworkers, builders, and lumber yards, but the supporting volume outputs are still useful.</p>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Board feet helps with pricing</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Many yards quote hardwood and rough stock by board foot, so that result is often the fastest way to compare supplier pricing or estimate a material budget.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Waste matters more on cut-heavy projects</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Shelving, trim, cabinets, and furniture parts can create more waste than simple framing cuts. Adding a waste factor early usually gives a more realistic order quantity.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Nominal and actual sizes are not always the same</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Dimensional lumber labels can differ from actual measured size. If accuracy matters for ordering or pricing, use the actual stock dimensions you will receive.
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
                      <th className="text-left px-4 py-3 font-bold text-foreground">Stock</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Quantity</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Waste</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Board Feet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">2 in × 6 in × 10 ft</td>
                      <td className="px-4 py-3 text-muted-foreground">8 pieces</td>
                      <td className="px-4 py-3 text-muted-foreground">10%</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">88.00</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1 in × 8 in × 12 ft</td>
                      <td className="px-4 py-3 text-muted-foreground">12 pieces</td>
                      <td className="px-4 py-3 text-muted-foreground">8%</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">103.68</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">50 mm × 150 mm × 3 m</td>
                      <td className="px-4 py-3 text-muted-foreground">20 pieces</td>
                      <td className="px-4 py-3 text-muted-foreground">10%</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">162.73</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 - framing or utility builds:</strong> Repeating the same board size across many pieces is where a lumber calculator saves the most time. One quantity change updates the whole estimate immediately.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 - hardwood buying:</strong> Hardwood sellers often price by board foot, not by individual board count. Knowing your target board-foot total helps you compare pricing faster at the yard.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 - project budgeting:</strong> Waste is not optional on many builds. Grain matching, knots, end checks, and cutoffs can all push the required total above the simple no-waste dimension math.
                </p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Lumber Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It stays focused on the core estimating job.</strong> The page calculates board feet, total wood volume, quantity, and waste without burying the user under unnecessary options.
                </p>
                <p>
                  <strong className="text-foreground">It supports both imperial and metric entry.</strong> That makes it easier to compare supplier specs, workshop plans, and imported stock dimensions without switching tools.
                </p>
                <p>
                  <strong className="text-foreground">The copy is practical and scoped.</strong> It explains what board feet means, when waste matters, and where nominal sizes can mislead a buyer, which is more useful than generic construction filler.
                </p>
                <p>
                  <strong className="text-foreground">Your numbers remain local.</strong> As with the other tools in this batch, the calculation runs in the browser and does not require an account.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Lumber pricing can depend on grade, species, moisture, surfacing, and nominal versus actual size. Use this calculator for quantity planning, then confirm final stock details with your supplier.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a board foot?" a="A board foot is a volume measurement equal to a board that is 1 inch thick, 12 inches wide, and 1 foot long. It is commonly used for rough lumber and hardwood pricing." />
                <FaqItem q="Why does the formula divide by 12?" a="Because the standard board-foot formula assumes thickness and width are in inches and length is in feet. Dividing by 12 converts the inch-based dimensions into the standard board-foot unit." />
                <FaqItem q="Should I use nominal or actual dimensions?" a="Use actual dimensions whenever possible, especially if you are estimating material volume or comparing rough stock. Nominal dimensions can overstate the real amount of wood." />
                <FaqItem q="How much waste should I allow?" a="That depends on the project. Straight repetitive cuts may need only a small allowance, while trim, furniture, or appearance-grade work often needs more. A modest waste percentage is usually safer than ordering too little." />
                <FaqItem q="Can I use this for plywood or sheet goods?" a="You can use it for raw volume, but sheet goods are usually priced and planned by sheet size rather than board feet, so a sheet-based calculator is often more practical for that job." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Material Calculators</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Keep planning with fence, gravel, concrete, and other construction tools designed for practical estimating work.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with builders, woodworkers, and estimators.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
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
                    <a key={label} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
