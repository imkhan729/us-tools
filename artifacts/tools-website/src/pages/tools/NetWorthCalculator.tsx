import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, TrendingUp, DollarSign, Calculator,
  Zap, CheckCircle2, Shield, Clock, BarChart3, Lightbulb,
  BadgeCheck, Star, Plus, Trash2,
} from "lucide-react";

interface LineItem { id: number; label: string; amount: string; }

const defaultAssets: LineItem[] = [
  { id: 1, label: "Cash & Savings", amount: "" },
  { id: 2, label: "Investments / Stocks", amount: "" },
  { id: 3, label: "Retirement Accounts", amount: "" },
  { id: 4, label: "Home / Real Estate", amount: "" },
  { id: 5, label: "Vehicles", amount: "" },
];

const defaultLiabilities: LineItem[] = [
  { id: 1, label: "Mortgage Balance", amount: "" },
  { id: 2, label: "Car Loans", amount: "" },
  { id: 3, label: "Student Loans", amount: "" },
  { id: 4, label: "Credit Card Debt", amount: "" },
  { id: 5, label: "Other Loans", amount: "" },
];

function useNetWorthCalc() {
  const [assets, setAssets] = useState<LineItem[]>(defaultAssets);
  const [liabilities, setLiabilities] = useState<LineItem[]>(defaultLiabilities);

  const updateItem = (list: LineItem[], setList: typeof setAssets, id: number, field: keyof LineItem, val: string) =>
    setList(list.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const addItem = (list: LineItem[], setList: typeof setAssets, prefix: string) =>
    setList([...list, { id: Date.now(), label: `${prefix} ${list.length + 1}`, amount: "" }]);

  const removeItem = (list: LineItem[], setList: typeof setAssets, id: number) =>
    setList(list.filter((x) => x.id !== id));

  const result = useMemo(() => {
    const totalAssets = assets.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    const hasData = totalAssets > 0 || totalLiabilities > 0;
    return hasData ? { totalAssets, totalLiabilities, netWorth, debtRatio: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0 } : null;
  }, [assets, liabilities]);

  return { assets, setAssets, liabilities, setLiabilities, updateItem, addItem, removeItem, result };
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

function LineItemList({ items, setItems, updateItem, addItem, removeItem, title, prefix, accentColor }: {
  items: LineItem[]; setItems: (items: LineItem[]) => void;
  updateItem: (id: number, field: keyof LineItem, val: string) => void;
  addItem: () => void; removeItem: (id: number) => void;
  title: string; prefix: string; accentColor: string;
}) {
  return (
    <div>
      <h3 className={`text-sm font-bold uppercase tracking-widest ${accentColor} mb-3`}>{title}</h3>
      <div className="space-y-2 mb-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input value={item.label} onChange={(e) => updateItem(item.id, "label", e.target.value)}
              className="tool-calc-input flex-1 px-3 py-2.5 rounded-xl border text-foreground text-sm focus:outline-none" />
            <input type="number" value={item.amount} onChange={(e) => updateItem(item.id, "amount", e.target.value)}
              placeholder="$0"
              className="tool-calc-input w-28 px-3 py-2.5 rounded-xl border text-foreground text-sm font-mono focus:outline-none" />
            {items.length > 1 && (
              <button onClick={() => removeItem(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addItem} className={`flex items-center gap-1.5 text-sm ${accentColor} font-semibold transition-colors opacity-80 hover:opacity-100`}>
        <Plus className="w-3.5 h-3.5" /> Add {prefix}
      </button>
    </div>
  );
}

export default function NetWorthCalculator() {
  const { assets, setAssets, liabilities, setLiabilities, updateItem, addItem, removeItem, result } = useNetWorthCalc();
  const fmt = (n: number) => (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <Layout>
      <SEO
        title="Net Worth Calculator — Calculate Your Total Net Worth Online"
        description="Calculate your personal net worth by entering assets and liabilities. Free online Net Worth Calculator — see your financial position instantly with no signup required."
      />
      <div style={{ "--calc-hue": "45" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Net Worth Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">Net Worth Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Know exactly where you stand financially. List your assets and liabilities to instantly calculate your total net worth — your single most important financial snapshot.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "Private — No Data Stored", "Fully Customizable"].map((b) => (
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
                <div className="h-full rounded-full transition-all duration-500" style={{ width: result ? "100%" : "0%", background: "linear-gradient(90deg, hsl(45,80%,50%), hsl(25,80%,55%))" }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <LineItemList
                  items={assets} setItems={setAssets}
                  updateItem={(id, f, v) => updateItem(assets, setAssets, id, f, v)}
                  addItem={() => addItem(assets, setAssets, "Asset")}
                  removeItem={(id) => removeItem(assets, setAssets, id)}
                  title="Assets (What You Own)" prefix="Asset" accentColor="text-green-500"
                />
                <LineItemList
                  items={liabilities} setItems={setLiabilities}
                  updateItem={(id, f, v) => updateItem(liabilities, setLiabilities, id, f, v)}
                  addItem={() => addItem(liabilities, setLiabilities, "Liability")}
                  removeItem={(id) => removeItem(liabilities, setLiabilities, id)}
                  title="Liabilities (What You Owe)" prefix="Liability" accentColor="text-red-500"
                />
              </div>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="tool-calc-result rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
                      <p className="text-xl font-black text-green-500">{fmt(result.totalAssets)}</p>
                    </div>
                    <div className="tool-calc-result rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
                      <p className="text-xl font-black text-red-500">{fmt(result.totalLiabilities)}</p>
                    </div>
                    <div className="tool-calc-result rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
                      <p className={`text-xl font-black tool-calc-number ${result.netWorth >= 0 ? "" : "text-red-500"}`}>{fmt(result.netWorth)}</p>
                    </div>
                  </div>

                  {/* Visual breakdown */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Assets vs Liabilities</span>
                      <span>Debt Ratio: {result.debtRatio.toFixed(1)}%</span>
                    </div>
                    <div className="flex rounded-full overflow-hidden h-3">
                      <div className="bg-green-500 transition-all" style={{ width: `${Math.min(100, 100 - result.debtRatio)}%` }} />
                      <div className="bg-red-400 flex-1" />
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Assets</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Liabilities</span>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {result.netWorth > 0
                          ? `Your net worth is ${fmt(result.netWorth)}. Your debt ratio is ${result.debtRatio.toFixed(1)}% — ${result.debtRatio < 30 ? "excellent financial health." : result.debtRatio < 50 ? "solid position with manageable debt." : "consider focusing on debt reduction."}`
                          : `Your net worth is currently negative at ${fmt(result.netWorth)}. Focus on reducing high-interest debt and growing savings to turn this positive.`}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Calculate Your Net Worth</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "List All Your Assets", desc: "Include everything of monetary value: cash, savings, investments, retirement accounts, real estate, vehicles, and other valuables. Use current market values, not purchase prices." },
                  { step: "2", title: "List All Your Liabilities", desc: "Include every debt: mortgage balance (not monthly payment), car loans, student loans, credit card balances, personal loans, and any other outstanding obligations." },
                  { step: "3", title: "Review Your Net Worth", desc: "The calculator subtracts total liabilities from total assets. The result is your net worth — positive means more assets than debt; negative means more debt than assets." },
                  { step: "4", title: "Track Changes Over Time", desc: "Run this calculation quarterly or annually to measure financial progress. A growing net worth means you're building wealth. A shrinking one is a signal to review spending and debt." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula</h3>
                <div className="space-y-3">
                  {[
                    { expr: "Net Worth = Total Assets − Total Liabilities", desc: "The fundamental formula. Assets are everything you own with monetary value; liabilities are everything you owe." },
                    { expr: "Debt Ratio = (Total Liabilities ÷ Total Assets) × 100", desc: "Measures how much of your assets are financed by debt. Under 30% is strong; over 50% suggests high leverage." },
                    { expr: "Asset Growth = Current Assets − Prior Period Assets", desc: "Tracks how your total asset base is changing — growing assets signal wealth building." },
                    { expr: "Debt Reduction = Prior Liabilities − Current Liabilities", desc: "Measures how quickly you're paying down debt — a key driver of net worth growth." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Does Your Net Worth Mean?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Net worth is context-dependent — age, career stage, and location all affect what's "normal." More important than the absolute number is whether it's growing over time.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Negative Net Worth", color: "text-red-600 bg-red-500/10 border-red-500/20", desc: "More debt than assets. Common in early career or after major life events. Focus on debt payoff and building savings." },
                  { label: "Zero to Low Positive", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "You've achieved balance. Keep building assets (savings, investments) while managing liabilities to accelerate growth." },
                  { label: "Positive and Growing", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Strong financial trajectory. Diversify assets, maximize tax-advantaged accounts, and plan for long-term wealth." },
                  { label: "High Positive Net Worth", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Financial independence is within reach or achieved. Focus shifts to preservation, estate planning, and legacy." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Net Worth Examples by Life Stage</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Life Stage</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Total Assets</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Total Liabilities</th>
                      <th className="text-right py-2 font-bold text-foreground">Net Worth</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { stage: "Recent grad (25)", assets: "$15,000", liab: "$38,000", nw: "−$23,000" },
                      { stage: "Young professional (32)", assets: "$95,000", liab: "$62,000", nw: "$33,000" },
                      { stage: "Mid-career (45)", assets: "$420,000", liab: "$180,000", nw: "$240,000" },
                      { stage: "Pre-retirement (58)", assets: "$950,000", liab: "$120,000", nw: "$830,000" },
                      { stage: "Retired (68)", assets: "$1,200,000", liab: "$40,000", nw: "$1,160,000" },
                    ].map((row) => (
                      <tr key={row.stage} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.stage}</td>
                        <td className="py-2.5 pr-3 text-right font-mono text-green-500">{row.assets}</td>
                        <td className="py-2.5 pr-3 text-right font-mono text-red-400">{row.liab}</td>
                        <td className={`py-2.5 text-right font-bold ${row.nw.startsWith("−") ? "text-red-500" : "text-amber-500"}`}>{row.nw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Negative net worth is normal early in life.</strong> Student loans and a new car can put a 25-year-old $20,000–$50,000 in the hole before they've had time to build savings. What matters is the trajectory — is that debt going down while assets go up?</p>
                <p><strong className="text-foreground">Home equity is often the biggest asset</strong> for middle-aged households. As mortgage balances fall and property values rise, net worth typically accelerates in the 40s and 50s. This is why homeownership remains a core wealth-building strategy for most people.</p>
                <p><strong className="text-foreground">Retirement accounts compound dramatically</strong> over time. A 32-year-old with $40,000 in a 401(k) at 7% average returns will have over $400,000 by age 62 with no additional contributions — illustrating why starting early matters more than contributing large amounts.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic">"I had no idea what my net worth was until I sat down and filled this in. Turns out I'm doing better than I thought — but seeing the debt number so clearly motivated me to finally attack my student loans."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— 34-year-old software engineer</p>
              </div>
            </section>

            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Track Your Net Worth</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Net worth is the single most comprehensive measure of your financial health. Income tells you what you earn. Net worth tells you what you've built. Two people with identical salaries can have vastly different net worths based on their spending, saving, and debt management habits.</p>
                <p>Calculating net worth regularly — even once a year — forces you to confront the full picture. It reveals whether wealth is actually accumulating or whether income is being consumed by debt and spending. For most people, this awareness alone drives positive financial behavior change.</p>
                <p>The <strong className="text-foreground">debt ratio</strong> is a particularly important metric. A 30% debt ratio means 30 cents of every dollar of assets is financed by debt — still healthy. A 70% ratio means you're heavily leveraged and vulnerable to asset value declines.</p>
                <p>Banks and lenders use net worth (along with income) to assess creditworthiness. A strong net worth relative to debt can help you secure better loan terms, investment opportunities, and financial flexibility in emergencies.</p>
                <p>Once you know your net worth, use the <Link href="/finance/savings-goal-calculator" className="text-amber-500 hover:underline">Savings Goal Calculator</Link> to plan growth, or the <Link href="/finance/online-investment-growth-calculator" className="text-amber-500 hover:underline">Investment Growth Calculator</Link> to project where you'll be in 10 or 20 years.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Privacy note:</strong> All data entered into this calculator stays in your browser. Nothing is sent to any server or stored anywhere. Refresh the page to clear all entries.
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="What counts as an asset in net worth?" a="Assets include: cash and bank accounts, investment accounts (stocks, bonds, ETFs), retirement accounts (401k, IRA, pension), real estate (current market value, not purchase price), vehicles (current resale value), business ownership value, valuable personal property (jewelry, art, collectibles), and money owed to you." />
                <FaqItem q="Should I include my home as an asset?" a="Yes — use the current market value (what you'd sell it for today), not what you paid. Then include your remaining mortgage balance as a liability. The difference is your home equity, which is a major component of net worth for most homeowners." />
                <FaqItem q="What is a good net worth by age?" a="Net worth benchmarks vary widely by location and income. A common rule of thumb: by 30 aim for 1× your annual salary; by 40 aim for 3×; by 50 aim for 6×; by 60 aim for 8×. These are guidelines — what matters most is consistent growth year over year." />
                <FaqItem q="Is a negative net worth bad?" a="Not necessarily, especially if you're young. Student loans create negative net worth for millions of people in their 20s who will go on to have strong finances. What matters is the trend: is your net worth improving each year? If debt is falling and savings growing, you're on the right track." />
                <FaqItem q="How often should I calculate my net worth?" a="At minimum annually — ideally quarterly. Track it in a spreadsheet over time to see trends. Many personal finance experts suggest doing it on the same date each year (e.g., January 1) to get a consistent year-over-year comparison." />
                <FaqItem q="Should I include my 401(k) or IRA in net worth?" a="Yes — include retirement accounts at their current balance. While you can't access them without penalty before 59½, they are real assets that grow tax-advantaged and represent your actual wealth. Some people track 'liquid net worth' (excluding retirement accounts) separately for short-term planning." />
              </div>
            </section>

            <section className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">Build and Track Your Wealth</h2>
              <p className="text-muted-foreground text-sm mb-4">Savings goals, investment projections, budgeting — all the tools you need, free.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[{ href: "#how-to-use", label: "How to Calculate" }, { href: "#understanding-results", label: "What It Means" }, { href: "#examples", label: "Life Stage Examples" }, { href: "#why-this-tool", label: "Why Track It" }, { href: "#faq", label: "FAQ" }].map((item) => (
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
                  { href: "/finance/online-investment-growth-calculator", label: "Investment Growth", icon: BarChart3 },
                  { href: "/finance/online-budget-calculator", label: "Budget Calculator", icon: Calculator },
                  { href: "/finance/debt-payoff-calculator", label: "Debt Payoff Calculator", icon: DollarSign },
                  { href: "/finance/online-retirement-calculator", label: "Retirement Calculator", icon: Clock },
                  { href: "/finance/online-compound-interest-calculator", label: "Compound Interest", icon: TrendingUp },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-amber-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[{ icon: Shield, text: "100% private" }, { icon: Zap, text: "Instant calculation" }, { icon: BadgeCheck, text: "Customizable items" }, { icon: Clock, text: "Track over time" }].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-amber-500" />{item.text}
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
