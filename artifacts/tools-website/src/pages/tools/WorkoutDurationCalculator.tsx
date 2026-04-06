import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Heart, Timer, Dumbbell, Target, Clock, ZapOff, Trophy, Flame
} from "lucide-react";

type WorkoutGoal = 'strength' | 'hypertrophy' | 'endurance' | 'health' | 'fatloss';

function useWorkoutDurationCalc() {
  const [goal, setGoal] = useState<WorkoutGoal>('hypertrophy');
  const [intensity, setIntensity] = useState<1 | 2 | 3>(2); // 1: Low, 2: Moderate, 3: High
  const [sessionCount, setSessionCount] = useState(3); // per week

  const results = useMemo(() => {
     // Guidelines based on sports science for optimal window before cortisol rises/testosterone drops
     
     const durations = {
        strength: { min: 45, max: 75, warmup: 15, rest: 'Long (3-5 min)' },
        hypertrophy: { min: 60, max: 90, warmup: 10, rest: 'Moderate (60-90s)' },
        endurance: { min: 30, max: 120, warmup: 10, rest: 'Short (30-60s)' },
        health: { min: 20, max: 45, warmup: 5, rest: 'Varies' },
        fatloss: { min: 30, max: 60, warmup: 5, rest: 'Short/Active (30s)' }
     };

     const activeGoal = durations[goal];
     
     // Intensity adjustment: higher intensity often means shorter, denser sessions
     let finalMin = activeGoal.min;
     let finalMax = activeGoal.max;

     if (intensity === 3) {
        finalMin -= 5;
        finalMax -= 10;
     } else if (intensity === 1) {
        finalMin += 10;
        finalMax += 15;
     }

     return {
        range: `${finalMin}-${finalMax} min`,
        warmup: activeGoal.warmup,
        rest: activeGoal.rest,
        weeklyTotal: Math.round(((finalMin + finalMax) / 2) * sessionCount),
        label: goal.toUpperCase().replace('LOSS', ' LOSS'),
        intensityLabel: intensity === 1 ? 'Efficiency Focused' : intensity === 2 ? 'Optimal Balance' : 'High Density Training'
     };
  }, [goal, intensity, sessionCount]);

  return { goal, setGoal, intensity, setIntensity, sessionCount, setSessionCount, results };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-white/5 hover:border-emerald-500/40 transition-colors shadow-sm shadow-emerald-500/5">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-6 text-left bg-card group">
        <span className="text-base font-black text-foreground leading-snug tracking-tight group-hover:text-emerald-500 transition-colors">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-muted/5 border-t border-border">
             <p className="p-6 text-muted-foreground leading-relaxed text-sm font-semibold">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Calorie Burn", slug: "daily-calories-burn-calculator", icon: <Flame className="w-5 h-5" />, color: 20 },
  { title: "One Rep Max", slug: "one-rep-max-calculator", icon: <Dumbbell className="w-5 h-5" />, color: 250 },
  { title: "Running Pace", slug: "running-pace-calculator", icon: <Timer className="w-5 h-5" />, color: 140 },
];

