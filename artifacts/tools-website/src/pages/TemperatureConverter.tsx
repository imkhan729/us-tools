import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Thermometer, Ruler, ArrowRight, Zap,
  Smartphone, Shield, BadgeCheck, Lock, Copy, Check, Calculator,
  TrendingUp, Star, Lightbulb, Globe
} from "lucide-react";

// ── Temperature Conversion Logic ──
type Unit = "C" | "F" | "K" | "R";

const UNITS: { key: Unit; label: string; full: string }[] = [
  { key: "C", label: "°C", full: "Celsius" },
  { key: "F", label: "°F", full: "Fahrenheit" },
  { key: "K", label: "K",  full: "Kelvin" },
  { key: "R", label: "°R", full: "Rankine" },
];

function toC(val: number, from: Unit): number {
  switch (from) {
    case "C": return val;
    case "F": return (val - 32) * 5 / 9;
    case "K": return val - 273.15;
    case "R": return (val - 491.67) * 5 / 9;
  }
}

function fromC(c: number, to: Unit): number {
  switch (to) {
    case "C": return c;
    case "F": return c * 9 / 5 + 32;
    case "K": return c + 273.15;
    case "R": return (c + 273.15) * 9 / 5;
  }
}

const REFERENCES = [
  { label: "Absolute zero",    C: -273.15, F: -459.67, K: 0,      R: 0      },
  { label: "Water freezes",    C: 0,       F: 32,      K: 273.15, R: 491.67 },
  { label: "Room temperature", C: 22,      F: 71.6,    K: 295.15, R: 531.27 },
  { label: "Body temperature", C: 37,      F: 98.6,    K: 310.15, R: 558.27 },
  { label: "Water boils",      C: 100,     F: 212,     K: 373.15, R: 671.67 },
];

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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
  { title: "Length Converter",   slug: "length-converter",   icon: <Ruler className="w-4 h-4" />,       color: 217, benefit: "Convert meters, feet, inches & more" },
  { title: "Weight Converter",   slug: "weight-converter",   icon: <Calculator className="w-4 h-4" />,  color: 152, benefit: "Convert kg, lbs, stone & more" },
  { title: "Speed Converter",    slug: "speed-converter",    icon: <TrendingUp className="w-4 h-4" />,  color: 45,  benefit: "Convert mph, km/h, knots" },
  { title: "Pressure Converter", slug: "pressure-converter", icon: <Thermometer className="w-4 h-4" />, color: 275, benefit: "Convert PSI, bar, atm & more" },
  { title: "Volume Converter",   slug: "volume-converter",   icon: <Globe className="w-4 h-4" />,       color: 25,  benefit: "Convert liters, gallons & more" },
  { title: "Energy Converter",   slug: "energy-converter",   icon: <Zap className="w-4 h-4" />,         color: 340, benefit: "Convert joules, calories & more" },
];

