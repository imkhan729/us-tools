import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  Percent, BarChart3, Landmark, Briefcase, Building2, Wallet,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Calculator Logic ──
type PayPeriod = "hourly" | "daily" | "weekly" | "biweekly" | "monthly" | "annual";

function useSalaryCalc() {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<PayPeriod>("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");

  const result = useMemo(() => {
    const val = parseFloat(amount);
    const hpw = parseFloat(hoursPerWeek) || 40;
    const wpy = parseFloat(weeksPerYear) || 52;
    if (isNaN(val) || val <= 0) return null;

    let annual: number;
    switch (period) {
      case "hourly":
        annual = val * hpw * wpy;
        break;
      case "daily":
        annual = val * (hpw / (hpw > 0 ? hpw / 5 : 5)) * wpy;
        // daily = val, days/week = hpw/8 roughly, but simpler: daily * 5 days * weeks
        annual = val * 5 * wpy;
        break;
      case "weekly":
        annual = val * wpy;
        break;
      case "biweekly":
        annual = val * (wpy / 2);
        break;
      case "monthly":
        annual = val * 12;
        break;
      case "annual":
        annual = val;
        break;
    }

    const hourly = annual / (hpw * wpy);
    const daily = annual / (5 * wpy);
    const weekly = annual / wpy;
    const biweekly = annual / (wpy / 2);
    const monthly = annual / 12;

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      monthly,
      annual,
      hoursPerWeek: hpw,
      weeksPerYear: wpy,
      inputAmount: val,
      inputPeriod: period,
    };
  }, [amount, period, hoursPerWeek, weeksPerYear]);

  return { amount, setAmount, period, setPeriod, hoursPerWeek, setHoursPerWeek, weeksPerYear, setWeeksPerYear, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: ReturnType<typeof useSalaryCalc>["result"] }) {
  if (!result) return null;

  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  const message = `Based on your input of $${fmt(result.inputAmount)} ${result.inputPeriod}, your annual salary is $${fmt(result.annual)}. That breaks down to $${fmt(result.hourly)}/hour, $${fmt(result.daily)}/day, $${fmt(result.weekly)}/week, or $${fmt(result.monthly)}/month — assuming ${result.hoursPerWeek} hours per week over ${result.weeksPerYear} weeks per year.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-green-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-green-500">
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
  { title: "Tip Calculator", slug: "tip-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25, benefit: "Split bills and calculate tips fast" },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <Percent className="w-5 h-5" />, color: 265, benefit: "See final price after any % off" },
  { title: "ROI Calculator", slug: "online-roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152, benefit: "Measure return on any investment" },
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", icon: <Landmark className="w-5 h-5" />, color: 217, benefit: "See how interest compounds over time" },
  { title: "Mortgage Calculator", slug: "mortgage-calculator", icon: <Building2 className="w-5 h-5" />, color: 340, benefit: "Find monthly mortgage payments" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45, benefit: "Find any percentage instantly" },
];

// ── Main Component ──
export default function SalaryCalculator() {
  const calc = useSalaryCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number | null) => {
    if (n === null) return "--";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  return (
    <Layout>
      <SEO
        title="Salary Calculator - Free Hourly to Annual Pay Converter | Wage Calculator"
        description="Free online salary calculator. Convert hourly to annual salary, weekly to monthly pay, and more. Instant results for any pay period — no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">Salary Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Salary Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert your pay between hourly, daily, weekly, biweekly, monthly, and annual equivalents. Enter any wage and instantly see what you earn across every pay period — free, instant, and no signup needed.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-full border border-green-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Clock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Finance &amp; Cost &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Salary Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Pay Amount ($)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      className="tool-calc-input w-full"
                      value={calc.amount}
                      onChange={e => calc.setAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Pay Period</label>
                    <select
                      className="tool-calc-input w-full"
                      value={calc.period}
                      onChange={e => calc.setPeriod(e.target.value as PayPeriod)}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly (every 2 weeks)</option>
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Hours per Week</label>
                    <input
                      type="number"
                      placeholder="40"
                      className="tool-calc-input w-full"
                      value={calc.hoursPerWeek}
                      onChange={e => calc.setHoursPerWeek(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Weeks per Year</label>
                    <input
                      type="number"
                      placeholder="52"
                      className="tool-calc-input w-full"
                      value={calc.weeksPerYear}
                      onChange={e => calc.setWeeksPerYear(e.target.value)}
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Hourly</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ${calc.result ? fmt(calc.result.hourly) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Daily</div>
                    <div className="text-lg font-black text-teal-600 dark:text-teal-400">
                      ${calc.result ? fmt(calc.result.daily) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Weekly</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ${calc.result ? fmt(calc.result.weekly) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Biweekly</div>
                    <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                      ${calc.result ? fmt(calc.result.biweekly) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Monthly</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      ${calc.result ? fmt(calc.result.monthly) : "--"}
                    </div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Annual</div>
                    <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                      ${calc.result ? fmt(calc.result.annual) : "--"}
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
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Enter Your Pay</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Type your current wage or salary and select the pay period it corresponds to — hourly, daily, weekly, biweekly, monthly, or annual.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Adjust Work Schedule</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Customize your hours per week (default 40) and weeks per year (default 52) to match your actual work schedule for accurate conversions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">View All Equivalents</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Instantly see your pay converted to every period: hourly, daily, weekly, biweekly, monthly, and annual. Results update in real-time as you type.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Hourly to Annual</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Earning $25/hour at 40 hours per week for 52 weeks gives you an annual salary of <strong className="text-foreground">$52,000</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Annual to Hourly</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A $75,000 annual salary breaks down to <strong className="text-foreground">$36.06/hour</strong> based on a standard 40-hour work week over 52 weeks.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Monthly to Annual</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">A monthly paycheck of $4,500 equals an annual salary of <strong className="text-foreground">$54,000</strong> and roughly <strong className="text-foreground">$25.96/hour</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Part-Time Worker</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Working 20 hours per week at $18/hour for 50 weeks yields an annual income of <strong className="text-foreground">$18,000</strong>, or <strong className="text-foreground">$1,500/month</strong>.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant salary conversions as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate to 2 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Supports 6 pay periods including daily" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-green-500">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Salary Conversion</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  A salary calculator is an essential tool for anyone who needs to convert their pay between different time periods. Whether you are comparing a job offer that lists an annual salary to your current hourly wage, or trying to understand what your biweekly paycheck translates to monthly, this free wage calculator gives you the answer instantly.
                </p>
                <p>
                  The conversion relies on two key assumptions: your hours worked per week and the number of weeks you work per year. A standard full-time schedule is 40 hours per week for 52 weeks, totaling 2,080 working hours per year. By adjusting these values, you can accurately calculate pay for part-time positions, contract roles, or jobs with unpaid time off.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">How Is Hourly Pay Converted to Annual Salary?</h3>
                <p>
                  The formula is straightforward: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Annual Salary = Hourly Rate x Hours per Week x Weeks per Year</code>. For example, an hourly rate of $30 at 40 hours per week for 52 weeks equals $62,400 per year. To go the other direction, divide the annual salary by total working hours: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Hourly Rate = Annual Salary / (Hours per Week x Weeks per Year)</code>.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use a Salary Calculator?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Comparing job offers listed in different pay periods (hourly vs. annual)",
                    "Budgeting your monthly expenses against your biweekly paycheck",
                    "Negotiating a raise and understanding the hourly impact of a salary increase",
                    "Evaluating freelance or contract rates against full-time equivalents",
                    "Calculating part-time earnings with custom hours per week",
                    "Understanding your daily rate for consulting or project-based work",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
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
                  q="How do I convert my hourly wage to an annual salary?"
                  a="Multiply your hourly rate by the number of hours you work per week, then multiply by the number of weeks you work per year. For example, $20/hour x 40 hours x 52 weeks = $41,600 per year."
                />
                <FaqItem
                  q="What is the standard number of work hours in a year?"
                  a="A standard full-time schedule is 2,080 hours per year (40 hours per week x 52 weeks). However, if you take unpaid time off, you can adjust the weeks per year accordingly. For example, 50 weeks gives 2,000 hours."
                />
                <FaqItem
                  q="How do I calculate my biweekly paycheck from an annual salary?"
                  a="Divide your annual salary by the number of pay periods. With 52 weeks per year, there are 26 biweekly pay periods. So for a $60,000 salary: $60,000 / 26 = $2,307.69 per biweekly paycheck."
                />
                <FaqItem
                  q="Does this calculator account for taxes?"
                  a="No, this calculator shows gross pay conversions before taxes and deductions. Your take-home pay will be lower after federal, state, and local taxes, Social Security, Medicare, and any other deductions."
                />
                <FaqItem
                  q="Can I use this for part-time or freelance work?"
                  a="Absolutely. Adjust the hours per week and weeks per year to match your actual schedule. For example, if you work 25 hours per week for 48 weeks, enter those values for an accurate conversion."
                />
                <FaqItem
                  q="Is this salary calculator free to use?"
                  a="100% free with no ads, no signup, and no data collection. It runs entirely in your browser — your financial information never leaves your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Financial Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including compound interest calculators, tip calculators, ROI tools, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others convert their salary easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-green-500/40 flex-shrink-0" />{label}
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
