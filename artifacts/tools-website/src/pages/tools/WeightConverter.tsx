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
  Scale,
  Shield,
  Smartphone,
} from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const UNITS = [
  { id: "kg", label: "Kilogram", short: "kg", toKg: 1, note: "Base metric mass unit" },
  { id: "g", label: "Gram", short: "g", toKg: 0.001, note: "Everyday small metric mass values" },
  { id: "mg", label: "Milligram", short: "mg", toKg: 0.000001, note: "Medicine and tiny quantities" },
  { id: "lb", label: "Pound", short: "lb", toKg: 0.453592, note: "Common US everyday and body-weight unit" },
  { id: "oz", label: "Ounce", short: "oz", toKg: 0.0283495, note: "Food and small imperial mass values" },
  { id: "st", label: "Stone", short: "st", toKg: 6.35029, note: "Body-weight use in the UK and Ireland" },
  { id: "t", label: "Metric ton", short: "t", toKg: 1000, note: "Large metric shipment and industrial loads" },
  { id: "ton", label: "US short ton", short: "ton", toKg: 907.185, note: "US freight and industrial notation" },
] as const;

const PRESETS = [
  { label: "Body weight", value: "70", unit: "kg" },
  { label: "Gym plate", value: "45", unit: "lb" },
  { label: "Bag of rice", value: "5", unit: "kg" },
  { label: "Package label", value: "16", unit: "oz" },
  { label: "Vehicle cargo", value: "2", unit: "t" },
];

const RELATED = [
  { title: "Volume Converter", href: "/conversion/volume-converter", benefit: "Pair mass and volume in practical workflows" },
  { title: "Length Converter", href: "/conversion/length-converter", benefit: "Useful for dimensions and shipping specs" },
  { title: "Area Converter", href: "/conversion/area-converter", benefit: "Helpful in materials and planning work" },
  { title: "BMI Calculator", href: "/health/bmi-calculator", benefit: "Apply body-weight values in health contexts" },
  { title: "Calorie Calculator", href: "/health/calorie-calculator", benefit: "Combine body weight with nutrition planning" },
];

const FAQS = [
  {
    q: "What is the difference between mass and weight?",
    a: "In strict physics, mass is the amount of matter in an object, while weight is the force caused by gravity acting on that mass. In everyday usage, people often say weight when they really mean mass. This converter follows everyday convention and converts the common units people use for body weight, food, shipping, and materials.",
  },
  {
    q: "How many pounds are in 1 kilogram?",
    a: "One kilogram equals about 2.20462 pounds. That is one of the most common conversions for body weight, gym equipment, and shipping labels. This page also converts the same source value into grams, ounces, stones, tons, and the other supported units at the same time.",
  },
  {
    q: "How many grams are in a pound?",
    a: "One pound is about 453.592 grams. That conversion is useful for recipes, food packaging, and comparing metric and imperial product labels.",
  },
  {
    q: "What is a stone?",
    a: "A stone is an imperial unit equal to 14 pounds. It is still commonly used in the UK and Ireland for body weight. For example, 11 stone equals 154 pounds, or about 69.85 kilograms.",
  },
  {
    q: "What is the difference between a metric ton and a US ton?",
    a: "A metric ton is 1,000 kilograms. A US short ton is 2,000 pounds, which is about 907.185 kilograms. They are close in scale but not the same, so it is important to convert carefully in freight, construction, and industrial contexts.",
  },
  {
    q: "Why do recipes and product labels mix grams, ounces, and pounds?",
    a: "Because metric and imperial systems are both still widely used. Many international products publish grams, while US packaging may emphasize ounces or pounds. A converter is useful because real-world labels often mix those conventions.",
  },
  {
    q: "Can I use this for body weight, shipping, and industrial loads?",
    a: "Yes. It is useful for everyday body-weight conversions, cooking and nutrition labels, shipping packages, gym equipment, raw materials, and large industrial or freight values.",
  },
  {
    q: "Who is this weight converter useful for?",
    a: "It is useful for shoppers, cooks, fitness users, shipping teams, students, travelers, warehouse staff, and anyone translating between metric and imperial mass units.",
  },
];

