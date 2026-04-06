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
} from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const UNITS = [
  { id: "pa", label: "Pascal", short: "Pa", toPascals: 1, note: "Base SI pressure unit" },
  { id: "kpa", label: "Kilopascal", short: "kPa", toPascals: 1000, note: "Weather, tires, and engineering" },
  { id: "mpa", label: "Megapascal", short: "MPa", toPascals: 1_000_000, note: "Hydraulics and material stress contexts" },
  { id: "bar", label: "Bar", short: "bar", toPascals: 100_000, note: "Industrial and European practical use" },
  { id: "mbar", label: "Millibar", short: "mbar", toPascals: 100, note: "Meteorology and atmospheric reporting" },
  { id: "atm", label: "Atmosphere", short: "atm", toPascals: 101_325, note: "Standard sea-level reference pressure" },
  { id: "psi", label: "Pound per square inch", short: "psi", toPascals: 6894.757, note: "US tire, air, and hydraulic systems" },
  { id: "torr", label: "Torr", short: "Torr", toPascals: 133.322, note: "Vacuum science and mmHg-related work" },
  { id: "inhg", label: "Inches of mercury", short: "inHg", toPascals: 3386.389, note: "Weather and aviation altimeter settings" },
  { id: "cmh2o", label: "Centimeters of water", short: "cmH2O", toPascals: 98.0638, note: "Respiratory and low-pressure measurement" },
] as const;

const PRESETS = [
  { label: "1 atmosphere", value: "1", unit: "atm" },
  { label: "Car tire", value: "35", unit: "psi" },
  { label: "Water main", value: "4", unit: "bar" },
  { label: "Weather pressure", value: "1013.25", unit: "mbar" },
  { label: "Scuba tank", value: "3000", unit: "psi" },
];

const RELATED = [
  { title: "Force Converter", href: "/conversion/force-converter", benefit: "Connect pressure to applied force" },
  { title: "Torque Converter", href: "/conversion/torque-converter", benefit: "Useful in mechanical and hydraulic systems" },
  { title: "Energy Converter", href: "/conversion/energy-converter", benefit: "Translate thermal and system values" },
  { title: "Power Converter", href: "/conversion/power-converter", benefit: "Pair flow and pressure with power output" },
  { title: "Temperature Converter", href: "/conversion/temperature-converter", benefit: "Common alongside HVAC and fluid work" },
];

const FAQS = [
  {
    q: "What is pressure?",
    a: "Pressure is force distributed over an area. The same force applied to a smaller area creates higher pressure, while spreading that force across a larger area lowers it. That is why pressure matters in tires, hydraulics, weather, vacuum systems, and fluid transport.",
  },
  {
    q: "What is the SI unit for pressure?",
    a: "The SI unit is the pascal, written as Pa. One pascal equals one Newton per square meter. In real-world use, kilopascals and megapascals are often more practical because a single pascal is a very small amount of pressure.",
  },
  {
    q: "How many psi are in 1 bar?",
    a: "One bar is about 14.5038 psi. That is why a tire listed at 2.4 bar is roughly 34.8 psi. This converter handles that translation automatically along with kPa, atm, and the other supported pressure units.",
  },
  {
    q: "What is standard atmospheric pressure?",
    a: "Standard atmospheric pressure is 1 atm, which equals 101,325 Pa, 101.325 kPa, 1.01325 bar, 14.696 psi, and 760 Torr. It is used as a baseline for weather, chemistry, and engineering references.",
  },
  {
    q: "What is the difference between absolute and gauge pressure?",
    a: "Absolute pressure is measured relative to a perfect vacuum. Gauge pressure is measured relative to ambient atmospheric pressure. Many tire and plumbing readings are gauge pressure, while physics and vacuum calculations often use absolute pressure.",
  },
  {
    q: "Why are mmHg or Torr still used?",
    a: "Because medicine, laboratory work, and vacuum systems still use legacy conventions. Blood pressure is still commonly discussed in mmHg, and vacuum equipment often uses Torr because those units remain intuitive in those fields.",
  },
  {
    q: "Why does weather use millibars or hectopascals?",
    a: "Meteorology adopted units that are easier to read at atmospheric scale. A typical sea-level reading around 1013 millibars is much more readable than 101,300 pascals. Hectopascal and millibar values are numerically equivalent.",
  },
  {
    q: "Who is this pressure converter useful for?",
    a: "It is useful for mechanics, HVAC technicians, divers, lab workers, medical learners, engineers, weather readers, and anyone translating tire pressure, vacuum specs, compressor output, or industrial pressure data between unit systems.",
  },
];

