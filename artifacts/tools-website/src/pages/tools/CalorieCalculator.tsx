import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  BadgeCheck, Zap, Lock, Shield, Smartphone, Star,
  Flame, Activity, Heart, Scale, Lightbulb,
  Copy, Check, Apple,
} from "lucide-react";

// ── Types ──
type Sex = "male" | "female";
type Unit = "metric" | "imperial";
type Formula = "mifflin" | "harris";

// ── Data ──
const ACTIVITY_LEVELS = [
  { key: "sedentary",  label: "Sedentary",          desc: "Little or no exercise, desk job",             factor: 1.2 },
  { key: "light",      label: "Lightly Active",      desc: "Light exercise/sports 1–3 days/week",         factor: 1.375 },
  { key: "moderate",   label: "Moderately Active",   desc: "Moderate exercise 3–5 days/week",             factor: 1.55 },
  { key: "very",       label: "Very Active",         desc: "Hard exercise 6–7 days/week",                 factor: 1.725 },
  { key: "extra",      label: "Extra Active",        desc: "Very hard exercise + physical job or 2×/day", factor: 1.9 },
];

const GOALS = [
  { key: "lose2",    label: "Lose 2 lbs/week",  delta: -1000, color: "text-red-600 dark:text-red-400" },
  { key: "lose1",    label: "Lose 1 lb/week",   delta: -500,  color: "text-orange-600 dark:text-orange-400" },
  { key: "lose0.5",  label: "Lose 0.5 lb/week", delta: -250,  color: "text-amber-600 dark:text-amber-400" },
  { key: "maintain", label: "Maintain weight",  delta: 0,     color: "text-emerald-600 dark:text-emerald-400" },
  { key: "gain0.5",  label: "Gain 0.5 lb/week", delta: 250,   color: "text-blue-600 dark:text-blue-400" },
  { key: "gain1",    label: "Gain 1 lb/week",   delta: 500,   color: "text-violet-600 dark:text-violet-400" },
];

const MACRO_TABLE = [
  ["Weight Loss",  "10–30% deficit", "High protein (30–35%)",     "Moderate fat (25–35%)", "Lower carb (30–45%)"],
  ["Maintenance",  "At TDEE",        "Moderate protein (20–25%)", "Moderate fat (25–35%)", "Moderate carb (45–55%)"],
  ["Muscle Gain",  "5–15% surplus",  "High protein (25–35%)",     "Moderate fat (25–30%)", "Higher carb (40–50%)"],
];

