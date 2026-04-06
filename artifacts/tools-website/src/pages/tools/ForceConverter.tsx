import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Gauge,
  Lock,
  MoveDown,
  Shield,
  Smartphone,
  Sparkles,
  Weight,
} from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const UNITS = [
  { id: "n", label: "Newton", short: "N", toN: 1, note: "Base SI force unit" },
  { id: "kn", label: "Kilonewton", short: "kN", toN: 1000, note: "Structural and engineering loads" },
  { id: "mn", label: "Meganewton", short: "MN", toN: 1_000_000, note: "Large industrial and aerospace thrust" },
  { id: "mn_m", label: "Millinewton", short: "mN", toN: 0.001, note: "Small force and laboratory work" },
  { id: "un", label: "Micronewton", short: "μN", toN: 1e-6, note: "Precision instrumentation" },
  { id: "dyn", label: "Dyne", short: "dyn", toN: 1e-5, note: "CGS system" },
  { id: "kgf", label: "Kilogram-force", short: "kgf", toN: 9.80665, note: "Legacy engineering and practical mechanics" },
  { id: "gf", label: "Gram-force", short: "gf", toN: 0.00980665, note: "Very small practical loads" },
  { id: "tf", label: "Tonne-force", short: "tf", toN: 9806.65, note: "Heavy load language" },
  { id: "lbf", label: "Pound-force", short: "lbf", toN: 4.4482216, note: "Imperial engineering and US practical use" },
  { id: "ozf", label: "Ounce-force", short: "ozf", toN: 0.2780139, note: "Small imperial load values" },
  { id: "tonf", label: "Ton-force (US)", short: "tonf", toN: 8896.443, note: "Heavy US load notation" },
  { id: "pdl", label: "Poundal", short: "pdl", toN: 0.138255, note: "Older imperial mechanics" },
] as const;

const PRESETS = [
  { label: "1 kg on Earth", value: "1", unit: "kgf" },
  { label: "Car braking load", value: "10", unit: "kn" },
  { label: "Human bite force", value: "800", unit: "n" },
  { label: "Rocket thrust sample", value: "7.6", unit: "mn" },
  { label: "1 lb force", value: "1", unit: "lbf" },
];

const RELATED = [
  { title: "Torque Converter", href: "/conversion/torque-converter", benefit: "Pair rotational and linear mechanics" },
  { title: "Pressure Converter", href: "/conversion/pressure-converter", benefit: "Translate force over area contexts" },
  { title: "Power Converter", href: "/conversion/power-converter", benefit: "Move from force to rate-based systems" },
  { title: "Energy Converter", href: "/conversion/energy-converter", benefit: "Connect work and force calculations" },
  { title: "Weight Converter", href: "/conversion/weight-converter", benefit: "Separate mass from force correctly" },
];

const FAQS = [
  {
    q: "What is a Newton?",
    a: "A Newton is the SI unit of force. One Newton is the amount of force needed to accelerate one kilogram of mass by one meter per second squared. It is the standard physics and engineering unit for force because it connects directly to Newton’s second law, F = m × a.",
  },
  {
    q: "What is the difference between mass and force?",
    a: "Mass is the amount of matter in an object. Force is the push or pull acting on that mass. Weight is a force caused by gravity acting on mass. That is why a 1 kilogram mass corresponds to about 9.80665 Newtons of weight on Earth, but a different force on the Moon or another planet.",
  },
  {
    q: "Why do kilogram-force and pound-force still exist if Newtons are the SI standard?",
    a: "Because practical engineering and industry habits outlast formal standards. Many machine drawings, test rigs, hydraulic systems, spring specifications, and older documentation still use kilogram-force or pound-force. Converters remain useful because real-world technical work often involves translating between modern SI units and legacy practical units.",
  },
  {
    q: "How do I convert kilogram-force to Newtons?",
    a: "Multiply kilogram-force by 9.80665. For example, 10 kgf equals about 98.0665 N. This works because kilogram-force is defined as the force exerted by standard gravity on a one-kilogram mass.",
  },
  {
    q: "What is pound-force versus pound-mass?",
    a: "Pound-mass describes the amount of matter, while pound-force describes force. In everyday conversation people blur them together, but in engineering that distinction matters. A pound-force is the gravitational force on a one-pound mass under standard gravity, while pound-mass is just the mass itself.",
  },
  {
    q: "What is a dyne used for?",
    a: "A dyne is a CGS-system force unit equal to 10^-5 Newtons. It appears in older physics literature, some scientific formulas, and niche measurement contexts where forces are very small. It is not common in mainstream engineering today, but it still appears often enough to justify conversion support.",
  },
  {
    q: "Can I use this converter for structural, automotive, and aerospace work?",
    a: "Yes, within the limits of basic unit conversion. It is useful for translating force values across structural loads, braking forces, lifting systems, thrust comparisons, hydraulics, and engineering references. It does not replace engineering design calculations, but it does remove confusion when unit systems differ.",
  },
  {
    q: "Who is this force converter useful for?",
    a: "It is useful for students, mechanics, engineers, physics learners, technicians, builders, fabrication teams, and anyone reading specs or formulas that mix SI and imperial or practical force units. It is especially useful when you need to compare data from textbooks, calculators, drawings, and manufacturer documents that do not use the same unit family.",
  },
];

