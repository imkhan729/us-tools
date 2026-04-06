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
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const UNITS = [
  { id: "ms", label: "Meters per second", short: "m/s", toMs: 1, note: "Base SI speed unit" },
  { id: "kmh", label: "Kilometers per hour", short: "km/h", toMs: 1 / 3.6, note: "Road speeds in much of the world" },
  { id: "mph", label: "Miles per hour", short: "mph", toMs: 0.44704, note: "US and UK road-speed standard" },
  { id: "fps", label: "Feet per second", short: "ft/s", toMs: 0.3048, note: "Engineering and ballistic contexts" },
  { id: "kn", label: "Knot", short: "kn", toMs: 0.514444, note: "Aviation and marine navigation" },
  { id: "mach", label: "Mach", short: "Mach", toMs: 340.29, note: "Relative to speed of sound at sea level" },
  { id: "cms", label: "Centimeters per second", short: "cm/s", toMs: 0.01, note: "Small-scale motion and lab work" },
  { id: "mipm", label: "Miles per minute", short: "mi/min", toMs: 26.8224, note: "Very high travel speeds" },
] as const;

const PRESETS = [
  { label: "Walking pace", value: "5", unit: "kmh" },
  { label: "Highway car", value: "60", unit: "mph" },
  { label: "Fast train", value: "300", unit: "kmh" },
  { label: "Airliner cruise", value: "485", unit: "kn" },
  { label: "Mach 1", value: "1", unit: "mach" },
];

const RELATED = [
  { title: "Length Converter", href: "/conversion/length-converter", benefit: "Pair distance and travel speed units" },
  { title: "Time Converter", href: "/conversion/time-converter", benefit: "Useful for rate and duration calculations" },
  { title: "Power Converter", href: "/conversion/power-converter", benefit: "Translate mechanical and motion-related systems" },
  { title: "Fuel Efficiency Converter", href: "/conversion/fuel-efficiency-converter", benefit: "Compare speed and vehicle-use metrics" },
  { title: "Scientific Calculator", href: "/math/online-scientific-calculator", benefit: "Handle follow-up travel and physics math" },
];

const FAQS = [
  {
    q: "How do I convert mph to km/h?",
    a: "Multiply mph by 1.60934. For example, 60 mph equals about 96.56 km/h. This converter handles that automatically and also gives you m/s, knots, and the other supported speed units at the same time.",
  },
  {
    q: "How do I convert km/h to m/s?",
    a: "Divide km/h by 3.6. A speed of 100 km/h is about 27.78 m/s. That conversion is common in physics, automotive calculations, and motion problems because m/s is the SI base speed unit.",
  },
  {
    q: "What is a knot?",
    a: "A knot is one nautical mile per hour. It is used in aviation and maritime navigation because nautical miles relate directly to Earth navigation coordinates. One knot is about 1.852 km/h or 1.15078 mph.",
  },
  {
    q: "What does Mach mean?",
    a: "Mach expresses speed relative to the local speed of sound. Mach 1 is the speed of sound under specific conditions, often approximated near sea level. Because the speed of sound changes with altitude and temperature, Mach is not a fixed mph or km/h value everywhere.",
  },
  {
    q: "What is the SI unit for speed?",
    a: "The SI unit is meters per second, written as m/s. It is the standard unit used in physics and engineering formulas because it fits directly with other SI units like meters, seconds, and acceleration.",
  },
  {
    q: "Why do cars use mph or km/h instead of m/s?",
    a: "Because mph and km/h are more readable at everyday travel scale. A highway speed shown as 27.8 m/s is technically correct, but 100 km/h or 62 mph is more intuitive for drivers and transport systems.",
  },
  {
    q: "Can I use this for physics, travel, and aviation comparisons?",
    a: "Yes. It is useful for classroom motion problems, travel planning, motorsport comparisons, aviation speeds, maritime navigation, and any situation where the same motion value appears in different unit systems.",
  },
  {
    q: "Who is this speed converter useful for?",
    a: "It is useful for students, drivers, travelers, mechanics, racers, pilots, boaters, engineers, and anyone comparing road, air, or scientific speed data published in different units.",
  },
];

