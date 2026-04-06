import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Info, Plus, Trash2, Calendar, Calculator
} from "lucide-react";

function useShiftCalc() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMins, setBreakMins] = useState(30);

  const duration = useMemo(() => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    
    let startTotal = sh * 60 + sm;
    let endTotal = eh * 60 + em;
    
    if (endTotal < startTotal) endTotal += 1440; // Overnight
    
    const totalMinutes = Math.max(0, endTotal - startTotal - breakMins);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const decimal = Math.round((totalMinutes / 60) * 100) / 100;

    return { hours, mins, decimal, totalMinutes };
  }, [startTime, endTime, breakMins]);

  return { startTime, setStartTime, endTime, setEndTime, breakMins, setBreakMins, duration };
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
  { title: "Hourly Pay", slug: "hourly-time-calculator", icon: <BadgeCheck className="w-5 h-5" />, color: 25, benefit: "Wage calculation" },
  { title: "Overtime Calc", slug: "overtime-calculator", icon: <Clock className="w-5 h-5" />, color: 140, benefit: "Premium tracking" },
  { title: "Working Days", slug: "working-days-calculator", icon: <Calendar className="w-5 h-5" />, color: 210, benefit: "Business gap count" },
];

export default function ShiftHoursCalculator() {
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
        title="Shift Hours Calculator – Calculate Your Work Day Duration"
        description="Quickly calculate the total hours and minutes of your work shift. Supports overnight shifts and unpaid breaks. Professional decimal hour conversion."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Shift Hours Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Clock className="w-3.5 h-3.5" />
            Time Management
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Shift Hours Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Entering times shouldn't be a chore. Calculate your shift duration in seconds, handle overnight work automatically, and see your time in both standard and decimal formats.
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
                <div className="p-6 md:p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Start Time</label>
                        <input 
                          type="time" 
                          className="tool-calc-input w-full font-bold text-lg" 
                          value={calc.startTime} 
                          onChange={e => calc.setStartTime(e.target.value)} 
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">End Time</label>
                        <input 
                          type="time" 
                          className="tool-calc-input w-full font-bold text-lg" 
                          value={calc.endTime} 
                          onChange={e => calc.setEndTime(e.target.value)} 
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Unpaid Break (mins)</label>
                        <input 
                          type="number" 
                          className="tool-calc-input w-full font-bold text-lg" 
                          value={calc.breakMins} 
                          onChange={e => calc.setBreakMins(parseInt(e.target.value) || 0)} 
                        />
                     </div>
                  </div>

                  <div className="mt-10 p-8 rounded-3xl bg-orange-500/5 border border-orange-600/10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
                        <div>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-2 block">Standard Format</span>
                           <h2 className="text-4xl md:text-6xl font-black text-foreground tabular-nums">
                              {calc.duration.hours}h {calc.duration.mins}m
                           </h2>
                           <p className="text-sm text-muted-foreground font-bold mt-2 italic leading-relaxed">
                              Total work duration after break deduction.
                           </p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase mb-1">Decimal Hours</p>
                              <p className="text-3xl font-black text-orange-600">{calc.duration.decimal} <span className="text-sm font-bold text-muted-foreground">hrs</span></p>
                           </div>
                           <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center">
                              <Info className="w-6 h-6" />
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Efficiency in Shift Planning</h2>
               <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                 Manually calculating shift hours 5 or 6 times a week is prone to human error, especially when shifts cross past midnight.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                     <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-emerald-500" /> Overnight Support
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Our engine automatically detects if you start at 10 PM and finish at 6 AM, adding the necessary 24-hour offset to ensure your total remains at 8 hours.
                     </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border">
                     <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-orange-500" /> Payroll Alignment
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Most professional timesheet software uses decimal hours for billing and payroll. Providing your manager with '7.75 hours' instead of '7 hours and 45 minutes' speeds up your payment cycle.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Shift FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Why use decimal hours?"
                  a="Decimal hours make multiplication for wage calculations much simpler. Multiplying $20/hr by 7.5 is easy, whereas multiplying $20/hr by 7h 30m requires an extra step of conversion."
                />
                <FaqItem
                  q="Does this tool save my data?"
                  a="No, we value your privacy. Your shift times are calculated locally in your browser and are not sent to any server. If you refresh, the tool resets to default."
                />
                <FaqItem
                  q="Can I add multiple shifts?"
                  a="This tool is for a single shift calculation. For weekly sheets, check out our 'Hourly Time Calculator' which supports multiple entries in a row."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Copy Results</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-orange-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
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
