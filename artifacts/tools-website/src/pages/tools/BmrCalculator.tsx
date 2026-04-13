import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getCanonicalToolPath } from "@/data/tools";
import {
  ChevronRight, ChevronDown, Check, ArrowRight,
  Zap, Smartphone, Shield, Copy, Ruler, Weight, User,
  BadgeCheck, Activity, Flame, FlameKindling
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-rose-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-rose-500">
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

const RELATED = [
  { title: "BMI Calculator",      slug: "bmi-calculator",       cat: "health", icon: <User className="w-5 h-5" />,     color: 10,   benefit: "Check Body Mass Index" },
  { title: "Calorie Calculator",  slug: "calorie-calculator",   cat: "health", icon: <Flame className="w-5 h-5" />,    color: 20,   benefit: "Daily intake for goals" },
  { title: "Macro Calculator",    slug: "macro-nutrient-calculator",cat:"health", icon: <Activity className="w-5 h-5" />,color: 200, benefit: "Protein, Carbs, Fat limits" },
];

export default function BmrCalculator() {
  const [unitPath, setUnitPath] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  
  // Metric
  const [kg, setKg] = useState("");
  const [cm, setCm] = useState("");
  
  // Imperial
  const [lbs, setLbs] = useState("");
  const [ft, setFt] = useState("");
  const [inVal, setInVal] = useState("");
  
  const [age, setAge] = useState("");

  const [copied, setCopied] = useState(false);

  // Mifflin-St Jeor Equation
  // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const bmr = useMemo(() => {
    let weightKg = 0;
    let heightCm = 0;
    let ageYrs = parseFloat(age);

    if (isNaN(ageYrs) || ageYrs <= 0) return null;

    if (unitPath === "metric") {
      weightKg = parseFloat(kg);
      heightCm = parseFloat(cm);
    } else {
      weightKg = parseFloat(lbs) * 0.453592;
      heightCm = (parseFloat(ft || "0") * 30.48) + (parseFloat(inVal || "0") * 2.54);
    }

    if (isNaN(weightKg) || isNaN(heightCm) || weightKg <= 0 || heightCm <= 0) return null;

    let result = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYrs);
    result = gender === "male" ? result + 5 : result - 161;

    return Math.max(0, Math.round(result));
  }, [unitPath, gender, kg, cm, lbs, ft, inVal, age]);

  const canonical = `https://usonlinetools.com${getCanonicalToolPath("online-bmr-calculator")}`;

  const schema = useMemo(
    () => ({
      "@type": "WebApplication",
      name: "BMR Calculator",
      url: canonical,
      description:
        "Free BMR calculator using the Mifflin-St Jeor equation. Estimate calories your body burns at rest and use it to plan daily intake targets.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
    [canonical],
  );

  const tdeeEstimates = useMemo(() => {
    if (!bmr) return null;
    const multipliers = [
      { label: "Sedentary (little exercise)", value: 1.2 },
      { label: "Lightly active (1–3 days/week)", value: 1.375 },
      { label: "Moderately active (3–5 days/week)", value: 1.55 },
      { label: "Very active (6–7 days/week)", value: 1.725 },
    ];
    return multipliers.map((m) => ({ ...m, calories: Math.round(bmr * m.value) }));
  }, [bmr]);

  const copyResult = () => {
    if (!bmr) return;
    navigator.clipboard.writeText(`My Basal Metabolic Rate (BMR) resting is: ${bmr} calories/day.`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="BMR Calculator (Basal Metabolic Rate) – Mifflin-St Jeor Equation"
        description="Free BMR calculator using the Mifflin-St Jeor equation. Estimate your basal metabolic rate (calories burned at rest) and use it to plan maintenance, cut, or bulk calorie targets."
        canonical={canonical}
        schema={schema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">BMR Calculator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-red-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <FlameKindling className="w-3.5 h-3.5" /> Metabolism Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">BMR Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Basal Metabolic Rate answers one foundational question: "How many calories does my body burn naturally if I do absolutely nothing all day?" Calculate your baseline resting energy expenditure to map out your bulk/cut phases.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-500/20"><Zap className="w-3.5 h-3.5" /> Mifflin-St Jeor Precision</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> Fully Private</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section id="calculator">
              <div className="rounded-2xl overflow-hidden border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-red-600" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center flex-shrink-0">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calories Burned Input Form</p>
                      </div>
                    </div>
                    
                    <div className="flex bg-muted p-1 rounded-xl">
                      <button onClick={() => setUnitPath("imperial")} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${unitPath === "imperial" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>US (lbs / ft)</button>
                      <button onClick={() => setUnitPath("metric")} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${unitPath === "metric" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Metric (kg / cm)</button>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 0 } as React.CSSProperties}>
                    
                    {/* Gener + Age */}
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div>
                         <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Biological Sex</label>
                         <div className="flex gap-2">
                            <button onClick={()=>setGender("male")} className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-colors ${gender==="male"?"bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400":"bg-card border-border text-muted-foreground hover:border-sky-500/30"}`}>Male</button>
                            <button onClick={()=>setGender("female")} className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-colors ${gender==="female"?"bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400":"bg-card border-border text-muted-foreground hover:border-rose-500/30"}`}>Female</button>
                         </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Age (Years)</label>
                        <input type="number" placeholder="28" className="tool-calc-input w-full" value={age} onChange={(e) => setAge(e.target.value)} />
                      </div>
                    </div>

                    {/* Height + Weight */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                       {unitPath === "metric" ? (
                         <>
                           <div>
                             <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Weight className="w-3.5 h-3.5"/> Weight</label>
                             <div className="relative">
                               <input type="number" placeholder="75" className="tool-calc-input w-full pr-12" value={kg} onChange={(e) => setKg(e.target.value)} />
                               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">kg</div>
                             </div>
                           </div>
                           <div>
                             <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5"/> Height</label>
                             <div className="relative">
                               <input type="number" placeholder="180" className="tool-calc-input w-full pr-12" value={cm} onChange={(e) => setCm(e.target.value)} />
                               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">cm</div>
                             </div>
                           </div>
                         </>
                       ) : (
                         <>
                           <div>
                             <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Weight className="w-3.5 h-3.5"/> Weight</label>
                             <div className="relative">
                               <input type="number" placeholder="165" className="tool-calc-input w-full pr-12" value={lbs} onChange={(e) => setLbs(e.target.value)} />
                               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">lbs</div>
                             </div>
                           </div>
                           <div>
                             <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5"/> Height</label>
                             <div className="flex gap-2">
                               <div className="relative flex-1">
                                 <input type="number" placeholder="5" className="tool-calc-input w-full pr-8" value={ft} onChange={(e) => setFt(e.target.value)} />
                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">ft</div>
                               </div>
                               <div className="relative flex-1">
                                 <input type="number" placeholder="11" className="tool-calc-input w-full pr-8" value={inVal} onChange={(e) => setInVal(e.target.value)} />
                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground font-bold text-sm">in</div>
                               </div>
                             </div>
                           </div>
                         </>
                       )}
                    </div>

                    {/* Results / Error View */}
                    <AnimatePresence mode="wait">
                      {bmr ? (
                        <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                          <div className="p-8 rounded-2xl bg-rose-500/5 border-2 border-rose-500/20 text-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 relative z-10">Basal Metabolic Rate</p>
                             <div className="flex items-end justify-center gap-2 relative z-10">
                               <p className="text-6xl font-black text-rose-600 dark:text-rose-400 tracking-tight">{bmr.toLocaleString()}</p>
                             </div>
                             <p className="text-sm text-foreground/80 font-medium mt-3 relative z-10">Calories / Day</p>
                          </div>
                          <button onClick={copyResult} className="w-full py-4 bg-rose-600 text-white font-bold text-sm rounded-xl hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                            {copied ? <><Check className="w-4 h-4" /> Result Copied!</> : <><Copy className="w-4 h-4" /> Copy Output</>}
                          </button>

                          {tdeeEstimates ? (
                            <div className="rounded-2xl border border-border bg-muted/30 p-5">
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Estimated maintenance calories (TDEE)</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {tdeeEstimates.map((row) => (
                                  <div key={row.label} className="rounded-xl border border-border bg-background p-4">
                                    <p className="text-xs font-bold text-muted-foreground">{row.label}</p>
                                    <p className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">{row.calories.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">calories/day</p>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                                These are quick estimates. For best results, track weight change over 2–3 weeks and adjust intake by ~100–200 calories at a time.
                              </p>
                            </div>
                          ) : null}
                        </motion.div>
                      ) : (
                        <div className="text-center py-8 opacity-50">
                          <Flame className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                          <p className="font-bold text-lg text-foreground">Waiting for Vitals</p>
                          <p className="text-sm text-muted-foreground">Please fill out your body weight and height above to execute the BMR algorithm.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Understanding Basal Metabolic Rate</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Your BMR represents the exact number of baseline calories your organs require to keep you completely alive if you were strictly resting in bed all day long (breathing, blood circulation, cell generation). It represents about 60–75% of your total daily burn.
              </p>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 mb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Formula used (Mifflin-St Jeor)</p>
                <div className="space-y-2 text-sm font-mono text-foreground">
                  <p>Men: \(10×kg + 6.25×cm − 5×age + 5\)</p>
                  <p>Women: \(10×kg + 6.25×cm − 5×age − 161\)</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  We use metric inputs internally. Imperial values are converted to kg/cm before calculating.
                </p>
              </div>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Mifflin-St Jeor Formula vs Harris-Benedict</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Unlike the older Harris-Benedict formula (which often over-estimates calories), we calculate using the Mifflin-St Jeor equation. The American Dietetic Association officially declares Mifflin-St Jeor as the absolute most accurate mathematical algorithm for measuring BMR.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Factoring in Non-Exercise Activity Thermogenesis (NEAT)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">BMR only calculates RESTING calories. Any conscious physical movement you make during the day (typing, standing up, pacing, doing dishes) requires multiplying your resting BMR by an Activity Multiplier (creating your TDEE).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">BMR vs RMR (resting metabolic rate)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      People often use BMR and RMR interchangeably. Technically, RMR is measured under less strict lab conditions and is usually slightly higher than BMR. For planning calories, the difference is small—consistency and real-world tracking matter more.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">How to Use Your BMR Result</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Your BMR is a baseline. To plan calories for maintenance, cutting, or bulking, convert BMR to an estimated TDEE (total daily energy expenditure), then apply a small surplus or deficit.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
                  <p className="font-bold text-foreground mb-1">Maintenance (hold weight)</p>
                  <p className="text-sm text-muted-foreground">Start near your estimated TDEE. Adjust after 2–3 weeks of real weigh-ins.</p>
                </div>
                <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
                  <p className="font-bold text-foreground mb-1">Cut (lose fat)</p>
                  <p className="text-sm text-muted-foreground">Try \(−250\) to \(−500\) calories/day from TDEE for a sustainable deficit.</p>
                </div>
                <div className="p-4 rounded-xl border bg-cyan-500/5 border-cyan-500/20">
                  <p className="font-bold text-foreground mb-1">Bulk (gain weight)</p>
                  <p className="text-sm text-muted-foreground">Try \(+150\) to \(+300\) calories/day from TDEE to minimize unnecessary fat gain.</p>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you have a medical condition, are pregnant, under 18, or have a history of disordered eating, consider speaking with a clinician or registered dietitian before making aggressive calorie targets.
                </p>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Activity Multiplier Guide (TDEE Conversion)</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Lifestyle Intensity</th><th className="text-left px-4 py-3 font-bold text-foreground">Math Multiplier</th><th className="text-left px-4 py-3 font-bold text-foreground">Real World Examples</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Sedentary</td><td className="px-4 py-3 font-mono text-rose-500">BMR × 1.2</td><td className="px-4 py-3 text-muted-foreground">Desk job UI designer, zero structured daily exercise.</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Lightly Active</td><td className="px-4 py-3 font-mono text-rose-500">BMR × 1.375</td><td className="px-4 py-3 text-muted-foreground">Teacher matching steps, light sports 2 days/week.</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Moderately Active</td><td className="px-4 py-3 font-mono text-rose-500">BMR × 1.55</td><td className="px-4 py-3 text-muted-foreground">Server/Waiter + structured gym sessions 4 days/week.</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Very Active</td><td className="px-4 py-3 font-mono text-rose-500">BMR × 1.725</td><td className="px-4 py-3 text-muted-foreground">Laborer hitting rigorous gym sessions + sports daily.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="Is BMR the same exact thing as BMI?" a="No, BMI (Body Mass Index) evaluates physical size mass-ratios used to mathematically classify obesity or under-weight scales. BMR directly measures calorie output to keep cells functioning." />
                <FaqItem q="Why does gender impact my BMR calculation?" a="At any given parallel weight, men biologically carry a significantly higher proportion of lean muscle mass (and drastically less body fat percentage) than females. Muscle tissue inherently burns substantially more resting calories per square inch than fat tissue does." />
                <FaqItem q="Should I consume calories equal to my BMR?" a="No. You should generally target consuming calories matching your Total Daily Energy Expenditure (your BMR multiplied by your Activity Level from the chart above). Eating at or directly below your strict BMR consistently is medically dangerous for organ health." />
                <FaqItem q="How accurate is this BMR calculator?" a="This calculator uses the Mifflin-St Jeor equation, which is commonly recommended for estimating BMR in adults. It is still an estimate—real metabolism varies with body composition, hormones, sleep, stress, and day-to-day activity. Use it as a starting point, then adjust based on real progress." />
                <FaqItem q="What inputs change BMR the most?" a="Weight and height strongly influence the estimate. Age reduces estimated BMR slightly over time. Sex affects the constant used in the formula. The biggest real-world driver is lean mass—strength training and higher muscle mass generally increase resting calorie needs." />
                <FaqItem q="How do I turn BMR into a calorie goal?" a="Estimate your TDEE using an activity multiplier, then set a small deficit (cut) or surplus (bulk). Track your 7-day average weight and adjust in 100–200 calorie steps every 2–3 weeks." />
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-rose-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    { label: "Calculator", href: "#calculator" },
                    { label: "Understanding BMR", href: "#how-to-use" },
                    { label: "Use Your Result", href: "#result-interpretation" },
                    { label: "Activity Multipliers", href: "#quick-examples" },
                    { label: "FAQ", href: "#faq" },
                  ].map((item) => (
                    <a key={item.href} href={item.href} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-rose-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-rose-500/40 flex-shrink-0" />
                      {item.label}
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
