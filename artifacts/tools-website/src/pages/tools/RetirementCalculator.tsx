import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, TrendingUp, DollarSign, Calculator,
  Zap, CheckCircle2, Shield, Clock, BarChart3, Lightbulb,
  BadgeCheck, Star,
} from "lucide-react";

function useRetirementCalc() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [desiredIncome, setDesiredIncome] = useState("");

  const result = useMemo(() => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) || 0;
    const income = parseFloat(desiredIncome) || 0;

    if (isNaN(age) || isNaN(retAge) || retAge <= age) return null;

    const yearsToRetire = retAge - age;
    const n = yearsToRetire * 12;
    const r = rate / 100 / 12;

    const fvSavings = savings * Math.pow(1 + r, n);
    const fvContributions = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
    const totalAtRetirement = fvSavings + fvContributions;

    // Safe withdrawal rate (4% rule)
    const safeAnnualWithdrawal = totalAtRetirement * 0.04;
    const safeMonthlyWithdrawal = safeAnnualWithdrawal / 12;

    // How many years nest egg lasts (if spending desired income)
    let yearsLasts = 0;
    if (income > 0 && totalAtRetirement > 0) {
      const monthlyIncome = income / 12;
      const rPost = 0.05 / 12; // assume 5% in retirement
      if (monthlyIncome > totalAtRetirement * rPost) {
        yearsLasts = Math.log(monthlyIncome / (monthlyIncome - totalAtRetirement * rPost)) / Math.log(1 + rPost);
      } else {
        yearsLasts = 999; // indefinite
      }
    }

    const shortfall = income > 0 ? Math.max(0, income - safeAnnualWithdrawal) : 0;

    return { totalAtRetirement, fvSavings, fvContributions, safeAnnualWithdrawal, safeMonthlyWithdrawal, yearsToRetire, yearsLasts: Math.min(yearsLasts, 999), shortfall };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, desiredIncome]);

  return { currentAge, setCurrentAge, retirementAge, setRetirementAge, currentSavings, setCurrentSavings, monthlyContribution, setMonthlyContribution, annualReturn, setAnnualReturn, desiredIncome, setDesiredIncome, result };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors">
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RetirementCalculator() {
  const { currentAge, setCurrentAge, retirementAge, setRetirementAge, currentSavings, setCurrentSavings, monthlyContribution, setMonthlyContribution, annualReturn, setAnnualReturn, desiredIncome, setDesiredIncome, result } = useRetirementCalc();
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtD = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Retirement Calculator — How Much Do You Need to Retire?"
        description="Calculate your retirement nest egg, safe withdrawal amount, and whether you're on track to retire. Free online retirement savings calculator — no signup required."
      />
      <div style={{ "--calc-hue": "260" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Retirement Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">Retirement Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Find out how much you'll have at retirement and whether it's enough to support your desired lifestyle. See your projected nest egg, safe withdrawal rate, and income gap instantly.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "4% Rule", "Nest Egg + Income Gap"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">

            <div className="tool-calc-card rounded-2xl p-6">
              <div className="h-1.5 w-full rounded-full mb-6 overflow-hidden bg-muted">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: result ? "100%" : "0%", background: "linear-gradient(90deg, hsl(260,70%,55%), hsl(300,70%,55%))" }} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Current Age", val: currentAge, set: setCurrentAge, ph: "e.g. 30" },
                  { label: "Retirement Age", val: retirementAge, set: setRetirementAge, ph: "e.g. 65" },
                  { label: "Current Savings ($)", val: currentSavings, set: setCurrentSavings, ph: "e.g. 25000" },
                  { label: "Monthly Contribution ($)", val: monthlyContribution, set: setMonthlyContribution, ph: "e.g. 500" },
                  { label: "Annual Return (%)", val: annualReturn, set: setAnnualReturn, ph: "e.g. 7" },
                  { label: "Desired Annual Income ($)", val: desiredIncome, set: setDesiredIncome, ph: "e.g. 60000" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{f.label}</label>
                    <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                      className="tool-calc-input w-full px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-lg font-mono focus:outline-none" />
                  </div>
                ))}
              </div>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Nest Egg at Retirement", value: fmt(result.totalAtRetirement) },
                      { label: "Safe Monthly Income", value: fmtD(result.safeMonthlyWithdrawal) },
                      { label: "Years to Retire", value: `${result.yearsToRetire} yrs` },
                      { label: result.shortfall > 0 ? "Annual Shortfall" : "Income Surplus", value: result.shortfall > 0 ? fmt(result.shortfall) : "On Track ✓" },
                    ].map((item) => (
                      <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className={`tool-calc-number text-xl font-black ${item.label.includes("Shortfall") ? "text-red-500" : ""}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Nest Egg Breakdown</p>
                    <div className="space-y-2">
                      {[
                        { label: "Growth from existing savings", value: result.fvSavings, color: "bg-purple-500" },
                        { label: "Growth from new contributions", value: result.fvContributions, color: "bg-blue-400" },
                      ].map((row) => {
                        const pct = result.totalAtRetirement > 0 ? (row.value / result.totalAtRetirement) * 100 : 0;
                        return (
                          <div key={row.label}>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{row.label}</span><span className="font-medium">{fmt(row.value)} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className={`h-full ${row.color}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {result.shortfall > 0
                          ? `At your desired income, you have an estimated ${fmt(result.shortfall)}/year shortfall. Consider increasing monthly contributions or adjusting your retirement age.`
                          : `You're on track. Your nest egg of ${fmt(result.totalAtRetirement)} supports ${fmtD(result.safeMonthlyWithdrawal)}/month using the 4% safe withdrawal rule.`}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Retirement Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Enter Your Ages", desc: "Input your current age and the age you plan to retire. The gap between these determines how long compound interest works for you." },
                  { step: "2", title: "Enter Current Savings", desc: "Include all retirement-earmarked savings: 401(k), IRA, Roth IRA, brokerage accounts. Use today's balance." },
                  { step: "3", title: "Enter Monthly Contribution", desc: "What you add each month across all retirement accounts, including any employer match." },
                  { step: "4", title: "Set Return Rate and Income Goal", desc: "Use 6–8% for a diversified stock/bond portfolio. Enter your desired annual income in today's dollars — the tool shows if your nest egg can support it." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</h3>
                <div className="space-y-3">
                  {[
                    { expr: "FV of Savings = PV × (1 + r)ⁿ", desc: "Future value of your current nest egg growing at monthly rate r over n months." },
                    { expr: "FV of Contributions = PMT × [(1+r)ⁿ − 1] / r", desc: "Future value of recurring monthly contributions using the annuity formula." },
                    { expr: "Total Nest Egg = FV of Savings + FV of Contributions", desc: "Combined projected value of all retirement funds at your target retirement age." },
                    { expr: "Safe Annual Withdrawal = Nest Egg × 4% (4% Rule)", desc: "The widely accepted safe withdrawal rate — the amount you can withdraw annually without running out of money over a 30-year retirement." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <div>
                        <code className="px-2 py-1.5 bg-background rounded text-xs font-mono inline-block mb-1 break-all">{item.expr}</code>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="understanding-results" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Your Retirement Numbers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">The 4% rule is your retirement's most important benchmark. It states that withdrawing 4% of your nest egg annually gives a 95%+ probability of not running out of money over 30 years.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "On Track (Surplus)", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Your nest egg supports your desired income. Consider retiring earlier, increasing spending, or leaving a legacy." },
                  { label: "Small Shortfall", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Minor gap. Small increases in monthly contributions or retiring 1–2 years later can close it completely." },
                  { label: "Significant Shortfall", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "Requires action. Increase contributions, reduce desired income, push back retirement, or add income streams." },
                  { label: "Critical Gap", color: "text-red-600 bg-red-500/10 border-red-500/20", desc: "Major strategy change needed. Review spending, maximize 401k/IRA contributions, and consider professional financial advice." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Retirement Savings Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Profile</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Monthly</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Years</th>
                      <th className="text-right py-2 font-bold text-foreground">Nest Egg</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { profile: "Early starter (25→65, $200/mo)", monthly: "$200", years: "40", nest: "$528,000" },
                      { profile: "Average saver (35→65, $500/mo)", monthly: "$500", years: "30", nest: "$567,000" },
                      { profile: "Late starter (45→65, $1,000/mo)", monthly: "$1,000", years: "20", nest: "$520,000" },
                      { profile: "Aggressive saver (35→65, $1,500/mo)", monthly: "$1,500", years: "30", nest: "$1,700,000" },
                      { profile: "FIRE target (30→50, $3,000/mo)", monthly: "$3,000", years: "20", nest: "$1,558,000" },
                    ].map((row) => (
                      <tr key={row.profile} className="border-b border-border/50">
                        <td className="py-2.5 pr-3 text-xs">{row.profile}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.monthly}</td>
                        <td className="py-2.5 pr-3 text-right">{row.years}</td>
                        <td className="py-2.5 text-right font-bold text-purple-500">{row.nest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Starting early is the most powerful retirement move.</strong> Contributing $200/month from age 25 at 7% average returns produces a larger nest egg than contributing $500/month starting at 35 — despite investing less total money. This is the power of compound interest over time.</p>
                <p><strong className="text-foreground">The FIRE movement</strong> (Financial Independence, Retire Early) typically targets 25× annual expenses as the nest egg — enough to support a 4% withdrawal rate indefinitely. A $3,000/month saver over 20 years at 7% can approach this target by age 50.</p>
                <p><strong className="text-foreground">Late starters</strong> have fewer years to compound but can compensate with higher contributions, catch-up IRA/401(k) contributions (available after age 50), delayed Social Security (increases benefit by 8% per year up to age 70), and part-time work in early retirement.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic">"I'd been putting off thinking about retirement. Running this took 2 minutes and showed me exactly what I needed to change. Increased my 401k contribution the next day."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— 38-year-old teacher</p>
              </div>
            </section>

            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Retirement Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Retirement planning is often postponed because the numbers feel abstract and distant. This calculator makes it immediate — enter your situation today and see projected outcomes in seconds, with clear visual breakdowns of how your money will grow.</p>
                <p>The tool separately shows growth from <strong className="text-foreground">existing savings</strong> and from <strong className="text-foreground">future contributions</strong> — so you can see how much of your final nest egg comes from what you already have versus what you'll add going forward. For most people, the compound growth of existing savings is surprisingly large.</p>
                <p>The <strong className="text-foreground">4% safe withdrawal rate</strong> is built in as the benchmark for retirement income sufficiency. By comparing your projected nest egg's safe withdrawal to your desired income, you get an immediate signal: are you on track, or do you need to act?</p>
                <p>The income shortfall metric is particularly actionable. If you see a $15,000/year gap, you know exactly what to close — whether through higher contributions, a later retirement age, or lower income targets.</p>
                <p>Combine with the <Link href="/finance/savings-goal-calculator" className="text-purple-500 hover:underline">Savings Goal Calculator</Link> for targeted milestones, or the <Link href="/finance/online-compound-interest-calculator" className="text-purple-500 hover:underline">Compound Interest Calculator</Link> to model specific return scenarios.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Disclaimer:</strong> This calculator provides estimates only. Actual results depend on investment returns, inflation, taxes, Social Security, and personal circumstances. Consult a certified financial planner for personalized retirement advice.
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="What is the 4% rule?" a="The 4% rule, based on the Trinity Study, states that retirees can safely withdraw 4% of their initial portfolio annually (adjusted for inflation) with a very high probability of not running out of money over a 30-year retirement. So a $1,000,000 nest egg supports $40,000/year. Some financial planners now suggest 3.5% for longer retirements." />
                <FaqItem q="What return rate should I use?" a="For a diversified stock/bond portfolio, 6–7% is a conservative long-term average after inflation. For a 100% stock portfolio, 7–8% is historically reasonable. For a conservative mix (more bonds), use 4–5%. For cash savings only, use current HYSA rates. The specific allocation and glide path significantly impact outcomes." />
                <FaqItem q="Should I include Social Security in my calculation?" a="This calculator doesn't model Social Security. In practice, Social Security income reduces how much your nest egg needs to produce. Visit the SSA website to estimate your benefit, then subtract it from your desired income before entering the shortfall analysis. For example, if you want $60,000/year but expect $20,000 in Social Security, your nest egg only needs to cover $40,000." />
                <FaqItem q="What if I start saving late?" a="Late starters have powerful tools: 401(k) catch-up contributions ($7,500 extra per year after age 50), IRA catch-up ($1,000 extra), delaying Social Security (increases by ~8%/year until 70), working part-time early in retirement, and reducing spending targets. Focus on maximizing contributions rather than dwelling on lost time." />
                <FaqItem q="How much do I need to retire?" a="A common rule of thumb is 25× your desired annual expenses (based on the 4% rule). If you want to spend $50,000/year, you need $1.25M. Another benchmark: replace 70–80% of pre-retirement income. The right number depends on your health, lifestyle, debt status, Social Security benefits, and other income sources." />
                <FaqItem q="What is the difference between a 401(k) and an IRA?" a="A 401(k) is employer-sponsored, has higher contribution limits ($23,000/year in 2024, plus $7,500 catch-up), and often includes employer matching. An IRA is individually opened, with lower limits ($7,000/year in 2024, plus $1,000 catch-up). Both offer traditional (pre-tax) and Roth (after-tax) versions. Most financial advisors recommend maxing out employer 401(k) match first, then IRA, then additional 401(k)." />
              </div>
            </section>

            <section className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">Plan Your Financial Future</h2>
              <p className="text-muted-foreground text-sm mb-4">Savings goals, investment growth, net worth — all free, no account required.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[{ href: "#how-to-use", label: "How to Use" }, { href: "#understanding-results", label: "Understanding Results" }, { href: "#examples", label: "Examples" }, { href: "#why-this-tool", label: "Why This Tool" }, { href: "#faq", label: "FAQ" }].map((item) => (
                  <a key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />{item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1">
                {[
                  { href: "/finance/savings-goal-calculator", label: "Savings Goal Calculator", icon: TrendingUp },
                  { href: "/finance/online-compound-interest-calculator", label: "Compound Interest", icon: BarChart3 },
                  { href: "/finance/net-worth-calculator", label: "Net Worth Calculator", icon: DollarSign },
                  { href: "/finance/online-investment-growth-calculator", label: "Investment Growth", icon: TrendingUp },
                  { href: "/finance/savings-calculator", label: "Savings Calculator", icon: Calculator },
                  { href: "/finance/online-inflation-calculator", label: "Inflation Calculator", icon: Clock },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-purple-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[{ icon: Shield, text: "No data stored" }, { icon: Zap, text: "Instant projection" }, { icon: BadgeCheck, text: "4% rule built-in" }, { icon: Clock, text: "Any retirement age" }].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-purple-500" />{item.text}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
