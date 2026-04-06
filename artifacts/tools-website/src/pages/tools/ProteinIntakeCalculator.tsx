import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Dumbbell, CheckCircle, ChevronDown, Share2, Star, Shield, Zap, Clock, Info } from "lucide-react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";

type Unit = "imperial" | "metric";
type Goal = "general" | "lose" | "muscle" | "athlete" | "senior";

const goals: { value: Goal; label: string; desc: string; multiplierLow: number; multiplierHigh: number }[] = [
  { value: "general", label: "General Health", desc: "Sedentary to moderately active adults", multiplierLow: 0.8, multiplierHigh: 1.0 },
  { value: "lose", label: "Fat Loss", desc: "Preserve muscle while cutting calories", multiplierLow: 1.4, multiplierHigh: 1.8 },
  { value: "muscle", label: "Build Muscle", desc: "Maximize hypertrophy and strength", multiplierLow: 1.6, multiplierHigh: 2.2 },
  { value: "athlete", label: "Endurance Athlete", desc: "Runners, cyclists, swimmers", multiplierLow: 1.2, multiplierHigh: 1.6 },
  { value: "senior", label: "Older Adults (65+)", desc: "Counter age-related muscle loss", multiplierLow: 1.0, multiplierHigh: 1.2 },
];

const foodSources = [
  { food: "Chicken breast (100g)", protein: 31 },
  { food: "Eggs (1 large)", protein: 6 },
  { food: "Greek yogurt (200g)", protein: 20 },
  { food: "Tuna (100g)", protein: 30 },
  { food: "Cottage cheese (100g)", protein: 11 },
  { food: "Beef (100g, lean)", protein: 26 },
  { food: "Lentils (cooked, 100g)", protein: 9 },
  { food: "Tofu (100g)", protein: 8 },
  { food: "Whey protein (1 scoop)", protein: 25 },
  { food: "Salmon (100g)", protein: 25 },
  { food: "Edamame (100g)", protein: 11 },
  { food: "Peanut butter (2 tbsp)", protein: 7 },
];

const faqs = [
  {
    q: "How much protein do I need per day?",
    a: "The RDA for protein is 0.8g per kg of body weight for sedentary adults. However, research consistently shows that 1.6–2.2g/kg is optimal for muscle building, while 1.4–1.8g/kg is ideal for fat loss while preserving muscle.",
  },
  {
    q: "Can I eat too much protein?",
    a: "For most healthy adults, high protein intake (up to 3g/kg/day) shows no adverse effects on kidney function in people without pre-existing kidney disease. Excess protein is simply converted to energy. The main risk is overcrowding other nutrients if protein dominates every meal.",
  },
  {
    q: "What are the best protein sources?",
    a: "Complete protein sources with all essential amino acids include: chicken, fish, eggs, dairy, beef, and soy. Incomplete sources (missing some amino acids) include legumes, nuts, and grains. Combining incomplete sources (e.g., rice + beans) provides a complete amino acid profile.",
  },
  {
    q: "Is protein powder necessary for muscle building?",
    a: "No. Protein powder is a convenient supplement but not required. If you can hit your daily protein target through whole foods, you'll get identical results. Supplements are useful when diet alone makes it difficult to reach targets.",
  },
  {
    q: "When should I eat protein?",
    a: "Distributing protein evenly across 3–5 meals (25–40g per meal) maximizes muscle protein synthesis better than consuming most protein in one meal. Post-workout protein within 2 hours is beneficial but the total daily amount matters most.",
  },
  {
    q: "Does protein intake matter for weight loss?",
    a: "Yes. Protein is the most satiating macronutrient — it reduces hunger and preserves lean muscle during a caloric deficit. Higher protein intake during weight loss (1.4–1.8g/kg) leads to better body composition outcomes versus low-protein diets.",
  },
  {
    q: "Do older adults need more protein?",
    a: "Yes. Older adults (65+) experience anabolic resistance — their muscles respond less efficiently to protein. Research recommends 1.0–1.2g/kg minimum for seniors, with higher intakes (1.2–1.5g/kg) for those who are active or trying to prevent sarcopenia.",
  },
];

