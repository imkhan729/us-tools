import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeftRight, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Conversion factors to m/s ─────────────────────────────────────────────────
const UNITS: { key: string; label: string; factor: number }[] = [
  { key: "ms",   label: "Meters/Second (m/s)",     factor: 1 },
  { key: "kmh",  label: "Kilometers/Hour (km/h)",  factor: 1 / 3.6 },
  { key: "mph",  label: "Miles/Hour (mph)",         factor: 0.44704 },
  { key: "fps",  label: "Feet/Second (ft/s)",       factor: 0.3048 },
  { key: "kn",   label: "Knots (kn)",               factor: 0.514444 },
  { key: "mach", label: "Mach (at sea level)",      factor: 340.29 },
  { key: "cms",  label: "Centimeters/Second (cm/s)",factor: 0.01 },
  { key: "mipm", label: "Miles/Minute (mi/min)",    factor: 26.8224 },
];

const QUICK_PAIRS = [
  { from: "mph",  to: "kmh",  label: "mph → km/h" },
  { from: "kmh",  to: "mph",  label: "km/h → mph" },
  { from: "kn",   to: "kmh",  label: "Knots → km/h" },
  { from: "ms",   to: "kmh",  label: "m/s → km/h" },
  { from: "mph",  to: "ms",   label: "mph → m/s" },
  { from: "mach", to: "kmh",  label: "Mach → km/h" },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-5 && n !== 0)) return n.toExponential(5);
  return parseFloat(n.toPrecision(8)).toString();
}

function useSpeed(value: string, fromKey: string) {
  return useMemo(() => {
    const n = parseFloat(value);
    if (!isFinite(n)) return null;
    const fromFactor = UNITS.find(u => u.key === fromKey)!.factor;
    const ms = n * fromFactor;
    return Object.fromEntries(UNITS.map(u => [u.key, fmt(ms / u.factor)]));
  }, [value, fromKey]);
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="p-1 rounded hover:bg-white/20 transition-colors" title="Copy">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="opacity-60" />}
    </button>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-4 text-[hsl(var(--muted-foreground))] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  { q: "How do I convert mph to km/h?", a: "Multiply mph by 1.60934 to get km/h. For example, 60 mph × 1.60934 = 96.56 km/h. A quick mental math shortcut is to multiply by 1.6." },
  { q: "How fast is Mach 1 in km/h?", a: "Mach 1 (the speed of sound at sea level, 15°C) is approximately 1,225 km/h or 761 mph. The speed of sound varies with altitude and temperature." },
  { q: "What is a knot in mph?", a: "1 knot equals 1.15078 mph or 1.852 km/h. Knots are used in aviation and maritime navigation. A ship traveling at 20 knots is doing about 23 mph." },
  { q: "How many m/s is 100 km/h?", a: "100 km/h ÷ 3.6 = 27.78 m/s. To convert km/h to m/s, always divide by 3.6. To go the other way, multiply m/s by 3.6." },
  { q: "What is the speed of light in km/h?", a: "The speed of light is approximately 1,079,252,848 km/h (about 1.08 billion km/h) or 299,792 km/s. It is 874,030 times faster than Mach 1." },
  { q: "How fast is 200 km/h in mph?", a: "200 km/h ÷ 1.60934 = 124.27 mph. Alternatively, multiply km/h by 0.62137 to get mph. 200 km/h is a common speed limit on German Autobahns." },
];

const BENCHMARKS = [
  ["Human walking",     "5 km/h",     "3.1 mph",   "1.4 m/s"],
  ["Cycling",           "25 km/h",    "15.5 mph",  "6.9 m/s"],
  ["Highway driving",   "120 km/h",   "74.6 mph",  "33.3 m/s"],
  ["Commercial aircraft","900 km/h",  "559 mph",   "250 m/s"],
  ["Speed of sound",    "1,235 km/h", "767 mph",   "343 m/s"],
  ["Speed of light",    "1.08 B km/h","671 M mph", "299,792 km/s"],
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Speed Converter", "description": "Convert speed units: mph, km/h, m/s, knots, Mach, ft/s.", "applicationCategory": "UtilityApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    { "@type": "FAQPage", "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
  ],
};

