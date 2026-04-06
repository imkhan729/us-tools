import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Users, DollarSign, Calculator,
  Zap, CheckCircle2, Shield, Clock, BarChart3, Lightbulb,
  BadgeCheck, Star, Plus, Trash2,
} from "lucide-react";

interface Person {
  id: number;
  name: string;
  share: string;
}

function useCostSplitCalc() {
  const [totalCost, setTotalCost] = useState("");
  const [splitMode, setSplitMode] = useState<"even" | "percent" | "custom">("even");
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "Person 1", share: "" },
    { id: 2, name: "Person 2", share: "" },
  ]);

  const addPerson = () => setPeople((p) => [...p, { id: Date.now(), name: `Person ${p.length + 1}`, share: "" }]);
  const removePerson = (id: number) => setPeople((p) => p.filter((x) => x.id !== id));
  const updatePerson = (id: number, field: keyof Person, val: string) =>
    setPeople((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const result = useMemo(() => {
    const total = parseFloat(totalCost);
    if (isNaN(total) || total <= 0 || people.length === 0) return null;

    if (splitMode === "even") {
      const perPerson = total / people.length;
      return { rows: people.map((p) => ({ ...p, amount: perPerson, pct: 100 / people.length })), total, splitMode };
    }

    if (splitMode === "percent") {
      const shares = people.map((p) => parseFloat(p.share) || 0);
      const sumShares = shares.reduce((a, b) => a + b, 0);
      if (sumShares === 0) return null;
      return {
        rows: people.map((p, i) => ({ ...p, amount: total * (shares[i] / sumShares), pct: (shares[i] / sumShares) * 100 })),
        total, splitMode, sumShares,
      };
    }

    // custom amounts
    const amounts = people.map((p) => parseFloat(p.share) || 0);
    const sumAmounts = amounts.reduce((a, b) => a + b, 0);
    return {
      rows: people.map((p, i) => ({ ...p, amount: amounts[i], pct: sumAmounts > 0 ? (amounts[i] / sumAmounts) * 100 : 0 })),
      total, sumAmounts, splitMode,
    };
  }, [totalCost, splitMode, people]);

  return { totalCost, setTotalCost, splitMode, setSplitMode, people, addPerson, removePerson, updatePerson, result };
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

export default function CostSplitCalculator() {
  const { totalCost, setTotalCost, splitMode, setSplitMode, people, addPerson, removePerson, updatePerson, result } = useCostSplitCalc();
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Cost Split Calculator — Split Bills and Expenses Between People"
        description="Split any cost evenly, by percentage, or by custom amounts with our free Cost Split Calculator. Perfect for splitting rent, bills, trips, and group expenses."
      />
      <div style={{ "--calc-hue": "25" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Cost Split Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">Cost Split Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Divide any shared expense fairly — split evenly, by percentage, or by custom amounts. Perfect for rent, restaurant bills, trips, and group purchases.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "3 Split Modes", "Up to Unlimited People"].map((b) => (
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
                <div className="h-full rounded-full transition-all duration-500" style={{ width: result ? "100%" : "0%", background: "linear-gradient(90deg, hsl(25,80%,55%), hsl(45,80%,55%))" }} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-foreground mb-1.5">Total Cost ($)</label>
                <input type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="e.g. 240.00"
                  className="tool-calc-input w-full max-w-xs px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-lg font-mono focus:outline-none" />
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {[{ key: "even", label: "Split Evenly" }, { key: "percent", label: "By Percentage" }, { key: "custom", label: "Custom Amounts" }].map((m) => (
                  <button key={m.key} onClick={() => setSplitMode(m.key as typeof splitMode)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${splitMode === m.key ? "bg-orange-500 text-white border-orange-500" : "border-border text-muted-foreground hover:border-orange-500/50"}`}>
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2 mb-3">
                {people.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input value={p.name} onChange={(e) => updatePerson(p.id, "name", e.target.value)}
                      className="tool-calc-input flex-1 px-3 py-2.5 rounded-xl border text-foreground text-sm focus:outline-none" />
                    {splitMode !== "even" && (
                      <input type="number" value={p.share} onChange={(e) => updatePerson(p.id, "share", e.target.value)}
                        placeholder={splitMode === "percent" ? "%" : "$"}
                        className="tool-calc-input w-24 px-3 py-2.5 rounded-xl border text-foreground text-sm font-mono focus:outline-none" />
                    )}
                    {people.length > 1 && (
                      <button onClick={() => removePerson(p.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addPerson} className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400 font-semibold mb-4 transition-colors">
                <Plus className="w-4 h-4" /> Add Person
              </button>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="tool-calc-result rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                      <p className="tool-calc-number text-xl font-black">{fmt(result.total)}</p>
                    </div>
                    <div className="tool-calc-result rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">People</p>
                      <p className="tool-calc-number text-xl font-black">{people.length}</p>
                    </div>
                    <div className="tool-calc-result rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Avg per Person</p>
                      <p className="tool-calc-number text-xl font-black">{fmt(result.total / people.length)}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Individual Amounts</p>
                    {result.rows.map((row) => (
                      <div key={row.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">{row.name}</span>
                          <span className="font-bold text-orange-500">{fmt(row.amount)} <span className="text-muted-foreground font-normal">({row.pct.toFixed(1)}%)</span></span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-orange-500" style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {result.splitMode === "even"
                          ? `${fmt(result.total / people.length)} each — split evenly between ${people.length} people.`
                          : `Custom split across ${people.length} people. The largest share is ${fmt(Math.max(...result.rows.map(r => r.amount)))}.`}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Cost Split Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Enter the Total Cost", desc: "Input the full shared expense — a restaurant bill, rent, trip cost, or any group purchase." },
                  { step: "2", title: "Choose a Split Mode", desc: "Select 'Split Evenly' for equal shares, 'By Percentage' for proportional splits, or 'Custom Amounts' to specify each person's exact contribution." },
                  { step: "3", title: "Add People", desc: "Enter each person's name. For percentage or custom mode, add their share or amount in the right field." },
                  { step: "4", title: "Read Each Person's Amount", desc: "Results show each person's due amount and their percentage of the total, with a visual share bar." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-500/10 text-orange-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
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
                    { expr: "Even Split = Total Cost ÷ Number of People", desc: "Each person pays an equal fraction of the total." },
                    { expr: "Percentage Split: Amount = Total × (Person Share % ÷ Sum of All Shares %)", desc: "Normalizes all percentage inputs to 100% and allocates accordingly." },
                    { expr: "Custom Split: Each Person Pays Their Entered Amount", desc: "Manual allocation where each person's amount is specified directly." },
                    { expr: "Share % = (Person Amount ÷ Total) × 100", desc: "The percentage of total cost each person is responsible for." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Choosing the Right Split Mode</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Different situations call for different split approaches. The right mode depends on your group's agreement about fairness.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Even Split", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Best for equal contributions — restaurant bills, group subscriptions, shared taxi rides." },
                  { label: "Percentage Split", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Ideal for income-based splits like rent where someone earns more and takes a larger room." },
                  { label: "Custom Amounts", color: "text-orange-600 bg-orange-500/10 border-orange-500/20", desc: "For itemized expenses — each person ordered different things and pays their exact portion." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Cost Split Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Scenario</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Total</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">People</th>
                      <th className="text-right py-2 font-bold text-foreground">Per Person</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { scenario: "Restaurant dinner (even)", total: "$180", people: "4", pp: "$45.00" },
                      { scenario: "Monthly rent split", total: "$2,400", people: "3", pp: "$800.00" },
                      { scenario: "Road trip fuel + hotel", total: "$520", people: "5", pp: "$104.00" },
                      { scenario: "Group gift (even)", total: "$150", people: "6", pp: "$25.00" },
                      { scenario: "Shared Netflix + Spotify", total: "$35", people: "4", pp: "$8.75" },
                    ].map((row) => (
                      <tr key={row.scenario} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.scenario}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.total}</td>
                        <td className="py-2.5 pr-3 text-right">{row.people}</td>
                        <td className="py-2.5 text-right font-bold text-orange-500">{row.pp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Shared rent</strong> is the most common use case. Three roommates splitting $2,400/month evenly each pay $800. But if one roommate has the master bedroom, a percentage split (e.g., 38/31/31) is fairer — use the percentage mode to reflect that.</p>
                <p><strong className="text-foreground">Group trips</strong> often involve unequal contributions — one person books the hotel on their card, another pays for fuel. Use custom amounts to log what each person actually paid, then see who owes whom to settle up evenly.</p>
                <p><strong className="text-foreground">Restaurant bills</strong> are quickest with even split if everyone ordered similarly. For large groups with varying orders, custom amount mode lets each person enter exactly what they ordered, eliminating arguments.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic">"We use this every month for our shared apartment. Three different income levels, and the percentage split keeps everyone happy without any awkward conversations."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— Apartment roommate, NYC</p>
              </div>
            </section>

            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Cost Split Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Splitting costs fairly is one of the most common financial tasks in everyday life — from splitting a dinner bill to dividing rent, subscriptions, and travel expenses. Manual calculation leads to rounding errors and disputes. This tool makes it exact and transparent.</p>
                <p>With three distinct split modes, it handles every scenario: <strong className="text-foreground">even splits</strong> for simple equal shares, <strong className="text-foreground">percentage splits</strong> for income-proportional divisions like rent, and <strong className="text-foreground">custom amounts</strong> for itemized expenses where people owe different amounts.</p>
                <p>The visual share bars make the split immediately clear to everyone in the group — showing not just the dollar amount but the percentage share, which helps people intuitively check fairness without doing mental math.</p>
                <p>Unlike messaging apps with basic split features, this calculator handles any number of people, any split type, and shows the full breakdown at once. It's useful for households, travel groups, project teams, and anyone sharing recurring expenses.</p>
                <p>After splitting costs, use the <Link href="/finance/online-budget-calculator" className="text-orange-500 hover:underline">Budget Calculator</Link> to track your share against your monthly income, or the <Link href="/finance/expense-calculator" className="text-orange-500 hover:underline">Expense Calculator</Link> to log all shared expenses across categories.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> This calculator handles cost allocation only. For tracking who has paid and who owes a balance, a dedicated expense-sharing app is recommended.
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="How do I split a bill with tax and tip included?" a="Enter the full bill amount including tax and tip in the total cost field, then split as normal. This ensures everyone pays their fair share of the extras, not just the pre-tax amount." />
                <FaqItem q="What if shares don't add up to 100% in percentage mode?" a="The calculator automatically normalizes your inputs — if you enter 40, 30, and 20 (totaling 90), it adjusts each share proportionally so the total always equals 100%. This prevents errors from imprecise percentage inputs." />
                <FaqItem q="Can I split costs among more than 10 people?" a="Yes — there's no limit to the number of people. Click 'Add Person' as many times as needed. The calculator handles any group size and updates all shares instantly." />
                <FaqItem q="How do I handle a situation where one person doesn't pay?" a="Simply remove them from the split. Their share redistributes among the remaining people. For custom mode, enter $0 for their amount to record them in the list while excluding their payment." />
                <FaqItem q="What's the fairest way to split rent with unequal rooms?" a="Use percentage mode based on room size or amenities. If the master bedroom is 30% larger than other rooms, the occupant might pay 30% more than their equal share. A common method: calculate equal base rent, then adjust upward for premium rooms and downward for smaller ones." />
                <FaqItem q="Is this calculator useful for splitting business expenses?" a="Yes — use it for splitting shared business costs like office rent, utilities, or shared software subscriptions between business partners or departments. The percentage mode is especially useful for cost-sharing agreements based on revenue or headcount ratios." />
              </div>
            </section>

            <section className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">More Everyday Finance Tools</h2>
              <p className="text-muted-foreground text-sm mb-4">Budget, track expenses, and calculate tips — all free, no account needed.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[{ href: "#how-to-use", label: "How to Use" }, { href: "#understanding-results", label: "Split Modes" }, { href: "#examples", label: "Examples" }, { href: "#why-this-tool", label: "Why This Tool" }, { href: "#faq", label: "FAQ" }].map((item) => (
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
                  { href: "/finance/tip-calculator", label: "Tip Calculator", icon: DollarSign },
                  { href: "/finance/online-budget-calculator", label: "Budget Calculator", icon: Calculator },
                  { href: "/finance/expense-calculator", label: "Expense Calculator", icon: BarChart3 },
                  { href: "/finance/discount-calculator", label: "Discount Calculator", icon: Users },
                  { href: "/finance/percentage-calculator", label: "Percentage Calculator", icon: Calculator },
                  { href: "/finance/online-tax-calculator", label: "Tax Calculator", icon: Shield },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-orange-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[{ icon: Shield, text: "No data stored" }, { icon: Zap, text: "Instant split" }, { icon: BadgeCheck, text: "3 split modes" }, { icon: Clock, text: "Any group size" }].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-orange-500" />{item.text}
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
