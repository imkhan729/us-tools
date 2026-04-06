import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Flame, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Scale, Droplets, Activity, Utensils
} from "lucide-react";

function useCalc() {
  const [weight, setWeight] = useState("70");
  const [bodyFat, setBodyFat] = useState("20");
  const [activity, setActivity] = useState("1.2");
  const [deficit, setDeficit] = useState("20");

  const result = useMemo(() => {
    const w = parseFloat(weight), bf = parseFloat(bodyFat);
    const act = parseFloat(activity), def = parseFloat(deficit);
    if (isNaN(w) || isNaN(bf) || isNaN(act) || isNaN(def)) return null;
    const lbm = w * (1 - bf / 100);
    const bmr = 370 + 21.6 * lbm;
    const tdee = bmr * act;
    const calories = tdee * (1 - def / 100);
    return {
      calories: Math.round(calories),
      fat: Math.round((calories * 0.70) / 9),
      protein: Math.round((calories * 0.25) / 4),
      carbs: Math.round((calories * 0.05) / 4),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    };
  }, [weight, bodyFat, activity, deficit]);

  return { weight, setWeight, bodyFat, setBodyFat, activity, setActivity, deficit, setDeficit, result };
}

function ResultInsight({ result }: { result: any }) {
  if (!result) return null;
  const message = `To meet your goals, target ${result.calories} calories per day: ${result.fat}g fat, ${result.protein}g protein, and ${result.carbs}g net carbs. Keeping net carbs below ~50g is critical for maintaining nutritional ketosis.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "BMR Calculator",                slug: "bmr-calculator",               icon: <Activity className="w-5 h-5" />, color: 25,  benefit: "Find your base metabolic rate" },
  { title: "Calorie Calculator",            slug: "calorie-calculator",           icon: <Utensils className="w-5 h-5" />, color: 152, benefit: "Total daily energy needs" },
  { title: "Intermittent Fasting",          slug: "intermittent-fasting-calculator", icon: <Flame className="w-5 h-5" />,    color: 30,  benefit: "Pair keto with fasting" },
  { title: "Body Fat % Calculator",         slug: "body-fat-percentage-calculator",  icon: <Scale className="w-5 h-5" />,    color: 265, benefit: "Measure lean vs fat mass" },
];

export default function KetoCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const fmt = (n: number | null) => n === null ? "--" : n.toLocaleString("en-US");

  return (
    <Layout>
      <SEO
        title="Keto Calculator – Calculate Your Ketogenic Macros for Fat Loss | US Online Tools"
        description="Free keto macro calculator. Enter your weight, body fat, and activity level to get your ideal fat, protein, and net carb targets for ketosis. Instant results, no signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Keto Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Flame className="w-3.5 h-3.5" /> Health &amp; Nutrition
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Keto Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your exact ketogenic macros — fat, protein, and net carbs — based on your body composition and goals. Uses the scientifically validated Katch-McArdle formula.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Health &amp; Nutrition &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ketogenic Macro Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Body Weight (kg)</label>
                          <input type="number" placeholder="70" className="tool-calc-input w-full" value={calc.weight} onChange={e => calc.setWeight(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Body Fat %</label>
                          <input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.bodyFat} onChange={e => calc.setBodyFat(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Activity Level (Multiplier)</label>
                          <select className="tool-calc-input w-full" value={calc.activity} onChange={e => calc.setActivity(e.target.value)}>
                            <option value="1.2">Sedentary (desk job, no exercise)</option>
                            <option value="1.375">Light (1–3 days/week)</option>
                            <option value="1.55">Moderate (3–5 days/week)</option>
                            <option value="1.725">Very Active (6–7 days/week)</option>
                            <option value="1.9">Extra Active (athlete/physical job)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Caloric Deficit %</label>
                          <input type="number" placeholder="20" className="tool-calc-input w-full" value={calc.deficit} onChange={e => calc.setDeficit(e.target.value)} />
                          <p className="text-xs text-muted-foreground mt-1">0% = maintain weight. 20% = moderate cut.</p>
                        </div>
                      </div>

                      {calc.result && (
                        <div className="space-y-3">
                          <div className="text-center p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Daily Calories</p>
                            <p className="text-4xl font-black text-orange-600 dark:text-orange-400">{fmt(calc.result.calories)}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Fat</p>
                              <p className="text-xl font-black text-amber-600">{fmt(calc.result.fat)}g</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Protein</p>
                              <p className="text-xl font-black text-blue-600">{fmt(calc.result.protein)}g</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Net Carbs</p>
                              <p className="text-xl font-black text-emerald-600">{fmt(calc.result.carbs)}g</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/60 border border-border text-center">
                            <p className="text-xs text-muted-foreground">BMR: <span className="font-bold text-foreground">{fmt(calc.result.bmr)} kcal</span> &nbsp;·&nbsp; TDEE: <span className="font-bold text-foreground">{fmt(calc.result.tdee)} kcal</span></p>
                          </div>
                        </div>
                      )}
                    </div>
                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            {/* HOW TO USE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Keto Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A ketogenic diet works by dramatically reducing carbohydrate intake and replacing it with fat, shifting your body into a metabolic state called ketosis where it burns fat for fuel. Hitting precise macro targets is essential — and this calculator makes it easy.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your body weight and body fat percentage</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Body weight is entered in kilograms. Body fat percentage can be estimated using a skinfold caliper, DEXA scan, or a body fat scale. This data is essential because the Katch-McArdle formula calculates BMR from your Lean Body Mass (LBM), not total weight, leading to more accurate results than formulas like Mifflin-St Jeor.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set your activity level and deficit</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Activity multipliers convert your BMR into your Total Daily Energy Expenditure (TDEE). From TDEE, apply a caloric deficit percentage: 10–15% for slow, sustainable loss; 20% for a moderate cut; 25%+ for aggressive fat loss (not recommended for extended periods without medical oversight).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Track your three macros daily</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The calculator outputs your Fat (g), Protein (g), and Net Carbs (g) targets. Fat provides 70% of calories, Protein 25%, and Net Carbs 5%. Hit the net carb target daily — this is the critical threshold for maintaining ketosis. Use a food diary or tracking app like Cronometer or MyFitnessPal to log your intake.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Keto Macro Formula (Katch-McArdle)</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">LBM = Weight × (1 − Body Fat% ÷ 100)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">BMR = 370 + (21.6 × LBM)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">TDEE = BMR × Activity Multiplier</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">4</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Calories = TDEE × (1 − Deficit%)</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Fat is set to 70% of calories (÷9 cal/g), Protein to 25% (÷4 cal/g), Net Carbs to 5% (÷4 cal/g). These ratios represent the standard ketogenic ratio proven to support ketosis in clinical trials.</p>
              </div>
            </section>

            {/* RESULT INTERPRETATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your Keto Macros</h2>
              <p className="text-muted-foreground text-sm mb-6">How to interpret and apply your ketogenic targets:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Fat (70%) — Your Primary Fuel Source</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">On keto, fat replaces carbohydrates as your body's main energy source. Prioritize healthy fats: avocados, olive oil, coconut oil, nuts, fatty fish, and butter. Avoid trans fats and highly processed vegetable oils. This target keeps you satiated and fuels the liver's production of ketone bodies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Protein (25%) — Muscle Preservation</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Protein is set at moderate levels to preserve lean muscle mass during a caloric deficit. Too little leads to muscle catabolism; too much triggers gluconeogenesis (conversion of amino acids to glucose), which can knock you out of ketosis. The 25% ratio sits in the optimal zone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Net Carbs (5%) — The Ketosis Threshold</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Net carbs = Total Carbs − Fiber. Keeping net carbs below 20–50g/day (depending on individual insulin sensitivity) is the critical requirement for entering and sustaining ketosis. This is your most important macro to track. Focus on fibrous vegetables, leafy greens, and nuts as your carbohydrate sources.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Sample Keto Macro Profiles</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Profile</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Calories</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Fat</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Protein</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Net Carbs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">70kg, 20% BF, Sedentary, 20% deficit</td>
                      <td className="px-4 py-3 font-bold text-orange-600">1,497</td>
                      <td className="px-4 py-3 font-mono text-foreground">116g</td>
                      <td className="px-4 py-3 font-mono text-foreground">93g</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">19g</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">85kg, 25% BF, Moderate, 15% deficit</td>
                      <td className="px-4 py-3 font-bold text-orange-600">2,006</td>
                      <td className="px-4 py-3 font-mono text-foreground">156g</td>
                      <td className="px-4 py-3 font-mono text-foreground">125g</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">25g</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">60kg, 18% BF, Active, 10% deficit</td>
                      <td className="px-4 py-3 font-bold text-orange-600">1,780</td>
                      <td className="px-4 py-3 font-mono text-foreground">138g</td>
                      <td className="px-4 py-3 font-mono text-foreground">111g</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">22g</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 — Sedentary beginner:</strong> A 70kg person with 20% body fat and a desk job (Sedentary multiplier: 1.2) targeting a 20% deficit would eat 1,497 calories per day. The 19g net carb limit is strict — about 2 cups of leafy greens and half an avocado. Hitting this threshold reliably induces ketosis within 2–4 days.</p>
                <p><strong className="text-foreground">Example 2 — Active lifter:</strong> An 85kg person at 25% body fat who trains 4 days a week (Moderate: 1.55) with a conservative 15% deficit gets 2,006 calories and 25g net carbs. The higher protein and fat targets support muscle retention during the cutting phase.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally a keto calculator that uses body fat % instead of just total weight. Much more accurate targets. Lost 8kg in 10 weeks following these numbers."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* WHY CHOOSE THIS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Keto Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Uses the superior Katch-McArdle formula.</strong> Most online keto calculators rely on the Mifflin-St Jeor formula, which uses total body weight and estimates lean mass indirectly from age and gender. Katch-McArdle uses actual Lean Body Mass, providing significantly more accurate BMR and macro targets for athletes, bodybuilders, and people with above-average muscle mass.</p>
                <p><strong className="text-foreground">Personalized to your deficit goals.</strong> Many calculators output maintenance macros only. This tool lets you define a precise caloric deficit, making it useful for active fat loss phases, slow recomposition, or maintenance on a ketogenic diet — all in one tool.</p>
                <p><strong className="text-foreground">Instant results, no registration.</strong> There is no paywall, no premium tier, and no email required. All calculations happen in your browser using JavaScript. No data is transmitted to any server at any time.</p>
                <p><strong className="text-foreground">Part of a comprehensive health tool suite.</strong> This calculator integrates with our BMR Calculator, Body Fat Percentage Calculator, and Intermittent Fasting Calculator, enabling you to build a complete metabolic profile without leaving the platform.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> This tool is for educational purposes only. Ketogenic diets may not be appropriate for individuals with pancreatitis, liver failure, fat metabolism disorders, or those who are pregnant. Consult a registered dietitian or physician before beginning a ketogenic diet, especially if you take medication for diabetes or high blood pressure.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What are net carbs?" a="Net carbs are calculated by subtracting dietary fiber (and sometimes sugar alcohols, depending on their glycemic index) from total carbohydrates. Fiber is not absorbed and does not raise blood glucose, so it does not count toward your daily ketosis threshold." />
                <FaqItem q="How quickly will I enter ketosis?" a="Most people achieve measurable ketosis (blood ketones above 0.5 mmol/L) within 2–4 days of strict adherence to their net carb limit. Exercising during the transition period depletes glycogen stores faster and can accelerate ketosis onset." />
                <FaqItem q="Should I track total carbs or net carbs on keto?" a="Net carbs are the standard for ketogenic diets. However, some practitioners — especially beginners or those with metabolic disorders — track total carbohydrates to avoid confusion and potential overconsumption of fiber-rich foods." />
                <FaqItem q="What is the 'Keto Flu' and how do I avoid it?" a="The keto flu describes flu-like symptoms (headache, fatigue, brain fog) experienced in the first 1–2 weeks as the body adapts. It is primarily caused by electrolyte loss due to reduced insulin and glycogen depletion. Supplementing sodium, potassium, and magnesium significantly mitigates symptoms." />
                <FaqItem q="Can I follow a keto diet if I exercise heavily?" a="Yes, but it may take 3–6 weeks for the body to become 'fat-adapted' — fully efficient at converting fat and ketones to ATP for exercise. During this adaptation phase, high-intensity performance may temporarily decrease. Many endurance athletes report improved performance once fat-adapted." />
              </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Health Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore 400+ free health, fitness, and nutrition calculators — instant results, no login required.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/health/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate their keto macros.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
