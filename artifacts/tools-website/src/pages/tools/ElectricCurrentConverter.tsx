import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Zap } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// All units relative to Amperes (A)
const UNITS: { id: string; label: string; toAmp: number }[] = [
  { id: "a",    label: "Ampere (A)",         toAmp: 1 },
  { id: "ka",   label: "Kiloampere (kA)",    toAmp: 1000 },
  { id: "ma_m", label: "Milliampere (mA)",   toAmp: 0.001 },
  { id: "ua",   label: "Microampere (μA)",   toAmp: 1e-6 },
  { id: "na",   label: "Nanoampere (nA)",    toAmp: 1e-9 },
  { id: "pa",   label: "Picoampere (pA)",    toAmp: 1e-12 },
  { id: "stat_a",label: "Statampere (statA)",toAmp: 3.336e-10 },
  { id: "abamp",label: "Abampere (abA)",     toAmp: 10 },
  { id: "biot", label: "Biot (Bi)",          toAmp: 10 },
];

function fmtCurrent(v: number): string {
  if (v === 0) return "0";
  if (Math.abs(v) >= 1e9 || Math.abs(v) < 1e-12) return v.toExponential(4);
  return parseFloat(v.toPrecision(6)).toString();
}

export default function ElectricCurrentConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("a");

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || value.trim() === "") return null;
    const from = UNITS.find(u => u.id === fromUnit)!;
    const inAmp = v * from.toAmp;
    return UNITS.map(u => ({ ...u, value: inAmp / u.toAmp }));
  }, [value, fromUnit]);

  return (
    <div style={{ "--calc-hue": "195" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Electric Current Converter — Convert Amperes, mA, μA and More"
        description="Convert between amperes, milliamperes, microamperes, nanoamperes, kiloamperes, and more. Free online electric current unit converter with practical reference."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Electric Current Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),65%,40%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Electric Current Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","9 Units","A to pA Scale","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert between amperes, milliamperes, microamperes, nanoamperes, picoamperes, kiloamperes, and legacy CGS units. Includes an electrical safety reference.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Zap className="w-5 h-5 text-[hsl(var(--calc-hue),65%,40%)]" />Electric Current Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input font-mono" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="1" />
              </div>
              <div>
                <label className="tool-calc-label">From Unit</label>
                <select className="tool-calc-input" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
                  {UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
            </div>

            {results && (
              <AnimatePresence mode="wait">
                <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.map(r => (
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),65%,40%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-lg font-bold font-mono break-all">{fmtCurrent(r.value)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Electrical Safety: Current Levels & Effects</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Current Level","Effect on Human Body"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["< 1 mA",       "Not perceptible"],
                    ["1–5 mA",       "Slight tingling, not dangerous"],
                    ["5–10 mA",      "Painful shock, can let go"],
                    ["10–20 mA",     "Involuntary muscle contraction, 'can't let go' threshold"],
                    ["20–100 mA",    "Potentially fatal — ventricular fibrillation risk"],
                    ["100–300 mA",   "Likely fatal without immediate intervention"],
                    ["> 300 mA",     "Severe burns, cardiac arrest — nearly always fatal"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-1.5 font-mono font-bold text-[hsl(var(--calc-hue),65%,40%)]">{row[0]}</td>
                      <td className="px-3 py-1.5">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground italic">Note: Actual danger depends on path through the body, voltage, duration, and individual factors. Even low voltages can be lethal under the right conditions.</p>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Practical Current Reference</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Device / Application","Typical Current","Notes"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["Smartphone standby",       "~10–50 mA",      "Screen off, idle"],
                    ["USB device (USB 2.0 max)", "500 mA",         "USB 3.0 up to 900 mA"],
                    ["LED (typical)",            "10–30 mA",       "At rated voltage"],
                    ["Laptop charger",           "2–5 A",          "Depends on wattage"],
                    ["Household circuit (US)",   "15–20 A",        "Standard 120V breaker"],
                    ["Electric vehicle charging","16–80 A",        "Level 2 / DC fast charge"],
                    ["Lightning bolt",           "~30,000 A",      "Peak for ~30 microseconds"],
                    ["MRI machine magnet",       "~1000 A",        "Through superconducting coil"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-1.5 font-medium">{row[0]}</td>
                      <td className="px-3 py-1.5 font-mono text-sm text-[hsl(var(--calc-hue),65%,40%)]">{row[1]}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is electric current?" a="Electric current is the flow of electric charge through a conductor. Measured in amperes (A), it represents how many coulombs of charge pass a point per second (1 A = 1 C/s). Current flows from high potential (positive) to low (negative)." />
              <FaqItem q="What is the difference between AC and DC current?" a="DC (direct current) flows in one direction, like batteries. AC (alternating current) periodically reverses direction — household electricity is AC at 50 or 60 Hz. AC is easier to transmit long distances; DC is more efficient for electronics." />
              <FaqItem q="What is the relationship between amps, volts, and watts?" a="Power (W) = Voltage (V) × Current (A). A 60W light bulb at 120V draws 0.5A. At 240V, it draws 0.25A. Higher voltage means less current needed for the same power — that's why high-voltage power lines are efficient." />
              <FaqItem q="What is Ohm's Law?" a="V = I × R (Voltage = Current × Resistance). Rearranged: I = V/R and R = V/I. If voltage doubles and resistance stays constant, current doubles. If resistance doubles with constant voltage, current halves." />
              <FaqItem q="What are milliamperes used for?" a="Milliamperes (mA) describe small currents typical in electronics — sensor outputs, LED currents, microcontroller I/O pins, battery drain in standby mode. Microelectronics work in μA and nA ranges." />
              <FaqItem q="What are statamperes and abamperes?" a="Statampere is a CGS-Gaussian unit of current ≈ 3.336×10⁻¹⁰ A. Abampere (also called Biot) is the CGS-EMU unit = 10 A. Both are legacy units rarely used today but appear in older physics textbooks." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),65%,40%)] to-[hsl(var(--calc-hue),55%,30%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Physics Converters</h2>
            <p className="mb-5 opacity-90">Power, force, pressure, energy, and more.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/power-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Power Converter</Link>
              <Link href="/conversion/energy-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Energy Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/power-converter","Power Converter"],["/conversion/energy-converter","Energy Converter"],["/conversion/force-converter","Force Converter"],["/conversion/frequency-converter","Frequency Converter"],["/math/online-scientific-calculator","Scientific Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),65%,40%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["9 current units","Safety reference","Practical examples","Free, no login"].map(t => (
                  <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
