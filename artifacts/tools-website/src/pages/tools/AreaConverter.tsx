import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight, ArrowLeftRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check, Ruler,
  MapPin, Globe2, Home, Layers,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

type AreaUnit = "sqm" | "sqft" | "sqkm" | "sqmi" | "acre" | "hectare" | "sqcm" | "sqin" | "sqyd";

const UNITS: { value: AreaUnit; label: string; toSqm: number }[] = [
  { value: "sqm",     label: "Square Meter (m²)",       toSqm: 1 },
  { value: "sqft",    label: "Square Foot (ft²)",       toSqm: 0.092903 },
  { value: "sqkm",    label: "Square Kilometer (km²)",  toSqm: 1_000_000 },
  { value: "sqmi",    label: "Square Mile (mi²)",       toSqm: 2_589_988.11 },
  { value: "acre",    label: "Acre",                    toSqm: 4046.8564 },
  { value: "hectare", label: "Hectare (ha)",            toSqm: 10_000 },
  { value: "sqcm",    label: "Square Centimeter (cm²)", toSqm: 0.0001 },
  { value: "sqin",    label: "Square Inch (in²)",       toSqm: 0.00064516 },
  { value: "sqyd",    label: "Square Yard (yd²)",       toSqm: 0.836127 },
];

function useAreaConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState<AreaUnit>("sqm");
  const [toUnit, setToUnit] = useState<AreaUnit>("sqft");
  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    const fromSqm = UNITS.find(u => u.value === fromUnit)!.toSqm;
    const toSqmFactor = UNITS.find(u => u.value === toUnit)!.toSqm;
    const converted = (v * fromSqm) / toSqmFactor;
    return { converted, inSqm: v * fromSqm, input: v, fromUnit, toUnit };
  }, [value, fromUnit, toUnit]);

  return { value, setValue, fromUnit, setFromUnit, toUnit, setToUnit, swap, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useAreaConverter>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => n < 0.001 ? n.toExponential(4) : parseFloat(n.toFixed(6)).toString();
  const fromLabel = UNITS.find(u => u.value === result.fromUnit)!.label;
  const toLabel = UNITS.find(u => u.value === result.toUnit)!.label;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          <strong>{result.input} {fromLabel}</strong> = <strong>{fmt(result.converted)} {toLabel}</strong>.
          Base area: <strong>{fmt(result.inSqm)} m²</strong>.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 217 },
  { title: "Weight Converter", slug: "weight-converter", icon: <Layers className="w-5 h-5" />, color: 30 },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Home className="w-5 h-5" />, color: 45 },
  { title: "Temperature Converter", slug: "temperature-converter", icon: <Globe2 className="w-5 h-5" />, color: 265 },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152 },
  { title: "Mortgage Payment Calculator", slug: "online-mortgage-payment-calculator", icon: <MapPin className="w-5 h-5" />, color: 340 },
];

const QUICK_PAIRS: { from: AreaUnit; to: AreaUnit; label: string; example: string }[] = [
  { from: "sqm", to: "sqft", label: "m² → ft²", example: "1 m² = 10.764 ft²" },
  { from: "sqft", to: "sqm", label: "ft² → m²", example: "1 ft² = 0.0929 m²" },
  { from: "acre", to: "sqm", label: "acre → m²", example: "1 acre = 4,047 m²" },
  { from: "hectare", to: "acre", label: "ha → acre", example: "1 ha = 2.471 acres" },
  { from: "sqkm", to: "sqmi", label: "km² → mi²", example: "1 km² = 0.386 mi²" },
  { from: "sqft", to: "sqyd", label: "ft² → yd²", example: "9 ft² = 1 yd²" },
];

