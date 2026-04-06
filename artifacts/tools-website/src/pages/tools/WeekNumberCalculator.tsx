import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Calendar, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, CalendarDays, Hash, Clock
} from "lucide-react";

// ── Calculator Logic ──
// Returns the ISO week number of a given date
function getISOWeek(d: Date) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the number of weeks in a given year
function getWeeksInYear(year: number) {
  const d = new Date(year, 11, 31);
  const week = getISOWeek(d);
  return week === 1 ? getISOWeek(new Date(year, 11, 24)) : week;
}

function useCalc() {
  const [inputDate, setInputDate] = useState("");
  
  useEffect(() => {
    // Set to today's date formatted to YYYY-MM-DD
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setInputDate(`${today.getFullYear()}-${mm}-${dd}`);
  }, []);
  
  const result = useMemo(() => {
    if (!inputDate) return null;
    
    // Parse input date safely
    const [yearStr, monthStr, dayStr] = inputDate.split('-');
    const dateObj = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
    
    if (isNaN(dateObj.getTime())) return null;

    const weekNum = getISOWeek(dateObj);
    const year = dateObj.getFullYear();
    const totalWeeksInYear = getWeeksInYear(year);
    const dayOfWeek = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    
    // ISO weeks start on Monday
    // Calculate start and end date of the week
    const dayIndex = (dateObj.getDay() || 7) - 1; // 0 for Monday, 6 for Sunday
    const weekStart = new Date(dateObj);
    weekStart.setDate(dateObj.getDate() - dayIndex);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return {
      weekNum,
      year,
      totalWeeksInYear,
      dayOfWeek,
      formattedDate,
      weekStartStr: weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weekEndStr: weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      percentage: ((weekNum / totalWeeksInYear) * 100).toFixed(1)
    };
  }, [inputDate]);
  
  return { inputDate, setInputDate, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  const message = `${result.formattedDate} is a ${result.dayOfWeek} falling in Week ${result.weekNum} of ${result.year}. This means you are ${result.percentage}% through the weeks of the year!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Business Days", slug: "business-days-calculator", icon: <CalendarDays className="w-5 h-5" />, color: 25, benefit: "Count working days in a date range" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <Clock className="w-5 h-5" />, color: 265, benefit: "Calculate exact days between dates" },
  { title: "Leap Year Checker", slug: "leap-year-checker", icon: <Calendar className="w-5 h-5" />, color: 340, benefit: "Check if a year has 366 days" },
];

export default function WeekNumberCalculator() {
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
        title="Week Number Calculator – Find Which Week It Is Instantly"
        description="Find exactly what week number any date falls on. Easily track ISO-8601 week numbers for project management, payroll, and academic schedules."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Week Number Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Hash className="w-3.5 h-3.5" />
            Productivity &amp; Time
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Week Number Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Determine the exact week number of the year for any date. Automatically calculates standard ISO week formats widely used in European businesses and global project management.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> ISO-8601 Standard
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Time &amp; Date &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 2. TOOL WIDGET ── */}
            <section className="space-y-5" id="calculator">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Week Finder</p>
                      <p className="text-sm text-muted-foreground">Select any date to begin.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="flex justify-center mb-6">
                      <div className="flex flex-col w-full sm:w-64">
                        <label className="text-xs font-bold text-foreground mb-2 tracking-wide text-center uppercase">Target Date</label>
                        <input
                          type="date"
                          className="tool-calc-input text-lg py-4 w-full text-center"
                          value={calc.inputDate}
                          onChange={e => calc.setInputDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {calc.result && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 flex flex-col items-center justify-center p-6 rounded-2xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center relative overflow-hidden">
                          <Hash className="w-64 h-64 absolute top-1 -right-8 text-orange-500/5 pointer-events-none" />
                          <span className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest relative z-10">ISO Week Number</span>
                          <span className="text-5xl font-black text-orange-600 dark:text-orange-400 relative z-10">
                            Week {calc.result.weekNum}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/40 border border-border text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Date Range</span>
                          <span className="text-lg font-black text-foreground tracking-tight">
                            {calc.result.weekStartStr} <p className="text-muted-foreground text-sm font-semibold my-1">through</p> {calc.result.weekEndStr}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Week Number Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Many businesses, manufacturing companies, and European educational systems rely on "week numbers" (extending from Week 1 to Week 52 or 53) rather than tracking exact dates. This tool automates the process of finding out exactly what week of the year an arbitrary date belongs to.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Pick Your Target Date</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Simply select the exact month, day, and year using the date picker provided. The tool will automatically update the interface if the date is valid.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Inspect the Week Number</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Your answer will be generated instantly as a standard ISO week number (such as "Week 34"). 
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">See the Boundary Dates</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      For context, the calculator also shows you the exact calendar bounds of the determined week — starting on Monday and concluding on Sunday — giving you complete peace of mind.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Understanding the ISO-8601 Week Date System</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our calculator adheres to the ISO-8601 international time standard. Under this standard, weeks begin strictly on **Monday**. Furthermore, "Week 1" of any given calendar year is precisely defined as the week containing the first Thursday of the year — meaning that January 1st might technically belong to the 52nd or 53rd week of the *previous* year if it lands on a Friday, Saturday, or Sunday!
                </p>
              </div>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read the week number output.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Week Number</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is the ISO-8601 week index for your selected date, where weeks start on Monday.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Date Range</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Use the start and end dates shown to align reporting, sprints, and planning cycles.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common Calendar Year Progressions</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Time of Year</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Average Week #</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Percentage Through Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">End of January</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Week 04</td>
                      <td className="px-4 py-3 text-muted-foreground">~8%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">End of March (Q1 End)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Week 13</td>
                      <td className="px-4 py-3 text-muted-foreground">~25%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">End of June (Q2 End)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Week 26</td>
                      <td className="px-4 py-3 text-muted-foreground">~50%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">End of September (Q3 End)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Week 39</td>
                      <td className="px-4 py-3 text-muted-foreground">~75%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">End of December (Q4 End)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Week 52</td>
                      <td className="px-4 py-3 text-muted-foreground">~100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Tool?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">ISO-accurate output.</strong> The calculation follows the international ISO week standard used in many businesses.
                </p>
                <p>
                  <strong className="text-foreground">Extra context included.</strong> You get week boundaries so it is easy to schedule tasks and reporting windows.
                </p>
                <p>
                  <strong className="text-foreground">No setup needed.</strong> Open the page, pick a date, and get the result instantly.
                </p>
              </div>
            </section>
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How many weeks are in a year?"
                  a="Most standard calendar years have 52 weeks. However, because 52 weeks multiplied by 7 days equals exactly 364 days, a calendar year typically falls short by 1 day (or 2 days in a leap year). Because of this cascading remainder, years that start or end on specific weekdays will inherit a 'Week 53' according to the ISO standard."
                />
                <FaqItem
                  q="Does a week start on Sunday or Monday?"
                  a="In countries like the United States and Canada, calendars commonly begin on Sunday. However, this calculator outputs 'ISO week numbers', and under international standards (ISO-8601), weeks officially start on Monday."
                />
                <FaqItem
                  q="Can January 1st be in Week 52?"
                  a="Yes! If January 1st lands on a Friday, Saturday, or Sunday, that single day technically belongs to the prior year's final week string under the ISO system, yielding 'Week 52' or 'Week 53' of the previous year."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Optimize Your Office Productivity</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Use our Business Days Calculator to find exact deadline durations excluding busy weekend days. Completely free and runs in your browser.
                </p>
                <Link
                  href="/time-date/business-days-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Go to Business Days Calculator <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/time-date/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others find what week it is.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
                      {label}
                    </a>
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
