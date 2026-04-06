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
  { id: "w", label: "Watt", short: "W", toWatt: 1, note: "Base SI unit" },
  { id: "kw", label: "Kilowatt", short: "kW", toWatt: 1000, note: "Common for appliances and EV charging" },
  { id: "mw", label: "Megawatt", short: "MW", toWatt: 1_000_000, note: "Utility-scale systems" },
  { id: "gw", label: "Gigawatt", short: "GW", toWatt: 1_000_000_000, note: "Large plant output" },
  { id: "mw_m", label: "Milliwatt", short: "mW", toWatt: 0.001, note: "Small electronics" },
  { id: "hp_mec", label: "Horsepower (mechanical)", short: "hp", toWatt: 745.69987, note: "Automotive and machinery" },
  { id: "hp_elec", label: "Horsepower (electrical)", short: "hp elec", toWatt: 746, note: "Motor ratings" },
  { id: "hp_met", label: "Horsepower (metric)", short: "PS", toWatt: 735.49875, note: "Common in Europe" },
  { id: "btu_hr", label: "BTU per hour", short: "BTU/hr", toWatt: 0.29307107, note: "HVAC systems" },
  { id: "btu_min", label: "BTU per minute", short: "BTU/min", toWatt: 17.584264, note: "Higher thermal rates" },
  { id: "cal_s", label: "Calories per second", short: "cal/s", toWatt: 4.1868, note: "Thermal power" },
  { id: "kcal_hr", label: "Kilocalories per hour", short: "kcal/hr", toWatt: 1.163, note: "Heating and metabolic contexts" },
  { id: "ft_lbs", label: "Foot-pound force per second", short: "ft·lbf/s", toWatt: 1.3558179, note: "Legacy mechanical unit" },
  { id: "erg_s", label: "Erg per second", short: "erg/s", toWatt: 1e-7, note: "Scientific CGS notation" },
] as const;

const PRESETS = [
  { label: "LED bulb", value: "10", unit: "w" },
  { label: "Microwave", value: "1000", unit: "w" },
  { label: "Kettle", value: "1500", unit: "w" },
  { label: "Home EV charger", value: "7.2", unit: "kw" },
  { label: "1 ton AC", value: "12000", unit: "btu_hr" },
];

const RELATED = [
  { title: "Energy Converter", href: "/conversion/energy-converter" },
  { title: "Force Converter", href: "/conversion/force-converter" },
  { title: "Torque Converter", href: "/conversion/torque-converter" },
  { title: "Pressure Converter", href: "/conversion/pressure-converter" },
  { title: "Electrical Load Calculator", href: "/construction/electrical-load-calculator" },
];

