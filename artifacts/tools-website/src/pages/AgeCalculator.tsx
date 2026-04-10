import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  format,
  isValid,
  parseISO,
  isAfter,
} from "date-fns";
import {
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Gift,
  Clock,
  Hash,
  ArrowRight,
  Zap,
  Smartphone,
  Shield,
  BadgeCheck,
  Lock,
  Copy,
  Check,
  Calculator,
  Heart,
  Star,
  Lightbulb,
} from "lucide-react";

// ── Calculator Logic ──
function calculateAge(birthDate: string, compareDate: string) {
  const birth = parseISO(birthDate);
  const compare = parseISO(compareDate);

  if (!isValid(birth) || !isValid(compare)) return null;
  if (isAfter(birth, compare)) return null;

  const years = differenceInYears(compare, birth);
  const afterYears = addYears(birth, years);
  const months = differenceInMonths(compare, afterYears);
  const afterMonths = new Date(afterYears);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  const days = differenceInDays(compare, afterMonths);

  const totalMonths = differenceInMonths(compare, birth);
  const totalDays = differenceInDays(compare, birth);

  // Next birthday
  const thisYearBirthday = new Date(compare.getFullYear(), birth.getMonth(), birth.getDate());
  let nextBirthday: Date;
  if (isAfter(thisYearBirthday, compare) || thisYearBirthday.getTime() === compare.getTime()) {
    nextBirthday = thisYearBirthday;
  } else {
    nextBirthday = new Date(compare.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysToBirthday = differenceInDays(nextBirthday, compare);

  return { years, months, days, totalMonths, totalDays, daysToBirthday, nextBirthday };
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-emerald-500"
        >
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
  {
    title: "Date Difference Calculator",
    slug: "date-difference-calculator",
    icon: <CalendarDays className="w-4 h-4" />,
    color: 152,
    benefit: "Find days between any two dates",
  },
  {
    title: "Days Until Calculator",
    slug: "days-until-calculator",
    icon: <Clock className="w-4 h-4" />,
    color: 45,
    benefit: "Countdown to any future date",
  },
  {
    title: "Day of Week Calculator",
    slug: "day-of-week-calculator",
    icon: <Hash className="w-4 h-4" />,
    color: 217,
    benefit: "Find what day any date falls on",
  },
  {
    title: "BMI Calculator",
    slug: "bmi-calculator",
    icon: <Heart className="w-4 h-4" />,
    color: 340,
    benefit: "Check your body mass index",
  },
  {
    title: "Retirement Calculator",
    slug: "retirement-calculator",
    icon: <Calculator className="w-4 h-4" />,
    color: 275,
    benefit: "Plan your retirement timeline",
  },
  {
    title: "Zodiac Sign Calculator",
    slug: "zodiac-sign-calculator",
    icon: <Gift className="w-4 h-4" />,
    color: 280,
    benefit: "Find your star sign by birthdate",
  },
];

// ── Main Component ──
export default function AgeCalculator() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [birthDate, setBirthDate] = useState("");
  const [compareDate, setCompareDate] = useState(today);
  const [copied, setCopied] = useState(false);

  const result = birthDate && compareDate ? calculateAge(birthDate, compareDate) : null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Age Calculator – Find Your Exact Age in Years, Months & Days | US Online Tools"
        description="Free age calculator. Find your exact age in years, months, and days. Calculate age at any date, see total days lived, and countdown to your next birthday. Leap year accurate."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Date &amp; Time</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Age Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <CalendarDays className="w-3.5 h-3.5" />
            Date &amp; Time
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Age Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find your exact age in years, months, and days. Calculate age at any past or future date, see your total days lived, and count down to your next birthday — all instantly.
          </p>

          {/* Badges */}
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
              <Shield className="w-3.5 h-3.5" /> Leap Year Accurate
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Date &amp; Time &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Age Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update instantly as you enter dates.</p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={today}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-2">
                        Age at the Date of
                      </label>
                      <input
                        type="date"
                        value={compareDate}
                        onChange={(e) => setCompareDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {/* Main Age Card */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
                            Exact Age
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-4xl font-black text-foreground">{result.years}</p>
                              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Years</p>
                            </div>
                            <div>
                              <p className="text-4xl font-black text-foreground">{result.months}</p>
                              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Months</p>
                            </div>
                            <div>
                              <p className="text-4xl font-black text-foreground">{result.days}</p>
                              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Days</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Next Birthday Card */}
                          <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <Gift className="w-4 h-4 text-pink-500" />
                              <p className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
                                Next Birthday
                              </p>
                            </div>
                            <p className="text-3xl font-black text-foreground mb-1">
                              {result.daysToBirthday === 0 ? "Today!" : `${result.daysToBirthday}`}
                            </p>
                            {result.daysToBirthday !== 0 && (
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Days Away</p>
                            )}
                            <p className="text-sm text-muted-foreground font-medium">
                              {format(result.nextBirthday, "MMMM d, yyyy")}
                            </p>
                          </div>

                          {/* Total Time Card */}
                          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                Total Time Lived
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-baseline justify-between">
                                <span className="text-xs text-muted-foreground font-medium">Total Months</span>
                                <span className="text-lg font-black text-foreground">{result.totalMonths.toLocaleString()}</span>
                              </div>
                              <div className="flex items-baseline justify-between">
                                <span className="text-xs text-muted-foreground font-medium">Total Days</span>
                                <span className="text-lg font-black text-foreground">{result.totalDays.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!result && birthDate && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-red-500/5 border border-red-500/20"
                    >
                      <div className="flex gap-2 items-center">
                        <Lightbulb className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          The date of birth must be before the "Age at" date. Please check your inputs.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {!birthDate && (
                    <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
                      <p className="text-sm text-muted-foreground">Enter a date of birth above to see the age calculation.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Age Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool calculates the exact age between any two dates — defaulting to today so you get your current age instantly. You can also compare any past or future date to discover how old someone was at a specific moment in history, or how old you'll be at a future milestone.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter Date of Birth</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click or tap the "Date of Birth" field and enter the birth date using your browser's date picker or by typing directly in YYYY-MM-DD format. This is the only required field — the "Age at" date defaults to today automatically, so your current age appears the moment you enter a valid birth date.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Optionally Change the "Age at" Date</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      By default the second field is set to today's date. You can change it to any past or future date — for example, enter a date in 1969 to find out how old someone was during the Moon landing, or enter a date in 2040 to see how old you'll be at retirement. Both past and future comparison dates are fully supported.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read Your Exact Age, Next Birthday Countdown, and Total Time Lived</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Three result cards appear instantly. The main card shows your precise age in years, remaining months, and remaining days. The pink birthday card counts down to the next birthday and shows its date. The blue total time card shows how many complete months and total calendar days have elapsed since the birth date — useful for precise life-span analysis.
                    </p>
                  </div>
                </li>
              </ol>

              {/* How Age is Calculated box */}
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">How Age is Calculated</p>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Step 1 — Years:</strong> The calculator first counts the number of complete years between the birth date and the comparison date. A year is only counted once the same calendar day of the birth month has passed in that year, ensuring leap-year birthdays (Feb 29) are handled correctly.
                  </p>
                  <p>
                    <strong className="text-foreground">Step 2 — Remaining Months:</strong> After subtracting the complete years, the calculator advances the birth date by those years and counts how many complete months remain before the comparison date. For example, if 30 full years have elapsed and then 4 months, the months field shows 4.
                  </p>
                  <p>
                    <strong className="text-foreground">Step 3 — Remaining Days:</strong> After accounting for the years and months, the remaining partial month is expressed as days. This three-part breakdown (years + months + days) is the standard way age is reported in most countries and matches what a doctor, government form, or legal document would state.
                  </p>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">When Is This Tool Useful?</h2>
              <p className="text-muted-foreground text-sm mb-6">Four common scenarios where the Age Calculator delivers instant answers:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Find Your Current Age (default use case)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Enter your birth date and leave the "Age at" field as today. You'll see your precise age in years, months, and days — far more accurate than simply subtracting birth year from the current year, which ignores whether your birthday has passed yet this year. This is the most common use case: confirming your exact age for official forms, travel documents, or online sign-ups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Age at a Historical Date (research &amp; curiosity)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Set the "Age at" date to a specific moment in history. How old was Albert Einstein when he published his special theory of relativity in 1905? (Born March 14, 1879 — he was 26 years old.) Historians, students, and trivia enthusiasts use this to add human context to dates they're researching. Simply enter the birth date and set the comparison date to the historical event.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Age at a Future Date (milestone planning)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Set the "Age at" date to a year in the future to plan milestones. If you were born in 1980 and want to know your exact age when you plan to retire in 2045, enter those dates and you'll see the precise age — useful for retirement planning, estate documents, pension eligibility checks, and personal goal setting. Future dates are fully supported.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Time Since Any Important Event (general date spans)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The tool is not limited to literal birth dates. Use it to measure the elapsed time since any meaningful event: the founding of a company, a wedding date, the start of a project, or even the birth of a pet. Enter the start date as the "Date of Birth" and any later date as the "Age at" date to get the precise time elapsed in years, months, and days.</p>
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
                      <th className="text-left px-4 py-3 font-bold text-foreground">Date of Birth</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Age at Date</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Result (approx.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Current age</td>
                      <td className="px-4 py-3 font-mono text-foreground">Jan 1, 1990</td>
                      <td className="px-4 py-3 font-mono text-foreground">Today</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">36 yrs 2 mo</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Millennial age today</td>
                      <td className="px-4 py-3 font-mono text-foreground">Mar 15, 2000</td>
                      <td className="px-4 py-3 font-mono text-foreground">Today</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 hidden sm:table-cell">26 yrs 0 mo</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Leap year birthday</td>
                      <td className="px-4 py-3 font-mono text-foreground">Feb 29, 2000</td>
                      <td className="px-4 py-3 font-mono text-foreground">Today</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 hidden sm:table-cell">26 yrs (6 leap bdays)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Age at retirement</td>
                      <td className="px-4 py-3 font-mono text-foreground">Jun 10, 1975</td>
                      <td className="px-4 py-3 font-mono text-foreground">Jun 10, 2040</td>
                      <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400 hidden sm:table-cell">65 yrs exactly</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Historical figure</td>
                      <td className="px-4 py-3 font-mono text-foreground">Nov 30, 1869</td>
                      <td className="px-4 py-3 font-mono text-foreground">Apr 21, 1948</td>
                      <td className="px-4 py-3 font-bold text-slate-600 dark:text-slate-400 hidden sm:table-cell">78 yrs 4 mo 22 d</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Current age (born Jan 1, 1990):</strong> Someone born on the first day of 1990 turns 36 in 2026. Because their birthday falls on January 1st — the very first day of the year — they have already passed their birthday by March 2026, so the full year count applies immediately. The months and days shown represent elapsed time since their most recent January 1st birthday.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Leap year birthday (born Feb 29, 2000):</strong> People born on February 29th only have an exact birthday every four years. In non-leap years, the calculator correctly handles this by counting the nearest valid date as the effective birthday anniversary, ensuring the age calculation is always accurate regardless of the leap year cycle. By March 2026, a person born on Feb 29, 2000 has had only 6 true Feb 29th birthdays.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Planning for retirement (born Jun 10, 1975):</strong> If you were born on June 10, 1975 and plan to retire on your 65th birthday, entering those dates shows you'll reach 65 on June 10, 2040 — exactly 65 years, 0 months, and 0 days. This is perfect for verifying pension eligibility dates or calculating how many years of contributions remain before the target retirement date.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – Historical figure (born Nov 30, 1869, died Apr 21, 1948):</strong> Entering these dates reveals an age of 78 years, 4 months, and 22 days at time of death. Historical researchers use this type of calculation to understand how life expectancy compared to modern standards, or to add biographical detail to historical writing. The calculator handles dates going back well before 1900 using the Gregorian calendar standard.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I use this every time someone asks 'how old was X when Y happened.' Saves me from doing mental gymnastics. The total days lived number is always the best conversation starter."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Age Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It's completely free with no hidden limits.</strong> Many age calculators online are free for simple queries but restrict advanced features — like changing the "age at" date — behind a subscription or account wall. This tool places no limits on any feature. You can calculate age at any past or future date, run as many calculations as you like, and bookmark or share the page freely. No paywall, no ads interrupting your workflow, no registration required.
                </p>
                <p>
                  <strong className="text-foreground">Your birth date is never stored or transmitted.</strong> Every calculation runs entirely in your browser using client-side JavaScript. The birth date you enter is never sent to any server, stored in any database, or linked to any user profile. This is especially important because birth dates are considered personally identifiable information (PII) under GDPR, CCPA, and HIPAA. You can trust that your data remains on your device and disappears the moment you close the tab.
                </p>
                <p>
                  <strong className="text-foreground">Leap year accuracy is built in.</strong> A common failure in simplistic age calculators is incorrect handling of February 29th birthdays and leap year boundaries. This tool uses the industry-standard date-fns library, which correctly accounts for all leap year edge cases. Whether you were born on Feb 29 or you're calculating age across a leap year boundary, the result is always accurate to the day.
                </p>
                <p>
                  <strong className="text-foreground">The flexible "Age at" date makes it more than just a birthday calculator.</strong> Most age calculators only compute your current age. This tool lets you change the reference date to any past or future moment — turning it into a historical research tool, a retirement planner, a life-event tracker, and a general date-span calculator all in one. This flexibility makes it useful for genealogists, writers, HR professionals, and anyone working with dates.
                </p>
                <p>
                  <strong className="text-foreground">Total months and total days give you the full picture.</strong> Beyond years, months, and days, the Total Time card shows how many complete months and total calendar days have elapsed since the birth date. These figures are useful in legal contexts (calculating age for contract eligibility), medical contexts (pediatric age in months), and fun contexts (impressing people at parties with how many days old you are).
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool uses the Gregorian calendar for all calculations. Dates before 1900 may reflect historical calendar differences not accounted for in this tool (such as the Julian-to-Gregorian transition in various countries). Results are for informational purposes only and should not be used as a substitute for legal documents such as birth certificates, passports, or official age verification records.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I calculate my exact age?"
                  a="Enter your date of birth in the first field and leave the second field as today's date. The calculator immediately shows your exact age in years, months, and days — more precise than simply subtracting birth year from the current year, which ignores whether your birthday has already occurred this calendar year. No button press is needed; the result updates as you type."
                />
                <FaqItem
                  q="Does this account for leap years?"
                  a="Yes. The calculator uses the date-fns library, which correctly handles all leap year edge cases. If you were born on February 29th, the tool accounts for the fact that your exact birthday only occurs every four years. In non-leap years, it correctly advances the anniversary to the nearest valid date for the purposes of calculating remaining months and days."
                />
                <FaqItem
                  q="Can I calculate someone else's age?"
                  a="Absolutely. The tool is not limited to your own birth date — you can enter any birth date to calculate the age of a family member, friend, historical figure, or fictional character. Just type in the birth date and set the 'Age at' date to whenever you want to know their age. No account or login is needed, and the birth date you enter is never stored."
                />
                <FaqItem
                  q="How is the next birthday countdown calculated?"
                  a="The calculator finds the next occurrence of the birth month and day after the 'Age at' date. If today is March 22 and your birthday is April 15, it counts forward to April 15 of the same year. If today is April 20 and your birthday was April 15, it counts forward to April 15 of next year. The number of days shown is the exact calendar difference between the comparison date and the next birthday date."
                />
                <FaqItem
                  q="Can I find out how old someone was when they died?"
                  a="Yes. Enter the person's birth date in the first field and their death date in the 'Age at' field. The calculator shows their exact age at the time of death in years, months, and days. This is useful for genealogy research, historical biographies, obituary writing, and academic study. The tool supports dates going back to 1900 reliably under the Gregorian calendar."
                />
                <FaqItem
                  q="What is the total days calculation?"
                  a="The 'Total Days Lived' figure in the blue card shows the exact number of calendar days between the birth date and the comparison date. This is a simple but striking number — most adults have lived over 10,000 days. The total months figure shows how many complete calendar months have elapsed. These metrics are used in medical contexts (pediatric age in months), legal age eligibility calculations, and fun personal milestones."
                />
                <FaqItem
                  q="Can I calculate age at a future date?"
                  a="Yes — the 'Age at' field accepts any date, including dates in the future. Simply change the second field to a future date and the calculator will show how old the person will be at that point. This is ideal for retirement planning (how old will I be in 2040?), milestone birthdays, pension eligibility verification, and long-term personal goal planning."
                />
                <FaqItem
                  q="Is my birth date stored anywhere?"
                  a="No. All calculations happen locally in your browser using JavaScript. The birth date you enter is never sent to any server, saved to any database, or associated with any user account. There are no cookies tracking your inputs and no analytics capturing the dates you enter. When you close or refresh the tab, all values are cleared. Your data stays 100% on your device."
                />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Date &amp; Time Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore our full suite of date calculators, converters, and timers — all free, all instant, no signup required.
                </p>
                <Link
                  href="/category/time-date"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore Date &amp; Time Tools <ArrowRight className="w-4 h-4" />
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
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{
                          background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))`,
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                          {tool.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others find their exact age instantly.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
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
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />
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
