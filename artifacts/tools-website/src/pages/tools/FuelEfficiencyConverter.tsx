import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Fuel } from "lucide-react";
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

interface FuelUnit { id: string; label: string; short: string; toKmPerL: (v: number) => number; fromKmPerL: (v: number) => number; }

const UNITS: FuelUnit[] = [
  { id: "mpg_us", label: "Miles per Gallon (US)", short: "MPG (US)", toKmPerL: v => v * 0.425144, fromKmPerL: v => v / 0.425144 },
  { id: "mpg_uk", label: "Miles per Gallon (UK)", short: "MPG (UK)", toKmPerL: v => v * 0.354006, fromKmPerL: v => v / 0.354006 },
  { id: "kml",    label: "Km per Liter",          short: "km/L",    toKmPerL: v => v,            fromKmPerL: v => v },
  { id: "l100km", label: "Liters per 100 km",     short: "L/100km", toKmPerL: v => 100/v,        fromKmPerL: v => 100/v },
  { id: "kpg",    label: "Km per Gallon (US)",    short: "km/gal",  toKmPerL: v => v / 3.78541,  fromKmPerL: v => v * 3.78541 },
  { id: "mpl",    label: "Miles per Liter",       short: "mi/L",    toKmPerL: v => v * 1.60934,  fromKmPerL: v => v / 1.60934 },
];

function fmtNum(n: number): string {
  if (!isFinite(n) || n <= 0) return "—";
  return parseFloat(n.toPrecision(6)).toLocaleString("en-US");
}