function fmtPower(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 0.0001) return value.toExponential(4);
  return parseFloat(value.toPrecision(7)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-amber-500">
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

export default function PowerConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kw");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;
    const watts = parsed * from.toWatt;
    return { watts, from, rows: UNITS.map((unit) => ({ ...unit, converted: watts / unit.toWatt })) };
  }, [fromUnit, value]);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <Layout>
      <SEO
        title="Power Converter - Convert Watts, Kilowatts, Horsepower, BTU/hr"
        description="Free online power converter. Convert watts, kilowatts, megawatts, horsepower, BTU/hr, calories per second, and more with live results and practical reference examples."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Power Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Power Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            The old version did the math but looked dated. This redesign keeps the same conversion coverage and gives the page a cleaner modern layout, quicker preset entry, clearer result cards, and stronger explanatory content for electrical, mechanical, and HVAC power comparisons.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> 14 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers electrical, mechanical, and thermal power units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Power Conversion</p>
                    <p className="text-sm text-muted-foreground">Instant results for watts, kW, horsepower, BTU/hr, and more.</p>
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
                      <p className="text-lg font-black text-foreground">{fmtPower(parseFloat(value))} {results.from.short} = {fmtPower(results.watts)} W</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-amber-500/40 bg-amber-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtPower(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtPower(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Power Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Device or System</th><th className="text-left px-4 py-3 font-bold text-foreground">Typical Power</th><th className="text-left px-4 py-3 font-bold text-foreground">Approx. Horsepower</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["LED light bulb", "8-15 W", "0.01-0.02 hp", "Tiny household load"],
                      ["Desktop PC", "200-600 W", "0.27-0.80 hp", "Useful for UPS sizing"],
                      ["Microwave", "600-1200 W", "0.8-1.6 hp", "Common kitchen benchmark"],
                      ["Electric kettle", "1500-3000 W", "2-4 hp", "High-load appliance"],
                      ["1 ton AC cooling", "12,000 BTU/hr", "4.7 hp equivalent", "Standard HVAC comparison point"],
                      ["Home EV charger", "7-11 kW", "9.4-14.7 hp", "Garage circuit planning"],
                      ["Average sedan engine", "75-150 kW", "100-200 hp", "Automotive output range"],
                      ["Utility wind turbine", "2-5 MW", "2,682-6,705 hp", "Grid-scale renewable power"],
                      ["Large power plant unit", "1 GW", "1.34 million hp", "Why gigawatt notation exists"],
                    ].map((row) => (
                      <tr key={row[0]}><td className="px-4 py-3 font-medium text-foreground">{row[0]}</td><td className="px-4 py-3 font-mono text-amber-700 dark:text-amber-400">{row[1]}</td><td className="px-4 py-3 font-mono text-foreground">{row[2]}</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Power values become easier to understand when anchored to real equipment.</strong> A 10 watt bulb, a 1.5 kW kettle, a 7 kW EV charger, and a 150 hp engine are all describing the same physical idea: the rate at which energy is being delivered or consumed.</p>
                <p><strong className="text-foreground">Different industries publish that same idea in different unit systems.</strong> Electrical work usually prefers watts and kilowatts, automotive specs still favor horsepower, and HVAC catalogs remain heavily BTU/hr-based. This converter is useful because it lets those systems speak to each other cleanly.</p>
                <p><strong className="text-foreground">That matters in buying, sizing, and planning decisions.</strong> Homeowners compare appliance loads, HVAC technicians compare thermal capacity, mechanics read horsepower, and engineers step up to megawatts or gigawatts for industrial systems. Converting accurately removes one of the easiest sources of confusion.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Power Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><p className="font-bold text-foreground mb-1">Watts and Kilowatts</p><p className="text-sm text-muted-foreground leading-relaxed">The watt is the SI unit of power. One kilowatt is simply 1,000 watts. These are the most practical units for appliances, solar equipment, EV chargers, and panel-level electrical planning.</p></div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4"><p className="font-bold text-foreground mb-1">Horsepower</p><p className="text-sm text-muted-foreground leading-relaxed">Horsepower survives because engines, motors, pumps, and machinery are still described that way. The catch is that mechanical, electrical, and metric horsepower are not identical, so the exact definition matters.</p></div>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"><p className="font-bold text-foreground mb-1">BTU per Hour</p><p className="text-sm text-muted-foreground leading-relaxed">BTU/hr is a thermal power rate used in HVAC. A rating in BTU/hr and a rating in watts can describe the same cooling or heating power, just through different unit traditions.</p></div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"><p className="font-bold text-foreground mb-1">Power vs Energy</p><p className="text-sm text-muted-foreground leading-relaxed">Power is a rate. Energy is the total amount accumulated over time. That is why electricity bills are measured in kWh, not just kW. This page converts rates, while the Energy Converter handles stored or consumed totals.</p></div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">One watt equals one joule per second.</strong> That definition is simple, but it explains why power is always about how fast something is happening. The same device can have a fixed power rating while consuming very different total energy depending on how long it runs.</p>
                <p><strong className="text-foreground">That difference is why users mix up kW and kWh so often.</strong> A heater rated at 2 kW does not cost 2 kilowatt-hours automatically. It only reaches 2 kWh after running for one hour. Getting that distinction right is essential when reading product labels, estimating utility costs, or comparing system capacity.</p>
                <p><strong className="text-foreground">The converter uses watts as the internal bridge for every result.</strong> That makes the math stable and transparent whether the source is horsepower, BTU/hr, or a niche scientific unit. Once every value is expressed in watts, every other unit can be derived from the same base.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use watts and kilowatts for electrical demand, horsepower for engines and motors, and BTU/hr for HVAC. Convert to a common unit before comparing products or planning system capacity.</p>
                </div>
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between power and energy?" a="Power is the rate at which work is done or energy is transferred. Energy is the total amount used over time. A 1,000 watt heater uses power at a rate of 1,000 joules per second, but only consumes 1 kWh of energy after running for a full hour." />
                <FaqItem q="Why are there different kinds of horsepower?" a="Mechanical, electrical, and metric horsepower come from different standards and are not identical. Mechanical horsepower is about 745.7 watts, electrical horsepower is exactly 746 watts, and metric horsepower is about 735.5 watts. The label on the equipment matters." />
                <FaqItem q="How do I convert BTU/hr to kilowatts?" a="Multiply BTU/hr by 0.000293071. A common example is 12,000 BTU/hr, which is about 3.517 kW. This is why a 1-ton cooling system is often described as roughly 3.5 kW of cooling power." />
                <FaqItem q="Why does my electricity bill use kWh instead of kW?" a="Utilities bill for accumulated energy, not instantaneous rate. Kilowatts describe how fast energy is being used. Kilowatt-hours describe how much total energy was used over time." />
                <FaqItem q="Can I use this page for engine, motor, and HVAC specs?" a="Yes. That is exactly where it is useful. Automotive specs may use horsepower, electrical planners use watts or kilowatts, and HVAC catalogs often use BTU/hr. This page translates between those systems without changing the underlying physics." />
                <FaqItem q="Who benefits most from this converter?" a="Electricians, HVAC technicians, mechanics, engineering students, facilities teams, and anyone comparing appliance or machinery ratings can use it. It is especially helpful when the source documents mix unit systems." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Conversion Tools?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Keep moving through power, energy, force, torque, and pressure calculations with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-400"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter","Converter"],["#reference","Power Reference"],["#guide","Unit Guide"],["#faq","FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors"><div className="w-1 h-1 rounded-full bg-amber-500/40" />{label}</a>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {["14 live-converted units","Mechanical, electrical, and metric hp","BTU/hr support for HVAC","Real-world benchmark table"].map((note) => (
                    <div key={note} className="flex items-start gap-2"><Flame className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /><span>{note}</span></div>
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
