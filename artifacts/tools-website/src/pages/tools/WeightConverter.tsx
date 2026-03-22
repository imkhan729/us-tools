import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight, ArrowLeftRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check, Ruler,
  Scale, Globe2, Dumbbell, ShoppingCart,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Weight Units ──
type WeightUnit = "kg" | "g" | "mg" | "lb" | "oz" | "st" | "t" | "ton";
const UNITS: { value: WeightUnit; label: string; toKg: number }[] = [
  { value: "kg",  label: "Kilogram (kg)",      toKg: 1 },
  { value: "g",   label: "Gram (g)",            toKg: 0.001 },
  { value: "mg",  label: "Milligram (mg)",      toKg: 0.000001 },
  { value: "lb",  label: "Pound (lb)",          toKg: 0.453592 },
  { value: "oz",  label: "Ounce (oz)",          toKg: 0.0283495 },
  { value: "st",  label: "Stone (st)",          toKg: 6.35029 },
  { value: "t",   label: "Metric Ton (t)",      toKg: 1000 },
  { value: "ton", label: "US Short Ton (ton)",  toKg: 907.185 },
];

function useWeightConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState<WeightUnit>("kg");
  const [toUnit, setToUnit] = useState<WeightUnit>("lb");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    const fromKg = UNITS.find(u => u.value === fromUnit)!.toKg;
    const toKgFactor = UNITS.find(u => u.value === toUnit)!.toKg;
    const converted = (v * fromKg) / toKgFactor;
    // All conversions
    const inKg = v * fromKg;
    return { converted, inKg, input: v, fromUnit, toUnit };
  }, [value, fromUnit, toUnit]);

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  return { value, setValue, fromUnit, setFromUnit, toUnit, setToUnit, result, swap };
}

// ── Insight ──
function ResultInsight({ result }: { result: ReturnType<typeof useWeightConverter>["result"] }) {
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
          The base weight is <strong>{fmt(result.inKg)} kg</strong> ({fmt(result.inKg * 1000)} g).
        </p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
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

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Length Converter", slug: "length-converter", icon: <Ruler className="w-5 h-5" />, color: 217 },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 152 },
  { title: "Body Fat Calculator", slug: "body-fat-calculator", icon: <Dumbbell className="w-5 h-5" />, color: 340 },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 25 },
  { title: "Temperature Converter", slug: "temperature-converter", icon: <Globe2 className="w-5 h-5" />, color: 45 },
  { title: "Area Converter", slug: "area-converter", icon: <Calculator className="w-5 h-5" />, color: 265 },
];

// ── Quick Pairs ──
const QUICK_PAIRS: { from: WeightUnit; to: WeightUnit; label: string; example: string }[] = [
  { from: "kg", to: "lb", label: "kg → lb", example: "1 kg = 2.205 lb" },
  { from: "lb", to: "kg", label: "lb → kg", example: "1 lb = 0.454 kg" },
  { from: "g", to: "oz", label: "g → oz", example: "100 g = 3.527 oz" },
  { from: "oz", to: "g", label: "oz → g", example: "1 oz = 28.35 g" },
  { from: "st", to: "kg", label: "st → kg", example: "1 st = 6.350 kg" },
  { from: "t", to: "ton", label: "Metric → US ton", example: "1 t = 1.102 ton" },
];