function fmtWeight(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 0.0001) return value.toExponential(4);
  return parseFloat(value.toPrecision(8)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-orange-500">
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

export default function WeightConverter() {
  const [value, setValue] = useState("70");
  const [fromUnit, setFromUnit] = useState("kg");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;

    const kilograms = parsed * from.toKg;

    return {
      kilograms,
      from,
      rows: UNITS.map((unit) => ({
        ...unit,
        converted: kilograms / unit.toKg,
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
        title="Weight Converter - Convert kg, lb, oz, g, stone, tons"
        description="Free online weight converter. Convert kilograms, pounds, ounces, grams, stone, metric tons, and US tons with live results and practical reference examples."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Weight Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Scale className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Weight Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert kilograms, pounds, ounces, grams, stone, and ton-based units instantly. This redesign keeps the same weight-unit coverage while making the page easier to scan, more consistent with the newer converters, and more useful for everyday, fitness, shipping, and industrial comparisons.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Scale className="w-3.5 h-3.5" /> 8 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers metric, imperial, and large-load mass units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-500" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center"><Scale className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Weight Conversion</p>
                    <p className="text-sm text-muted-foreground">Translate body weight, food, package, and bulk-load values instantly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="tool-calc-input w-full font-mono text-lg" placeholder="70" />
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
                      <p className="text-lg font-black text-foreground">{fmtWeight(parseFloat(value))} {results.from.short} = {fmtWeight(results.kilograms)} kg</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-orange-500/40 bg-orange-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtWeight(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtWeight(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Weight Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Example</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Typical Weight</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Alternate</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Smartphone", "180-240 g", "6-8.5 oz", "Pocket electronics scale"],
                      ["Bag of flour", "1 kg", "2.2 lb", "Common grocery benchmark"],
                      ["Adult body weight", "70 kg", "154 lb", "Everyday person-scale reference"],
                      ["Gym plate", "20 kg", "44.1 lb", "Fitness equipment standard"],
                      ["Large dog", "30 kg", "66 lb", "Useful household comparison"],
                      ["Motorcycle", "180-250 kg", "397-551 lb", "Vehicle-scale mass"],
                      ["Small car", "1.3-1.8 t", "1.4-2.0 US tons", "Passenger vehicle class"],
                      ["Shipping container load", "10-25 t", "11-27.5 US tons", "Freight-scale benchmark"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-mono text-orange-700 dark:text-orange-400">{row[1]}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Weight values are easier to interpret when tied to familiar objects.</strong> A phone, grocery item, person, vehicle, or cargo load can all be described in different mass units depending on the country and context, even though they are measuring the same physical quantity.</p>
                <p><strong className="text-foreground">That is why mixed-unit labels remain common.</strong> Food packaging may use grams and ounces, body weight may be tracked in kilograms or pounds, and industrial shipping values may switch between metric tons and US tons. A converter keeps those scales aligned.</p>
                <p><strong className="text-foreground">It also prevents very ordinary mistakes.</strong> Small unit mismatches on food, medicine, freight, or fitness targets can create confusion quickly. Converting once to a shared unit is usually the safest way to compare numbers accurately.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Weight Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Kilograms and Grams</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These are the dominant metric mass units for body weight, food, science, and international product labeling. Kilograms handle larger everyday values, while grams and milligrams cover smaller amounts.</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Pounds and Ounces</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Pounds and ounces remain common in US consumer use, retail packaging, cooking, and body-weight discussions. They are still widely used enough that most people need to convert between them and metric values regularly.</p>
                </div>
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Stone</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Stone is a legacy imperial unit equal to 14 pounds. It persists mostly in body-weight use in the UK and Ireland, so support for it is useful when comparing health and fitness figures across regions.</p>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Metric Ton and US Ton</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These larger units matter in freight, raw materials, and industrial reporting. They are close in scale but not identical, which makes careful conversion important in logistics and cost planning.</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">This converter uses kilograms as the internal bridge.</strong> Every source unit is translated into kg first, then converted into every other supported unit. That keeps the math stable whether the input starts in pounds, ounces, stone, or tons.</p>
                <p><strong className="text-foreground">The practical advantage is consistency.</strong> Once you normalize values into one shared unit, shopping labels, gym targets, health tracking, and shipping specs become much easier to compare without mental shortcuts or approximate guesses.</p>
                <p><strong className="text-foreground">The best habit is to choose one unit family for comparison and stick with it.</strong> Use kilograms for international and technical contexts, pounds for US everyday use, and larger ton-based units only when the scale truly calls for them.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use kilograms for technical and international comparisons, pounds for US everyday body weight and retail use, grams and ounces for smaller items, and ton-based units only for freight and industrial loads.</p>
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

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Everyday Converters?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Move from weight into volume, length, area, and more with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-orange-500 to-amber-500"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter", "Converter"], ["#reference", "Weight Reference"], ["#guide", "Unit Guide"], ["#faq", "FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "8 live-converted weight units",
                    "Covers metric, imperial, and ton-based values",
                    "Useful for body weight, retail, and shipping",
                    "Includes real-world benchmark table",
                  ].map((note) => (
                    <div key={note} className="flex items-start gap-2">
                      <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
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
