import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, CalendarClock, Timer, CalendarDays
} from "lucide-react";

// ── Calculator Logic ──
function useCalc() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  
  const result = useMemo(() => {
    if (!startTime || !endTime) return null;
    
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return null;

    let totalStartMins = startH * 60 + startM;
    let totalEndMins = endH * 60 + endM;
    
    let isNextDay = false;
    if (totalEndMins < totalStartMins) {
      totalEndMins += 24 * 60;
      isNextDay = true;
    }
    
    const diff = totalEndMins - totalStartMins;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const decimalHours = +(diff / 60).toFixed(2);
    
    return {
      hours,
      mins,
      decimalHours,
      totalMins: diff,
      isNextDay
    };
  }, [startTime, endTime]);
  
  return { startTime, setStartTime, endTime, setEndTime, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  let message = `The total duration is exactly ${result.hours} hours and ${result.mins} minutes.`;
  
  if (result.isNextDay) {
    message += " Note that the end time crosses midnight into the next day.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
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
  { title: "Age Calculator", slug: "age-calculator", icon: <CalendarDays className="w-5 h-5" />, color: 25, benefit: "Calculate exact age in years, months" },
  { title: "Countdown Timer", slug: "countdown-timer", icon: <Timer className="w-5 h-5" />, color: 340, benefit: "Count down to any event" },
  { title: "Work Hours Calculator", slug: "work-hours-calculator", icon: <Clock className="w-5 h-5" />, color: 217, benefit: "Calculate total work hours" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <CalendarClock className="w-5 h-5" />, color: 265, benefit: "Days between two dates" },
];

export default function TimeDurationCalculator() {
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
        title="Time Duration Calculator – Calculate Hours & Minutes Between Times"
        description="Calculate the time duration between two times. Find exactly how many hours and minutes have passed. Free online time duration calculator with decimal hours."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Time Duration Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Clock className="w-3.5 h-3.5" />
            Time &amp; Date
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Time Duration Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Instantly calculate the exact time duration between two different times. Automatically handles overnight calculations and outputs decimal hours.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
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
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Duration Calculator</p>
                      <p className="text-sm text-muted-foreground">Enter a start time and an end time.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Start Time</label>
                        <input
                          type="time"
                          className="tool-calc-input text-lg py-3 w-full sm:w-40"
                          value={calc.startTime}
                          onChange={e => calc.setStartTime(e.target.value)}
                        />
                      </div>
                      <span className="text-xl font-black text-muted-foreground hidden sm:block mt-6">→</span>
                      
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">End Time</label>
                        <input
                          type="time"
                          className="tool-calc-input text-lg py-3 w-full sm:w-40"
                          value={calc.endTime}
                          onChange={e => calc.setEndTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {calc.result && (
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Duration</span>
                          <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                            {calc.result.hours}h {calc.result.mins}m
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Decimal Hours</span>
                          <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                            {calc.result.decimalHours}
                          </span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Total Minutes</span>
                          <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                            {calc.result.totalMins}
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Time Duration Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Figuring out exactly how much time has elapsed between two points in the day can be tricky, especially when calculating payroll, logging study hours, or dealing with midnight crossovers. Our tool simplifies this process.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select the Start Time</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the start time picker to input when the duration begins. This can be your clock-in time for work, the start of an exam, or the beginning of a flight.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select the End Time</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Pick the time the event ended. If the end time is numerically earlier than the start time (e.g., Start: 11 PM, End: 2 AM), the calculator automatically assumes it crossed midnight into the next day.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">View Your Multiple Outputs</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      You will instantly get three separate formats: standard Hours & Minutes, Decimal Hours (great for billing and payroll timesheets), and the Total Minutes elapsed.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* ── 4. RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Decimal Hours vs Standard Time</h2>
              <p className="text-muted-foreground text-sm mb-6">Learn the difference between standard hours and decimal formatting:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard Output (Hours & Minutes)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This measures time using a base-60 system. For example, 1 hour and 30 minutes. It's normally used for estimating travel time, meeting length, or personal schedules.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Decimal Hours</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This measures time in a base-10 system, dividing the hour into 100 parts instead of 60. Specifically used for accounting and payroll multiplying an hourly wage. For example, 1 hour and 30 minutes is represented as 1.50 Hours.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common Time Duration Conversions</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Minutes Passed</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Standard Output</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Decimal Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">15 mins</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">0h 15m</td>
                      <td className="px-4 py-3 text-muted-foreground">0.25</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">30 mins</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">0h 30m</td>
                      <td className="px-4 py-3 text-muted-foreground">0.50</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">45 mins</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">0h 45m</td>
                      <td className="px-4 py-3 text-muted-foreground">0.75</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">90 mins</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1h 30m</td>
                      <td className="px-4 py-3 text-muted-foreground">1.50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Midnight Transitions Included.</strong> Many time calculators break when an event starts late at night and ends Early the following morning. Our calculator elegantly detects when an end time passes midnight without requiring you to explicitly enter dates.
                </p>
                <p>
                  <strong className="text-foreground">Decimal Payouts.</strong> Get your exact billing units correct instead of trying to multiply 60-based minutes into a 10-based wage formula by hand.
                </p>
                <p>
                  <strong className="text-foreground">Complete Privacy.</strong> The entire operation occurs strictly within your browser. You can confidently compute your payroll hours securely.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How is the decimal hour calculated?"
                  a="The decimal hour format is calculated by taking your total minutes, dividing by 60, and rounding to 2 decimal places. E.g., 45 minutes / 60 = 0.75 hours."
                />
                <FaqItem
                  q="What happens if the end time is before the start time?"
                  a="The software automatically interprets it as spanning overnight. For instance, if you insert 10:00 PM as the start and 02:00 AM as the end, it correctly gives you 4 hours."
                />
                <FaqItem
                  q="Does it handle time zones and daylight savings?"
                  a="This particular calculator computes fixed durations independent of time zones entirely. For differing country time zones, try using our dedicated Time Zone Converter tool."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Better Manage Your Schedule</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including date differences, leap year checkers, shift schedulers, and more — completely free.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
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
                <p className="text-xs text-muted-foreground mb-3">Help others manage their schedules.</p>
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
