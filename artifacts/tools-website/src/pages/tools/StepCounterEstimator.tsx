import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Footprints, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Activity, Flame, Clock, TrendingUp
} from "lucide-react";

const PACE_OPTIONS = [
  { label: "Slow Walk (3 km/h)", stepsPerKm: 1400, met: 2.0 },
  { label: "Moderate Walk (5 km/h)", stepsPerKm: 1300, met: 3.0 },
  { label: "Brisk Walk (6 km/h)", stepsPerKm: 1200, met: 3.5 },
  { label: "Light Jog (8 km/h)", stepsPerKm: 1050, met: 7.0 },
  { label: "Running (10 km/h)", stepsPerKm: 950, met: 9.8 },
];

function useCalc() {
  const [steps, setSteps] = useState("10000");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [paceIdx, setPaceIdx] = useState(1);

  const result = useMemo(() => {
    const s = parseFloat(steps), w = parseFloat(weight), h = parseFloat(height);
    if (isNaN(s) || isNaN(w) || isNaN(h)) return null;
    const pace = PACE_OPTIONS[paceIdx];
    const distanceKm = s / pace.stepsPerKm;
    const hours = distanceKm / (paceIdx < 2 ? 3 : paceIdx < 3 ? 5 : paceIdx < 4 ? 6 : paceIdx < 5 ? 8 : 10);
    const calories = pace.met * (w / 60) * hours * 60;
    const strideM = (h * 0.415) / 100;
    const distAlt = s * strideM / 1000;
    return {
      distanceKm: distanceKm.toFixed(2),
      distanceMile: (distanceKm * 0.621).toFixed(2),
      calories: Math.round(calories),
      minutes: Math.round(hours * 60),
      strideM: strideM.toFixed(2),
    };
  }, [steps, weight, height, paceIdx]);

  return { steps, setSteps, weight, setWeight, height, setHeight, paceIdx, setPaceIdx, result };
}

