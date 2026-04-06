import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Heart, Gauge, Timer, Trophy, Flame, Wind, Activity as HeartRateIcon,
  Calculator, Star, Lock, ArrowRight
} from "lucide-react";

function useVO2MaxCalc() {
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70); // in kg
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [walkTimeMin, setWalkTimeMin] = useState(15);
  const [walkTimeSec, setWalkTimeSec] = useState(0);
  const [heartRate, setHeartRate] = useState(120);

  const results = useMemo(() => {
     const weightLbs = weight * 2.20462;
     const genderVal = sex === 'male' ? 1 : 0;
     const timeMinDecimal = walkTimeMin + (walkTimeSec / 60);

     const vo2 = 132.853 
                - (0.0769 * weightLbs) 
                - (0.3877 * age) 
                + (6.315 * genderVal) 
                - (3.2649 * timeMinDecimal) 
                - (0.1565 * heartRate);

     const finalVO2 = Math.max(0, Math.round(vo2 * 10) / 10);
     
     let level = 'Fair';
     let color = 'text-amber-500';
     
     if (sex === 'male') {
        if (finalVO2 > 60) { level = 'Elite'; color = 'text-indigo-600'; }
        else if (finalVO2 > 52) { level = 'Excellent'; color = 'text-emerald-500'; }
        else if (finalVO2 > 44) { level = 'Good'; color = 'text-blue-600'; }
     } else {
        if (finalVO2 > 56) { level = 'Elite'; color = 'text-indigo-600'; }
        else if (finalVO2 > 47) { level = 'Excellent'; color = 'text-emerald-500'; }
        else if (finalVO2 > 39) { level = 'Good'; color = 'text-blue-600'; }
     }

     return {
        vo2: finalVO2.toFixed(1),
        level,
        color,
        cardioAge: Math.max(20, Math.round(80 - finalVO2))
     };
  }, [age, weight, sex, walkTimeMin, walkTimeSec, heartRate]);

  return { age, setAge, weight, setWeight, sex, setSex, walkTimeMin, setWalkTimeMin, walkTimeSec, setWalkTimeSec, heartRate, setHeartRate, results };
}

