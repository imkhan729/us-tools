import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Flame, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Lightbulb, Copy, Check, Activity,
  TrendingDown, TrendingUp, Scale, Heart, Dumbbell, ArrowRight, BookOpen, Target,
} from "lucide-react";

// ── Calculator Logic ──
function useTdeeCalc() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");
  const [activity, setActivity] = useState("sedentary");

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    if (isNaN(a) || isNaN(w) || a <= 0 || w <= 0) return null;

    const wKg = weightUnit === "lbs" ? w * 0.453592 : w;
    let hCm: number;

    if (heightUnit === "imperial") {
      const ft = parseFloat(heightFt);
      const inch = parseFloat(heightIn) || 0;
      if (isNaN(ft) || ft <= 0) return null;
      hCm = (ft * 12 + inch) * 2.54;
    } else {
      hCm = parseFloat(heightCm);
      if (isNaN(hCm) || hCm <= 0) return null;
    }

    // Mifflin-St Jeor Equation
    const bmr = gender === "male"
      ? 10 * wKg + 6.25 * hCm - 5 * a + 5
      : 10 * wKg + 6.25 * hCm - 5 * a - 161;

    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      super: 1.9,
    };
    const tdee = bmr * (multipliers[activity] ?? 1.2);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      moderateLoss: Math.round(tdee - 500),
      extremeLoss: Math.round(tdee - 1000),
      mildGain: Math.round(tdee + 250),
      moderateGain: Math.round(tdee + 500),
    };
  }, [age, gender, weight, weightUnit, heightFt, heightIn, heightCm, heightUnit, activity]);

  return { age, setAge, gender, setGender, weight, setWeight, weightUnit, setWeightUnit, heightFt, setHeightFt, heightIn, setHeightIn, heightCm, setHeightCm, heightUnit, setHeightUnit, activity, setActivity, result };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-red-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-red-500">
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
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Flame className="w-5 h-5" />, color: 0, benefit: "Find your basal metabolic rate" },
  { title: "Calorie Calculator", slug: "calorie-calculator", icon: <Activity className="w-5 h-5" />, color: 25, benefit: "Daily calorie needs for any goal" },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 200, benefit: "Check your Body Mass Index" },
  { title: "Body Fat Calculator", slug: "body-fat-calculator", icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Estimate body fat percentage" },
  { title: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: <Dumbbell className="w-5 h-5" />, color: 120, benefit: "Find your target healthy weight" },
];

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly Active (1–3 days/week)",
  moderate: "Moderately Active (3–5 days/week)",
  very: "Very Active (6–7 days/week)",
  super: "Super Active (athlete / physical job)",
};

const TDEE_TIERS = [
  { label: "Very Low", range: "< 1,600 cal/day", color: "blue", dot: "bg-blue-500", desc: "Typical for small, sedentary adults. Low calorie needs — portion awareness is important to maintain a deficit without under-eating protein." },
  { label: "Low–Moderate", range: "1,600 – 2,000 cal/day", color: "cyan", dot: "bg-cyan-500", desc: "Common for moderately active women or smaller sedentary men. A 500 cal deficit puts loss at 1 lb/week starting from as low as 1,100–1,500 cal/day." },
  { label: "Moderate", range: "2,000 – 2,500 cal/day", color: "green", dot: "bg-green-500", desc: "Most average-sized adults fall here. A standard diet plan of 1,500–2,000 cal/day creates a sustainable deficit for weight loss." },
  { label: "High", range: "2,500 – 3,200 cal/day", color: "orange", dot: "bg-orange-500", desc: "Active individuals, larger frames, or regular exercisers. More flexibility in diet structure — easier to hit high protein targets." },
  { label: "Very High", range: "> 3,200 cal/day", color: "red", dot: "bg-red-500", desc: "Athletes, physical laborers, or very large individuals. May need structured meal planning to consistently meet calorie and macro targets." },
];

