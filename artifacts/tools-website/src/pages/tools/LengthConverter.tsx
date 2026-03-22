import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Ruler, Calculator, Lightbulb, Copy, Check,
  Thermometer, Palette, Heart, Construction, CalendarDays, ArrowLeftRight,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Conversion Logic ──
type LengthUnit =
  | "millimeter"
  | "centimeter"
  | "meter"
  | "kilometer"
  | "inch"
  | "foot"
  | "yard"
  | "mile"
  | "nautical-mile";

const UNITS: { value: LengthUnit; label: string; abbr: string }[] = [
  { value: "millimeter", label: "Millimeter", abbr: "mm" },
  { value: "centimeter", label: "Centimeter", abbr: "cm" },
  { value: "meter", label: "Meter", abbr: "m" },
  { value: "kilometer", label: "Kilometer", abbr: "km" },
  { value: "inch", label: "Inch", abbr: "in" },
  { value: "foot", label: "Foot", abbr: "ft" },
  { value: "yard", label: "Yard", abbr: "yd" },
  { value: "mile", label: "Mile", abbr: "mi" },
  { value: "nautical-mile", label: "Nautical Mile", abbr: "nmi" },
];

// Conversion factors: how many meters per 1 unit
const TO_METERS: Record<LengthUnit, number> = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
  "nautical-mile": 1852,
};

function useLengthConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState<LengthUnit>("foot");
  const [toUnit, setToUnit] = useState<LengthUnit>("meter");

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return null;
    const meters = val * TO_METERS[fromUnit];
    const converted = meters / TO_METERS[toUnit];
    const fromAbbr = UNITS.find(u => u.value === fromUnit)!.abbr;
    const toAbbr = UNITS.find(u => u.value === toUnit)!.abbr;
    return { input: val, converted, fromAbbr, toAbbr, fromUnit, toUnit };
  }, [inputValue, fromUnit, toUnit]);

  return { inputValue, setInputValue, fromUnit, setFromUnit, toUnit, setToUnit, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { input: number; converted: number; fromAbbr: string; toAbbr: string; fromUnit: LengthUnit; toUnit: LengthUnit } | null }) {
  if (!result) return null;

  const fmtNum = (n: number) => {
    if (Math.abs(n) >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
    return n.toPrecision(6);
  };

  const ratio = result.converted / result.input;
  const ratioStr = ratio >= 1
    ? `1 ${result.fromAbbr} equals ${fmtNum(ratio)} ${result.toAbbr}`
    : `${fmtNum(1 / ratio)} ${result.fromAbbr} equals 1 ${result.toAbbr}`;

  const message = `${fmtNum(result.input)} ${result.fromAbbr} is equal to ${fmtNum(result.converted)} ${result.toAbbr}. For reference, ${ratioStr}. This length converter supports metric and imperial units with full precision.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Temperature Converter", slug: "temperature-converter", icon: <Thermometer className="w-5 h-5" />, color: 15 },
  { title: "Color Converter", slug: "color-converter", icon: <Palette className="w-5 h-5" />, color: 290 },
  { title: "Hex to RGB Converter", slug: "hex-to-rgb", icon: <Palette className="w-5 h-5" />, color: 200 },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Heart className="w-5 h-5" />, color: 340 },
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, color: 35 },
  { title: "Date Difference Calculator", slug: "date-difference-calculator", icon: <CalendarDays className="w-5 h-5" />, color: 152 },
];

// ── Quick Conversion Pairs ──
const QUICK_PAIRS: { from: LengthUnit; to: LengthUnit; label: string }[] = [
  { from: "foot", to: "meter", label: "ft \u2192 m" },
  { from: "inch", to: "centimeter", label: "in \u2192 cm" },
  { from: "kilometer", to: "mile", label: "km \u2192 mi" },
  { from: "mile", to: "kilometer", label: "mi \u2192 km" },
  { from: "yard", to: "meter", label: "yd \u2192 m" },
  { from: "centimeter", to: "inch", label: "cm \u2192 in" },
  { from: "meter", to: "foot", label: "m \u2192 ft" },
  { from: "nautical-mile", to: "kilometer", label: "nmi \u2192 km" },
];

// ── Main Component ──
export default function LengthConverter() {
  const conv = useLengthConverter();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmtResult = (n: number | null) => {
    if (n === null) return "--";
    if (Math.abs(n) >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
    return n.toPrecision(6);
  };

  const swapUnits = () => {
    const prevFrom = conv.fromUnit;
    conv.setFromUnit(conv.toUnit);
    conv.setToUnit(prevFrom);
  };

  return (
    <Layout>
      <SEO
        title="Length Converter - Free Online Unit Converter | Feet to Meters, Inches to CM"
        description="Free online length converter. Convert between metric and imperial units instantly: feet to meters, inches to cm, km to miles, and more. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Length Converter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Ruler className="w-3.5 h-3.5" />
                Conversion Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Length Converter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Convert between metric and imperial length units instantly. Feet to meters, inches to centimeters, kilometers to miles, and more — free, accurate, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter a value and select your units — the conversion updates in real time. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5" id="calculator">
              <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Length Unit Converter</h3>
                </div>

                {/* Input Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Value</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="tool-calc-input w-full"
                      value={conv.inputValue}
                      onChange={e => conv.setInputValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">From</label>
                    <select
                      className="tool-calc-input w-full"
                      value={conv.fromUnit}
                      onChange={e => conv.setFromUnit(e.target.value as LengthUnit)}
                    >
                      {UNITS.map(u => (
                        <option key={u.value} value={u.value}>{u.label} ({u.abbr})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">To</label>
                    <select
                      className="tool-calc-input w-full"
                      value={conv.toUnit}
                      onChange={e => conv.setToUnit(e.target.value as LengthUnit)}
                    >
                      {UNITS.map(u => (
                        <option key={u.value} value={u.value}>{u.label} ({u.abbr})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center mb-4">
                  <button
                    onClick={swapUnits}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-semibold text-foreground transition-colors"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-primary" />
                    Swap Units
                  </button>
                </div>

                {/* Result */}
                <div className="tool-calc-result text-center">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Converted Value</div>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {conv.result ? `${fmtResult(conv.result.converted)} ${conv.result.toAbbr}` : "--"}
                  </div>
                  {conv.result && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {fmtResult(conv.result.input)} {conv.result.fromAbbr} = {fmtResult(conv.result.converted)} {conv.result.toAbbr}
                    </div>
                  )}
                </div>

                {/* Quick Conversion Buttons */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Quick Conversions</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PAIRS.map((pair) => (
                      <button
                        key={pair.label}
                        onClick={() => {
                          conv.setFromUnit(pair.from);
                          conv.setToUnit(pair.to);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          conv.fromUnit === pair.from && conv.toUnit === pair.to
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {pair.label}
                      </button>
                    ))}
                  </div>
                </div>

                <ResultInsight result={conv.result} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-it-works">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Enter Your Value</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Type any numeric length value in the input field. The converter accepts whole numbers, decimals, and negative values for directional measurements.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Select Units</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose your source and target units from the dropdowns. Supports 9 units across metric (mm, cm, m, km) and imperial (in, ft, yd, mi) systems, plus nautical miles.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Base-Unit Conversion</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The converter first translates your value to meters (the SI base unit), then converts from meters to the target unit. This two-step approach ensures accuracy for all 81 possible unit combinations.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Height Conversion</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A person who is 5 feet 10 inches tall is <strong className="text-foreground">177.8 cm</strong> or <strong className="text-foreground">1.778 meters</strong>. Useful for medical forms and international travel.</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-bold text-foreground text-sm">Marathon Distance</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A marathon is 42.195 kilometers, which equals <strong className="text-foreground">26.219 miles</strong>. Runners often need to convert pace between km and miles for training.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Construction className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Home Renovation</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A room measuring 12 feet by 15 feet is <strong className="text-foreground">3.66 m x 4.57 m</strong>. Converting is essential when ordering materials specified in metric units.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Road Trip Planning</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Driving 300 miles from New York to Washington D.C. is about <strong className="text-foreground">482.8 kilometers</strong>. Essential when renting a car abroad with a km odometer.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="benefits">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Converter?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant length conversion as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Full precision with up to 6 significant digits" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Supports 9 units across metric and imperial" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Length Conversion</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  Length conversion is the process of converting a measurement from one unit of length to another. The two most widely used measurement systems are the metric system (millimeters, centimeters, meters, kilometers) and the imperial system (inches, feet, yards, miles). Being able to convert between these systems is essential for international travel, scientific work, construction, and everyday tasks.
                </p>
                <p>
                  This free online length converter tool handles all common length unit conversions instantly. Whether you need to convert feet to meters for a building plan, inches to centimeters for a sewing project, or kilometers to miles for a road trip, this calculator delivers precise results in real time with no signup required.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Common Length Conversion Factors</h3>
                <p>
                  Understanding key conversion factors makes length conversion intuitive. One inch equals exactly 2.54 centimeters. One foot (12 inches) equals 0.3048 meters. One mile equals 1.60934 kilometers. One nautical mile, used in maritime and aviation, equals exactly 1,852 meters. The metric system is based on powers of 10, making conversions within the system straightforward: 1 kilometer = 1,000 meters = 100,000 centimeters.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Do You Need a Length Converter?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Converting height between feet/inches and centimeters for medical or travel documents",
                    "Translating construction measurements between imperial and metric systems",
                    "Converting road distances between kilometers and miles for trip planning",
                    "Adjusting recipe or fabric measurements from one unit system to another",
                    "Understanding product dimensions listed in unfamiliar units when shopping online",
                    "Converting athletic distances (5K, marathon) between metric and imperial for training",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How many centimeters are in an inch?"
                  a="One inch is exactly 2.54 centimeters. This is an internationally agreed-upon standard. To convert inches to centimeters, multiply the number of inches by 2.54. For example, 10 inches equals 25.4 centimeters."
                />
                <FaqItem
                  q="How do I convert feet to meters?"
                  a="One foot equals 0.3048 meters. Multiply the number of feet by 0.3048 to get meters. For example, 6 feet equals 1.8288 meters. You can also use this converter to get instant, precise results."
                />
                <FaqItem
                  q="How many miles are in a kilometer?"
                  a="One kilometer equals approximately 0.621371 miles. Conversely, one mile equals approximately 1.60934 kilometers. A quick mental trick: multiply kilometers by 0.6 for a rough mile estimate."
                />
                <FaqItem
                  q="What is a nautical mile and how does it differ from a regular mile?"
                  a="A nautical mile equals exactly 1,852 meters (about 1.151 regular miles or 6,076 feet). It is used in maritime navigation and aviation because it corresponds to one minute of latitude on the Earth's surface, making it practical for navigation with charts."
                />
                <FaqItem
                  q="Is this length converter accurate?"
                  a="Yes. This converter uses internationally standardized conversion factors and displays results with up to 6 significant digits of precision. The two-step conversion through meters as a base unit ensures consistent accuracy across all unit combinations."
                />
                <FaqItem
                  q="Is this length converter free to use?"
                  a="100% free with no ads, no signup, and no data collection. The converter runs entirely in your browser — your measurements never leave your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Conversion Tools?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including temperature converters, color converters, calculators, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others convert length units easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
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
