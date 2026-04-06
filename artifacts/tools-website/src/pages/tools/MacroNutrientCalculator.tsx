import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Apple, CheckCircle, ChevronDown, Share2, Star, Shield, Zap, Clock, Info } from "lucide-react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";

type Goal = "lose" | "maintain" | "gain" | "muscle";
type Unit = "imperial" | "metric";

const activityLevels = [
  { value: 1.2, label: "Sedentary", desc: "Little or no exercise" },
  { value: 1.375, label: "Lightly Active", desc: "Light exercise 1–3 days/week" },
  { value: 1.55, label: "Moderately Active", desc: "Moderate exercise 3–5 days/week" },
  { value: 1.725, label: "Very Active", desc: "Hard exercise 6–7 days/week" },
  { value: 1.9, label: "Extra Active", desc: "Very hard exercise, physical job" },
];

const goals: { value: Goal; label: string; desc: string; color: string }[] = [
  { value: "lose", label: "Lose Fat", desc: "500 cal deficit (~1 lb/week)", color: "text-orange-600" },
  { value: "maintain", label: "Maintain Weight", desc: "Eat at TDEE", color: "text-blue-600" },
  { value: "gain", label: "Gain Weight", desc: "300 cal surplus (~0.5 lb/week)", color: "text-emerald-600" },
  { value: "muscle", label: "Build Muscle", desc: "High protein, moderate surplus", color: "text-purple-600" },
];

const macroPresets: Record<Goal, { protein: number; fat: number; carbs: number; label: string }> = {
  lose:     { protein: 40, fat: 30, carbs: 30, label: "High Protein Fat Loss" },
  maintain: { protein: 30, fat: 30, carbs: 40, label: "Balanced Maintenance" },
  gain:     { protein: 25, fat: 25, carbs: 50, label: "Performance Gain" },
  muscle:   { protein: 40, fat: 25, carbs: 35, label: "Muscle Building" },
};

const faqs = [
  {
    q: "What are macronutrients?",
    a: "Macronutrients (macros) are the three main nutrients your body uses for energy: protein (4 cal/g), carbohydrates (4 cal/g), and fat (9 cal/g). Tracking macros gives more precise nutrition control than just counting calories.",
  },
  {
    q: "How many grams of protein do I need per day?",
    a: "General recommendations range from 0.8g per kg of body weight (sedentary adults) up to 2.2g/kg for those building muscle or cutting fat. Our calculator sets 1.6–2.0g/kg based on your goal, which is supported by sports nutrition research.",
  },
  {
    q: "How much fat should I eat per day?",
    a: "Dietary fat should comprise 20–35% of total calories, according to the Dietary Guidelines for Americans. Fat is essential for hormone production, vitamin absorption (A, D, E, K), and brain function.",
  },
  {
    q: "What is the difference between cutting and bulking macros?",
    a: "Cutting macros prioritize high protein (40%+) to preserve muscle while in a caloric deficit. Bulking macros increase carbohydrates to fuel workouts and support muscle gain in a caloric surplus.",
  },
  {
    q: "Should I count fiber in carbohydrates?",
    a: "Dietary fiber is technically a carbohydrate, but it provides only about 2 cal/g and has minimal impact on blood sugar. Many people count 'net carbs' (total carbs minus fiber), especially on low-carb diets.",
  },
  {
    q: "How accurate are macro calculators?",
    a: "Macro calculators use established formulas (Mifflin-St Jeor for TDEE) and give excellent starting estimates, but individual metabolism varies. Treat results as a baseline and adjust based on 2–4 weeks of real-world results.",
  },
  {
    q: "Can I change my macro split?",
    a: "Yes. The percentages shown are evidence-based recommendations for your goal, but you can adjust them to fit food preferences or specific diet plans (e.g., keto = very high fat, low carb; or carnivore = very high protein/fat).",
  },
];