export default function ProteinIntakeCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [weightLbs, setWeightLbs] = useState("175");
  const [weightKg, setWeightKg] = useState("79");
  const [goal, setGoal] = useState<Goal>("muscle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const kg = unit === "imperial" ? parseFloat(weightLbs) / 2.2046 : parseFloat(weightKg);
    if (!kg || kg < 20 || kg > 300) return null;

    const goalDef = goals.find(g => g.value === goal)!;
    const low = Math.round(goalDef.multiplierLow * kg);
    const high = Math.round(goalDef.multiplierHigh * kg);
    const mid = Math.round((low + high) / 2);

    const perMeal3 = Math.round(mid / 3);
    const perMeal4 = Math.round(mid / 4);
    const perMeal5 = Math.round(mid / 5);

    return { kg: Math.round(kg), low, high, mid, perMeal3, perMeal4, perMeal5, multiplierLow: goalDef.multiplierLow, multiplierHigh: goalDef.multiplierHigh };
  }, [unit, weightLbs, weightKg, goal]);

  return (
    <Layout>
      <SEO
        title="Protein Intake Calculator — How Much Protein Do I Need Per Day?"
        description="Calculate your ideal daily protein intake based on body weight and fitness goal. Science-backed protein targets for fat loss, muscle building, athletes, and seniors."
      />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-4 md:px-8 pt-4 max-w-7xl mx-auto">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/category/health" className="hover:text-foreground transition-colors">Health & Fitness</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Protein Intake Calculator</span>
      </nav>

      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-12 px-4 md:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm font-medium mb-4">
            <Dumbbell className="w-4 h-4" />
            Health & Fitness
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
            Protein Intake Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-6">
            Calculate exactly how much protein you need per day based on your body weight and goal. Science-backed targets for fat loss, muscle building, endurance athletes, and seniors.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { icon: Zap, label: "Instant result" },
              { icon: Dumbbell, label: "Goal-specific targets" },
              { icon: CheckCircle, label: "Per-meal breakdown" },
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">

          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-5">Your Details</h2>

              {/* Unit toggle */}
              <div className="flex rounded-xl border border-border overflow-hidden w-fit mb-6">
                {(["imperial", "metric"] as Unit[]).map(u => (
                  <button key={u} onClick={() => setUnit(u)} className={`px-4 py-2 text-sm font-medium transition-colors ${unit === u ? "bg-blue-600 text-white" : "hover:bg-muted"}`}>
                    {u === "imperial" ? "Imperial (lbs)" : "Metric (kg)"}
                  </button>
                ))}
              </div>

              <div className="max-w-xs mb-6">
                <label className="block text-sm font-medium mb-1.5">
                  Body Weight ({unit === "imperial" ? "lbs" : "kg"})
                </label>
                {unit === "imperial" ? (
                  <input type="number" className="tool-calc-input text-xl font-bold" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} min={50} max={700} />
                ) : (
                  <input type="number" className="tool-calc-input text-xl font-bold" value={weightKg} onChange={e => setWeightKg(e.target.value)} min={20} max={300} />
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Goal</label>
                <div className="space-y-2">
                  {goals.map(g => (
                    <button key={g.value} onClick={() => setGoal(g.value)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-sm transition-colors ${goal === g.value ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-border hover:bg-muted"}`}>
                      <div>
                        <p className="font-semibold">{g.label}</p>
                        <p className="text-muted-foreground text-xs">{g.desc}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs text-muted-foreground">{g.multiplierLow}–{g.multiplierHigh}g/kg</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div key={`${goal}-${weightLbs}-${weightKg}-${unit}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                    {/* Main result */}
                    <div className="tool-calc-result text-center py-6">
                      <p className="text-sm text-muted-foreground mb-1">Daily Protein Target</p>
                      <p className="text-5xl font-bold text-blue-600">{result.low}–{result.high}g</p>
                      <p className="text-muted-foreground text-sm mt-1">{result.multiplierLow}–{result.multiplierHigh}g per kg · {result.kg} kg body weight</p>
                    </div>

                    {/* Per-meal breakdown */}
                    <div className="bg-muted/40 rounded-2xl p-5">
                      <p className="font-semibold text-sm mb-4">Per-Meal Protein (target: {result.mid}g/day)</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { meals: 3, g: result.perMeal3 },
                          { meals: 4, g: result.perMeal4 },
                          { meals: 5, g: result.perMeal5 },
                        ].map(({ meals, g }) => (
                          <div key={meals} className="bg-background rounded-xl p-3 text-center border border-border">
                            <p className="text-xs text-muted-foreground mb-1">{meals} meals/day</p>
                            <p className="text-2xl font-bold text-blue-600">{g}g</p>
                            <p className="text-xs text-muted-foreground">per meal</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Aim for the <strong className="text-foreground">middle of your range ({result.mid}g)</strong>. Spread protein across meals for optimal muscle protein synthesis throughout the day.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Food sources */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-4">High-Protein Food Sources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {foodSources.map(({ food, protein }) => (
                <div key={food} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                  <span className="text-sm">{food}</span>
                  <span className="font-bold text-blue-600 text-sm ml-2 shrink-0">{protein}g protein</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Values are approximate. Actual protein content varies by brand and preparation.</p>
          </div>

          {/* How to Use */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-4">How to Use This Calculator</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              {[
                "Enter your current body weight (not your goal weight).",
                "Select your primary fitness goal from the list — each goal has a different evidence-based protein target.",
                "Your daily protein range is shown instantly. Aim for the middle of the range.",
                "Use the per-meal breakdown to plan meals. 3–5 meals per day with 25–40g each is optimal.",
                "Recalculate every 4–6 weeks as your weight changes, especially during a fat loss phase.",
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="pt-1">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Formula */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Dumbbell className="w-4 h-4 text-blue-600" /> Protein Target Formula</h3>
            <div className="font-mono text-sm bg-white dark:bg-background rounded-xl p-4 border border-blue-100 dark:border-blue-900 space-y-1.5">
              <p><span className="text-blue-600">Protein (g)</span> = Body Weight (kg) × Multiplier</p>
              <p className="text-muted-foreground text-xs mt-2">Multipliers by goal:</p>
              <p className="text-xs">General health: <span className="text-blue-500">0.8–1.0</span> g/kg</p>
              <p className="text-xs">Fat loss: <span className="text-orange-500">1.4–1.8</span> g/kg</p>
              <p className="text-xs">Muscle building: <span className="text-emerald-500">1.6–2.2</span> g/kg</p>
              <p className="text-xs">Endurance athlete: <span className="text-purple-500">1.2–1.6</span> g/kg</p>
              <p className="text-xs">Seniors (65+): <span className="text-rose-500">1.0–1.2</span> g/kg</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Based on International Society of Sports Nutrition position stand (2017) and multiple meta-analyses on protein requirements.</p>
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
              {["Evidence-based protein targets", "5 goal-specific ranges", "Per-meal breakdown included", "High-protein food sources listed", "Imperial and metric"].map(item => (
                <li key={item} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Protein Calorie Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1g protein = <strong className="text-foreground">4 calories</strong></p>
              <p>150g protein = <strong className="text-foreground">600 calories</strong></p>
              <p>200g protein = <strong className="text-foreground">800 calories</strong></p>
            </div>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-500" /> Share</h3>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors">
              Copy Link
            </button>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Related Tools</h3>
            <div className="space-y-2">
              {[
                { label: "Macro Calculator", href: "/health/macro-nutrient-calculator" },
                { label: "TDEE Calculator", href: "/health/tdee-calculator" },
                { label: "BMI Calculator", href: "/health/bmi-calculator" },
                { label: "Calorie Calculator", href: "/health/calorie-calculator" },
                { label: "Ideal Weight Calculator", href: "/health/ideal-weight-calculator" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-500" />{label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="bg-muted/30 border-t border-border py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Protein Intake Calculator — Complete Guide</h2>
            <p>Protein is the most important macronutrient for body composition. It builds and repairs muscle tissue, supports immune function, produces hormones and enzymes, and provides satiety that helps control calorie intake. This calculator uses body-weight-based multipliers supported by decades of sports nutrition research.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Why the RDA Isn't Enough</h3>
            <p>The <strong>RDA of 0.8g/kg</strong> represents the minimum to prevent deficiency in sedentary adults — not an optimal target for anyone who exercises, wants to lose fat, or is over 65. A 2012 meta-analysis by Helms et al. found 2.3–3.1g/kg was optimal for muscle retention during caloric restriction. The 2017 ISSN position stand recommends 1.4–2.0g/kg for most exercising adults.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Muscle Protein Synthesis and Meal Frequency</h3>
            <p>Each meal provides a temporary boost in muscle protein synthesis (MPS) that lasts 3–5 hours. Research by Areta et al. (2013) found that 4 meals of 20g protein stimulated MPS more than 2 meals of 40g or 8 meals of 10g. Aim for 25–40g of high-quality protein per meal, spaced every 3–4 hours.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
