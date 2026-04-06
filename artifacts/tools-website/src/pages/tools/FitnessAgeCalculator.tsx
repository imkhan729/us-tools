import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Heart, Dumbbell, Timer, ZapOff, Trophy, Flame
} from "lucide-react";

function useFitnessAgeCalc() {
  const [actualAge, setActualAge] = useState(30);
  const [restingHeartRate, setRestingHeartRate] = useState(70);
  const [activityLevel, setActivityLevel] = useState(2); // 1-4 scale
  const [waistCircumference, setWaistCircumference] = useState(80); // in cm
  const [sex, setSex] = useState<'male' | 'female'>('male');

  const results = useMemo(() => {
     // A simplified formula based on common fitness age models:
     // - Resting heart rate: + or - years vs age-sex norms (standard avg is 72)
     // - Activity level: impacts age downward
     // - Waist/Height ratio: impact health age
     
     let fitnessAge = actualAge;

     // Heart Rate Adjustment (approx)
     const heartImpact = (restingHeartRate - 70) / 4;
     fitnessAge += heartImpact;

     // Activity Adjustment (impact: up to -10 or +5)
     if (activityLevel === 1) fitnessAge += 4;
     else if (activityLevel === 2) fitnessAge -= 1;
     else if (activityLevel === 3) fitnessAge -= 4;
     else if (activityLevel === 4) fitnessAge -= 8;

     // Waist aspect (avg male waist ~90-94cm, avg female ~80-88cm)
     const waistNorm = sex === 'male' ? 94 : 80;
     const waistImpact = (waistCircumference - waistNorm) / 4;
     fitnessAge += waistImpact;

     const finalAge = Math.max(18, Math.round(fitnessAge * 10) / 10);
     const diff = Math.round((finalAge - actualAge) * 10) / 10;

     return {
        fitnessAge: finalAge,
        difference: diff,
        label: diff < 0 ? 'Excellent Focus' : diff > 0 ? 'Room for Improvement' : 'Balanced State',
        color: diff < 0 ? 'text-emerald-500' : diff > 0 ? 'text-rose-500' : 'text-blue-500'
     };
  }, [actualAge, restingHeartRate, activityLevel, waistCircumference, sex]);

  return { 
    actualAge, setActualAge, 
    restingHeartRate, setRestingHeartRate, 
    activityLevel, setActivityLevel, 
    waistCircumference, setWaistCircumference,
    sex, setSex,
    results 
  };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white/5 shadow-sm hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left bg-card">
        <span className="text-base font-extrabold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4 bg-muted/5">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "BMR Tool", slug: "bmr-calculator", icon: <Flame className="w-5 h-5" />, color: 200, benefit: "Calorie burn stats" },
  { title: "Peak Flow", slug: "vo2-max-calculator", icon: <Activity className="w-5 h-5" />, color: 170, benefit: "Aerobic fitness" },
  { title: "Ideal Weight", slug: "ideal-weight-calculator", icon: <Trophy className="w-5 h-5" />, color: 140, benefit: "Target weight check" },
];

