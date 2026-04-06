import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, CalendarDays, CalendarClock, Cake
} from "lucide-react";

// ── Calculator Logic ──
function useCalc() {
  const [dob, setDob] = useState("1995-01-01");
  const [targetDate, setTargetDate] = useState("");
  
  useEffect(() => {
    // Current date in local format for targetDate default
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISO = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    setTargetDate(localISO);
  }, []);
  
  const result = useMemo(() => {
    if (!dob || !targetDate) return null;
    
    // Parse at start of day local time to avoid timezone jumping
    const d1 = new Date(dob + 'T00:00:00');
    const d2 = new Date(targetDate + 'T00:00:00');

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const msDiff = d2.getTime() - d1.getTime();
    const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    
    const isFuture = daysDiff < 0;
    const absoluteDays = Math.abs(daysDiff);
    
    // Secondary metrics
    const hours = absoluteDays * 24;
    const minutes = hours * 60;
    const weeks = Math.floor(absoluteDays / 7);
    const remainingDays = absoluteDays % 7;

    return {
      absoluteDays,
      isFuture,
      hours,
      minutes,
      weeks,
      remainingDays,
      isValid: true
    };
  }, [dob, targetDate]);
  
  return {
    dob, setDob,
    targetDate, setTargetDate,
    result
  };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result || !result.isValid) return null;

  let message = `You have been alive for a total of ${result.absoluteDays.toLocaleString()} days. `;
  
  if (result.isFuture) {
    message = `That exact date is ${result.absoluteDays.toLocaleString()} days away into the future. `;
  } else {
    if (result.absoluteDays === 10000) {
      message += "Congratulations on crossing your 10,000 day milestone!";
    } else if (result.absoluteDays > 10000) {
      message += `This is remarkably equal to ${result.hours.toLocaleString()} literal hours that have elapsed since your birth.`;
    }
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
  { title: "Age Calculator", slug: "age-calculator", icon: <Cake className="w-5 h-5" />, color: 25, benefit: "Discover your exact age in years" },
  { title: "Half Birthday", slug: "half-birthday-calculator", icon: <CalendarClock className="w-5 h-5" />, color: 140, benefit: "Locate your upcoming 6-month leap" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <CalendarDays className="w-5 h-5" />, color: 210, benefit: "Calculate gaps between holidays" },
];

export default function AgeInDaysCalculator() {
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
        title="Age in Days Calculator – Discover Your Exact Lifetime"
        description="Free online Age in Days calculator. Find out exactly how many days, hours, and minutes you have been alive on planet Earth effortlessly."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Age in Days Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Cake className="w-3.5 h-3.5" />
            Milestone Metrics
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Age in Days Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Count exactly how many solar days have transpired since your date of birth. Measure and uncover thousands of uncelebrated lifespan milestones rapidly.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Counting
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup Required
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Private Analysis
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
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lifespan Metric</p>
                      <p className="text-sm text-muted-foreground">Adjust your starting birth date to calculate elapsed time.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative mb-6">
                      <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                        <label className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 block">Your Date of Birth</label>
                        <input
                          type="date"
                          className="tool-calc-input text-lg py-3 w-full border-orange-500/30 focus:border-orange-500"
                          value={calc.dob}
                          onChange={e => calc.setDob(e.target.value)}
                        />
                      </div>

                      <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                        <label className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 block">Compare Against Date</label>
                        <input
                          type="date"
                          className="tool-calc-input text-lg py-3 w-full"
                          value={calc.targetDate}
                          onChange={e => calc.setTargetDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {calc.result && calc.result.isValid && (
                      <div className="mt-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-1 text-center">Your Statistical Profile</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center relative overflow-hidden">
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1 uppercase tracking-widest relative z-10">Total Days Alive</span>
                            <span className="text-5xl font-black text-orange-600 dark:text-orange-400 relative z-10 drop-shadow-sm">
                              {calc.result.absoluteDays.toLocaleString()} <span className="text-2xl opacity-70">Days</span>
                            </span>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-card border border-border text-center">
                            <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">Weeks</span>
                            <span className="text-2xl font-black text-foreground">
                              {calc.result.weeks.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">And {calc.result.remainingDays} days</span>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-card border border-border text-center">
                            <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">Hours</span>
                            <span className="text-2xl font-black text-foreground">
                              {calc.result.hours.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-card border border-border text-center">
                            <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">Minutes</span>
                            <span className="text-2xl font-black text-foreground">
                              {calc.result.minutes.toLocaleString()}
                            </span>
                          </div>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Finding Your Milestones</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most individuals track their age strictly by counting calendar years, bypassing the fun, numerical landmarks like turning exactly 10,000 days or 500 weeks old. Calculate your chronological age in singular days reliably using this metric.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set Your Birth Origin</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter the date you were born into the left-hand input box visually represented by the calendar widget. The chronological timeline triggers directly after that midnight boundary.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Verify Target Range</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      By default, this measures strictly against today's date natively. However, you can toggle the right-hand container and set it far out towards the future to see exactly when your 10,000-day or 20,000-day uncelebrated birthday actually arrives.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Identify Micro Factors</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Once analyzed, look towards your statistical breakdowns on the bottom tray, showcasing fun extra numeric bounds (like raw minute tracking data spanning out to millions!).
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Average Day Scale Markers</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Age Marker</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Roughly Equates To</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Meaningfulness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">10,000 Days</td>
                      <td className="px-4 py-3 text-muted-foreground">About ~27 Years and 4.5 Months</td>
                      <td className="px-4 py-3 font-medium text-foreground">A common celebration epoch!</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">15,000 Days</td>
                      <td className="px-4 py-3 text-muted-foreground">About ~41 Years later</td>
                      <td className="px-4 py-3 font-medium text-foreground">Hitting midlife adulthood</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">20,000 Days</td>
                      <td className="px-4 py-3 text-muted-foreground">Just ~54 Years and 9 Months</td>
                      <td className="px-4 py-3 font-medium text-foreground">Approaching retirement horizons</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">30,000 Days</td>
                      <td className="px-4 py-3 text-muted-foreground">About ~82 Years Old</td>
                      <td className="px-4 py-3 font-medium text-foreground">Average global life expectancy limit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does this calculator correctly skip Leap Years?"
                  a="Yes! The calculator naturally builds out proper leap year metrics seamlessly because it inherently parses exact milliseconds against the established Julian Calendar standard rather than utilizing generalized division factors like 365.25."
                />
                <FaqItem
                  q="Does it count the current ongoing day?"
                  a="This calculator counts completed 24-hour cycles. If it is 10 days since an event, the output registers exactly 10 full spans. Since everyone is born at a unique time during the day, standard metrics operate utilizing the strict midnight boundaries."
                />
                <FaqItem
                  q="Are the seconds realistically accurate to my birth?"
                  a="Because this tool accepts only calendar date string layouts, the minutes and hour extrapolations act primarily as simple multiples built out from your total days (Total Days * 24 = Total Hours). True exact values mandate adding a precise timestamp offset."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Want to Compare Differences?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Curious how old you are natively separated against friends or siblings? Compare their birthdays securely against your timeline using our general Date Difference suite algorithm.
                </p>
                <Link
                  href="/time-date/date-difference-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Verify Date Differences <ArrowRight className="w-4 h-4" />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help a friend reveal their specific day age.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
                    "Quick Examples",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
