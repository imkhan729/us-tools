import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ChevronDown, Calendar, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Plus, Trash2, Repeat, Info
} from "lucide-react";

// Shift Logic
function useShiftCalc() {
  const [cycleStart, setCycleStart] = useState(() => new Date().toISOString().split('T')[0]);
  const [onDays, setOnDays] = useState(4);
  const [offDays, setOffDays] = useState(2);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const calendar = useMemo(() => {
    const totalDays = daysInMonth(viewMonth, viewYear);
    const firstDay = firstDayOfMonth(viewMonth, viewYear);
    const start = new Date(cycleStart + 'T00:00:00');
    
    const days = [];
    for (let d = 1; d <= totalDays; d++) {
      const current = new Date(viewYear, viewMonth, d);
      const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: 'work' | 'off' | 'unknown' = 'unknown';
      if (diffDays >= 0) {
        const cyclePos = diffDays % (onDays + offDays);
        status = cyclePos < onDays ? 'work' : 'off';
      } else {
        // Reverse cycle logic for past dates
        const cyclePos = (Math.abs(diffDays) % (onDays + offDays));
        if (cyclePos === 0) {
          status = 'work'; // Zero case
        } else {
          // If we go back 1 day, it's (on+off - 1) pos
          const reversePos = (onDays + offDays) - cyclePos;
          status = reversePos < onDays ? 'work' : 'off';
        }
      }

      days.push({ day: d, status });
    }
    return { days, firstDay };
  }, [cycleStart, onDays, offDays, viewMonth, viewYear]);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(viewYear, viewMonth));

  const changeMonth = (delta: number) => {
    let nextM = viewMonth + delta;
    let nextY = viewYear;
    if (nextM > 11) {
      nextM = 0;
      nextY++;
    } else if (nextM < 0) {
      nextM = 11;
      nextY--;
    }
    setViewMonth(nextM);
    setViewYear(nextY);
  };

  return { 
    cycleStart, setCycleStart, 
    onDays, setOnDays, 
    offDays, setOffDays, 
    viewMonth, viewYear, 
    calendar, monthName, 
    changeMonth 
  };
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
  { title: "Working Days", slug: "working-days-calculator", icon: <BadgeCheck className="w-5 h-5" />, color: 25, benefit: "Filter out weekends" },
  { title: "Hourly Pay", slug: "hourly-time-calculator", icon: <Zap className="w-5 h-5" />, color: 140, benefit: "Wage tracking tool" },
  { title: "Overtime Calc", slug: "overtime-calculator", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Extra effort reward" },
];

