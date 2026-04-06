import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, TrendingDown, DollarSign, Calculator,
  Zap, CheckCircle2, Shield, Clock, BarChart3, Lightbulb,
  BadgeCheck, Star,
} from "lucide-react";

function useDepreciationCalc() {
  const [assetCost, setAssetCost] = useState("");
  const [salvageValue, setSalvageValue] = useState("");
  const [usefulLife, setUsefulLife] = useState("");
  const [method, setMethod] = useState<"sl" | "db" | "syd">("sl");

  const result = useMemo(() => {
    const cost = parseFloat(assetCost);
    const salvage = parseFloat(salvageValue) || 0;
    const life = parseInt(usefulLife);
    if (isNaN(cost) || isNaN(life) || cost <= 0 || life <= 0 || salvage < 0 || salvage >= cost) return null;

    const depreciableBase = cost - salvage;
    const schedule: { year: number; depreciation: number; accumulated: number; bookValue: number }[] = [];

    if (method === "sl") {
      const annualDep = depreciableBase / life;
      let accumulated = 0;
      for (let y = 1; y <= life; y++) {
        accumulated += annualDep;
        schedule.push({ year: y, depreciation: annualDep, accumulated, bookValue: cost - accumulated });
      }
      return { schedule, annualDep, method, cost, salvage, life, depreciableBase };
    }

    if (method === "db") {
      const rate = (2 / life) * 100; // 200% declining balance
      let bookValue = cost;
      let accumulated = 0;
      for (let y = 1; y <= life; y++) {
        const dep = Math.max(bookValue * (rate / 100), 0);
        const actualDep = Math.min(dep, bookValue - salvage);
        accumulated += actualDep;
        bookValue -= actualDep;
        schedule.push({ year: y, depreciation: actualDep, accumulated, bookValue });
        if (bookValue <= salvage) break;
      }
      return { schedule, annualDep: schedule[0]?.depreciation || 0, method, cost, salvage, life, depreciableBase, rate };
    }

    // SYD
    const sydSum = (life * (life + 1)) / 2;
    let accumulated = 0;
    let bookValue = cost;
    for (let y = 1; y <= life; y++) {
      const fraction = (life - y + 1) / sydSum;
      const dep = depreciableBase * fraction;
      accumulated += dep;
      bookValue -= dep;
      schedule.push({ year: y, depreciation: dep, accumulated, bookValue });
    }
    return { schedule, annualDep: schedule[0]?.depreciation || 0, method, cost, salvage, life, depreciableBase, sydSum };
  }, [assetCost, salvageValue, usefulLife, method]);

  return { assetCost, setAssetCost, salvageValue, setSalvageValue, usefulLife, setUsefulLife, method, setMethod, result };
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

export default function DepreciationCalculator() {
  const { assetCost, setAssetCost, salvageValue, setSalvageValue, usefulLife, setUsefulLife, method, setMethod, result } = useDepreciationCalc();
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [showFullTable, setShowFullTable] = useState(false);

  const displayedSchedule = result ? (showFullTable ? result.schedule : result.schedule.slice(0, 5)) : [];

  return (
    <Layout>
      <SEO
        title="Depreciation Calculator — Straight-Line, Declining Balance & SYD Methods"
        description="Calculate asset depreciation using straight-line, double declining balance, or sum-of-years-digits methods. Free depreciation calculator with full year-by-year schedule."
      />
      <div style={{ "--calc-hue": "220" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Depreciation Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">Depreciation Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Calculate asset depreciation using straight-line, double declining balance, or sum-of-years-digits methods. Get a full year-by-year depreciation schedule instantly.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "3 Methods", "Full Year Schedule"].map((b) => (
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
                <div className="h-full rounded-full transition-all duration-500" style={{ width: result ? "100%" : "0%", background: "linear-gradient(90deg, hsl(220,70%,55%), hsl(260,70%,55%))" }} />
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {[{ key: "sl", label: "Straight-Line" }, { key: "db", label: "Declining Balance (DDB)" }, { key: "syd", label: "Sum-of-Years-Digits" }].map((m) => (
                  <button key={m.key} onClick={() => setMethod(m.key as typeof method)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${method === m.key ? "bg-indigo-500 text-white border-indigo-500" : "border-border text-muted-foreground hover:border-indigo-500/50"}`}>
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Asset Cost ($)", val: assetCost, set: setAssetCost, ph: "e.g. 50000" },
                  { label: "Salvage Value ($)", val: salvageValue, set: setSalvageValue, ph: "e.g. 5000" },
                  { label: "Useful Life (Years)", val: usefulLife, set: setUsefulLife, ph: "e.g. 10" },
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
                      { label: "Year 1 Depreciation", value: fmt(result.schedule[0]?.depreciation || 0) },
                      { label: "Depreciable Base", value: fmt(result.depreciableBase) },
                      { label: "Salvage Value", value: fmt(result.salvage) },
                      { label: "Useful Life", value: `${result.life} years` },
                    ].map((item) => (
                      <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="tool-calc-number text-xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Depreciation schedule table */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="p-3 bg-muted/40 border-b border-border">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Depreciation Schedule</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 font-bold text-foreground">Year</th>
                            <th className="text-right py-2 px-3 font-bold text-foreground">Depreciation</th>
                            <th className="text-right py-2 px-3 font-bold text-foreground">Accumulated</th>
                            <th className="text-right py-2 px-3 font-bold text-foreground">Book Value</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          {displayedSchedule.map((row) => (
                            <tr key={row.year} className="border-b border-border/50">
                              <td className="py-2 px-3">Year {row.year}</td>
                              <td className="py-2 px-3 text-right font-mono text-indigo-500 font-bold">{fmt(row.depreciation)}</td>
                              <td className="py-2 px-3 text-right font-mono">{fmt(row.accumulated)}</td>
                              <td className="py-2 px-3 text-right font-mono">{fmt(row.bookValue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.schedule.length > 5 && (
                      <button onClick={() => setShowFullTable(!showFullTable)}
                        className="w-full py-2.5 text-sm text-indigo-500 hover:text-indigo-400 font-semibold border-t border-border transition-colors">
                        {showFullTable ? "Show Less" : `Show All ${result.schedule.length} Years`}
                      </button>
                    )}
                  </div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {method === "sl" && `Straight-line depreciation: ${fmt(result.schedule[0]?.depreciation || 0)}/year for ${result.life} years until book value reaches ${fmt(result.salvage)}.`}
                        {method === "db" && `Double declining balance: Year 1 depreciation of ${fmt(result.schedule[0]?.depreciation || 0)} — front-loads deductions for maximum early tax benefit.`}
                        {method === "syd" && `Sum-of-years-digits: ${fmt(result.schedule[0]?.depreciation || 0)} in Year 1 declining each year — a middle ground between straight-line and DDB.`}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Depreciation Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Select Depreciation Method", desc: "Choose straight-line for equal annual write-offs, double declining balance for front-loaded deductions, or sum-of-years-digits for an accelerated middle ground." },
                  { step: "2", title: "Enter Asset Cost", desc: "The original purchase price or capitalized cost of the asset — equipment, vehicle, machinery, building improvement, or any long-term asset." },
                  { step: "3", title: "Enter Salvage Value", desc: "The estimated residual value of the asset at the end of its useful life. Enter 0 if you expect no remaining value." },
                  { step: "4", title: "Enter Useful Life", desc: "The number of years the asset will be used before replacement or retirement. The IRS provides standard useful lives for common asset types." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
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
                    { expr: "Straight-Line: Annual Depreciation = (Cost − Salvage) ÷ Useful Life", desc: "Equal depreciation every year. Simplest method, most common for accounting purposes." },
                    { expr: "DDB: Depreciation = Book Value × (2 ÷ Useful Life)", desc: "Applies double the straight-line rate to the current book value each year — front-loads deductions." },
                    { expr: "SYD: Depreciation = (Cost − Salvage) × (Remaining Life ÷ SYD Sum)", desc: "SYD Sum = n(n+1)/2. Remaining life decreases each year, producing a declining but smoother pattern." },
                    { expr: "Book Value = Cost − Accumulated Depreciation", desc: "The remaining value of the asset on the balance sheet at any point in its life." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Choosing a Depreciation Method</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">The method you choose affects how much expense you deduct each year — which impacts taxes and reported profitability.</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Straight-Line (SL)", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Best for assets with uniform usefulness over time — buildings, furniture, long-lived equipment. Simple and predictable." },
                  { label: "Double Declining (DDB)", color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20", desc: "Best for assets that lose value quickly (vehicles, tech, machinery). Front-loads tax deductions for greater early benefit." },
                  { label: "Sum-of-Years-Digits", color: "text-purple-600 bg-purple-500/10 border-purple-500/20", desc: "A middle ground — more deductions early than SL, but smoother than DDB. Good for assets with moderate early productivity." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Depreciation Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Asset</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Cost</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Salvage</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Life</th>
                      <th className="text-right py-2 font-bold text-foreground">Yr 1 (SL)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { asset: "Company vehicle", cost: "$35,000", salvage: "$5,000", life: "5 yrs", yr1: "$6,000" },
                      { asset: "Office equipment", cost: "$12,000", salvage: "$0", life: "5 yrs", yr1: "$2,400" },
                      { asset: "Commercial building", cost: "$500,000", salvage: "$50,000", life: "39 yrs", yr1: "$11,538" },
                      { asset: "Manufacturing machine", cost: "$80,000", salvage: "$8,000", life: "10 yrs", yr1: "$7,200" },
                      { asset: "Computer / laptop", cost: "$2,000", salvage: "$200", life: "5 yrs", yr1: "$360" },
                    ].map((row) => (
                      <tr key={row.asset} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.asset}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.cost}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.salvage}</td>
                        <td className="py-2.5 pr-3 text-right">{row.life}</td>
                        <td className="py-2.5 text-right font-bold text-indigo-500">{row.yr1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Vehicles</strong> are typically depreciated over 5 years. Most businesses prefer double declining balance to capture larger deductions in the early years when the vehicle is worth more and maintenance costs are lower.</p>
                <p><strong className="text-foreground">Commercial real estate</strong> is depreciated over 39 years (residential over 27.5 years) under US tax rules. While the annual deduction seems small relative to cost, it adds up to significant tax savings over a building's life.</p>
                <p><strong className="text-foreground">Technology equipment</strong> depreciates fastest in real-world value — a laptop worth $2,000 today is often obsolete in 3 years. Accelerated depreciation methods better match the economic reality of tech assets.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic">"Our accountant always used to do this manually in a spreadsheet. Now I run it myself in 30 seconds and bring the schedule to the meeting."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— Small business owner</p>
              </div>
            </section>

            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Depreciation Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Depreciation is one of the most important concepts in business accounting and tax planning. It allows businesses to spread the cost of a long-term asset over its useful life, matching expenses to the periods in which the asset generates revenue.</p>
                <p>This calculator supports all three major GAAP-accepted methods: <strong className="text-foreground">straight-line</strong> for consistent expense, <strong className="text-foreground">double declining balance</strong> for accelerated tax deductions, and <strong className="text-foreground">sum-of-years-digits</strong> as a systematic accelerated alternative.</p>
                <p>The full year-by-year schedule is the most useful output — it shows exactly how the asset's book value declines each year, which is essential for balance sheet reporting, asset disposal calculations, and loan collateral valuation.</p>
                <p>Accountants, small business owners, and finance students all use depreciation schedules regularly. Whether you're filing taxes, preparing financial statements, or evaluating an equipment purchase, this tool provides the exact numbers you need instantly.</p>
                <p>Pair this with the <Link href="/finance/payback-period-calculator" className="text-indigo-500 hover:underline">Payback Period Calculator</Link> to understand when an asset pays for itself, or the <Link href="/finance/online-roi-calculator" className="text-indigo-500 hover:underline">ROI Calculator</Link> to measure overall investment return.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Disclaimer:</strong> Tax depreciation rules vary by jurisdiction and asset class. Always consult a tax professional or CPA for IRS MACRS depreciation, Section 179 elections, or bonus depreciation planning.
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="What is depreciation and why does it matter?" a="Depreciation is the accounting process of allocating the cost of a tangible asset over its useful life. It matters because it reduces taxable income (tax depreciation), matches asset cost to the revenue it helps generate (accounting depreciation), and reflects the declining value of assets on a balance sheet." />
                <FaqItem q="Which depreciation method should I use?" a="For tax purposes in the US, most businesses use MACRS (Modified Accelerated Cost Recovery System), which is a form of declining balance. For financial reporting (GAAP), straight-line is most common because it produces predictable, consistent expenses. Always confirm with a CPA for your specific situation." />
                <FaqItem q="What is salvage value and how do I estimate it?" a="Salvage value (also called residual value) is what you expect to sell or scrap the asset for at the end of its useful life. For most equipment, this is 10–20% of original cost. For technology, it's often $0. For vehicles, check used market values for assets of the expected age and condition." />
                <FaqItem q="What is book value vs. market value?" a="Book value is the calculated accounting value (cost minus accumulated depreciation) shown on the balance sheet. Market value is what the asset would actually sell for today. These rarely match — a vehicle might have a $15,000 book value but only fetch $10,000 on the market, or vice versa for appreciating assets like land." />
                <FaqItem q="Can I depreciate land?" a="No — land is not depreciable under GAAP or tax rules because it doesn't wear out or become obsolete. Only the building and improvements on land are depreciable. This is why real estate transactions carefully allocate purchase price between land and building." />
                <FaqItem q="What happens when an asset is fully depreciated?" a="When accumulated depreciation equals the depreciable base (cost minus salvage value), the asset is fully depreciated. It stays on the books at salvage value but no further depreciation is recorded. The asset can continue to be used — many businesses use assets well beyond their depreciation schedule." />
              </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">More Business Finance Tools</h2>
              <p className="text-muted-foreground text-sm mb-4">ROI, break-even, profit margin — all the tools finance teams need, free.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[{ href: "#how-to-use", label: "How to Use" }, { href: "#understanding-results", label: "Choosing a Method" }, { href: "#examples", label: "Examples" }, { href: "#why-this-tool", label: "Why This Tool" }, { href: "#faq", label: "FAQ" }].map((item) => (
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
                  { href: "/finance/online-roi-calculator", label: "ROI Calculator", icon: TrendingDown },
                  { href: "/finance/payback-period-calculator", label: "Payback Period", icon: Clock },
                  { href: "/finance/break-even-calculator", label: "Break-Even Calculator", icon: BarChart3 },
                  { href: "/finance/profit-margin-calculator", label: "Profit Margin", icon: DollarSign },
                  { href: "/finance/net-worth-calculator", label: "Net Worth Calculator", icon: Calculator },
                  { href: "/finance/online-inflation-calculator", label: "Inflation Calculator", icon: TrendingDown },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[{ icon: Shield, text: "No data stored" }, { icon: Zap, text: "Full year schedule" }, { icon: BadgeCheck, text: "3 methods" }, { icon: Clock, text: "Any asset life" }].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-indigo-500" />{item.text}
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
