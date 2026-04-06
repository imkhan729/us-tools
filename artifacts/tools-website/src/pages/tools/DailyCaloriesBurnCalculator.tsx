import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Flame, Activity, Sun, Share2, Check } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

const ACTIVITY_LEVELS = [
  { label: "Sedentary — desk job, minimal movement", value: 1.2, desc: "Little to no exercise" },
  { label: "Lightly active — 1–3 workouts/week", value: 1.375, desc: "Light exercise 1–3 days" },
  { label: "Moderately active — 3–5 workouts/week", value: 1.55, desc: "Moderate exercise 3–5 days" },
  { label: "Very active — 6–7 hard workouts/week", value: 1.725, desc: "Hard exercise 6–7 days" },
  { label: "Extra active — physical job + daily training", value: 1.9, desc: "Physical labor + exercise" },
];

const CALORIE_BURN_COMPONENTS = [
  { label: "BMR (Basal Metabolic Rate)", pct: 65, desc: "Breathing, circulation, cell functions" },
  { label: "TEF (Thermic Effect of Food)", pct: 10, desc: "Digesting and processing food" },
  { label: "NEAT (Non-Exercise Activity)", pct: 15, desc: "Fidgeting, posture, daily movement" },
  { label: "Exercise", pct: 10, desc: "Intentional physical training" },
];

const TDEE_TIERS = [
  { label: "Low", range: "< 1,800 cal/day", desc: "Smaller frame, sedentary, or older adult", dot: "bg-blue-500", bg: "bg-blue-500/5 border-blue-500/20" },
  { label: "Below Average", range: "1,800–2,200 cal/day", desc: "Average adult with light daily activity", dot: "bg-teal-500", bg: "bg-teal-500/5 border-teal-500/20" },
  { label: "Average", range: "2,200–2,600 cal/day", desc: "Moderately active adult — most common range", dot: "bg-emerald-500", bg: "bg-emerald-500/5 border-emerald-500/20" },
  { label: "Above Average", range: "2,600–3,000 cal/day", desc: "Active individual or larger body size", dot: "bg-amber-500", bg: "bg-amber-500/5 border-amber-500/20" },
  { label: "High", range: "> 3,000 cal/day", desc: "Athletes, heavy laborers, or very large individuals", dot: "bg-red-500", bg: "bg-red-500/5 border-red-500/20" },
];

const faqs = [
  {
    q: "How many calories does the body burn in a day?",
    a: "The average adult burns 1,600–3,000 calories per day. This varies significantly based on body size, sex, age, and activity level. Larger, more muscular individuals and those with active lifestyles burn substantially more. Your TDEE (Total Daily Energy Expenditure) is the specific number for your body.",
  },
  {
    q: "What makes up daily calorie burn?",
    a: "Daily calorie burn has four components: BMR (60–70%) — energy to sustain vital functions; TEF (8–12%) — energy to digest food; NEAT (15–20%) — unconscious daily movement; and EAT (0–20%) — intentional exercise. Most people underestimate NEAT, which varies enormously between individuals.",
  },
  {
    q: "What is NEAT and why does it matter?",
    a: "NEAT (Non-Exercise Activity Thermogenesis) includes all movement that isn't formal exercise: walking around the house, fidgeting, posture maintenance, gesturing while talking. Research shows NEAT varies by up to 2,000 calories/day between individuals at the same weight — explaining why some people seem to 'naturally' stay lean.",
  },
  {
    q: "Does eating more increase calorie burn?",
    a: "Yes, through the Thermic Effect of Food (TEF). Protein has a TEF of 25–30% (eating 100 calories of protein burns 25–30 of them in digestion). Carbohydrates have ~6–8% TEF. Fat has ~2–3% TEF. This is one reason high-protein diets are effective — they naturally reduce net calorie intake.",
  },
  {
    q: "Can I increase my daily calorie burn?",
    a: "Yes. The most effective strategies are: (1) Building muscle through resistance training — more muscle increases BMR permanently. (2) Increasing NEAT — stand more, take stairs, walk during calls. (3) Increasing exercise frequency and intensity. (4) Eating more protein, which increases TEF. These add up to a meaningfully higher TDEE.",
  },
  {
    q: "Why does my calorie burn decrease when I diet?",
    a: "This is metabolic adaptation. When you eat less, your body responds by lowering BMR (by up to 15–20%), reducing NEAT unconsciously, and becoming more metabolically efficient. This is why weight loss often plateaus. Diet breaks, maintenance periods, and resistance training help mitigate this effect.",
  },
];