export default function AreaConverter() {
  const conv = useAreaConverter();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number) => n < 0.001 ? n.toExponential(4) : parseFloat(n.toFixed(6)).toString();

  return (
    <Layout>
      <SEO
        title="Area Converter - Square Meters to Square Feet, Acres to Hectares | Free Tool"
        description="Free online area converter. Convert square meters to square feet, acres to hectares, and more. Supports 9 area units with instant results and a reference table."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Area Converter", "url": "https://usonlinetools.com/conversion/area-converter", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "How many square feet is 1 square meter?", "acceptedAnswer": { "@type": "Answer", "text": "1 square meter equals 10.7639 square feet. To convert square meters to square feet, multiply by 10.7639." } }] }
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Area Converter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <MapPin className="w-3.5 h-3.5" />
                Conversion Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Area Converter</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Convert area between square meters, square feet, acres, hectares, square miles, and more. Supports 9 area units with instant bidirectional conversion — perfect for real estate, land measurement, and construction.
              </p>
            </section>

            {/* QUICK ANSWER */}
            <section className="p-5 rounded-xl bg-teal-500/5 border-2 border-teal-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-teal-500" />
                <h2 className="font-black text-foreground text-base">Common Area Conversion Facts</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                {["1 m² = 10.764 ft²", "1 acre = 4,047 m²", "1 hectare = 2.471 acres", "1 km² = 100 ha", "1 mi² = 640 acres", "1 yd² = 9 ft²"].map((item, i) => (
                  <div key={i} className="bg-background rounded px-2 py-1.5 border border-border text-foreground">{item}</div>
                ))}
              </div>
            </section>

            {/* QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Instant area conversion</p>
                <p className="text-muted-foreground text-sm">Enter a value, pick your units, and see the result immediately. Use the swap button to reverse direction.</p>
              </div>
            </section>

            {/* TOOL */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 175 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Area Converter</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Value</label>
                    <input type="number" placeholder="Enter area" className="tool-calc-input w-full" value={conv.value} onChange={e => conv.setValue(e.target.value)} min="0" />
                  </div>
                  <div className="flex flex-col items-center justify-end pb-1">
                    <button onClick={conv.swap} className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Swap units">
                      <ArrowLeftRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Result</label>
                    <div className="tool-calc-input w-full font-bold text-primary bg-muted/30 cursor-default">
                      {conv.result ? fmt(conv.result.converted) : "--"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">From Unit</label>
                    <select className="tool-calc-input w-full" value={conv.fromUnit} onChange={e => conv.setFromUnit(e.target.value as AreaUnit)}>
                      {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">To Unit</label>
                    <select className="tool-calc-input w-full" value={conv.toUnit} onChange={e => conv.setToUnit(e.target.value as AreaUnit)}>
                      {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Quick Pairs */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Conversions</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {QUICK_PAIRS.map(pair => (
                      <button key={pair.label} onClick={() => { conv.setFromUnit(pair.from); conv.setToUnit(pair.to); }} className="text-left p-2.5 rounded-lg bg-muted/50 hover:bg-muted border border-border transition-colors">
                        <div className="text-xs font-bold text-foreground">{pair.label}</div>
                        <div className="text-xs text-muted-foreground">{pair.example}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <ResultInsight result={conv.result} />
              </div>
            </section>

            {/* CONVERSION TABLE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Area Conversion Reference Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold text-foreground">m²</th>
                      <th className="text-left p-3 font-bold text-foreground">ft²</th>
                      <th className="text-left p-3 font-bold text-foreground">Acres</th>
                      <th className="text-left p-3 font-bold text-foreground">Hectares</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 10, 100, 1000, 4047, 10000, 100000].map((sqm, i) => (
                      <tr key={sqm} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400">{sqm.toLocaleString()}</td>
                        <td className="p-3 font-mono text-foreground">{(sqm / 0.092903).toFixed(1)}</td>
                        <td className="p-3 font-mono text-foreground">{(sqm / 4046.8564).toFixed(4)}</td>
                        <td className="p-3 font-mono text-foreground">{(sqm / 10000).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "teal", title: "Enter Your Measurement", desc: "Type the area value you want to convert. Supports decimals and large numbers." },
                  { color: "blue", title: "Select Your Units", desc: "Choose source unit (From) and target unit (To) from 9 supported area units. Click the swap button to instantly reverse the conversion." },
                  { color: "emerald", title: "Read the Result", desc: "The converted value appears instantly. All conversions use square meters as the base unit for maximum accuracy across all unit pairs." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div><h4 className="font-bold text-foreground mb-1">{step.title}</h4><p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>

            {/* REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/15">
                  <div className="flex items-center gap-2 mb-2"><Home className="w-4 h-4 text-teal-500" /><h4 className="font-bold text-foreground text-sm">Real Estate</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 2,000 sq ft home = <strong className="text-foreground">185.8 m²</strong>. International real estate listings use square meters, while US listings use square feet.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Farm & Land</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 100-acre farm = <strong className="text-foreground">40.47 hectares</strong> = <strong className="text-foreground">0.156 square miles</strong>. US uses acres; most of the world uses hectares.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><Layers className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Flooring Project</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A room is 15 × 12 ft = 180 ft² = <strong className="text-foreground">16.72 m²</strong>. Convert before ordering metric tiles from European suppliers.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><Globe2 className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Country Comparison</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Texas (268,596 mi²) = <strong className="text-foreground">695,662 km²</strong> — larger than France (551,695 km²). Geography uses both square miles and square kilometers.</p>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Area Converter?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <MapPin className="w-4 h-4" />, text: "9 area units including acres & hectares" },
                  { icon: <ArrowLeftRight className="w-4 h-4" />, text: "One-click swap for reverse conversion" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data stored — runs entirely in browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-friendly for on-site measurements" },
                  { icon: <Clock className="w-4 h-4" />, text: "Instant results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Reference table for common land areas" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Area Units Around the World</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Area measurement differs significantly between countries. The United States predominantly uses <strong className="text-foreground">square feet and acres</strong>, while most of the world uses the <strong className="text-foreground">metric system</strong> (square meters, hectares, square kilometers). Real estate professionals, farmers, engineers, and travelers frequently need to convert between these systems.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">When Do You Need to Convert Area Units?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Buying or selling property internationally (m² vs ft²)",
                    "Agricultural land measurement (acres vs hectares)",
                    "Interior design and flooring calculations across unit systems",
                    "Geography, mapping, and GIS applications",
                    "Construction and architectural plans from different countries",
                    "Environmental reports and land surveys",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How many square feet in a square meter?" a="1 square meter = 10.7639 square feet. To convert m² to ft², multiply by 10.7639. To go from ft² to m², multiply by 0.0929 (or divide by 10.7639)." />
                <FaqItem q="How many acres in a hectare?" a="1 hectare = 2.47105 acres. Conversely, 1 acre = 0.404686 hectares. Hectares are used in the metric system (most of the world), while acres are common in the US and UK for land measurement." />
                <FaqItem q="How big is an acre in square feet?" a="1 acre = 43,560 square feet = 4,047 square meters = 0.4047 hectares. Visualized, 1 acre is roughly equivalent to a standard American football field (including end zones)." />
                <FaqItem q="What is the difference between square meters and square feet?" a="Square meters are metric (1m × 1m). Square feet are imperial (1ft × 1ft). Since 1 meter = 3.28084 feet, 1 square meter = 3.28084² = 10.764 square feet. US real estate uses ft²; European real estate uses m²." />
                <FaqItem q="How many square meters in a hectare?" a="1 hectare = 10,000 square meters (100m × 100m). The hectare is widely used in agriculture and forestry. 1 square kilometer = 100 hectares." />
                <FaqItem q="Why do the US and UK use different area units?" a="The US and UK use the imperial system inherited from British colonial measurement standards. Most countries have since switched to the metric system. The UK now uses both — hectares for land registration, acres in casual use." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Conversion Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore length, weight, temperature, volume converters and 400+ more free tools.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others convert area measurements easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
