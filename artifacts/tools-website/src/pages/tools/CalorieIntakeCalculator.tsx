import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Apple, Flame, Scale, Info, Target, Activity,
  BadgeCheck, Zap, Lock, Shield, Smartphone,
  Copy, Check,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const ACTIVITY_LEVELS = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (1–3 days/week)", value: 1.375 },
  { label: "Moderately active (3–5 days/week)", value: 1.55 },
  { label: "Very active (6–7 days/week)", value: 1.725 },
  { label: "Extra active (physical job or 2x/day)", value: 1.9 },
];

const GOALS = [
  { label: "Lose weight (aggressive) — 1 kg/week", multiplier: -1100 },
  { label: "Lose weight (moderate) — 0.5 kg/week", multiplier: -550 },
  { label: "Lose weight (mild) — 0.25 kg/week", multiplier: -275 },
  { label: "Maintain current weight", multiplier: 0 },
  { label: "Build muscle (lean bulk) — slow gain", multiplier: 250 },
  { label: "Build muscle (regular bulk)", multiplier: 500 },
];

const RELATED_TOOLS = [
  { title: "BMR Calculator", href: "/health/bmr-calculator", color: "59 130 246", icon: <Activity className="w-4 h-4" />, benefit: "Resting metabolic rate" },
  { title: "Calorie Deficit", href: "/health/calorie-deficit-calculator", color: "249 115 22", icon: <Flame className="w-4 h-4" />, benefit: "Plan your calorie deficit" },
  { title: "TDEE Calculator", href: "/health/tdee-calculator", color: "20 184 166", icon: <Target className="w-4 h-4" />, benefit: "Total daily energy expenditure" },
  { title: "Macro Calculator", href: "/health/macro-nutrient-calculator", color: "168 85 247", icon: <Apple className="w-4 h-4" />, benefit: "Protein, carbs & fat targets" },
  { title: "BMI Calculator", href: "/health/bmi-calculator", color: "16 185 129", icon: <Scale className="w-4 h-4" />, benefit: "Body mass index calculator" },
];

