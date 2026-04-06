import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, Clock } from "lucide-react";
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

interface TimeUnit { id: string; label: string; short: string; toSeconds: number; }

const UNITS: TimeUnit[] = [
  { id: "ns",    label: "Nanosecond",  short: "ns",   toSeconds: 1e-9 },
  { id: "us",    label: "Microsecond", short: "μs",   toSeconds: 1e-6 },
  { id: "ms",    label: "Millisecond", short: "ms",   toSeconds: 1e-3 },
  { id: "sec",   label: "Second",      short: "s",    toSeconds: 1 },
  { id: "min",   label: "Minute",      short: "min",  toSeconds: 60 },
  { id: "hr",    label: "Hour",        short: "hr",   toSeconds: 3600 },
  { id: "day",   label: "Day",         short: "day",  toSeconds: 86400 },
  { id: "week",  label: "Week",        short: "wk",   toSeconds: 604800 },
  { id: "month", label: "Month (avg)", short: "mo",   toSeconds: 2629746 },  // 365.2425 days / 12
  { id: "year",  label: "Year",        short: "yr",   toSeconds: 31556952 }, // 365.2425 days
  { id: "decade",label: "Decade",      short: "dec",  toSeconds: 315569520 },
  { id: "century",label:"Century",     short: "cent", toSeconds: 3155695200 },
];

function fmtNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) < 1e-6 || Math.abs(n) > 1e12) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toLocaleString("en-US");
}

export default function TimeConverter() {
  const [fromUnit, setFromUnit] = useState("hr");
  const [value, setValue] = useState("1");

  const results = useMemo(() => {
    const v = parseFloat(value) || 0;
    if (v <= 0) return null;
    const fromDef = UNITS.find((u) => u.id === fromUnit);
    if (!fromDef) return null;
    const seconds = v * fromDef.toSeconds;
    return UNITS.map((u) => ({ ...u, converted: seconds / u.toSeconds }));
  }, [value, fromUnit]);

  return (
    <div style={{ "--calc-hue": "175" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Time Converter — Convert Seconds, Minutes, Hours, Days & More"
        description="Convert between nanoseconds, seconds, minutes, hours, days, weeks, months, years, and centuries. Free online time unit converter — instant results."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Time Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,42%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Time Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","12 Units","Nanoseconds to Centuries","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Convert between all time units from nanoseconds to centuries. Instantly see hours in seconds, days in minutes, or years in hours — with real-world context for every scale.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Clock className="w-5 h-5 text-[hsl(var(--calc-hue),70%,42%)]" />Time Converter</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Value</label>
                <input className="tool-calc-input" type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" />
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
                      <div key={r.id} className={`tool-calc-result ${r.id === fromUnit ? "ring-2 ring-[hsl(var(--calc-hue),70%,42%)] ring-offset-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
                        <p className="tool-calc-number text-base font-bold font-mono">{fmtNum(r.converted)}</p>
                        <p className="text-xs text-muted-foreground">{r.short}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground"><Clock className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>Enter a value to see all time conversions.</p></div>
            )}
          </div>

          {/* Reference */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Time in Perspective</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-muted/50">{["Duration","Seconds","Minutes","Hours","Context"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["1 minute","60","1","0.0167","Boiling an egg"],
                    ["1 hour","3,600","60","1","A typical meeting"],
                    ["1 day","86,400","1,440","24","Earth's rotation"],
                    ["1 week","604,800","10,080","168","7 days"],
                    ["1 month","~2,629,746","~43,829","~730","~30.44 days avg"],
                    ["1 year","31,556,952","525,949","8,766","365.2425 days"],
                    ["1 decade","315,569,520","~5.26M","~87,660","10 years"],
                    ["1 century","3,155,695,200","~52.6M","~876,600","100 years"],
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
                { title: "1 Second", desc: "The SI base unit of time, originally defined as 1/86,400 of a day. Now defined by atomic cesium oscillation — 9,192,631,770 cycles.", color: "border-l-blue-500" },
                { title: "Millisecond", desc: "1/1,000 of a second. Human reaction time is ~200–300 ms. Audio latency under 10 ms is considered imperceptible.", color: "border-l-green-500" },
                { title: "Year vs Month", desc: "This converter uses a mean month of 30.4375 days (365.2425 ÷ 12) and a year of 365.2425 days — accounting for leap years.", color: "border-l-amber-500" },
                { title: "Nanosecond", desc: "1 billionth of a second. Light travels ~30 cm in 1 ns. CPU clock speeds are measured in GHz (billions of cycles per second).", color: "border-l-purple-500" },
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
              <FaqItem q="How many seconds are in a year?" a="A Julian year is exactly 365.25 days = 31,557,600 seconds. The Gregorian year is 365.2425 days = 31,556,952 seconds. This converter uses the Gregorian calendar value." />
              <FaqItem q="Why isn't 1 month exactly 30 days?" a="Calendar months vary from 28–31 days. For conversions, a mean month of 30.4375 days is used (365.2425 ÷ 12), which correctly averages over the Gregorian calendar cycle." />
              <FaqItem q="What is a millisecond used for?" a="Milliseconds matter in computing (network latency, audio/video sync), gaming (frame timing, input response), finance (high-frequency trading), and medicine (EEG, ECG signals). Human perception threshold is roughly 1–10 ms." />
              <FaqItem q="How many hours are in a year?" a="About 8,766 hours per year (365.2425 days × 24). Working hours in a year at 40 hr/week × 52 weeks = 2,080 hours. A common phrase: 'we have 8,760 hours per year to work with.'" />
              <FaqItem q="What is a nanosecond?" a="One billionth of a second (10⁻⁹ s). In computing, 1 GHz = 1 billion cycles per second, meaning each cycle takes 1 ns. Light travels about 30 cm (12 inches) in 1 nanosecond in a vacuum." />
              <FaqItem q="How do you convert hours to seconds?" a="Multiply hours by 3,600 (60 minutes × 60 seconds). Example: 8 hours = 8 × 3,600 = 28,800 seconds. Conversely, divide seconds by 3,600 to get hours." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,42%)] to-[hsl(var(--calc-hue),60%,32%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Conversion Tools</h2>
            <p className="mb-5 opacity-90">Convert any unit — energy, pressure, length, weight, and more.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/conversion/energy-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Energy Converter</Link>
              <Link href="/conversion/angle-converter" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Angle Converter</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/time-date/date-difference-calculator","Date Difference"],["/conversion/energy-converter","Energy Converter"],["/conversion/pressure-converter","Pressure Converter"],["/time-date/age-calculator","Age Calculator"],["/conversion/angle-converter","Angle Converter"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,42%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["12 time units","Nanosecond to century","Free, no login","No data stored"].map(t => (
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
