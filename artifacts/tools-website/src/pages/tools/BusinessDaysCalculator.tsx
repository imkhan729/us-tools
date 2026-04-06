import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, CalendarDays, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, Clock, Timer, Calendar,
  ArrowRight, TrendingUp, Star,
} from "lucide-react";

// ── Business Days Logic ──
const US_HOLIDAYS_2025_2026 = [
  "2025-01-01", "2025-01-20", "2025-02-17", "2025-05-26",
  "2025-06-19", "2025-07-04", "2025-09-01", "2025-10-13",
  "2025-11-11", "2025-11-27", "2025-12-25",
  "2026-01-01", "2026-01-19", "2026-02-16", "2026-05-25",
  "2026-06-19", "2026-07-04", "2026-09-07", "2026-10-12",
  "2026-11-11", "2026-11-26", "2026-12-25",
];

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: string[]): boolean {
  const str = date.toISOString().split("T")[0];
  return holidays.includes(str);
}

function countBusinessDays(start: Date, end: Date, skipHolidays: boolean, holidays: string[]): number {
  let count = 0;
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);
  while (current <= endDate) {
    if (!isWeekend(current) && (!skipHolidays || !isHoliday(current, holidays))) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function addBusinessDays(start: Date, days: number, skipHolidays: boolean, holidays: string[]): Date {
  const result = new Date(start);
  result.setHours(0, 0, 0, 0);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result) && (!skipHolidays || !isHoliday(result, holidays))) added++;
  }
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

type CalcMode = "between" | "add";

// ── FAQ Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Age Calculator",          slug: "age-calculator",           icon: <Clock className="w-5 h-5" />,       color: 152, benefit: "Calculate exact age from birthdate" },
  { title: "Countdown Timer",         slug: "countdown-timer",          icon: <Timer className="w-5 h-5" />,       color: 265, benefit: "Count down to any event or deadline" },
  { title: "Work Hours Calculator",   slug: "work-hours-calculator",    icon: <CalendarDays className="w-5 h-5" />, color: 200, benefit: "Track and sum up work hours" },
  { title: "Date Difference Calculator", slug: "date-difference-calculator", icon: <Calendar className="w-5 h-5" />, color: 25, benefit: "Days between any two dates" },
];