export default function SpeedConverter() {
  const [value, setValue] = useState("60");
  const [fromKey, setFromKey] = useState("mph");
  const results = useSpeed(value, fromKey);

  const swap = (toKey: string) => { if (!results) return; setValue(results[toKey]); setFromKey(toKey); };

  return (
    <>
      <Helmet>
        <title>Speed Converter – mph, km/h, m/s, Knots, Mach | US Online Tools</title>
        <meta name="description" content="Free online speed converter. Instantly convert between mph, km/h, m/s, knots, Mach, ft/s and more speed units." />
        <meta name="keywords" content="speed converter, mph to kmh, kmh to mph, knots to mph, mach converter, m/s to km/h, speed unit conversion" />
        <link rel="canonical" href="https://us-online.tools/conversion/speed-converter" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "240"} as React.CSSProperties}>

        <section className="bg-gradient-to-br from-[hsl(var(--calc-hue),70%,18%)] to-[hsl(var(--calc-hue),60%,28%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Speed Converter</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Convert between mph, km/h, m/s, knots, Mach, and more — instantly and accurately.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* Quick Answer */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
            <h2 className="font-bold text-blue-800 dark:text-blue-300 mb-2">⚡ Quick Conversions</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm text-blue-900 dark:text-blue-200">
              <li>• 60 mph = <strong>96.56 km/h</strong></li>
              <li>• 100 km/h = <strong>62.14 mph</strong></li>
              <li>• 1 knot = <strong>1.852 km/h</strong></li>
              <li>• Mach 1 = <strong>1,235 km/h</strong></li>
              <li>• 1 m/s = <strong>3.6 km/h</strong></li>
              <li>• 1 ft/s = <strong>1.097 km/h</strong></li>
            </ul>
          </div>

          {/* Calculator */}
          <div className="tool-calc-card rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Speed Value</label>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} className="tool-calc-input w-full text-xl" placeholder="Enter speed…" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Convert From</label>
                <select value={fromKey} onChange={e => setFromKey(e.target.value)} className="tool-calc-input w-full text-xl">
                  {UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
                </select>
              </div>
            </div>

            {results ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {UNITS.filter(u => u.key !== fromKey).map(u => (
                  <div key={u.key} className="tool-calc-result rounded-xl p-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-0.5">{u.label}</p>
                      <p className="tool-calc-number font-bold text-lg">{results[u.key]}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CopyBtn text={results[u.key]} />
                      <button onClick={() => swap(u.key)} title="Use as input" className="p-1 rounded hover:bg-white/20 transition-colors">
                        <ArrowLeftRight size={14} className="opacity-60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter a speed value to see all conversions.</p>
            )}
          </div>

          {/* Quick Pairs */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Common Speed Conversions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUICK_PAIRS.map(p => {
                const ff = UNITS.find(u => u.key === p.from)!.factor;
                const tf = UNITS.find(u => u.key === p.to)!.factor;
                return (
                  <button key={p.label} onClick={() => { setValue("1"); setFromKey(p.from); }}
                    className="tool-calc-result rounded-xl p-4 text-left hover:opacity-80 transition-opacity">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{p.label}</p>
                    <p className="tool-calc-number font-bold text-lg">= {fmt(ff / tf)}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Real-World Benchmarks */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Real-World Speed Benchmarks</h2>
            <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="w-full text-sm">
                <thead className="bg-[hsl(var(--muted))]">
                  <tr>{["Object / Vehicle", "km/h", "mph", "m/s"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {BENCHMARKS.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[hsl(var(--background))]" : "bg-[hsl(var(--muted))/30]"}>
                      {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Convert */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">How to Convert Speed Units</h2>
            <p>All speed units can be converted through <strong>meters per second (m/s)</strong> as the SI base unit:</p>
            <div className="tool-calc-result rounded-xl p-4 my-4 font-mono text-sm">
              Result = Input × (from_factor_in_m/s) ÷ (to_factor_in_m/s)
            </div>
            <h3 className="text-xl font-bold mt-6 mb-3">mph to km/h Formula</h3>
            <p>The exact conversion factor is: <strong>1 mph = 1.609344 km/h</strong>. For quick mental math, multiply mph by 1.6 (result is within 0.6% accuracy).</p>
            <h3 className="text-xl font-bold mt-6 mb-3">Knots Explained</h3>
            <p>A knot is 1 nautical mile per hour. Since 1 nautical mile = 1,852 meters, <strong>1 knot = 1.852 km/h = 1.15078 mph</strong>. Knots are the standard unit in aviation and maritime navigation worldwide.</p>
            <h3 className="text-xl font-bold mt-6 mb-3">Mach Number</h3>
            <p>Mach 1 is the speed of sound, which varies with air density and temperature. At sea level (15°C), Mach 1 ≈ 340.3 m/s = 1,225 km/h = 761 mph. At 35,000 ft cruise altitude, it drops to ~295 m/s due to colder, thinner air.</p>
          </section>

          {/* Pro Tips */}
          <section className="bg-[hsl(var(--muted))] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">💡 Speed Conversion Tips</h2>
            <ul className="space-y-2 text-sm">
              <li>🔵 <strong>mph → km/h mental math:</strong> Multiply by 1.6 (exact: ×1.60934).</li>
              <li>🔵 <strong>km/h → mph mental math:</strong> Multiply by 0.6 (exact: ×0.62137).</li>
              <li>🔵 <strong>m/s → km/h:</strong> Simply multiply by 3.6.</li>
              <li>🔵 <strong>km/h → m/s:</strong> Simply divide by 3.6.</li>
              <li>🔵 <strong>Speed cameras in Europe</strong> use km/h — know your conversion when driving abroad.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold mb-4">Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Length Converter", href: "/conversion/length-converter" },
                { label: "Weight Converter", href: "/conversion/weight-converter" },
                { label: "Volume Converter", href: "/conversion/volume-converter" },
                { label: "Temperature Converter", href: "/conversion/temperature-converter" },
                { label: "Area Converter", href: "/conversion/area-converter" },
              ].map(t => (
                <a key={t.href} href={t.href} className="px-4 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium">{t.label}</a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