function fmtForce(value: number) {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1e8 || Math.abs(value) < 0.0001) return value.toExponential(4);
  return parseFloat(value.toPrecision(7)).toLocaleString("en-US");
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-rose-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-rose-500">
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

export default function ForceConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kn");
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || value.trim() === "") return null;
    const from = UNITS.find((unit) => unit.id === fromUnit);
    if (!from) return null;
    const newtons = parsed * from.toN;
    return { newtons, from, rows: UNITS.map((unit) => ({ ...unit, converted: newtons / unit.toN })) };
  }, [fromUnit, value]);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <Layout>
      <SEO
        title="Force Converter - Convert Newtons, Pound-force, Kilogram-force"
        description="Free online force converter. Convert Newtons, kilonewtons, pound-force, kilogram-force, dynes, tonne-force, and more with live results and real-world force references."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">Force Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <MoveDown className="w-3.5 h-3.5" /> Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">Force Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert Newtons, kilonewtons, pound-force, kilogram-force, dynes, tonne-force, and other force units instantly. This redesign keeps the same conversion coverage but gives the tool a clearer layout, better result scanning, stronger educational context, and more practical engineering reference points.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-500/20"><MoveDown className="w-3.5 h-3.5" /> 13 Units</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Conversion Tools | Covers SI, imperial, and practical engineering force units</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="converter" className="rounded-2xl overflow-hidden border border-rose-500/20 shadow-lg shadow-rose-500/5">
              <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-400" />
              <div className="bg-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center"><MoveDown className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Force Conversion</p>
                    <p className="text-sm text-muted-foreground">Translate force values across SI, imperial, and legacy practical systems instantly.</p>
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
                      <p className="text-lg font-black text-foreground">{fmtForce(parseFloat(value))} {results.from.short} = {fmtForce(results.newtons)} N</p>
                      <p className="text-sm text-muted-foreground mt-1">{results.from.note}</p>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {results.rows.map((row) => (
                          <div key={row.id} className={`rounded-2xl border p-4 ${row.id === fromUnit ? "border-rose-500/40 bg-rose-500/5" : "border-border bg-card"}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                                <p className="text-2xl font-black text-foreground font-mono break-all">{fmtForce(row.converted)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{row.short}</p>
                              </div>
                              <button onClick={() => copyText(row.id, `${fmtForce(row.converted)} ${row.short}`)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={`Copy ${row.label}`}>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-World Force Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Example Force</th><th className="text-left px-4 py-3 font-bold text-foreground">Newtons</th><th className="text-left px-4 py-3 font-bold text-foreground">Pound-force</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Context</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Weight of 1 kg on Earth", "9.807 N", "2.205 lbf", "Baseline gravity example"],
                      ["Weight of 1 lb mass", "4.448 N", "1.000 lbf", "Imperial reference point"],
                      ["Typical smartphone weight", "~1.5 N", "~0.34 lbf", "Pocket device scale"],
                      ["Human bite force", "700-1000 N", "157-225 lbf", "Common biological benchmark"],
                      ["Car braking force", "5,000-15,000 N", "1,124-3,372 lbf", "Automotive load range"],
                      ["Falcon 9 sea-level thrust", "7.6 MN", "1.71 million lbf", "Rocket engine scale"],
                      ["Saturn V liftoff thrust", "34 MN", "7.6 million lbf", "Historic aerospace benchmark"],
                    ].map((row) => (
                      <tr key={row[0]}><td className="px-4 py-3 font-medium text-foreground">{row[0]}</td><td className="px-4 py-3 font-mono text-rose-700 dark:text-rose-400">{row[1]}</td><td className="px-4 py-3 font-mono text-foreground">{row[2]}</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row[3]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Force becomes easier to grasp when you tie it to physical examples.</strong> The weight of a 1 kilogram mass, the bite force of a person, the braking force on a vehicle, and the thrust of a rocket all describe force, but they live on very different scales. A converter helps because the notation changes, even though the underlying concept stays the same.</p>
                <p><strong className="text-foreground">The same force can be described through several unit systems depending on the field.</strong> Physics and modern engineering tend to prefer Newtons and kilonewtons. Practical mechanics may still speak in kilogram-force. US engineering references often use pound-force. Aerospace and heavy-load discussions may move quickly into mega-Newtons or ton-force notation.</p>
                <p><strong className="text-foreground">That matters because force values are often read out of context.</strong> A spec sheet, machine manual, drawing, classroom problem, or manufacturer table might not use the same unit family as the rest of your workflow. Translating correctly is the first step before doing any real design, safety check, structural comparison, or educational interpretation.</p>
              </div>
            </section>

            <section id="guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Force Units</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4"><p className="font-bold text-foreground mb-1">Newton and Kilonewton</p><p className="text-sm text-muted-foreground leading-relaxed">Newtons are the SI standard for force, and kilonewtons are the practical step-up for structural, automotive, and industrial loads. These are the cleanest units when working inside modern engineering calculations.</p></div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4"><p className="font-bold text-foreground mb-1">Kilogram-force and Gram-force</p><p className="text-sm text-muted-foreground leading-relaxed">These practical units describe the force exerted by gravity on a given mass under standard gravity. They remain common in machine specs, spring data, and older engineering references even though they are not SI units.</p></div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><p className="font-bold text-foreground mb-1">Pound-force and Ounce-force</p><p className="text-sm text-muted-foreground leading-relaxed">Imperial engineering still uses pound-force heavily. This becomes especially relevant when comparing US hardware, automotive references, manufacturing specs, and historical technical material that does not express loads in Newtons.</p></div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"><p className="font-bold text-foreground mb-1">Mass Is Not Force</p><p className="text-sm text-muted-foreground leading-relaxed">Mass tells you how much matter is present. Force tells you how strongly that mass is being pushed, pulled, or accelerated. Confusing kilograms with Newtons is one of the most common beginner errors in mechanics and applied physics.</p></div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Force is defined through motion and acceleration.</strong> Newton’s second law states that force equals mass times acceleration. That means force is not just “weight” or “pressure” in a vague sense. It is a measurable interaction that changes motion or resists motion. That is why Newtons remain the cleanest universal unit.</p>
                <p><strong className="text-foreground">Weight is one special case of force.</strong> On Earth, gravity creates a downward force on mass, which is why a 1 kilogram object corresponds to about 9.80665 Newtons of weight. But that same mass would have a different weight on the Moon because the gravitational acceleration changes, even though the mass itself stays constant.</p>
                <p><strong className="text-foreground">Legacy force units survive because real industries do not rewrite history overnight.</strong> A modern design office may calculate in Newtons but still receive supplier data in pound-force or kilogram-force. A converter like this is not academic filler. It is a practical bridge between unit systems that still coexist across manufacturing, maintenance, structural work, and education.</p>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3 items-start">
                  <Sparkles className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Practical shortcut:</strong> use Newtons or kilonewtons for clean engineering math, but keep pound-force and kilogram-force handy whenever you are translating manufacturer specs, workshop data, or older documentation.</p>
                </div>
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Conversion Tools?</h2>
                <p className="text-white/85 mb-6 max-w-lg">Keep moving through force, torque, pressure, power, and other mechanics-related calculations with the rest of the conversion suite.</p>
                <Link href="/category/conversion" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br from-rose-500 to-orange-400"><Gauge className="w-3.5 h-3.5" /></div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-rose-500 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[["#converter","Converter"],["#reference","Force Reference"],["#guide","Unit Guide"],["#faq","FAQ"]].map(([href, label]) => (
                    <a key={href} href={href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-rose-500 font-medium py-1.5 transition-colors"><div className="w-1 h-1 rounded-full bg-rose-500/40" />{label}</a>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Quick Notes</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {["13 live-converted units","SI, imperial, and practical force notation","Mass-versus-force guidance included","Real-world benchmark table"].map((note) => (
                    <div key={note} className="flex items-start gap-2"><Weight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /><span>{note}</span></div>
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
