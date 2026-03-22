import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Sex = "male" | "female";
type Unit = "metric" | "imperial";
type Formula = "mifflin" | "harris";

// Activity level multipliers (TDEE)
const ACTIVITY_LEVELS = [
  { key: "sedentary",   label: "Sedentary",              desc: "Little or no exercise, desk job",              factor: 1.2 },
  { key: "light",       label: "Lightly Active",         desc: "Light exercise/sports 1–3 days/week",          factor: 1.375 },
  { key: "moderate",    label: "Moderately Active",      desc: "Moderate exercise 3–5 days/week",              factor: 1.55 },
  { key: "very",        label: "Very Active",            desc: "Hard exercise 6–7 days/week",                  factor: 1.725 },
  { key: "extra",       label: "Extra Active",           desc: "Very hard exercise + physical job or 2x/day",  factor: 1.9 },
];

const GOALS = [
  { key: "lose2",   label: "Lose 2 lbs/week",   delta: -1000 },
  { key: "lose1",   label: "Lose 1 lb/week",    delta: -500 },
  { key: "lose0.5", label: "Lose 0.5 lb/week",  delta: -250 },
  { key: "maintain",label: "Maintain weight",   delta: 0 },
  { key: "gain0.5", label: "Gain 0.5 lb/week",  delta: 250 },
  { key: "gain1",   label: "Gain 1 lb/week",    delta: 500 },
];

