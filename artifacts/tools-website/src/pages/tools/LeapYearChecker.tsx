import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Calendar, CheckCircle, XCircle, ChevronDown, Share2, Star, Shield, Zap, Clock, Award } from "lucide-react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getLeapYearsInRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let y = start; y <= end; y++) {
    if (isLeapYear(y)) result.push(y);
  }
  return result;
}

function nextLeapYear(year: number): number {
  let y = year + 1;
  while (!isLeapYear(y)) y++;
  return y;
}

function prevLeapYear(year: number): number {
  let y = year - 1;
  while (!isLeapYear(y)) y--;
  return y;
}

const faqs = [
  {
    q: "What is a leap year?",
    a: "A leap year is a year with 366 days instead of the usual 365. The extra day — February 29 — is called a leap day. It keeps our calendar aligned with Earth's 365.2425-day orbit around the sun.",
  },
  {
    q: "What is the rule for determining a leap year?",
    a: "A year is a leap year if: (1) it is divisible by 4, AND (2) it is NOT divisible by 100, UNLESS it is also divisible by 400. So 2000 was a leap year, 1900 was not, and 2024 is.",
  },
  {
    q: "Why was the rule changed to include the 400-year exception?",
    a: "The Gregorian calendar (introduced in 1582) refined the Julian calendar rule of every 4 years. Without the 100- and 400-year exceptions, the calendar would drift by about 3 days every 400 years.",
  },
  {
    q: "How many leap years are there per century?",
    a: "There are typically 97 leap years in every 400-year cycle — roughly 24 per century. Most centuries have 24 leap years, but century years (e.g., 1900) are skipped unless divisible by 400.",
  },
  {
    q: "What happens to people born on February 29?",
    a: "People born on Feb 29 are called 'leaplings' or 'leap-day babies.' They celebrate their actual birthday once every 4 years. In non-leap years, most celebrate on February 28 or March 1.",
  },
  {
    q: "Is 2024 a leap year?",
    a: "Yes. 2024 is divisible by 4 and not by 100, so it is a leap year with February 29.",
  },
  {
    q: "When is the next leap year after 2024?",
    a: "The next leap year after 2024 is 2028.",
  },
];

