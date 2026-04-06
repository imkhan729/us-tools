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
  Calculator,
  Droplets,
  BadgeCheck,
  Lock,
} from "lucide-react";

type Unit = "imperial" | "metric";

const RELATED_TOOLS = [
  { title: "Water Tank Calculator", slug: "water-tank-calculator", icon: <Droplets className="w-5 h-5" />, benefit: "Tank capacity in liters and gallons" },
  { title: "Volume Converter", slug: "volume-converter", icon: <Calculator className="w-5 h-5" />, benefit: "Convert cubic units and liquid volume" },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Volume planning for pours" },
  { title: "Gravel Calculator", slug: "gravel-calculator", icon: <Ruler className="w-5 h-5" />, benefit: "Volume and tonnage estimates" },
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

function usePipeVolumeCalc() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [diameter, setDiameter] = useState("");
  const [length, setLength] = useState("");
  const [fillPercent, setFillPercent] = useState("100");

  const result = useMemo(() => {
    const d = parseFloat(diameter) || 0;
    const l = parseFloat(length) || 0;
    const fill = Math.min(100, Math.max(0, parseFloat(fillPercent) || 0));
    if (d <= 0 || l <= 0) return null;

    const radius = d / 2;
    const fillFactor = fill / 100;

    if (unit === "metric") {
      const cubicMeters = Math.PI * radius * radius * l * fillFactor;
      const liters = cubicMeters * 1000;
      const gallonsUS = liters / 3.785411784;
      const waterWeightKg = liters;
      return { cubicMeters, cubicFeet: cubicMeters * 35.3147, liters, gallonsUS, fill, waterWeightKg };
    }

    const cubicFeet = Math.PI * radius * radius * l * fillFactor;
    const gallonsUS = cubicFeet * 7.48052;
    const liters = cubicFeet * 28.3168;
    const waterWeightKg = liters;
    return { cubicMeters: cubicFeet * 0.0283168, cubicFeet, liters, gallonsUS, fill, waterWeightKg };
  }, [unit, diameter, length, fillPercent]);

  return { unit, setUnit, diameter, setDiameter, length, setLength, fillPercent, setFillPercent, result };
}

function ResultInsight({ result, unit }: { result: ReturnType<typeof usePipeVolumeCalc>["result"]; unit: Unit }) {
  if (!result) return null;
  const lengthUnit = unit === "metric" ? "m" : "ft";
  const volumeLabel = unit === "metric" ? `${result.cubicMeters.toFixed(4)} m^3` : `${result.cubicFeet.toFixed(4)} ft^3`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Based on the pipe's internal diameter and length, the filled volume is {volumeLabel}, or about {result.liters.toFixed(2)} liters at {result.fill.toFixed(0)}% fill. This is useful for water lines, drain testing, chemical batching, and storage loops where internal liquid volume matters.
        </p>
      </div>
    </motion.div>
  );
}

