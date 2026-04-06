import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Flame, TrendingDown, Scale, Info, Share2, Check } from "lucide-react";
import { Link } from "wouter";
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
  { label: "Mild loss (0.25 kg / 0.5 lb per week)", deficit: 275 },
  { label: "Moderate loss (0.5 kg / 1 lb per week)", deficit: 550 },
  { label: "Active loss (0.75 kg / 1.5 lb per week)", deficit: 825 },
  { label: "Aggressive loss (1 kg / 2 lb per week)", deficit: 1100 },
];

const DEFICIT_TIERS = [
  { label: "Conservative", range: "~275 cal/day", desc: "Minimal lifestyle change — best for those close to goal weight", dot: "bg-blue-500", bg: "bg-blue-500/5 border-blue-500/20" },
  { label: "Recommended", range: "~500 cal/day", desc: "The gold-standard deficit — sustainable with minimal muscle loss", dot: "bg-emerald-500", bg: "bg-emerald-500/5 border-emerald-500/20" },
  { label: "Moderate", range: "~750 cal/day", desc: "Faster results — requires discipline and adequate protein", dot: "bg-amber-500", bg: "bg-amber-500/5 border-amber-500/20" },
  { label: "Aggressive", range: "~1,000 cal/day", desc: "Maximum recommended — short-term only, risk of muscle loss", dot: "bg-red-500", bg: "bg-red-500/5 border-red-500/20" },
];

