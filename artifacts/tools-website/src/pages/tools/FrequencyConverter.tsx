import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Radio } from "lucide-react";
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

interface FreqUnit { id: string; label: string; short: string; toHz: number; }

const UNITS: FreqUnit[] = [
  { id: "mhz_milli",label: "Millihertz",  short: "mHz",  toHz: 1e-3 },
  { id: "hz",  label: "Hertz",        short: "Hz",   toHz: 1 },
  { id: "khz", label: "Kilohertz",    short: "kHz",  toHz: 1000 },
  { id: "mhz", label: "Megahertz",    short: "MHz",  toHz: 1e6 },
  { id: "ghz", label: "Gigahertz",    short: "GHz",  toHz: 1e9 },
  { id: "thz", label: "Terahertz",    short: "THz",  toHz: 1e12 },
  { id: "rpm", label: "RPM",          short: "RPM",  toHz: 1/60 },
  { id: "rps", label: "RPS",          short: "RPS",  toHz: 1 },
  { id: "radps",label:"rad/s",        short: "rad/s",toHz: 1/(2*Math.PI) },
];

function fmtNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) < 1e-6 || Math.abs(n) > 1e13) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toLocaleString("en-US");
}

export default function FrequencyConverter() {
  const [fromUnit, setFromUnit] = useState("mhz");
  const [value, setValue] = useState("100");

  const results = useMemo(() => {
    const v = parseFloat(value) || 0;
    if (v <= 0) return null;
    const fromDef = UNITS.find(u => u.id === fromUnit);
    if (!fromDef) return null;
    const hz = v * fromDef.toHz;
    return UNITS.map(u => ({ ...u, converted: hz / u.toHz }));
  }, [value, fromUnit]);

  return (
    <div style={{ "--calc-hue": "260" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Frequency Converter — Convert Hz, kHz, MHz, GHz, RPM Instantly"
        description="Convert between hertz, kilohertz, megahertz, gigahertz, RPM, and radians per second. Free online frequency converter with complete reference and applications guide."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Frequency Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),65%,60%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Frequency Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","Hz to THz","RPM & rad/s","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert between hertz, kilohertz, megahertz, gigahertz, terahertz, RPM, RPS, and radians per second. Used for electronics, audio, radio, and mechanical engineering.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Radio className="w-5 h-5 text-[hsl(var(--calc-hue),65%,60%)]" />Frequency Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input" type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="100" />
              </div>
              <div>
                <label className="tool-calc-label">From Unit</label>
                <select className="tool-calc-input" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                  {UNITS.map(u => <option key={u.id} value={u.id}>{u.label} ({u.short})</option>)}
                </select>
              </div>
            </div>
            {results ? (
              <AnimatePresence mode="wait">
                <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.map(r => (
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),65%,60%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-base font-bold font-mono">{fmtNum(r.converted)}</p>
                        <p className="text-xs text-muted-foreground">{r.short}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground"><Radio className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>Enter a value to see all frequency conversions.</p></div>
            )}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequency in the Real World</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Application","Frequency","Unit","Notes"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["Human hearing range","20–20,000","Hz","Audible spectrum"],
                    ["AC power (US)","60","Hz","Mains electricity"],
                    ["AC power (EU)","50","Hz","European standard"],
                    ["AM radio","530–1,700","kHz","Amplitude modulation"],
                    ["FM radio","87.5–108","MHz","Frequency modulation"],
                    ["Wi-Fi 2.4 GHz","2,400–2,483.5","MHz","Common Wi-Fi band"],
                    ["Wi-Fi 5 GHz","5,150–5,850","MHz","Faster Wi-Fi band"],
                    ["CPU (modern)","3–5","GHz","Clock speed"],
                    ["5G (mmWave)","24–100","GHz","5G mobile network"],
                    ["Middle C (piano)","261.63","Hz","Musical note C4"],
                    ["Car engine (idle)","~800","RPM","~13.3 Hz"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => <td key={i} className="px-3 py-1.5 text-sm">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Hertz (Hz)", desc: "The SI unit of frequency: 1 cycle per second. Named after Heinrich Hertz. All other frequency units convert to/from Hz.", color: "border-l-purple-500" },
                { title: "MHz & GHz", desc: "Megahertz (10⁶ Hz) and gigahertz (10⁹ Hz) are used for radio, Wi-Fi, CPU speeds, and microwave signals. Higher = more data per second in digital comms.", color: "border-l-blue-500" },
                { title: "RPM", desc: "Revolutions per minute — used for motors, engines, hard drives (7,200 RPM), and drills. Convert: RPM ÷ 60 = RPS = Hz.", color: "border-l-green-500" },
                { title: "rad/s", desc: "Angular frequency (ω) used in physics and engineering. Converts as: ω = 2πf. A 60 Hz motor has ω = 120π ≈ 376.99 rad/s.", color: "border-l-amber-500" },
              ].map(c => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is frequency?" a="Frequency is the number of complete oscillations or cycles per second. It's measured in hertz (Hz). A 100 Hz signal completes 100 full cycles every second." />
              <FaqItem q="How do I convert RPM to Hz?" a="Divide RPM by 60. A 3,000 RPM motor = 3,000 ÷ 60 = 50 Hz. Conversely, multiply Hz by 60 to get RPM." />
              <FaqItem q="What is angular frequency (rad/s)?" a="Angular frequency (ω) describes rotation in radians per second rather than cycles per second. The relationship is ω = 2πf, where f is in Hz. Used in electrical engineering and physics equations." />
              <FaqItem q="Why is 60 Hz vs 50 Hz important?" a="AC power grids run at 60 Hz (US, Canada, Mexico) or 50 Hz (Europe, Asia, Africa). Motors, transformers, and some appliances are designed for one frequency — using the wrong one can cause overheating or damage." />
              <FaqItem q="What is GHz in CPU terms?" a="CPU clock speed in GHz means the processor executes that many billion cycles per second. A 3.5 GHz processor can perform up to 3.5 billion clock cycles per second. Modern CPUs typically range from 2–5 GHz." />
              <FaqItem q="What frequency is Wi-Fi?" a="Standard Wi-Fi operates at 2.4 GHz or 5 GHz bands. The 2.4 GHz band has better range; 5 GHz has less interference and higher speed. Wi-Fi 6E and Wi-Fi 7 also use a 6 GHz band." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),65%,60%)] to-[hsl(var(--calc-hue),55%,45%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Explore All Conversion Tools</h2>
            <p className="mb-5 opacity-90">More converters for angle, time, energy, and every unit you need.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/angle-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Angle Converter</Link>
              <Link href="/conversion/energy-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Energy Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/angle-converter","Angle Converter"],["/conversion/time-converter","Time Converter"],["/conversion/energy-converter","Energy Converter"],["/math/online-scientific-calculator","Scientific Calculator"],["/conversion/speed-converter","Speed Converter"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),65%,60%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["mHz to THz range","RPM & rad/s included","Free, no login","No data stored"].map(t => (
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
