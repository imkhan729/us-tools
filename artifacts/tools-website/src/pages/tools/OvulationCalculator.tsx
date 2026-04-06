import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Heart, Calendar, Clock,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check, BadgeCheck,
  Star, Info, Sparkles, Thermometer, Flower2
} from "lucide-react";

function useOvulationCalc() {
  const [lastPeriod, setLastPeriod] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28);

  const results = useMemo(() => {
    if (!lastPeriod) return null;
    const lmp = new Date(lastPeriod);
    
    // Ovulation is usually cycleLength - 14 days after LMP
    // Fertile window is usually 5 days before and 1 day after ovulation
    const ovulationDate = new Date(lmp);
    ovulationDate.setDate(lmp.getDate() + (cycleLength - 14));

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(lmp.getDate() + cycleLength);

    const dueDateIfConceived = new Date(ovulationDate);
    dueDateIfConceived.setDate(ovulationDate.getDate() + 266);

    return {
      ovulationDate: ovulationDate.toLocaleDateString('en-US', { dateStyle: 'long' }),
      fertileWindow: `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      nextPeriod: nextPeriod.toLocaleDateString('en-US', { dateStyle: 'long' }),
      dueDate: dueDateIfConceived.toLocaleDateString('en-US', { dateStyle: 'long' }),
      daysUntilOvulation: Math.max(0, Math.ceil((ovulationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    };
  }, [lastPeriod, cycleLength]);

  return { lastPeriod, setLastPeriod, cycleLength, setCycleLength, results };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Due Date Tool", slug: "pregnancy-due-date-calculator", icon: <Heart className="w-5 h-5" />, color: 330, benefit: "Timeline tracking" },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Thermometer className="w-5 h-5" />, color: 10, benefit: "Metabolic rate" },
  { title: "Water Intake", slug: "water-intake-calculator", icon: <Info className="w-5 h-5" />, color: 210, benefit: "Hydration goals" },
];

export default function OvulationCalculator() {
  const calc = useOvulationCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Ovulation Calculator – Predict Your Fertile Window"
        description="Predict your most fertile days and estimated ovulation date based on your cycle length. Free ovulation calendar for family planning."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Ovulation Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-fuchsia-500/5 px-8 md:px-12 py-10 md:py-14 mb-10 text-center md:text-left relative">
           <div className="absolute top-0 right-0 p-10 opacity-10 hidden md:block">
              <Flower2 className="w-32 h-32 text-violet-600" />
           </div>
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Family Planning
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Ovulation Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Identify your most fertile days. Predict when you're likely to ovulate and find the best times for conception based on your personal cycle patterns.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Biological Timing
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Calendar className="w-3.5 h-3.5" /> Fertile Window
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-violet-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                <div className="p-8 md:p-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest italic">Last Period Start Date</label>
                            <input 
                              type="date" 
                              className="tool-calc-input text-xl font-bold w-full" 
                              value={calc.lastPeriod} 
                              onChange={e => calc.setLastPeriod(e.target.value)} 
                            />
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                               <span>Average Cycle Length</span>
                               <span className="text-violet-600">{calc.cycleLength} Days</span>
                            </div>
                            <input 
                              type="range" 
                              min="20" 
                              max="45" 
                              value={calc.cycleLength}
                              onChange={e => calc.setCycleLength(parseInt(e.target.value))}
                              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
                            />
                         </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {calc.results && (
                          <motion.div 
                            key={calc.results.ovulationDate}
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-8 rounded-3xl bg-violet-500/5 border border-violet-500/20 text-center space-y-4 shadow-inner"
                          >
                             <p className="text-xs font-black uppercase text-violet-600 tracking-widest">Ovulation Prediction</p>
                             <h2 className="text-3xl md:text-4xl font-black text-foreground">{calc.results.ovulationDate}</h2>
                             
                             <div className="py-4 border-y border-violet-500/10 space-y-4">
                                <div>
                                   <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Fertile Window</p>
                                   <p className="text-xl font-black text-violet-600">{calc.results.fertileWindow}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Next Period</p>
                                      <p className="text-sm font-bold text-foreground">{calc.results.nextPeriod}</p>
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Estimated Due Date</p>
                                      <p className="text-sm font-bold text-foreground">{calc.results.dueDate}</p>
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center justify-center gap-2 text-violet-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{calc.results.daysUntilOvulation} Days Until Ovulation</span>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6 italic">Tracking Fertility & Ovulation</h2>
               <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                 Your fertile window comprises the days in your menstrual cycle when pregnancy is possible. The days leading up to and including the day of ovulation are the most fertile.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-5 rounded-2xl bg-muted/30 border border-border">
                     <h4 className="font-black text-foreground text-sm uppercase flex items-center gap-2">
                        <Activity className="w-5 h-5 text-violet-500" /> The standard rule
                     </h4>
                     <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        Ovulation usually occurs roughly 14 days before your next period starts. If you have a 28-day cycle, you'll likely ovulate on day 14. For a 30-day cycle, it would be around day 16.
                     </p>
                  </div>
                  <div className="space-y-4 p-5 rounded-2xl bg-muted/30 border border-border">
                     <h4 className="font-black text-foreground text-sm uppercase flex items-center gap-2">
                        <Star className="w-5 h-5 text-violet-500" /> Fertile Signs
                     </h4>
                     <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        Pay attention to body changes like increased cervical mucus (resembling egg whites), a slight rise in basal body temperature, or mild pelvic twinges known as Mittelschmerz.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight italic">Common Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How long does ovulation last?"
                  a="The actual release of an egg from the ovary (ovulation) only takes a few moments. Once released, the egg survives for about 12 to 24 hours. However, since sperm can live in the body for up to 5 days, your fertile window is much longer than the ovulation event itself."
                />
                <FaqItem
                  q="Can I ovulate twice in one cycle?"
                  a="It is possible to release two eggs within a 24-hour period (which can result in fraternal twins), but you won't have two separate ovulation events several days apart in the same cycle."
                />
                <FaqItem
                  q="Does stress affect ovulation timing?"
                  a="Yes, physical or emotional stress can delay or even temporarily stop ovulation by affecting the hormones (GnRH) that trigger the process. This is a common reason for irregular cycles."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share results</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-violet-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900 to-fuchsia-900 text-white shadow-xl relative overflow-hidden group">
                   <Sparkles className="w-16 h-16 absolute -right-4 -top-4 opacity-20 group-hover:scale-110 transition-transform duration-700 font-bold" />
                   <h4 className="font-black text-sm mb-2 flex items-center gap-2">
                      <Flower2 className="w-4 h-4" /> Natural Cycle
                   </h4>
                   <p className="text-[11px] leading-relaxed opacity-80 font-medium italic">
                     "Understanding your body's rhythm is the first step toward successful planning. This tool provides estimates based on biological averages."
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest italic tracking-wider">Related Healthcare Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/health/${t.slug}`} className="flex items-center gap-3 group px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-colors">
                              {t.icon}
                           </div>
                           <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{t.title}</span>
                        </Link>
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
