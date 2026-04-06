import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Calendar, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Info
} from "lucide-react";

function useCalc() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeEndDate, setIncludeEndDate] = useState(false);

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffMs = Math.abs(end.getTime() - start.getTime());
    let totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (includeEndDate) {
      totalDays += 1;
    }

    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const hours = totalDays * 24;

    return {
      totalDays,
      weeks,
      remainingDays,
      hours,
      isValid: true
    };
  }, [startDate, endDate, includeEndDate]);

  return {
    startDate, setStartDate,
    endDate, setEndDate,
    includeEndDate, setIncludeEndDate,
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
          The difference is exactly {result.totalDays.toLocaleString()} days. That's approx {result.weeks} weeks and {result.remainingDays} days.
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
  { title: "Working Days", slug: "working-days-calculator", icon: <BadgeCheck className="w-5 h-5" />, color: 25, benefit: "Filter out the weekends" },
  { title: "Age in Days", slug: "age-in-days-calculator", icon: <Clock className="w-5 h-5" />, color: 140, benefit: "How many days old are you?" },
  { title: "Leap Year", slug: "leap-year-checker", icon: <Calendar className="w-5 h-5" />, color: 210, benefit: "Validate year boundaries" },
];

export default function DaysBetweenDatesCalculator() {
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
        title="Days Between Dates Calculator – Count Days Exactly"
        description="Calculate the total number of days between two dates instantly. Simple, accurate day counter for planning and tracking time spans."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Days Between Dates</span>
        </nav>

        {/* Hero Section */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calendar className="w-3.5 h-3.5" />
            Simple Chronometry
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Days Between Dates Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Need a quick day count? Our streamlined calculator gives you the exact total of calendar days between any two points in time with optional inclusive tracking.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Fast
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> One-Click
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Shield className="w-3.5 h-3.5" /> Secure
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none z-10 pt-8">
                       <div className="h-full w-px bg-border" />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider block">First Date</label>
                      <input
                        type="date"
                        className="tool-calc-input w-full text-lg font-bold"
                        value={calc.startDate}
                        onChange={e => calc.setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Second Date</label>
                      <input
                        type="date"
                        className="tool-calc-input w-full text-lg font-bold"
                        value={calc.endDate}
                        onChange={e => calc.setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center pt-4">
                      <label className="flex items-center gap-2 cursor-pointer group bg-muted/50 px-4 py-2 rounded-full border border-border hover:border-orange-500/30 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={calc.includeEndDate} 
                          onChange={e => calc.setIncludeEndDate(e.target.checked)} 
                          className="rounded border-border text-orange-500 focus:ring-orange-500 w-4 h-4" 
                        />
                        <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Include end date? (Add 1 day)</span>
                        <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
                      </label>
                  </div>

                  {calc.result && (
                    <div className="text-center pt-8 border-t border-border mt-8">
                       <div className="inline-block p-10 rounded-full bg-orange-600/10 border-2 border-orange-600/20 shadow-inner mb-6">
                            <span className="text-6xl md:text-8xl font-black text-orange-600 block leading-tight">
                              {calc.result.totalDays.toLocaleString()}
                            </span>
                            <span className="text-sm font-black text-orange-600/60 uppercase tracking-widest -mt-2 block">Total Days</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                          <div className="p-4 rounded-xl bg-card border border-border flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Weeks</span>
                            <span className="text-lg font-black text-foreground">{calc.result.weeks}w {calc.result.remainingDays}d</span>
                          </div>
                          <div className="p-4 rounded-xl bg-card border border-border flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Raw Hours</span>
                            <span className="text-lg font-black text-foreground">{calc.result.hours.toLocaleString()}h</span>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Mastering Day Counts</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Calculating the gap between dates is a fundamental task for everything from booking hotels to tracking project goals. Our tool simplifies this by providing a singular, massive focus on the final integer while offering the necessary context of weeks and hours.
                </p>
                <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/10">
                   <h3 className="font-bold mb-3 flex items-center gap-2">
                     <Info className="w-4 h-4 text-orange-500" /> Inclusive vs. Exclusive Counting
                   </h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Standard mathematical difference is 'Exclusive' (e.g., Tuesday minus Monday = 1). However, in many contexts like rentals or work shifts, you might want 'Inclusive' counting (Monday through Tuesday = 2 days). Use the "Include end date" toggle to switch instantly.
                   </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Counting FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How are leap years handled?"
                  a="Our calculator uses the native JavaScript Date API, which handles the extra day in February during leap years automatically based on the years you select."
                />
                <FaqItem
                  q="What is the maximum date range?"
                  a="You can calculate differences spanning thousands of years. The tool remains accurate as long as the dates fit within the standard Gregorian calendar system."
                />
                <FaqItem
                  q="Why does the hour count seem high?"
                  a="The hour count is a raw multiplication (Total Days * 24). It's a fun way to see the massive scale of time passing across months and years!"
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
                <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">Help friends track their own time milestones.</p>
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
