import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
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

interface AngleUnit { id: string; label: string; short: string; toDeg: (v: number) => number; fromDeg: (v: number) => number; }

const PI = Math.PI;
const UNITS: AngleUnit[] = [
  { id: "deg",   label: "Degree",    short: "°",    toDeg: v => v,              fromDeg: v => v },
  { id: "rad",   label: "Radian",    short: "rad",  toDeg: v => v * 180/PI,     fromDeg: v => v * PI/180 },
  { id: "grad",  label: "Gradian",   short: "grad", toDeg: v => v * 0.9,        fromDeg: v => v / 0.9 },
  { id: "turn",  label: "Turn",      short: "turn", toDeg: v => v * 360,        fromDeg: v => v / 360 },
  { id: "arcmin",label: "Arcminute", short: "'",    toDeg: v => v / 60,         fromDeg: v => v * 60 },
  { id: "arcsec",label: "Arcsecond", short: "\"",   toDeg: v => v / 3600,       fromDeg: v => v * 3600 },
  { id: "mrad",  label: "Milliradian",short:"mrad", toDeg: v => v * 180/(PI*1000), fromDeg: v => v * PI*1000/180 },
];

function fmtNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) > 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toLocaleString("en-US");
}

export default function AngleConverter() {
  const [fromUnit, setFromUnit] = useState("deg");
  const [value, setValue] = useState("90");

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const fromDef = UNITS.find(u => u.id === fromUnit);
    if (!fromDef) return null;
    const deg = fromDef.toDeg(v);
    return UNITS.map(u => ({ ...u, converted: u.fromDeg(deg) }));
  }, [value, fromUnit]);

  return (
    <div style={{ "--calc-hue": "320" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Angle Converter — Convert Degrees, Radians, Gradians Instantly"
        description="Convert between degrees, radians, gradians, turns, arcminutes, and arcseconds. Free online angle converter with trigonometry reference and visual diagram."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Angle Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),60%,55%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Angle Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","7 Angle Units","Radians & Gradians","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert between degrees, radians, gradians, turns, arcminutes, arcseconds, and milliradians. Essential for math, physics, engineering, and navigation.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5">Angle Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="90" />
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
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),60%,55%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-base font-bold font-mono">{fmtNum(r.converted)}</p>
                        <p className="text-xs text-muted-foreground">{r.short}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground"><p>Enter a value to see all angle conversions.</p></div>
            )}
          </div>

          {/* Reference table */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Common Angle Reference</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Name","°","rad","grad","Notes"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["Full circle","360","2π","400","One complete rotation"],
                    ["Straight angle","180","π","200","Flat line"],
                    ["Right angle","90","π/2","100","L-shape, 90°"],
                    ["60°","60","π/3","66.7","Equilateral triangle corner"],
                    ["45°","45","π/4","50","Half a right angle"],
                    ["30°","30","π/6","33.3","Half of 60°"],
                    ["1 radian","57.296°","1","63.66","~57.3°"],
                    ["1 grad","0.9°","π/200","1","French/metric angle unit"],
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
                { title: "Degrees", desc: "The most common unit (0–360 per circle). Originated from Babylonian astronomy. Still the standard in everyday use, navigation, and most engineering.", color: "border-l-blue-500" },
                { title: "Radians", desc: "The SI and mathematical standard. 1 radian is the angle where arc length = radius. 2π radians = 360°. Used in calculus, physics, and programming (Math.sin/cos).", color: "border-l-green-500" },
                { title: "Gradians", desc: "Also called gon. 400 gradians per circle (100 per right angle). Used in surveying and civil engineering, especially in France and Europe.", color: "border-l-amber-500" },
                { title: "Arcminutes & Arcseconds", desc: "Used in astronomy and GPS. 1° = 60 arcminutes = 3,600 arcseconds. GPS accuracy of 1 arcsecond corresponds to ~30 meters on Earth's surface.", color: "border-l-purple-500" },
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
              <FaqItem q="How do you convert degrees to radians?" a="Multiply degrees by π/180. So 90° × π/180 = π/2 radians ≈ 1.5708. To go from radians to degrees, multiply by 180/π." />
              <FaqItem q="Why do programming languages use radians?" a="Because calculus formulas (derivatives of trig functions, Taylor series) are simplest in radians. sin(x) has derivative cos(x) only when x is in radians. This makes radians the natural mathematical unit." />
              <FaqItem q="What is a gradian?" a="A gradian (grad or gon) divides the full circle into 400 parts, giving 100 grads per right angle. This makes compass bearings (0–400) more systematic. Common in French surveying tradition." />
              <FaqItem q="What are arcminutes and arcseconds?" a={'1 degree = 60 arcminutes (\') = 3600 arcseconds ("). Used in astronomy to measure stellar coordinates, and in precision surveying. On Earth\'s surface, 1 arcminute ≈ 1 nautical mile (1,852 m).'} />
              <FaqItem q="What is a milliradian?" a="A milliradian (mrad) is 1/1000th of a radian. At 1,000 meters range, 1 mrad subtends 1 meter. Used in optics, long-range shooting, and military applications for range estimation." />
              <FaqItem q="How many degrees in π radians?" a="π radians = 180°. This is because the formula is: degrees = radians × (180/π). So π × (180/π) = 180°." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),60%,55%)] to-[hsl(var(--calc-hue),50%,40%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Conversion Tools</h2>
            <p className="mb-5 opacity-90">Explore our full toolkit of unit converters for every measurement.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/frequency-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Frequency Converter</Link>
              <Link href="/conversion/time-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Time Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/frequency-converter","Frequency Converter"],["/conversion/time-converter","Time Converter"],["/conversion/energy-converter","Energy Converter"],["/math/online-scientific-calculator","Scientific Calculator"],["/conversion/pressure-converter","Pressure Converter"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),60%,55%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["7 angle units","Degrees, radians, gradians","Free, no login","No data stored"].map(t => (
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