function calcBMR(sex: Sex, age: number, weightKg: number, heightCm: number, formula: Formula): number {
  if (formula === "mifflin") {
    return sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  // Harris-Benedict (revised)
  return sex === "male"
    ? 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362
    : 9.247 * weightKg + 3.098 * heightCm - 4.330 * age + 447.593;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-4 text-[hsl(var(--muted-foreground))] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  { q: "How many calories do I need per day?", a: "The average adult needs 1,600–2,400 calories/day (women) or 2,000–3,000 calories/day (men), depending on age, weight, height, and activity level. Use this calculator for a personalized estimate based on your BMR and activity factor." },
  { q: "What is BMR (Basal Metabolic Rate)?", a: "BMR is the number of calories your body burns at complete rest to maintain basic life functions — breathing, circulation, cell production. It accounts for 60–75% of total daily calorie expenditure." },
  { q: "What is TDEE (Total Daily Energy Expenditure)?", a: "TDEE = BMR × Activity Factor. It represents all calories burned in a day including exercise and daily movement. To maintain weight, eat at your TDEE. To lose weight, eat below it (deficit); to gain, eat above it (surplus)." },
  { q: "How fast is safe weight loss?", a: "0.5–1 lb (0.25–0.5 kg) per week is generally considered safe and sustainable. 1 lb of fat ≈ 3,500 calories, so a daily deficit of 500 calories produces ~1 lb/week weight loss." },
  { q: "What is the Mifflin-St Jeor equation?", a: "Mifflin-St Jeor (1990) is the most widely validated BMR formula: Males: (10×weight kg) + (6.25×height cm) − (5×age) + 5. Females: (10×weight kg) + (6.25×height cm) − (5×age) − 161. It is more accurate than the older Harris-Benedict equation for most people." },
  { q: "Does this calculator account for muscle mass?", a: "Standard BMR formulas use only weight, height, age, and sex — they do not factor in body composition. People with higher muscle mass have higher actual BMR, while formulas may underestimate for muscular individuals and overestimate for those with higher body fat." },
];

const MACRO_TABLE = [
  ["Weight Loss",   "10–30% deficit", "High protein (30–35%)", "Moderate fat (25–35%)", "Lower carb (30–45%)"],
  ["Maintenance",   "At TDEE",        "Moderate protein (20–25%)", "Moderate fat (25–35%)", "Moderate carb (45–55%)"],
  ["Muscle Gain",   "5–15% surplus",  "High protein (25–35%)", "Moderate fat (25–30%)", "Higher carb (40–50%)"],
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Calorie Calculator", "description": "Free online calorie calculator. Calculate daily calorie needs (TDEE) based on BMR, activity level, and weight goal.", "applicationCategory": "HealthApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    { "@type": "FAQPage", "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
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

  return (
    <>
      <Helmet>
        <title>Calorie Calculator – Daily Calorie Needs & TDEE | US Online Tools</title>
        <meta name="description" content="Free online calorie calculator. Calculate your daily calorie needs (TDEE) based on BMR, activity level, and weight goal using Mifflin-St Jeor or Harris-Benedict formula." />
        <meta name="keywords" content="calorie calculator, TDEE calculator, BMR calculator, daily calorie needs, how many calories per day, weight loss calories, calorie deficit calculator" />
        <link rel="canonical" href="https://us-online.tools/health/calorie-calculator" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "16"} as React.CSSProperties}>

        <section className="bg-gradient-to-br from-[hsl(16,70%,22%)] to-[hsl(16,60%,32%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Calorie Calculator</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Calculate your daily calorie needs (TDEE) and see exactly how much to eat to lose weight, maintain, or build muscle.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* Quick Answer */}
          <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-2xl p-5">
            <h2 className="font-bold text-orange-800 dark:text-orange-300 mb-2">⚡ Quick Answer: Average Daily Calorie Needs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { label: "Sedentary woman", cal: "~1,800" },
                { label: "Active woman",    cal: "~2,200" },
                { label: "Sedentary man",   cal: "~2,200" },
                { label: "Active man",      cal: "~2,800" },
              ].map(i => (
                <div key={i.label} className="bg-white/60 dark:bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-orange-700 dark:text-orange-300">{i.label}</p>
                  <p className="font-bold text-lg text-orange-900 dark:text-orange-100">{i.cal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="tool-calc-card rounded-2xl p-6 md:p-8 shadow-xl">
            {/* Unit Toggle */}
            <div className="flex gap-2 mb-6">
              {(["imperial", "metric"] as Unit[]).map(u => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${unit === u ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"}`}>
                  {u}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Sex */}
              <div>
                <label className="block text-sm font-semibold mb-1">Biological Sex</label>
                <div className="flex gap-2">
                  {(["male", "female"] as Sex[]).map(s => (
                    <button key={s} onClick={() => setSex(s)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all capitalize ${sex === s ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "tool-calc-result"}`}>
                      {s === "male" ? "♂ Male" : "♀ Female"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold mb-1">Age (years)</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} min="10" max="100" className="tool-calc-input w-full text-xl" />
              </div>

              {/* Weight */}
              {unit === "imperial" ? (
                <div>
                  <label className="block text-sm font-semibold mb-1">Weight (lbs)</label>
                  <input type="number" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} className="tool-calc-input w-full text-xl" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-1">Weight (kg)</label>
                  <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="tool-calc-input w-full text-xl" />
                </div>
              )}

              {/* Height */}
              {unit === "imperial" ? (
                <div>
                  <label className="block text-sm font-semibold mb-1">Height</label>
                  <div className="flex gap-2">
                    <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} className="tool-calc-input w-full text-xl" placeholder="ft" min="1" max="8" />
                    <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} className="tool-calc-input w-full text-xl" placeholder="in" min="0" max="11" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-1">Height (cm)</label>
                  <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} className="tool-calc-input w-full text-xl" />
                </div>
              )}
            </div>

            {/* Activity Level */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2">Activity Level</label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map(al => (
                  <button key={al.key} onClick={() => setActivity(al.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${activity === al.key ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"}`}>
                    <span className="font-semibold text-sm">{al.label}</span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))] ml-2">— {al.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formula */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">BMR Formula</label>
              <div className="flex gap-2">
                {([["mifflin", "Mifflin-St Jeor (Recommended)"], ["harris", "Harris-Benedict (Revised)"]] as [Formula, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setFormula(key)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center ${formula === key ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {results ? (
              <div className="space-y-5">
                {/* BMR + TDEE highlight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="tool-calc-result rounded-2xl p-5 text-center">
                    <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] mb-1">Basal Metabolic Rate (BMR)</p>
                    <p className="tool-calc-number text-4xl font-extrabold">{results.bmr.toLocaleString()}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">calories/day at rest</p>
                  </div>
                  <div className="bg-[hsl(16,80%,50%)] text-white rounded-2xl p-5 text-center">
                    <p className="text-xs font-semibold text-white/80 mb-1">Total Daily Energy (TDEE)</p>
                    <p className="text-4xl font-extrabold">{results.tdee.toLocaleString()}</p>
                    <p className="text-xs text-white/80 mt-1">calories/day to maintain weight</p>
                  </div>
                </div>

                {/* Goal Calories */}
                <div>
                  <h3 className="font-bold text-sm text-[hsl(var(--muted-foreground))] mb-3">CALORIES BY GOAL</h3>
                  <div className="space-y-2">
                    {results.goals.map(g => (
                      <div key={g.key} className={`flex items-center justify-between px-4 py-3 rounded-xl ${g.key === "maintain" ? "bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/30" : "tool-calc-result"}`}>
                        <span className="text-sm font-medium">{g.label}</span>
                        <div className="text-right">
                          <span className="tool-calc-number font-bold">{Math.max(0, g.calories).toLocaleString()}</span>
                          <span className="text-xs text-[hsl(var(--muted-foreground))] ml-1">cal/day</span>
                          {g.delta !== 0 && <span className={`text-xs ml-2 ${g.delta < 0 ? "text-red-500" : "text-green-500"}`}>({g.delta > 0 ? "+" : ""}{g.delta})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
                  These are estimates. Consult a healthcare professional before making significant dietary changes.
                </p>
              </div>
            ) : (
              <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Fill in your details above to calculate your calorie needs.</p>
            )}
          </div>

          {/* Macro Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Macro Breakdown by Goal</h2>
            <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="w-full text-sm">
                <thead className="bg-[hsl(var(--muted))]">
                  <tr>{["Goal", "Calories", "Protein", "Fat", "Carbs"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {MACRO_TABLE.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-[hsl(var(--background))]" : "bg-[hsl(var(--muted))/30]"}>
                      {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">Understanding Calorie Needs</h2>
            <p>Your <strong>Total Daily Energy Expenditure (TDEE)</strong> is the total calories your body burns each day. It's calculated by multiplying your Basal Metabolic Rate (BMR) by an activity factor.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Mifflin-St Jeor Formula (Most Accurate)</h3>
            <div className="tool-calc-result rounded-xl p-4 my-3 font-mono text-sm">
              <p>Men:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5</p>
              <p>Women: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161</p>
            </div>
            <p>A 2005 systematic review found Mifflin-St Jeor to be the most accurate formula for predicting BMR in both normal-weight and overweight individuals.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Calorie Deficit for Weight Loss</h3>
            <p>1 pound of fat contains approximately 3,500 calories. To lose 1 lb/week, create a daily deficit of 500 calories. To lose 0.5 lb/week, a 250-calorie deficit is sufficient and easier to sustain long-term.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Factors That Affect Calorie Needs</h3>
            <ul>
              <li><strong>Age:</strong> BMR typically decreases ~2% per decade after 20.</li>
              <li><strong>Muscle mass:</strong> More muscle = higher BMR.</li>
              <li><strong>Hormones:</strong> Thyroid conditions and other hormonal factors affect metabolism.</li>
              <li><strong>Sleep:</strong> Poor sleep increases hunger hormones and reduces calorie burn.</li>
              <li><strong>Temperature:</strong> Cold environments slightly increase calorie expenditure.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold mb-4">Related Health Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "BMI Calculator", href: "/health/bmi-calculator" },
                { label: "BMR Calculator", href: "/health/bmr-calculator" },
                { label: "Body Fat Calculator", href: "/health/body-fat-calculator" },
                { label: "Age Calculator", href: "/time-date/age-calculator" },
                { label: "Weight Converter", href: "/conversion/weight-converter" },
              ].map(t => (
                <a key={t.href} href={t.href} className="px-4 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium">{t.label}</a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
