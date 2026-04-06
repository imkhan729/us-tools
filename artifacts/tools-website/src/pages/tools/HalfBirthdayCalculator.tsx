import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Calendar, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Gift, PartyPopper, CalendarClock, CalendarDays
} from "lucide-react";

// ── Calculator Logic ──
function useCalc() {
  const [birthDate, setBirthDate] = useState("");
  
  const result = useMemo(() => {
    if (!birthDate) return null;
    
    // Parse input date safely
    const bday = new Date(birthDate);
    if (isNaN(bday.getTime())) return null;

    // A half-birthday is exactly 6 months after the birthdate
    const halfBday = new Date(bday);
    halfBday.setMonth(halfBday.getMonth() + 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate next half birthday for the current or upcoming year
    const nextHalfBday = new Date(halfBday);
    nextHalfBday.setFullYear(today.getFullYear());

    if (nextHalfBday < today) {
      nextHalfBday.setFullYear(today.getFullYear() + 1);
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntilNext = Math.ceil((nextHalfBday.getTime() - today.getTime()) / msPerDay);
    
    return {
      halfBdayStr: halfBday.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
      nextHalfBdayStr: nextHalfBday.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      daysUntilNext,
      isToday: daysUntilNext === 0 || daysUntilNext === 365,
    };
  }, [birthDate]);
  
  return { birthDate, setBirthDate, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  let message = `Your half birthday falls on ${result.halfBdayStr} every year. `;
  
  if (result.isToday) {
    message += "Wait, that's today! Happy Half-Birthday! 🎉";
  } else {
    message += `Your next half birthday is coming up in exactly ${result.daysUntilNext} days.`;
  }

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
  { title: "Age Calculator", slug: "age-calculator", icon: <Calendar className="w-5 h-5" />, color: 25, benefit: "Calculate your exact age" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <CalendarClock className="w-5 h-5" />, color: 265, benefit: "Days between two dates" },
  { title: "Leap Year Checker", slug: "leap-year-checker", icon: <CalendarDays className="w-5 h-5" />, color: 340, benefit: "Check if a year has 366 days" },
];

export default function HalfBirthdayCalculator() {
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
        title="Half Birthday Calculator – Instantly Find Your 6-Month Mark"
        description="Find out your exact half birthday in seconds. Enter your birth date to automatically get your half birthday date and a countdown of days left. Free and instant."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Half Birthday Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Gift className="w-3.5 h-3.5" />
            Time &amp; Fun
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Half Birthday Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Who says you only get one birthday a year? Discover exactly when your half birthday falls, complete with a helpful countdown showing how many days are left until you can eat cake again.
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
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Half Birthday Matcher</p>
                      <p className="text-sm text-muted-foreground">Select your date of birth below.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Your Birth Date</label>
                        <input
                          type="date"
                          className="tool-calc-input text-lg py-3 w-full sm:w-56"
                          value={calc.birthDate}
                          onChange={e => calc.setBirthDate(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    {calc.result && (
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center relative overflow-hidden">
                          <PartyPopper className="w-24 h-24 absolute -bottom-6 -right-6 text-orange-500/10 pointer-events-none" />
                          <span className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest relative z-10">Your Next Half Birthday Is</span>
                          <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400 relative z-10">
                            {calc.result.nextHalfBdayStr}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/40 border border-border text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Countdown</span>
                          <span className="text-4xl font-black text-foreground tracking-tight">
                            {calc.result.daysUntilNext} <span className="text-xl font-medium text-muted-foreground ml-1">Days</span>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Celebrate a Half Birthday?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A "half birthday" is a fun milestone that marks precisely six months after your actual birthday. While mostly used casually, many people celebrate half birthdays for children, or use the date to have summer parties if their real birthday falls in winter (or vice versa).
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Pick Your Date</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Simply use the date picker to input the month and day you were born. The year doesn't actually matter for the calculation, but inserting your exact birth date guarantees full precision.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Instantly Get the 6-Month Mark</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The tool immediately determines exactly which month and day corresponds to exactly half a year (approx. 182.5 days) away from your birth date. 
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">See the Countdown</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      It automatically looks at today's real world calendar date to compare against your next half birthday. It will tell you the exact amount of waiting days until it arrives.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">Understand what your half-birthday output means.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Next Half-Birthday Date</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is the next calendar date that lands six months after your birthday.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Countdown Days</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Use this number for planning reminders, parties, or social posts in advance.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common Half-Birthday Pairings</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Actual Birthday</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Half Birthday</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">January 1st (New Year's)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">July 1st</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">February 14th (Valentine's)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">August 14th</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">April 1st (April Fools')</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">October 1st</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">July 4th</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">January 4th</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">October 31st (Halloween)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">April 30th* (adjusted for short months)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">December 25th (Christmas)</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">June 25th</td>
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
                  <strong className="text-foreground">Fast and simple.</strong> Enter one date and get a clear answer immediately.
                </p>
                <p>
                  <strong className="text-foreground">Practical output.</strong> You get both the next date and days remaining, which is useful for planning.
                </p>
                <p>
                  <strong className="text-foreground">Private by design.</strong> Your input stays in your browser and is never uploaded.
                </p>
              </div>
            </section>
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What happens if my half-birthday falls on a nonexistent date?"
                  a="If you were born on the 31st of a month, and the 6-month interval lands on a month with only 30 days (like April, June, September, November), your half birthday essentially becomes the 1st day of the following month, or the 30th of the current month depending on strict standard calculation algorithms."
                />
                <FaqItem
                  q="What about leap year babies (February 29th)?"
                  a="Since February 29th only occurs every 4 years, an exact 6-month leap corresponds mathematically to August 29th. So leap year babies actually get to celebrate an August 29th half birthday every single year."
                />
                <FaqItem
                  q="Why do people celebrate half birthdays?"
                  a="Half birthdays are popular for babies celebrating their 6-month age milestone, or for individuals whose actual birthday falls on annoying major holidays (like Christmas or Thanksgiving) and want a standalone occasion to celebrate with friends without scheduling conflicts."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Want to Know More About Your Age?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Head over to our exact Age Calculator to break your life down into exact months, weeks, days, hours, and minutes.
                </p>
                <Link
                  href="/time-date/age-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Go to Exact Age Calculator <ArrowRight className="w-4 h-4" />
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
                <p className="text-xs text-muted-foreground mb-3">Help others find their half-birthday.</p>
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
