import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Droplets, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Lightbulb, Copy, Check, Activity,
  Flame, Scale, Heart, Thermometer, ArrowRight, BookOpen, Target,
} from "lucide-react";

// ── Calculator Logic ──
function useWaterCalc() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("temperate");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;

    const wKg = weightUnit === "lbs" ? w * 0.453592 : w;

    // Base: 0.033 L per kg
    let base = wKg * 0.033;

    // Activity adjustment
    const activityAdj: Record<string, number> = {
      sedentary: 0,
      moderate: 0.35,
      active: 0.7,
      athlete: 1.1,
    };
    base += activityAdj[activity] ?? 0;

    // Climate adjustment
    const climateAdj: Record<string, number> = {
      cold: -0.1,
      temperate: 0,
      hot: 0.35,
      very_hot: 0.6,
    };
    base += climateAdj[climate] ?? 0;

    const liters = Math.max(base, 1.5);
    const ml = Math.round(liters * 1000);
    const oz = Math.round(liters * 33.814);
    const cups = Math.round(liters * 4.227);
    const glasses = Math.round(liters * (1000 / 250)); // 250ml per glass

    return { liters: +liters.toFixed(2), ml, oz, cups, glasses };
  }, [weight, weightUnit, activity, climate]);

  return { weight, setWeight, weightUnit, setWeightUnit, activity, setActivity, climate, setClimate, result };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-blue-500">
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
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 200, benefit: "Check your Body Mass Index" },
  { title: "Calorie Calculator", slug: "calorie-calculator", icon: <Activity className="w-5 h-5" />, color: 25, benefit: "Daily calorie intake target" },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Resting metabolic rate" },
  { title: "Body Fat Calculator", slug: "body-fat-calculator", icon: <Thermometer className="w-5 h-5" />, color: 120, benefit: "Estimate body fat %" },
];

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary (desk job, minimal movement)" },
  { value: "moderate", label: "Moderately Active (light exercise, walking)" },
  { value: "active", label: "Active (regular workouts, 4–5×/week)" },
  { value: "athlete", label: "Athlete (intense daily training)" },
];

const CLIMATE_OPTIONS = [
  { value: "cold", label: "Cold (below 10°C / 50°F)" },
  { value: "temperate", label: "Temperate (10–25°C / 50–77°F)" },
  { value: "hot", label: "Hot (25–35°C / 77–95°F)" },
  { value: "very_hot", label: "Very Hot (above 35°C / 95°F)" },
];

const HYDRATION_TIERS = [
  { label: "Insufficient", range: "< 1.5 L/day", color: "red", dot: "bg-red-500", desc: "Risk of dehydration, fatigue, headaches, and impaired focus. Most adults should drink more than this regardless of body size." },
  { label: "Minimal", range: "1.5 – 2.0 L/day", color: "orange", dot: "bg-orange-500", desc: "Adequate for a small, sedentary person in a cool climate. Borderline for most adults — urine may still be darker than ideal." },
  { label: "Adequate", range: "2.0 – 3.0 L/day", color: "blue", dot: "bg-blue-500", desc: "Covers the needs of most average-sized adults in temperate climates with moderate activity. Urine should be pale yellow." },
  { label: "Optimal", range: "3.0 – 4.0 L/day", color: "cyan", dot: "bg-cyan-500", desc: "Appropriate for active individuals, hot climates, or larger body frames. Supports peak athletic performance and kidney health." },
  { label: "High Demand", range: "> 4.0 L/day", color: "emerald", dot: "bg-emerald-500", desc: "Required by endurance athletes, workers in extreme heat, or individuals in very hot climates. Electrolyte balance becomes important at this level." },
];

