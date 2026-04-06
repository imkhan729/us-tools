import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, DollarSign, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Plus, Trash2, Info, Calculator
} from "lucide-react";

interface Entry {
  id: string;
  day: string;
  start: string;
  end: string;
  break: number; // minutes
}

function useHourlyCalc() {
  const [rate, setRate] = useState(20);
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', day: 'Monday', start: '09:00', end: '17:00', break: 30 }
  ]);

  const addEntry = () => {
    const lastDay = entries[entries.length - 1]?.day || 'Monday';
    setEntries([...entries, { id: Math.random().toString(), day: lastDay, start: '09:00', end: '17:00', break: 30 }]);
  };

  const updateEntry = (id: string, field: keyof Entry, value: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const results = useMemo(() => {
    let totalMinutes = 0;
    const computedEntries = entries.map(e => {
      const [sh, sm] = e.start.split(':').map(Number);
      const [eh, em] = e.end.split(':').map(Number);
      
      let startMin = sh * 60 + sm;
      let endMin = eh * 60 + em;
      
      if (endMin < startMin) endMin += 1440; // overnight support
      
      const diff = Math.max(0, endMin - startMin - e.break);
      totalMinutes += diff;
      
      return { 
        ...e, 
        decimalHours: Math.round((diff / 60) * 100) / 100,
        pay: Math.round((diff / 60) * rate * 100) / 100
      };
    });

    const totalHours = totalMinutes / 60;
    const totalPay = totalHours * rate;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalPay: Math.round(totalPay * 100) / 100,
      entries: computedEntries
    };
  }, [entries, rate]);

  return { rate, setRate, entries, addEntry, updateEntry, removeEntry, results };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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
  { title: "Overtime Calc", slug: "overtime-calculator", icon: <Clock className="w-5 h-5" />, color: 25, benefit: "Premium rate tracking" },
  { title: "Shift Hours", slug: "shift-hours-calculator", icon: <Zap className="w-5 h-5" />, color: 140, benefit: "Simple duration counts" },
  { title: "Salary Calc", slug: "online-salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 210, benefit: "Yearly projections" },
];

export default function HourlyTimeCalculator() {
  const calc = useHourlyCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Hourly Time Calculator – Calculate Wage & Work Hours"
        description="Track your worked hours and total pay instantly. Add multiple days, deduct breaks, and see your gross earnings with our professional hourly wage calculator."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Hourly Time Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" />
            Wage Management
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Hourly Time Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Streamline your paycheck verification. Log your shifts, subtract breaks, and calculate your total earnings with decimal hour precision.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Payroll Ready
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Calculator className="w-3.5 h-3.5" /> Multi-Day
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-blue-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div className="p-6 md:p-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 mb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-blue-500/10">
                           $
                        </div>
                        <div>
                           <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Hourly Rate</p>
                           <input 
                             type="number" 
                             className="bg-transparent border-none outline-none font-black text-3xl text-foreground w-32" 
                             value={calc.rate} 
                             onChange={e => calc.setRate(parseFloat(e.target.value) || 0)} 
                           />
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Total Earnings</p>
                        <p className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                           ${calc.results.totalPay.toLocaleString()}
                        </p>
                        <p className="text-sm font-bold text-muted-foreground">{calc.results.totalHours} Total Hours</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-4 px-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden md:grid">
                       <div className="col-span-1">Day / Label</div>
                       <div className="col-span-1 text-center">Start Time</div>
                       <div className="col-span-1 text-center">End Time</div>
                       <div className="col-span-1 text-center">Break (m)</div>
                       <div className="col-span-1 text-center">Hours</div>
                       <div className="col-span-1 text-right">Pay</div>
                    </div>

                    <div className="space-y-2">
                       {calc.results.entries.map((e: any) => (
                         <div key={e.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 rounded-xl bg-muted/30 border border-border group hover:border-blue-500/30 transition-colors">
                            <input 
                              type="text" 
                              className="bg-transparent border-none outline-none font-bold text-sm w-full"
                              value={e.day}
                              onChange={val => calc.updateEntry(e.id, 'day', val.target.value)}
                            />
                            <input 
                              type="time" 
                              className="tool-calc-input text-center font-bold py-1.5"
                              value={e.start}
                              onChange={val => calc.updateEntry(e.id, 'start', val.target.value)}
                            />
                            <input 
                              type="time" 
                              className="tool-calc-input text-center font-bold py-1.5"
                              value={e.end}
                              onChange={val => calc.updateEntry(e.id, 'end', val.target.value)}
                            />
                            <input 
                              type="number" 
                              className="tool-calc-input text-center font-bold py-1.5"
                              value={e.break}
                              onChange={val => calc.updateEntry(e.id, 'break', parseInt(val.target.value) || 0)}
                            />
                            <div className="text-center font-black text-blue-600 dark:text-blue-400">{e.decimalHours}h</div>
                            <div className="flex items-center justify-end gap-3">
                               <div className="font-black text-foreground">${e.pay.toLocaleString()}</div>
                               <button onClick={() => calc.removeEntry(e.id)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>

                    <button 
                      onClick={calc.addEntry}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-card border-2 border-dashed border-border text-muted-foreground hover:border-blue-500/50 hover:text-blue-500 transition-all font-bold text-sm"
                    >
                       <Plus className="w-4 h-4" /> Add Another Day
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Navigating Hourly Wages</h2>
               <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                 Whether you're a freelancer, a part-time worker, or checking your overtime, understanding the math behind your decimal hours is key to financial health.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <h3 className="font-bold text-foreground flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-emerald-500" /> Decimal vs Clock Time
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Payroll systems use decimal hours (e.g., 7.5 hours instead of 7h 30m). Our calculator handles this conversion automatically to match what you see on your pay stub.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" /> The Importance of Breaks
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Unpaid breaks can significantly affect your take-home pay. Consistently logging your 30 or 60-minute breaks ensures you have an accurate record if discrepancies ever arise.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Hourly Pay FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How are decimal hours calculated?"
                  a="We take the total minutes worked and divide by 60. For example, 45 minutes becomes 0.75 hours. This is the industry standard for wage calculation."
                />
                <FaqItem
                  q="Does this tool include taxes?"
                  a="No. This calculator is for 'Gross Pay' (earnings before any deductions). Tax rates vary by location and personal circumstances, so we recommend using this to verify your base earnings."
                />
                <FaqItem
                  q="Can I use this for night shifts?"
                  a="Yes. Our engine understands if an end time is 'earlier' than a start time, it assumes the shift crosses midnight into the next day."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Save Sheet</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-blue-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-xl relative overflow-hidden">
                   <Info className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                   <h4 className="font-black text-sm mb-2">Overtime?</h4>
                   <p className="text-[11px] leading-relaxed opacity-90 pr-4">
                     Check out our dedicated Overtime Calculator to handle time-and-a-half or double-time rates more effectively.
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
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
