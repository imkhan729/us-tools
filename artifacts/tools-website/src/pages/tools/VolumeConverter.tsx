import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeftRight, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Conversion factors to liters ──────────────────────────────────────────────
const UNITS: { key: string; label: string; factor: number }[] = [
  { key: "l",    label: "Liter (L)",           factor: 1 },
  { key: "ml",   label: "Milliliter (mL)",      factor: 0.001 },
  { key: "m3",   label: "Cubic Meter (m³)",     factor: 1000 },
  { key: "cm3",  label: "Cubic Centimeter (cm³)",factor: 0.001 },
  { key: "gal",  label: "US Gallon (gal)",      factor: 3.785411784 },
  { key: "qt",   label: "US Quart (qt)",        factor: 0.946352946 },
  { key: "pt",   label: "US Pint (pt)",         factor: 0.473176473 },
  { key: "cup",  label: "US Cup (cup)",         factor: 0.2365882365 },
  { key: "floz", label: "Fluid Ounce (fl oz)",  factor: 0.0295735296 },
  { key: "tbsp", label: "Tablespoon (tbsp)",    factor: 0.01478676478 },
  { key: "tsp",  label: "Teaspoon (tsp)",       factor: 0.00492892159 },
  { key: "ft3",  label: "Cubic Foot (ft³)",     factor: 28.3168466 },
  { key: "in3",  label: "Cubic Inch (in³)",     factor: 0.016387064 },
];

const QUICK_PAIRS = [
  { from: "gal", to: "l",    label: "1 US Gallon → Liters" },
  { from: "l",   to: "gal",  label: "1 Liter → US Gallons" },
  { from: "m3",  to: "gal",  label: "1 m³ → US Gallons" },
  { from: "cup", to: "ml",   label: "1 Cup → Milliliters" },
  { from: "ft3", to: "l",    label: "1 ft³ → Liters" },
  { from: "floz",to: "ml",   label: "1 fl oz → Milliliters" },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(6);
  const s = n.toPrecision(10);
  return parseFloat(s).toString();
}

function useVolume(value: string, fromKey: string) {
  return useMemo(() => {
    const n = parseFloat(value);
    if (!isFinite(n)) return null;
    const fromFactor = UNITS.find(u => u.key === fromKey)!.factor;
    const liters = n * fromFactor;
    return Object.fromEntries(UNITS.map(u => [u.key, fmt(liters / u.factor)]));
  }, [value, fromKey]);
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
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
  { q: "How many liters in a US gallon?", a: "1 US gallon equals exactly 3.78541 liters. This is the standard US liquid gallon used for fuel, beverages, and other liquids." },
  { q: "What is the difference between a fluid ounce and an ounce?", a: "A fluid ounce (fl oz) measures volume, while an ounce (oz) measures weight or mass. 1 US fluid ounce ≈ 29.57 mL." },
  { q: "How many cups in a liter?", a: "There are approximately 4.227 US cups in 1 liter (since 1 cup = 236.59 mL)." },
  { q: "How do I convert liters to gallons?", a: "Divide the number of liters by 3.78541 to get US gallons. For example, 10 liters ÷ 3.78541 = 2.642 gallons." },
  { q: "What is 1 cubic meter in liters?", a: "1 cubic meter (m³) equals exactly 1,000 liters. This is because 1 m³ = 1,000,000 cm³ and 1 liter = 1,000 cm³." },
  { q: "How many tablespoons in a cup?", a: "There are 16 tablespoons in 1 US cup. 1 tablespoon = 3 teaspoons = 14.787 mL." },
];

const RELATED_TOOLS = [
  { label: "Weight Converter",      href: "/conversion/weight-converter" },
  { label: "Length Converter",      href: "/conversion/length-converter" },
  { label: "Area Converter",        href: "/conversion/area-converter" },
  { label: "Temperature Converter", href: "/conversion/temperature-converter" },
  { label: "Speed Converter",       href: "/conversion/speed-converter" },
];

const REFERENCE_TABLE = [
  ["1 US Gallon",    "3.785 L",  "4 qt",      "128 fl oz"],
  ["1 Liter",        "1000 mL",  "0.264 gal", "33.81 fl oz"],
  ["1 Cubic Meter",  "1000 L",   "264.2 gal", "35.31 ft³"],
  ["1 Cubic Foot",   "28.317 L", "7.481 gal", "1728 in³"],
  ["1 Cup",          "236.6 mL", "8 fl oz",   "16 tbsp"],
  ["1 Fluid Ounce",  "29.57 mL", "2 tbsp",    "6 tsp"],
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Volume Converter",
      "description": "Free online volume converter. Convert between liters, gallons, milliliters, cubic meters, cups, fluid ounces, and 13 more units instantly.",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  ],
};