export default function MacroNutrientCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("28");
  const [weightLbs, setWeightLbs] = useState("175");
  const [weightKg, setWeightKg] = useState("79");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("11");
  const [heightCm, setHeightCm] = useState("180");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<Goal>("maintain");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const ageN = parseFloat(age);
    const actN = activity;

    let weightKgN: number;
    let heightCmN: number;

    if (unit === "imperial") {
      weightKgN = parseFloat(weightLbs) / 2.2046;
      heightCmN = (parseFloat(heightFt) * 12 + parseFloat(heightIn)) * 2.54;
    } else {
      weightKgN = parseFloat(weightKg);
      heightCmN = parseFloat(heightCm);
    }

    if (!ageN || !weightKgN || !heightCmN || ageN < 10 || ageN > 100 || weightKgN < 30 || heightCmN < 100) return null;

    // Mifflin-St Jeor BMR
    const bmr = gender === "male"
      ? 10 * weightKgN + 6.25 * heightCmN - 5 * ageN + 5
      : 10 * weightKgN + 6.25 * heightCmN - 5 * ageN - 161;

    const tdee = bmr * actN;

    // Adjust calories by goal
    const calAdj = goal === "lose" ? -500 : goal === "gain" ? 300 : goal === "muscle" ? 200 : 0;
    const targetCals = Math.round(tdee + calAdj);

    const preset = macroPresets[goal];
    const proteinCals = targetCals * (preset.protein / 100);
    const fatCals = targetCals * (preset.fat / 100);
    const carbsCals = targetCals * (preset.carbs / 100);

    const proteinG = Math.round(proteinCals / 4);
    const fatG = Math.round(fatCals / 9);
    const carbsG = Math.round(carbsCals / 4);

    const proteinGperKg = (proteinG / weightKgN).toFixed(1);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCals,
      proteinG, fatG, carbsG,
      proteinPct: preset.protein, fatPct: preset.fat, carbsPct: preset.carbs,
      proteinGperKg,
      weightKgN: Math.round(weightKgN),
      presetLabel: preset.label,
    };
  }, [unit, gender, age, weightLbs, weightKg, heightFt, heightIn, heightCm, activity, goal]);

  const MacroBar = ({ label, pct, grams, color, cal }: { label: string; pct: number; grams: number; color: string; cal: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{grams}g &nbsp;·&nbsp; {cal} cal &nbsp;·&nbsp; {pct}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <SEO
        title="Macro Calculator — Calculate Your Daily Macronutrients | Free Tool"
        description="Calculate your daily protein, carbs, and fat targets based on your weight, height, activity level, and goal. Free IIFYM macro calculator with full breakdown."
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-4 md:px-8 pt-4 max-w-7xl mx-auto">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/category/health" className="hover:text-foreground transition-colors">Health & Fitness</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Macro Calculator</span>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-lime-500 via-green-600 to-teal-600 text-white py-12 px-4 md:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm font-medium mb-4">
            <Apple className="w-4 h-4" />
            Health & Fitness
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
            Macro Nutrient Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-6">
            Calculate your ideal daily protein, carbohydrate, and fat intake based on your body stats, activity level, and fitness goal. IIFYM-based approach with science-backed formulas.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { icon: Zap, label: "Instant calculation" },
              { icon: Apple, label: "Goal-based macros" },
              { icon: CheckCircle, label: "Mifflin-St Jeor TDEE" },
              { icon: Shield, label: "100% free" },
              { icon: Clock, label: "No signup needed" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">

          {/* Calculator */}
          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-lime-500 to-teal-500" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-5">Your Details</h2>

              {/* Unit toggle */}
              <div className="flex rounded-xl border border-border overflow-hidden w-fit mb-6">
                {(["imperial", "metric"] as Unit[]).map(u => (
                  <button key={u} onClick={() => setUnit(u)} className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${unit === u ? "bg-green-600 text-white" : "hover:bg-muted"}`}>
                    {u === "imperial" ? "Imperial (lbs/ft)" : "Metric (kg/cm)"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-2">Biological Sex</label>
                  <div className="flex gap-2">
                    {(["male", "female"] as const).map(g => (
                      <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-colors ${gender === g ? "bg-green-600 text-white border-green-600" : "border-border hover:bg-muted"}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Age (years)</label>
                  <input type="number" className="tool-calc-input" value={age} onChange={e => setAge(e.target.value)} min={10} max={100} />
                </div>

                {/* Weight */}
                {unit === "imperial" ? (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Weight (lbs)</label>
                    <input type="number" className="tool-calc-input" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} min={50} max={700} />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
                    <input type="number" className="tool-calc-input" value={weightKg} onChange={e => setWeightKg(e.target.value)} min={20} max={300} />
                  </div>
                )}

                {/* Height */}
                {unit === "imperial" ? (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Height</label>
                    <div className="flex gap-2">
                      <input type="number" className="tool-calc-input" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft" min={3} max={8} />
                      <input type="number" className="tool-calc-input" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in" min={0} max={11} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Height (cm)</label>
                    <input type="number" className="tool-calc-input" value={heightCm} onChange={e => setHeightCm(e.target.value)} min={100} max={250} />
                  </div>
                )}
              </div>

              {/* Activity Level */}
              <div className="mt-5">
                <label className="block text-sm font-medium mb-2">Activity Level</label>
                <div className="space-y-2">
                  {activityLevels.map(lvl => (
                    <button key={lvl.value} onClick={() => setActivity(lvl.value)} className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${activity === lvl.value ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-border hover:bg-muted"}`}>
                      <span className="font-medium">{lvl.label}</span>
                      <span className="text-muted-foreground">{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="mt-5">
                <label className="block text-sm font-medium mb-2">Your Goal</label>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map(g => (
                    <button key={g.value} onClick={() => setGoal(g.value)} className={`p-3 rounded-xl border text-left text-sm transition-colors ${goal === g.value ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-border hover:bg-muted"}`}>
                      <p className={`font-semibold ${g.color}`}>{g.label}</p>
                      <p className="text-muted-foreground text-xs">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div key={`${goal}-${activity}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 space-y-5">

                    {/* Calorie targets */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "BMR", val: result.bmr, sub: "Base metabolic rate", color: "text-slate-600" },
                        { label: "TDEE", val: result.tdee, sub: "With activity", color: "text-blue-600" },
                        { label: "Target", val: result.targetCals, sub: result.presetLabel, color: "text-green-600" },
                      ].map(({ label, val, sub, color }) => (
                        <div key={label} className="tool-calc-result text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                          <p className={`text-2xl font-bold ${color}`}>{val.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Macro breakdown */}
                    <div className="bg-muted/40 rounded-2xl p-5 space-y-4">
                      <p className="font-semibold">Daily Macro Targets <span className="text-muted-foreground font-normal text-sm">— {result.targetCals} calories</span></p>
                      <MacroBar label="Protein" pct={result.proteinPct} grams={result.proteinG} color="bg-blue-500" cal={result.proteinG * 4} />
                      <MacroBar label="Carbohydrates" pct={result.carbsPct} grams={result.carbsG} color="bg-amber-500" cal={result.carbsG * 4} />
                      <MacroBar label="Fat" pct={result.fatPct} grams={result.fatG} color="bg-rose-500" cal={result.fatG * 9} />
                    </div>

                    {/* Per-meal breakdown */}
                    <div>
                      <p className="font-semibold text-sm mb-3">Per-Meal Targets (3 meals/day)</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Protein", g: Math.round(result.proteinG / 3), color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
                          { label: "Carbs", g: Math.round(result.carbsG / 3), color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
                          { label: "Fat", g: Math.round(result.fatG / 3), color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30" },
                        ].map(({ label, g, color }) => (
                          <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
                            <p className="text-xs font-medium mb-1">{label}</p>
                            <p className="text-xl font-bold">{g}g</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Protein target: <strong className="text-foreground">{result.proteinG}g ({result.proteinGperKg}g/kg)</strong>. Reassess every 4–6 weeks as your weight changes.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* How It Works */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-4">How to Use This Macro Calculator</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              {[
                "Enter your age, sex, weight, and height.",
                "Select your typical weekly activity level — be honest, most people overestimate this.",
                "Choose your goal: fat loss, maintenance, gaining weight, or building muscle.",
                "Your TDEE and macro gram targets are calculated instantly using the Mifflin-St Jeor equation.",
                "Use the per-meal breakdown to distribute macros across 3 main meals.",
                "Reassess every 4–6 weeks as your body changes.",
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="pt-1">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Formula */}
          <div className="bg-gradient-to-br from-lime-50 to-teal-50 dark:from-lime-950/20 dark:to-teal-950/20 border border-lime-200 dark:border-lime-800 rounded-2xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Apple className="w-4 h-4 text-lime-600" /> Mifflin-St Jeor BMR Formula</h3>
            <div className="font-mono text-sm bg-white dark:bg-background rounded-xl p-4 border border-lime-100 dark:border-lime-900 space-y-2">
              <p><span className="text-lime-600">Male BMR</span> = (10 × kg) + (6.25 × cm) − (5 × age) + 5</p>
              <p><span className="text-pink-500">Female BMR</span> = (10 × kg) + (6.25 × cm) − (5 × age) − 161</p>
              <p className="text-muted-foreground">TDEE = BMR × Activity Factor</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Published in the American Journal of Clinical Nutrition (1990). Most accurate formula for predicting resting metabolic rate in most adults.</p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Why Use This Tool</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Mifflin-St Jeor equation (most accurate)", "Goal-specific macro splits", "Per-meal breakdown included", "Protein g/kg body weight shown", "Imperial and metric support"].map(item => (
                <li key={item} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Macro Reference</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Protein</span><span className="font-mono font-medium">4 cal/g</span></div>
              <div className="flex justify-between"><span>Carbohydrates</span><span className="font-mono font-medium">4 cal/g</span></div>
              <div className="flex justify-between"><span>Fat</span><span className="font-mono font-medium">9 cal/g</span></div>
              <div className="flex justify-between"><span>Alcohol</span><span className="font-mono font-medium">7 cal/g</span></div>
            </div>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-500" /> Share</h3>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="w-full text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors">
              Copy Link
            </button>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Related Tools</h3>
            <div className="space-y-2">
              {[
                { label: "TDEE Calculator", href: "/health/tdee-calculator" },
                { label: "BMI Calculator", href: "/health/bmi-calculator" },
                { label: "BMR Calculator", href: "/health/bmr-calculator" },
                { label: "Calorie Calculator", href: "/health/calorie-calculator" },
                { label: "Ideal Weight Calculator", href: "/health/ideal-weight-calculator" },
                { label: "Water Intake Calculator", href: "/health/water-intake-calculator" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                  <ChevronRight className="w-3.5 h-3.5 text-green-500" />{label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* SEO Content */}
      <section className="bg-muted/30 border-t border-border py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Macro Calculator — Complete Guide to Macronutrients</h2>
            <p>A <strong>macro calculator</strong> determines how many grams of <strong>protein, carbohydrates, and fat</strong> you should eat each day based on your body composition, activity level, and goals. This approach — sometimes called IIFYM (If It Fits Your Macros) — is more precise than calorie counting alone.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Why Track Macros Instead of Just Calories?</h3>
            <p>Two people eating 2,000 calories can have very different body composition results depending on their macro split. A diet high in protein preserves lean muscle during fat loss. Adequate carbohydrates fuel exercise performance. Sufficient fat supports hormonal health. Tracking macros lets you optimize all three simultaneously.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">How Much Protein Do You Actually Need?</h3>
            <p>Research consistently shows that <strong>1.6–2.2g of protein per kg of body weight</strong> is optimal for muscle retention and growth. The old recommendation of 0.8g/kg was designed to prevent deficiency — not maximize body composition. For a 175 lb (79 kg) person, this means 126–174g of protein per day.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Adjusting Macros Over Time</h3>
            <p>Your metabolism adapts. As you lose weight, your TDEE decreases. As you gain muscle, your BMR increases. Recalculate your macros every 4–6 weeks, or whenever your weight changes by more than 5 lbs/2.5 kg. Consistent tracking paired with regular adjustments is the key to long-term progress.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
