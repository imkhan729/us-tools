import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Calendar, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Target, AlertCircle
} from "lucide-react";

function useCalc() {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState<"days" | "weeks" | "months">("days");
  const [excludeWeekends, setExcludeWeekends] = useState(false);

  const result = useMemo(() => {
    if (!startDate || isNaN(amount)) return null;
    const start = new Date(startDate + 'T00:00:00');
    if (isNaN(start.getTime())) return null;

    let targetDate = new Date(start);
    
    if (excludeWeekends && unit === "days") {
      // Logic for adding "Business Days"
      let added = 0;
      while (added < amount) {
        targetDate.setDate(targetDate.getDate() + 1);
        const day = targetDate.getDay();
        if (day !== 0 && day !== 6) {
          added++;
        }
      }
    } else {
      if (unit === "days") {
        targetDate.setDate(targetDate.getDate() + amount);
      } else if (unit === "weeks") {
        targetDate.setDate(targetDate.getDate() + (amount * 7));
      } else {
        targetDate.setMonth(targetDate.getMonth() + amount);
      }
    }

    const formattedDate = targetDate.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return {
      date: targetDate,
      formattedDate,
      totalDays: Math.round((targetDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    };
  }, [startDate, amount, unit, excludeWeekends]);

  return {
    startDate, setStartDate,
    amount, setAmount,
    unit, setUnit,
    excludeWeekends, setExcludeWeekends,
    result
  };
}

function ResultInsight({ result }: { result: any }) {
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center"
    >
       <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-2">Final Deadline</span>
          <h3 className="text-3xl md:text-4xl font-black text-foreground mb-2 leading-tight">
            {result.formattedDate}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            This project span covers {result.totalDays} total calendar days.
          </p>
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
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Working Days", slug: "working-days-calculator", icon: <BadgeCheck className="w-5 h-5" />, color: 25, benefit: "Count business days" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <Calendar className="w-5 h-5" />, color: 140, benefit: "Gap between dates" },
  { title: "Countdown", slug: "countdown-timer", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Watch the time fly" },
];

export default function DeadlineCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Deadline Calculator – Calculate Project End Dates Instantly"
        description="Plan your projects with precision. Add days, weeks, or months to any start date to find your final deadline. Supports skipping weekends."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Deadline Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Target className="w-3.5 h-3.5" />
            Project Mastery
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Deadline Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Avoid missing key milestones. Input your start date and duration to instantly project your delivery date. Factor in business days for a realistic timeline.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Accurate
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-orange-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="p-6 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Project Start Date</label>
                      <input 
                        type="date" 
                        className="tool-calc-input w-full text-lg font-bold py-3" 
                        value={calc.startDate} 
                        onChange={e => calc.setStartDate(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Project Duration</label>
                      <div className="flex gap-2">
                         <input 
                           type="number" 
                           className="tool-calc-input w-24 text-center font-bold" 
                           value={calc.amount} 
                           onChange={e => calc.setAmount(parseInt(e.target.value) || 0)} 
                         />
                         <select 
                           className="tool-calc-input flex-1 px-4 font-bold appearance-none bg-muted/30"
                           value={calc.unit}
                           onChange={e => calc.setUnit(e.target.value as any)}
                         >
                           <option value="days">Total Days</option>
                           <option value="weeks">Weeks</option>
                           <option value="months">Months</option>
                         </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${calc.excludeWeekends ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                           <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-foreground">Skip Weekends?</p>
                           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Only applies to 'Total Days' mode</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => calc.setExcludeWeekends(!calc.excludeWeekends)}
                       className={`w-14 h-7 rounded-full transition-colors relative ${calc.excludeWeekends ? 'bg-orange-500' : 'bg-muted'}`}
                     >
                        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${calc.excludeWeekends ? 'translate-x-7' : 'translate-x-0'}`} />
                     </button>
                  </div>

                  <ResultInsight result={calc.result} />
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Mastering Your Timeline</h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 Professional project management relies on three pillars: Scope, Budget, and Time. Accurately determining your end date (the deadline) is the first step toward resource allocation and client satisfaction.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                   <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                     <BadgeCheck className="w-4 h-4 text-emerald-500" /> Working Day Accuracy
                   </h3>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                     When you toggle 'Skip Weekends', our engine simulates each day one-by-one, ensuring your 30-day sprint is actually 30 full business days, which could span over 6 calendar weeks.
                   </p>
                 </div>
                 <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10">
                   <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-blue-500" /> Buffer Management
                   </h3>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                     Always add 10-15% 'buffer' time to your calculated deadline. If the tool says you finish on the 10th, aiming for the 14th internally ensures you handle unexpected blockers gracefully.
                   </p>
                 </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Deadline FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does 'Skip Weekends' work for Months or Weeks?"
                  a="Currently, skipping weekends is optimized for 'Total Days' tracking. If you select 'Weeks', it naturally multiplies by 7 (full weeks), and 'Months' adds the calendar month count regardless of where the day falls."
                />
                <FaqItem
                  q="Can I calculate a deadline in the past?"
                  a="Yes. You can enter a negative duration or a past start date to reverse-engineer when a project should have started or finished for audit purposes."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                  <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Link</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-md"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4">Related Utilities</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
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
