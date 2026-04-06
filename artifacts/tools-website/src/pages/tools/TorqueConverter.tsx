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
  RotateCw,
  Shield,
  Smartphone,
} from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const UNITS = [
  { id: "nm", label: "Newton-meter", short: "N-m", toNm: 1, note: "Base SI torque unit" },
  { id: "knm", label: "Kilonewton-meter", short: "kN-m", toNm: 1000, note: "Large industrial and structural torque" },
  { id: "mnm", label: "Millinewton-meter", short: "mN-m", toNm: 0.001, note: "Precision instruments and small mechanisms" },
  { id: "ncm", label: "Newton-centimeter", short: "N-cm", toNm: 0.01, note: "Small assembly and lab work" },
  { id: "nmm", label: "Newton-millimeter", short: "N-mm", toNm: 0.001, note: "Fastener and component-level specs" },
  { id: "dyn_cm", label: "Dyne-centimeter", short: "dyn-cm", toNm: 1e-7, note: "Older CGS notation" },
  { id: "ft_lbf", label: "Foot-pound force", short: "ft-lbf", toNm: 1.3558179, note: "US automotive and mechanical specs" },
  { id: "in_lbf", label: "Inch-pound force", short: "in-lbf", toNm: 0.1129848, note: "Smaller fasteners and tool settings" },
  { id: "in_ozf", label: "Inch-ounce force", short: "in-ozf", toNm: 0.0070616, note: "Very small rotary assemblies" },
  { id: "kgf_m", label: "Kilogram-force meter", short: "kgf-m", toNm: 9.80665, note: "Legacy practical engineering unit" },
  { id: "kgf_cm", label: "Kilogram-force centimeter", short: "kgf-cm", toNm: 0.0980665, note: "Motor and machinery catalogs" },
  { id: "gf_cm", label: "Gram-force centimeter", short: "gf-cm", toNm: 0.0000980665, note: "Fine mechanism and low-torque contexts" },
] as const;

const PRESETS = [
  { label: "Spark plug", value: "25", unit: "nm" },
  { label: "Bike pedal", value: "35", unit: "nm" },
  { label: "Small motor shaft", value: "150", unit: "in_lbf" },
  { label: "Wheel lug nuts", value: "100", unit: "ft_lbf" },
  { label: "Diesel engine", value: "2000", unit: "nm" },
];

const RELATED = [
  { title: "Force Converter", href: "/conversion/force-converter", benefit: "Pair torque with linear force values" },
  { title: "Power Converter", href: "/conversion/power-converter", benefit: "Relate torque and rotational power" },
  { title: "Pressure Converter", href: "/conversion/pressure-converter", benefit: "Useful in hydraulic and mechanical systems" },
  { title: "Energy Converter", href: "/conversion/energy-converter", benefit: "Connect work, torque, and energy concepts" },
  { title: "Scientific Calculator", href: "/math/online-scientific-calculator", benefit: "Handle follow-up engineering math" },
];

const FAQS = [
  {
    q: "What is torque?",
    a: "Torque is the turning effect of a force applied at a distance from a pivot or shaft. In plain terms, it tells you how strongly something is being twisted. That is why torque is central to engines, wrenches, motors, gearboxes, and any rotating system.",
  },
  {
    q: "What is the SI unit for torque?",
    a: "The SI unit is the Newton-meter, written here as N-m. One Newton-meter means one Newton of force applied one meter from the rotation axis. It is the standard unit in physics and most international engineering documents.",
  },
  {
    q: "Is foot-pound the same as pound-foot?",
    a: "In everyday shop language people often say foot-pound or pound-foot interchangeably when discussing torque. The important part is that torque uses pound-force at a lever arm distance, usually written as ft-lbf in technical notation. That should not be confused with foot-pound as a unit of energy in other contexts.",
  },
  {
    q: "How do I convert ft-lbf to N-m?",
    a: "Multiply ft-lbf by 1.3558179. For example, 100 ft-lbf is about 135.58 N-m. This converter does that automatically and also translates the same input into inch-pound, kilogram-force meter, and other torque units at the same time.",
  },
  {
    q: "What is the difference between torque and force?",
    a: "Force is a push or pull in a straight-line sense. Torque is rotational force, which depends on both the force magnitude and the lever arm distance from the pivot. The same force applied farther from the center creates more torque.",
  },
  {
    q: "What is the difference between torque and power?",
    a: "Torque measures twisting force. Power measures how quickly work is done. A machine can have high torque at low speed or lower torque at high speed and still produce similar power. That is why engine and motor specs often list both torque and horsepower or kilowatts.",
  },
  {
    q: "Why are inch-pound and kilogram-force centimeter still used?",
    a: "Because tool calibration, fastener charts, older manuals, and regional industrial habits persist. Small fasteners in electronics or mechanical assembly often use in-lbf, while some motors and legacy documentation still use kgf-cm or kgf-m.",
  },
  {
    q: "Who is this torque converter useful for?",
    a: "It is useful for mechanics, engineers, technicians, students, fabrication teams, bike repair shops, industrial maintenance staff, and anyone reading mixed-unit torque specs on tools, fasteners, engines, or rotating equipment.",
  },
];