export default function LeapYearChecker() {
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [rangeStart, setRangeStart] = useState<string>("2000");
  const [rangeEnd, setRangeEnd] = useState<string>("2100");

  const yearNum = parseInt(year) || 0;

  const result = useMemo(() => {
    if (!year || isNaN(yearNum) || yearNum < 1 || yearNum > 9999) return null;
    const leap = isLeapYear(yearNum);
    return {
      leap,
      divisibleBy4: yearNum % 4 === 0,
      divisibleBy100: yearNum % 100 === 0,
      divisibleBy400: yearNum % 400 === 0,
      next: nextLeapYear(yearNum),
      prev: prevLeapYear(yearNum),
    };
  }, [year, yearNum]);

  const rangeResult = useMemo(() => {
    const s = parseInt(rangeStart);
    const e = parseInt(rangeEnd);
    if (!s || !e || isNaN(s) || isNaN(e) || s > e || e - s > 500) return null;
    return getLeapYearsInRange(s, e);
  }, [rangeStart, rangeEnd]);

  return (
    <Layout>
      <SEO
        title="Leap Year Checker — Is Any Year a Leap Year? | Free Tool"
        description="Instantly check if any year is a leap year. Understand the 4/100/400 rule, find next and previous leap years, and list all leap years in any range."
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-4 md:px-8 pt-4 max-w-7xl mx-auto">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/category/time-date" className="hover:text-foreground transition-colors">Time & Date</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Leap Year Checker</span>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-12 px-4 md:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Time & Date
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
            Leap Year Checker
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-6">
            Instantly check if any year is a leap year. See the step-by-step divisibility logic, find next and previous leap years, and list all leap years in any date range.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { icon: Zap, label: "Instant result" },
              { icon: CheckCircle, label: "Step-by-step logic" },
              { icon: Calendar, label: "Range finder" },
              { icon: Shield, label: "100% free" },
              { icon: Clock, label: "No signup needed" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calculator Column */}
        <div className="lg:col-span-3 space-y-6">

          {/* Tool Widget */}
          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">Check a Year</h2>
              <p className="text-muted-foreground text-sm mb-6">Enter any year from 1 to 9999</p>

              <div className="max-w-sm">
                <label className="block text-sm font-medium mb-1.5">Year</label>
                <input
                  type="number"
                  className="tool-calc-input text-2xl font-bold text-center"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  min={1}
                  max={9999}
                />
              </div>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 space-y-4"
                  >
                    {/* Main verdict */}
                    <div className={`tool-calc-result flex items-center gap-4 ${result.leap ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"}`}>
                      {result.leap
                        ? <CheckCircle className="w-10 h-10 text-emerald-500 shrink-0" />
                        : <XCircle className="w-10 h-10 text-red-500 shrink-0" />
                      }
                      <div>
                        <p className="text-2xl font-bold">{yearNum} is {result.leap ? "" : "NOT "}a leap year</p>
                        <p className="text-muted-foreground text-sm">{result.leap ? "February has 29 days this year." : "February has 28 days this year."}</p>
                      </div>
                    </div>

                    {/* Step-by-step logic */}
                    <div className="bg-muted/40 rounded-xl p-5 space-y-3">
                      <p className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Divisibility Check</p>
                      {[
                        { label: `${yearNum} ÷ 4`, pass: result.divisibleBy4, note: result.divisibleBy4 ? "Divisible by 4 ✓" : "Not divisible by 4 — not a leap year" },
                        { label: `${yearNum} ÷ 100`, pass: !result.divisibleBy100, skip: !result.divisibleBy4, note: result.divisibleBy100 ? "Divisible by 100 — needs 400 check" : "Not divisible by 100 ✓ — leap year confirmed" },
                        { label: `${yearNum} ÷ 400`, pass: result.divisibleBy400, skip: !result.divisibleBy100, note: result.divisibleBy400 ? "Divisible by 400 ✓ — leap year" : "Not divisible by 400 — not a leap year" },
                      ].map((step, i) => (
                        !step.skip && (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${step.pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {step.pass ? "✓" : "✗"}
                            </div>
                            <div>
                              <span className="font-mono font-semibold text-sm">{step.label}</span>
                              <span className="text-muted-foreground text-sm ml-2">— {step.note}</span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>

                    {/* Adjacent leap years */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/40 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Previous Leap Year</p>
                        <p className="text-2xl font-bold text-violet-600">{result.prev}</p>
                      </div>
                      <div className="bg-muted/40 rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Next Leap Year</p>
                        <p className="text-2xl font-bold text-indigo-600">{result.next}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Range Tool */}
          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-violet-500" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">List Leap Years in a Range</h2>
              <p className="text-muted-foreground text-sm mb-5">Find all leap years between two years (max 500-year span)</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm mb-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">From year</label>
                  <input type="number" className="tool-calc-input" value={rangeStart} onChange={e => setRangeStart(e.target.value)} min={1} max={9999} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">To year</label>
                  <input type="number" className="tool-calc-input" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} min={1} max={9999} />
                </div>
              </div>

              {rangeResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">{rangeResult.length} leap years found</p>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {rangeResult.map(y => (
                      <button
                        key={y}
                        onClick={() => setYear(String(y))}
                        className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-mono font-medium hover:bg-violet-200 transition-colors"
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Click any year to check it above</p>
                </motion.div>
              )}
              {rangeStart && rangeEnd && !rangeResult && (
                <p className="text-sm text-red-500">Please enter a valid range (max 500 years)</p>
              )}
            </div>
          </div>

          {/* How It Works */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-4">How to Check If a Year Is a Leap Year</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              {[
                { step: "1", text: "Is the year divisible by 4? If NO → not a leap year. If YES → go to step 2." },
                { step: "2", text: "Is the year divisible by 100? If NO → it IS a leap year. If YES → go to step 3." },
                { step: "3", text: "Is the year divisible by 400? If YES → it IS a leap year. If NO → not a leap year." },
              ].map(({ step, text }) => (
                <li key={step} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center shrink-0">{step}</span>
                  <span className="pt-1">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Formula */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-600" /> The Gregorian Leap Year Formula</h3>
            <div className="font-mono text-sm bg-white dark:bg-background rounded-xl p-4 border border-violet-100 dark:border-violet-900 leading-relaxed">
              <span className="text-violet-600 font-bold">isLeapYear</span>(year) =<br />
              &nbsp;&nbsp;(year <span className="text-indigo-500">% 4 === 0</span> <span className="text-muted-foreground">AND</span> year <span className="text-red-500">% 100 !== 0</span>)<br />
              &nbsp;&nbsp;<span className="text-muted-foreground">OR</span><br />
              &nbsp;&nbsp;(year <span className="text-emerald-500">% 400 === 0</span>)
            </div>
            <p className="text-xs text-muted-foreground mt-3">Defined by the Gregorian calendar (1582), correcting the earlier Julian calendar's simpler every-4-years rule.</p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Why Trust This Tool</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Uses official Gregorian calendar rules", "Works for years 1–9999", "Step-by-step logic shown", "Range finder up to 500 years", "No ads, no signup"].map(item => (
                <li key={item} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-violet-500" /> Quick Facts</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">2024</strong> — Leap year ✓</li>
              <li><strong className="text-foreground">2025</strong> — Not a leap year</li>
              <li><strong className="text-foreground">2028</strong> — Next leap year</li>
              <li><strong className="text-foreground">1900</strong> — NOT leap (÷100, not ÷400)</li>
              <li><strong className="text-foreground">2000</strong> — Leap year (÷400) ✓</li>
              <li><strong className="text-foreground">2100</strong> — NOT a leap year</li>
            </ul>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-500" /> Share</h3>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="w-full text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors"
            >
              Copy Link
            </button>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Related Tools</h3>
            <div className="space-y-2">
              {[
                { label: "Age Calculator", href: "/time-date/age-calculator" },
                { label: "Date Difference Calculator", href: "/time-date/date-difference-calculator" },
                { label: "Business Days Calculator", href: "/time-date/business-days-calculator" },
                { label: "Countdown Timer", href: "/time-date/countdown-timer" },
                { label: "Work Hours Calculator", href: "/time-date/work-hours-calculator" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                  <ChevronRight className="w-3.5 h-3.5 text-violet-500" />{label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* SEO Rich Content */}
      <section className="bg-muted/30 border-t border-border py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Leap Year Checker — Complete Guide</h2>
            <p>A <strong>leap year</strong> occurs every four years and contains an extra day — <strong>February 29</strong> — making the year 366 days long instead of the usual 365. This adjustment keeps our calendar synchronized with Earth's revolution around the sun, which takes approximately <strong>365.2422 days</strong>.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Why Do We Need Leap Years?</h3>
            <p>Without leap years, our calendar would drift by about 6 hours per year. Over a century, seasons would shift by roughly 24 days. Ancient Egyptians first identified the need for an extra day, and Julius Caesar formalized the every-4-years rule in 46 BC with the Julian calendar. Pope Gregory XIII refined it in 1582 with the Gregorian calendar still in use today.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Common Misconceptions About Leap Years</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Not every year divisible by 4 is a leap year — century years (1700, 1800, 1900) are skipped.</li>
              <li>Year 2000 was a leap year because it's divisible by 400 — many people assume it wasn't.</li>
              <li>2100, 2200, and 2300 will NOT be leap years. 2400 will be.</li>
              <li>Some cultures use different calendar systems with different leap year rules (e.g., the Hebrew or Islamic calendar).</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Uses of Leap Year Calculation</h3>
            <p>Leap year awareness is critical in many fields: <strong>software development</strong> (date libraries, scheduling systems), <strong>finance</strong> (365 vs 366-day interest accrual), <strong>legal contracts</strong> (annual deadlines), <strong>astronomy</strong>, and <strong>everyday planning</strong>. Our checker gives you the answer in under a second — with full logic explained.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
