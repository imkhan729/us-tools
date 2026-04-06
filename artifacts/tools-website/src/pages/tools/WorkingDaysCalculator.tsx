import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Briefcase, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Calendar, ClipboardCheck
} from "lucide-react";

function useCalc() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeSaturdays, setIncludeSaturdays] = useState(false);
  const [includeSundays, setIncludeSundays] = useState(false);
  const [holidaysCount, setHolidaysCount] = useState(0);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const earlier = start <= end ? start : end;
    const later = start <= end ? end : start;

    let workingDays = 0;
    const current = new Date(earlier);
    
    while (current <= later) {
      const day = current.getDay();
      const isWeekend = (day === 0 && !includeSundays) || (day === 6 && !includeSaturdays);
      if (!isWeekend) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const totalDays = Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const netWorkingDays = Math.max(0, workingDays - holidaysCount);

    return {
      totalDays,
      workingDays: netWorkingDays,
      weekendDays: totalDays - workingDays,
      holidays: holidaysCount,
      isRangeValid: true
    };
  }, [startDate, endDate, includeSaturdays, includeSundays, holidaysCount]);

  return {
    startDate, setStartDate,
    endDate, setEndDate,
    includeSaturdays, setIncludeSaturdays,
    includeSundays, setIncludeSundays,
    holidaysCount, setHolidaysCount,
    result
  };
}

function ResultInsight({ result }: { result: any }) {
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">
          Out of {result.totalDays} total days, you have {result.workingDays} effective business days after excluding weekends and {result.holidays} holidays.
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
  { title: "Work Hours", slug: "work-hours-calculator", icon: <Briefcase className="w-5 h-5" />, color: 25, benefit: "Sum up your weekly effort" },
  { title: "Deadline Calc", slug: "deadline-calculator", icon: <Calendar className="w-5 h-5" />, color: 140, benefit: "Project timeline planning" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <ClipboardCheck className="w-5 h-5" />, color: 210, benefit: "General gap measurement" },
];

export default function WorkingDaysCalculator() {
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
        title="Working Days Calculator – Count Business Days Between Dates"
        description="Calculate the exact number of working days between any two dates. Exclude weekends and custom holidays for project planning and payroll."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Working Days Calculator</span>
        </nav>

        {/* Hero Section */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Briefcase className="w-3.5 h-3.5" />
            Project Productivity
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Working Days Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Streamline your project planning by accurately counting business days. Filter out weekends and deduct public holidays to find your net available work time.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Accurate
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Project Ready
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> Private
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-foreground uppercase mb-2 block">Start Date</label>
                      <input
                        type="date"
                        className="tool-calc-input w-full"
                        value={calc.startDate}
                        onChange={e => calc.setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground uppercase mb-2 block">End Date</label>
                      <input
                        type="date"
                        className="tool-calc-input w-full"
                        value={calc.endDate}
                        onChange={e => calc.setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-muted/30 rounded-2xl border border-border">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Weekend Options</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={calc.includeSaturdays} onChange={e => calc.setIncludeSaturdays(e.target.checked)} className="rounded border-border text-orange-500 focus:ring-orange-500" />
                          <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Work on Saturdays?</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={calc.includeSundays} onChange={e => calc.setIncludeSundays(e.target.checked)} className="rounded border-border text-orange-500 focus:ring-orange-500" />
                          <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Work on Sundays?</span>
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-3">Custom Holidays</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          className="tool-calc-input w-24 text-center"
                          value={calc.holidaysCount}
                          onChange={e => calc.setHolidaysCount(parseInt(e.target.value) || 0)}
                        />
                        <span className="text-sm text-muted-foreground font-medium">Add number of public holidays to deduct</span>
                      </div>
                    </div>
                  </div>

                  {calc.result && (
                    <div className="pt-6 border-t border-border">
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="col-span-2 md:col-span-2 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1 block">Net Working Days</span>
                            <span className="text-4xl font-black text-orange-600 dark:text-orange-400">{calc.result.workingDays}</span>
                          </div>
                          <div className="p-5 rounded-2xl border border-border text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Total Days</span>
                            <span className="text-xl font-black text-foreground">{calc.result.totalDays}</span>
                          </div>
                          <div className="p-5 rounded-2xl border border-border text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Weekends</span>
                            <span className="text-xl font-black text-foreground">{calc.result.weekendDays}</span>
                          </div>
                       </div>
                    </div>
                  )}
                  <ResultInsight result={calc.result} />
                </div>
              </div>
            </section>

            {/* How to Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Planning Your Business Timeline</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Most standard business contracts and project management tools operate on a "Working Days" basis, which typically excludes Saturdays and Sundays. Our calculator allows you to customize this logic to fit specific regional work weeks (such as 6-day work weeks) and deduct specific public holidays.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                       <span className="font-bold text-foreground">Select Range:</span> Define the start and end of your project sprint or payroll cycle.
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                       <span className="font-bold text-foreground">Define Work Week:</span> Toggle Saturday/Sunday inclusion if you are timing a non-standard shift rotation.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Working Days FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Why are holidays not included automatically?"
                  a="Public holidays vary significantly between countries, states, and even specific companies. By allowing you to enter a custom holiday count, we ensure the result is accurate for your specific location."
                />
                <FaqItem
                  q="Is the end date included in the count?"
                  a="Yes! This calculator uses 'Inclusive Tracking' by default, meaning if you select Monday to Tuesday, it counts as 2 working days."
                />
                <FaqItem
                  q="How does this help with payroll?"
                  a="HR departments use this tool to determine the expected number of payable days in a given month, helping to audit salary calculations or hourly wage projections."
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/time-date/${tool.slug}`} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-8 h-8 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-orange-500 transition-colors uppercase tracking-tight">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate font-medium">{tool.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Tool</h3>
                <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">Help your team plan their sprints better.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-md shadow-orange-500/10"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