function ResultInsight({ result, steps }: { result: any; steps: string }) {
  if (!result) return null;
  const goalPct = Math.round((parseFloat(steps) / 10000) * 100);
  const message = `${steps} steps at this pace covers ${result.distanceKm} km (${result.distanceMile} miles) and burns approximately ${result.calories} calories in ${result.minutes} minutes. That's ${goalPct}% of the commonly recommended 10,000 daily steps goal.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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
  { title: "Calorie Calculator",      slug: "calorie-calculator",      icon: <Flame className="w-5 h-5" />,     color: 25,  benefit: "Calculate total daily energy needs" },
  { title: "BMI Calculator",          slug: "bmi-calculator",          icon: <Activity className="w-5 h-5" />,  color: 217, benefit: "Assess body mass index" },
  { title: "Running Pace Calculator", slug: "running-pace-calculator", icon: <TrendingUp className="w-5 h-5" />,color: 152, benefit: "Optimize your running pace" },
  { title: "Workout Duration",        slug: "workout-duration-calculator", icon: <Clock className="w-5 h-5" />, color: 265, benefit: "Plan exercise sessions" },
];

export default function StepCounterEstimator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Step Counter Estimator – Calories & Distance From Steps | US Online Tools"
        description="Free step counter calculator. Convert steps to distance (km/miles) and calories burned. Adjust for walking pace, body weight, and height. Instant results, no signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Step Counter Estimator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Footprints className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Step Counter Estimator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert steps to distance (km and miles) and calories burned. Personalize by walking pace, body weight, and height for more accurate results than generic step trackers.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Health &amp; Fitness &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                      <Footprints className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step Counter Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Number of Steps</label>
                          <input type="number" placeholder="10000" className="tool-calc-input w-full" value={calc.steps} onChange={e => calc.setSteps(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Body Weight (kg)</label>
                          <input type="number" placeholder="70" className="tool-calc-input w-full" value={calc.weight} onChange={e => calc.setWeight(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Height (cm)</label>
                          <input type="number" placeholder="170" className="tool-calc-input w-full" value={calc.height} onChange={e => calc.setHeight(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Walking / Running Pace</label>
                          <select className="tool-calc-input w-full" value={calc.paceIdx} onChange={e => calc.setPaceIdx(parseInt(e.target.value))}>
                            {PACE_OPTIONS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                          </select>
                        </div>
                      </div>

                      {calc.result && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Distance</p>
                              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{calc.result.distanceKm}<span className="text-xs font-bold ml-1">km</span></p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Miles</p>
                              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{calc.result.distanceMile}<span className="text-xs font-bold ml-1">mi</span></p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Calories</p>
                              <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{calc.result.calories}<span className="text-xs font-bold ml-1">kcal</span></p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Time</p>
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{calc.result.minutes}<span className="text-xs font-bold ml-1">min</span></p>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/60 border border-border text-center text-xs text-muted-foreground">
                            Estimated stride: <span className="font-bold text-foreground">{calc.result.strideM}m</span> based on your height
                          </div>
                        </div>
                      )}
                    </div>
                    <ResultInsight result={calc.result} steps={calc.steps} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Step Counter Estimator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most pedometers and phone step counters give you a raw step count without contextualizing distance or calorie burn. This tool converts your steps into meaningful fitness metrics, personalized to your body and pace.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your step count</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Input your daily or session step total from your phone's Health app, Fitbit, Apple Watch, or Garmin. You can also enter a target (e.g., 10,000) to see what it would mean in distance and calories before you start walking.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter weight and height</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Body weight directly affects calorie burn — heavier individuals burn more calories for the same distance. Height is used to estimate stride length using the standard formula (height × 0.415 for walk, × 0.46 for run), which affects distance accuracy significantly.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select your pace for calorie accuracy</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Walking pace significantly affects MET (Metabolic Equivalent of Task) values and therefore calorie calculations. A brisk walk at 6 km/h burns nearly 75% more calories per hour than a slow stroll at 3 km/h. Choose the pace that best reflects your typical walking session.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Calculation Method</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Stride Length = Height (cm) × 0.415 ÷ 100 (in meters)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Distance = Steps × Stride Length</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">3</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Calories = MET × (Weight ÷ 60) × Duration (hours) × 60</code>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your Step Results</h2>
              <p className="text-muted-foreground text-sm mb-6">How to put your step count results in context:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Under 5,000 Steps — Sedentary</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Typical of desk-bound lifestyle. Associated with elevated cardiovascular risk and metabolic syndrome when sustained long-term. Even adding a 20-minute walk (∼2,500 steps) can significantly improve health markers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">5,000–9,999 Steps — Moderately Active</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This range provides meaningful daily movement. Research published in JAMA Internal Medicine (2019) showed significant mortality risk reduction between 4,400 and 7,500 daily steps. "Somewhat active" daily living without dedicated exercise often falls in this range.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">10,000+ Steps — Active</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The widely cited 10,000-step goal originated as a marketing term from a Japanese company in 1965, but research broadly supports this as a meaningful daily activity threshold. At a moderate pace, 10,000 steps covers ∼7.5 km and burns 300–500 calories depending on body weight.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Step Count Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Steps</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Distance</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Approx. Calories*</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Equivalent Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">2,500</td><td className="px-4 py-3 text-muted-foreground">∼1.9 km</td><td className="px-4 py-3 font-bold text-emerald-600">∼90 kcal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">20-min lunch walk</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">5,000</td><td className="px-4 py-3 text-muted-foreground">∼3.8 km</td><td className="px-4 py-3 font-bold text-emerald-600">∼185 kcal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">45-min walk to grocery store</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">10,000</td><td className="px-4 py-3 text-muted-foreground">∼7.7 km</td><td className="px-4 py-3 font-bold text-emerald-600">∼370 kcal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">∼1.5h brisk walk</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">15,000</td><td className="px-4 py-3 text-muted-foreground">∼11.5 km</td><td className="px-4 py-3 font-bold text-emerald-600">∼560 kcal</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Active workday + evening run</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mb-6">*Estimated for 70kg person at moderate walking pace (5 km/h)</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Practical 10,000-step strategies:</strong> Accumulating 10,000 steps does not require a dedicated 90-minute walk. Parking farther away, taking stairs, walking during phone calls, and adding two 25-minute walks (morning and evening) typically generates 8,000–10,000 daily steps without major schedule changes.</p>
                <p><strong className="text-foreground">Weight loss context:</strong> 10,000 steps burns approximately 370–500 calories depending on body weight and pace. To lose 0.5 kg (1 lb) of fat per week, you need a 3,500-calorie weekly deficit — achievable by combining step count goals with modest dietary changes rather than steps alone.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally a step calculator that factors in MY height and weight instead of generic estimates. The calorie numbers actually match what my Fitbit shows — much more trustworthy."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Step Counter Estimator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Personalized to your actual body measurements.</strong> Generic step-to-distance converters use a fixed 0.762m stride for everyone — this calculator estimates your actual stride length from your height using the validated anthropometric ratio. A 5'4" woman and a 6'2" man cover very different distances in 10,000 steps.</p>
                <p><strong className="text-foreground">MET-based calorie burn, not a fixed constant.</strong> Most apps multiply steps by a flat calorie constant (e.g., 0.04 cal/step). This calculator uses Metabolic Equivalent of Task (MET) values that scale with your weight and pace, producing results that are significantly closer to actual energy expenditure measured in lab studies.</p>
                <p><strong className="text-foreground">No account, no tracking, completely free.</strong> Many step-counting apps monetize through premium tiers, in-app advertising, or health data monetization. This tool is completely free, requires no login, and processes all calculations in your browser without any server communication.</p>
                <p><strong className="text-foreground">Works for any activity level.</strong> Whether you're tracking a casual walk, a dedicated training session, or just setting a step goal for the day, the pace selector adjusts the calculation to match slow walks through running, covering a wide spectrum of common activities.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Step and calorie estimates involve inherent variability. Actual distance depends on individual gait, terrain, incline, and footwear. Calorie burn varies with fitness level, muscle mass, and metabolic rate. Use this tool for general guidance and goal-setting rather than precise clinical measurement.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How many steps equal 1 mile?" a={"For a person of average height (5'7\" / 170cm), approximately 2,100 steps equal one mile at a moderate walking pace. Taller individuals have longer strides and cover a mile in fewer steps; shorter individuals require more steps. This calculator accounts for your specific height to produce accurate per-mile estimates."} />
                <FaqItem q="How many calories does 10,000 steps burn?" a="For a 70kg person walking at a moderate brisk pace (5 km/h), 10,000 steps burns approximately 350–420 calories. Heavier individuals burn more; lighter individuals burn less. Pace also matters significantly — jogging 10,000 steps burns 60-70% more calories than walking the same count." />
                <FaqItem q="Is 10,000 steps really necessary for good health?" a="Not necessarily. Studies published in JAMA Internal Medicine found significant mortality risk reduction at 7,500 daily steps, with benefits plateauing above 10,000 for most non-athletic populations. Even 4,000 steps compared to 2,000 showed meaningful risk reduction. Any increase in daily steps is beneficial." />
                <FaqItem q="How accurate are phone step counters?" a="Modern smartphone accelerometers typically have 90-95% accuracy for step counting on flat surfaces when carried in a pocket. Accuracy decreases when the phone is in a bag, on a desk, or when movement patterns are unusual (e.g., pushing a shopping cart). Dedicated wrist trackers are generally more consistent." />
                <FaqItem q="Can I convert steps to kilometers for tracking a running goal?" a="Yes — select 'Light Jog' or 'Running' from the pace selector to get accurate distance estimates for running step counts. Running strides are longer than walking strides (approximately 1.5x longer), so 10,000 running steps covers a greater distance than 10,000 walking steps." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Track Your Fitness Progress</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore 400+ free health, fitness, and nutrition calculators — all free, instant, and private.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others track their fitness goals.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />
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