export default function FuelEfficiencyConverter() {
  const [fromUnit, setFromUnit] = useState("mpg_us");
  const [value, setValue] = useState("30");
  const [gasPrice, setGasPrice] = useState("3.50");
  const [annualMiles, setAnnualMiles] = useState("12000");

  const results = useMemo(() => {
    const v = parseFloat(value) || 0;
    if (v <= 0) return null;
    const fromDef = UNITS.find(u => u.id === fromUnit);
    if (!fromDef) return null;
    const kmPerL = fromDef.toKmPerL(v);
    return UNITS.map(u => ({ ...u, converted: u.fromKmPerL(kmPerL) }));
  }, [value, fromUnit]);

  const fuelCost = useMemo(() => {
    const mpgVal = results?.find(r => r.id === "mpg_us")?.converted ?? 0;
    const price = parseFloat(gasPrice) || 0;
    const miles = parseFloat(annualMiles) || 0;
    if (mpgVal <= 0 || price <= 0 || miles <= 0) return null;
    const gallons = miles / mpgVal;
    const annual = gallons * price;
    const monthly = annual / 12;
    const perMile = price / mpgVal;
    return { annual, monthly, perMile, gallons };
  }, [results, gasPrice, annualMiles]);

  return (
    <div style={{ "--calc-hue": "105" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Fuel Efficiency Converter — Convert MPG, km/L, L/100km Instantly"
        description="Convert between MPG (US/UK), km/L, L/100km, and more. Includes annual fuel cost calculator. Free online fuel efficiency converter."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Fuel Efficiency Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),60%,38%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Fuel Efficiency Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","MPG, km/L, L/100km","Fuel Cost Calculator","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert fuel economy between MPG (US/UK), km/L, L/100km, and more. Includes an annual fuel cost estimator so you can compare real-world running costs between vehicles.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Fuel className="w-5 h-5 text-[hsl(var(--calc-hue),60%,38%)]" />Fuel Efficiency Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input" type="number" min="0" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="30" />
              </div>
              <div>
                <label className="tool-calc-label">From Unit</label>
                <select className="tool-calc-input" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                  {UNITS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
            </div>
            {results ? (
              <AnimatePresence mode="wait">
                <motion.div key={`${value}-${fromUnit}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {results.map(r => (
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),60%,38%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-base font-bold font-mono">{fmtNum(r.converted)}</p>
                        <p className="text-xs text-muted-foreground">{r.short}</p>
                      </div>
                    ))}
                  </div>

                  {/* Fuel cost section */}
                  <div className="border-t border-border pt-5">
                    <p className="font-semibold mb-4">Annual Fuel Cost Estimator</p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="tool-calc-label">Gas Price ($/gallon US)</label>
                        <input className="tool-calc-input" type="number" min="0" step="0.01" value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} placeholder="3.50" />
                      </div>
                      <div>
                        <label className="tool-calc-label">Annual Miles Driven</label>
                        <input className="tool-calc-input" type="number" min="0" value={annualMiles} onChange={(e) => setAnnualMiles(e.target.value)} placeholder="12000" />
                      </div>
                    </div>
                    {fuelCost && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Annual Fuel Cost", value: `$${fuelCost.annual.toFixed(2)}`, color: "text-red-500" },
                          { label: "Monthly Cost", value: `$${fuelCost.monthly.toFixed(2)}`, color: "text-amber-600" },
                          { label: "Cost per Mile", value: `$${fuelCost.perMile.toFixed(4)}`, color: "text-blue-600" },
                          { label: "Gallons/Year", value: fuelCost.gallons.toFixed(0), color: "text-muted-foreground" },
                        ].map(c => (
                          <div key={c.label} className="tool-calc-result text-center">
                            <div className={`tool-calc-number text-lg font-bold ${c.color}`}>{c.value}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground"><Fuel className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>Enter a fuel efficiency value to begin.</p></div>
            )}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">MPG vs L/100km Explained</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: "Higher MPG = More Efficient", desc: "Miles per gallon is a 'more is better' metric — a car rated 40 MPG is twice as efficient as one rated 20 MPG.", color: "border-l-green-500" },
                { title: "Lower L/100km = More Efficient", desc: "Liters per 100km is a 'less is better' metric — 5 L/100km is more efficient than 10 L/100km. It's the inverse relationship.", color: "border-l-blue-500" },
                { title: "US vs UK Gallon", desc: "1 US gallon = 3.785 L. 1 UK gallon = 4.546 L. So a car rated 30 MPG (US) is only ~25 MPG (UK) — the larger gallon makes UK figures appear better.", color: "border-l-amber-500" },
                { title: "Real World vs Rated", desc: "Official MPG figures are from standardized tests. Real-world fuel economy can be 10–20% lower depending on driving style, highway vs city, AC use, and load.", color: "border-l-red-400" },
              ].map(c => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["MPG (US)","km/L","L/100km","Category"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["15","6.4","16","Below average (trucks/SUVs)"],
                    ["25","10.6","9.4","Average (mid-size cars)"],
                    ["35","14.9","6.7","Good (efficient cars)"],
                    ["50","21.3","4.7","Hybrid efficiency"],
                    ["100+","42.5+","2.4−","EV equivalent"],
                  ].map(row => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => <td key={i} className="px-3 py-1.5 text-sm">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="How do you convert MPG to L/100km?" a="Divide 235.215 by the MPG value. So 30 MPG (US) = 235.215 ÷ 30 ≈ 7.84 L/100km. To go from L/100km to MPG, do the same: 235.215 ÷ L/100km." />
              <FaqItem q="What is a good MPG for a car?" a="For an average passenger car, 30+ MPG (US) is considered good. Hybrid vehicles typically achieve 40–60 MPG. New EVs are rated in MPGe (miles per gallon equivalent) and typically exceed 100 MPGe." />
              <FaqItem q="Why do US and UK MPG differ?" a="The US gallon (3.785 L) is smaller than the UK imperial gallon (4.546 L). So the same vehicle will have a higher numerical MPG in the UK. Always specify which gallon when comparing cross-market fuel economy ratings." />
              <FaqItem q="How is MPGe calculated for EVs?" a="MPGe compares an EV's efficiency to gasoline by using the energy equivalent: 1 gallon of gasoline ≈ 33.7 kWh. An EV consuming 33.7 kWh to travel 100 miles = 100 MPGe. The EPA uses this standard." />
              <FaqItem q="How much does 1 extra MPG save per year?" a="It depends on miles driven and gas price. At $3.50/gallon and 12,000 miles/year: going from 25 to 26 MPG saves 12,000/25 − 12,000/26 ≈ 18.5 gallons ≈ $65/year. The improvement matters more at lower MPG values." />
              <FaqItem q="Does driving style significantly affect fuel economy?" a="Yes — aggressive acceleration and braking can reduce fuel economy by 15–30% on highways. Steady speeds, moderate acceleration, and using cruise control on highways improve efficiency. Tire pressure also affects MPG by ~0.5% per PSI." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),60%,38%)] to-[hsl(var(--calc-hue),50%,28%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Converters</h2>
            <p className="mb-5 opacity-90">Speed, distance, energy — all the converters you need in one place.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/speed-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Speed Converter</Link>
              <Link href="/conversion/energy-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Energy Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/conversion/speed-converter","Speed Converter"],["/conversion/energy-converter","Energy Converter"],["/conversion/volume-converter","Volume Converter"],["/conversion/length-converter","Length Converter"],["/finance/online-salary-calculator","Salary Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),60%,38%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["US & UK MPG","Fuel cost estimator","Free, no login","No data stored"].map(t => (
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