const faqs = [
  {
    q: "How many calories should I eat per day?",
    a: "Your daily calorie intake depends on your age, sex, weight, height, activity level, and goal. Most adults need between 1,600 and 3,000 calories per day. This calculator uses the Mifflin-St Jeor equation — the most validated formula in nutritional science — to give you a personalized estimate.",
  },
  {
    q: "What is the difference between calorie intake and calorie burn?",
    a: "Calorie intake is the energy you consume through food and drinks. Calorie burn (TDEE) is the total energy your body expends through rest, movement, digestion, and exercise. The relationship between these two determines your weight: intake < burn = weight loss; intake > burn = weight gain; intake = burn = maintenance.",
  },
  {
    q: "Is counting calories effective for weight loss?",
    a: "Yes — multiple systematic reviews confirm that caloric awareness is one of the most reliable predictors of weight loss success. Even rough tracking is beneficial. The key is consistency over precision: you don't need to be exact to the calorie, just stay in a general range over weeks.",
  },
  {
    q: "Should I eat the same calories every day?",
    a: "Not necessarily. Many people find cycling calories useful — eating slightly more on workout days and less on rest days. As long as your weekly average aligns with your goal, daily variation is fine and can actually improve adherence and metabolic flexibility.",
  },
  {
    q: "What are empty calories?",
    a: "Empty calories come from foods that are high in energy but low in nutrients — ultra-processed foods, sugary drinks, alcohol. While they count toward your daily total, they don't provide meaningful protein, fiber, vitamins, or minerals. Prioritizing nutrient-dense foods makes it easier to stay full within your calorie target.",
  },
  {
    q: "How often should I recalculate my calorie intake?",
    a: "Recalculate every 4–6 weeks or after losing/gaining more than 2–3 kg. As your weight changes, your TDEE changes too. Without adjusting, progress tends to plateau. Also update if your activity level significantly changes (e.g., starting a new job or training program).",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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

export default function CalorieIntakeCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState(1.55);
  const [goalOffset, setGoalOffset] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    let w = parseFloat(weight);
    let h = 0;
    if (unit === "metric") {
      h = parseFloat(height);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      h = ft * 30.48 + inches * 2.54;
      w = w * 0.453592;
    }
    if (!a || !w || !h || a <= 0 || w <= 0 || h <= 0) return null;

    const bmr = sex === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = Math.round(bmr * activity);
    const target = tdee + goalOffset;
    const protein = Math.round((target * 0.3) / 4);
    const carbs = Math.round((target * 0.4) / 4);
    const fat = Math.round((target * 0.3) / 9);

    return {
      bmr: Math.round(bmr),
      tdee,
      target,
      protein,
      carbs,
      fat,
      goalLabel: GOALS.find((g) => g.multiplier === goalOffset)?.label ?? "",
    };
  }, [age, sex, weight, height, heightFt, heightIn, unit, activity, goalOffset]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Calorie Intake Calculator – How Many Calories Should I Eat?"
        description="Find your ideal daily calorie intake for weight loss, maintenance, or muscle gain. Personalized results using the Mifflin-St Jeor formula with macro breakdown."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Calorie Intake Calculator</span>
        </nav>

        {/* Hero */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Apple className="w-3.5 h-3.5" />
            Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Calorie Intake Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find out exactly how many calories you should eat per day based on your body, activity level, and goal.
            Uses the Mifflin-St Jeor equation — the gold standard in nutritional science. Includes macro breakdown and per-meal planning.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Average adult daily need", value: "2,000–2,500", sub: "calories/day" },
              { label: "Energy in 1 kg of body fat", value: "7,700", sub: "calories" },
              { label: "Protein & carbs energy", value: "4 cal/g", sub: "per gram" },
              { label: "Fat energy density", value: "9 cal/g", sub: "per gram" },
            ].map((s) => (
              <div key={s.label} className="bg-card/80 border border-emerald-500/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none mb-1">{s.value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{s.sub}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">

            {/* Calculator Widget */}
            <section id="calculator">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <Apple className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mifflin-St Jeor Method</p>
                      <p className="text-sm text-muted-foreground">Fill in your details — results update instantly.</p>
                    </div>
                  </div>

                  {/* Unit Toggle */}
                  <div className="flex gap-2">
                    {(["metric", "imperial"] as const).map((u) => (
                      <button key={u} onClick={() => setUnit(u)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${unit === u ? "bg-emerald-500 text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Age (years)</label>
                      <input type="number" min="15" max="100" value={age} onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 28" className="tool-calc-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Biological sex</label>
                      <div className="flex gap-2">
                        {(["male", "female"] as const).map((s) => (
                          <button key={s} onClick={() => setSex(s)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${sex === s ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300" : "bg-card border-border text-muted-foreground hover:border-emerald-500/30"}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                      <input type="number" min="30" max="400" value={weight} onChange={(e) => setWeight(e.target.value)}
                        placeholder={unit === "metric" ? "e.g. 70" : "e.g. 155"} className="tool-calc-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Height ({unit === "metric" ? "cm" : "ft / in"})</label>
                      {unit === "metric" ? (
                        <input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)}
                          placeholder="e.g. 170" className="tool-calc-input" />
                      ) : (
                        <div className="flex gap-2">
                          <input type="number" min="4" max="8" value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                            placeholder="ft" className="tool-calc-input w-24" />
                          <input type="number" min="0" max="11" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                            placeholder="in" className="tool-calc-input w-24" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Activity level</label>
                    <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="tool-calc-input">
                      {ACTIVITY_LEVELS.map((al) => (
                        <option key={al.value} value={al.value}>{al.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Your goal</label>
                    <select value={goalOffset} onChange={(e) => setGoalOffset(parseInt(e.target.value))} className="tool-calc-input">
                      {GOALS.map((g) => (
                        <option key={g.multiplier} value={g.multiplier}>{g.label}</option>
                      ))}
                    </select>
                  </div>

                  <AnimatePresence>
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        {/* Main result */}
                        <div className="tool-calc-result bg-emerald-500/5 border-emerald-500/20 text-center">
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1 flex items-center justify-center gap-1.5">
                            <Apple className="w-4 h-4" /> Daily Calorie Intake Target
                          </p>
                          <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                            {result.target.toLocaleString()}
                            <span className="text-2xl font-semibold ml-1">cal/day</span>
                          </p>
                          <p className="text-sm text-emerald-500/80 dark:text-emerald-400/60 mt-1">{result.goalLabel}</p>
                        </div>

                        {/* BMR / TDEE / Offset grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "BMR", value: result.bmr.toLocaleString(), sub: "at rest", icon: <Scale className="w-4 h-4" /> },
                            { label: "TDEE", value: result.tdee.toLocaleString(), sub: "maintenance", icon: <Flame className="w-4 h-4" /> },
                            { label: "Adjustment", value: `${goalOffset >= 0 ? "+" : ""}${goalOffset}`, sub: "cal/day offset", icon: <Info className="w-4 h-4" /> },
                          ].map((item) => (
                            <div key={item.label} className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-center">
                              <div className="text-emerald-500 flex justify-center mb-1">{item.icon}</div>
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="text-lg font-black text-foreground">{item.value}</p>
                              <p className="text-xs text-muted-foreground/60">{item.sub}</p>
                            </div>
                          ))}
                        </div>

                        {/* Macro Breakdown */}
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                          <p className="text-sm font-bold text-foreground mb-3">Suggested macros (30% protein / 40% carbs / 30% fat)</p>
                          <div className="space-y-3">
                            {[
                              { name: "Protein", grams: result.protein, cal: result.protein * 4, color: "bg-blue-500", pct: 30 },
                              { name: "Carbohydrates", grams: result.carbs, cal: result.carbs * 4, color: "bg-amber-400", pct: 40 },
                              { name: "Fat", grams: result.fat, cal: result.fat * 9, color: "bg-rose-400", pct: 30 },
                            ].map((m) => (
                              <div key={m.name} className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground w-24 shrink-0">{m.name}</span>
                                <div className="flex-1 bg-border/50 rounded-full h-2.5 overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                                    transition={{ duration: 0.5 }} className={`h-2.5 rounded-full ${m.color}`} />
                                </div>
                                <span className="text-sm font-bold text-foreground w-16 text-right">{m.grams}g</span>
                                <span className="text-xs text-muted-foreground w-16">{m.cal} cal</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Per meal breakdown */}
                        <div className="bg-card border border-border rounded-xl p-4">
                          <p className="text-sm font-bold text-foreground mb-3">Per meal breakdown</p>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            {[3, 4, 5].map((meals) => (
                              <div key={meals} className="bg-muted/40 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">{meals} meals/day</p>
                                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{Math.round(result.target / meals).toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground/60">cal/meal</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {result.target < 1200 && (
                          <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Warning: Target below 1,200 cal/day. Consider a less aggressive goal or consult a healthcare professional.</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">How It Works</h2>
              <p className="text-muted-foreground text-sm mb-6">A four-step process based on peer-reviewed nutritional science.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    step: "1",
                    title: "Calculate BMR",
                    desc: "Basal Metabolic Rate — the calories your body burns at complete rest. Mifflin-St Jeor formula: (10 × weight) + (6.25 × height) − (5 × age) ± sex constant.",
                    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    step: "2",
                    title: "Apply Activity Multiplier",
                    desc: "Your BMR is multiplied by an activity factor (1.2–1.9) based on how much you exercise. This gives your TDEE — total daily energy expenditure.",
                    color: "bg-green-500/10 text-green-600 dark:text-green-400",
                  },
                  {
                    step: "3",
                    title: "Adjust for Your Goal",
                    desc: "A calorie offset is added or subtracted based on your goal. Losing weight = deficit (−275 to −1,100 cal). Gaining muscle = surplus (+250 to +500 cal).",
                    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
                  },
                  {
                    step: "4",
                    title: "Get Your Target",
                    desc: "Your final daily calorie target, plus a suggested macro split (30% protein, 40% carbs, 30% fat) and per-meal breakdown — ready to use immediately.",
                    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
                  },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/20">
                    <div className={`w-9 h-9 rounded-full ${s.color} flex items-center justify-center font-black text-base flex-shrink-0`}>
                      {s.step}
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Goal Reference Table */}
            <section id="goal-guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Calorie Targets by Goal</h2>
              <p className="text-muted-foreground text-sm mb-6">Standard adjustments relative to your TDEE maintenance calories.</p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Goal</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Adjustment</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Expected Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Aggressive weight loss", "TDEE − 1,100 cal", "~1 kg / week"],
                      ["Moderate weight loss", "TDEE − 550 cal", "~0.5 kg / week"],
                      ["Mild weight loss", "TDEE − 275 cal", "~0.25 kg / week"],
                      ["Maintenance", "TDEE", "±0 kg / week"],
                      ["Lean bulk", "TDEE + 250 cal", "~0.1–0.15 kg / week"],
                      ["Regular bulk", "TDEE + 500 cal", "~0.25 kg / week"],
                    ].map(([goal, adj, rate]) => (
                      <tr key={goal} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-foreground font-semibold">{goal}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{adj}</td>
                        <td className="px-4 py-3 text-muted-foreground">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tips */}
            <section id="tips" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Tips for Hitting Your Target</h2>
              <p className="text-muted-foreground text-sm mb-6">Science-backed strategies to stay consistent without constant willpower.</p>
              <div className="space-y-3">
                {[
                  {
                    title: "Use a food scale for 2 weeks",
                    text: "Most people significantly underestimate portion sizes without weighing food at least once. Two weeks of data builds accurate mental models that last for years.",
                    color: "bg-emerald-500/5 border-emerald-500/20",
                    dot: "bg-emerald-500",
                  },
                  {
                    title: "Front-load protein",
                    text: "Eating protein early in the day improves satiety and reduces overall calorie intake at later meals. Aim for 25–35 g of protein at breakfast.",
                    color: "bg-green-500/5 border-green-500/20",
                    dot: "bg-green-500",
                  },
                  {
                    title: "Prepare low-calorie volume foods",
                    text: "Salads, soups, and cruciferous vegetables fill your plate without blowing your calorie budget. They also provide fiber that promotes satiety.",
                    color: "bg-teal-500/5 border-teal-500/20",
                    dot: "bg-teal-500",
                  },
                  {
                    title: "Don't drink your calories",
                    text: "Liquid calories (juice, alcohol, lattes) add up quickly and don't suppress hunger the way solid food does. Switch to water, tea, or black coffee.",
                    color: "bg-cyan-500/5 border-cyan-500/20",
                    dot: "bg-cyan-500",
                  },
                  {
                    title: "Plan for weekends",
                    text: "Many people eat 500–1,000 extra calories on Friday–Sunday, wiping out weekday deficits. A loose weekend plan prevents this without eliminating enjoyment.",
                    color: "bg-sky-500/5 border-sky-500/20",
                    dot: "bg-sky-500",
                  },
                ].map(({ title, text, color, dot }) => (
                  <div key={title} className={`flex items-start gap-4 p-4 rounded-xl border ${color}`}>
                    <div className={`w-3 h-3 rounded-full ${dot} flex-shrink-0 mt-1.5`} />
                    <div>
                      <p className="font-bold text-foreground mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Use This */}
            <section id="why-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use This Calculator?</h2>
              <p className="text-muted-foreground text-sm mb-6">Built for accuracy, designed for real-life use.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Mifflin-St Jeor formula", desc: "The most clinically validated BMR equation, consistently outperforming older methods like Harris-Benedict in peer-reviewed studies." },
                  { title: "Metric & Imperial", desc: "Full support for kg/cm and lb/ft with automatic conversion — no manual math required." },
                  { title: "Macro breakdown", desc: "Get protein, carb, and fat targets in grams based on your calorie goal, not just percentages." },
                  { title: "Per-meal planning", desc: "Instantly see how your daily target splits into 3, 4, or 5 meals — ready for meal prep." },
                  { title: "6 goal options", desc: "From aggressive weight loss (−1 kg/week) to regular bulking (+0.25 kg/week) — covers any scenario." },
                  { title: "Instant & private", desc: "Results update live as you type. Nothing is sent to any server — your data never leaves your browser." },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                    <div>
                      <p className="font-bold text-foreground mb-1">{f.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Build a Complete Nutrition Plan</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Pair this with our Calorie Deficit Calculator for weight management or the Macro Calculator for detailed nutrient targets.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/health/calorie-deficit-calculator"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                  >
                    Calorie Deficit Calculator <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/category/health"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:-translate-y-0.5 transition-transform border border-white/20"
                  >
                    All Health Tools
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `rgb(${tool.color} / 0.12)`, color: `rgb(${tool.color})` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others find their calorie target.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    { label: "Overview", href: "#overview" },
                    { label: "Calculator", href: "#calculator" },
                    { label: "How It Works", href: "#how-it-works" },
                    { label: "Goal Guide", href: "#goal-guide" },
                    { label: "Tips", href: "#tips" },
                    { label: "Why Use This", href: "#why-use" },
                    { label: "FAQ", href: "#faq" },
                  ].map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Calorie Quick Facts */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3">Calorie Quick Facts</h3>
                <div className="space-y-2">
                  {[
                    { label: "1 lb fat", value: "~3,500 cal" },
                    { label: "1 kg fat", value: "~7,700 cal" },
                    { label: "Protein (per g)", value: "4 cal" },
                    { label: "Carbs (per g)", value: "4 cal" },
                    { label: "Fat (per g)", value: "9 cal" },
                    { label: "Alcohol (per g)", value: "7 cal" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-0.5">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{value}</span>
                    </div>
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
