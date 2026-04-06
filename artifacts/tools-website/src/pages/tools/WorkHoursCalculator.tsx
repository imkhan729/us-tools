import { useState, useMemo, useRef } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, Plus, Trash2,
  DollarSign, Timer, Calendar, ArrowRight, Briefcase, TrendingUp,
} from "lucide-react";

// ── Time Math ──
function parseTimeStr(t: string): number | null {
  const match = t.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const period = match[3]?.toUpperCase();
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToHhMm(minutes: number) {
  const sign = minutes < 0 ? "-" : "";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}h ${m.toString().padStart(2, "0")}m`;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface DayEntry {
  id: number;
  day: string;
  start: string;
  end: string;
  breakMin: string;
}

function useWorkHours() {
  const [entries, setEntries] = useState<DayEntry[]>([
    { id: 1, day: "Monday", start: "09:00", end: "17:00", breakMin: "30" },
    { id: 2, day: "Tuesday", start: "09:00", end: "17:00", breakMin: "30" },
    { id: 3, day: "Wednesday", start: "09:00", end: "17:00", breakMin: "30" },
    { id: 4, day: "Thursday", start: "09:00", end: "17:00", breakMin: "30" },
    { id: 5, day: "Friday", start: "09:00", end: "17:00", breakMin: "30" },
  ]);
  const [hourlyRate, setHourlyRate] = useState("");
  const nextId = useRef(6);

  const add = () => {
    setEntries(e => [...e, { id: nextId.current++, day: "Monday", start: "09:00", end: "17:00", breakMin: "30" }]);
  };

  const remove = (id: number) => setEntries(e => e.filter(x => x.id !== id));

  const update = (id: number, field: keyof DayEntry, value: string) => {
    setEntries(e => e.map(x => x.id === id ? { ...x, [field]: value } : x));
  };

  const results = useMemo(() => {
    let totalMinutes = 0;
    const rows = entries.map(e => {
      const startMin = parseTimeStr(e.start);
      const endMin = parseTimeStr(e.end);
      const breakMin = parseInt(e.breakMin) || 0;
      if (startMin === null || endMin === null) return { ...e, minutes: null, error: "Invalid time" };
      let diff = endMin - startMin;
      if (diff < 0) diff += 24 * 60; // overnight shift
      const net = Math.max(0, diff - breakMin);
      totalMinutes += net;
      return { ...e, minutes: net, error: null };
    });
    const rate = parseFloat(hourlyRate);
    const totalHours = totalMinutes / 60;
    const earnings = !isNaN(rate) && rate > 0 ? totalHours * rate : null;
    return { rows, totalMinutes, totalHours: +totalHours.toFixed(2), earnings };
  }, [entries, hourlyRate]);

  return { entries, add, remove, update, hourlyRate, setHourlyRate, results };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-cyan-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-cyan-500">
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

const RELATED_TOOLS = [
  { title: "Countdown Timer", slug: "countdown-timer", icon: <Timer className="w-5 h-5" />, color: 265, benefit: "Track time with a countdown" },
  { title: "Salary Calculator", slug: "online-salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 152, benefit: "Hourly to annual salary" },
  { title: "Hourly to Salary Calculator", slug: "hourly-to-salary-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 25, benefit: "Convert hourly to annual pay" },
  { title: "Date Difference Calculator", slug: "date-difference-calculator", icon: <Calendar className="w-5 h-5" />, color: 200, benefit: "Days between dates" },
];

export default function WorkHoursCalculator() {
  const { entries, add, remove, update, hourlyRate, setHourlyRate, results } = useWorkHours();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Work Hours Calculator – Calculate Hours Worked & Weekly Pay"
        description="Free work hours calculator. Enter start time, end time, and break for each day. Get total weekly hours worked and optional earnings with hourly rate. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time &amp; Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <span className="text-foreground">Work Hours Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Clock className="w-3.5 h-3.5" /> Time &amp; Date
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Work Hours Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate total hours worked across multiple days. Enter start time, end time, and break for each day. Optionally add an hourly rate to calculate weekly earnings.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "cyan" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Time &amp; Date &nbsp;·&nbsp; Supports overnight shifts &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator">
              <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Weekly Time Sheet</p>
                      <p className="text-sm text-muted-foreground">Add/remove rows. Results update live.</p>
                    </div>
                  </div>

                  {/* Header row */}
                  <div className="hidden sm:grid sm:grid-cols-[120px_1fr_1fr_80px_80px] gap-2 px-1">
                    {["Day", "Start", "End", "Break (min)", ""].map(h => (
                      <p key={h} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{h}</p>
                    ))}
                  </div>

                  {/* Rows */}
                  <div className="space-y-2">
                    {entries.map(e => {
                      const row = results.rows.find(r => r.id === e.id);
                      return (
                        <div key={e.id} className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr_80px_80px] gap-2 items-center p-3 rounded-xl bg-muted/40 border border-border">
                          <select value={e.day} onChange={ev => update(e.id, "day", ev.target.value)}
                            className="tool-calc-input text-sm">
                            {DAYS.map(d => <option key={d}>{d}</option>)}
                          </select>
                          <input type="time" value={e.start} onChange={ev => update(e.id, "start", ev.target.value)}
                            className="tool-calc-input text-sm" />
                          <input type="time" value={e.end} onChange={ev => update(e.id, "end", ev.target.value)}
                            className="tool-calc-input text-sm" />
                          <input type="number" min="0" max="480" value={e.breakMin}
                            onChange={ev => update(e.id, "breakMin", ev.target.value)}
                            className="tool-calc-input text-sm text-center" />
                          <div className="flex items-center justify-between gap-2">
                            {row?.minutes !== null && row?.minutes !== undefined ? (
                              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                                {minutesToHhMm(row.minutes)}
                              </span>
                            ) : (
                              <span className="text-xs text-red-500">--</span>
                            )}
                            <button onClick={() => remove(e.id)} className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={add}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground border-2 border-dashed border-border hover:border-cyan-500/50 px-4 py-2.5 rounded-xl transition-all w-full justify-center">
                    <Plus className="w-4 h-4" /> Add Day
                  </button>

                  {/* Hourly rate */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Hourly Rate (optional)</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="number" placeholder="25.00" min="0" step="0.01"
                        className="tool-calc-input pl-8 w-32"
                        value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                    </div>
                  </div>

                  {/* Results */}
                  {results.totalMinutes > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-1">Total Hours</p>
                          <p className="text-3xl font-black text-foreground">{results.totalHours}</p>
                          <p className="text-xs text-muted-foreground mt-1">{minutesToHhMm(results.totalMinutes)}</p>
                        </div>
                        {results.earnings !== null ? (
                          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Weekly Earnings</p>
                            <p className="text-3xl font-black text-foreground">${results.earnings.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-1">at ${parseFloat(hourlyRate).toFixed(2)}/hr</p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-muted/60 border border-border text-center flex flex-col items-center justify-center">
                            <DollarSign className="w-6 h-6 text-muted-foreground mb-1" />
                            <p className="text-xs text-muted-foreground">Add hourly rate to see earnings</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            You worked <strong>{minutesToHhMm(results.totalMinutes)}</strong> across {entries.length} day{entries.length > 1 ? "s" : ""}.
                            {results.earnings !== null && <> At ${parseFloat(hourlyRate).toFixed(2)}/hr that's <strong>${results.earnings.toFixed(2)}</strong> per week or <strong>${(results.earnings * 52).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> annually.</>}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Your Work Hours</h2>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Enter start and end times for each day", body: "The default entries show a standard 9–5 schedule. Adjust the start and end times to match your actual hours. Use 24-hour format (e.g., 17:00 for 5 PM) or the time picker. The calculator supports overnight shifts — if your end time is earlier than your start time, it assumes the shift crosses midnight." },
                  { title: "Add break time", body: "Enter the total unpaid break time in minutes. This is subtracted from your gross hours to give your net paid hours. A typical 30-minute lunch break means 7.5 net hours in an 8-hour day." },
                  { title: "Add or remove days as needed", body: "Use the '+ Add Day' button to include additional shifts, weekend days, or multiple entries for the same day (e.g., split shifts). Remove any row with the trash icon." },
                  { title: "Optional: add an hourly rate", body: "Enter your hourly wage to automatically calculate weekly and annual gross earnings. This does not account for taxes, overtime rates, or deductions — it is a pre-tax gross pay calculation." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <p className="text-xs font-mono text-muted-foreground">
                  Net hours = (End − Start) − Break &nbsp;·&nbsp; Weekly pay = Net hours × Hourly rate &nbsp;·&nbsp; Annual = Weekly × 52
                </p>
              </div>
            </section>

            {/* ── HOURS CONTEXT ── */}
            <section id="hours-context" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Weekly Hours in Context</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                How do your weekly hours compare to common employment standards and thresholds?
              </p>
              <div className="space-y-4">
                {[
                  { range: "Under 20 hours", label: "Part-time", color: "slate", dot: "bg-slate-400", description: "Typical for students, side jobs, or supplemental income. Usually below the threshold for benefits eligibility in most US jurisdictions." },
                  { range: "20–35 hours", label: "Reduced schedule", color: "blue", dot: "bg-blue-500", description: "Common for part-time professionals, parents with childcare, and phased retirement arrangements. Some employers offer benefits at 30+ hours." },
                  { range: "35–40 hours", label: "Full-time", color: "emerald", dot: "bg-emerald-500", description: "The standard full-time work week in most countries. Under US federal law (FLSA), overtime kicks in above 40 hours per week." },
                  { range: "40–50 hours", label: "Overtime zone", color: "amber", dot: "bg-amber-500", description: "Hours above 40 are typically paid at 1.5× in the US. Consistent overtime at this level is linked to reduced productivity and increased error rates." },
                  { range: "50+ hours", label: "Heavy overtime", color: "red", dot: "bg-red-500", description: "Research shows productivity per hour declines sharply above 50 hours/week. Associated with higher burnout, health risks, and long-term performance drops." },
                ].map(r => (
                  <div key={r.range} className={`flex gap-4 p-4 rounded-xl bg-${r.color}-500/5 border border-${r.color}-500/20`}>
                    <div className="flex-shrink-0 flex items-start pt-1">
                      <span className={`w-3 h-3 rounded-full ${r.dot} mt-0.5`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-sm font-black text-${r.color}-600 dark:text-${r.color}-400`}>{r.label}</span>
                        <span className="text-xs text-muted-foreground">{r.range}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Quick Examples</h2>
              <p className="text-muted-foreground mb-5 text-sm">Common shift patterns and their net hours (after break deduction):</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Schedule</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Start → End</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Break</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Net Hours/Day</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">5-Day Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { schedule: "Standard 9–5", shift: "9:00 → 17:00", brk: "30 min", net: "7h 30m", total: "37.5h" },
                      { schedule: "Early 7–3", shift: "7:00 → 15:00", brk: "30 min", net: "7h 30m", total: "37.5h" },
                      { schedule: "Long day", shift: "8:00 → 18:00", brk: "60 min", net: "9h 00m", total: "45h" },
                      { schedule: "Night shift", shift: "22:00 → 06:00", brk: "30 min", net: "7h 30m", total: "37.5h" },
                      { schedule: "Part-time", shift: "9:00 → 13:00", brk: "0 min", net: "4h 00m", total: "20h" },
                      { schedule: "Split shift", shift: "8:00 → 12:00", brk: "0 min", net: "4h 00m", total: "+ afternoon" },
                    ].map(row => (
                      <tr key={row.schedule} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-foreground">{row.schedule}</td>
                        <td className="py-3 px-3 text-muted-foreground font-mono text-xs">{row.shift}</td>
                        <td className="py-3 px-3 text-muted-foreground">{row.brk}</td>
                        <td className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-bold">{row.net}</td>
                        <td className="py-3 px-3 text-foreground font-semibold">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE THIS ── */}
            <section id="why-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Work Hours Calculator?</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Mental math on time is error-prone — especially with overnight shifts, varying breaks, and multiple days. This tool handles it instantly and accurately.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <Clock className="w-5 h-5 text-cyan-500" />, title: "Multi-day Time Sheet", desc: "Track an entire week in one view. Add extra rows for overtime days, weekend shifts, or split schedules." },
                  { icon: <TrendingUp className="w-5 h-5 text-cyan-500" />, title: "Overnight Shift Support", desc: "Automatically detects when your end time is before your start time and adds 24 hours. Perfect for night-shift workers." },
                  { icon: <DollarSign className="w-5 h-5 text-cyan-500" />, title: "Earnings Estimate", desc: "Enter your hourly rate for instant weekly and annual gross pay — useful for budgeting, comparing job offers, or contract negotiation." },
                  { icon: <Zap className="w-5 h-5 text-cyan-500" />, title: "Live Calculation", desc: "Every change updates instantly with no submit button needed. Adjust times and watch totals recalculate in real time." },
                  { icon: <Shield className="w-5 h-5 text-cyan-500" />, title: "100% Private", desc: "Your hours and pay details are calculated in your browser only. Nothing is stored, logged, or transmitted." },
                  { icon: <Briefcase className="w-5 h-5 text-cyan-500" />, title: "Freelancer Friendly", desc: "Works great for freelancers billing by the hour — track client hours per day across a project week and see your total billable amount." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">{f.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This calculator shows gross pre-tax earnings only. It does not account for income tax, social security, health insurance deductions, overtime multipliers, or jurisdiction-specific labor rules. For payroll compliance, use your employer's official system.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "How does the overnight shift calculation work?", a: "If your end time is before your start time (e.g., start at 10:00 PM, end at 06:00 AM), the calculator automatically detects this and adds 24 hours to the end time. This correctly calculates 8 hours of work for that overnight shift." },
                { q: "Does this calculate overtime?", a: "This calculator shows total hours but does not apply overtime multipliers automatically. In the US, federal overtime is paid at 1.5× for hours over 40 per week. To calculate overtime earnings, note your total hours, subtract 40, multiply the excess by 1.5×, and add to 40 × your regular rate." },
                { q: "Can I add multiple entries for the same day?", a: "Yes. Use the '+ Add Day' button to add another row and select the same day. This is useful for split shifts (e.g., 8–12 AM then 2–6 PM) or tracking multiple clients in one day. The totals automatically include all rows." },
                { q: "Can I save my weekly schedule?", a: "Currently, the schedule exists only in your browser session and is not saved when you close the tab. To save it, take a screenshot or copy the hours manually. For recurring schedules, bookmark the page with your browser and re-enter the times — the defaults reset each visit." },
                { q: "Is this suitable for payroll purposes?", a: "This tool is intended for quick personal calculations and estimates. For official payroll and compliance purposes, use your employer's designated time-tracking system or payroll software, which may account for jurisdiction-specific overtime rules, tax calculations, and statutory deductions." },
                { q: "How do I calculate my annual salary from these hours?", a: "Once you enter an hourly rate, the tool shows your weekly earnings. Multiply by 52 for a rough annual estimate (already shown in the result). For a more precise figure accounting for vacation, sick days, and holidays, subtract the days you won't work from 260 (52 weeks × 5 days) before multiplying by daily hours." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-cyan-500/10 via-card to-blue-500/10 border border-cyan-500/20 p-8 md:p-10 text-center">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-3">More Time & Finance Tools</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm leading-relaxed">
                Pair work hours tracking with salary conversion, business day calculations, and countdown timers for a complete productivity toolkit.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/finance/online-salary-calculator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-sm hover:bg-cyan-600 transition-colors">
                  Salary Calculator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/time-date"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold text-sm hover:bg-cyan-500/10 transition-colors">
                  All Time Tools
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color} 80% 50% / 0.1)`, color: `hsl(${t.color} 70% 45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-sm hover:bg-cyan-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">On This Page</p>
                <nav className="space-y-1">
                  {[
                    { href: "#overview", label: "Overview" },
                    { href: "#calculator", label: "Work Hours Calculator" },
                    { href: "#how-it-works", label: "How It Works" },
                    { href: "#hours-context", label: "Weekly Hours in Context" },
                    { href: "#examples", label: "Quick Examples" },
                    { href: "#why-use", label: "Why Use This" },
                    { href: "#faq", label: "FAQ" },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className="block text-sm text-muted-foreground hover:text-foreground hover:font-medium transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-cyan-500">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Reference */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Break Deduction Guide</p>
                <div className="space-y-2">
                  {[
                    { shift: "4h shift", break: "0–15 min" },
                    { shift: "6h shift", break: "15–30 min" },
                    { shift: "8h shift", break: "30–60 min" },
                    { shift: "10h shift", break: "45–60 min" },
                    { shift: "12h shift", break: "60 min" },
                  ].map(r => (
                    <div key={r.shift} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                      <p className="text-xs font-bold text-foreground">{r.shift}</p>
                      <span className="text-xs text-muted-foreground">{r.break}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Typical unpaid break ranges by shift length</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
