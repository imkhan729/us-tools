import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Flame,
  Gauge,
  Lightbulb,
  Lock,
  Shield,
  Smartphone,
  Waves,
} from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const UNITS = [
  { id: "l", label: "Liter", short: "L", toLiters: 1, note: "Base metric volume unit" },
  { id: "ml", label: "Milliliter", short: "mL", toLiters: 0.001, note: "Food, medicine, and small liquid values" },
  { id: "m3", label: "Cubic meter", short: "m3", toLiters: 1000, note: "Large storage and industrial capacity" },
  { id: "cm3", label: "Cubic centimeter", short: "cm3", toLiters: 0.001, note: "Equivalent to one milliliter" },
  { id: "gal", label: "US gallon", short: "gal", toLiters: 3.785411784, note: "Fuel, liquids, and US household use" },
  { id: "qt", label: "US quart", short: "qt", toLiters: 0.946352946, note: "Kitchen and container sizing" },
  { id: "pt", label: "US pint", short: "pt", toLiters: 0.473176473, note: "Food service and small container sizes" },
  { id: "cup", label: "US cup", short: "cup", toLiters: 0.2365882365, note: "Cooking and nutrition measures" },
  { id: "floz", label: "Fluid ounce", short: "fl oz", toLiters: 0.0295735296, note: "Beverage and nutrition labeling" },
  { id: "tbsp", label: "Tablespoon", short: "tbsp", toLiters: 0.01478676478, note: "Cooking and small volume measures" },
  { id: "tsp", label: "Teaspoon", short: "tsp", toLiters: 0.00492892159, note: "Very small recipe quantities" },
  { id: "ft3", label: "Cubic foot", short: "ft3", toLiters: 28.3168466, note: "Room, appliance, and storage volume" },
  { id: "in3", label: "Cubic inch", short: "in3", toLiters: 0.016387064, note: "Mechanical and packaging dimensions" },
] as const;

const PRESETS = [
  { label: "Water bottle", value: "500", unit: "ml" },
  { label: "Milk jug", value: "1", unit: "gal" },
  { label: "Soda can", value: "12", unit: "floz" },
  { label: "Room volume", value: "10", unit: "m3" },
  { label: "Cooking cup", value: "1", unit: "cup" },
];

const RELATED = [
  { title: "Weight Converter", href: "/conversion/weight-converter", benefit: "Pair mass and volume comparisons" },
  { title: "Length Converter", href: "/conversion/length-converter", benefit: "Useful for dimensional container calculations" },
  { title: "Area Converter", href: "/conversion/area-converter", benefit: "Combine surface and volume planning work" },
  { title: "Temperature Converter", href: "/conversion/temperature-converter", benefit: "Common alongside cooking and fluid tasks" },
  { title: "Fuel Efficiency Converter", href: "/conversion/fuel-efficiency-converter", benefit: "Move from liquid units into vehicle-use math" },
];

const FAQS = [
  {
    q: "How many liters are in a US gallon?",
    a: "One US gallon equals exactly 3.785411784 liters. That is a very common conversion for fuel, household liquids, and large containers. This page also converts gallons into quarts, pints, cups, fluid ounces, and the metric units at the same time.",
  },
  {
    q: "What is the difference between a fluid ounce and an ounce?",
    a: "A fluid ounce measures volume, while an ounce without the word fluid usually refers to mass or weight. That distinction matters because they are not interchangeable unless you also know the substance density.",
  },
  {
    q: "Is 1 milliliter the same as 1 cubic centimeter?",
    a: "Yes. One milliliter is exactly equal to one cubic centimeter. That is why medicine, chemistry, and small mechanical volume measurements often switch between mL and cm3 depending on the context.",
  },
  {
    q: "How many cups are in a liter?",
    a: "There are about 4.227 US cups in one liter. This comes up often in cooking, food labeling, and kitchen conversions when metric and US recipe measurements are mixed together.",
  },
  {
    q: "What is 1 cubic meter in liters?",
    a: "One cubic meter equals exactly 1,000 liters. That is why cubic meters are useful for rooms, tanks, and bulk storage while liters remain more readable for everyday liquid quantities.",
  },
  {
    q: "Why do recipes use cups, tablespoons, and teaspoons instead of liters?",
    a: "Because cooking traditions and consumer habits vary by region. Many US recipes are written in cups and spoon-based measures, while much of the world uses milliliters and liters. A converter bridges those systems quickly.",
  },
  {
    q: "Can I use this for fuel, cooking, and storage calculations?",
    a: "Yes. It is useful for beverage labels, recipe conversions, fuel quantities, appliance capacities, packaging, room volume estimates, and many household or engineering volume comparisons.",
  },
  {
    q: "Who is this volume converter useful for?",
    a: "It is useful for cooks, shoppers, travelers, drivers, students, technicians, warehouse staff, and anyone comparing liquid or container volumes across metric and US customary systems.",
  },
];