export default function PipeVolumeCalculator() {
  const calc = usePipeVolumeCalc();
  const [copied, setCopied] = useState(false);
  const dimUnit = calc.unit === "metric" ? "m" : "ft";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Pipe Volume Calculator - Calculate Liquid Capacity Inside a Pipe"
        description="Free online pipe volume calculator. Enter internal diameter, pipe length, and fill percentage to calculate cubic volume, liters, gallons, and approximate liquid weight."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Pipe Volume Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Droplets className="w-3.5 h-3.5" /> Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Pipe Volume Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate the internal liquid volume of a pipe from its inside diameter and length.
            Get cubic volume, liters, gallons, and an approximate liquid weight instantly.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
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
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center flex-shrink-0"><Droplets className="w-4 h-4 text-white" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Internal pipe volume</p>
                      <p className="text-sm text-muted-foreground">Use internal dimensions only. Results update as you type.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 200 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button onClick={() => calc.setUnit("metric")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "metric" ? "bg-sky-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Metric</button>
                          <button onClick={() => calc.setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.unit === "imperial" ? "bg-sky-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>Imperial</button>
                        </div>
                      </div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Inside Diameter ({dimUnit})</label><input type="number" placeholder={calc.unit === "metric" ? "0.15" : "0.5"} className="tool-calc-input w-full" value={calc.diameter} onChange={e => calc.setDiameter(e.target.value)} /></div>
                      <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Pipe Length ({dimUnit})</label><input type="number" placeholder={calc.unit === "metric" ? "12" : "40"} className="tool-calc-input w-full" value={calc.length} onChange={e => calc.setLength(e.target.value)} /></div>
                    </div>

                    <div className="mb-5">
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Fill Percentage</label>
                      <input type="number" min="0" max="100" placeholder="100" className="tool-calc-input w-full sm:w-48" value={calc.fillPercent} onChange={e => calc.setFillPercent(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Cubic Volume</p><p className="text-2xl font-black text-foreground">{calc.result ? (calc.unit === "metric" ? calc.result.cubicMeters.toFixed(4) : calc.result.cubicFeet.toFixed(4)) : "0.0000"}</p><p className="text-xs text-muted-foreground mt-1">{calc.unit === "metric" ? "m^3" : "ft^3"}</p></div>
                      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Liters</p><p className="text-2xl font-black text-sky-600 dark:text-sky-400">{calc.result ? calc.result.liters.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">L</p></div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">US Gallons</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.gallonsUS.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">gal</p></div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Water Weight</p><p className="text-2xl font-black text-foreground">{calc.result ? calc.result.waterWeightKg.toFixed(2) : "0.00"}</p><p className="text-xs text-muted-foreground mt-1">kg approx</p></div>
                    </div>

                    <ResultInsight result={calc.result} unit={calc.unit} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Pipe Volume Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">This calculator estimates how much liquid a cylindrical pipe can hold based on internal dimensions. It is useful for water systems, pressure testing, irrigation lines, process piping, and any job where internal volume needs to be known quickly.</p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Use the inside diameter, not the outside diameter</p><p className="text-muted-foreground text-sm leading-relaxed">Pipe wall thickness changes the true internal capacity. If you use outside diameter, the calculated liquid volume will be too high.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Enter the full pipe length and fill percentage</p><p className="text-muted-foreground text-sm leading-relaxed">Set fill to 100% for a fully filled pipe, or lower values if the line is only partially full during operation, testing, or storage.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Read the result in both engineering and practical units</p><p className="text-muted-foreground text-sm leading-relaxed">The page shows cubic volume plus liters and US gallons, which makes it useful for both system design and day-to-day field calculations.</p></div></li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-sky-500 font-bold w-24 flex-shrink-0">Cylinder Volume</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">pi x r^2 x length</code></div>
                  <div className="flex items-center gap-3"><span className="text-sky-500 font-bold w-24 flex-shrink-0">Filled Volume</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Cylinder Volume x (Fill % / 100)</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to think about the result in real installation and planning work.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><div className="w-3 h-3 rounded-full bg-sky-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Full-pipe volume</p><p className="text-sm text-muted-foreground leading-relaxed">Useful for hydro tests, flushing, filling, and total internal capacity checks.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"><div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Partial fill volume</p><p className="text-sm text-muted-foreground leading-relaxed">Helpful when the line is not intended to run at full capacity or when estimating working liquid inventory rather than total capacity.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"><div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">Approximate liquid weight</p><p className="text-sm text-muted-foreground leading-relaxed">The weight output gives a quick sense of how much water mass the pipe segment contains, which is useful for handling and support planning.</p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Pipe</th><th className="text-left px-4 py-3 font-bold text-foreground">Diameter</th><th className="text-left px-4 py-3 font-bold text-foreground">Length</th><th className="text-left px-4 py-3 font-bold text-foreground">Result</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Irrigation run</td><td className="px-4 py-3 font-mono text-foreground">0.05 m</td><td className="px-4 py-3 font-mono text-foreground">40 m</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">78.54 L</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Line filling</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Process pipe</td><td className="px-4 py-3 font-mono text-foreground">0.15 m</td><td className="px-4 py-3 font-mono text-foreground">12 m</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">212.06 L</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">System charge</td></tr>
                    <tr className="hover:bg-muted/30 transition-colors"><td className="px-4 py-3 text-muted-foreground">Field pipe</td><td className="px-4 py-3 font-mono text-foreground">0.5 ft</td><td className="px-4 py-3 font-mono text-foreground">20 ft</td><td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">29.37 gal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Imperial planning</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - Irrigation line:</strong> A 50 mm internal pipe running 40 meters holds about 78.5 liters when full, which helps estimate priming and flushing demand.</p>
                <p><strong className="text-foreground">Example 2 - Process line inventory:</strong> A 150 mm internal pipe over 12 meters stores about 212 liters, which matters when charging chemicals or testing circulation loops.</p>
                <p><strong className="text-foreground">Example 3 - Field estimate in feet:</strong> A 0.5 foot inside-diameter pipe over 20 feet carries roughly 29.4 US gallons at full fill, giving crews a fast on-site reference.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Pipe Volume Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It uses the correct geometry.</strong> Pipe volume is a cylinder problem, and this calculator applies that directly without requiring manual conversion steps.</p>
                <p><strong className="text-foreground">It gives both engineering and practical outputs.</strong> You get cubic volume plus liters and gallons, which makes the result useful for design work and field communication.</p>
                <p><strong className="text-foreground">It supports partial-fill scenarios.</strong> Not every line runs completely full, so the fill-percentage control makes the tool more useful than a simple full-capacity estimate.</p>
                <p><strong className="text-foreground">It follows the same full-page tool template.</strong> The layout and supporting content match the established design and content structure used across the completed calculators.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool assumes a straight cylindrical pipe segment using internal dimensions. It does not account for elbows, reducers, fittings, wall roughness, or fluid-specific density changes.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do you calculate pipe volume?" a="Use the cylinder formula pi x r^2 x length, where r is the internal radius of the pipe. If the pipe is only partly full, multiply the full volume by the fill percentage." />
                <FaqItem q="Should I use inside diameter or outside diameter?" a="Use inside diameter. Outside diameter will overstate the actual liquid capacity because it ignores the pipe wall thickness." />
                <FaqItem q="Can I use this for water, chemicals, or fuel?" a="Yes for volume. The liters and gallons are geometric volume outputs. The weight estimate is based on water-like density, so non-water liquids may weigh more or less." />
                <FaqItem q="What does fill percentage mean?" a="It lets you estimate volume when the pipe is not completely full. For example, 50% fill calculates half of the full internal capacity." />
                <FaqItem q="Does this calculator support metric and imperial units?" a="Yes. Switch between meters and feet depending on your project, and the outputs update automatically." />
                <FaqItem q="Is this suitable for detailed hydraulic design?" a="It is suitable for capacity estimation, flushing volume, and planning. For full hydraulic design, pressure drop, velocity, and fittings should also be analyzed separately." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Volume Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Move from pipe capacity to tanks, storage, concrete, and related construction calculators without leaving the same tool set.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-sky-600 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">
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
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-sky-600/20">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-sky-600 text-white shadow-xl relative overflow-hidden">
                <Droplets className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Quick field check</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">If a result looks too high, the most common cause is using outside diameter instead of internal diameter. Check that first.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={tool.slug === "volume-converter" ? `/conversion/${tool.slug}` : `/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">{tool.icon}</div>
                      <div><p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{tool.title}</p><p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tool.benefit}</p></div>
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
