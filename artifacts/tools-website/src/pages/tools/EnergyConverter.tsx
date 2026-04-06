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
  { id: "j", label: "Joule", short: "J", toJoules: 1, note: "Base SI energy unit" },
  { id: "kj", label: "Kilojoule", short: "kJ", toJoules: 1000, note: "Nutrition and engineering" },
  { id: "mj", label: "Megajoule", short: "MJ", toJoules: 1_000_000, note: "Large thermal and fuel values" },
  { id: "cal", label: "Calorie (small)", short: "cal", toJoules: 4.184, note: "Physics and chemistry" },
  { id: "kcal", label: "Kilocalorie (food Calorie)", short: "kcal", toJoules: 4184, note: "Food energy labels" },
  { id: "wh", label: "Watt-hour", short: "Wh", toJoules: 3600, note: "Battery and small device storage" },
  { id: "kwh", label: "Kilowatt-hour", short: "kWh", toJoules: 3_600_000, note: "Electricity billing" },
  { id: "btu", label: "British Thermal Unit", short: "BTU", toJoules: 1055.06, note: "Heating and cooling" },
  { id: "ev", label: "Electronvolt", short: "eV", toJoules: 1.602176634e-19, note: "Atomic and particle physics" },
  { id: "ft_lb", label: "Foot-pound", short: "ft·lb", toJoules: 1.35582, note: "Mechanical work" },
  { id: "therm", label: "Therm (US)", short: "therm", toJoules: 105_480_400, note: "Gas utility usage" },
] as const;

const PRESETS = [
  { label: "AA battery", value: "3", unit: "wh" },
  { label: "Food snack", value: "250", unit: "kcal" },
  { label: "1 kWh electricity", value: "1", unit: "kwh" },
  { label: "Small gas use", value: "1", unit: "therm" },
  { label: "Physics base", value: "1000", unit: "j" },
];

const RELATED = [
  { title: "Power Converter", href: "/conversion/power-converter", benefit: "Translate between power rate units" },
  { title: "Pressure Converter", href: "/conversion/pressure-converter", benefit: "Useful with HVAC and thermal work" },
  { title: "Temperature Converter", href: "/conversion/temperature-converter", benefit: "Pair heat values with temperature scales" },
  { title: "Calorie Calculator", href: "/health/calorie-calculator", benefit: "Apply food energy values in diet planning" },
  { title: "Electrical Load Calculator", href: "/construction/electrical-load-calculator", benefit: "Move from appliance draw to energy use planning" },
];

const FAQS = [
  {
    q: "What is the difference between energy and power?",
    a: "Energy is the total amount of work done or heat transferred. Power is the rate at which that energy is used or delivered. If a device draws 1,000 watts for one hour, it consumes 1 kilowatt-hour of energy. That distinction matters because many people compare appliance power ratings when they really want to estimate total energy use over time.",
  },
  {
    q: "Why do nutrition labels use Calories with a capital C?",
    a: "In food labeling, a capital-C Calorie means one kilocalorie. That is 1,000 small calories. A snack labeled 250 Calories contains 250 kilocalories, which is the same as about 1,046 kilojoules. Nutrition language kept the larger unit because it is more practical for daily food intake.",
  },
  {
    q: "How many joules are in 1 kWh?",
    a: "One kilowatt-hour equals 3,600,000 joules. The math is straightforward: one kilowatt is 1,000 joules per second, and one hour is 3,600 seconds, so multiplying them gives 3.6 million joules. This conversion is fundamental when translating appliance use, electricity bills, or battery capacities into SI units.",
  },
  {
    q: "What is a BTU used for?",
    a: "A BTU is a British Thermal Unit and is mainly used in heating and cooling contexts, especially in the US. Air conditioners, furnaces, and natural gas systems often use BTU or BTU-based ratings. Even though the SI system uses joules, BTU remains common in HVAC catalogs and utility communication.",
  },
  {
    q: "Why is the electronvolt included in an everyday energy converter?",
    a: "Because not all energy discussions happen at household scale. Electronvolts are the standard unit in atomic physics, semiconductor work, and particle science. They are tiny compared to joules, but they are far more readable when talking about electrons, atoms, and subatomic interactions.",
  },
  {
    q: "When should I use kJ instead of kcal?",
    a: "Use kilojoules when you want the SI metric expression of energy, especially in science, engineering, and many international nutrition labels. Use kilocalories when you are talking about food energy in the US or with audiences who expect Calories. Both describe the same thing, just in different unit conventions.",
  },
  {
    q: "Can this help me estimate energy cost?",
    a: "Indirectly, yes. If you know the energy used in kilowatt-hours, you can multiply that by your local electricity rate to estimate cost. For example, if a device uses 2 kWh and your tariff is $0.15 per kWh, the cost is about $0.30. This page helps you get values into the right energy unit first.",
  },
  {
    q: "Who is this energy converter useful for?",
    a: "It is useful for students, engineers, electricians, HVAC technicians, diet-conscious users, science learners, utility customers, and anyone comparing appliance use, food energy, fuel values, battery specs, or thermal system ratings across different unit systems.",
  },
];

