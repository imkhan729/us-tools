import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, Heart,
  Lightbulb, Copy, Check, Activity, Calculator, Scale,
  Ruler, Users, Apple,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type Gender = "male" | "female";
type UnitSystem = "imperial" | "metric";

interface BodyFatResult {
  bodyFatPercent: number;
  fatMass: number;
  leanMass: number;
  category: string;
  gender: Gender;
}

function getCategory(bf: number, gender: Gender): string {
  if (gender === "male") {
    if (bf <= 5) return "Essential Fat";
    if (bf <= 13) return "Athletes";
    if (bf <= 17) return "Fitness";
    if (bf <= 24) return "Average";
    return "Obese";
  } else {
    if (bf <= 13) return "Essential Fat";
    if (bf <= 20) return "Athletes";
    if (bf <= 24) return "Fitness";
    if (bf <= 31) return "Average";
    return "Obese";
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "Essential Fat": return "text-red-500";
    case "Athletes": return "text-blue-500";
    case "Fitness": return "text-emerald-500";
    case "Average": return "text-amber-500";
    case "Obese": return "text-red-600";
    default: return "text-foreground";
  }
}

function useBodyFatCalc() {
  const [gender, setGender] = useState<Gender>("male");
  const [units, setUnits] = useState<UnitSystem>("imperial");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [weight, setWeight] = useState("");

  const result = useMemo<BodyFatResult | null>(() => {
    let h = parseFloat(height);
    let n = parseFloat(neck);
    let w = parseFloat(waist);
    let hp = parseFloat(hip);
    const wt = parseFloat(weight);

    if (isNaN(h) || isNaN(n) || isNaN(w) || isNaN(wt) || h <= 0 || n <= 0 || w <= 0 || wt <= 0) return null;
    if (gender === "female" && (isNaN(hp) || hp <= 0)) return null;

    // Convert metric (cm/kg) to imperial (inches/lbs) for the formula
    if (units === "metric") {
      h = h / 2.54;
      n = n / 2.54;
      w = w / 2.54;
      hp = hp / 2.54;
    }

    let bf: number;
    if (gender === "male") {
      if (w - n <= 0) return null;
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      if (w + hp - n <= 0) return null;
      bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
    }

    if (bf < 0 || bf > 80) return null;

    const weightLbs = units === "metric" ? wt * 2.20462 : wt;
    const fatMassLbs = (bf / 100) * weightLbs;
    const leanMassLbs = weightLbs - fatMassLbs;

    const fatMass = units === "metric" ? fatMassLbs / 2.20462 : fatMassLbs;
    const leanMass = units === "metric" ? leanMassLbs / 2.20462 : leanMassLbs;

    return {
      bodyFatPercent: bf,
      fatMass,
      leanMass,
      category: getCategory(bf, gender),
      gender,
    };
  }, [gender, units, height, neck, waist, hip, weight]);

  return { gender, setGender, units, setUnits, height, setHeight, neck, setNeck, waist, setWaist, hip, setHip, weight, setWeight, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: BodyFatResult | null }) {
  if (!result) return null;

  const fmt = (n: number) => n.toFixed(1);
  const genderLabel = result.gender === "male" ? "male" : "female";

  const message = `Your estimated body fat percentage is ${fmt(result.bodyFatPercent)}%, which falls in the "${result.category}" category for ${genderLabel}s. Your fat mass is approximately ${fmt(result.fatMass)} and lean mass is ${fmt(result.leanMass)}. ${result.category === "Fitness" || result.category === "Athletes" ? "Great job maintaining a healthy body composition!" : result.category === "Average" ? "You are within a normal range. Regular exercise and balanced nutrition can help improve your body composition." : result.category === "Obese" ? "Consider consulting a healthcare professional for personalized advice on improving your body composition." : "Essential fat levels are critical for physiological functions."}`;

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
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 340 },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Activity className="w-5 h-5" />, color: 25 },
  { title: "Calorie Calculator", slug: "calorie-calculator", icon: <Apple className="w-5 h-5" />, color: 120 },
  { title: "GPA Calculator", slug: "gpa-calculator", icon: <Calculator className="w-5 h-5" />, color: 217 },
  { title: "Age Calculator", slug: "age-calculator", icon: <Clock className="w-5 h-5" />, color: 265 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Calculator className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function BodyFatCalculator() {
  const calc = useBodyFatCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | null) => {
    if (n === null) return "--";
    return n.toFixed(1);
  };

  const unitLabel = calc.units === "imperial" ? "inches" : "cm";
  const weightLabel = calc.units === "imperial" ? "lbs" : "kg";

  return (
    <Layout>
      <SEO
        title="Body Fat Calculator - Free US Navy Method Tool | Body Fat Percentage"
        description="Free online body fat calculator using the US Navy method. Calculate your body fat percentage, fat mass, and lean mass instantly. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/health-fitness" className="text-muted-foreground hover:text-foreground transition-colors">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Body Fat Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Heart className="w-3.5 h-3.5" />
                Health & Fitness
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Body Fat Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate your body fat percentage using the US Navy method. Get your fat mass, lean mass, and body composition category — free, instant, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter your measurements below — results update as you type. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 340 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Body Fat Calculator (US Navy Method)</h3>
                </div>

                {/* Gender & Unit Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Gender</label>
                    <div className="flex rounded-lg overflow-hidden border border-border">
                      <button
                        onClick={() => calc.setGender("male")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${calc.gender === "male" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => calc.setGender("female")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${calc.gender === "female" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit System</label>
                    <div className="flex rounded-lg overflow-hidden border border-border">
                      <button
                        onClick={() => calc.setUnits("imperial")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${calc.units === "imperial" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        Imperial
                      </button>
                      <button
                        onClick={() => calc.setUnits("metric")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${calc.units === "metric" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        Metric
                      </button>
                    </div>
                  </div>
                </div>

                {/* Measurement Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Height ({unitLabel})</label>
                    <input
                      type="number"
                      placeholder={calc.units === "imperial" ? "70" : "178"}
                      className="tool-calc-input w-full"
                      value={calc.height}
                      onChange={e => calc.setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Neck Circumference ({unitLabel})</label>
                    <input
                      type="number"
                      placeholder={calc.units === "imperial" ? "15" : "38"}
                      className="tool-calc-input w-full"
                      value={calc.neck}
                      onChange={e => calc.setNeck(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waist Circumference ({unitLabel})</label>
                    <input
                      type="number"
                      placeholder={calc.units === "imperial" ? "34" : "86"}
                      className="tool-calc-input w-full"
                      value={calc.waist}
                      onChange={e => calc.setWaist(e.target.value)}
                    />
                  </div>
                  {calc.gender === "female" && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Hip Circumference ({unitLabel})</label>
                      <input
                        type="number"
                        placeholder={calc.units === "imperial" ? "38" : "97"}
                        className="tool-calc-input w-full"
                        value={calc.hip}
                        onChange={e => calc.setHip(e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Weight ({weightLabel})</label>
                    <input
                      type="number"
                      placeholder={calc.units === "imperial" ? "180" : "82"}
                      className="tool-calc-input w-full"
                      value={calc.weight}
                      onChange={e => calc.setWeight(e.target.value)}
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Body Fat %</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {calc.result ? `${fmt(calc.result.bodyFatPercent)}%` : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Fat Mass</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {calc.result ? `${fmt(calc.result.fatMass)} ${weightLabel}` : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Lean Mass</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      {calc.result ? `${fmt(calc.result.leanMass)} ${weightLabel}` : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Category</div>
                    <div className={`text-lg font-black ${calc.result ? getCategoryColor(calc.result.category) : ""}`}>
                      {calc.result ? calc.result.category : "--"}
                    </div>
                  </div>
                </div>

                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Measure Key Body Sites</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The US Navy method requires simple circumference measurements: height, neck, and waist for men; height, neck, waist, and hips for women. Use a flexible tape measure for best accuracy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">US Navy Formula Calculation</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">For men: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">BF% = 86.010 x log10(waist - neck) - 70.041 x log10(height) + 36.76</code>. For women: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">BF% = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387</code>.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Body Composition Breakdown</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Your body fat percentage is applied to your weight to calculate fat mass and lean mass. The result is categorized into Essential Fat, Athletes, Fitness, Average, or Obese based on gender-specific ranges.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Male Athlete</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 5'10" man (70 in) with a 15-inch neck and 31-inch waist. Body fat: <strong className="text-foreground">~12.5%</strong> — falls in the "Athletes" category with excellent conditioning.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Average Male</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 5'9" man (69 in) with a 15.5-inch neck and 36-inch waist. Body fat: <strong className="text-foreground">~21.7%</strong> — within the "Average" range for healthy adult males.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Fit Female</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 5'6" woman (66 in) with a 13-inch neck, 28-inch waist, and 37-inch hips. Body fat: <strong className="text-foreground">~22.4%</strong> — in the "Fitness" category.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Average Female</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A 5'5" woman (65 in) with a 13-inch neck, 33-inch waist, and 40-inch hips. Body fat: <strong className="text-foreground">~31.0%</strong> — at the upper end of the "Average" range.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant body fat results as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Uses the proven US Navy method formula" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Ruler className="w-4 h-4" />, text: "Supports both imperial and metric units" },
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is Body Fat Percentage?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  Body fat percentage is the proportion of your total body weight that is composed of fat tissue. Unlike BMI, which only considers height and weight, body fat percentage provides a much more accurate picture of your body composition and overall health. Two people with the same BMI can have vastly different body fat percentages depending on their muscle mass and fat distribution.
                </p>
                <p>
                  This free online body fat calculator uses the US Navy body fat method, one of the most widely accepted circumference-based approaches for estimating body fat percentage. The US Navy formula was developed for military fitness assessments and has been validated against more expensive methods like DEXA scans and hydrostatic weighing. It requires only a tape measure and takes less than a minute.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Body Fat Categories Explained</h3>
                <p>
                  Body fat percentage ranges differ between men and women due to physiological differences. For men, essential fat (2-5%) is the minimum needed for basic health; athletes typically range from 6-13%, fitness enthusiasts 14-17%, average adults 18-24%, and obesity begins at 25% and above. For women, essential fat is 10-13%, athletes 14-20%, fitness 21-24%, average 25-31%, and obesity starts at 32% and above. Women naturally carry more body fat due to reproductive and hormonal functions.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Why Track Body Fat Instead of Just Weight?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Body fat percentage reveals your true body composition, not just total mass",
                    "Muscle weighs more than fat, so scale weight alone can be misleading",
                    "Tracking body fat helps monitor progress during fitness programs more accurately",
                    "It identifies health risks associated with excess visceral fat",
                    "Athletes and bodybuilders use body fat tracking to optimize performance",
                    "The US Navy method is free, quick, and requires no special equipment",
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
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How accurate is the US Navy body fat method?"
                  a="The US Navy method is generally accurate within 1-3% of more advanced techniques like DEXA scans. It has been extensively validated by the Department of Defense and is used as the official body composition assessment tool across US military branches. For most people, it provides a reliable estimate of body fat percentage."
                />
                <FaqItem
                  q="How do I measure my waist circumference correctly?"
                  a="For the US Navy method, measure your waist at the navel (belly button) level. Stand relaxed, breathe out normally, and wrap the tape measure horizontally around your waist. The tape should be snug but not compressing the skin. Take the measurement in the morning for the most consistent results."
                />
                <FaqItem
                  q="Why does the calculator need hip measurements for women only?"
                  a="Women store fat differently than men, with more fat distributed around the hips and thighs. The US Navy formula accounts for this difference by including hip circumference in the female calculation. This additional measurement improves accuracy for estimating female body fat percentage."
                />
                <FaqItem
                  q="What is a healthy body fat percentage?"
                  a="For men, a healthy body fat range is typically 14-24%, with fitness-oriented individuals aiming for 14-17%. For women, a healthy range is 21-31%, with fitness-oriented individuals targeting 21-24%. Essential fat levels below these ranges are necessary for survival but not recommended as targets for the general population."
                />
                <FaqItem
                  q="How is body fat percentage different from BMI?"
                  a="BMI (Body Mass Index) is calculated using only height and weight, making it a rough screening tool. Body fat percentage directly measures the proportion of fat in your body. A muscular person may have a high BMI but low body fat, while someone with little muscle may have a normal BMI but high body fat. Body fat percentage is the more accurate indicator of health."
                />
                <FaqItem
                  q="Is this body fat calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. The calculator runs entirely in your browser — your measurements and health data never leave your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Health Calculators?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including BMI calculators, BMR tools, calorie counters, and more — all free, all instant.
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
                <p className="text-sm text-muted-foreground mb-4">Help others calculate their body fat percentage easily.</p>
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
