import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Activity, Flame, Timer,
  ArrowRight, BookOpen, Target, Heart, Droplets,
} from "lucide-react";

// MET values from Ainsworth's Compendium of Physical Activities
const WALKING_TYPES = [
  { label: "Slow stroll (2 km/h / 1.3 mph)", met: 2.0 },
  { label: "Casual walk (3.2 km/h / 2 mph)", met: 2.8 },
  { label: "Moderate walk (4 km/h / 2.5 mph)", met: 3.0 },
  { label: "Brisk walk (5 km/h / 3.1 mph)", met: 3.5 },
  { label: "Fast walk (6.4 km/h / 4 mph)", met: 5.0 },
  { label: "Power walk (8 km/h / 5 mph)", met: 6.0 },
  { label: "Uphill walking (moderate grade)", met: 5.3 },
  { label: "Walking with backpack (heavy)", met: 5.0 },
  { label: "Treadmill (3.5 mph, 0% incline)", met: 4.0 },
  { label: "Treadmill (3.5 mph, 5% incline)", met: 5.0 },
];

const INTENSITY_TIERS = [
  { label: "Light", met: "< 3.0 METs", color: "blue", dot: "bg-blue-500", desc: "Slow strolls and casual walking. Improves circulation and is suitable for all fitness levels including recovery days and elderly individuals." },
  { label: "Moderate", met: "3.0 – 4.5 METs", color: "green", dot: "bg-green-500", desc: "Brisk walking at 4–5 km/h. Reaches the aerobic threshold for most adults and meets WHO's 150 min/week moderate activity guideline." },
  { label: "Vigorous", met: "4.5 – 6.0 METs", color: "orange", dot: "bg-orange-500", desc: "Fast and power walking. Equivalent aerobic benefit to jogging for many people. Burns 2× more calories per minute than casual walking." },
  { label: "High Intensity", met: "> 6.0 METs", color: "red", dot: "bg-red-500", desc: "Race walking and heavy uphill walking. Approaches running-level intensity. Engages core and upper body significantly for added calorie burn." },
];

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-lime-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-lime-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "TDEE Calculator", slug: "tdee-calculator", icon: <Flame className="w-5 h-5" />, color: 0, benefit: "Total daily calorie needs" },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Activity className="w-5 h-5" />, color: 200, benefit: "Check your Body Mass Index" },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Resting metabolic rate" },
  { title: "Running Pace Calculator", slug: "running-pace-calculator", icon: <Target className="w-5 h-5" />, color: 25, benefit: "Calculate pace, time & distance" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Droplets className="w-5 h-5" />, color: 210, benefit: "Daily hydration goal" },
];