export default function WaterIntakeCalculator() {
  const calc = useWaterCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Water Intake Calculator – How Much Water Should You Drink Per Day?"
        description="Calculate your recommended daily water intake based on weight, activity level, and climate. Get results in liters, oz, cups, and glasses. Free, instant, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Water Intake Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Droplets className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Water Intake Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find out exactly how much water you should drink every day based on your body weight, activity level, and climate. Results in liters, ounces, cups, and glasses.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "blue" },
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
            Category: Health &amp; Fitness &nbsp;·&nbsp; Based on WHO &amp; EFSA hydration guidelines &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "60%", label: "of body weight is water", icon: <Droplets className="w-5 h-5" /> },
            { value: "2–3 L", label: "daily need for most adults", icon: <Target className="w-5 h-5" /> },
            { value: "75%", label: "of Americans are chronically dehydrated", icon: <Activity className="w-5 h-5" /> },
            { value: "~20%", label: "of daily water comes from food", icon: <BookOpen className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-center">
              <div className="flex justify-center mb-2 text-blue-500">{s.icon}</div>
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
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WHO / EFSA Hydration Guidelines</p>
                      <p className="text-sm text-muted-foreground">Results update instantly as you change any field.</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Weight */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Your Body Weight</label>
                      <div className="flex gap-2">
                        <input type="number" placeholder={calc.weightUnit === "lbs" ? "160" : "73"} min="1"
                          className="tool-calc-input flex-1"
                          value={calc.weight} onChange={e => calc.setWeight(e.target.value)} />
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["lbs", "kg"] as const).map(u => (
                            <button key={u} onClick={() => calc.setWeightUnit(u)}
                              className={`px-4 py-2 text-sm font-bold transition-all ${calc.weightUnit === u ? "bg-blue-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Activity */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Activity Level</label>
                      <select className="tool-calc-input w-full" value={calc.activity} onChange={e => calc.setActivity(e.target.value)}>
                        {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>

                    {/* Climate */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Climate / Environment</label>
                      <select className="tool-calc-input w-full" value={calc.climate} onChange={e => calc.setClimate(e.target.value)}>
                        {CLIMATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Results */}
                  {calc.result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      {/* Main result */}
                      <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Daily Water Intake Recommendation</p>
                        <p className="text-5xl font-black text-blue-600 dark:text-blue-400">{calc.result.liters}L</p>
                        <p className="text-sm text-muted-foreground mt-1">{calc.result.ml.toLocaleString()} ml per day</p>
                      </div>

                      {/* Unit breakdowns */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Ounces", value: `${calc.result.oz} oz` },
                          { label: "US Cups", value: `${calc.result.cups} cups` },
                          { label: "Glasses (250ml)", value: `${calc.result.glasses} glasses` },
                        ].map(u => (
                          <div key={u.label} className="p-3 rounded-xl bg-muted/60 border border-border text-center">
                            <p className="text-xs text-muted-foreground mb-1">{u.label}</p>
                            <p className="text-lg font-black text-foreground">{u.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Hydration schedule */}
                      <div className="rounded-xl border border-border bg-muted/40 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sample Hydration Schedule</p>
                        <div className="space-y-2">
                          {[
                            { time: "7:00 AM", amount: "Wake up — 500ml (16 oz)" },
                            { time: "10:00 AM", amount: "Mid-morning — 500ml (16 oz)" },
                            { time: "12:30 PM", amount: "With lunch — 500ml (16 oz)" },
                            { time: "3:00 PM", amount: "Afternoon — 500ml (16 oz)" },
                            { time: "6:00 PM", amount: "With dinner — 500ml (16 oz)" },
                            { time: "8:00 PM", amount: "Evening — remaining balance" },
                          ].map(s => (
                            <div key={s.time} className="flex items-center gap-3 text-sm">
                              <span className="text-blue-500 font-bold w-20 flex-shrink-0">{s.time}</span>
                              <span className="text-muted-foreground">{s.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            Based on your profile, drink <strong>{calc.result.liters}L ({calc.result.glasses} glasses)</strong> of water per day. This accounts for your weight, activity level, and environment. About 20% of daily water comes from food — this target covers your total fluid intake from all beverages.
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Your Daily Water Intake</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Proper hydration is essential for nearly every bodily function — from digestion and temperature regulation to joint lubrication and cognitive performance. This calculator uses WHO and EFSA-aligned hydration formulas adjusted for individual variables.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Enter your body weight", body: "Your weight is the primary driver of water needs. Heavier bodies have more cells requiring hydration, and the base formula scales linearly at 33ml per kilogram of body weight. Switch between pounds and kilograms — the calculator converts automatically." },
                  { title: "Choose your activity level", body: "Exercise significantly increases water loss through sweat. Sedentary individuals lose approximately 200–300ml extra through perspiration. Athletes training intensely can lose 1–2L per hour of exercise. Select the level that best represents your average day across the full week, not just your workout days." },
                  { title: "Set your climate", body: "Hot and humid environments accelerate sweating even at rest. Working in a hot environment (construction, kitchen, outdoor labor) or living in a tropical climate can increase hydration needs by 30–60%. Cold environments slightly decrease needs as sweating is minimal." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
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
                  Base = Weight (kg) × 0.033 L<br />
                  Adjusted = Base + Activity Bonus + Climate Bonus
                </code>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Activity bonuses range from 0 (sedentary) to +1.1L (athlete). Climate bonuses range from −0.1L (cold) to +0.6L (very hot). The result represents total daily fluid from all sources including beverages and water-rich foods.
                </p>
              </div>
            </section>

            {/* ── HYDRATION LEVELS ── */}
            <section id="hydration-guide">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Hydration Level Guide</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Not all intake levels are equal. Here's how to interpret your daily water goal and what each range means for your health.
              </p>
              <div className="space-y-3">
                {HYDRATION_TIERS.map((tier) => (
                  <div key={tier.label} className="rounded-xl border border-border bg-card p-4 flex gap-4 items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${tier.dot}`} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-foreground">{tier.label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${tier.color}-500/10 text-${tier.color}-600 dark:text-${tier.color}-400`}>{tier.range}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Quick Reference Examples</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                See how activity level and climate stack up for common body weights. All values assume a temperate climate unless noted.
              </p>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Weight</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Sedentary</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Moderate</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Active</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Athlete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { weight: "120 lbs (54 kg)", s: "1.8 L", m: "2.2 L", a: "2.5 L", at: "3.0 L" },
                      { weight: "150 lbs (68 kg)", s: "2.2 L", m: "2.6 L", a: "2.9 L", at: "3.4 L" },
                      { weight: "180 lbs (82 kg)", s: "2.7 L", m: "3.1 L", a: "3.4 L", at: "3.9 L" },
                      { weight: "210 lbs (95 kg)", s: "3.1 L", m: "3.5 L", a: "3.8 L", at: "4.3 L" },
                      { weight: "240 lbs (109 kg)", s: "3.6 L", m: "4.0 L", a: "4.3 L", at: "4.7 L" },
                      { weight: "180 lbs + hot climate", s: "3.0 L", m: "3.4 L", a: "3.8 L", at: "4.2 L" },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{row.weight}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.s}</td>
                        <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">{row.m}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.a}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE ── */}
            <section id="why-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Water Intake Calculator?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Generic hydration rules miss the variables that actually matter. A personalized calculation accounts for your body and lifestyle.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Target className="w-5 h-5" />, title: "Personalized to Your Body", desc: "Body weight is the primary determinant of water needs. A 120 lb person needs 40% less than a 210 lb person — generic rules ignore this completely.", color: "blue" },
                  { icon: <Activity className="w-5 h-5" />, title: "Activity-Adjusted Targets", desc: "Exercise dramatically increases fluid loss. A marathon runner needs 3× more water than a desk worker of the same weight.", color: "cyan" },
                  { icon: <Thermometer className="w-5 h-5" />, title: "Climate Compensation", desc: "Ambient temperature and humidity affect sweat rate even at rest. Living in Arizona vs. Minnesota changes your hydration needs significantly.", color: "orange" },
                  { icon: <Droplets className="w-5 h-5" />, title: "Multiple Unit Formats", desc: "Get your goal in liters, milliliters, ounces, US cups, and 250ml glasses — whatever format works best for your bottles and routine.", color: "teal" },
                  { icon: <BadgeCheck className="w-5 h-5" />, title: "Evidence-Based Formula", desc: "Based on WHO and EFSA hydration guidelines, not internet myths. The 33ml/kg baseline has strong clinical support across multiple studies.", color: "emerald" },
                  { icon: <Shield className="w-5 h-5" />, title: "100% Private", desc: "All calculations happen locally in your browser. No health data is ever transmitted, stored, or sold to third parties.", color: "violet" },
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
                { q: "Is the '8 glasses a day' rule accurate?", a: "The '8×8' rule (eight 8-oz glasses = 64 oz/day) is a rough guideline that happens to be appropriate for many average-sized adults in temperate climates with moderate activity. However, it is not science-based for individuals. Body weight, exercise, climate, health conditions, and diet composition all affect actual needs. This calculator provides a more personalized estimate." },
                { q: "Does coffee and tea count toward my water intake?", a: "Yes, caffeinated beverages like coffee and tea contribute to daily fluid intake despite the mild diuretic effect of caffeine. Research shows that regular coffee drinkers are well-hydrated from their coffee consumption. Water-rich foods like cucumbers, watermelon, and soup also count — roughly 20% of daily water intake typically comes from food." },
                { q: "What are the signs of dehydration?", a: "Mild dehydration (1–2% of body weight) causes thirst, dark yellow urine, reduced concentration, and mild headache. Moderate dehydration (3–5%) causes fatigue, dizziness, dry mouth, and decreased performance. Severe dehydration (>5%) can cause confusion, rapid heartbeat, and is a medical emergency. A simple check: urine should be pale yellow, not dark amber." },
                { q: "Can you drink too much water?", a: "Yes — overhydration (hyponatremia) occurs when excess water dilutes sodium levels in the blood. This is rare in healthy adults but can happen in endurance athletes who drink large amounts of plain water without electrolytes. Unless you have a specific medical condition, staying within 2× the recommended intake is generally safe for most people." },
                { q: "Does my water intake change if I'm pregnant or breastfeeding?", a: "Yes. Pregnant women generally need an additional 300–500ml per day above their baseline. Breastfeeding women need an additional 700ml–1L per day due to milk production. This calculator does not currently account for pregnancy or lactation — add 0.5–1L to your result if either applies to you." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-blue-500/10 via-card to-cyan-500/10 border border-blue-500/20 p-8 text-center">
              <h2 className="text-2xl font-black text-foreground mb-2">Track More Than Just Water</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Hydration is one piece of the health puzzle. Calculate your total energy needs and calorie targets with the TDEE Calculator.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/tdee-calculator"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  TDEE Calculator <ArrowRight className="w-4 h-4" />
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
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors">
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
                    { label: "Hydration Guide", href: "#hydration-guide" },
                    { label: "Quick Examples", href: "#examples" },
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

              {/* Hydration Quick Reference */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Activity Bonus Reference</p>
                <div className="space-y-2">
                  {[
                    { activity: "Sedentary", bonus: "+0.0 L" },
                    { activity: "Moderate", bonus: "+0.35 L" },
                    { activity: "Active", bonus: "+0.70 L" },
                    { activity: "Athlete", bonus: "+1.10 L" },
                    { activity: "Hot climate", bonus: "+0.35 L" },
                    { activity: "Very hot climate", bonus: "+0.60 L" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.activity}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{row.bonus}</span>
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