function fmtTorque(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e8 || Math.abs(value) < 0.0001) return value.toExponential(4);
  return parseFloat(value.toPrecision(7)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-cyan-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-cyan-500">
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

export default function TorqueConverter() {
  const [value, setValue] = useState("50");
  const [fromUnit, setFromUnit] = useState("nm");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;

    const newtonMeters = parsed * from.toNm;

    return {
      newtonMeters,
      from,
      rows: UNITS.map((unit) => ({
        ...unit,
        converted: newtonMeters / unit.toNm,
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
        title="Torque Converter - Convert N-m, ft-lbf, in-lbf, kgf-m"
        description="Free online torque converter. Convert Newton-meters, foot-pound force, inch-pound force, kilogram-force meter, and more with live results and practical reference examples."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <span className="text-foreground">Torque Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-card to-sky-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <RotateCw className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Torque Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert Newton-meters, foot-pound force, inch-pound force, kilogram-force units, and other torque measurements instantly. This redesign keeps the existing conversion coverage but gives the page a cleaner calculator layout, stronger mechanical context, and more useful reference content.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><RotateCw className="w-3.5 h-3.5" /> 12 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers SI, imperial, and legacy practical torque units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-sky-400" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-400 flex items-center justify-center"><RotateCw className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Torque Conversion</p>
                    <p className="text-sm text-muted-foreground">Translate fastener, engine, motor, and tool torque values instantly.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="tool-calc-input w-full font-mono text-lg" placeholder="50" />
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
                      <p className="text-lg font-black text-foreground">{fmtTorque(parseFloat(value))} {results.from.short} = {fmtTorque(results.newtonMeters)} N-m</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-cyan-500/40 bg-cyan-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtTorque(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtTorque(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Torque Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Example</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Typical Torque</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Imperial</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Precision screwdriver", "0.3-3 N-m", "2.7-26.6 in-lbf", "Electronics and tiny assemblies"],
                      ["Spark plug", "15-30 N-m", "11-22 ft-lbf", "Small engine service"],
                      ["Bike pedal or crank bolt", "35-50 N-m", "26-37 ft-lbf", "Cycling maintenance"],
                      ["Lawn mower blade bolt", "60-100 N-m", "44-74 ft-lbf", "Outdoor power equipment"],
                      ["Passenger car lug nuts", "110-150 N-m", "81-111 ft-lbf", "Common automotive spec"],
                      ["Sedan engine output", "180-350 N-m", "133-258 ft-lbf", "Typical passenger vehicle range"],
                      ["Diesel pickup engine", "800-1400 N-m", "590-1,033 ft-lbf", "High-torque towing applications"],
                      ["Industrial gearbox", "2-20 kN-m", "1,475-14,751 ft-lbf", "Heavy machinery scale"],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-mono text-cyan-700 dark:text-cyan-400">{row[1]}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Torque numbers become much easier to interpret when tied to real hardware.</strong> A spark plug, a bike pedal, a wheel lug nut, and a diesel engine all live on different torque scales, but the underlying concept is the same: rotational force applied around a shaft or pivot.</p>
                <p><strong className="text-foreground">That matters because specs are rarely published in one clean unit system.</strong> Automotive manuals may show ft-lbf, engineering textbooks prefer N-m, and motor or tool catalogs can still use kgf-cm or in-lbf. A converter removes that friction and lets you compare values directly.</p>
                <p><strong className="text-foreground">It also helps prevent mistakes when setting tools.</strong> Using the wrong unit family on a torque wrench or motor spec sheet can produce a major over-tightening or under-tightening error. Converting first is a basic but important quality-control step.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Torque Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Newton-meter</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">N-m is the SI standard for torque. It is the cleanest choice for engineering calculations because it fits directly into metric physics formulas and most modern technical documentation.</p>
                </div>
                <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Foot-pound and Inch-pound</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">ft-lbf dominates US automotive and shop work, while in-lbf is common for smaller fasteners, controls, and mechanical assemblies. They remain essential because many torque tools and manuals still use them by default.</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">kgf-m and kgf-cm</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">These legacy practical units still appear in machinery catalogs, service sheets, and regional documentation. They are not SI, but they remain common enough that translation support is still useful in real maintenance work.</p>
                </div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="font-bold text-foreground mb-1">Torque vs Force vs Power</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Force is linear push or pull. Torque is rotational effect. Power is how quickly work is done. You often need all three when reading engine, motor, or drivetrain specs, but they are not interchangeable.</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Torque depends on both force and distance.</strong> If you apply the same force with a longer wrench handle, you create more torque because the lever arm is larger. That is why breaker bars and long-handled tools make stubborn fasteners easier to turn.</p>
                <p><strong className="text-foreground">This page uses Newton-meters as the internal bridge.</strong> Every input is converted into N-m first, and then translated into every other supported torque unit. That keeps the math consistent whether the source value starts as ft-lbf, kgf-cm, or dyn-cm.</p>
                <p><strong className="text-foreground">The practical takeaway is simple:</strong> match your torque wrench, manual, and target fastener spec to the same unit family before tightening anything. The unit mismatch is often the real error, not the math itself.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use N-m for engineering calculations, ft-lbf for automotive wrench specs, and in-lbf for small fasteners and precision assemblies. Convert once, then stay in one unit family while working.</p>
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

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Mechanical Converters?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Move from torque into force, power, energy, and pressure with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-cyan-500 to-sky-500"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-cyan-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter", "Converter"], ["#reference", "Torque Reference"], ["#guide", "Unit Guide"], ["#faq", "FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-cyan-500/40" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "12 live-converted torque units",
                    "Covers SI, imperial, and legacy units",
                    "Built for fastener, engine, and motor specs",
                    "Includes real-world torque benchmarks",
                  ].map((note) => (
                    <div key={note} className="flex items-start gap-2">
                      <Flame className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
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