function FaqItem({ faq, open, onToggle }: { faq: { q: string; a: string }; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors">
        <span className="font-medium text-foreground pr-4">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const COMPONENT_COLORS = ["bg-teal-500", "bg-orange-400", "bg-emerald-500", "bg-blue-400"];

const relatedTools = [
  { label: "BMR Calculator", href: "/health/bmr-calculator", color: "59 130 246" },
  { label: "TDEE Calculator", href: "/health/tdee-calculator", color: "239 68 68" },
  { label: "Calorie Deficit", href: "/health/calorie-deficit-calculator", color: "16 185 129" },
  { label: "Calorie Intake", href: "/health/calorie-intake-calculator", color: "245 158 11" },
];

const tocItems = [
  { label: "Overview", href: "#overview" },
  { label: "Calculator", href: "#calculator" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "TDEE Ranges", href: "#tdee-guide" },
  { label: "Quick Examples", href: "#examples" },
  { label: "Why Use This", href: "#why-use" },
  { label: "FAQ", href: "#faq" },
];

export default function DailyCaloriesBurnCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState(1.55);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

    const tdee = bmr * activity;
    const tef = tdee * 0.10;
    const neat = tdee * 0.15;
    const exercise = tdee * 0.10;
    const bmrComp = tdee - tef - neat - exercise;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      components: [
        { label: "BMR", value: Math.round(bmrComp), pct: Math.round((bmrComp / tdee) * 100) },
        { label: "Exercise (EAT)", value: Math.round(exercise), pct: Math.round((exercise / tdee) * 100) },
        { label: "Daily movement (NEAT)", value: Math.round(neat), pct: Math.round((neat / tdee) * 100) },
        { label: "Digestion (TEF)", value: Math.round(tef), pct: Math.round((tef / tdee) * 100) },
      ],
    };
  }, [age, sex, weight, height, heightFt, heightIn, unit, activity]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Daily Calories Burn Calculator – How Many Calories Do You Burn Per Day?"
        description="Calculate total daily calories burned including BMR, exercise, NEAT, and digestion. Uses Mifflin-St Jeor formula with full TDEE component breakdown."
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4 px-4 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-teal-500 transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/health" className="hover:text-teal-500 transition-colors">Health &amp; Fitness</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Daily Calories Burn Calculator</li>
        </ol>
      </nav>

      {/* Hero */}
      <section id="overview" className="mb-8 px-4 lg:px-0">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
          <Flame className="w-4 h-4" />
          Health &amp; Fitness · Mifflin-St Jeor Formula
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Daily Calories Burn Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Estimate total calories burned in a day — including BMR, exercise, movement (NEAT), and digestion (TEF).
          Full breakdown of where your daily energy goes.
        </p>

        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { value: "~65%", label: "from BMR", sub: "largest component" },
            { value: "4", label: "components tracked", sub: "BMR, EAT, NEAT, TEF" },
            { value: "2,000 cal", label: "NEAT variation", sub: "between individuals" },
            { value: "±10%", label: "formula accuracy", sub: "vs. measured TDEE" },
          ].map((s) => (
            <div key={s.label} className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{s.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-0">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">

          {/* Calculator */}
          <section id="calculator">
            <div className="tool-calc-card overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-t-xl" />
              <div className="p-6">
                <div className="flex gap-2 mb-6">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${unit === u ? "bg-teal-500 text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Age (years)</label>
                    <input type="number" min="15" max="100" value={age} onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 32" className="tool-calc-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Biological sex</label>
                    <div className="flex gap-2">
                      {(["male", "female"] as const).map((s) => (
                        <button key={s} onClick={() => setSex(s)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${sex === s ? "bg-teal-500/10 border-teal-400 text-teal-700 dark:text-teal-300" : "bg-muted border-border text-muted-foreground hover:border-teal-300"}`}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                    <input type="number" min="30" max="400" value={weight} onChange={(e) => setWeight(e.target.value)}
                      placeholder={unit === "metric" ? "e.g. 75" : "e.g. 165"} className="tool-calc-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Height ({unit === "metric" ? "cm" : "ft / in"})</label>
                    {unit === "metric" ? (
                      <input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 175" className="tool-calc-input" />
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

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-1">Activity level</label>
                  <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="tool-calc-input">
                    {ACTIVITY_LEVELS.map((al) => (
                      <option key={al.value} value={al.value}>{al.label}</option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="tool-calc-result bg-teal-500/5 border-teal-500/20 text-center">
                        <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-1 flex items-center justify-center gap-1.5">
                          <Flame className="w-4 h-4" /> Total Daily Calorie Burn (TDEE)
                        </p>
                        <p className="text-5xl font-bold text-teal-600 dark:text-teal-400">
                          {result.tdee.toLocaleString()}
                          <span className="text-2xl font-medium ml-1">cal/day</span>
                        </p>
                        <p className="text-sm text-teal-500 mt-1">
                          BMR: {result.bmr.toLocaleString()} × activity factor {activity}
                        </p>
                      </div>

                      {/* Component breakdown */}
                      <div className="bg-muted/30 border border-border rounded-xl p-4">
                        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-teal-500" /> Where your daily calories go
                        </p>
                        {/* Stacked bar */}
                        <div className="flex rounded-full overflow-hidden h-5 mb-3">
                          {result.components.map((comp, i) => (
                            <motion.div key={comp.label}
                              initial={{ width: 0 }} animate={{ width: `${comp.pct}%` }}
                              transition={{ duration: 0.6, delay: i * 0.1 }}
                              className={`${COMPONENT_COLORS[i]} flex items-center justify-center text-white text-xs font-bold`}
                              title={`${comp.label}: ${comp.pct}%`}
                            />
                          ))}
                        </div>
                        <div className="space-y-2">
                          {result.components.map((comp, i) => (
                            <div key={comp.label} className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${COMPONENT_COLORS[i]} shrink-0`} />
                              <span className="text-sm text-muted-foreground flex-1">{comp.label}</span>
                              <span className="text-sm font-bold text-foreground">{comp.value.toLocaleString()} cal</span>
                              <span className="text-xs text-muted-foreground w-10 text-right">{comp.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TDEE by activity comparison */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">TDEE across activity levels</p>
                        <div className="space-y-2">
                          {ACTIVITY_LEVELS.map((al) => {
                            const tdeeVal = Math.round(result.bmr * al.value);
                            const maxTdee = Math.round(result.bmr * 1.9);
                            return (
                              <div key={al.value} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-24 shrink-0 truncate">{al.desc}</span>
                                <div className="flex-1 bg-muted rounded-full h-3">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(tdeeVal / maxTdee) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-3 rounded-full ${al.value === activity ? "bg-teal-500" : "bg-teal-300 dark:bg-teal-700"}`} />
                                </div>
                                <span className={`text-sm font-semibold w-20 text-right ${al.value === activity ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"}`}>
                                  {tdeeVal.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Goal guide */}
                      <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                        <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-2 flex items-center gap-1.5">
                          <Sun className="w-4 h-4" /> Daily calorie targets for your goals
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          {[
                            { label: "Lose weight", cal: result.tdee - 500, color: "text-red-500" },
                            { label: "Maintain", cal: result.tdee, color: "text-teal-600 dark:text-teal-400" },
                            { label: "Build muscle", cal: result.tdee + 250, color: "text-blue-500" },
                          ].map((g) => (
                            <div key={g.label} className="bg-card border border-border rounded-lg p-2">
                              <p className="text-muted-foreground">{g.label}</p>
                              <p className={`text-base font-bold ${g.color}`}>{g.cal.toLocaleString()}</p>
                              <p className="text-muted-foreground">cal/day</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works">
            <h2 className="text-2xl font-bold text-foreground mb-4">How the Daily Calories Burn Calculator Works</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This calculator uses the <strong className="text-foreground">Mifflin-St Jeor equation</strong> — the most accurate
              formula for estimating BMR, validated across diverse populations and recommended by the Academy of Nutrition and Dietetics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-xs text-center">
                <p className="text-muted-foreground mb-1">Male BMR</p>
                <p className="text-foreground">10W + 6.25H − 5A + 5</p>
              </div>
              <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-xs text-center">
                <p className="text-muted-foreground mb-1">Female BMR</p>
                <p className="text-foreground">10W + 6.25H − 5A − 161</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              W = weight (kg), H = height (cm), A = age (years). TDEE = BMR × activity multiplier (1.2–1.9).
              The breakdown into BMR, NEAT, TEF, and EAT components uses population-average percentages — individual values vary.
            </p>
          </section>

          {/* TDEE Guide */}
          <section id="tdee-guide">
            <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Your TDEE Range</h2>
            <div className="space-y-3">
              {TDEE_TIERS.map((t) => (
                <div key={t.label} className={`flex items-start gap-4 p-4 rounded-xl border ${t.bg}`}>
                  <div className="mt-1.5">
                    <span className={`inline-block w-3 h-3 rounded-full ${t.dot}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground">{t.label}</span>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t.range}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Examples */}
          <section id="examples">
            <h2 className="text-2xl font-bold text-foreground mb-2">TDEE Reference by Profile</h2>
            <p className="text-muted-foreground text-sm mb-4">Estimated TDEE for common profiles using the Mifflin-St Jeor formula.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-teal-500/10">
                    <th className="border border-teal-500/20 px-4 py-2 text-left font-semibold text-foreground">Profile</th>
                    <th className="border border-teal-500/20 px-4 py-2 text-left font-semibold text-foreground">Age / Weight / Height</th>
                    <th className="border border-teal-500/20 px-4 py-2 text-left font-semibold text-foreground">Sedentary</th>
                    <th className="border border-teal-500/20 px-4 py-2 text-left font-semibold text-foreground">Moderate</th>
                    <th className="border border-teal-500/20 px-4 py-2 text-left font-semibold text-foreground">Very Active</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Female, small", "25 / 55 kg / 160 cm", "1,490", "1,924", "2,232"],
                    ["Female, average", "30 / 68 kg / 165 cm", "1,660", "2,144", "2,486"],
                    ["Female, larger", "35 / 82 kg / 170 cm", "1,838", "2,374", "2,754"],
                    ["Male, small", "25 / 68 kg / 170 cm", "1,815", "2,344", "2,720"],
                    ["Male, average", "30 / 80 kg / 178 cm", "1,990", "2,570", "2,983"],
                    ["Male, larger", "35 / 95 kg / 183 cm", "2,205", "2,847", "3,304"],
                  ].map(([profile, stats, sed, mod, act]) => (
                    <tr key={profile} className="odd:bg-background even:bg-muted/30">
                      <td className="border border-border px-4 py-2 font-medium text-foreground">{profile}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground text-xs">{stats}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{sed}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{mod}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{act}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why Use This */}
          <section id="why-use">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Use This Daily Calories Burn Calculator</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Gold-standard formula", desc: "The Mifflin-St Jeor equation is the most accurate BMR predictor, recommended by the Academy of Nutrition and Dietetics." },
                { title: "4-component TDEE breakdown", desc: "See exactly how much comes from BMR, exercise, NEAT, and food digestion — not just a single number." },
                { title: "Activity level comparison", desc: "Instantly visualize how changing your activity level shifts your daily calorie burn across all 5 activity tiers." },
                { title: "Built-in goal targets", desc: "Get personalized calorie targets for fat loss, maintenance, and muscle building — calculated from your TDEE." },
                { title: "Metric & imperial support", desc: "Works with kg/cm or lbs/ft with automatic conversion. No manual unit math required." },
                { title: "Completely private", desc: "All calculations run locally in your browser. No data is stored, shared, or sent to any server." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Want to dig deeper into your metabolism?</h3>
            <p className="text-muted-foreground text-sm mb-4">Calculate your BMR in isolation, find your ideal calorie intake, or explore all health tools.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/health/bmr-calculator"
                className="px-5 py-2.5 bg-teal-500 text-white rounded-xl font-medium text-sm hover:bg-teal-600 transition-colors">
                BMR Calculator →
              </Link>
              <Link href="/health"
                className="px-5 py-2.5 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors">
                All Health Tools
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">

          {/* Related Tools */}
          <div className="tool-calc-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Related Tools</h3>
            <ul className="space-y-2">
              {relatedTools.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="flex items-center gap-3 text-sm text-foreground hover:text-teal-500 transition-colors">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `rgb(${t.color} / 0.12)` }}>
                      <Flame className="w-3.5 h-3.5" style={{ color: `rgb(${t.color})` }} />
                    </span>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Share */}
          <div className="tool-calc-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Share</h3>
            <button onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Link copied!" : "Copy link"}
            </button>
          </div>

          {/* On This Page */}
          <div className="tool-calc-card p-5">
            <h3 className="font-semibold text-foreground mb-3">On This Page</h3>
            <ul className="space-y-1.5">
              {tocItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-teal-500 transition-colors block py-0.5">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Multipliers */}
          <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-5">
            <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Activity Multipliers
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { label: "Sedentary", value: "×1.20" },
                { label: "Lightly active", value: "×1.375" },
                { label: "Moderately active", value: "×1.55" },
                { label: "Very active", value: "×1.725" },
                { label: "Extra active", value: "×1.90" },
              ].map((r) => (
                <li key={r.label} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