// ── Main Component ──
export default function BusinessDaysCalculator() {
  const [mode, setMode] = useState<CalcMode>("between");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [daysToAdd, setDaysToAdd] = useState("10");
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const start = new Date(startDate + "T12:00:00");
    if (isNaN(start.getTime())) return null;

    if (mode === "between") {
      const end = new Date(endDate + "T12:00:00");
      if (isNaN(end.getTime()) || end < start) return null;
      const business = countBusinessDays(start, end, skipHolidays, US_HOLIDAYS_2025_2026);
      const total = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const holidays = skipHolidays ? US_HOLIDAYS_2025_2026.filter(h => {
        const d = new Date(h + "T12:00:00");
        return d >= start && d <= end && !isWeekend(d);
      }).length : 0;
      const weeks = Math.floor(business / 5);
      const remDays = business % 5;
      return { type: "between" as const, business, total, weeks, remDays, holidays };
    } else {
      const days = parseInt(daysToAdd);
      if (isNaN(days) || days < 0) return null;
      const end = addBusinessDays(start, days, skipHolidays, US_HOLIDAYS_2025_2026);
      return { type: "add" as const, end: formatDate(end), endDate: end.toISOString().split("T")[0], days };
    }
  }, [mode, startDate, endDate, daysToAdd, skipHolidays]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Business Days Calculator – Count Working Days Between Dates, Free | US Online Tools"
        description="Free business days calculator. Count working days between two dates, excluding weekends and US federal holidays. Or add business days to any start date. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time &amp; Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Business Days Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <CalendarDays className="w-3.5 h-3.5" /> Time &amp; Date
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Business Days Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Count working days between two dates, or find the exact date after adding a set number of business days. Excludes weekends and US federal holidays automatically.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
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
            Category: Time &amp; Date &nbsp;·&nbsp; US federal holidays included (2025–2026) &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">2 Modes in 1</p>
                      <p className="text-sm text-muted-foreground">Excludes weekends and US federal holidays.</p>
                    </div>
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex gap-2">
                    <button onClick={() => setMode("between")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${mode === "between" ? "bg-blue-500 text-white border-blue-500" : "border-border text-muted-foreground hover:border-blue-500/50"}`}>
                      Days Between Dates
                    </button>
                    <button onClick={() => setMode("add")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${mode === "add" ? "bg-blue-500 text-white border-blue-500" : "border-border text-muted-foreground hover:border-blue-500/50"}`}>
                      Add Business Days
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Start Date</label>
                      <input type="date" className="tool-calc-input w-full" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    {mode === "between" ? (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">End Date</label>
                        <input type="date" className="tool-calc-input w-full" value={endDate} onChange={e => setEndDate(e.target.value)} />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Business Days to Add</label>
                        <input type="number" min="0" max="1000" placeholder="10"
                          className="tool-calc-input w-full" value={daysToAdd} onChange={e => setDaysToAdd(e.target.value)} />
                      </div>
                    )}
                  </div>

                  {/* Holiday Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setSkipHolidays(s => !s)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${skipHolidays ? "bg-blue-500" : "bg-muted"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${skipHolidays ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                    <span className="text-sm font-bold text-foreground">Exclude US federal holidays (2025–2026)</span>
                  </label>

                  {/* Result */}
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      {result.type === "between" && (
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Business Days</p>
                              <p className="text-3xl font-black text-foreground">{result.business}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/60 border border-border text-center">
                              <p className="text-xs text-muted-foreground mb-1">Calendar Days</p>
                              <p className="text-2xl font-black text-foreground">{result.total}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/60 border border-border text-center">
                              <p className="text-xs text-muted-foreground mb-1">Work Weeks</p>
                              <p className="text-2xl font-black text-foreground">{result.weeks}w {result.remDays}d</p>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <div className="flex gap-2 items-start">
                              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/80 leading-relaxed">
                                There are <strong>{result.business} working days</strong> between the two dates ({result.total} total calendar days). That's <strong>{result.weeks} full work week{result.weeks !== 1 ? "s" : ""}</strong> and {result.remDays} extra day{result.remDays !== 1 ? "s" : ""}{result.holidays > 0 ? `, with ${result.holidays} federal holiday${result.holidays !== 1 ? "s" : ""} excluded` : ""}.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {result.type === "add" && (
                        <>
                          <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Date After {result.days} Business Days</p>
                            <p className="text-3xl font-black text-foreground">{result.end}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <div className="flex gap-2 items-start">
                              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/80 leading-relaxed">
                                Adding <strong>{result.days} business days</strong> from the start date lands on <strong>{result.end}</strong>, skipping weekends{skipHolidays ? " and US federal holidays" : ""}.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Business Days</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Two modes cover the most common workplace scenarios: counting working days between dates, or finding the exact delivery or deadline date after adding business days to a start date.
              </p>

              <ol className="space-y-5 mb-8">
                {[
                  {
                    title: "Choose your calculation mode",
                    body: "'Days Between Dates' counts how many working days fall between a start and end date — ideal for calculating project timelines, contract durations, or SLA compliance windows. 'Add Business Days' takes a start date and adds a number of working days forward to find the resulting date — perfect for shipping estimates, invoice payment due dates, and delivery commitments.",
                  },
                  {
                    title: "Set your dates and inputs",
                    body: "Use the date pickers to choose start and end dates. The fields accept any date in the 2025–2026 range with full holiday coverage. For the 'Add' mode, enter the number of business days to add (e.g., 10 for a two-week turnaround). Toggle the US federal holiday exclusion based on your needs — freelancers and international users may want to turn it off to count pure weekdays only.",
                  },
                  {
                    title: "Read the results and context",
                    body: "For 'Days Between Dates', the result shows business days, total calendar days, and the equivalent in business weeks and days (e.g., '22 business days = 4 weeks and 2 days'). For 'Add Business Days', the exact result date including day of week is displayed. The plain-English summary below the result confirms the logic applied.",
                  },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-6 flex-shrink-0">→</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Business Days = Calendar Days − Weekends − Holidays</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-500 font-bold w-6 flex-shrink-0">+</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Result Date = Start + N business days (skipping weekends & holidays)</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The calculator iterates day by day from the start date, incrementing only on weekdays (Monday–Friday) that are not federal holidays. This iteration approach is more accurate than the formula-based shortcut (÷ 5 × 7) because it correctly handles partial weeks, holiday clusters, and edge cases around New Year's and Thanksgiving weekend.
                </p>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Ranges &amp; Common Contexts</h2>
              <p className="text-muted-foreground text-sm mb-6">What different business day counts mean in practice:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">1–5 business days — "Within one business week"</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Standard shipping window for domestic e-commerce. Also the typical SLA for email support tickets, bank transfers between major US banks, and procurement approvals at most mid-size companies. If you're asked to respond "within 3 business days," use the Add mode to find the exact deadline date and avoid misunderstandings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">10–15 business days — "Two to three business weeks"</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Typical government processing window for passport renewals, tax refunds, and benefit applications. Also a common invoice payment term (Net-10 or Net-15) in B2B contracts. At 10 business days, note that two or more US federal holidays falling in this window can reduce it to effectively 7–8 actual working days — always check the holiday overlap.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">20–22 business days — "One calendar month"</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A calendar month contains approximately 20–23 business days depending on weekends and holidays. The most common Net-30 payment term in invoicing corresponds to roughly 21 business days. This range is also the standard sprint duration in 4-week project cycles. December always has fewer — expect only 17–18 due to Christmas and New Year's proximity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">60+ business days — "One business quarter"</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A full business quarter contains roughly 60–65 business days. This range is standard for quarterly project milestones, fiscal reporting cycles, and probationary employment periods. Over a full 12-month year, there are typically 250–252 US business days, accounting for all 11 federal holidays. This is useful for annualizing productivity and capacity planning.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Start</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">End / Add</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Business Days</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">5 business days from Monday</td>
                      <td className="px-4 py-3 font-mono text-foreground">Mon Jan 6</td>
                      <td className="px-4 py-3 font-mono text-foreground">+5 days</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">Fri Jan 10</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Standard week turnaround</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Net-30 invoice due date</td>
                      <td className="px-4 py-3 font-mono text-foreground">Mar 1, 2026</td>
                      <td className="px-4 py-3 font-mono text-foreground">+21 days</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">Mar 31, 2026</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">~One calendar month</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Days between Jan 1–Mar 31</td>
                      <td className="px-4 py-3 font-mono text-foreground">Jan 1, 2026</td>
                      <td className="px-4 py-3 font-mono text-foreground">Mar 31, 2026</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">62 days</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Q1 with 3 holidays</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Holiday week (Thanksgiving)</td>
                      <td className="px-4 py-3 font-mono text-foreground">Nov 24, 2025</td>
                      <td className="px-4 py-3 font-mono text-foreground">Nov 28, 2025</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">4 days</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Thu is Thanksgiving</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Weekdays only (no holidays)</td>
                      <td className="px-4 py-3 font-mono text-foreground">Jul 1, 2026</td>
                      <td className="px-4 py-3 font-mono text-foreground">Jul 31, 2026</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">22 days</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Jul 4 excluded</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Notice how the Thanksgiving week example shows only 4 business days despite spanning 5 calendar weekdays — because Thanksgiving Thursday is a federal holiday. These edge cases are where an automatic holiday-aware calculator saves time and prevents scheduling mistakes.
              </p>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Business Days Calculator</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { title: "Two modes in one tool", desc: "Count days between dates or add business days to a start date — without switching tools. Both modes are available instantly from the same interface." },
                  { title: "US federal holidays built in", desc: "All 11 US federal holidays for 2025 and 2026 are pre-loaded. Toggle them on or off based on whether your SLA or project counts federal holidays as non-working days." },
                  { title: "Displays weeks + days", desc: "Results show the equivalent in business weeks and remainder days (e.g., '22 days = 4 weeks + 2 days') — a more actionable format than a raw number for sprint planning and project management." },
                  { title: "Works for international use", desc: "Turn off the holiday exclusion to count pure weekdays. Then manually subtract your country's public holidays. The tool handles the weekend logic for any date range." },
                  { title: "Plain-English result summary", desc: "Every result includes a short sentence explaining exactly what was calculated and what holidays were excluded — ideal for sharing in emails or pasting into project documents." },
                  { title: "Zero data collection", desc: "All calculations run in your browser. No dates you enter are transmitted to any server. Nothing is stored between sessions — your scheduling data stays completely private." },
                ].map(f => (
                  <div key={f.title} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="font-bold text-foreground mb-1 text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> This calculator covers US federal holidays for 2025–2026 only. For dates outside this range, disable the holiday toggle and count weekdays manually. State, local, and company-specific holidays are not included. For legally binding contract deadlines, always verify with your legal or compliance team — this tool is for planning purposes only.
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: "What counts as a business day?", a: "A business day is any weekday (Monday–Friday) that is not a public holiday. In the United States, the 11 federal holidays are: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving, and Christmas Day. This calculator includes both 2025 and 2026 US federal holidays and excludes them from the business day count when the toggle is enabled." },
                  { q: "How do I calculate 5 business days from today?", a: "Select 'Add Business Days', set the start date to today, and enter '5' in the business days field. The result shows the exact date 5 working days from now, with the day of week included. For example: if today is Monday, March 24, adding 5 business days (with no holidays) gives you Monday, March 31 — because the weekend days Saturday and Sunday are skipped." },
                  { q: "Does this include state or local holidays?", a: "No — this calculator only includes US federal holidays, which apply to federal government employees and many (but not all) private sector companies. State holidays, regional observances, banking holidays, and company-specific days off vary widely and are not included. For state holidays, add them to your manual count or turn off the holiday toggle and account for them separately." },
                  { q: "What is the difference between calendar days and business days?", a: "Calendar days count every day on the calendar — including weekends and holidays. Business days count only Monday–Friday, excluding public holidays. For a 30-calendar-day period like March 1–30, there are approximately 20–22 business days. The exact count depends on how many weekends fall in the range and how many federal holidays occur during that span. Always specify which type you mean in legal or professional contexts." },
                  { q: "Can I use this for international business days?", a: "Partially — you can toggle off the US holiday exclusion to count pure weekdays, which works for any country. Then manually subtract your country's national holidays. The weekend logic (Saturday and Sunday off) applies globally in most Western business contexts. For countries with different weekend days (e.g., Friday–Saturday in some Middle Eastern countries), this tool would need manual adjustment." },
                ].map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Date &amp; Time Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including age calculators, countdowns, work hour trackers, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
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

              {/* Share */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate business days easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
                    "Result Ranges",
                    "Quick Examples",
                    "Why Use This",
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

              {/* US Holidays Quick Reference */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">2026 US Holidays</h3>
                <div className="space-y-1.5">
                  {[
                    { name: "New Year's Day",     date: "Jan 1" },
                    { name: "MLK Day",            date: "Jan 19" },
                    { name: "Presidents' Day",    date: "Feb 16" },
                    { name: "Memorial Day",       date: "May 25" },
                    { name: "Juneteenth",         date: "Jun 19" },
                    { name: "Independence Day",   date: "Jul 4" },
                    { name: "Labor Day",          date: "Sep 7" },
                    { name: "Columbus Day",       date: "Oct 12" },
                    { name: "Veterans Day",       date: "Nov 11" },
                    { name: "Thanksgiving",       date: "Nov 26" },
                    { name: "Christmas",          date: "Dec 25" },
                  ].map(h => (
                    <div key={h.name} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-muted-foreground truncate">{h.name}</span>
                      <span className="font-bold text-foreground flex-shrink-0 ml-2">{h.date}</span>
                    </div>
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