export default function WorkoutDurationCalculator() {
  const calc = useWorkoutDurationCalc();
  const [copied, setCopied] = useState(false);

  return (
    <Layout>
      <SEO
        title="Workout Duration Calculator – Optimal Session Length for Your Goals"
        description="Determine how long your workouts should be based on your fitness level, intensity, and specific goals like strength, hypertrophy, or weight loss."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-muted-foreground italic">
          <Link href="/" className="hover:text-emerald-500">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={4} />
          <Link href="/category/health" className="hover:text-emerald-500">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={4} />
          <span className="text-foreground border-b-2 border-emerald-500/30">Workout Duration Tool</span>
        </nav>

        <section className="bg-card rounded-[3rem] overflow-hidden border-2 border-border shadow-2xl px-12 md:px-20 py-14 md:py-24 mb-16 text-center md:text-left relative flex flex-col md:flex-row items-center justify-between gap-16 group">
           <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] px-6 py-2.5 rounded-full border border-emerald-500/20">
                <Timer className="w-4 h-4" />
                Performance Optimization
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85] italic uppercase group-hover:skew-x-1 transition-transform duration-700">
                Session <br/><span className="text-emerald-500">Duration</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-bold leading-relaxed max-w-xl">
                 Calculating the perfect window for maximal growth and minimal stress. Stop overtraining. 
              </p>
           </div>
           <div className="absolute right-0 top-0 p-24 opacity-5 hidden lg:block group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
              <Clock className="w-96 h-96 text-emerald-600" />
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-3 space-y-16">
            {/* CALCULATOR */}
            <div className="rounded-[4rem] border-4 border-border shadow-[0_20px_100px_-20px_rgba(0,0,0,0.1)] bg-card overflow-hidden">
               <div className="h-4 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
               <div className="p-12 md:p-20 space-y-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                     <div className="space-y-12">
                        <div className="space-y-6">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.4em] italic mb-4 block">Select Goal</label>
                           <div className="grid grid-cols-1 gap-3">
                              {(['strength', 'hypertrophy', 'endurance', 'fatloss', 'health'] as WorkoutGoal[]).map(g => (
                                 <button
                                    key={g}
                                    onClick={() => calc.setGoal(g)}
                                    className={`py-5 px-8 rounded-3xl text-xs font-black uppercase tracking-widest border-2 transition-all text-left flex items-center justify-between group ${calc.goal === g ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/40 translate-x-3' : 'bg-muted/30 border-border text-muted-foreground hover:border-emerald-500/50'}`}
                                 >
                                    <span>{g === 'fatloss' ? 'Fat Loss' : g.toUpperCase()}</span>
                                    {calc.goal === g && <Target className="w-6 h-6 animate-pulse" />}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-6">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.4em] italic block">Intensity Scale</label>
                           <div className="flex gap-2">
                              {[1, 2, 3].map(i => (
                                 <button
                                    key={i}
                                    onClick={() => calc.setIntensity(i as 1 | 2 | 3)}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${calc.intensity === i ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-muted/30 border-border text-muted-foreground hover:border-emerald-500/40'}`}
                                 >
                                    {i === 1 ? 'LOW' : i === 2 ? 'MED' : 'HIGH'}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-col justify-center gap-12">
                        <AnimatePresence mode="wait">
                           <motion.div 
                              key={calc.results.range}
                              initial={{ opacity: 0, scale: 0.8, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              className="rounded-[3rem] bg-emerald-500/5 border-4 border-emerald-500/20 p-12 text-center space-y-8 shadow-[inset_0_2px_40px_rgba(0,0,0,0.05)]"
                           >
                              <div className="space-y-2">
                                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Recommended Session</p>
                                 <div className="text-7xl md:text-9xl font-black text-foreground tracking-tighter italic">
                                    {calc.results.range}
                                 </div>
                                 <p className="text-[11px] font-black uppercase text-muted-foreground opacity-70 tracking-widest">{calc.results.intensityLabel}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pb-4">
                                 <div className="p-6 bg-card rounded-[2rem] border-2 border-border shadow-sm">
                                    <p className="text-[8px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Rest Period</p>
                                    <p className="text-sm font-black text-foreground">{calc.results.rest}</p>
                                 </div>
                                 <div className="p-6 bg-card rounded-[2rem] border-2 border-border shadow-sm">
                                    <p className="text-[8px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Warmup Need</p>
                                    <p className="text-sm font-black text-foreground">{calc.results.warmup} min</p>
                                 </div>
                              </div>

                              <div className="pt-6 border-t-2 border-emerald-500/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                 <span className="text-muted-foreground">Weekly Target</span>
                                 <span className="text-emerald-600 text-lg">{calc.results.weeklyTotal} min</span>
                              </div>
                           </motion.div>
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
            </div>

            {/* Content Section */}
            <section className="bg-card border-2 border-border rounded-[4rem] p-12 md:p-20 space-y-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500/20" />
               <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight italic uppercase">Training Windows</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                     <p className="text-lg text-foreground/70 font-bold leading-relaxed">
                        More is not always better. Research suggests that for many lifters, the optimal window for intense activity is between 45 and 75 minutes. Beyond this, cortisol levels rise sharply while testosterone/growth hormone begin to decline.
                     </p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-600 group-hover:scale-110 transition-transform italic">HR</div>
                           <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Hypertrophy (Muscle Growth)</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-16 font-semibold italic">Requires enough volume (reps x weight) to stimulate growth, typically needing 60-90 minutes including rest.</p>
                     </div>
                  </div>
                  <div className="space-y-6 bg-muted/20 border-2 border-border p-10 rounded-[3rem]">
                     <h4 className="font-black text-sm uppercase flex items-center gap-3 text-emerald-600 italic">
                        <Dumbbell className="w-6 h-6" /> Strength Logic
                     </h4>
                     <p className="text-xs text-muted-foreground leading-relaxed font-bold italic tracking-wide">
                        Strength sessions are characterized by extremely heavy loads and long rest periods. While the actual working time is low, the session duration remains high (60m+) to allow the central nervous system (CNS) to recover between attempts.
                     </p>
                  </div>
               </div>
            </section>

            <section className="space-y-8 px-8">
               <h2 className="text-3xl font-black italic tracking-tighter uppercase px-4 border-l-8 border-emerald-500">FAQ & Fundamentals</h2>
               <div className="space-y-4">
                  <FaqItem 
                    q="What happens if I workout for more than 2 hours?"
                    a="Occasional long sessions are fine (especially for ultra-endurance), but daily 2+ hour sessions often lead to overtraining, joint fatigue, and diminished returns. Your intensity usually drops, making those extra minutes lower quality."
                  />
                  <FaqItem 
                    q="Is a 20-minute workout worth it?"
                    a="Absolutely. High-intensity interval training (HIIT) or dense circuit training can provide massive metabolic benefits in just 15-20 minutes. It's about density (how much work you do per minute) rather than just total time."
                  />
                  <FaqItem 
                    q="Does the 60-minute include stretching?"
                    a="Ideally, yes. A balanced 60-minute session should include 5-10m of dynamic warmup, 45-50m of main training, and 5-10m of cooldown/breathwork."
                  />
               </div>
            </section>
          </div>

          <div className="space-y-10">
             <div className="sticky top-28 space-y-10">
                <div className="p-10 rounded-[2.5rem] bg-emerald-950 text-white shadow-2xl relative overflow-hidden group border-2 border-emerald-500/20">
                   <Zap className="w-24 h-24 absolute -right-6 -bottom-6 opacity-30 group-hover:scale-125 transition-transform duration-1000" />
                   <h4 className="font-black italic text-xl uppercase mb-4 flex items-center gap-2">
                       Max Output
                   </h4>
                   <p className="text-xs font-bold leading-relaxed opacity-60 italic">
                     "The quality of your training session is measured by the intent you bring to every rep, not the clock on the wall."
                   </p>
                </div>

                <div className="bg-card border-4 border-border p-10 rounded-[2.5rem] shadow-xl">
                   <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em] mb-8 italic">Metric Tools</h3>
                   <div className="space-y-8">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/health/${t.slug}`} className="flex items-center gap-5 group">
                           <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/40">
                              <span className="group-hover:text-white group-hover:scale-125 transition-all">{t.icon}</span>
                           </div>
                           <span className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-foreground transition-colors tracking-widest">{t.title}</span>
                        </Link>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <button onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                   }} className="w-full h-16 rounded-3xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? 'Copied' : 'Share Tool'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
