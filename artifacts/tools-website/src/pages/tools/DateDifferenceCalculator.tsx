import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calendar, Calculator, Lightbulb, Copy, Check,
  Baby, Target, Cake, PartyPopper,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
interface DateResult {
  totalDays: number;
  weeks: number;
  remainderDays: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  businessDays: number;
  startDate: Date;
  endDate: Date;
}

function useDateDiffCalc() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const result = useMemo<DateResult | null>(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const earlier = start <= end ? start : end;
    const later = start <= end ? end : start;

    const diffMs = later.getTime() - earlier.getTime();
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainderDays = totalDays % 7;
    const hours = totalDays * 24;
    const minutes = hours * 60;

    // Calculate months and years
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    if (later.getDate() < earlier.getDate()) {
      months -= 1;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalMonths = years * 12 + months;

    // Calculate business days (exclude Saturday & Sunday)
    let businessDays = 0;
    const current = new Date(earlier);
    while (current < later) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return {
      totalDays,
      weeks,
      remainderDays,
      months: totalMonths,
      years,
      hours,
      minutes,
      businessDays,
      startDate: earlier,
      endDate: later,
    };
  }, [startDate, endDate]);

  return { startDate, setStartDate, endDate, setEndDate, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: DateResult | null }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US");
  const weekendDays = result.totalDays - result.businessDays;

  const message = `There are ${fmt(result.totalDays)} days between your two dates, which is ${fmt(result.weeks)} weeks and ${result.remainderDays} day${result.remainderDays !== 1 ? "s" : ""}. Of those, ${fmt(result.businessDays)} are business days and ${fmt(weekendDays)} fall on weekends. That's ${fmt(result.hours)} hours or ${fmt(result.minutes)} minutes in total.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
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
  { title: "Age Calculator", slug: "age-calculator", icon: <Cake className="w-5 h-5" />, color: 340 },
  { title: "GPA Calculator", slug: "gpa-calculator", icon: <Calculator className="w-5 h-5" />, color: 217 },
  { title: "Word Counter", slug: "word-counter", icon: <CheckCircle2 className="w-5 h-5" />, color: 152 },
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 25 },
  { title: "Salary Calculator", slug: "online-salary-calculator", icon: <Calculator className="w-5 h-5" />, color: 265 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Calculator className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function DateDifferenceCalculator() {
  const calc = useDateDiffCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | null) => {
    if (n === null) return "--";
    return n.toLocaleString("en-US");
  };

  return (
    <Layout>
      <SEO
        title="Date Difference Calculator - Free Online Days Between Dates Tool"
        description="Free online date difference calculator. Calculate the number of days, weeks, months, and years between two dates. Includes business days, hours, and minutes. Instant results, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Date Difference Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Clock className="w-3.5 h-3.5" />
                Time & Date
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Date Difference Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate the exact number of days, weeks, months, and years between any two dates. See business days, hours, and minutes — free, instant, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Pick your start and end dates below — results update automatically. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 35 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Date Difference Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Start Date</label>
                    <input
                      type="date"
                      className="tool-calc-input w-full"
                      value={calc.startDate}
                      onChange={e => calc.setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">End Date</label>
                    <input
                      type="date"
                      className="tool-calc-input w-full"
                      value={calc.endDate}
                      onChange={e => calc.setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Days</div>
                    <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                      {calc.result ? fmt(calc.result.totalDays) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Weeks</div>
                    <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                      {calc.result ? `${fmt(calc.result.weeks)}w ${calc.result.remainderDays}d` : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Months</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {calc.result ? fmt(calc.result.months) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Years</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      {calc.result ? fmt(calc.result.years) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Business Days</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {calc.result ? fmt(calc.result.businessDays) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Hours</div>
                    <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                      {calc.result ? fmt(calc.result.hours) : "--"}
                    </div>
                  </div>
                </div>

                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Select Your Dates</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Pick a start date and an end date using the date pickers. The calculator automatically determines which date is earlier and calculates the difference regardless of the order you enter them.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Instant Calculation</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The tool calculates the difference in multiple units: total days, weeks and remaining days, months, years, hours, and minutes. It also counts business days by excluding all Saturdays and Sundays.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Use Your Results</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use the results for project planning, event countdowns, age calculations, deadline tracking, or any scenario where you need to know the exact time span between two dates.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Baby className="w-4 h-4 text-rose-500" />
                    <h4 className="font-bold text-foreground text-sm">Pregnancy Due Date</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Calculate the <strong className="text-foreground">280 days</strong> (40 weeks) from your last menstrual period to estimate your due date accurately.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Project Deadline</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A project starts Jan 15 and ends Apr 30. That is <strong className="text-foreground">105 days</strong> total or <strong className="text-foreground">75 business days</strong> to plan your sprints around.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Cake className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Age in Days</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Born on March 15, 1995? As of today, you have lived approximately <strong className="text-foreground">11,330+ days</strong>. Enter your birthdate to find your exact number.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <PartyPopper className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Days Until an Event</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Planning a wedding for December 31? Enter today's date and the event date to see exactly <strong className="text-foreground">how many days remain</strong> for your countdown.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant date difference results as you pick dates" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate business day calculations excluding weekends" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking — runs in your browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Fully responsive and works on all devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "Shows hours, minutes, weeks, months, and years" },
                  { icon: <Calendar className="w-4 h-4" />, text: "Handles any date range — past, present, or future" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is a Date Difference Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  A date difference calculator is a tool that computes the exact time span between any two dates. Whether you need to know the number of days between two dates, how many weeks until a deadline, or the total business days in a project timeline, this calculator provides precise results instantly. It is one of the most commonly used date calculator tools for personal and professional planning.
                </p>
                <p>
                  This free online date difference calculator shows you the gap between two dates in multiple formats: total calendar days, weeks and remaining days, months, years, hours, and minutes. It also calculates business days by automatically excluding weekends (Saturdays and Sundays), making it invaluable for project managers, HR professionals, and anyone tracking work timelines.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">How Many Days Between Two Dates?</h3>
                <p>
                  Counting the days between dates manually is error-prone, especially across months with different lengths and leap years. Our days between dates calculator handles all of these complexities automatically. Simply pick two dates, and the tool instantly computes the exact number of calendar days, including the precise number of business days for workplace planning.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use a Date Difference Calculator?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Calculating how many days until a vacation, wedding, or other important event",
                    "Tracking project timelines and counting business days for deadlines",
                    "Determining the exact age in days, weeks, or months",
                    "Planning pregnancy milestones and due date countdowns",
                    "Calculating contract durations, lease periods, or warranty expirations",
                    "Figuring out how many days between pay periods or billing cycles",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I calculate the number of days between two dates?"
                  a="Simply enter your start date and end date in the date pickers above. The calculator instantly shows the total number of calendar days, weeks, months, years, business days, hours, and minutes between the two dates."
                />
                <FaqItem
                  q="Does this calculator account for leap years?"
                  a="Yes. The calculator uses standard date arithmetic that correctly handles leap years, months with different lengths (28, 29, 30, or 31 days), and all other calendar variations automatically."
                />
                <FaqItem
                  q="What are business days and how are they calculated?"
                  a="Business days are weekdays (Monday through Friday) excluding Saturdays and Sundays. The calculator counts each weekday between your two dates. Note that public holidays are not excluded as they vary by country and region."
                />
                <FaqItem
                  q="Can I calculate how many days until a future event?"
                  a="Absolutely. Set the start date to today and the end date to your event date. The calculator will show you exactly how many days, weeks, and months remain until that date."
                />
                <FaqItem
                  q="Does the order of dates matter?"
                  a="No. The calculator automatically determines which date is earlier and which is later. You will always get a positive result regardless of which date you enter first."
                />
                <FaqItem
                  q="Is this date calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. The entire calculation runs in your browser — your dates never leave your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Date & Time Tools?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including age calculators, time zone converters, countdown timers, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others calculate the days between dates easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
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