export default function VolumeConverter() {
  const [value, setValue] = useState("1");
  const [fromKey, setFromKey] = useState("gal");
  const results = useVolume(value, fromKey);

  const swap = (toKey: string) => {
    if (!results) return;
    setValue(results[toKey]);
    setFromKey(toKey);
  };

  return (
    <>
      <Helmet>
        <title>Volume Converter – L, mL, Gallons, Cups, fl oz | US Online Tools</title>
        <meta name="description" content="Free online volume converter. Instantly convert between liters, milliliters, US gallons, quarts, pints, cups, fluid ounces, tablespoons, cubic meters, and more." />
        <meta name="keywords" content="volume converter, liters to gallons, gallons to liters, ml to cups, fluid ounce converter, cubic meter converter, unit converter" />
        <link rel="canonical" href="https://us-online.tools/conversion/volume-converter" />
        <meta property="og:title" content="Volume Converter – Free Online Unit Converter" />
        <meta property="og:description" content="Convert volume units instantly: liters, gallons, cups, fluid ounces, cubic meters and more." />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "200"} as React.CSSProperties}>

        {/* Hero */}
        <section className="bg-gradient-to-br from-[hsl(var(--calc-hue),70%,18%)] to-[hsl(var(--calc-hue),60%,28%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Volume Converter</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Convert between liters, gallons, cups, fluid ounces, cubic meters, and 8 more units — instantly.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* Quick Answer */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
            <h2 className="font-bold text-blue-800 dark:text-blue-300 mb-2">⚡ Quick Reference</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm text-blue-900 dark:text-blue-200">
              <li>• 1 US Gallon = <strong>3.785 L</strong></li>
              <li>• 1 Liter = <strong>0.264 gal</strong></li>
              <li>• 1 m³ = <strong>1,000 L</strong></li>
              <li>• 1 Cup = <strong>236.6 mL</strong></li>
              <li>• 1 fl oz = <strong>29.57 mL</strong></li>
              <li>• 1 ft³ = <strong>28.32 L</strong></li>
            </ul>
          </div>

          {/* Calculator Card */}
          <div className="tool-calc-card rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Value</label>
                <input
                  type="number"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="tool-calc-input w-full text-xl"
                  placeholder="Enter value…"
                />
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
              <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter a value above to see conversions.</p>
            )}
          </div>

          {/* Quick Conversion Pairs */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Common Volume Conversions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUICK_PAIRS.map(p => {
                const fromFactor = UNITS.find(u => u.key === p.from)!.factor;
                const toFactor   = UNITS.find(u => u.key === p.to)!.factor;
                const result = fmt(fromFactor / toFactor);
                return (
                  <button key={p.label} onClick={() => { setValue("1"); setFromKey(p.from); }}
                    className="tool-calc-result rounded-xl p-4 text-left hover:opacity-80 transition-opacity">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{p.label}</p>
                    <p className="tool-calc-number font-bold text-lg">= {result}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Reference Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Volume Conversion Reference Table</h2>
            <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="w-full text-sm">
                <thead className="bg-[hsl(var(--muted))]">
                  <tr>{["Unit", "Liters", "Other", "Also"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {REFERENCE_TABLE.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[hsl(var(--background))]" : "bg-[hsl(var(--muted))/30]"}>
                      {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How it works */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">How to Convert Volume Units</h2>
            <p>Volume conversion is straightforward once you know the base factor. This converter uses <strong>liters as the common base unit</strong>. Every value is first converted to liters, then to the target unit using the formula:</p>
            <div className="tool-calc-result rounded-xl p-4 my-4 font-mono text-sm">
              Result = Input × (from_factor / to_factor)
            </div>
            <p>For example, to convert 5 US gallons to liters: 5 × 3.78541 = <strong>18.93 liters</strong>.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">US vs Imperial Volume Units</h3>
            <p>Be aware that the <strong>US gallon (3.785 L)</strong> differs from the <strong>Imperial gallon (4.546 L)</strong> used in the UK. This converter uses US customary units. When following UK recipes or fuel measurements, use the Imperial gallon value instead.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Cooking Conversions</h3>
            <p>For cooking, the most useful conversions are: <strong>1 cup = 16 tablespoons = 48 teaspoons = 8 fluid ounces = 236.6 mL</strong>. Doubling or halving a recipe is easy once you know these base equivalences.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Scientific Volume Units</h3>
            <p>In scientific contexts, cubic meters (m³) and cubic centimeters (cm³) are standard SI units. Note that <strong>1 cm³ = 1 mL</strong> exactly — making milliliters and cubic centimeters interchangeable for liquids.</p>
          </section>

          {/* Pro Tips */}
          <section className="bg-[hsl(var(--muted))] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">💡 Pro Tips for Volume Conversion</h2>
            <ul className="space-y-2 text-sm">
              <li>🔵 <strong>Gallons to liters shortcut:</strong> Multiply by 3.785 (or roughly 3.8 for mental math).</li>
              <li>🔵 <strong>Cups to mL shortcut:</strong> Multiply by 240 (close enough for most recipes).</li>
              <li>🔵 <strong>1 mL = 1 cm³</strong> — useful for chemistry and medicine dosing.</li>
              <li>🔵 <strong>UK vs US gallons:</strong> Always check which gallon is meant — they differ by ~20%.</li>
              <li>🔵 <strong>Fuel economy:</strong> Convert mpg to L/100km using: 235.2 ÷ mpg = L/100km.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-xl font-bold mb-4">Related Conversion Tools</h2>
            <div className="flex flex-wrap gap-3">
              {RELATED_TOOLS.map(t => (
                <a key={t.href} href={t.href} className="px-4 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium">{t.label}</a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