export default function ShiftScheduleCalculator() {
  const calc = useShiftCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Shift Schedule Calculator – Plan Rotating Work Cycles"
        description="Plan your work life with our rotating shift schedule calculator. Visualize 4-on/2-off, 2-2-3, or any custom cycle on a clean calendar."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Shift Schedule Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Repeat className="w-3.5 h-3.5" />
            Work-Life Optimization
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Shift Schedule Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Take control of your calendar. Our rotating shift planner helps you visualize exactly when you'll be on the clock, months in advance.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Cycle-Aware
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Fast Visuals
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-orange-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="p-6 md:p-10 space-y-10">
                  {/* Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                       <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Cycle Start Date</label>
                       <input 
                         type="date" 
                         className="tool-calc-input w-full font-bold" 
                         value={calc.cycleStart} 
                         onChange={e => calc.setCycleStart(e.target.value)} 
                       />
                       <p className="text-[10px] text-muted-foreground leading-tight">When your first 'On' day begins.</p>
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">On Duty Days</label>
                       <input 
                         type="number" 
                         className="tool-calc-input w-full font-bold" 
                         value={calc.onDays} 
                         onChange={e => calc.setOnDays(parseInt(e.target.value) || 1)} 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Off Duty Days</label>
                       <input 
                         type="number" 
                         className="tool-calc-input w-full font-bold" 
                         value={calc.offDays} 
                         onChange={e => calc.setOffDays(parseInt(e.target.value) || 1)} 
                       />
                    </div>
                  </div>

                  {/* Calendar Display */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-foreground">{calc.monthName} {calc.viewYear}</h3>
                       <div className="flex gap-2">
                          <button onClick={() => calc.changeMonth(-1)} className="p-2 rounded-lg bg-muted text-foreground hover:bg-orange-500 hover:text-white transition-all">
                             <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button onClick={() => calc.changeMonth(1)} className="p-2 rounded-lg bg-muted text-foreground hover:bg-orange-500 hover:text-white transition-all">
                             <ChevronRight className="w-5 h-5" />
                          </button>
                       </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                       <div className="grid grid-cols-7 mb-4">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-muted-foreground uppercase py-2">{d}</div>
                          ))}
                       </div>
                       <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: calc.calendar.firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-12 border border-transparent" />
                          ))}
                          {calc.calendar.days.map(d => (
                            <div 
                              key={d.day} 
                              className={`h-12 md:h-16 rounded-xl flex flex-col items-center justify-center border transition-all relative group ${
                                d.status === 'work' 
                                  ? 'bg-orange-600/10 border-orange-600/20 text-orange-600 shadow-sm' 
                                  : 'bg-card border-border text-foreground hover:border-orange-500/40'
                              }`}
                            >
                               <span className="text-sm font-black">{d.day}</span>
                               {d.status === 'work' && (
                                 <span className="text-[8px] font-black uppercase mt-1">ON</span>
                               )}
                               {d.status === 'off' && (
                                 <span className="text-[8px] font-bold text-muted-foreground/40 uppercase mt-1">OFF</span>
                               )}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground justify-center pt-4 border-t border-border">
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-600" /> On Duty</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-border" /> Off Duty / Rest</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-bold text-foreground">Pro-Tip for 2-2-3 Rotations</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       Many healthcare and logistics teams use a 'Pitman' rotation (2-2-3). While the cycles are more complex, high-frequency shifts can be planned by setting your on/off days based on your specific team week.
                    </p>
                 </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Mastering Rotating Schedules</h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 Working in shifts requires unique planning. Traditional calendars don't account for the fact that your 'weekend' might fall on a Tuesday and Wednesday. Our calculator bridges that gap by applying math to your work-life balance.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2 italic">
                       Avoid Single-Shift Burnout
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       Use the calendar to look 3-4 months ahead. If you see a particularly heavy block of work dates intersecting with personal holidays or events, you can plan your PTO (Paid Time Off) request much earlier.
                    </p>
                 </div>
                 <div className="space-y-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2 italic">
                       Cycle Consistency
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       The 'Cycle Start Date' is crucial. Ensure this is exactly the first day of your rotation (the day you return to work after your last set of off-days) for the calendar to remain accurate indefinitely.
                    </p>
                 </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Shift Planning FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Can I save my schedule?"
                  a="Currently, the calculator updates in real-time as you pick dates. You can bookmark this page or take a screenshot of the calendar to keep in your phone."
                />
                <FaqItem
                  q="Does this support 4-on/4-off rotations?"
                  a="Absolutely. Simply set 'On Duty Days' to 4 and 'Off Duty Days' to 4. The calendar will project that pattern across every month of the year."
                />
                <FaqItem
                  q="How do I account for shift swaps?"
                  a="This tool calculates the 'Standard' cycle based on your contract. For one-off swaps, we recommend noting them manually, but use this to verify where your baseline schedule falls."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Planner</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-600/10 relative overflow-hidden">
                   <Calendar className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 rotate-12" />
                   <h4 className="font-black text-sm mb-2">Team Feature</h4>
                   <p className="text-[11px] leading-relaxed opacity-90 pr-4">
                     Planning a group trip? Share the calculator with your coworkers to see whose 'Off Days' overlap for a shared vacation.
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
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