const faqs = [
  {
    q: "What is a calorie deficit?",
    a: "A calorie deficit occurs when you consume fewer calories than your body burns in a day. Your body then turns to stored fat for energy, resulting in weight loss over time. A deficit of 7,700 calories is needed to lose approximately 1 kg (3,500 calories per pound).",
  },
  {
    q: "How is TDEE calculated?",
    a: "Total Daily Energy Expenditure (TDEE) is calculated using the Mifflin-St Jeor formula for Basal Metabolic Rate (BMR), then multiplied by an activity factor. BMR represents calories burned at complete rest, while the activity multiplier accounts for movement and exercise.",
  },
  {
    q: "Is a 500-calorie deficit safe?",
    a: "Yes, a 500-calorie daily deficit is widely considered safe and sustainable. It produces roughly 0.5 kg (1 lb) of weight loss per week. Deficits larger than 1,000 calories/day are generally not recommended without medical supervision as they can cause muscle loss and nutrient deficiencies.",
  },
  {
    q: "Should I eat back exercise calories?",
    a: "This calculator already accounts for your activity level in your TDEE. If you selected the correct activity level, you do not need to eat back exercise calories. However, on unusually intense workout days, eating back 50–75% of those calories is reasonable.",
  },
  {
    q: "How long will it take to reach my goal weight?",
    a: "Divide the total weight you want to lose by your weekly loss rate. For example, losing 10 kg at 0.5 kg/week takes about 20 weeks. Actual progress may vary due to water retention, hormones, and individual metabolism.",
  },
  {
    q: "What is the minimum calorie intake?",
    a: "Health authorities generally recommend no fewer than 1,200 calories/day for women and 1,500 calories/day for men to ensure adequate nutrition. Going below these thresholds can slow metabolism and deprive the body of essential nutrients.",
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

const relatedTools = [
  { label: "BMI Calculator", href: "/health/bmi-calculator", color: "59 130 246" },
  { label: "TDEE Calculator", href: "/health/tdee-calculator", color: "239 68 68" },
  { label: "Macro Calculator", href: "/health/macro-nutrient-calculator", color: "139 92 246" },
  { label: "Protein Intake", href: "/health/protein-intake-calculator", color: "16 185 129" },
  { label: "Ideal Weight", href: "/health/ideal-weight-calculator", color: "245 158 11" },
];

const tocItems = [
  { label: "Overview", href: "#overview" },
  { label: "Calculator", href: "#calculator" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Deficit Guide", href: "#deficit-guide" },
  { label: "Quick Examples", href: "#examples" },
  { label: "Why Use This", href: "#why-use" },
  { label: "FAQ", href: "#faq" },
];

export default function CalorieDeficitCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [activity, setActivity] = useState(1.55);
  const [goalDeficit, setGoalDeficit] = useState(550);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    let h = 0;
    if (unit === "metric") {
      h = parseFloat(height);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      h = ft * 30.48 + inches * 2.54;
    }
    const wKg = unit === "imperial" ? w * 0.453592 : w;
    if (!a || !wKg || !h || a <= 0 || wKg <= 0 || h <= 0) return null;

    // Mifflin-St Jeor
    const bmr = sex === "male"
      ? 10 * wKg + 6.25 * h - 5 * a + 5
      : 10 * wKg + 6.25 * h - 5 * a - 161;

    const tdee = bmr * activity;
    const targetCalories = tdee - goalDeficit;
    const weeklyLoss = (goalDeficit * 7) / 7700; // kg
    const weeklyLossLb = weeklyLoss * 2.20462;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      weeklyLossKg: weeklyLoss.toFixed(2),
      weeklyLossLb: weeklyLossLb.toFixed(2),
      deficit: goalDeficit,
      macroProtein: Math.round((targetCalories * 0.3) / 4),
      macroCarbs: Math.round((targetCalories * 0.4) / 4),
      macroFat: Math.round((targetCalories * 0.3) / 9),
    };
  }, [age, sex, weight, height, heightFt, heightIn, unit, activity, goalDeficit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Calorie Deficit Calculator – Find Your Weight Loss Calories"
        description="Calculate the exact calorie deficit needed to lose weight at your chosen pace. Uses Mifflin-St Jeor formula for accurate TDEE and daily calorie targets."
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4 px-4 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/health" className="hover:text-orange-500 transition-colors">Health &amp; Fitness</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Calorie Deficit Calculator</li>
        </ol>
      </nav>

      {/* Hero */}
      <section id="overview" className="mb-8 px-4 lg:px-0">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
          <TrendingDown className="w-4 h-4" />
          Health &amp; Fitness · Mifflin-St Jeor Formula
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Calorie Deficit Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Find out exactly how many calories to eat per day to lose weight safely and sustainably.
          Based on your TDEE using the Mifflin-St Jeor formula with personalized macro targets.
        </p>

        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { value: "7,700", label: "cal = 1 kg fat", sub: "3,500 cal per lb" },
            { value: "500", label: "cal recommended", sub: "deficit per day" },
            { value: "0.5 kg", label: "per week loss", sub: "at 500 cal deficit" },
            { value: "1,200+", label: "cal minimum", sub: "for women (safety)" },
          ].map((s) => (
            <div key={s.label} className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{s.value}</p>
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
              <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-t-xl" />
              <div className="p-6">
                {/* Unit Toggle */}
                <div className="flex gap-2 mb-6">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${unit === u ? "bg-orange-500 text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Age (years)</label>
                    <input type="number" min="15" max="100" value={age} onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 30" className="tool-calc-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Biological sex</label>
                    <div className="flex gap-2">
                      {(["male", "female"] as const).map((s) => (
                        <button key={s} onClick={() => setSex(s)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${sex === s ? "bg-orange-500/10 border-orange-400 text-orange-700 dark:text-orange-300" : "bg-muted border-border text-muted-foreground hover:border-orange-300"}`}>
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">Activity level</label>
                  <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="tool-calc-input">
                    {ACTIVITY_LEVELS.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-1">Weight loss goal</label>
                  <select value={goalDeficit} onChange={(e) => setGoalDeficit(parseInt(e.target.value))} className="tool-calc-input">
                    {GOALS.map((g) => (
                      <option key={g.deficit} value={g.deficit}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      {/* Primary result */}
                      <div className="tool-calc-result bg-orange-500/5 border-orange-500/20 text-center">
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1 flex items-center justify-center gap-1.5">
                          <Flame className="w-4 h-4" /> Daily Calorie Target
                        </p>
                        <p className="text-5xl font-bold text-orange-600 dark:text-orange-400">
                          {result.targetCalories.toLocaleString()}
                          <span className="text-2xl font-medium ml-1">cal/day</span>
                        </p>
                        <p className="text-sm text-orange-500 mt-1">
                          {result.deficit} calorie deficit from your TDEE ({result.tdee.toLocaleString()} cal)
                        </p>
                      </div>

                      {/* TDEE / BMR breakdown */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "BMR", value: result.bmr.toLocaleString(), sub: "calories at rest", icon: <Scale className="w-4 h-4" /> },
                          { label: "TDEE", value: result.tdee.toLocaleString(), sub: "maintenance calories", icon: <Flame className="w-4 h-4" /> },
                          { label: "Weekly Loss", value: `${result.weeklyLossKg} kg`, sub: `${result.weeklyLossLb} lbs`, icon: <TrendingDown className="w-4 h-4" /> },
                        ].map((item) => (
                          <div key={item.label} className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-center">
                            <div className="text-orange-500 flex justify-center mb-1">{item.icon}</div>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-lg font-bold text-foreground">{item.value}</p>
                            <p className="text-xs text-muted-foreground">{item.sub}</p>
                          </div>
                        ))}
                      </div>

                      {/* Macro breakdown */}
                      <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4">
                        <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-1.5">
                          <Info className="w-4 h-4" /> Suggested macro split (30/40/30)
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          {[
                            { label: "Protein", value: result.macroProtein, color: "text-blue-500", bg: "bg-blue-500/5 border border-blue-500/10" },
                            { label: "Carbs", value: result.macroCarbs, color: "text-amber-500", bg: "bg-amber-500/5 border border-amber-500/10" },
                            { label: "Fat", value: result.macroFat, color: "text-rose-500", bg: "bg-rose-500/5 border border-rose-500/10" },
                          ].map((m) => (
                            <div key={m.label} className={`${m.bg} rounded-lg p-2`}>
                              <p className={`text-xl font-bold ${m.color}`}>{m.value}g</p>
                              <p className="text-xs text-muted-foreground">{m.label}/day</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Adjust macros based on preference. Protein minimum: 1.6 g/kg body weight.
                        </p>
                      </div>

                      {result.targetCalories < 1200 && (
                        <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/20 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
                          <Info className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>Warning: Your target is below 1,200 calories. Consider a less aggressive goal or consult a healthcare professional.</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works">
            <h2 className="text-2xl font-bold text-foreground mb-4">How the Calorie Deficit Calculator Works</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This calculator uses the <strong className="text-foreground">Mifflin-St Jeor equation</strong> — the most validated
              formula for estimating Basal Metabolic Rate (BMR), recommended by the Academy of Nutrition and Dietetics.
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
            <p className="text-muted-foreground text-sm leading-relaxed">
              W = weight (kg), H = height (cm), A = age (years). TDEE = BMR × activity multiplier.
              Your calorie target = TDEE − chosen deficit. The macro split (30/40/30 protein/carbs/fat) is a starting recommendation — adjust based on your goals and preferences.
            </p>
          </section>

          {/* Deficit Guide */}
          <section id="deficit-guide">
            <h2 className="text-2xl font-bold text-foreground mb-4">Choosing the Right Deficit Size</h2>
            <div className="space-y-3">
              {DEFICIT_TIERS.map((t) => (
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Deficit Size Quick Reference</h2>
            <p className="text-muted-foreground text-sm mb-4">Expected weekly weight loss by deficit size and duration.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-orange-500/10">
                    <th className="border border-orange-500/20 px-4 py-2 text-left font-semibold text-foreground">Goal</th>
                    <th className="border border-orange-500/20 px-4 py-2 text-left font-semibold text-foreground">Daily Deficit</th>
                    <th className="border border-orange-500/20 px-4 py-2 text-left font-semibold text-foreground">Weekly Loss</th>
                    <th className="border border-orange-500/20 px-4 py-2 text-left font-semibold text-foreground">10 kg in</th>
                    <th className="border border-orange-500/20 px-4 py-2 text-left font-semibold text-foreground">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Mild", "~275 cal", "0.25 kg / 0.5 lb", "~40 weeks", "Minimal lifestyle change"],
                    ["Moderate", "~500 cal", "0.5 kg / 1 lb", "~20 weeks", "Most people (recommended)"],
                    ["Active", "~750 cal", "0.75 kg / 1.5 lb", "~13 weeks", "Faster results, needs discipline"],
                    ["Aggressive", "~1,000 cal", "1 kg / 2 lb", "~10 weeks", "Short-term with medical guidance"],
                  ].map(([g, d, w, t, b]) => (
                    <tr key={g} className="odd:bg-background even:bg-muted/30">
                      <td className="border border-border px-4 py-2 font-medium text-foreground">{g}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{d}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{w}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{t}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground text-xs">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why Use This */}
          <section id="why-use">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Use This Calorie Deficit Calculator</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Gold-standard formula", desc: "Uses the Mifflin-St Jeor equation — the most accurate BMR predictor, validated across diverse populations." },
                { title: "4 deficit levels", desc: "From mild to aggressive — choose the pace that fits your lifestyle, with realistic weekly loss projections." },
                { title: "Built-in macro targets", desc: "Get a suggested 30/40/30 protein/carbs/fat split calculated from your personal calorie target." },
                { title: "Safety warnings", desc: "Automatically flags targets below safe minimums (1,200 cal for women, 1,500 for men)." },
                { title: "Metric & imperial", desc: "Works with kg/cm or lbs/ft. Automatic unit conversion — no manual math required." },
                { title: "Completely private", desc: "All calculations happen in your browser. No data is stored, shared, or sent to any server." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
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
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Ready to build your full plan?</h3>
            <p className="text-muted-foreground text-sm mb-4">Calculate your full macro targets, check your BMI, or explore all health tools.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/health/macro-nutrient-calculator"
                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-medium text-sm hover:bg-orange-600 transition-colors">
                Macro Calculator →
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
                  <Link href={t.href} className="flex items-center gap-3 text-sm text-foreground hover:text-orange-500 transition-colors">
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
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-orange-500 transition-colors block py-0.5">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Reference */}
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-5">
            <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Quick Reference
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { label: "1 lb fat", value: "≈ 3,500 cal" },
                { label: "1 kg fat", value: "≈ 7,700 cal" },
                { label: "Min (women)", value: "1,200 cal/day" },
                { label: "Min (men)", value: "1,500 cal/day" },
                { label: "Protein", value: "4 cal/g" },
                { label: "Carbs", value: "4 cal/g" },
                { label: "Fat", value: "9 cal/g" },
              ].map((r) => (
                <li key={r.label} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-mono font-semibold text-orange-600 dark:text-orange-400 text-xs">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