function fmtSpeed(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 0.00001) return value.toExponential(5);
  return parseFloat(value.toPrecision(8)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-indigo-500">
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

export default function SpeedConverter() {
  const [value, setValue] = useState("60");
  const [fromUnit, setFromUnit] = useState("mph");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;

    const metersPerSecond = parsed * from.toMs;

    return {
      metersPerSecond,
      from,
      rows: UNITS.map((unit) => ({
        ...unit,
        converted: metersPerSecond / unit.toMs,
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
        title="Speed Converter - Convert mph, km/h, m/s, knots, Mach"
        description="Free online speed converter. Convert mph, km/h, m/s, knots, Mach, feet per second, and more with live results and practical benchmark examples."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Speed Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Speed Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert mph, km/h, meters per second, knots, Mach, and other speed units instantly. This redesign keeps the existing speed coverage while upgrading the page structure, result readability, and real-world context for road, air, marine, and physics use.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> 8 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers everyday travel, engineering, marine, and aviation speed units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-blue-500" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center"><Gauge className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Speed Conversion</p>
                    <p className="text-sm text-muted-foreground">Translate road, flight, marine, and scientific speed values instantly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="tool-calc-input w-full font-mono text-lg" placeholder="60" />
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
                      <p className="text-lg font-black text-foreground">{fmtSpeed(parseFloat(value))} {results.from.short} = {fmtSpeed(results.metersPerSecond)} m/s</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-indigo-500/40 bg-indigo-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtSpeed(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtSpeed(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Speed Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Example</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Typical Speed</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Alternate</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Walking person", "5 km/h", "3.1 mph", "Everyday human pace"],
                      ["Running sprinter", "36 km/h", "10 m/s", "Peak short-distance human speed"],
                      ["Highway driving", "100 km/h", "62.1 mph", "Common road benchmark"],
                      ["High-speed train", "300 km/h", "186 mph", "Modern rail travel"],
                      ["Commercial airliner", "485 kn", "900 km/h", "Typical cruise speed"],
                      ["Speed of sound", "Mach 1", "1,225 km/h", "Approximate sea-level reference"],
                      ["Concorde-class flight", "Mach 2", "2,450 km/h", "Supersonic travel scale"],
                      ["Low Earth orbit", "7.8 km/s", "17,500 mph", "Orbital velocity benchmark"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-mono text-indigo-700 dark:text-indigo-400">{row[1]}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Speed values are easier to understand when tied to familiar motion.</strong> A walking pace, highway drive, airliner cruise, and orbital velocity all describe speed, but each lives on a radically different scale and often uses a different unit family.</p>
                <p><strong className="text-foreground">That is why conversion shows up in more places than people expect.</strong> Travel planning often mixes mph and km/h, aviation prefers knots, physics uses m/s, and high-speed aerospace discussions may switch to Mach. A good converter lets those contexts line up cleanly.</p>
                <p><strong className="text-foreground">It also prevents basic interpretation mistakes.</strong> A value that looks modest in one unit can be large in another, and comparing them directly without converting first creates avoidable errors in planning, analysis, and communication.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Speed Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">m/s and SI Motion Math</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Meters per second is the SI standard for speed. It is the most natural unit for physics, engineering, acceleration formulas, and any calculation built around distance in meters and time in seconds.</p>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">km/h and mph</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These are the practical everyday road-speed units. Much of the world uses km/h, while the United States still uses mph. Drivers usually think in these scales because they match signage and vehicle dashboards.</p>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Knots</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Knots are used in marine and aviation navigation because they are based on nautical miles, which connect well to Earth's geometry and navigation systems. They remain standard even in modern electronic instruments.</p>
                </div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Mach</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Mach is a relative unit based on local sound speed, so it is useful for aircraft and high-speed aerodynamics. It is not a universal fixed number because atmospheric conditions affect the speed of sound.</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Speed is distance traveled per unit of time.</strong> That sounds basic, but it explains why the same motion can be presented as meters per second, kilometers per hour, or miles per hour depending on whether the context is scientific, international, or everyday road use.</p>
                <p><strong className="text-foreground">This converter uses meters per second as the internal bridge.</strong> Every input is translated into m/s first, then converted outward to the rest of the supported units. That keeps the conversion logic stable no matter which unit the source starts from.</p>
                <p><strong className="text-foreground">The practical rule is to compare speeds in the same unit before drawing conclusions.</strong> That is especially important when mixing travel specs, performance benchmarks, race data, and aviation figures from different sources.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use mph or km/h for driving, knots for aircraft and boats, m/s for science and engineering, and Mach only when you specifically care about speed relative to sound.</p>
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

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Travel and Motion Tools?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Move from speed into length, time, fuel efficiency, and power with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-indigo-500 to-blue-600"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-indigo-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter", "Converter"], ["#reference", "Speed Reference"], ["#guide", "Unit Guide"], ["#faq", "FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "8 live-converted speed units",
                    "Covers road, marine, scientific, and Mach values",
                    "Built for travel, physics, and aviation comparisons",
                    "Includes real-world benchmark table",
                  ].map((note) => (
                    <div key={note} className="flex items-start gap-2">
                      <Flame className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
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