export default function WalkingCaloriesCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [walkType, setWalkType] = useState(3.5);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const result = useMemo(() => {
    let w = parseFloat(weight);
    const mins = parseFloat(duration);
    if (!w || !mins || w <= 0 || mins <= 0) return null;
    if (unit === "imperial") w = w * 0.453592;

    const hours = mins / 60;
    const calories = Math.round(walkType * w * hours);
    const steps = Math.round(mins * 100); // ~100 steps/min at moderate pace
    const distance = Math.round(mins * (walkType / 60) * 10) / 10; // rough km

    return {
      calories,
      steps,
      caloriesPerMin: Math.round((calories / mins) * 10) / 10,
      caloriesPerHour: Math.round(calories * (60 / mins)),
      minutesFor500Cal: Math.round(500 / (calories / mins)),
      distance,
    };
  }, [weight, duration, walkType, unit]);

  return (
    <Layout>
      <SEO
        title="Walking Calories Calculator – How Many Calories Does Walking Burn?"
        description="Calculate exactly how many calories you burn walking based on your weight, speed, and duration. Uses MET values from Ainsworth's Compendium of Physical Activities. Free, instant, no signup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <span className="text-foreground">Walking Calories Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Activity className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Walking Calories Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find out exactly how many calories you burn walking based on your weight, speed, and duration. Uses MET values from Ainsworth's Compendium — the gold standard for exercise calorie estimation.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "lime" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; Data: Ainsworth's Compendium of Physical Activities &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "3–8 cal", label: "burned per minute of walking", icon: <Flame className="w-5 h-5" /> },
            { value: "10,000", label: "steps ≈ 400–500 calories for avg adult", icon: <Target className="w-5 h-5" /> },
            { value: "30–50%", label: "more calories burned walking uphill", icon: <Activity className="w-5 h-5" /> },
            { value: "MET", label: "system validates this calculator's accuracy", icon: <BookOpen className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-lime-500/15 bg-lime-500/5 p-5 text-center">
              <div className="flex justify-center mb-2 text-lime-600 dark:text-lime-400">{s.icon}</div>
              <p className="text-2xl font-black text-foreground mb-1">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ainsworth MET Formula</p>
                      <p className="text-sm text-muted-foreground">Enter your details to calculate calories burned instantly.</p>
                    </div>
                  </div>

                  {/* Unit toggle */}
                  <div className="flex gap-2">
                    {(["metric", "imperial"] as const).map(u => (
                      <button key={u} onClick={() => setUnit(u)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${unit === u ? "bg-lime-500 text-white border-lime-500" : "border-border text-muted-foreground hover:border-lime-500/50"}`}>
                        {u === "metric" ? "Metric (kg)" : "Imperial (lbs)"}
                      </button>
                    ))}
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Your Weight ({unit === "metric" ? "kg" : "lbs"})
                      </label>
                      <input type="number" min="30" max="400" value={weight}
                        onChange={e => setWeight(e.target.value)}
                        placeholder={unit === "metric" ? "e.g. 70" : "e.g. 155"}
                        className="tool-calc-input w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Duration (minutes)</label>
                      <input type="number" min="1" max="600" value={duration}
                        onChange={e => setDuration(e.target.value)}
                        placeholder="e.g. 30"
                        className="tool-calc-input w-full" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Walking Type / Speed</label>
                      <select value={walkType} onChange={e => setWalkType(parseFloat(e.target.value))} className="tool-calc-input w-full">
                        {WALKING_TYPES.map(t => (
                          <option key={t.met} value={t.met}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Results */}
                  <AnimatePresence>
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 pt-2">
                        {/* Main result */}
                        <div className="p-5 rounded-xl bg-lime-500/5 border border-lime-500/20 text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400 mb-2 flex items-center justify-center gap-1.5">
                            <Flame className="w-4 h-4" /> Calories Burned
                          </p>
                          <p className="text-6xl font-black text-lime-600 dark:text-lime-400">{result.calories.toLocaleString()}</p>
                          <p className="text-base text-lime-500 dark:text-lime-500 font-bold mt-1">calories</p>
                        </div>

                        {/* Breakdown grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "Cal/min", value: result.caloriesPerMin, icon: <Timer className="w-4 h-4" /> },
                            { label: "Cal/hour", value: result.caloriesPerHour, icon: <Flame className="w-4 h-4" /> },
                            { label: "Est. steps", value: result.steps.toLocaleString(), icon: <Activity className="w-4 h-4" /> },
                            { label: "Min for 500 cal", value: result.minutesFor500Cal, icon: <Timer className="w-4 h-4" /> },
                          ].map(item => (
                            <div key={item.label} className="p-3 rounded-xl bg-muted/60 border border-border text-center">
                              <div className="text-lime-500 flex justify-center mb-1">{item.icon}</div>
                              <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                              <p className="text-lg font-black text-foreground">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Pace comparison bar chart */}
                        <div className="rounded-xl border border-border bg-muted/40 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            Calorie comparison across walking paces ({duration} min)
                          </p>
                          <div className="space-y-2">
                            {WALKING_TYPES.slice(0, 6).map(t => {
                              const w = parseFloat(weight) * (unit === "imperial" ? 0.453592 : 1);
                              const cal = Math.round(t.met * w * (parseFloat(duration) / 60));
                              const maxCal = Math.round(WALKING_TYPES[5].met * w * (parseFloat(duration) / 60));
                              return (
                                <div key={t.met} className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{t.label.split("(")[0].trim()}</span>
                                  <div className="flex-1 bg-muted rounded-full h-3">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(cal / maxCal) * 100}%` }}
                                      transition={{ duration: 0.5 }}
                                      className={`h-3 rounded-full ${t.met === walkType ? "bg-lime-500" : "bg-lime-300 dark:bg-lime-700"}`}
                                    />
                                  </div>
                                  <span className={`text-sm font-bold w-14 text-right ${t.met === walkType ? "text-lime-600 dark:text-lime-400" : "text-muted-foreground"}`}>
                                    {cal} cal
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Walking Calories</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Calorie burn during walking depends primarily on three factors: body weight, walking intensity, and duration. This calculator uses the MET (Metabolic Equivalent of Task) system — the same method used by sports scientists and clinical researchers.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Enter your body weight", body: "Body weight is the biggest driver of calorie burn — heavier individuals burn more calories at the same pace. Enter your weight in kg or lbs and toggle the unit. The formula converts automatically." },
                  { title: "Set your walking duration", body: "Enter total minutes of continuous walking. For multiple walks in a day, calculate each separately and add the results together for your daily total." },
                  { title: "Select your walking type", body: "Different walking intensities have different MET values. A slow stroll (2.0 METs) burns roughly one-third the calories of power walking (6.0 METs). Uphill and treadmill options reflect real-world intensity differences." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">The Formula</p>
                <code className="block px-3 py-2 bg-background rounded text-xs font-mono mb-3">
                  Calories = MET × Weight (kg) × Time (hours)
                </code>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  MET values from Ainsworth's Compendium range from 2.0 (slow stroll) to 6.0 (power walk). A MET of 1.0 equals sitting at rest. Walking at 3.5 METs burns 3.5× more calories than sitting for the same duration.
                </p>
              </div>
            </section>

            {/* ── INTENSITY GUIDE ── */}
            <section id="intensity-guide">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Walking Intensity Levels</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Not all walking is equal. Here's how MET values map to health benefits and calorie burn across intensity levels.
              </p>
              <div className="space-y-3">
                {INTENSITY_TIERS.map((tier) => (
                  <div key={tier.label} className="rounded-xl border border-border bg-card p-4 flex gap-4 items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${tier.dot}`} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-foreground">{tier.label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${tier.color}-500/10 text-${tier.color}-600 dark:text-${tier.color}-400`}>{tier.met}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Walking for Weight Loss — Reference Table</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Estimated weekly calorie burn and weight loss potential for common daily walking goals. Values based on a 70 kg (154 lb) person walking at brisk pace.
              </p>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Daily Walking Goal</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Cal/Session</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Cal/Week</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Weight Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { goal: "15 min brisk walk", session: "~90 cal", week: "~630 cal", loss: "~0.08 kg/wk" },
                      { goal: "30 min brisk walk", session: "~175 cal", week: "~1,225 cal", loss: "~0.16 kg/wk" },
                      { goal: "45 min brisk walk", session: "~265 cal", week: "~1,855 cal", loss: "~0.24 kg/wk" },
                      { goal: "60 min brisk walk", session: "~350 cal", week: "~2,450 cal", loss: "~0.31 kg/wk" },
                      { goal: "10,000 steps (~75 min)", session: "~440 cal", week: "~3,080 cal", loss: "~0.39 kg/wk" },
                      { goal: "60 min power walk", session: "~500 cal", week: "~3,500 cal", loss: "~0.45 kg/wk" },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{row.goal}</td>
                        <td className="px-4 py-3 font-bold text-lime-600 dark:text-lime-400">{row.session}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.week}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.loss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE ── */}
            <section id="why-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Walking Calories Calculator?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Generic calorie estimates from fitness apps are often off by 20–40%. This calculator uses validated MET data for more accurate results.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Target className="w-5 h-5" />, title: "Weight-Adjusted Accuracy", desc: "Calorie burn scales directly with body weight. A 100 kg person burns 40% more calories than a 70 kg person at the same pace — this calculator accounts for that.", color: "lime" },
                  { icon: <Activity className="w-5 h-5" />, title: "10 Walking Speed Options", desc: "From a slow stroll to power walking, uphill, and treadmill variants — choose the type that matches your actual activity for a more precise estimate.", color: "green" },
                  { icon: <Flame className="w-5 h-5" />, title: "Visual Pace Comparison", desc: "See at a glance how much more you'd burn by picking up the pace. The bar chart shows all 6 main speed options side-by-side for your current inputs.", color: "orange" },
                  { icon: <Timer className="w-5 h-5" />, title: "Goal-Oriented Metrics", desc: "Results show calories per minute, per hour, estimated steps, and how many minutes it would take to burn 500 calories — actionable numbers for planning workouts.", color: "blue" },
                  { icon: <BadgeCheck className="w-5 h-5" />, title: "Clinical MET Data", desc: "MET values from Ainsworth's Compendium of Physical Activities are used in published research and clinical settings — far more reliable than generic app estimates.", color: "violet" },
                  { icon: <Shield className="w-5 h-5" />, title: "100% Private", desc: "No account needed. Your weight and health data never leave your device. All calculations are performed locally in your browser.", color: "slate" },
                ].map((f, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${f.color}-500/10 text-${f.color}-500 flex items-center justify-center flex-shrink-0`}>{f.icon}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{f.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "How many calories does walking burn?", a: "Walking burns approximately 3–8 calories per minute depending on your weight, speed, and terrain. A 70 kg (154 lb) person walking briskly for 30 minutes burns roughly 150–200 calories. The biggest factor is body weight — heavier individuals burn significantly more calories at the same pace." },
                { q: "Does walking uphill burn more calories?", a: "Yes, significantly. Walking uphill increases calorie burn by 30–50% compared to flat walking at the same pace. A 5% treadmill incline boosts calorie expenditure by about 40%. Hill walking also engages more muscle groups including glutes, hamstrings, and calves more intensely." },
                { q: "How does walking compare to running for calorie burn?", a: "Running burns more calories per minute (due to higher intensity), but walking burns more calories per kilometer/mile. At the same distance, running and walking burn similar total calories — running just gets you there faster. For total daily energy expenditure, more steps at any pace is what matters most." },
                { q: "What is a MET value?", a: "MET (Metabolic Equivalent of Task) is a unit measuring exercise intensity. Sitting quietly is 1 MET. Walking at 4 km/h is about 3 METs — meaning it burns 3 times more calories than sitting. Calorie burn = MET × weight (kg) × time (hours). This calculator uses MET values from Ainsworth's Compendium of Physical Activities." },
                { q: "How many steps burn 500 calories?", a: "Approximately 10,000–12,500 steps burn 400–500 calories for an average 70 kg person. This varies significantly with walking speed, terrain, and individual factors. Step length matters too — taller people with longer strides cover more distance per step, burning slightly more per step at equivalent pace." },
                { q: "Is walking enough exercise to lose weight?", a: "Yes, walking can absolutely support weight loss when paired with a modest calorie deficit. A daily 30-minute brisk walk burns roughly 150–200 extra calories per day — about 1,000–1,400 extra calories per week. Combined with a small dietary adjustment, this creates meaningful, sustainable progress." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-lime-500/10 via-card to-green-500/10 border border-lime-500/20 p-8 text-center">
              <h2 className="text-2xl font-black text-foreground mb-2">Go Further — Track Your Running Too</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Ready to move faster? Calculate your running pace, projected race finish times, and training zones with the Running Pace Calculator.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/running-pace-calculator"
                  className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  Running Pace Calculator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/health"
                  className="inline-flex items-center gap-2 bg-card hover:bg-muted text-foreground font-bold px-6 py-3 rounded-xl border border-border transition-colors">
                  All Health Tools
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color} 80% 50% / 0.1)`, color: `hsl(${t.color} 70% 45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-lime-500 text-white font-bold text-sm hover:bg-lime-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
                <nav className="space-y-1">
                  {[
                    { label: "Overview", href: "#overview" },
                    { label: "Calculator", href: "#calculator" },
                    { label: "How It Works", href: "#how-it-works" },
                    { label: "Intensity Levels", href: "#intensity-guide" },
                    { label: "Weight Loss Table", href: "#examples" },
                    { label: "Why Use This", href: "#why-use" },
                    { label: "FAQ", href: "#faq" },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className="block text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1.5 rounded-lg transition-colors">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Reference */}
              <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400 mb-3">Quick Reference</p>
                <div className="space-y-2">
                  {[
                    { label: "10,000 steps", value: "~400–500 cal" },
                    { label: "1 km walk", value: "~50–65 cal" },
                    { label: "1 mile walk", value: "~80–100 cal" },
                    { label: "30 min brisk", value: "~150–200 cal" },
                    { label: "60 min power walk", value: "~400–500 cal" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-bold text-lime-600 dark:text-lime-400">{row.value}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground/60 pt-1">Based on 70 kg / 154 lb adult</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