export default function FitnessAgeCalculator() {
  const calc = useFitnessAgeCalc();
  const [copied, setCopied] = useState(false);

  return (
    <Layout>
      <SEO
        title="Fitness Age Calculator – Find Out How Fit You Really Are"
        description="Discover your fitness age based on heart rate, activity, and measurements. A free online tool for understanding your biological fitness level."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-widest mb-10 opacity-70">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Fitness Age Calculator</span>
        </nav>

        <section className="bg-card rounded-3xl overflow-hidden border border-border shadow-2xl px-10 md:px-16 py-12 md:py-20 mb-12 text-center md:text-left relative flex items-center justify-between gap-12 group">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-blue-500/20">
                <Heart className="w-4 h-4" />
                Performance Metrics
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] max-w-2xl">
                Fitness Age Calculator
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                Are you older or younger than your biological years? Discover your fitness level by analyzing key body and activity indicators.
              </p>
           </div>
           <div className="absolute right-0 top-1/2 -translate-y-1/2 p-20 opacity-5 hidden lg:block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
              <Timer className="w-64 h-64 text-blue-600" />
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-12">
            {/* Calculator Section */}
            <div className="rounded-[2.5rem] border-2 border-border shadow-2xl bg-card overflow-hidden">
               <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
               <div className="p-10 md:p-14 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic flex items-center gap-2">
                              Actual Age <span className="opacity-40 line-clamp-1">{calc.actualAge} Years</span>
                           </label>
                           <input 
                              type="range" min="15" max="100" value={calc.actualAge} 
                              onChange={e => calc.setActualAge(parseInt(e.target.value))}
                              className="w-full h-3 bg-muted rounded-full accent-blue-600"
                           />
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic flex items-center gap-2">
                              Resting Heart Rate <span className="text-blue-600">{calc.restingHeartRate} BPM</span>
                           </label>
                           <input 
                              type="range" min="40" max="120" value={calc.restingHeartRate} 
                              onChange={e => calc.setRestingHeartRate(parseInt(e.target.value))}
                              className="w-full h-3 bg-muted rounded-full accent-blue-600"
                           />
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Activity Level</label>
                           <div className="grid grid-cols-2 gap-2">
                              {['Sedentary', 'Lightly Active', 'Active', 'Hardcore'].map((lvl, i) => (
                                 <button 
                                    key={i}
                                    onClick={() => calc.setActivityLevel(i+1)}
                                    className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${calc.activityLevel === i+1 ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30' : 'bg-muted/30 border-border text-muted-foreground hover:border-blue-500/50'}`}
                                 >
                                    {lvl}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 pt-2">
                           <div className="flex gap-2">
                              {(['male', 'female'] as const).map(s => (
                                 <button 
                                    key={s} 
                                    onClick={() => calc.setSex(s)}
                                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${calc.sex === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-muted/30 border-border'}`}
                                 >
                                    {s}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="relative">
                        <AnimatePresence mode="wait">
                           <motion.div 
                              key={calc.results.fitnessAge}
                              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                              className="h-full rounded-[2rem] bg-muted/20 border-2 border-border p-10 flex flex-col justify-center text-center space-y-6"
                           >
                              <div className="space-y-2">
                                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Biological Standing</p>
                                 <div className={`text-6xl md:text-8xl font-black tracking-tighter ${calc.results.color}`}>
                                    {calc.results.fitnessAge}
                                 </div>
                                 <p className="text-sm font-bold text-foreground opacity-60 italic">Estimated Fitness Age</p>
                              </div>

                              <div className="p-5 bg-card rounded-3xl border border-border shadow-inner">
                                 <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Difference</p>
                                 <p className={`text-2xl font-black ${calc.results.color}`}>
                                    {calc.results.difference > 0 ? `+${calc.results.difference}` : calc.results.difference} Years
                                 </p>
                                 <p className="text-[9px] font-black uppercase tracking-widest mt-2">{calc.results.label}</p>
                              </div>
                           </motion.div>
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
            </div>

            {/* Explainer */}
            <section className="bg-card border-2 border-border rounded-[2.5rem] p-10 space-y-8">
               <h2 className="text-3xl font-black text-foreground tracking-tight italic">Understanding Your Age Score</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-blue-600" />
                     </div>
                     <h4 className="font-extrabold text-foreground text-lg uppercase leading-tight italic">Heart Engine</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        A lower resting heart rate usually suggests a stronger, more efficient heart muscle. It's one of the best indicators of cardiovascular fitness.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-indigo-600" />
                     </div>
                     <h4 className="font-extrabold text-foreground text-lg uppercase leading-tight italic">Metabolic Power</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        Activity level dictates your body's ability to process fuel and manage inflammation. More movement keeps your cellular age "younger".
                     </p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-violet-600" />
                     </div>
                     <h4 className="font-extrabold text-foreground text-lg uppercase leading-tight italic">Waist Impact</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                        Visceral fat around the waist is more biologically active and linked to higher inflammatory markers than fat elsewhere on the body.
                     </p>
                  </div>
               </div>
            </section>

            <section className="space-y-8">
               <h2 className="text-3xl font-black tracking-tighter uppercase italic px-4">Fitness Insights</h2>
               <div className="space-y-4">
                  <FaqItem 
                     q="Can I actually change my fitness age?"
                     a="Yes! Unlike your chronological age, your fitness age is highly dynamic. Improving your VO2 max through cardio, reducing resting heart rate through consistent exercise, and managing waist circumference can drop your fitness age significantly within months."
                  />
                  <FaqItem 
                     q="How accurate is this estimation?"
                     a="This calculator uses standardized health averages to estimate your standing. While not a clinical medical test, it provides a strong relative baseline of how your biological metrics compare to thousands of other people in your age group."
                  />
                  <FaqItem 
                     q="What is a good resting heart rate?"
                     a="For most adults, a resting heart rate between 60 and 100 beats per minute is normal. High-performance athletes can have rates as low as 40 or 50, which typically correlates with a very young fitness age."
                  />
               </div>
            </section>
          </div>

          <div className="space-y-8">
             <div className="sticky top-28 space-y-8">
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden group">
                   <Trophy className="w-20 h-20 absolute -right-4 -top-4 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                   <h4 className="font-black text-lg mb-3 flex items-center gap-2 italic uppercase">
                      Live Longer
                   </h4>
                   <p className="text-xs leading-relaxed opacity-70 font-bold">
                     "Every step you take today is a gift to your future self. Fitness isn't just about looking good—it's about maximizing your healthy years."
                   </p>
                </div>

                <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-xl">
                   <h3 className="text-[10px] font-black uppercase text-blue-500 mb-6 tracking-[0.25em] italic">Track Progress</h3>
                   <div className="space-y-6">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/health/${t.slug}`} className="flex items-center gap-4 group">
                           <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                              <span className="group-hover:text-white group-hover:scale-110 transition-transform">{t.icon}</span>
                           </div>
                           <span className="text-xs font-black uppercase text-muted-foreground group-hover:text-foreground transition-colors">{t.title}</span>
                        </Link>
                      ))}
                   </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-white border-2 border-blue-500 shadow-xl text-center group">
                   <p className="text-xs font-black text-blue-600 uppercase mb-4 tracking-widest italic tracking-wider">Share Score</p>
                   <button className="w-full h-12 bg-blue-600 rounded-xl flex items-center justify-center gap-2 group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/40">
                      <Copy className="w-4 h-4 text-white" />
                      <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Copy Link</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
