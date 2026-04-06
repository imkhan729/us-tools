import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Info,
  Calculator,
  Briefcase,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtCur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtCurD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

// ─── FAQ accordion ──────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────
export default function HourlyToSalaryCalculator() {
  const [mode, setMode] = useState<"hourly" | "salary">("hourly");
  const [value, setValue] = useState("25");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [overtimeRate, setOvertimeRate] = useState("1.5");
  const [overtimeHours, setOvertimeHours] = useState("0");

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const hpw = parseFloat(hoursPerWeek) || 40;
    const wpy = parseFloat(weeksPerYear) || 52;
    const otr = parseFloat(overtimeRate) || 1.5;
    const oth = parseFloat(overtimeHours) || 0;
    if (v <= 0) return null;

    let hourly: number, annual: number;
    if (mode === "hourly") {
      hourly = v;
      const regularHours = Math.max(0, hpw - oth);
      const weeklyOT = oth * hourly * otr;
      const weeklyRegular = regularHours * hourly;
      const weeklyPay = weeklyRegular + weeklyOT;
      annual = weeklyPay * wpy;
    } else {
      annual = v;
      hourly = annual / (hpw * wpy);
    }

    const weekly = annual / wpy;
    const biweekly = weekly * 2;
    const semimonthly = annual / 24;
    const monthly = annual / 12;
    const daily = annual / (wpy * (hpw / 8));
    const hourlyEffective = annual / (hpw * wpy);
    const minuteRate = hourlyEffective / 60;

    // Overtime breakdown
    const regularHoursPerWeek = Math.max(0, hpw - oth);
    const overtimeWeeklyPay = oth * (mode === "hourly" ? v : hourlyEffective) * otr;
    const annualOT = overtimeWeeklyPay * wpy;

    return { hourly: hourlyEffective, annual, weekly, biweekly, semimonthly, monthly, daily, minuteRate, annualOT };
  }, [value, mode, hoursPerWeek, weeksPerYear, overtimeRate, overtimeHours]);

  return (
    <div style={{ "--calc-hue": "155" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Hourly to Salary Calculator — Convert Wage to Annual Income"
        description="Convert hourly wage to annual salary or salary to hourly rate. Includes overtime, weekly, monthly breakdowns. Free hourly to salary calculator."
      />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Hourly to Salary Calculator</span>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),60%,40%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Finance & Cost
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Hourly to Salary Calculator
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "No Signup", "Includes Overtime", "Instant Results"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Instantly convert between hourly wage and annual salary. See weekly, monthly, and biweekly breakdowns — with optional overtime calculations included.
        </p>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[hsl(var(--calc-hue),60%,40%)]" />
              Wage Converter
            </h2>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-5 p-1 bg-muted rounded-xl w-fit">
              {(["hourly", "salary"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${mode === m ? "bg-[hsl(var(--calc-hue),60%,45%)] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {m === "hourly" ? "Hourly → Salary" : "Salary → Hourly"}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="tool-calc-label">
                  {mode === "hourly" ? "Hourly Wage ($)" : "Annual Salary ($)"}
                </label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder={mode === "hourly" ? "25.00" : "52000"} />
              </div>
              <div>
                <label className="tool-calc-label">Hours per Week</label>
                <input className="tool-calc-input" type="number" min="1" max="168" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="40" />
              </div>
              <div>
                <label className="tool-calc-label">Weeks Worked per Year</label>
                <input className="tool-calc-input" type="number" min="1" max="52" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} placeholder="52" />
              </div>
              <div>
                <label className="tool-calc-label">Overtime Hours per Week</label>
                <input className="tool-calc-input" type="number" min="0" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} placeholder="0" />
              </div>
              {parseFloat(overtimeHours) > 0 && (
                <div>
                  <label className="tool-calc-label">Overtime Multiplier</label>
                  <input className="tool-calc-input" type="number" min="1" step="0.1" value={overtimeRate} onChange={(e) => setOvertimeRate(e.target.value)} placeholder="1.5" />
                </div>
              )}
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${value}-${mode}-${hoursPerWeek}-${weeksPerYear}-${overtimeHours}-${overtimeRate}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Primary results */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: "Annual Salary", value: fmtCur(result.annual), icon: <TrendingUp className="w-4 h-4" />, color: "text-green-600", highlight: mode === "hourly" },
                      { label: "Hourly Rate", value: fmtCurD(result.hourly), icon: <Clock className="w-4 h-4" />, color: "text-[hsl(var(--calc-hue),60%,40%)]", highlight: mode === "salary" },
                      { label: "Monthly", value: fmtCur(result.monthly), icon: <Calendar className="w-4 h-4" />, color: "text-blue-600", highlight: false },
                      { label: "Biweekly", value: fmtCur(result.biweekly), icon: <Calendar className="w-4 h-4" />, color: "text-purple-600", highlight: false },
                      { label: "Weekly", value: fmtCur(result.weekly), icon: <DollarSign className="w-4 h-4" />, color: "text-amber-600", highlight: false },
                      { label: "Daily", value: fmtCurD(result.daily), icon: <Briefcase className="w-4 h-4" />, color: "text-cyan-600", highlight: false },
                    ].map((c) => (
                      <div key={c.label} className={`tool-calc-result text-center ${c.highlight ? "ring-2 ring-[hsl(var(--calc-hue),60%,45%)] ring-offset-1" : ""}`}>
                        <div className={`flex justify-center mb-1 ${c.color}`}>{c.icon}</div>
                        <div className={`tool-calc-number text-lg font-bold ${c.color}`}>{c.value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bonus stats */}
                  <div className="bg-muted/30 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Per Minute: </span><span className="font-semibold">{fmtCurD(result.minuteRate)}</span></div>
                    <div><span className="text-muted-foreground">Semi-Monthly: </span><span className="font-semibold">{fmtCur(result.semimonthly)}</span></div>
                    {result.annualOT > 0 && (
                      <div className="col-span-2"><span className="text-muted-foreground">Annual Overtime Pay: </span><span className="font-semibold text-amber-600">{fmtCur(result.annualOT)}</span></div>
                    )}
                  </div>

                  {/* Income bar: weekly breakdown */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Weekly income breakdown</p>
                    <div className="w-full h-3 rounded-full overflow-hidden bg-muted flex">
                      {result.annualOT > 0 && (() => {
                        const regW = (result.weekly - result.annualOT / (parseFloat(weeksPerYear) || 52)) / result.weekly * 100;
                        return (
                          <>
                            <div className="h-full bg-[hsl(var(--calc-hue),60%,45%)]" style={{ width: `${regW}%` }} />
                            <div className="h-full bg-amber-400 flex-1" />
                          </>
                        );
                      })()}
                      {result.annualOT === 0 && <div className="h-full bg-[hsl(var(--calc-hue),60%,45%)] w-full" />}
                    </div>
                    <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--calc-hue),60%,45%)] inline-block" />Regular Pay</span>
                      {result.annualOT > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />Overtime</span>}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter your wage or salary to see the full breakdown.</p>
              </div>
            )}
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Use This Calculator</h2>
            <ol className="space-y-3">
              {[
                ["Choose Direction", "Select 'Hourly → Salary' or 'Salary → Hourly' depending on what you know."],
                ["Enter Your Rate", "Type your hourly wage or annual salary."],
                ["Set Work Schedule", "Adjust hours per week and weeks per year (default: 40 hrs, 52 weeks)."],
                ["Add Overtime", "Optionally enter overtime hours and multiplier (default: 1.5×)."],
                ["View All Rates", "See your wage broken down into every payment period — including per-minute!"],
              ].map(([step, desc], i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--calc-hue),60%,45%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div><span className="font-semibold">{step}: </span><span className="text-muted-foreground">{desc}</span></div>
                </li>
              ))}
            </ol>
            <div className="mt-5 bg-muted/40 rounded-xl p-4 font-mono text-sm">
              <p className="font-semibold mb-1 text-foreground">Core Formulas:</p>
              <code className="text-[hsl(var(--calc-hue),55%,38%)] block mb-1">Annual = Hourly × Hours/Week × Weeks/Year</code>
              <code className="text-[hsl(var(--calc-hue),55%,38%)] block mb-1">Monthly = Annual ÷ 12</code>
              <code className="text-[hsl(var(--calc-hue),55%,38%)] block">Overtime Annual = OT Hours × Rate × Multiplier × Weeks</code>
            </div>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Pay Periods</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Weekly", desc: "One paycheck per week — 52 per year. Common for hourly workers and blue-collar industries.", color: "border-l-blue-500" },
                { title: "Biweekly", desc: "Every two weeks — 26 paychecks per year. Most common in the US. Note: 2 months per year have 3 paydays.", color: "border-l-green-500" },
                { title: "Semi-Monthly", desc: "Twice per month on fixed dates (e.g., 1st and 15th) — 24 paychecks per year. Common for salaried employees.", color: "border-l-amber-500" },
                { title: "Monthly", desc: "One paycheck per month — 12 per year. Common in many countries outside the US, particularly for professional roles.", color: "border-l-purple-500" },
              ].map((c) => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Examples */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Quick Salary Reference Table</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Hourly Rate</th>
                    <th className="px-3 py-2 text-left font-semibold">Weekly (40 hrs)</th>
                    <th className="px-3 py-2 text-left font-semibold">Monthly</th>
                    <th className="px-3 py-2 text-left font-semibold">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["$15", "$600", "$2,600", "$31,200"],
                    ["$20", "$800", "$3,467", "$41,600"],
                    ["$25", "$1,000", "$4,333", "$52,000"],
                    ["$30", "$1,200", "$5,200", "$62,400"],
                    ["$50", "$2,000", "$8,667", "$104,000"],
                    ["$75", "$3,000", "$13,000", "$156,000"],
                    ["$100", "$4,000", "$17,333", "$208,000"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => <td key={i} className="px-3 py-2 font-medium">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mb-3">
              <strong>The $1,000/week threshold</strong> corresponds to roughly $25/hour or $52,000/year — a common benchmark for entry-level professional roles in the US. Knowing your hourly equivalent helps you compare job offers with different structures (hourly vs. salaried, contract vs. full-time).
            </p>
            <p className="text-muted-foreground mb-3">
              <strong>Weeks worked matters more than you'd think.</strong> A contractor working 48 weeks earns 8% less than a full-year employee at the same hourly rate — but often commands a higher rate to compensate for the lack of benefits and paid time off.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Overtime can significantly boost annual income.</strong> At $25/hour with 5 overtime hours per week at 1.5×, annual income jumps from $52,000 to ~$61,750 — nearly a $10,000 difference from just 5 extra hours weekly.
            </p>

            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),60%,45%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "Understanding your true hourly rate — not just what's on the offer letter — is the foundation of every good financial decision."
            </blockquote>
          </div>

          {/* Why Use This Tool */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Use This Wage Calculator?</h2>
            <p className="text-muted-foreground mb-3">
              Job offers, freelance rates, and raises are often presented in different formats — hourly, weekly, annual. This calculator lets you normalize any pay structure into all common formats instantly, making comparisons straightforward.
            </p>
            <p className="text-muted-foreground mb-3">
              Freelancers and contractors often undercharge because they forget to account for unpaid time: administrative work, finding clients, vacation, sick days. Adjusting weeks per year to your actual billable weeks gives a more accurate effective rate.
            </p>
            <p className="text-muted-foreground mb-3">
              For budget planning, knowing your true monthly take-home starts with an accurate gross monthly figure. This calculator provides that number clearly, which you can then apply your tax rate against for net pay estimates.
            </p>
            <p className="text-muted-foreground mb-3">
              HR professionals, hiring managers, and job boards all use annual salary as the standard format. This tool lets hourly workers instantly translate their rate into the format used for job comparisons and salary surveys.
            </p>
            <p className="text-xs text-muted-foreground border border-border rounded-xl p-4 mt-2">
              <Info className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
              <strong>Disclaimer:</strong> This calculator shows gross (pre-tax) figures only. Net take-home depends on federal, state/local taxes, benefits deductions, and other withholdings. Use with a tax calculator for full take-home estimates.
            </p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="How do you convert hourly to annual salary?" a="Multiply your hourly rate by hours per week, then by weeks worked per year. Standard full-time: hourly × 40 × 52 = annual. Example: $25 × 40 × 52 = $52,000 per year." />
              <FaqItem q="What is the standard 40-hour work week assumption?" a="The standard full-time work schedule in the US is 40 hours per week, 52 weeks per year = 2,080 working hours annually. Most salary benchmarks use this assumption. You can adjust for part-time schedules or fewer weeks." />
              <FaqItem q="How is overtime calculated?" a="In the US, the Fair Labor Standards Act (FLSA) requires non-exempt employees to receive at least 1.5× their regular rate for hours over 40 per week. Some jobs and states have different rules. Check your employment contract." />
              <FaqItem q="What's the difference between biweekly and semi-monthly pay?" a="Biweekly means every two weeks (26 paychecks/year, some months have 3). Semi-monthly means twice a month on fixed dates (24 paychecks/year, always 2 per month). The annual total is the same, but monthly amounts differ slightly." />
              <FaqItem q="How do I calculate my effective hourly rate as a salaried employee?" a="Divide your annual salary by total hours worked per year (hours/week × weeks/year). If you work 50 hours/week at a $60,000 salary: $60,000 ÷ (50 × 52) = $23.08/hour effective rate — lower than the 40-hour equivalent of $28.85/hour." />
              <FaqItem q="Should contractors charge more than employees?" a="Yes. As a contractor, you pay both halves of FICA taxes (~15.3%), buy your own benefits, handle your own retirement contributions, and face income gaps between contracts. A common rule of thumb: multiply your employee equivalent rate by 1.5–2× to cover these costs." />
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),60%,45%)] to-[hsl(var(--calc-hue),55%,35%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Plan Your Complete Financial Picture</h2>
            <p className="mb-5 opacity-90">Combine salary calculations with tax, savings, and retirement planning tools.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance/online-tax-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Tax Calculator</Link>
              <Link href="/finance/online-salary-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Salary Calculator</Link>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1 text-sm">
                {["Calculator", "How to Use", "Understanding Results", "Quick Examples", "Why Use This Tool", "FAQ"].map((s) => (
                  <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="block py-1 text-muted-foreground hover:text-foreground transition-colors">{s}</a>
                ))}
              </nav>
            </div>
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["/finance/online-salary-calculator", "Salary Calculator"],
                  ["/finance/online-tax-calculator", "Tax Calculator"],
                  ["/finance/tip-calculator", "Tip Calculator"],
                  ["/finance/savings-goal-calculator", "Savings Goal"],
                  ["/finance/online-retirement-calculator", "Retirement Calculator"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),60%,45%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Free to use, no login", "Includes overtime", "Works on all devices", "No data stored"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
