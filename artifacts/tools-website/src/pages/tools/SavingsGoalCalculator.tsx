import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Target, TrendingUp, DollarSign,
  Zap, CheckCircle2, Shield, Clock, Calculator, Lightbulb,
  BadgeCheck, Star,
} from "lucide-react";

function useSavingsGoalCalc() {
  const [goalAmount, setGoalAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const goal = parseFloat(goalAmount);
    const current = parseFloat(currentSavings) || 0;
    const r = parseFloat(annualRate) || 0;
    const t = parseFloat(years);
    if (isNaN(goal) || isNaN(t) || goal <= 0 || t <= 0) return null;

    const n = t * 12;
    const monthlyRate = r / 100 / 12;

    // FV of current savings
    const fvCurrent = current * Math.pow(1 + monthlyRate, n);
    const remaining = goal - fvCurrent;

    let monthlyContribution: number;
    if (monthlyRate === 0) {
      monthlyContribution = remaining / n;
    } else {
      monthlyContribution = remaining / ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
    }

    if (monthlyContribution < 0) {
      // Current savings already exceed goal with interest
      return { alreadyMet: true, fvCurrent, goal, monthlyContribution: 0, totalContributions: 0, interestEarned: 0, progress: 100 };
    }

    const totalContributions = monthlyContribution * n;
    const totalAdded = totalContributions + current;
    const interestEarned = goal - totalAdded;
    const progress = Math.min((current / goal) * 100, 100);

    return { alreadyMet: false, monthlyContribution, totalContributions, interestEarned, progress, fvCurrent, goal };
  }, [goalAmount, currentSavings, annualRate, years]);

  return { goalAmount, setGoalAmount, currentSavings, setCurrentSavings, annualRate, setAnnualRate, years, setYears, result };
}