function fmtPressure(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 0.0001) return value.toExponential(4);
  return parseFloat(value.toPrecision(8)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-sky-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-sky-500">
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

export default function PressureConverter() {
  const [value, setValue] = useState("14.696");
  const [fromUnit, setFromUnit] = useState("psi");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;

    const pascals = parsed * from.toPascals;

    return {
      pascals,
      from,
      rows: UNITS.map((unit) => ({
        ...unit,
        converted: pascals / unit.toPascals,
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
        title="Pressure Converter - Convert PSI, Bar, kPa, atm, Torr"
        description="Free online pressure converter. Convert PSI, bar, pascals, kilopascals, atmospheres, Torr, inches of mercury, and more with live results and practical reference examples."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Pressure Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Gauge className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Pressure Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert PSI, bar, pascals, atmospheres, Torr, inches of mercury, and other pressure units instantly. This redesign keeps the same pressure coverage but gives the page a stronger calculator layout, clearer results, and better real-world context for tires, HVAC, weather, and industrial systems.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Gauge className="w-3.5 h-3.5" /> 10 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers scientific, industrial, weather, and practical pressure units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-sky-500/20 shadow-lg shadow-sky-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-500" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center"><Gauge className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Pressure Conversion</p>
                    <p className="text-sm text-muted-foreground">Convert pressure for tires, weather, vacuum systems, plumbing, and industrial setups instantly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="tool-calc-input w-full font-mono text-lg" placeholder="14.696" />
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
                      <p className="text-lg font-black text-foreground">{fmtPressure(parseFloat(value))} {results.from.short} = {fmtPressure(results.pascals)} Pa</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-sky-500/40 bg-sky-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtPressure(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtPressure(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Pressure Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Example</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Typical Pressure</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Alternate</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Sea-level atmosphere", "1 atm", "14.696 psi", "Standard baseline reference"],
                      ["Passenger car tire", "32-35 psi", "220-241 kPa", "Normal road vehicle range"],
                      ["Road bike tire", "80-130 psi", "5.5-9.0 bar", "High narrow-tire inflation"],
                      ["House water pressure", "40-80 psi", "2.8-5.5 bar", "Typical plumbing system range"],
                      ["Weather report", "1013 mbar", "101.3 kPa", "Average sea-level pressure"],
                      ["Blood pressure systolic", "~120 mmHg", "~16 kPa", "Medical reading scale"],
                      ["Scuba tank full", "3,000 psi", "206.8 bar", "High-pressure breathing gas storage"],
                      ["Deep ocean at 10 m", "~2 atm absolute", "~29.4 psi absolute", "Pressure rises fast underwater"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-mono text-sky-700 dark:text-sky-400">{row[1]}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Pressure makes more sense when anchored to familiar systems.</strong> Tire inflation, water supply lines, weather maps, blood pressure, and scuba tanks all describe pressure, but each field presents it in a different unit family and at a different scale.</p>
                <p><strong className="text-foreground">That is exactly why conversion matters.</strong> A compressor may be labeled in psi, a weather app may show millibars, and an engineering document may use kilopascals or megapascals. The physics is the same even when the notation is not.</p>
                <p><strong className="text-foreground">It also matters for safety and calibration.</strong> Misreading pressure units can lead to overinflated tires, bad regulator settings, or incorrect system assumptions. Converting first is a simple way to avoid preventable setup errors.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Pressure Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Pascal, kPa, and MPa</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These are the SI family units for pressure. Pa is the base unit, while kPa and MPa are more practical for everyday engineering and industrial ranges.</p>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">PSI and Bar</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">PSI is dominant in US automotive and compressed-air work. Bar is common in Europe and industrial catalogs because it sits close to atmospheric pressure and is easy to read.</p>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Atmosphere, Torr, and inHg</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These units persist in chemistry, vacuum systems, aviation, and weather reporting. They are older conventions, but they are still widely visible in real instruments and documentation.</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">cmH2O and Low Pressure</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Centimeters of water show up where pressure differences are small, such as respiratory devices or some fluid and duct measurements. It is useful because it keeps low values readable.</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Pressure is always force divided by area.</strong> That definition is simple, but it explains why narrow contact points feel sharper, why hydraulic systems amplify useful force, and why atmospheric pressure becomes more noticeable in technical measurements than in everyday life.</p>
                <p><strong className="text-foreground">This converter uses pascals as the internal bridge.</strong> Every supported input is translated into Pa first, then converted outward to every other unit. That keeps the math consistent whether the source starts in psi, atm, or cmH2O.</p>
                <p><strong className="text-foreground">The practical rule is to match your tool, gauge, and target specification to the same reference frame.</strong> Some displays show gauge pressure, some show absolute pressure, and some switch units by region. Unit clarity matters as much as the numeric value itself.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use psi for US tires and shop air, bar for many international product specs, kPa or MPa for SI engineering work, and atm or Torr when dealing with reference pressure or vacuum-style contexts.</p>
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

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Engineering Converters?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Move from pressure into force, torque, power, energy, and temperature with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-sky-500 to-blue-600"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-sky-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter", "Converter"], ["#reference", "Pressure Reference"], ["#guide", "Unit Guide"], ["#faq", "FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-sky-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-sky-500/40" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "10 live-converted pressure units",
                    "Covers tires, weather, vacuum, and plumbing",
                    "Includes atmospheric and low-pressure units",
                    "Real-world benchmark table included",
                  ].map((note) => (
                    <div key={note} className="flex items-start gap-2">
                      <Flame className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
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
