import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, DollarSign, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Users, Star, Calculator, CreditCard
} from "lucide-react";

const PRESET_TIPS = [10, 15, 18, 20, 25];

function useTip() {
  const [bill, setBill] = useState("50.00");
  const [tipPct, setTipPct] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("2");
  const [isCustom, setIsCustom] = useState(false);

  const result = useMemo(() => {
    const b = parseFloat(bill);
    const n = parseInt(people) || 1;
    const pct = isCustom ? parseFloat(customTip) || 0 : tipPct;
    if (isNaN(b) || b <= 0) return null;
    const tipAmt = b * (pct / 100);
    const total = b + tipAmt;
    return {
      tip: tipAmt,
      total,
      perPersonBill: b / n,
      perPersonTip: tipAmt / n,
      perPersonTotal: total / n,
      pct,
    };
  }, [bill, tipPct, customTip, people, isCustom]);

  return { bill, setBill, tipPct, setTipPct, customTip, setCustomTip, people, setPeople, isCustom, setIsCustom, result };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED = [
  { title: "Sales Tax Calculator",  slug: "sales-tax-calculator",   cat: "math",    icon: <Calculator className="w-5 h-5" />,  color: 25,  benefit: "Add tax to any price" },
  { title: "Percentage Calculator", slug: "percentage-calculator",  cat: "math",    icon: <DollarSign className="w-5 h-5" />, color: 217, benefit: "Calculate any percentage" },
  { title: "Split Bill Calculator", slug: "split-bill-calculator",  cat: "finance", icon: <Users className="w-5 h-5" />,      color: 152, benefit: "Divide bills evenly" },
  { title: "Discount Calculator",   slug: "discount-calculator",    cat: "math",    icon: <CreditCard className="w-5 h-5" />, color: 265, benefit: "Find sale prices" },
];

export default function TipCalculator() {
  const { bill, setBill, tipPct, setTipPct, customTip, setCustomTip, people, setPeople, isCustom, setIsCustom, result } = useTip();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const fmt = (n: number) => n.toFixed(2);

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Bill: $${fmt(parseFloat(bill))} | Tip (${result.pct}%): $${fmt(result.tip)} | Total: $${fmt(result.total)} | Per person: $${fmt(result.perPersonTotal)}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Tip Calculator – How Much to Tip & Split the Bill | US Online Tools"
        description="Free tip calculator. Calculate tip amount, total bill, and per-person cost for any group size. Choose from preset tip percentages or enter a custom amount. Instant results, no signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Tip Calculator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-yellow-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <DollarSign className="w-3.5 h-3.5" /> Finance &amp; Money
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Tip Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate the tip amount, total bill, and how much each person owes when splitting the check. Supports preset tip percentages (10%–25%) and custom amounts. Instant results for any group size.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold text-xs px-3 py-1.5 rounded-full border border-yellow-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Finance &amp; Money &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tip Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update instantly as you type.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 43 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Bill Amount ($)</label>
                        <input type="number" placeholder="50.00" step="0.01" className="tool-calc-input w-full" value={bill} onChange={e => setBill(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">
                          <Users className="w-3.5 h-3.5 inline mr-1" />Number of People
                        </label>
                        <input type="number" placeholder="2" min="1" className="tool-calc-input w-full" value={people} onChange={e => setPeople(e.target.value)} />
                      </div>
                    </div>

                    {/* Tip selector */}
                    <div className="mb-5">
                      <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Tip Percentage</label>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_TIPS.map(p => (
                          <button key={p} onClick={() => { setTipPct(p); setIsCustom(false); }}
                            className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${!isCustom && tipPct === p ? "bg-amber-500 border-amber-500 text-white" : "border-border text-muted-foreground hover:border-amber-500/40"}`}>
                            {p}%
                          </button>
                        ))}
                        <button onClick={() => setIsCustom(true)}
                          className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${isCustom ? "bg-amber-500 border-amber-500 text-white" : "border-border text-muted-foreground hover:border-amber-500/40"}`}>
                          Custom
                        </button>
                      </div>
                      {isCustom && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                          <input type="number" placeholder="Enter tip %" className="tool-calc-input w-48" value={customTip} onChange={e => setCustomTip(e.target.value)} />
                          <span className="ml-2 text-muted-foreground font-bold">%</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Results */}
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Tip Amount</p>
                            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">${fmt(result.tip)}</p>
                          </div>
                          <div className="text-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Bill</p>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${fmt(result.total)}</p>
                          </div>
                          <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Per Person</p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">${fmt(result.perPersonTotal)}</p>
                          </div>
                        </div>
                        {parseInt(people) > 1 && (
                          <div className="p-4 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Per Person Breakdown ({people} people)</p>
                            <div className="grid grid-cols-3 gap-4 text-center text-sm">
                              <div><p className="text-muted-foreground text-xs">Bill Share</p><p className="font-bold text-foreground">${fmt(result.perPersonBill)}</p></div>
                              <div><p className="text-muted-foreground text-xs">Tip Share</p><p className="font-bold text-amber-600">${fmt(result.perPersonTip)}</p></div>
                              <div><p className="text-muted-foreground text-xs">Total Each</p><p className="font-bold text-emerald-600">${fmt(result.perPersonTotal)}</p></div>
                            </div>
                          </div>
                        )}
                        <button onClick={copyResult} className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition-colors">
                          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Result</>}
                        </button>
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              A {result.pct}% tip on ${fmt(parseFloat(bill))} is ${fmt(result.tip)}, bringing your total to ${fmt(result.total)}.
                              {parseInt(people) > 1 ? ` Split ${people} ways, each person pays $${fmt(result.perPersonTotal)} (including $${fmt(result.perPersonTip)} tip).` : ""}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* HOW TO USE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Tip Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Calculating the right tip quickly — especially when splitting the bill with friends — can be surprisingly tricky. This calculator handles all the mental math instantly, from the tip amount to an exact per-person breakdown.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the bill amount</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Type the pre-tax subtotal from your restaurant bill, delivery receipt, or service invoice. Enter the amount before any taxes or fees — tip is traditionally calculated on the pre-tax bill amount, though some people prefer to tip on the post-tax total (either is fine).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select a tip percentage or enter a custom %</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose from preset tip percentages: 10% (minimal service), 15% (standard), 18% (good service), 20% (great service), 25% (exceptional). Or click "Custom" to enter any percentage you prefer — useful for rounding to a specific dollar amount or for service industries with different tipping norms.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set the number of people splitting the bill</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter the number of people sharing the check. The calculator instantly shows what each person owes — divided into their share of the bill, their share of the tip, and their total payment. Perfect for restaurant groups, rideshares, or any shared expense.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Tip Percentage Guide</p>
                <div className="space-y-2">
                  {[["10%","Minimal / poor service — still shows appreciation"],["15%","Standard service — the historical US baseline"],["18%","Good service — now considered the new minimum"],["20%","Excellent service — the modern default for most diners"],["25%+","Exceptional service or a favourite server/venue"]].map(([k,v])=>(
                    <div key={k} className="flex items-center gap-3"><span className="text-amber-500 font-bold text-xs w-12 flex-shrink-0">{k}</span><code className="px-2 py-1 bg-background rounded text-xs font-mono flex-1">{v}</code></div>
                  ))}
                </div>
              </div>
            </section>

            {/* RESULT INTERPRETATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Tipping Norms</h2>
              <p className="text-muted-foreground text-sm mb-6">Context for different service types and situations:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Restaurant (Sit-Down) — 18–22%</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Full-service restaurant tipping in the US has risen from 15% to 18–20% as the new baseline. Servers typically earn below minimum wage ($2.13/hr tipped minimum wage in many states) and rely on tips as their primary income. Tip is calculated on the food and drink subtotal, before tax.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Delivery — 15–20% (minimum $3–5)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Delivery driver tips are typically 15–20% of the order total, with a minimum of $3–5 for small orders regardless of percentage. For large distances or bad weather, add extra. Many platforms prompt for a tip before delivery, which can be adjusted after — 15–20% post-delivery is fair.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Hair / Beauty Services — 15–25%</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Tipping at salons, barbershops, and spas is standard at 15–20% for good service, 25% for exceptional. If the owner cuts your hair, tipping is still customary in most US markets (unlike some European markets where salon owners are not tipped). Total service cost is the base for calculating the tip.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Counter Service / Coffee — $1–2 per item or 10–15%</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Counter-service tipping (coffee shops, fast casual, takeout) is optional. $1–2 per drink or 10–15% of a larger order is thoughtful for regular customers or complex orders. The proliferation of tip prompts on tablets for counter service is relatively new — tip at your discretion; no social obligation exists for pure takeout counter orders.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Tip Calculation Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Bill</th><th className="text-left px-4 py-3 font-bold text-foreground">Tip %</th><th className="text-left px-4 py-3 font-bold text-foreground">Tip Amt</th><th className="text-left px-4 py-3 font-bold text-foreground">Total</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Per Person (4)</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[["$45.00","15%","$6.75","$51.75","$12.94"],["$89.50","18%","$16.11","$105.61","$26.40"],["$120.00","20%","$24.00","$144.00","$36.00"],["$35.75","25%","$8.94","$44.69","$11.17"],["$200.00","10%","$20.00","$220.00","$55.00"]].map(([b,p,t,tot,pp])=>(
                      <tr key={b+p} className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">{b}</td><td className="px-4 py-3 font-bold text-amber-600">{p}</td><td className="px-4 py-3 font-mono text-muted-foreground">{t}</td><td className="px-4 py-3 font-bold text-emerald-600">{tot}</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{pp}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">The "double the tax" shortcut:</strong> A quick mental tip technique is to double your state's sales tax. For example, if you're in a state with 8% sales tax, doubling the tax amount (8% × 2 = 16%) gets you close to a 16% tip — fast, without a calculator. This gives you a quick estimate, though using this calculator gives the exact amount for any percentage instantly.</p>
                <p><strong className="text-foreground">Splitting with unequal orders:</strong> If people ordered very different amounts, a strictly equal split may feel unfair. In that case, note what each person ordered, calculate individual totals, and then split the shared tip equally. For most casual dining, however, an equal per-person split is standard and simplifies the checkout process.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"This is the most useful tool at a restaurant table. Set the bill, tap 20%, enter 4 people — done. No debate, no mental math, we just each put in what it says. Bookmarked."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* WHY CHOOSE THIS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Tip Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Per-person breakdown includes both tip and bill share.</strong> Most tip calculators show the tip amount and total bill. This calculator also splits the full result — bill share, tip share, and total per person — eliminating secondary mental math when dividing costs at the table.</p>
                <p><strong className="text-foreground">Five preset percentages cover all common tipping scenarios.</strong> The 10%/15%/18%/20%/25% presets were selected to match current US tipping conventions: from the historical 15% minimum to the modern 20% standard to excellent-service 25%. One tap selects the appropriate rate without typing.</p>
                <p><strong className="text-foreground">Custom percentage for any situation.</strong> Non-standard tipping scenarios — an extra-generous 30% tip, a small 13% to hit a round total, or a precisely calculated amount — are handled by the custom input. This is useful for international travel, business expense rounding, or personal tip preferences.</p>
                <p><strong className="text-foreground">Works offline — no app download needed.</strong> This tool runs entirely in your browser and works even with a slow or no internet connection after first load. No app download, no account creation, no permission requests — just a fast, private tip calculator you can access from any browser.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> Tipping conventions vary significantly by country. In the US and Canada, tips of 15–20% are expected at full-service restaurants. In Japan, tipping is considered rude. In Europe, a small rounding tip is appreciated but not required. Research local customs when traveling internationally.</p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Should I tip on the pre-tax or post-tax bill amount?" a="Traditionally, tips are calculated on the pre-tax subtotal — the cost of the food and drinks before tax is added. However, tipping on the post-tax total (which is slightly higher) is also widely accepted and simplifies the calculation. For a $50 meal with 8% tax, the difference between tipping on $50 vs $54 is about $0.80 at 20% — a minor difference that won't matter practically." />
                <FaqItem q="What is the minimum tip for a restaurant in the US?" a="While there is no legal minimum tip, industry standard and social convention in the US places the practical minimum at 15% for adequate service. Many servers earn $2.13/hour or less in tipped minimum wage and rely on tips as primary income. For service that was genuinely poor due to server error (not kitchen delays), 10–15% is acceptable — consider speaking with management for serious issues." />
                <FaqItem q="How do I calculate a 20% tip mentally?" a="The easiest mental math method for 20%: move the decimal point one place left (divide by 10) to get 10%, then double it. For a $47.50 bill: 10% = $4.75, doubled = $9.50 tip, total = $57.00. For 15%, calculate 10% then add half: $4.75 + $2.38 = $7.13 tip." />
                <FaqItem q="Should I tip on alcohol separately?" a="Most people tip on the entire bill including drinks. Some diners tip a flat $1–2 per alcoholic drink at the bar in addition to or instead of a percentage on drinks. At restaurants where a sommelier or barman provides special service, tipping on the wine separately at 10–15% of the wine cost is thoughtful for premium bottles." />
                <FaqItem q="Do I tip before or after a discount or coupon?" a="Tip on the original pre-discount total, not the discounted amount. If your meal costs $80 and you have a 50% off coupon bringing it to $40, the server still provided $80 worth of service — tipping on $40 would effectively give them a 50% pay cut for the same work. Tip on the undiscounted amount or the amount of service actually rendered." />
              </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Finance &amp; Money Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free calculators for budgeting, saving, and everyday money math — no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share before the bill arrives!</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-amber-500/40 flex-shrink-0" />{label}
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