function ResultInsight({ result, years }: { result: NonNullable<ReturnType<typeof useSavingsGoalCalc>["result"]>; years: string }) {
  if (result.alreadyMet) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
        <div className="flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            Great news — your current savings will grow to meet your goal through interest alone. No additional monthly contributions needed!
          </p>
        </div>
      </motion.div>
    );
  }

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const daily = result.monthlyContribution / 30;
  const msg = daily < 5 ? `That's just ${fmt(daily)}/day — less than a coffee.`
    : daily < 20 ? `That's about ${fmt(daily)}/day — a small daily habit can get you there.`
    : `That's ${fmt(daily)}/day — plan carefully to fit this into your budget.`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Save {fmt(result.monthlyContribution)}/month to reach your {fmt(result.goal)} goal in {" "}
          {parseFloat(years) || 0} years. {msg}
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors">
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SavingsGoalCalculator() {
  const { goalAmount, setGoalAmount, currentSavings, setCurrentSavings, annualRate, setAnnualRate, years, setYears, result } = useSavingsGoalCalc();
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtC = (n: number) => "$" + fmt(n);

  const hasResult = !!result;

  return (
    <Layout>
      <SEO
        title="Savings Goal Calculator — How Much to Save Each Month to Reach Your Goal"
        description="Find out exactly how much you need to save each month to reach any financial goal. Free Savings Goal Calculator with interest — works for emergency funds, vacations, down payments, and retirement."
      />
      <div style={{ "--calc-hue": "145" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Savings Goal Calculator</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
            Savings Goal Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Set your target, enter your timeline and interest rate, and discover exactly how much to save each month to reach any financial goal — from an emergency fund to a house deposit.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "Accounts for Interest", "Works on Mobile"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">

            {/* Calculator */}
            <div className="tool-calc-card rounded-2xl p-6">
              <div className="h-1.5 w-full rounded-full mb-6 overflow-hidden bg-muted">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: hasResult ? "100%" : "0%", background: "linear-gradient(90deg, hsl(145,60%,45%), hsl(170,60%,45%))" }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Savings Goal ($)", val: goalAmount, set: setGoalAmount, ph: "e.g. 20000" },
                  { label: "Current Savings ($)", val: currentSavings, set: setCurrentSavings, ph: "e.g. 2000" },
                  { label: "Annual Interest Rate (%)", val: annualRate, set: setAnnualRate, ph: "e.g. 4.5" },
                  { label: "Time to Goal (Years)", val: years, set: setYears, ph: "e.g. 3" },
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
                  {result.alreadyMet ? (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                      <p className="text-green-600 font-bold text-lg">Your current savings will reach the goal with interest alone!</p>
                      <p className="text-sm text-muted-foreground mt-1">Projected value: {fmtC(result.fvCurrent)}</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Monthly Savings", value: fmtC(result.monthlyContribution) },
                          { label: "Total Contributions", value: fmtC(result.totalContributions) },
                          { label: "Interest Earned", value: fmtC(Math.max(0, result.interestEarned)) },
                          { label: "Current Progress", value: `${result.progress.toFixed(1)}%` },
                        ].map((item) => (
                          <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                            <p className="tool-calc-number text-xl font-black">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      {/* Progress bar */}
                      <div className="p-4 rounded-xl bg-muted/40 border border-border">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Current Progress</span>
                          <span>{result.progress.toFixed(1)}% of goal</span>
                        </div>
                        <div className="h-3 rounded-full bg-muted overflow-hidden">
                          <motion.div className="h-full rounded-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${result.progress}%` }} transition={{ duration: 0.8 }} />
                        </div>
                      </div>
                    </>
                  )}
                  <ResultInsight result={result} years={years} />
                </motion.div>
              )}
            </div>

            {/* How to Use */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Savings Goal Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Enter Your Goal Amount", desc: "Input the total amount you want to save — e.g. $10,000 for an emergency fund, $50,000 for a house down payment, or $500,000 for retirement." },
                  { step: "2", title: "Add Current Savings", desc: "If you already have some savings towards this goal, enter that amount. The calculator accounts for interest growth on existing funds." },
                  { step: "3", title: "Set the Interest Rate", desc: "Enter the expected annual return on your savings account, HYSA, or investment. Leave at 0% for a pure savings scenario." },
                  { step: "4", title: "Enter Your Timeline", desc: "How many years do you have to reach the goal? The calculator will tell you the exact monthly contribution needed." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
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
                    { expr: "FV of Current Savings = PV × (1 + r)ⁿ", desc: "How much your existing savings will grow. PV = current savings, r = monthly rate, n = total months." },
                    { expr: "Remaining = Goal − FV of Current Savings", desc: "The gap that must be covered by new monthly contributions." },
                    { expr: "Monthly Contribution = Remaining × r / [(1+r)ⁿ − 1]", desc: "The PMT formula — how much to deposit each month to fill the remaining gap with compound growth." },
                    { expr: "Interest Earned = Goal − (Total Contributions + Current Savings)", desc: "How much free money compound interest adds to your savings over the timeline." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <div>
                        <code className="px-2 py-1.5 bg-background rounded text-xs font-mono inline-block mb-1 break-all">{item.expr}</code>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Understanding Results */}
            <section id="understanding-results" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Your Savings Plan</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The monthly savings figure is the key output — but the interest earned is what makes a longer timeline with compound interest so powerful. Even a modest rate can significantly reduce what you need to contribute.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "High Interest Earned", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Interest covers a large share of your goal — compound growth is doing heavy lifting. Ideal outcome." },
                  { label: "Low Interest Earned", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Most of your goal comes from contributions. Consider a higher-yield account or longer timeline." },
                  { label: "Goal Already Within Reach", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", desc: "Current savings plus interest will hit the goal automatically. Stay the course with existing funds." },
                  { label: "High Monthly Requirement", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "Monthly savings needed may be high. Try extending the timeline or increasing the interest rate to reduce this." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Savings Goal Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Goal</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Target</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Rate</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Timeline</th>
                      <th className="text-right py-2 font-bold text-foreground">Monthly Needed</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { goal: "Emergency Fund", target: "$10,000", rate: "4.5%", time: "2 years", monthly: "$379" },
                      { goal: "Vacation Fund", target: "$5,000", rate: "2%", time: "1 year", monthly: "$411" },
                      { goal: "House Down Payment", target: "$60,000", rate: "5%", time: "5 years", monthly: "$878" },
                      { goal: "New Car", target: "$25,000", rate: "3%", time: "4 years", monthly: "$490" },
                      { goal: "College Fund", target: "$100,000", rate: "6%", time: "18 years", monthly: "$267" },
                    ].map((row) => (
                      <tr key={row.goal} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.goal}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.target}</td>
                        <td className="py-2.5 pr-3 text-right">{row.rate}</td>
                        <td className="py-2.5 pr-3 text-right">{row.time}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-500">{row.monthly}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Emergency funds</strong> are the most recommended starting point for financial planning. A $10,000 target saved over 2 years in a high-yield account at 4.5% requires roughly $379/month — that's about $12.60 per day. The psychological security of having 3–6 months of expenses saved is immeasurable.</p>
                <p><strong className="text-foreground">House down payments</strong> are often the largest savings challenge for first-time buyers. Saving $60,000 in 5 years at 5% interest requires $878/month — but if you already have $10,000 saved, that drops to around $704/month. Starting early makes an enormous difference.</p>
                <p><strong className="text-foreground">College funds</strong> illustrate the magic of compound interest over long timelines. Saving $267/month from birth at 6% annual return will grow to $100,000 by age 18 — with over $42,000 of that being interest earned, not contributions.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"I used this to plan for our wedding. Knowing we needed exactly $534/month to save $15,000 in 2 years made it feel achievable rather than overwhelming."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— Engaged couple saving for their wedding</p>
              </div>
            </section>

            {/* Why */}
            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Savings Goal Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Most people know they should save but struggle to translate vague intentions into concrete monthly actions. This calculator bridges that gap — it converts any financial goal into a specific, actionable monthly number you can automate immediately.</p>
                <p>The key difference between this and a basic savings calculator is that it accounts for <strong className="text-foreground">both existing savings and future contributions</strong> with compound interest. Your current balance isn't just a starting number — it grows alongside your new contributions, reducing how much you need to add each month.</p>
                <p>By showing <strong className="text-foreground">interest earned separately</strong>, the calculator makes compound growth tangible. For long-term goals, this can be thousands of dollars — money you receive without contributing anything extra. Understanding this is motivating and helps people choose higher-yield accounts.</p>
                <p>Use it for every new financial target: emergency fund, vacation, car, home, education, or retirement. Each goal has its own timeline and urgency — the calculator handles each scenario the same way, giving you the number you need to set up an automatic transfer today.</p>
                <p>Combine with the <Link href="/finance/online-compound-interest-calculator" className="text-emerald-500 hover:underline">Compound Interest Calculator</Link> to model different return rates, or the <Link href="/finance/savings-calculator" className="text-emerald-500 hover:underline">Savings Calculator</Link> to see your final balance given a fixed monthly deposit.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Disclaimer:</strong> Interest rates are not guaranteed. Savings account rates fluctuate with central bank policy. Investment returns may vary significantly. This calculator is for planning purposes only.
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="What interest rate should I use for a savings account?" a="For a standard savings account, use the current APY (Annual Percentage Yield) — typically 0.5–2%. For high-yield savings accounts (HYSAs), many currently offer 4–5% APY. For stock market investments over long periods, a historical average of 6–8% is commonly used, though past performance doesn't guarantee future returns." />
                <FaqItem q="What if I can't afford the monthly savings amount?" a="Try three adjustments: (1) extend the timeline — adding even 6 months can meaningfully reduce the monthly requirement, (2) find a higher-yield savings vehicle to let interest do more work, (3) break the goal into sub-goals and automate partial savings to build the habit while planning for the rest." />
                <FaqItem q="Should I include existing savings in the calculator?" a="Yes — always. Your current savings compound over the entire timeline, which reduces how much you need to contribute each month. Even a small existing balance (e.g., $500) in a long timeline can save you thousands in contributions over many years." />
                <FaqItem q="How is this different from a compound interest calculator?" a="A compound interest calculator shows you the future value of a given monthly deposit. This calculator works backwards — you tell it the future value you want and the timeline, and it calculates the monthly deposit you need. Both tools are complementary." />
                <FaqItem q="What's the best savings vehicle for a goal?" a="It depends on your timeline and goal type: for goals under 2 years, use HYSAs or money market accounts for liquidity. For 2–5 year goals, consider CDs or low-risk bonds. For goals over 10 years (like retirement or college), diversified index funds offer better long-term growth potential despite short-term volatility." />
                <FaqItem q="Can I use this for retirement savings planning?" a="Yes, but for retirement specifically, consider using a dedicated retirement calculator that accounts for tax-advantaged accounts (401k, IRA), employer matching, required minimum distributions, and inflation-adjusted withdrawals. This calculator handles the core math but doesn't model those additional factors." />
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">Plan Every Financial Goal</h2>
              <p className="text-muted-foreground text-sm mb-4">Explore savings, investment, and budget tools — all free, no account needed.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[
                  { href: "#how-to-use", label: "How to Use" },
                  { href: "#understanding-results", label: "Understanding Results" },
                  { href: "#examples", label: "Examples" },
                  { href: "#why-this-tool", label: "Why This Tool" },
                  { href: "#faq", label: "FAQ" },
                ].map((item) => (
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
                  { href: "/finance/savings-calculator", label: "Savings Calculator", icon: DollarSign },
                  { href: "/finance/online-compound-interest-calculator", label: "Compound Interest", icon: TrendingUp },
                  { href: "/finance/online-investment-growth-calculator", label: "Investment Growth", icon: TrendingUp },
                  { href: "/finance/online-budget-calculator", label: "Budget Calculator", icon: Calculator },
                  { href: "/finance/payback-period-calculator", label: "Payback Period", icon: Clock },
                  { href: "/finance/online-simple-interest-calculator", label: "Simple Interest", icon: Target },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-emerald-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[
                  { icon: Shield, text: "No data stored" },
                  { icon: Zap, text: "Instant calculation" },
                  { icon: BadgeCheck, text: "Compound interest formula" },
                  { icon: Clock, text: "Any timeline" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-emerald-500" />{item.text}
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