// ── Main Component ──
export default function TemperatureConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<Unit>("C");
  const [copied, setCopied] = useState(false);

  const celsius = value !== "" && !isNaN(parseFloat(value)) ? toC(parseFloat(value), from) : null;

  function converted(to: Unit): string {
    if (celsius === null) return "--";
    const result = fromC(celsius, to);
    return result.toLocaleString("en-US", { maximumFractionDigits: 4 });
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Temperature Converter – Celsius, Fahrenheit, Kelvin & Rankine | US Online Tools"
        description="Free temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Includes formula reference and common temperature chart. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Unit Converters</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Temperature Converter</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-red-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Thermometer className="w-3.5 h-3.5" />
            Unit Converters
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Temperature Converter
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert temperatures between Celsius, Fahrenheit, Kelvin, and Rankine instantly. See all four units simultaneously with a built-in reference table for common temperatures.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> 4 Unit Scales
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Unit Converters &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-red-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center flex-shrink-0">
                      <Thermometer className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">4 Temperature Scales</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Unit Selector */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Select Input Unit</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {UNITS.map((u) => (
                        <button
                          key={u.key}
                          onClick={() => setFrom(u.key)}
                          className={`flex flex-col items-center justify-center px-3 py-3 rounded-xl border-2 font-bold transition-all ${
                            from === u.key
                              ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25"
                              : "border-border text-muted-foreground hover:border-orange-500/40 hover:text-foreground bg-background"
                          }`}
                        >
                          <span className="text-lg leading-tight">{u.label}</span>
                          <span className="text-[10px] font-medium opacity-80 mt-0.5">{u.full}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Enter Temperature in {UNITS.find(u => u.key === from)?.full}
                    </p>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={value}
                      onChange={e => setValue(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl border-2 border-border bg-background text-foreground font-bold text-2xl focus:outline-none focus:border-orange-500 transition-colors text-center"
                    />
                  </div>

                  {/* Result Cards */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Converted Values</p>
                    <div className="grid grid-cols-2 gap-3">
                      {UNITS.filter(u => u.key !== from).map((u) => (
                        <div
                          key={u.key}
                          className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/40 border border-border"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{u.full}</span>
                          <span className="text-2xl font-black text-orange-500">{converted(u.key)}</span>
                          <span className="text-xs text-muted-foreground font-medium mt-0.5">{u.label}</span>
                        </div>
                      ))}
                    </div>
                    {celsius !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
                      >
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {value} {UNITS.find(u => u.key === from)?.label} is equivalent to{" "}
                            {UNITS.filter(u => u.key !== from).map((u, i, arr) => (
                              <span key={u.key}><strong>{converted(u.key)} {u.label}</strong>{i < arr.length - 1 ? ", " : ""}</span>
                            ))}.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Reference Table */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Common Temperature Reference</p>
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/60">
                            <th className="text-left px-3 py-2.5 font-bold text-foreground text-xs">Reference</th>
                            <th className="text-right px-3 py-2.5 font-bold text-foreground text-xs">°C</th>
                            <th className="text-right px-3 py-2.5 font-bold text-foreground text-xs">°F</th>
                            <th className="text-right px-3 py-2.5 font-bold text-foreground text-xs">K</th>
                            <th className="text-right px-3 py-2.5 font-bold text-foreground text-xs">°R</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {REFERENCES.map((ref) => (
                            <tr key={ref.label} className="hover:bg-muted/30 transition-colors">
                              <td className="px-3 py-2.5 text-muted-foreground font-medium">{ref.label}</td>
                              <td className="px-3 py-2.5 font-mono text-foreground text-right">{ref.C}</td>
                              <td className="px-3 py-2.5 font-mono text-foreground text-right">{ref.F}</td>
                              <td className="px-3 py-2.5 font-mono text-foreground text-right">{ref.K}</td>
                              <td className="px-3 py-2.5 font-mono text-foreground text-right">{ref.R}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Temperature Converter</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool converts temperatures between all four major scales simultaneously — Celsius, Fahrenheit, Kelvin, and Rankine. Whether you're a student, scientist, engineer, traveler, or home cook, here's exactly how to get instant, accurate results.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select your input unit (°C, °F, K, or °R)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click one of the four unit buttons at the top of the tool. The active unit is highlighted in orange. Choose Celsius if you're working with everyday European measurements, Fahrenheit for US weather or cooking recipes, Kelvin for scientific and physics calculations, or Rankine for thermodynamic engineering calculations common in the United States aerospace and chemical industries.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Type your temperature value</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter any number in the large input field — decimals are fully supported (e.g., 98.6 or -17.78). Negative values work correctly for sub-zero Celsius and Fahrenheit temperatures. There is no button to press; results appear the moment a valid number is detected. The three result cards below update instantly as you type.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">All 3 other units update instantly — check the reference table for context</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The three conversion cards show your value expressed in the other three scales, accurate to 4 decimal places. Below the converter, the reference table shows five well-known temperatures — absolute zero, water freezing, room temperature, body temperature, and water boiling — which give you a quick sanity check for your result. For example, if your Celsius value is near 37, you know you're close to human body temperature.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold text-xs flex-shrink-0 w-20">°C → °F</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(C × 9/5) + 32</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold text-xs flex-shrink-0 w-20">°F → °C</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(F − 32) × 5/9</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold text-xs flex-shrink-0 w-20">°C → K</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">C + 273.15</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold text-xs flex-shrink-0 w-20">°C → °R</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(C + 273.15) × 9/5</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All conversions pass through Celsius as an intermediate step. To convert Fahrenheit to Kelvin, for instance, the tool first converts F to C, then C to K. This two-step method keeps the logic clean and eliminates redundant formulas. Rankine is simply Kelvin scaled by the same 9/5 factor used between Celsius and Fahrenheit — making it the Fahrenheit-equivalent of an absolute scale.
                </p>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">Color-coded temperature ranges to help you understand what your result means in the real world:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Below 0°C / 32°F — Freezing conditions</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Any temperature below the freezing point of water. This range covers winter weather, ice formation, frozen food storage (typically around −18°C / 0°F), and cryogenic applications. In Kelvin, these temperatures are below 273.15 K. Scientists working with superconductors operate far deeper in this range, approaching absolute zero at −273.15°C. In everyday life, sub-zero temperatures affect road safety, pipe insulation, and cold-chain logistics.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">0–20°C / 32–68°F — Cold to cool</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This range spans early spring and late autumn weather in temperate climates. Refrigerators typically run at 1–4°C (34–39°F) to slow bacterial growth without freezing food. Wine cellars are maintained at 12–14°C (54–57°F). Many industrial processes — including pharmaceutical storage and server cooling — target this range for stability and safety.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">20–37°C / 68–99°F — Comfortable to body temperature</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The human comfort zone. Room temperature is typically defined as 20–22°C (68–72°F). The thermostat-perfect home hovers around 21°C (70°F). At the upper end, 37°C (98.6°F) marks normal human body temperature. Warm summer days typically fall in the mid-to-upper part of this range. Tropical climates and direct sunlight can push temperatures toward the top of this band.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Above 37°C / 99°F — Fever, hot weather, boiling</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Temperatures above normal body temperature signal fever in medical contexts (above 38°C / 100.4°F is clinically significant). Extreme heat waves — a growing concern globally — push outdoor air temperatures above 40°C (104°F). Cooking involves much higher ranges: baking at 175–230°C (350–450°F), frying at 180°C (356°F), and grilling at 260°C+ (500°F+). Water boils at exactly 100°C (212°F) at sea level.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Results are shown to 4 decimal places for maximum precision. Rankine is primarily used in US engineering thermodynamics. For scientific calculations — especially in physics, chemistry, and astronomy — Kelvin is the standard because it starts at absolute zero and contains no negative values.
              </p>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Temperature</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">°C</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">°F</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">K</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Water boils</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">100</td>
                      <td className="px-4 py-3 font-mono text-foreground">212</td>
                      <td className="px-4 py-3 font-mono text-foreground">373.15</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">At sea level, 1 atm</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Water freezes</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">0</td>
                      <td className="px-4 py-3 font-mono text-foreground">32</td>
                      <td className="px-4 py-3 font-mono text-foreground">273.15</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Standard freezing point</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Body temperature</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">37</td>
                      <td className="px-4 py-3 font-mono text-foreground">98.6</td>
                      <td className="px-4 py-3 font-mono text-foreground">310.15</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Normal human temperature</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">The crossover</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">−40</td>
                      <td className="px-4 py-3 font-mono text-foreground">−40</td>
                      <td className="px-4 py-3 font-mono text-foreground">233.15</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">°C equals °F here</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Room temperature</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">22</td>
                      <td className="px-4 py-3 font-mono text-foreground">71.6</td>
                      <td className="px-4 py-3 font-mono text-foreground">295.15</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Comfortable indoor temp</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">100°C = 212°F = 373.15 K — Water boils.</strong> This is arguably the most important reference temperature in everyday cooking and chemistry. At sea level and standard atmospheric pressure (1 atm / 101.325 kPa), pure water transitions from liquid to vapor. The boiling point drops at higher altitudes — about 1°C per 300 meters of elevation — which is why baking times and pasta cooking times differ in cities like Denver (1,609 m) compared to New York (10 m).
                </p>
                <p>
                  <strong className="text-foreground">0°C = 32°F = 273.15 K — Water freezes.</strong> The freezing point of water is the anchor for the Celsius scale, which was originally defined to place 0 at this exact transition. The Kelvin value of 273.15 is equally important — it reveals the offset between Kelvin and Celsius, and it's why absolute zero is −273.15°C. Ice forms at this point under standard conditions, affecting road safety, food preservation, and plant survival during winter frosts.
                </p>
                <p>
                  <strong className="text-foreground">−40°C = −40°F — The crossover point.</strong> This is the only temperature where Celsius and Fahrenheit give identical numeric values. It arises naturally from the linear relationship between the two scales: setting (C × 9/5) + 32 = C and solving for C yields exactly −40. Practically, this temperature represents extreme cold — colder than most inhabited places on Earth reach, though parts of Siberia, Canada, and Antarctica do see −40°C in winter. Diesel fuel gels around these temperatures, creating serious problems for transportation in those regions.
                </p>
                <p>
                  <strong className="text-foreground">22°C = 71.6°F — Comfortable room temperature.</strong> Most thermostat standards and HVAC guidelines target 20–22°C (68–72°F) as the optimal indoor comfort range. At 22°C, humidity becomes an equally important factor in perceived comfort — the same temperature feels cooler and more pleasant at 40% relative humidity than at 80%. Office buildings, schools, and hospitals are typically regulated to stay within a degree or two of this value during working hours.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Exactly what I needed — I'm always cooking from European recipes and constantly needed to convert Celsius to Fahrenheit for my oven. Now I just leave this tab open."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Temperature Converter?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Completely free, forever.</strong> This tool has no premium tier, no credit system, and no hidden limits. Many temperature converters online monetize through ads that obscure the result, or force you to create an account before accessing conversions. Here, you open the page and the converter is immediately ready — no clicks, no popups, no interruptions. It will always be free.
                </p>
                <p>
                  <strong className="text-foreground">Your data never leaves your browser.</strong> Every conversion runs entirely in JavaScript on your device. No temperature value you enter is transmitted to any server, stored in any database, or associated with any account. This is especially valuable for industrial users who may be working with proprietary process temperatures, or for researchers who handle sensitive experimental data. Privacy is the default, not a paid feature.
                </p>
                <p>
                  <strong className="text-foreground">All four scales at once — not just °C and °F.</strong> Most online converters handle only Celsius and Fahrenheit. This tool simultaneously shows Celsius, Fahrenheit, Kelvin, and Rankine — making it genuinely useful for scientists, engineers, and students who work across disciplines. Switching your input unit takes one click, and the remaining three values recalculate instantly. You never have to repeat your entry.
                </p>
                <p>
                  <strong className="text-foreground">Reference table included.</strong> The built-in reference table shows five universally recognized benchmarks — absolute zero, water freezing, room temperature, body temperature, and the boiling point of water — in all four scales simultaneously. This gives you instant context for any result. If you convert a temperature and want to know whether it's "hot" or "cold" relative to everyday experience, the reference table answers that at a glance without requiring you to look anything up elsewhere.
                </p>
                <p>
                  <strong className="text-foreground">Fully mobile-friendly with a large input field.</strong> The converter is designed for real-world use on any device. The unit selector buttons are large enough for comfortable thumb tapping on smartphones. The number input is oversized and centered for easy entry. The result cards stack neatly on small screens and expand to a 2-column grid on larger ones. Whether you're checking an oven temperature from a recipe on your phone or running batch calculations on a desktop, the layout adapts without compromise.
                </p>
              </div>

              {/* Note */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Results are shown to 4 decimal places. Rankine is primarily used in US engineering and thermodynamics contexts; for most everyday and scientific purposes, Kelvin is the preferred absolute scale. Boiling and freezing points assume standard atmospheric pressure (1 atm / 101.325 kPa) — these values shift at different altitudes or pressures.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I convert Celsius to Fahrenheit?"
                  a="Multiply the Celsius value by 9/5, then add 32. For example, 25°C × 9/5 = 45, plus 32 = 77°F. Using this tool, select °C as your input unit, type 25, and the Fahrenheit result appears instantly in one of the result cards. This formula has been in use since the Fahrenheit scale was standardized in the early 18th century and remains the most commonly needed temperature conversion worldwide."
                />
                <FaqItem
                  q="What is the formula to convert Fahrenheit to Celsius?"
                  a="Subtract 32 from the Fahrenheit value, then multiply by 5/9. For example, 98.6°F − 32 = 66.6, times 5/9 = 37°C. This is the reverse of the Celsius-to-Fahrenheit formula and is frequently needed by Americans reading European recipes, weather forecasts, or medical literature. Select °F as your input unit in the converter above and the Celsius equivalent appears automatically."
                />
                <FaqItem
                  q="What is absolute zero?"
                  a="Absolute zero is the lowest theoretically possible temperature — the point at which all classical molecular motion ceases. It equals −273.15°C, −459.67°F, 0 K, and 0°R. It is the foundation of both the Kelvin and Rankine scales, which start at zero here. According to the third law of thermodynamics, absolute zero can be approached but never fully reached. Scientists have come within a billionth of a degree of absolute zero in laboratory settings using laser cooling and magnetic evaporative cooling techniques."
                />
                <FaqItem
                  q="Why does −40°C equal −40°F?"
                  a="Because the Celsius and Fahrenheit scales converge at exactly one point: −40. This happens due to the mathematical relationship between the two scales — Fahrenheit = (Celsius × 9/5) + 32. Setting both sides equal (C = F) and solving gives C = −40. Below this point, Celsius values are numerically higher than Fahrenheit (e.g., −50°C = −58°F), and above it, Fahrenheit values are numerically higher than Celsius (e.g., 0°C = 32°F). The −40 crossover is a useful anchor for mental math."
                />
                <FaqItem
                  q="What is the difference between Kelvin and Celsius?"
                  a="Kelvin and Celsius use the same size degree (a 1-degree change is identical in both scales), but they have different zero points. Celsius places 0 at the freezing point of water; Kelvin places 0 at absolute zero (−273.15°C). This means you can convert between them with a simple addition or subtraction: K = °C + 273.15. Kelvin is preferred in scientific work because it contains no negative values, simplifying equations in thermodynamics, gas laws, and astrophysics."
                />
                <FaqItem
                  q="What is Rankine and when is it used?"
                  a="Rankine is an absolute temperature scale based on Fahrenheit degrees — in the same way that Kelvin is absolute Celsius. Its zero point is absolute zero (0°R = 0 K = −459.67°F), and one degree Rankine equals one degree Fahrenheit. Rankine is primarily used in US engineering disciplines, particularly thermodynamics, aerospace engineering, and chemical process engineering, where Fahrenheit-based calculations need to reference an absolute scale. Outside the United States, it is rarely encountered."
                />
                <FaqItem
                  q="What is normal human body temperature in all scales?"
                  a="The traditionally cited normal human body temperature is 37°C, which equals 98.6°F, 310.15 K, and 558.27°R. However, modern medical research suggests that the true average has shifted slightly — many healthy adults now have resting temperatures closer to 36.5°C (97.7°F). A fever is generally defined as a core body temperature above 38°C (100.4°F). Oral, axillary, tympanic, and rectal measurements can all differ by 0.5°C or more, so the exact figure depends on measurement method."
                />
                <FaqItem
                  q="Is Kelvin used in everyday life?"
                  a="Kelvin rarely appears in everyday conversation, but it is omnipresent in technology and science. Color temperature in photography and lighting is measured in Kelvin — a warm incandescent bulb is around 2700 K, while daylight is approximately 6500 K. Astronomers measure star temperatures in Kelvin (the sun's surface is about 5778 K). Weather and climate models, semiconductor physics, and gas law calculations all rely on Kelvin. For most people, the closest everyday encounter with Kelvin is selecting a light bulb's color temperature at a hardware store."
                />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Unit Converters?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including length, weight, speed, pressure, volume, and energy converters — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others convert temperatures easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-red-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Converter",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
