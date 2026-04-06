import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Layers } from "lucide-react";
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

// All units relative to kg/m³
const UNITS: { id: string; label: string; toKgM3: number }[] = [
  { id: "kg_m3",   label: "kg/m³",      toKgM3: 1 },
  { id: "g_cm3",   label: "g/cm³",      toKgM3: 1000 },
  { id: "g_ml",    label: "g/mL",       toKgM3: 1000 },
  { id: "kg_l",    label: "kg/L",       toKgM3: 1000 },
  { id: "mg_ml",   label: "mg/mL",      toKgM3: 1 },
  { id: "mg_l",    label: "mg/L",       toKgM3: 0.001 },
  { id: "lb_ft3",  label: "lb/ft³",     toKgM3: 16.0185 },
  { id: "lb_in3",  label: "lb/in³",     toKgM3: 27679.9 },
  { id: "lb_gal",  label: "lb/gal (US)",toKgM3: 119.826 },
  { id: "oz_in3",  label: "oz/in³",     toKgM3: 1729.99 },
  { id: "oz_ft3",  label: "oz/ft³",     toKgM3: 1.00115 },
];

function fmtDensity(v: number): string {
  if (v === 0) return "0";
  if (Math.abs(v) >= 1e6 || Math.abs(v) < 0.001) return v.toExponential(4);
  return v.toPrecision(6).replace(/\.?0+$/, "");
}

export default function DensityConverter() {
  const [value, setValue] = useState("1000");
  const [fromUnit, setFromUnit] = useState("kg_m3");

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || value.trim() === "") return null;
    const from = UNITS.find(u => u.id === fromUnit)!;
    const inKgM3 = v * from.toKgM3;
    return UNITS.map(u => ({ ...u, value: inKgM3 / u.toKgM3 }));
  }, [value, fromUnit]);

  return (
    <div style={{ "--calc-hue": "215" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Density Converter — Convert kg/m³, g/cm³, lb/ft³ and More"
        description="Convert between density units including kg/m³, g/cm³, g/mL, lb/ft³, lb/in³, and more. Free online density converter with a common materials reference table."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Density Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),65%,45%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Density Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","11 Units","SI & Imperial","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert between all major density units — metric (kg/m³, g/cm³, g/mL) and imperial (lb/ft³, lb/in³). Includes a reference table of common material densities.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Layers className="w-5 h-5 text-[hsl(var(--calc-hue),65%,45%)]" />Density Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input font-mono" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="1000" />
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
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),65%,45%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-lg font-bold font-mono break-all">{fmtDensity(r.value)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Common Material Densities</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Material","kg/m³","g/cm³","lb/ft³"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["Water (4°C)",    "1000",   "1.000",  "62.43"],
                    ["Seawater",       "1025",   "1.025",  "63.99"],
                    ["Ice",            "917",    "0.917",  "57.24"],
                    ["Air (sea level)","1.225",  "0.00123","0.0765"],
                    ["Aluminum",       "2700",   "2.700",  "168.5"],
                    ["Iron / Steel",   "7874",   "7.874",  "491.5"],
                    ["Gold",           "19300",  "19.300", "1204"],
                    ["Lead",           "11340",  "11.340", "708.0"],
                    ["Wood (oak)",     "600–900","0.6–0.9","37–56"],
                    ["Concrete",       "2000–2400","2.0–2.4","125–150"],
                    ["Gasoline",       "720–775","0.72–0.78","45–48"],
                    ["Ethanol",        "789",    "0.789",  "49.26"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      <td className="px-3 py-1.5 font-medium">{row[0]}</td>
                      <td className="px-3 py-1.5 font-mono text-sm text-[hsl(var(--calc-hue),65%,45%)]">{row[1]}</td>
                      <td className="px-3 py-1.5 font-mono text-sm">{row[2]}</td>
                      <td className="px-3 py-1.5 font-mono text-sm">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is density?" a="Density is mass per unit volume: ρ = m/V. A higher density means more mass packed into the same volume. Water has a density of 1 g/cm³ (1000 kg/m³), making it a common reference point." />
              <FaqItem q="Why does ice float on water?" a="Ice (917 kg/m³) is less dense than liquid water (1000 kg/m³). When water freezes, it forms a crystal lattice that actually takes up more space — making it lighter per volume, so it floats." />
              <FaqItem q="What is specific gravity?" a="Specific gravity is the ratio of a material's density to the density of water at 4°C (1000 kg/m³). Since water = 1 g/cm³, specific gravity is numerically equal to density in g/cm³ and has no units." />
              <FaqItem q="How do I convert kg/m³ to g/cm³?" a="Divide by 1000. Example: 1000 kg/m³ ÷ 1000 = 1 g/cm³. This works because 1 m³ = 1,000,000 cm³ and 1 kg = 1000 g, so the ratio is 1000." />
              <FaqItem q="What units are used in engineering?" a="SI engineering typically uses kg/m³. Materials science often uses g/cm³ (numerically equal to specific gravity). US/imperial engineering uses lb/ft³ or lb/in³ depending on scale." />
              <FaqItem q="Can density be less than zero?" a="No — density is always positive. However, it can be very small (like air at 1.225 kg/m³) or very large (like osmium at ~22,590 kg/m³, the densest naturally occurring element)." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),65%,45%)] to-[hsl(var(--calc-hue),55%,33%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Unit Converters</h2>
            <p className="mb-5 opacity-90">Explore our complete collection of conversion tools.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/weight-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Weight Converter</Link>
              <Link href="/conversion/pressure-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Pressure Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/weight-converter","Weight Converter"],["/conversion/pressure-converter","Pressure Converter"],["/conversion/volume-converter","Volume Converter"],["/conversion/energy-converter","Energy Converter"],["/conversion/force-converter","Force Converter"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),65%,45%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["11 density units","SI & imperial","Material reference","Free, no login"].map(t => (
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