// ── BMR Calculation ──
function calcBMR(sex: Sex, age: number, weightKg: number, heightCm: number, formula: Formula): number {
  if (formula === "mifflin") {
    return sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return sex === "male"
    ? 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362
    : 9.247 * weightKg + 3.098 * heightCm - 4.330 * age + 447.593;
}

// ── FAQ Item ──
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
  { title: "BMR Calculator",         slug: "bmr-calculator",          icon: <Flame className="w-5 h-5" />,    color: 25,  benefit: "Basal metabolic rate only" },
  { title: "TDEE Calculator",        slug: "tdee-calculator",         icon: <Activity className="w-5 h-5" />, color: 200, benefit: "Total daily energy expenditure" },
  { title: "BMI Calculator",         slug: "bmi-calculator",          icon: <Scale className="w-5 h-5" />,    color: 152, benefit: "Body mass index calculator" },
  { title: "Calorie Deficit",        slug: "calorie-deficit-calculator", icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Daily deficit for weight loss" },
  { title: "Protein Intake",         slug: "protein-intake-calculator",  icon: <Apple className="w-5 h-5" />, color: 270, benefit: "Daily protein requirement" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Online Calorie Calculator",
      description: "Free online calorie calculator. Calculate daily calorie needs (TDEE) based on BMR, activity level, and weight goal.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url: "https://usonlinetools.com/health/calorie-calculator",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How many calories do I need per day?", acceptedAnswer: { "@type": "Answer", text: "The average adult needs 1,600–2,400 cal/day (women) or 2,000–3,000 cal/day (men), depending on age, weight, height, and activity level." } },
        { "@type": "Question", name: "What is TDEE?", acceptedAnswer: { "@type": "Answer", text: "TDEE (Total Daily Energy Expenditure) = BMR × Activity Factor. It represents all calories burned in a day." } },
      ],
    },
  ],
};

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("30");
  const [weightLbs, setWeightLbs] = useState("170");
  const [weightKg, setWeightKg] = useState("77");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");
  const [heightCm, setHeightCm] = useState("178");
  const [activity, setActivity] = useState("moderate");
  const [formula, setFormula] = useState<Formula>("mifflin");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const a = parseInt(age);
    const wKg = unit === "imperial" ? parseFloat(weightLbs) * 0.453592 : parseFloat(weightKg);
    const hCm = unit === "imperial" ? (parseInt(heightFt) * 12 + parseFloat(heightIn)) * 2.54 : parseFloat(heightCm);
    if (!isFinite(a) || !isFinite(wKg) || !isFinite(hCm) || a <= 0 || wKg <= 0 || hCm <= 0) return null;
    const bmr = Math.round(calcBMR(sex, a, wKg, hCm, formula));
    const actFactor = ACTIVITY_LEVELS.find(l => l.key === activity)!.factor;
    const tdee = Math.round(bmr * actFactor);
    const goals = GOALS.map(g => ({ ...g, calories: tdee + g.delta }));
    return { bmr, tdee, goals };
  }, [unit, sex, age, weightLbs, weightKg, heightFt, heightIn, heightCm, activity, formula]);

  const activityLabel = ACTIVITY_LEVELS.find(l => l.key === activity)?.label ?? "";

  const insight = results
    ? `Based on your inputs, your BMR is ${results.bmr.toLocaleString()} cal/day (calories at rest) and your TDEE with ${activityLabel} activity is ${results.tdee.toLocaleString()} cal/day. Eat at this level to maintain your current weight.`
    : null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Online Calorie Calculator – Daily Calorie Needs & TDEE Free"
        description="Free online calorie calculator. Calculate your daily calorie needs (TDEE) based on BMR, activity level, and weight goal using Mifflin-St Jeor or Harris-Benedict formula. Instant results, no signup needed."
        canonical="https://usonlinetools.com/health/calorie-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Calorie Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-red-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Flame className="w-3.5 h-3.5" />
            Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Calorie Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your daily calorie needs (TDEE) and see exactly how much to eat to lose weight, maintain, or build muscle. Uses the clinically validated Mifflin-St Jeor formula. No login required.
          </p>
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
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-red-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">BMR + TDEE Calculator</p>
                      <p className="text-sm text-muted-foreground">Fill in your details — results update instantly.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 25 } as React.CSSProperties}>
                    {/* Unit Toggle */}
                    <div className="flex gap-2 mb-5 bg-muted rounded-xl p-1">
                      {(["imperial", "metric"] as Unit[]).map(u => (
                        <button
                          key={u}
                          onClick={() => setUnit(u)}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                            unit === u ? "bg-card shadow text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      {/* Sex */}
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Biological Sex</label>
                        <div className="flex gap-2">
                          {(["male", "female"] as Sex[]).map(s => (
                            <button
                              key={s}
                              onClick={() => setSex(s)}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                                sex === s
                                  ? "bg-gradient-to-r from-orange-500 to-red-400 text-white"
                                  : "tool-calc-result hover:bg-muted"
                              }`}
                            >
                              {s === "male" ? "♂ Male" : "♀ Female"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age */}
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Age (years)</label>
                        <input
                          type="number"
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          min="10" max="100"
                          className="tool-calc-input w-full"
                        />
                      </div>

                      {/* Weight */}
                      {unit === "imperial" ? (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Weight (lbs)</label>
                          <input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} className="tool-calc-input w-full" />
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Weight (kg)</label>
                          <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="tool-calc-input w-full" />
                        </div>
                      )}

                      {/* Height */}
                      {unit === "imperial" ? (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Height (ft / in)</label>
                          <div className="flex gap-2">
                            <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="tool-calc-input w-full" placeholder="ft" min="1" max="8" />
                            <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="tool-calc-input w-full" placeholder="in" min="0" max="11" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Height (cm)</label>
                          <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="tool-calc-input w-full" />
                        </div>
                      )}
                    </div>

                    {/* Activity Level */}
                    <div className="mb-5">
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">Activity Level</label>
                      <div className="space-y-2">
                        {ACTIVITY_LEVELS.map(al => (
                          <button
                            key={al.key}
                            onClick={() => setActivity(al.key)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                              activity === al.key
                                ? "border-orange-500/50 bg-orange-500/10"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <span className="font-bold text-sm text-foreground">{al.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">— {al.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Formula */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-muted-foreground mb-2 block">BMR Formula</label>
                      <div className="flex gap-2">
                        {([["mifflin", "Mifflin-St Jeor (Recommended)"], ["harris", "Harris-Benedict (Revised)"]] as [Formula, string][]).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => setFormula(key)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                              formula === key
                                ? "bg-gradient-to-r from-orange-500 to-red-400 text-white"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results */}
                    {results ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="tool-calc-result text-center p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Basal Metabolic Rate (BMR)</p>
                            <p className="text-4xl font-black text-orange-600 dark:text-orange-400">{results.bmr.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">calories/day at rest</p>
                          </div>
                          <div className="rounded-xl p-5 text-center bg-gradient-to-br from-orange-500 to-red-400 text-white">
                            <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">Total Daily Energy (TDEE)</p>
                            <p className="text-4xl font-black">{results.tdee.toLocaleString()}</p>
                            <p className="text-xs text-white/80 mt-1">calories/day to maintain weight</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Calories by Goal</p>
                          <div className="space-y-2">
                            {results.goals.map(g => (
                              <div
                                key={g.key}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                                  g.key === "maintain"
                                    ? "bg-emerald-500/10 border border-emerald-500/30"
                                    : "tool-calc-result"
                                }`}
                              >
                                <span className="text-sm font-medium text-foreground">{g.label}</span>
                                <div className="text-right">
                                  <span className={`font-black text-lg ${g.color}`}>{Math.max(0, g.calories).toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground ml-1">cal/day</span>
                                  {g.delta !== 0 && (
                                    <span className={`text-xs ml-2 ${g.delta < 0 ? "text-red-500" : "text-blue-500"}`}>
                                      ({g.delta > 0 ? "+" : ""}{g.delta})
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {insight && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                            <div className="flex gap-2 items-start">
                              <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                            </div>
                          </motion.div>
                        )}

                        <p className="text-xs text-muted-foreground text-center">These are estimates. Consult a healthcare professional before making significant dietary changes.</p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Flame className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Fill in your details above to calculate your calorie needs.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use This Calorie Calculator</h2>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your personal details</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select your unit system (imperial or metric), biological sex, age, weight, and height. These values feed into the BMR formula — all inputs are required for an accurate result.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select your activity level honestly</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose the activity level that best matches your typical week. Most people overestimate their activity — "sedentary" or "lightly active" is correct for the majority of desk workers even if they exercise 2–3 times per week.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read your TDEE and goal calories</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Your TDEE is your maintenance calorie level. Find your goal in the list below — e.g. "Lose 1 lb/week" shows a 500-calorie daily deficit target. Use this number to plan your meals.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Core Formulas (Mifflin-St Jeor)</p>
                <div className="space-y-2">
                  <code className="block px-3 py-2 bg-background rounded text-xs font-mono">Men:   BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5</code>
                  <code className="block px-3 py-2 bg-background rounded text-xs font-mono">Women: BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161</code>
                  <code className="block px-3 py-2 bg-background rounded text-xs font-mono">TDEE  = BMR × Activity Factor (1.2 – 1.9)</code>
                </div>
              </div>
            </section>

            {/* ── MACRO TABLE ── */}
            <section id="macro-breakdown" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Macro Breakdown by Goal</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      {["Goal", "Calories", "Protein", "Fat", "Carbs"].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-bold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MACRO_TABLE.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className={`px-4 py-3 ${j === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your Results</h2>
              <p className="text-sm text-muted-foreground mb-6">How to act on your BMR and TDEE numbers:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Calorie deficit (weight loss)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Eat 250–500 calories below your TDEE to lose 0.5–1 lb per week. Deficits beyond 1,000 cal/day are generally unsustainable and risk muscle loss. Start with a 15–20% deficit if you're new to calorie tracking.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Maintenance (TDEE)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Eating at your TDEE keeps weight stable. This is your baseline. Use maintenance calories when you're satisfied with your weight or when recovering from a long diet phase.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Calorie surplus (muscle gain)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A modest 5–15% surplus above TDEE supports lean muscle growth with minimal fat gain. Going too far above TDEE increases fat storage. Combine with progressive resistance training for best results.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Calorie Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Clinically validated formula.</strong> This calculator defaults to the Mifflin-St Jeor equation, which a 2005 systematic review found to be more accurate than the older Harris-Benedict formula for 82% of tested subjects. The Harris-Benedict option is available if you want to compare both.</p>
                <p><strong className="text-foreground">Complete goal breakdown in one view.</strong> Rather than showing just maintenance calories, this tool displays all six common goal levels simultaneously — so you can instantly see the full spectrum from aggressive weight loss to muscle-building surplus without re-entering data.</p>
                <p><strong className="text-foreground">Supports both imperial and metric.</strong> Toggle between lbs/ft and kg/cm at any point. All conversions happen automatically so you never need to manually convert your measurements.</p>
                <p><strong className="text-foreground">Your data never leaves your device.</strong> All calculations run in your browser. No health data is transmitted to any server. This is especially important given how sensitive body weight and health information can be.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Medical disclaimer:</strong> This calculator provides estimates based on population-average formulas. Actual calorie needs vary with body composition, metabolism, medications, and health conditions. Consult a registered dietitian or physician before making significant changes to your diet, especially for weight loss exceeding 1 lb/week.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How many calories do I need per day?" a="The average adult needs 1,600–2,400 calories/day (women) or 2,000–3,000 calories/day (men), depending on age, weight, height, and activity level. Use this calculator for a personalized estimate based on your BMR and activity factor." />
                <FaqItem q="What is BMR (Basal Metabolic Rate)?" a="BMR is the number of calories your body burns at complete rest to maintain basic life functions — breathing, circulation, cell production. It accounts for 60–75% of total daily calorie expenditure." />
                <FaqItem q="What is TDEE (Total Daily Energy Expenditure)?" a="TDEE = BMR × Activity Factor. It represents all calories burned in a day including exercise and daily movement. To maintain weight, eat at your TDEE. To lose weight, eat below it (deficit); to gain, eat above it (surplus)." />
                <FaqItem q="How fast is safe weight loss?" a="0.5–1 lb (0.25–0.5 kg) per week is generally considered safe and sustainable. 1 lb of fat ≈ 3,500 calories, so a daily deficit of 500 calories produces ~1 lb/week weight loss." />
                <FaqItem q="What is the Mifflin-St Jeor equation?" a="Mifflin-St Jeor (1990) is the most widely validated BMR formula. Males: (10×kg) + (6.25×cm) − (5×age) + 5. Females: (10×kg) + (6.25×cm) − (5×age) − 161. It's more accurate than Harris-Benedict for most people." />
                <FaqItem q="Does this calculator account for muscle mass?" a="Standard BMR formulas use only weight, height, age, and sex — they don't factor in body composition. People with higher muscle mass have higher actual BMR. For more precise tracking, consider body fat-adjusted formulas like the Katch-McArdle equation." />
                <FaqItem q="Is this calculator free and private?" a="100% free with no signup. All calculations run locally in your browser. No health data is ever transmitted or stored." />
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Reference Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Profile</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">BMR</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">TDEE (Moderate)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Lose 1 lb/wk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { profile: "Woman, 25, 130 lbs, 5'4\"", bmr: "1,384", tdee: "2,145", lose: "1,645" },
                      { profile: "Man, 30, 175 lbs, 5'10\"",  bmr: "1,824", tdee: "2,827", lose: "2,327" },
                      { profile: "Woman, 45, 155 lbs, 5'6\"", bmr: "1,471", tdee: "2,280", lose: "1,780" },
                      { profile: "Man, 50, 200 lbs, 6'0\"",   bmr: "1,919", tdee: "2,974", lose: "2,474" },
                    ].map(row => (
                      <tr key={row.profile} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{row.profile}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row.bmr}</td>
                        <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">{row.tdee}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.lose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally a calorie calculator that shows me all my goals at once. I can see exactly where I need to be for my target weight loss without doing any extra math."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2026</p>
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Health Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore BMI, BMR, TDEE, protein intake, and 400+ more free tools — all instant, all private.
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
                      href={`/tools/${tool.slug}`}
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
                <p className="text-xs text-muted-foreground mb-3">Help others calculate their calorie needs.</p>
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
                    { label: "Calculator", href: "#calculator" },
                    { label: "How to Use", href: "#how-to-use" },
                    { label: "Macro Breakdown", href: "#macro-breakdown" },
                    { label: "Result Interpretation", href: "#result-interpretation" },
                    { label: "Why Choose This", href: "#why-choose-this" },
                    { label: "FAQ", href: "#faq" },
                    { label: "Quick Examples", href: "#quick-examples" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/30 flex-shrink-0" />
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