export default function TdeeCalculator() {
  const calc = useTdeeCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="TDEE Calculator – Total Daily Energy Expenditure | Free Online Tool"
        description="Calculate your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation. Get personalized calorie targets for weight loss, maintenance, or muscle gain. Free, no signup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-red-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-red-500" strokeWidth={3} />
          <span className="text-foreground">TDEE Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-red-500/15 bg-gradient-to-br from-red-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Flame className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            TDEE Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your Total Daily Energy Expenditure (TDEE) — the exact calories your body burns each day. Get personalized targets for weight loss, maintenance, or muscle gain.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "red" },
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
            Category: Health &amp; Fitness &nbsp;·&nbsp; Formula: Mifflin-St Jeor &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "±10%", label: "accuracy of Mifflin-St Jeor equation", icon: <Target className="w-5 h-5" /> },
            { value: "500 cal", label: "deficit = ~1 lb fat lost per week", icon: <TrendingDown className="w-5 h-5" /> },
            { value: "1.2–1.9×", label: "range of activity multipliers", icon: <Activity className="w-5 h-5" /> },
            { value: "4–6 wk", label: "recalculation interval as weight changes", icon: <BookOpen className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5 text-center">
              <div className="flex justify-center mb-2 text-red-500">{s.icon}</div>
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
              <div className="rounded-2xl overflow-hidden border border-red-500/20 shadow-lg shadow-red-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mifflin-St Jeor Formula</p>
                      <p className="text-sm text-muted-foreground">Fill in all fields for your personalized TDEE.</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Age */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Age (years)</label>
                      <input type="number" placeholder="25" min="1" max="120"
                        className="tool-calc-input w-full"
                        value={calc.age} onChange={e => calc.setAge(e.target.value)} />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Biological Sex</label>
                      <div className="flex gap-2">
                        {(["male", "female"] as const).map(g => (
                          <button key={g}
                            onClick={() => calc.setGender(g)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${calc.gender === g ? "bg-red-500 text-white border-red-500" : "border-border text-muted-foreground hover:border-red-500/50"}`}>
                            {g === "male" ? "Male" : "Female"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Weight</label>
                      <div className="flex gap-2">
                        <input type="number" placeholder={calc.weightUnit === "lbs" ? "160" : "73"} min="1"
                          className="tool-calc-input flex-1"
                          value={calc.weight} onChange={e => calc.setWeight(e.target.value)} />
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["lbs", "kg"] as const).map(u => (
                            <button key={u} onClick={() => calc.setWeightUnit(u)}
                              className={`px-3 py-2 text-sm font-bold transition-all ${calc.weightUnit === u ? "bg-red-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Height</label>
                      <div className="flex gap-2">
                        {calc.heightUnit === "imperial" ? (
                          <>
                            <input type="number" placeholder="5" min="1"
                              className="tool-calc-input w-20"
                              value={calc.heightFt} onChange={e => calc.setHeightFt(e.target.value)} />
                            <span className="self-center text-sm font-bold text-muted-foreground">ft</span>
                            <input type="number" placeholder="10" min="0" max="11"
                              className="tool-calc-input w-20"
                              value={calc.heightIn} onChange={e => calc.setHeightIn(e.target.value)} />
                            <span className="self-center text-sm font-bold text-muted-foreground">in</span>
                          </>
                        ) : (
                          <>
                            <input type="number" placeholder="178"
                              className="tool-calc-input flex-1"
                              value={calc.heightCm} onChange={e => calc.setHeightCm(e.target.value)} />
                            <span className="self-center text-sm font-bold text-muted-foreground">cm</span>
                          </>
                        )}
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["imperial", "metric"] as const).map(u => (
                            <button key={u} onClick={() => calc.setHeightUnit(u)}
                              className={`px-2.5 py-2 text-xs font-bold transition-all ${calc.heightUnit === u ? "bg-red-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                              {u === "imperial" ? "ft" : "cm"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Activity Level */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Activity Level</label>
                      <select
                        className="tool-calc-input w-full"
                        value={calc.activity}
                        onChange={e => calc.setActivity(e.target.value)}>
                        {Object.entries(ACTIVITY_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Results */}
                  {calc.result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      {/* BMR + TDEE highlight */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">BMR</p>
                          <p className="text-3xl font-black text-foreground">{calc.result.bmr.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-1">calories at rest</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">TDEE (Maintenance)</p>
                          <p className="text-3xl font-black text-foreground">{calc.result.tdee.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-1">calories/day to maintain weight</p>
                        </div>
                      </div>

                      {/* Goal targets */}
                      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Calorie Targets by Goal</p>
                        {[
                          { label: "Extreme Loss (−2 lbs/wk)", value: calc.result.extremeLoss, icon: <TrendingDown className="w-4 h-4" />, color: "red" },
                          { label: "Moderate Loss (−1 lb/wk)", value: calc.result.moderateLoss, icon: <TrendingDown className="w-4 h-4" />, color: "orange" },
                          { label: "Mild Loss (−0.5 lb/wk)", value: calc.result.mildLoss, icon: <TrendingDown className="w-4 h-4" />, color: "yellow" },
                          { label: "Maintenance", value: calc.result.tdee, icon: <Activity className="w-4 h-4" />, color: "blue" },
                          { label: "Mild Gain (+0.5 lb/wk)", value: calc.result.mildGain, icon: <TrendingUp className="w-4 h-4" />, color: "emerald" },
                          { label: "Moderate Gain (+1 lb/wk)", value: calc.result.moderateGain, icon: <TrendingUp className="w-4 h-4" />, color: "green" },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between gap-3 py-1.5">
                            <div className={`flex items-center gap-2 text-${row.color}-500`}>{row.icon}
                              <span className="text-sm font-medium text-foreground/80">{row.label}</span>
                            </div>
                            <span className="text-base font-black text-foreground">{row.value.toLocaleString()} <span className="text-xs font-medium text-muted-foreground">cal/day</span></span>
                          </div>
                        ))}
                      </div>

                      <motion.div className="mt-2 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            Your TDEE is <strong>{calc.result.tdee.toLocaleString()} calories/day</strong> at <strong>{ACTIVITY_LABELS[calc.activity]}</strong>. This is {(((calc.result.tdee - calc.result.bmr) / calc.result.bmr) * 100).toFixed(0)}% above your resting BMR. To lose 1 lb per week, eat {calc.result.moderateLoss.toLocaleString()} cal/day.
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the TDEE Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                TDEE stands for Total Daily Energy Expenditure — the total number of calories your body burns in a day, including exercise and daily movement. It is the gold standard metric for setting calorie goals in any diet or fitness plan.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Enter your personal stats", body: "Input your age, biological sex, current weight, and height. These values feed the Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR) — the calories your body needs at complete rest." },
                  { title: "Select your activity level honestly", body: "This is the most critical step. Choose 'Sedentary' if you sit at a desk most of the day and rarely exercise. Choose 'Lightly Active' for 1–3 workouts per week. 'Moderately Active' suits people who exercise consistently 3–5 days. 'Very Active' or 'Super Active' applies to athletes, physical laborers, or those training twice per day." },
                  { title: "Read your calorie targets by goal", body: "The results show your TDEE for maintenance, plus six goal-specific calorie targets. A deficit of 500 cal/day produces approximately 1 lb/week of fat loss. A surplus of 500 cal/day supports approximately 1 lb/week of lean mass gain." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">The Formula</p>
                <div className="space-y-2 font-mono text-xs mb-4">
                  <code className="block px-3 py-2 bg-background rounded">BMR (Male)   = 10 × kg + 6.25 × cm − 5 × age + 5</code>
                  <code className="block px-3 py-2 bg-background rounded">BMR (Female) = 10 × kg + 6.25 × cm − 5 × age − 161</code>
                  <code className="block px-3 py-2 bg-background rounded">TDEE         = BMR × Activity Multiplier</code>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The <strong className="text-foreground">Mifflin-St Jeor equation</strong> (1990) is considered the most accurate TDEE formula for the general population, outperforming the older Harris-Benedict equation by roughly 5% in clinical tests. Activity multipliers range from 1.2 (sedentary) to 1.9 (super active).
                </p>
              </div>
            </section>

            {/* ── TDEE INTERPRETATION ── */}
            <section id="tdee-guide">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your TDEE Range</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                TDEE varies widely depending on age, sex, body composition, and activity. Here's how to interpret where your number falls and what it means for your diet planning.
              </p>
              <div className="space-y-3">
                {TDEE_TIERS.map((tier) => (
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">TDEE Quick Reference Examples</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sample TDEE values for common profiles. Use the calculator above for your exact numbers. All values assume moderate activity unless noted.
              </p>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Profile</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">BMR</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">TDEE</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Fat Loss Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { profile: "Female, 25, 130 lbs, 5'4\"", bmr: "1,375", tdee: "2,130", loss: "1,630 cal/day" },
                      { profile: "Female, 35, 155 lbs, 5'6\"", bmr: "1,498", tdee: "2,322", loss: "1,822 cal/day" },
                      { profile: "Male, 25, 175 lbs, 5'10\"", bmr: "1,855", tdee: "2,875", loss: "2,375 cal/day" },
                      { profile: "Male, 40, 200 lbs, 6'0\"", bmr: "1,955", tdee: "3,030", loss: "2,530 cal/day" },
                      { profile: "Male, 30, 180 lbs, 5'11\" (athlete)", bmr: "1,890", tdee: "3,591", loss: "3,091 cal/day" },
                      { profile: "Female, 50, 140 lbs, 5'5\" (sedentary)", bmr: "1,348", tdee: "1,617", loss: "1,117 cal/day" },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{row.profile}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.bmr}</td>
                        <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">{row.tdee}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.loss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE ── */}
            <section id="why-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a TDEE Calculator?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Guessing your calorie needs leads to frustration. A TDEE calculator gives you a precise starting point backed by clinical research.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Target className="w-5 h-5" />, title: "Precision Calorie Targets", desc: "Set your intake based on what your body actually burns — not a generic 2,000 cal/day standard that may be 30–50% off your real needs.", color: "red" },
                  { icon: <TrendingDown className="w-5 h-5" />, title: "Science-Backed Fat Loss", desc: "A 500 cal/day deficit produces ~1 lb of fat loss per week. Knowing your TDEE lets you create a deficit that's sustainable, not just aggressive.", color: "orange" },
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Muscle Gain Planning", desc: "Bulking without knowing your TDEE leads to excess fat gain. A small 250–500 cal surplus maximizes lean mass while minimizing fat accumulation.", color: "emerald" },
                  { icon: <Dumbbell className="w-5 h-5" />, title: "Activity-Adjusted Results", desc: "The same person can have a 1,000+ cal/day TDEE difference between sedentary and very active lifestyles. Activity level selection is the most impactful variable.", color: "blue" },
                  { icon: <BadgeCheck className="w-5 h-5" />, title: "Gold Standard Formula", desc: "Mifflin-St Jeor is clinically validated and consistently outperforms older Harris-Benedict calculations in population studies by ~5% accuracy.", color: "violet" },
                  { icon: <Shield className="w-5 h-5" />, title: "100% Private", desc: "All calculations run locally in your browser. Your age, weight, and health data never leave your device — no accounts, no tracking.", color: "slate" },
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
                { q: "What is TDEE and why does it matter?", a: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns every day, accounting for your basal metabolism plus all physical activity. It is the definitive number for setting calorie intake: eat below TDEE to lose weight, above TDEE to gain muscle, and at TDEE to maintain your current weight." },
                { q: "What is the difference between BMR and TDEE?", a: "BMR (Basal Metabolic Rate) is the minimum calories your body needs to survive — organs functioning, cells repairing, temperature regulated — if you were lying completely still for 24 hours. TDEE multiplies BMR by an activity factor to account for everything you actually do during the day: walking, working, exercising, even fidgeting." },
                { q: "How accurate is this TDEE calculator?", a: "This calculator uses the Mifflin-St Jeor equation, which studies show is accurate to within ±10% for most people. The largest source of error is the activity level selection — most people underestimate their sedentary time and overestimate exercise intensity. When in doubt, choose the lower activity level and adjust based on real-world results over 2–4 weeks." },
                { q: "How often should I recalculate my TDEE?", a: "Recalculate every 4–6 weeks or whenever your weight changes by 5+ lbs. As you lose weight, your TDEE decreases (less body mass to carry). As you gain muscle, it may increase slightly. Metabolic adaptation can also lower TDEE during prolonged calorie restriction, which is why diet breaks every 8–12 weeks can help." },
                { q: "Can I use TDEE to build muscle and lose fat at the same time?", a: "Body recomposition (building muscle while losing fat simultaneously) is possible but occurs slowly. It works best for beginners, those returning after a break, or those with significant body fat. Eating at a small deficit (100–200 calories below TDEE) while following a progressive resistance training program allows recomposition in many people, though separate bulk/cut phases produce faster results." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-red-500/10 via-card to-orange-500/10 border border-red-500/20 p-8 text-center">
              <h2 className="text-2xl font-black text-foreground mb-2">Complete Your Health Picture</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Pair your TDEE with a personalized water intake goal and BMR baseline to build a complete picture of your daily health targets.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/bmr-calculator"
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  BMR Calculator <ArrowRight className="w-4 h-4" />
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
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
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
                    { label: "TDEE Ranges", href: "#tdee-guide" },
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

              {/* Activity Multiplier Reference */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-3">Activity Multipliers</p>
                <div className="space-y-2">
                  {[
                    { level: "Sedentary", mult: "× 1.20" },
                    { level: "Light (1–3×/wk)", mult: "× 1.375" },
                    { level: "Moderate (3–5×/wk)", mult: "× 1.55" },
                    { level: "Very Active (6–7×/wk)", mult: "× 1.725" },
                    { level: "Super Active", mult: "× 1.90" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.level}</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{row.mult}</span>
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
