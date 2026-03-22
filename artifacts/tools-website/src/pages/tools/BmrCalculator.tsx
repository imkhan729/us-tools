import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ArrowRight, Zap, CheckCircle2, Smartphone, Shield, Clock, Heart, Lightbulb, Copy, Check, Activity, Calculator, Apple, Scale, Droplets, BicepsFlexed } from "lucide-react";
import { getToolPath } from "@/data/tools";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (<div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors"><button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left"><span className="text-base font-bold text-foreground leading-snug">{q}</span><motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span></button><AnimatePresence initial={false}>{open && (<motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden"><p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p></motion.div>)}</AnimatePresence></div>);
}

const RELATED_TOOLS = [
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 340 },
  { title: "TDEE Calculator", slug: "tdee-calculator", icon: <BicepsFlexed className="w-5 h-5" />, color: 217 },
  { title: "Calorie Intake Calculator", slug: "calorie-intake-calculator", icon: <Apple className="w-5 h-5" />, color: 152 },
  { title: "Body Fat Calculator", slug: "body-fat-calculator", icon: <Activity className="w-5 h-5" />, color: 25 },
  { title: "Macro Calculator", slug: "macro-calculator", icon: <Apple className="w-5 h-5" />, color: 265 },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Droplets className="w-5 h-5" />, color: 45 },
];

type Gender = "male" | "female";
type Unit = "metric" | "imperial";