function fmtEnergy(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) < 1e-6 || Math.abs(value) > 1e12) return value.toExponential(4);
  return parseFloat(value.toPrecision(8)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-yellow-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-yellow-500">
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

export default function EnergyConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kwh");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;
    const joules = parsed * from.toJoules;
    return { joules, from, rows: UNITS.map((unit) => ({ ...unit, converted: joules / unit.toJoules })) };
  }, [fromUnit, value]);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <Layout>
      <SEO
        title="Energy Converter - Convert Joules, kWh, Calories, BTU"
        description="Free online energy converter. Convert joules, kilojoules, calories, kilowatt-hours, BTU, therms, electronvolts, and more with live results and practical reference content."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-yellow-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-yellow-500" strokeWidth={3} />
          <span className="text-foreground">Energy Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-yellow-500/15 bg-gradient-to-br from-yellow-500/5 via-card to-lime-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Energy Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert joules, kilojoules, food Calories, kilowatt-hours, BTU, therms, electronvolts, and other energy units instantly. This redesign makes the page easier to scan, more useful for real-world comparisons, and better aligned with the richer converter pages across the site.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold text-xs px-3 py-1.5 rounded-full border border-yellow-500/20"><Zap className="w-3.5 h-3.5" /> 11 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers household, nutrition, thermal, and scientific energy units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-yellow-500/20 shadow-lg shadow-yellow-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-yellow-500 to-lime-400" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-lime-400 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Energy Conversion</p>
                    <p className="text-sm text-muted-foreground">Convert stored, consumed, and thermal energy values instantly.</p>
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
                      <p className="text-lg font-black text-foreground">{fmtEnergy(parseFloat(value))} {results.from.short} = {fmtEnergy(results.joules)} J</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-yellow-500/40 bg-yellow-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtEnergy(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtEnergy(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Energy Unit Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Unit</th><th className="text-left px-4 py-3 font-bold text-foreground">In Joules</th><th className="text-left px-4 py-3 font-bold text-foreground">Where You See It</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Why It Matters</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Joule", "1", "Physics and SI calculations", "The universal baseline"],
                      ["Kilojoule", "1,000", "Nutrition and engineering", "Common outside the US for food labels"],
                      ["Kilocalorie", "4,184", "Food Calories", "Everyday dietary energy"],
                      ["Watt-hour", "3,600", "Battery packs and electronics", "Small electrical storage values"],
                      ["Kilowatt-hour", "3,600,000", "Electricity bills", "Home energy consumption"],
                      ["BTU", "1,055.06", "Heating and cooling", "US thermal system language"],
                      ["Therm", "105,480,400", "Natural gas usage", "Utility billing scale"],
                      ["Electronvolt", "1.60e-19", "Atomic and particle physics", "Readable tiny-scale energy"],
                      ["Foot-pound", "1.35582", "Mechanical work", "Legacy engineering context"],
                    ].map((row) => (
                      <tr key={row[0]}><td className="px-4 py-3 font-medium text-foreground">{row[0]}</td><td className="px-4 py-3 font-mono text-yellow-700 dark:text-yellow-400">{row[1]}</td><td className="px-4 py-3 text-foreground">{row[2]}</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Energy shows up in very different scales depending on the context.</strong> A nutrition label uses kilocalories, a utility bill uses kilowatt-hours, a furnace spec may refer to BTU, and a physics problem may default to joules. Those values are all describing energy, but each domain developed its own preferred language.</p>
                <p><strong className="text-foreground">That is why unit translation matters more than most people expect.</strong> A user comparing appliance consumption, food intake, gas use, and thermal performance will often move across several systems in one day. A good converter reduces friction by bringing them back to a shared baseline and then translating outward again cleanly.</p>
                <p><strong className="text-foreground">This page is most useful when you need to move between scientific clarity and practical labels.</strong> Joules and kilojoules are clean SI units, but people still think in Calories, kWh, BTU, and therms because that is how products, bills, and nutrition labels are written. The goal is not to force one system. The goal is to let them interoperate without guesswork.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Energy Units Relate</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4"><p className="font-bold text-foreground mb-1">Joules and Kilojoules</p><p className="text-sm text-muted-foreground leading-relaxed">Joules are the SI base unit of energy. Kilojoules make larger values easier to read and are common in science, engineering, and many international nutrition standards.</p></div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4"><p className="font-bold text-foreground mb-1">Calories and Kilocalories</p><p className="text-sm text-muted-foreground leading-relaxed">Food energy is usually discussed in kilocalories. In US nutrition, those are shown as Calories with a capital C. This is one of the most common everyday energy conversions users need.</p></div>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"><p className="font-bold text-foreground mb-1">Watt-hours and Kilowatt-hours</p><p className="text-sm text-muted-foreground leading-relaxed">These units are built from power over time. They are critical for batteries, electricity billing, solar systems, appliance usage, and cost estimation because they describe total energy consumed or stored.</p></div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"><p className="font-bold text-foreground mb-1">BTU, Therms, and Thermal Context</p><p className="text-sm text-muted-foreground leading-relaxed">Heating and cooling systems often stay in BTU language, while gas utilities may use therms. These are still energy units, just attached to thermal and fuel industries rather than SI-first engineering workflows.</p></div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Energy and power should be separated clearly.</strong> Power is the rate at which energy is transferred, while energy is the total amount accumulated over time. If you confuse the two, you get wrong conclusions about cost, capacity, or performance. This page handles energy totals. If you need rate-based conversion, the related Power Converter is the right tool.</p>
                <p><strong className="text-foreground">A kilowatt-hour is not just for utility bills.</strong> It is one of the most practical bridge units in modern life because it connects appliance use, battery storage, EV charging, solar generation, and operating cost estimation. Once values are in kWh, they become much easier to compare against tariffs or system capacities.</p>
                <p><strong className="text-foreground">Food labels create another common source of confusion.</strong> A 250 Calorie snack is actually 250 kilocalories, not 250 small calories. The converter helps make that explicit by placing kcal and other units side by side, so users can move between dietary language and scientific language without mentally carrying the unit mismatch.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use joules or kJ for scientific clarity, kcal for food, kWh for electrical consumption, and BTU or therms when working with heating, cooling, or gas utility language.</p>
                </div>
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-lime-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Conversion Tools?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Keep moving through energy, power, temperature, pressure, and utility-related calculations with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-yellow-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-yellow-500 to-lime-400"><Flame className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-yellow-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter","Converter"],["#reference","Unit Reference"],["#guide","Unit Guide"],["#faq","FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-yellow-500 font-medium py-1.5 transition-colors"><div className="w-1 h-1 rounded-full bg-yellow-500/40" />{label}</a>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {["11 live-converted units","Food, utility, thermal, and scientific scales","kWh and BTU support","Real-world reference and guidance"].map((note) => (
                    <div key={note} className="flex items-start gap-2"><Flame className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" /><span>{note}</span></div>
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