// ── Main Component ──
export default function WeightConverter() {
  const conv = useWeightConverter();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const fmt = (n: number) => n < 0.001 ? n.toExponential(4) : parseFloat(n.toFixed(6)).toString();
  const converted = conv.result ? fmt(conv.result.converted) : "--";

  return (
    <Layout>
      <SEO
        title="Weight Converter - kg to lbs, Grams to Ounces | Free Online Weight Unit Converter"
        description="Free online weight converter. Convert kg to lbs, grams to ounces, stones to kg, and more. Supports 8 units. Instant results — no signup required."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Weight Converter", "url": "https://usonlinetools.com/conversion/weight-converter", "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [
            { "@type": "Question", "name": "How many pounds is 1 kg?", "acceptedAnswer": { "@type": "Answer", "text": "1 kilogram equals 2.20462 pounds. To convert kg to lbs, multiply the kilogram value by 2.20462." } },
            { "@type": "Question", "name": "How many grams are in a pound?", "acceptedAnswer": { "@type": "Answer", "text": "There are 453.592 grams in 1 pound." } },
          ]}
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Weight Converter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* 1. PAGE HEADER */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Scale className="w-3.5 h-3.5" />
                Conversion Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Weight Converter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Convert weight between kilograms, pounds, ounces, grams, stones, metric tons, and more. Supports 8 units with instant bidirectional conversion — free, accurate, and no signup needed.
              </p>
            </section>

            {/* QUICK ANSWER BOX */}
            <section className="p-5 rounded-xl bg-orange-500/5 border-2 border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-orange-500" />
                <h2 className="font-black text-foreground text-base">Quick Reference: Common Weight Conversions</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {[
                  "1 kg = 2.2046 lb", "1 lb = 0.4536 kg", "1 oz = 28.35 g",
                  "1 g = 0.0353 oz", "1 st = 6.350 kg", "1 ton = 907.18 kg",
                ].map((item, i) => (
                  <div key={i} className="font-mono text-xs bg-background rounded px-2 py-1 text-foreground border border-border">{item}</div>
                ))}
              </div>
            </section>

            {/* 2. QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Instant weight conversion</p>
                <p className="text-muted-foreground text-sm">Enter a value, select your units, and see the result immediately. Swap direction with one click.</p>
              </div>
            </section>

            {/* 3. TOOL SECTION */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Weight Converter</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Value</label>
                    <input
                      type="number"
                      placeholder="Enter weight"
                      className="tool-calc-input w-full"
                      value={conv.value}
                      onChange={e => conv.setValue(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-end pb-1">
                    <button
                      onClick={conv.swap}
                      className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Swap units"
                    >
                      <ArrowLeftRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Result</label>
                    <div className="tool-calc-input w-full font-bold text-primary bg-muted/30 cursor-default">
                      {converted}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">From Unit</label>
                    <select className="tool-calc-input w-full" value={conv.fromUnit} onChange={e => conv.setFromUnit(e.target.value as WeightUnit)}>
                      {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">To Unit</label>
                    <select className="tool-calc-input w-full" value={conv.toUnit} onChange={e => conv.setToUnit(e.target.value as WeightUnit)}>
                      {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Quick Pairs */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Conversions</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {QUICK_PAIRS.map(pair => (
                      <button
                        key={pair.label}
                        onClick={() => { conv.setFromUnit(pair.from); conv.setToUnit(pair.to); }}
                        className="text-left p-2.5 rounded-lg bg-muted/50 hover:bg-muted border border-border transition-colors"
                      >
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Weight Conversion Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold text-foreground">kg</th>
                      <th className="text-left p-3 font-bold text-foreground">lb</th>
                      <th className="text-left p-3 font-bold text-foreground">oz</th>
                      <th className="text-left p-3 font-bold text-foreground">g</th>
                      <th className="text-left p-3 font-bold text-foreground">stone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 5, 10, 25, 50, 100].map((kg, i) => (
                      <tr key={kg} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 font-mono font-bold text-primary">{kg} kg</td>
                        <td className="p-3 font-mono text-foreground">{(kg * 2.20462).toFixed(2)} lb</td>
                        <td className="p-3 font-mono text-foreground">{(kg * 35.274).toFixed(1)} oz</td>
                        <td className="p-3 font-mono text-foreground">{(kg * 1000).toLocaleString()} g</td>
                        <td className="p-3 font-mono text-foreground">{(kg / 6.35029).toFixed(3)} st</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "orange", title: "Enter Your Value", desc: "Type the weight you want to convert. Supports decimals and large numbers." },
                  { color: "blue", title: "Select Units", desc: "Choose your source unit (From) and target unit (To) from 8 supported weight units. Use the swap button to reverse the direction instantly." },
                  { color: "emerald", title: "Read the Result", desc: "The converted value appears immediately. All conversions use kilogram as the base unit for maximum accuracy with no rounding errors." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15">
                  <div className="flex items-center gap-2 mb-2"><Scale className="w-4 h-4 text-orange-500" /><h4 className="font-bold text-foreground text-sm">Body Weight (Fitness)</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A person weighing 70 kg = <strong className="text-foreground">154.3 lbs</strong> or <strong className="text-foreground">11 stone 0.2 lbs</strong>. Useful when tracking weight across US and international fitness apps.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Cooking & Recipes</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A recipe calling for 250 g of flour = <strong className="text-foreground">8.82 oz</strong> or about <strong className="text-foreground">0.55 lbs</strong>. Essential for converting between metric and imperial cooking measurements.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><Dumbbell className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Gym & Weightlifting</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 45 lb barbell plate = <strong className="text-foreground">20.4 kg</strong>. International gym equipment is often labeled in kg, while US gyms use lbs.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><Globe2 className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">Shipping & Logistics</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A parcel weighing 2.5 kg = <strong className="text-foreground">5.51 lbs</strong>. International shipping often requires weight in both kg and lbs for customs forms.</p>
                </div>
              </div>
            </section>

            {/* 7. BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Weight Converter?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Scale className="w-4 h-4" />, text: "Supports 8 weight units including stone" },
                  { icon: <ArrowLeftRight className="w-4 h-4" />, text: "One-click unit swap for reverse conversion" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data stored — runs entirely in browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-optimized for use at the gym or store" },
                  { icon: <Clock className="w-4 h-4" />, text: "Instant results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Conversion table included for quick reference" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Weight Unit Conversion Guide</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>A <strong className="text-foreground">weight converter</strong> is an essential tool for anyone working across metric and imperial systems. The world is split between countries using kilograms (most of the world) and those using pounds and ounces (primarily the US, UK, and a few others). This free kg to lbs converter handles all common weight units accurately.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">How to Convert kg to lbs</h3>
                <p>To convert kilograms to pounds, multiply the kilogram value by <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">2.20462</code>. For example, 10 kg × 2.20462 = 22.046 lbs. To go from pounds to kilograms, divide by 2.20462 (or multiply by 0.45359).</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Common Use Cases for Weight Conversion</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Tracking body weight between US (lbs) and international (kg) fitness apps",
                    "Converting recipe ingredients between grams and ounces",
                    "Calculating shipping weight for international packages",
                    "Converting gym equipment weights between US and metric plates",
                    "Reading nutrition labels that list weights in grams",
                    "UK stone-to-kg conversion for NHS medical forms",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 10. FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How many pounds is 1 kilogram?" a="1 kilogram equals 2.20462 pounds. To convert any kg value to pounds, multiply by 2.20462. For example, 5 kg = 11.023 lbs." />
                <FaqItem q="How many grams are in a pound?" a="There are 453.592 grams in 1 pound. To convert pounds to grams, multiply by 453.592. To go grams to pounds, divide by 453.592." />
                <FaqItem q="What is a stone in kg and lbs?" a="1 stone = 6.35029 kg = 14 pounds. Stones are commonly used in the UK and Ireland for body weight. For example, 10 stone = 63.5 kg = 140 lbs." />
                <FaqItem q="How do I convert ounces to grams?" a="Multiply ounces by 28.3495 to get grams. For example, 8 oz = 226.8 g. To go the other direction, divide grams by 28.3495." />
                <FaqItem q="What is the difference between metric ton and short ton?" a="A metric ton (tonne) = 1,000 kg = 2,204.62 lbs. A US short ton = 2,000 lbs = 907.185 kg. A metric ton is about 10% heavier than a US short ton." />
                <FaqItem q="Is this weight converter accurate?" a="Yes, all conversion factors are based on internationally agreed-upon definitions. Kilograms are used as the base unit, and conversions are computed to full floating-point precision." />
              </div>
            </section>

            {/* 11. FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Conversion Tools?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore 400+ free tools including length, temperature, area, and data storage converters — all free and instant.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others convert weight units quickly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Converter", "Quick Reference", "Conversion Table", "How It Works", "Examples", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      {label}
                    </a>
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
