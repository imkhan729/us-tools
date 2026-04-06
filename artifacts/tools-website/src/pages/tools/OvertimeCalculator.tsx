import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, DollarSign, Calculator, Briefcase
} from "lucide-react";

// ── Calculator Logic ──
function useCalc() {
  const [hourlyRate, setHourlyRate] = useState("20");
  const [regularHours, setRegularHours] = useState("40");
  const [overtimeHours, setOvertimeHours] = useState("5");
  const [multiplier, setMultiplier] = useState("1.5");
  
  const result = useMemo(() => {
    const rate = parseFloat(hourlyRate);
    const regHrs = parseFloat(regularHours);
    const otHrs = parseFloat(overtimeHours);
    const mult = parseFloat(multiplier);
    
    if (isNaN(rate) || isNaN(regHrs) || isNaN(otHrs) || isNaN(mult)) return null;

    const regularPay = rate * regHrs;
    const overtimeRate = rate * mult;
    const overtimePay = overtimeRate * otHrs;
    const totalPay = regularPay + overtimePay;

    return {
      regularPay,
      overtimeRate,
      overtimePay,
      totalPay,
      totalHours: regHrs + otHrs,
    };
  }, [hourlyRate, regularHours, overtimeHours, multiplier]);
  
  return {
    hourlyRate, setHourlyRate,
    regularHours, setRegularHours,
    overtimeHours, setOvertimeHours,
    multiplier, setMultiplier,
    result
  };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  const formatCurrency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  
  let message = `Working ${result.totalHours} total hours generates ${formatCurrency(result.totalPay)} in gross pay. `;
  
  if (result.overtimePay > 0) {
    message += `Your overtime work contributed ${formatCurrency(result.overtimePay)} to this total at an elevated rate of ${formatCurrency(result.overtimeRate)}/hr.`;
  } else {
    message += "You currently have no overtime hours calculated.";
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
  { title: "Work Hours Calculator", slug: "work-hours-calculator", icon: <Clock className="w-5 h-5" />, color: 25, benefit: "Time card tracker" },
  { title: "Hourly to Salary", slug: "hourly-to-salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 140, benefit: "Convert wages into annual salary" },
  { title: "Time Duration", slug: "time-duration-calculator", icon: <Briefcase className="w-5 h-5" />, color: 210, benefit: "Calculate exact time between hours" },
];

export default function OvertimeCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Overtime Pay Calculator – Calculate Regular and Overtime Wages"
        description="Free online overtime calculator. Quickly calculate time-and-a-half or double-time overtime pay, total gross wages, and work hours."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Overtime Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" />
            Time &amp; Pay
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Overtime Pay Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your exact paycheck by factoring in standard hours alongside overtime wages. Instantly handle time-and-a-half, double time, and exact gross pay totals.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Dynamic Pay Model
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
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Wage & Overtime</p>
                      <p className="text-sm text-muted-foreground">Adjust the values below to simulate your paycheck.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="w-full">
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">Regular Hourly Rate ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="tool-calc-input text-lg py-3 pl-9 w-full"
                            value={calc.hourlyRate}
                            onChange={e => calc.setHourlyRate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">Regular Hours Worked</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="tool-calc-input text-lg py-3 w-full"
                          value={calc.regularHours}
                          onChange={e => calc.setRegularHours(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="w-full">
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">Overtime Hours Worked</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="tool-calc-input text-lg py-3 w-full"
                          value={calc.overtimeHours}
                          onChange={e => calc.setOvertimeHours(e.target.value)}
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">Overtime Multiplier</label>
                        <select
                          className="tool-calc-input text-lg py-3 w-full cursor-pointer"
                          value={calc.multiplier}
                          onChange={e => calc.setMultiplier(e.target.value)}
                        >
                          <option value="1.5">1.5× (Time and a Half)</option>
                          <option value="2.0">2.0× (Double Time)</option>
                          <option value="1.0">1.0× (Standard Rate)</option>
                        </select>
                      </div>
                    </div>

                    {calc.result && (
                      <div className="mt-8 space-y-4">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-muted/40 border border-border text-center">
                            <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">Regular Pay</span>
                            <span className="text-2xl font-black text-foreground">
                              ${formatCurrency(calc.result.regularPay)}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">{calc.regularHours} hrs × ${formatCurrency(parseFloat(calc.hourlyRate) || 0)}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-muted/40 border border-border text-center">
                            <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">Overtime Pay</span>
                            <span className="text-2xl font-black text-foreground">
                              ${formatCurrency(calc.result.overtimePay)}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">{calc.overtimeHours} hrs × ${formatCurrency(calc.result.overtimeRate)}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center relative overflow-hidden">
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1 uppercase tracking-widest relative z-10">Total Gross Pay</span>
                            <span className="text-3xl font-black text-orange-600 dark:text-orange-400 relative z-10">
                              ${formatCurrency(calc.result.totalPay)}
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Your Overtime</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most salary and hourly employees need to accurately track double time or time-and-a-half wages. Use this calculator to simulate exactly how much your paycheck will grow as you add hours beyond the standard 40-hour work week.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set Base Metrics</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter the hourly rate you normally earn and the total number of regular hours you spent working (usually defaulting to 40 hours for a typical full-time workload).
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Define Overtime Logic</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Identify how many excess hours you labored beyond your regular threshold. Based on your geographical region and employment laws, ensure the Overtime Multiplier matches your contract (1.5x is statutory in the US for over 40 hours).
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review Total Compensation</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Your gross compensation separates base pay from extra pay so you can easily analyze exactly how much additional financial impact those extra hours had.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Gross vs. Net Pay Context</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Remember that this tool calculates your **Gross Total Pay** (the money earned before taxation, retirement withholdings, and health insurance premiums). Because overtime pay pushes your total paycheck higher, be aware that you may fall into slightly higher progressive tax withholding brackets on those specific paycheck cycles.
                </p>
              </div>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read your overtime pay breakdown.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Regular vs Overtime Pay</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Compare baseline wages with overtime contribution to understand where your gross pay is coming from.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Multiplier Impact</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Switching from 1.5x to 2.0x can materially increase pay for the same overtime hours.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Standard 1.5× Overtime Examples (Based on 40 hrs)</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Base Hourly Rate</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Base Weekly Pay (40h)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">1.5× Overtime Rate</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Gross Pay for 5h OT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">$15.00</td>
                      <td className="px-4 py-3 text-muted-foreground">$600.00</td>
                      <td className="px-4 py-3 font-mono font-medium text-orange-600 dark:text-orange-400">$22.50/hr</td>
                      <td className="px-4 py-3 font-bold text-foreground">$712.50</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">$20.00</td>
                      <td className="px-4 py-3 text-muted-foreground">$800.00</td>
                      <td className="px-4 py-3 font-mono font-medium text-orange-600 dark:text-orange-400">$30.00/hr</td>
                      <td className="px-4 py-3 font-bold text-foreground">$950.00</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">$25.00</td>
                      <td className="px-4 py-3 text-muted-foreground">$1,000.00</td>
                      <td className="px-4 py-3 font-mono font-medium text-orange-600 dark:text-orange-400">$37.50/hr</td>
                      <td className="px-4 py-3 font-bold text-foreground">$1,187.50</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">$35.00</td>
                      <td className="px-4 py-3 text-muted-foreground">$1,400.00</td>
                      <td className="px-4 py-3 font-mono font-medium text-orange-600 dark:text-orange-400">$52.50/hr</td>
                      <td className="px-4 py-3 font-bold text-foreground">$1,662.50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Transparent math.</strong> You can see regular pay, overtime pay, and total gross separately.
                </p>
                <p>
                  <strong className="text-foreground">Built for quick checks.</strong> Adjust hours or multiplier and get immediate feedback with no manual formulas.
                </p>
                <p>
                  <strong className="text-foreground">Useful for planning.</strong> Estimate paycheck impact before accepting extra shifts.
                </p>
              </div>
            </section>
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is 'Time and a Half'?"
                  a="Time and a half refers to a wage rate that is 1.5 times the employee's regular hourly wage. Under the US Fair Labor Standards Act (FLSA), eligible employees must receive at least time and one-half their regular pay rate for any hours worked above 40 in a single workweek."
                />
                <FaqItem
                  q="Does federal law require double time?"
                  a="Federal US law does not explicitly require employers to pay 'double time' (2.0x regular pay). However, specific regions (such as California) have state labor laws that do mandate double time if you exceed a certain amount of hours (like 12 hours) in a single workday."
                />
                <FaqItem
                  q="Should I subtract my lunch break?"
                  a="Yes, typically lunch breaks (if unpaid) should be subtracted out before you calculate your total hours worked. Generally, short breaks of 15 to 20 minutes counts as compensable work hours, whereas bona fide meal breaks spanning upwards of 30 minutes do not."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Want to Evaluate Your Career Pay?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Curious how your hourly wage and regular overtime translates to a full-time salaried paycheck? Our Hourly to Salary calculator runs the metrics for you instantly.
                </p>
                <Link
                  href="/finance/hourly-to-salary-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Convert Hourly to Salary <ArrowRight className="w-4 h-4" />
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
                      href={`/finance/${tool.slug}`}
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
                <p className="text-xs text-muted-foreground mb-3">Help coworkers calculate their overtime.</p>
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