export default function BmrCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("imperial");
  const [age, setAge] = useState("25");
  const [weight, setWeight] = useState("170");
  const [height, setHeight] = useState("70");
  const [activityLevel, setActivityLevel] = useState("1.55");
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const result = useMemo(() => {
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height);
    if (isNaN(a) || isNaN(w) || isNaN(h) || a <= 0 || w <= 0 || h <= 0) return null;
    const wKg = unit === "imperial" ? w * 0.453592 : w;
    const hCm = unit === "imperial" ? h * 2.54 : h;
    // Mifflin-St Jeor equation
    const bmr = gender === "male"
      ? 10 * wKg + 6.25 * hCm - 5 * a + 5
      : 10 * wKg + 6.25 * hCm - 5 * a - 161;
    const tdee = bmr * parseFloat(activityLevel);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
  }, [gender, unit, age, weight, height, activityLevel]);

  return (
    <Layout>
      <SEO title="BMR Calculator - Free Online Basal Metabolic Rate Calculator" description="Free BMR calculator using the Mifflin-St Jeor equation. Calculate your basal metabolic rate and daily calorie needs based on age, gender, weight, and height. No signup required." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8"><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link><ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} /><Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health & Fitness</Link><ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} /><span className="text-foreground">BMR Calculator</span></nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"><Heart className="w-3.5 h-3.5" /> Health & Fitness</div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">BMR Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Calculate your Basal Metabolic Rate (BMR) and total daily energy expenditure (TDEE). Know exactly how many calories your body burns at rest using the accurate Mifflin-St Jeor equation.</p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div><div><p className="font-bold text-foreground text-sm">Instant BMR results</p><p className="text-muted-foreground text-sm">Enter your details below — BMR and TDEE update automatically.</p></div></section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 340 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5"><div className="tool-calc-number">1</div><h3 className="text-lg font-bold text-foreground">BMR Calculator</h3></div>

                <div className="flex items-center gap-2 mb-4">
                  {(["male", "female"] as const).map(g => (<button key={g} onClick={() => setGender(g)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${gender === g ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{g}</button>))}
                  <div className="ml-auto flex items-center gap-2">
                    {(["imperial", "metric"] as const).map(u => (<button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${unit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{u}</button>))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Age (years)</label><input type="number" className="tool-calc-input w-full" value={age} onChange={e => setAge(e.target.value)} /></div>
                  <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Weight ({unit === "imperial" ? "lbs" : "kg"})</label><input type="number" className="tool-calc-input w-full" value={weight} onChange={e => setWeight(e.target.value)} /></div>
                  <div><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Height ({unit === "imperial" ? "inches" : "cm"})</label><input type="number" className="tool-calc-input w-full" value={height} onChange={e => setHeight(e.target.value)} /></div>
                </div>

                <div className="mb-5"><label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Activity Level</label>
                  <select className="tool-calc-input w-full" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                    <option value="1.2">Sedentary (little or no exercise)</option>
                    <option value="1.375">Lightly Active (1-3 days/week)</option>
                    <option value="1.55">Moderately Active (3-5 days/week)</option>
                    <option value="1.725">Very Active (6-7 days/week)</option>
                    <option value="1.9">Extra Active (intense daily exercise)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="tool-calc-result text-center"><div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">BMR (Calories/Day)</div><div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{result ? result.bmr.toLocaleString() : "--"}</div></div>
                  <div className="tool-calc-result text-center"><div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">TDEE (Calories/Day)</div><div className="text-2xl font-black text-blue-600 dark:text-blue-400">{result ? result.tdee.toLocaleString() : "--"}</div></div>
                </div>

                {result && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex gap-2 items-start"><Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/80 leading-relaxed">Your body burns approximately <strong>{result.bmr.toLocaleString()} calories per day</strong> at complete rest. With your activity level, your Total Daily Energy Expenditure (TDEE) is about <strong>{result.tdee.toLocaleString()} calories</strong>. To lose weight, eat below your TDEE. To gain weight, eat above it.</p></div>
                  </motion.div>
                )}

                {result && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center"><div className="text-xs font-semibold text-muted-foreground mb-1">Lose Weight</div><div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{(result.tdee - 500).toLocaleString()}</div><div className="text-[10px] text-muted-foreground">cal/day (-500)</div></div>
                    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-center"><div className="text-xs font-semibold text-muted-foreground mb-1">Maintain</div><div className="text-lg font-black text-blue-600 dark:text-blue-400">{result.tdee.toLocaleString()}</div><div className="text-[10px] text-muted-foreground">cal/day</div></div>
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-center"><div className="text-xs font-semibold text-muted-foreground mb-1">Gain Weight</div><div className="text-lg font-black text-amber-600 dark:text-amber-400">{(result.tdee + 500).toLocaleString()}</div><div className="text-[10px] text-muted-foreground">cal/day (+500)</div></div>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How BMR Is Calculated</h2>
              <div className="space-y-5">
                <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div><div><h4 className="font-bold text-foreground mb-1">Mifflin-St Jeor Equation</h4><p className="text-muted-foreground text-sm leading-relaxed">Men: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">BMR = 10W + 6.25H - 5A + 5</code><br/>Women: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">BMR = 10W + 6.25H - 5A - 161</code><br/>W = weight (kg), H = height (cm), A = age (years)</p></div></div>
                <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div><div><h4 className="font-bold text-foreground mb-1">TDEE Calculation</h4><p className="text-muted-foreground text-sm leading-relaxed">TDEE = BMR × Activity Multiplier. This gives you the total calories your body uses per day including exercise and daily activity.</p></div></div>
                <div className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div><div><h4 className="font-bold text-foreground mb-1">Weight Management</h4><p className="text-muted-foreground text-sm leading-relaxed">A 500-calorie daily deficit leads to approximately 1 pound of weight loss per week. A 500-calorie surplus supports about 1 pound of weight gain per week.</p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ icon: <Zap className="w-4 h-4" />, text: "Uses the gold-standard Mifflin-St Jeor equation" }, { icon: <CheckCircle2 className="w-4 h-4" />, text: "Calculates both BMR and TDEE instantly" }, { icon: <Shield className="w-4 h-4" />, text: "100% private — no health data stored" }, { icon: <Smartphone className="w-4 h-4" />, text: "Imperial and metric unit support" }, { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" }, { icon: <Calculator className="w-4 h-4" />, text: "Weight loss/gain calorie targets included" }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"><div className="text-primary">{item.icon}</div><span className="text-sm font-medium text-foreground">{item.text}</span></div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is Basal Metabolic Rate?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Basal Metabolic Rate (BMR) is the number of calories your body needs to perform basic life-sustaining functions like breathing, circulation, cell production, and nutrient processing while completely at rest. It represents the minimum energy your body requires to survive.</p>
                <p>This free BMR calculator uses the Mifflin-St Jeor equation, which is considered the most accurate formula for estimating BMR by the American Dietetic Association. Understanding your BMR is the foundation for any weight management plan.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Factors That Affect BMR</h3>
                <ul className="space-y-2 ml-1">
                  {["Age — BMR decreases roughly 1-2% per decade after age 20", "Gender — Men typically have higher BMR due to greater muscle mass", "Body composition — More muscle mass increases BMR significantly", "Height and weight — Larger bodies require more energy at rest", "Genetics — Some people naturally have faster or slower metabolisms", "Hormones — Thyroid function directly impacts metabolic rate"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is BMR?" a="BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain vital functions like breathing and circulation. It typically accounts for 60-75% of your total daily calorie expenditure." />
                <FaqItem q="What's the difference between BMR and TDEE?" a="BMR is calories burned at rest. TDEE (Total Daily Energy Expenditure) is BMR multiplied by an activity factor to account for exercise and daily movement. TDEE represents your actual total calorie needs." />
                <FaqItem q="Which BMR formula is most accurate?" a="The Mifflin-St Jeor equation (used by this calculator) is considered the most accurate by the American Dietetic Association. It's more reliable than the older Harris-Benedict equation." />
                <FaqItem q="How do I use BMR for weight loss?" a="Calculate your TDEE, then eat 500 calories below it daily to lose about 1 pound per week. Never eat below your BMR, as this can slow your metabolism and cause muscle loss." />
                <FaqItem q="Is this calculator free?" a="100% free. No ads, no signup, and your health data never leaves your browser." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10"><h2 className="text-2xl font-black tracking-tight mb-2">More Health & Fitness Tools</h2><p className="text-primary-foreground/80 mb-6 max-w-lg">Try our BMI calculator, TDEE calculator, calorie counter, and 400+ more free health tools.</p><Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link></div>
            </section>
          </div>

          <div className="space-y-6"><div className="sticky top-28 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5"><h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3><div className="space-y-2">{RELATED_TOOLS.map((tool) => (<Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"><div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div><span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span><ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" /></Link>))}</div></div>
            <div className="bg-card border border-border rounded-2xl p-5"><h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3><p className="text-sm text-muted-foreground mb-4">Help others calculate their BMR.</p><button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">{copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}</button></div>
          </div></div>
        </div>
      </div>
    </Layout>
  );
}