function ResultInsight({ level, vo2 }: { level: string; vo2: string }) {
  const message = `Your estimated VO2 Max is ${vo2} mL/kg/min, which reflects a '${level}' cardiovascular rating for your demographic. This score represents your body's maximum capacity to transport and use oxygen during intense exercise.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20"
    >
      <div className="flex gap-2 items-start text-xs font-bold text-indigo-600 italic">
        <Gauge className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed opacity-80 uppercase italic tracking-tighter">{message}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-foreground italic uppercase italic underline underline-offset-4 decoration-indigo-500/10 tracking-widest leading-none">
        <span className="text-base font-bold leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-indigo-500 flex-shrink-0 italic tracking-widest text-center">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border mt-1 pt-4 px-5 pb-5 italic font-black uppercase tracking-widest text-[10px] opacity-70">
            <p className="text-muted-foreground leading-relaxed italic opacity-80 uppercase tracking-tighter decoration-indigo-500 decoration-2">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Target Heart Rate", slug: "heart-rate-calculator", icon: <HeartRateIcon />, color: 170, benefit: "Optimize your cardio intensity" },
  { title: "Running Pace", slug: "running-pace-calculator", icon: <Timer />, color: 250, benefit: "Calculate race & training speeds" },
  { title: "BMR Performance", slug: "bmr-calculator", icon: <Flame />, color: 30, benefit: "See baseline energy expenditure" },
];

export default function VO2MaxCalculator() {
  const calc = useVO2MaxCalc();
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="VO2 Max Calculator – Aerobic Fitness & Peak Capacity | US Online Tools"
        description="Estimate your VO2 Max using the Rockport Fitness Walking Test. Calculate your peak oxygen uptake and aerobic power accurately with our free online fitness tool."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8 italic">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors italic uppercase">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors underline decoration-4 decoration-indigo-500/10 underline-offset-8 italic">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground tracking-widest font-black uppercase italic">Aerobic Power Tool</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-indigo-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10 shadow-2xl shadow-indigo-500/5 italic">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Gauge className="w-3.5 h-3.5" />
            Endurance Analytics
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl italic uppercase">VO2 Max Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl italic tracking-tighter opacity-80 uppercase italic">
            Measure your cardiorespiratory efficiency with elite precision. Using the Rockport method, we estimate your body's maximum oxygen uptake — the gold standard for aerobic fitness.
          </p>
          <div className="flex flex-wrap gap-2 mb-5 font-black uppercase tracking-widest text-[9px]">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> Clinical Standard</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 font-bold px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> Instant Assessment</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 font-bold px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5 transition-all">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-10 space-y-12">
                  <div className="flex items-center gap-3 mb-1 font-black italic">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0 animate-pulse-slow shadow-xl shadow-indigo-500/20 italic">
                      <Gauge className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic tracking-widest">Performance Engine</p>
                      <p className="text-sm text-muted-foreground italic">Input your metrics to estimate your relative aerobic power.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-black italic uppercase">
                     <div className="space-y-8 font-black uppercase text-[10px] tracking-widest italic">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <label className="border-l-4 border-indigo-500 pl-3 font-bold opacity-60 italic">Age</label>
                              <input 
                                 type="number" value={calc.age} 
                                 onChange={e => calc.setAge(parseInt(e.target.value) || 30)}
                                 className="w-full h-16 px-6 rounded-2xl bg-muted/20 border-2 border-border text-lg font-black text-foreground outline-none focus:border-indigo-500 transition-all italic hover:bg-muted/30"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="border-l-4 border-indigo-600 pl-3 font-bold opacity-60 italic">Weight (KG)</label>
                              <input 
                                 type="number" value={calc.weight} 
                                 onChange={e => calc.setWeight(parseInt(e.target.value) || 70)}
                                 className="w-full h-16 px-6 rounded-2xl bg-muted/20 border-2 border-border text-lg font-black text-foreground outline-none focus:border-indigo-600 transition-all italic tracking-widest"
                              />
                           </div>
                        </div>

                        <div className="space-y-4 italic uppercase">
                           <label className="border-l-4 border-indigo-500 pl-4 font-bold opacity-60 italic tracking-widest">1-Mile Walk Time</label>
                           <div className="flex gap-4 italic uppercase">
                              <div className="relative flex-1 italic uppercase">
                                 <input 
                                    type="number" value={calc.walkTimeMin} 
                                    onChange={e => calc.setWalkTimeMin(parseInt(e.target.value) || 0)}
                                    className="w-full h-16 px-5 rounded-2xl bg-muted/20 border-2 border-border font-black text-center"
                                    placeholder="Min"
                                 />
                                 <span className="absolute top-1/2 -translate-y-1/2 right-4 text-[8px] opacity-30 italic">MIN</span>
                              </div>
                              <div className="relative flex-1">
                                 <input 
                                    type="number" value={calc.walkTimeSec} 
                                    onChange={e => calc.setWalkTimeSec(parseInt(e.target.value) || 0)}
                                    className="w-full h-16 px-5 rounded-2xl bg-muted/20 border-2 border-border font-black text-center"
                                    placeholder="Sec"
                                 />
                                 <span className="absolute top-1/2 -translate-y-1/2 right-4 text-[8px] opacity-30 italic tracking-widest">SEC</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4 italic uppercase tracking-widest">
                           <label className="border-l-4 border-indigo-500 pl-4 font-bold opacity-60">Sex</label>
                           <div className="grid grid-cols-2 gap-4 italic uppercase tracking-widest">
                              {(['male', 'female'] as const).map(s => (
                                 <button 
                                    key={s} onClick={() => calc.setSex(s)}
                                    className={`py-4 rounded-xl border-2 transition-all font-bold tracking-widest leading-none ${calc.sex === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-muted/10 border-border text-muted-foreground hover:border-indigo-500/20 italic tracking-widest'}`}
                                 >
                                    {s}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 italic uppercase tracking-widest italic tracking-tighter">
                           <label className="border-l-4 border-indigo-500/40 pl-3 font-bold opacity-60 italic tracking-tighter">Heart Rate (BPM)</label>
                           <input 
                              type="range" min="60" max="220" value={calc.heartRate} 
                              onChange={e => calc.setHeartRate(parseInt(e.target.value))}
                              className="w-full h-4 bg-muted/50 rounded-full appearance-none cursor-pointer accent-indigo-600 italic tracking-tighter"
                           />
                           <div className="text-right font-black italic text-indigo-600 pr-2">{calc.heartRate} BPM</div>
                        </div>
                     </div>

                     <div className="space-y-8 font-black uppercase text-center italic tracking-widest">
                         <div className="bg-muted/5 border-4 border-border rounded-[3rem] p-10 space-y-10 shadow-inner relative overflow-hidden group/res text-center italic tracking-widest italic tracking-tighter">
                             <div className="space-y-2">
                                <p className="text-[10px] font-black text-indigo-600 opacity-40 uppercase tracking-widest">ML/KG/MIN</p>
                                <motion.p 
                                    key={calc.results.vo2} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    className={`text-[8rem] md:text-[10rem] font-black italic tracking-tighter leading-none ${calc.results.color}`}
                                >
                                    {calc.results.vo2}
                                </motion.p>
                                <p className="text-xl font-black text-muted-foreground uppercase italic tracking-[0.2em]">{calc.results.level} RATING</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                <div className="p-4 rounded-2xl bg-card border-2 border-border shadow-xl">
                                   <p className="text-[9px] opacity-40 mb-1">Cardio Age</p>
                                   <p className="text-2xl font-black text-indigo-600">{calc.results.cardioAge}<span className="text-[10px] ml-1">YR</span></p>
                                </div>
                                <div className="p-4 rounded-2xl bg-card border-2 border-border shadow-xl">
                                   <p className="text-[9px] opacity-40 mb-1">Standing</p>
                                   <p className="text-2xl font-black text-emerald-500 group-hover/res:scale-110 transition-transform">Elite</p>
                                </div>
                             </div>
                         </div>
                         <ResultInsight level={calc.results.level} vo2={calc.results.vo2} />
                     </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-10 italic font-black uppercase tracking-widest">
               <h2 className="text-3xl font-black text-foreground tracking-tight mb-8 italic underline decoration-[10px] decoration-indigo-500/10 underline-offset-8 italic uppercase italic tracking-tighter">The Lab Protocol</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 italic font-black uppercase tracking-widest">
                  <div className="p-8 rounded-3xl border-4 border-border bg-muted/5 space-y-4 italic font-black text-[11px] tracking-widest uppercase italic tracking-tighter">
                     <p className="text-indigo-600 font-bold opacity-60 italic tracking-tighter underline underline-offset-4 decoration-2 decoration-indigo-500/10 underline-offset-8">Physiological Ceiling</p>
                     <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80 uppercase italic tracking-tighter">
                        VO2 Max represents the upper structural limit of the cardiovascular system. It is the product of cardiac output and the arteriovenous oxygen difference, reflecting how many milliliters of oxygen your body can process per kilogram of weight per minute.
                     </p>
                  </div>
                  <div className="p-8 rounded-3xl border-4 border-border bg-indigo-600/[0.03] space-y-4 italic font-black text-[11px] tracking-widest uppercase italic tracking-tighter">
                     <p className="text-indigo-600 font-bold opacity-60 underline underline-offset-4 decoration-2 decoration-indigo-500/10 underline-offset-8">Rockport Validity</p>
                     <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80 uppercase italic tracking-tighter">
                        The Rockport Fitness Walking Test is a validated clinical field assessment. By measuring the heart rate response to a standardized one-mile walk, we can calculate stroke volume and aerobic capacity with approximately 90% reliability compared to lab-controlled metabolic tests.
                     </p>
                  </div>
               </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 italic font-black text-center text-[10px] uppercase tracking-widest italic tracking-tighter opacity-80 decoration-2 decoration-indigo-500/10 underline-offset-4">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6 uppercase italic underline-offset-4 italic underline decoration-4 decoration-border">Performance FAQ</h2>
               <div className="space-y-4 font-black italic uppercase tracking-widest italic tracking-tighter opacity-80 decoration-2 decoration-indigo-500/10 underline-offset-4">
                  <FaqItem q="What is a good score for my age?" a="Sedentary averages for 30yr olds are 35-40 mL/kg/min for males and 28-33 for females. Elite endurance athletes often hit scores of 80 or above." />
                  <FaqItem q="Can I improve my VO2 Max?" a="Yes. High-Intensity Interval Training (HIIT) is the most effective method, potentially increasing your score by 15-20% through sustained cardiac remodeling." />
                  <FaqItem q="Is the walk test accurate?" a="While lab metabolic tests are the gold standard, the Rockport walking test offers a highly reliable estimation for the general population without the need for maximal physical exertion." />
               </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl bg-indigo-950 p-10 text-white italic font-black text-center shadow-2xl shadow-indigo-500/20 italic tracking-widest uppercase">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic underline decoration-indigo-500 decoration-8 underline-offset-8 italic">Optimize Your Capacity</h2>
                <p className="text-indigo-400 opacity-60 font-bold text-sm uppercase italic tracking-widest italic tracking-tighter">Explore our library of elite performance and health utilities.</p>
                <Link href="/" className="inline-block px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all italic active:scale-95 shadow-xl shadow-indigo-500/30 underline decoration-2 underline-offset-4">Browse Library</Link>
              </div>
            </section>
          </div>

          <div className="space-y-6 italic font-black uppercase text-center tracking-widest italic tracking-tighter">
            <div className="sticky top-28 space-y-6 italic font-black uppercase tracking-widest italic tracking-tighter">
              <div className="bg-card border-4 border-border rounded-[3rem] p-6 shadow-2xl italic tracking-tighter">
                <h3 className="text-xs font-black text-indigo-600 tracking-[0.2em] mb-6 uppercase italic underline decoration-2 decoration-border underline-offset-4 italic">Fitness Suite</h3>
                <div className="space-y-2 italic font-black uppercase text-center italic tracking-widest italic tracking-tighter">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/health/${tool.slug}`} className="group flex items-center gap-4 p-4 rounded-3xl hover:bg-muted/40 transition-all border-2 border-transparent hover:border-border italic">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 animate-pulse-slow shadow-lg shadow-indigo-500/10 italic" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0 font-black italic">
                        <p className="text-xs font-black text-muted-foreground group-hover:text-foreground transition-all truncate italic tracking-tighter uppercase italic opacity-80">{tool.title}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 transition-all opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

               <div className="bg-indigo-950 border-4 border-indigo-500/20 rounded-[3rem] p-8 text-white shadow-2xl italic font-black uppercase tracking-widest text-center italic tracking-tighter shadow-xl shadow-indigo-500/20">
                  <HeartRateIcon className="w-12 h-12 mx-auto mb-6 text-indigo-400 rotate-12" />
                  <p className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-40 italic tracking-tighter">Peak Vitals</p>
                  <button onClick={copyUrl} className="w-full h-16 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-400/20 active:scale-95 italic">{copied ? 'COPIED' : 'SHARE RESULTS'}</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