function fmtVolume(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 0.0001) return value.toExponential(5);
  return parseFloat(value.toPrecision(9)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-teal-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-teal-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 pt-4 border-t border-border text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VolumeConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("gal");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;

    const liters = parsed * from.toLiters;

    return {
      liters,
      from,
      rows: UNITS.map((unit) => ({
        ...unit,
        converted: liters / unit.toLiters,
      })),
    };
  }, [fromUnit, value]);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <Layout>
      <SEO
        title="Volume Converter - Convert liters, gallons, cups, fl oz"
        description="Free online volume converter. Convert liters, milliliters, gallons, quarts, cups, fluid ounces, cubic meters, and more with live results and practical reference examples."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <span className="text-foreground">Volume Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-teal-500/15 bg-gradient-to-br from-teal-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Waves className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Volume Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert liters, milliliters, gallons, cups, fluid ounces, cubic meters, and more instantly. This redesign keeps the existing volume coverage while upgrading the page structure, result readability, and real-world context for cooking, fuel, packaging, and storage use.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Waves className="w-3.5 h-3.5" /> 13 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers kitchen, household, fuel, packaging, and bulk-storage volume units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-lg shadow-teal-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-500" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center"><Waves className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Volume Conversion</p>
                    <p className="text-sm text-muted-foreground">Translate liquid, cooking, fuel, storage, and container volume values instantly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="tool-calc-input w-full font-mono text-lg" placeholder="1" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">From Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="tool-calc-input w-full">
                      {UNITS.map((unit) => <option key={unit.id} value={unit.id}>{unit.label} ({unit.short})</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Quick Presets</p>
                  <div className="flex flex-wrap gap-3">
                    {PRESETS.map((preset) => (
                      <button key={preset.label} onClick={() => { setValue(preset.value); setFromUnit(preset.unit); }} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {results && (
                  <>
                    <div className="rounded-2xl border border-border bg-muted/30 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Source Summary</p>
                      <p className="text-lg font-black text-foreground">{fmtVolume(parseFloat(value))} {results.from.short} = {fmtVolume(results.liters)} L</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-teal-500/40 bg-teal-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtVolume(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtVolume(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
                                {copied === row.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{row.note}</p>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}
              </div>
            </section>

            <section id="reference" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Volume Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Example</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Typical Volume</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Alternate</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Teaspoon", "4.93 mL", "0.17 fl oz", "Very small recipe measure"],
                      ["US cup", "236.6 mL", "8 fl oz", "Cooking and nutrition standard"],
                      ["Water bottle", "500 mL", "16.9 fl oz", "Everyday beverage size"],
                      ["Milk jug", "1 gal", "3.785 L", "US household liquid benchmark"],
                      ["Bathtub fill", "150 L", "39.6 gal", "Home water volume scale"],
                      ["Refrigerator space", "18 ft3", "510 L", "Appliance capacity context"],
                      ["Room volume", "30 m3", "1,059 ft3", "Interior air-space scale"],
                      ["Fuel tank", "60 L", "15.9 gal", "Vehicle liquid capacity example"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-mono text-teal-700 dark:text-teal-400">{row[1]}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Volume gets easier to interpret when tied to everyday containers.</strong> A teaspoon, water bottle, milk jug, fuel tank, or room capacity can all represent volume, but they are described in different units depending on the setting.</p>
                <p><strong className="text-foreground">That is why mixed-unit conversions are so common.</strong> Recipes may use cups and tablespoons, labels may use milliliters and fluid ounces, fuel uses gallons or liters, and room or appliance sizes may shift to cubic feet or cubic meters.</p>
                <p><strong className="text-foreground">Converting once to a shared unit prevents confusion.</strong> It is especially useful when comparing packaging, scaling recipes, checking appliance capacities, or translating between household and technical measurements.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Volume Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Liters and Milliliters</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These are the most common metric units for liquids and container sizes. Liters work well for larger quantities, while milliliters handle beverages, medicines, and recipe quantities.</p>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Gallons, Quarts, and Pints</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These US customary units remain common in fuel, kitchen, and household container sizing. They are deeply embedded in labels and buying habits, especially in the United States.</p>
                </div>
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Cups, Fluid Ounces, Tablespoons, Teaspoons</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These smaller units dominate recipe writing, nutrition labels, and daily kitchen use. They are practical for human-scale portions even though they are less convenient in technical settings.</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Cubic Feet and Cubic Meters</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These larger volume units matter in storage, appliances, room sizing, and industrial capacity. They describe three-dimensional space rather than just liquid quantities in a container.</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">This converter uses liters as the internal bridge.</strong> Every supported input is translated into liters first, then converted outward to every other unit. That keeps the math consistent whether the source value starts in gallons, cups, cubic feet, or teaspoons.</p>
                <p><strong className="text-foreground">The practical advantage is that household and technical measurements stop fighting each other.</strong> Once everything is normalized to one shared scale, it becomes much easier to compare product sizes, recipe quantities, tank capacities, and room volumes accurately.</p>
                <p><strong className="text-foreground">The best habit is to compare like with like.</strong> Use liters or milliliters for most international and technical work, gallons and cups for US household contexts, and cubic units when the measurement is really describing three-dimensional space.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use mL for small liquids, L for standard containers and fuel, cups and spoon units for recipes, gallons for US bulk liquids, and cubic feet or cubic meters when you are measuring space rather than a pourable amount.</p>
                </div>
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Everyday Converters?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Move from volume into weight, length, area, and more with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore Conversion Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-teal-500 to-cyan-500"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-teal-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter", "Converter"], ["#reference", "Volume Reference"], ["#guide", "Unit Guide"], ["#faq", "FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-teal-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-teal-500/40" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "13 live-converted volume units",
                    "Covers kitchen, fuel, and storage measurements",
                    "Includes both liquid and cubic-space units",
                    "Real-world benchmark table included",
                  ].map((note) => (
                    <div key={note} className="flex items-start gap-2">
                      <Flame className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
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
